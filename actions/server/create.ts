'use server';

import { games } from '@/games';
import {
  lightsail,
  waitForDiskStatus,
  waitForInstanceStatus,
} from '@/lib/lightsail';
import { log } from '@/lib/observability/log';
import {
  bootstrapScript,
  mountVolumeScript,
  sshInitScript,
} from '@/lib/scripts';
import {
  AttachDiskCommand,
  CreateDiskCommand,
  CreateInstancesCommand,
  CreateKeyPairCommand,
  GetInstanceCommand,
  OpenInstancePublicPortsCommand,
  TagResourceCommand,
} from '@aws-sdk/client-lightsail';
import { clerkClient, currentUser } from '@clerk/nextjs/server';
import { waitUntil } from '@vercel/functions';
import { nanoid } from 'nanoid';
import { Client } from 'ssh2';

type CreateServerResponse =
  | {
      id: string;
    }
  | {
      error: string;
    };

const updateInstanceStatus = async (instanceName: string, status: string) => {
  await lightsail.send(
    new TagResourceCommand({
      resourceName: instanceName,
      tags: [{ key: 'status', value: status }],
    })
  );
};

export const createServer = async (
  name: string,
  password: string,
  game: (typeof games)[number]['id'],
  region: string,
  size: string
): Promise<CreateServerResponse> => {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error('User not found');
    }

    const gameInfo = games.find(({ id }) => id === game);

    if (!gameInfo) {
      throw new Error('Game info not found');
    }

    const diskPath = '/dev/nvme1n1';

    let publicKey = user.privateMetadata.publicKey as string | undefined;
    let privateKey = user.privateMetadata.privateKey as string | undefined;
    let keyPairName = user.privateMetadata.keyPairName as string | undefined;

    if (!privateKey || !publicKey || !keyPairName) {
      const clerk = await clerkClient();

      // Create a key pair
      const createKeyPairResponse = await lightsail.send(
        new CreateKeyPairCommand({ keyPairName: `keypair-${user.id}` })
      );

      if (!createKeyPairResponse.publicKeyBase64) {
        throw new Error('Failed to create key pair: no public key');
      }

      if (!createKeyPairResponse.privateKeyBase64) {
        throw new Error('Failed to create key pair: no private key');
      }

      privateKey = createKeyPairResponse.privateKeyBase64;
      publicKey = createKeyPairResponse.publicKeyBase64;
      keyPairName = createKeyPairResponse.keyPair?.name;

      await clerk.users.updateUserMetadata(user.id, {
        privateMetadata: {
          privateKey,
          publicKey,
          keyPairName,
        },
      });
    }

    // Create the instance
    const instance = await lightsail.send(
      new CreateInstancesCommand({
        instanceNames: [nanoid()],
        availabilityZone: `${region}a`,
        blueprintId: 'ubuntu_22_04',
        bundleId: size,
        userData: [sshInitScript(publicKey as string), bootstrapScript].join(
          '\n'
        ),
        keyPairName,
        ipAddressType: 'ipv4',
        tags: [
          { key: 'name', value: name },
          { key: 'password', value: password },
          { key: 'user', value: user.id },
          { key: 'ultrabeam', value: 'true' },
          { key: 'game', value: game },
          { key: 'status', value: 'createdInstance' },
        ],
        addOns: [
          {
            addOnType: 'AutoSnapshot',
            autoSnapshotAddOnRequest: {
              snapshotTimeOfDay: '06:00',
            },
          },
        ],
      })
    );

    const instanceName = instance.operations?.at(0)?.resourceName;

    if (!instanceName) {
      throw new Error('Instance ID not found');
    }

    const promise = async () => {
      // Wait for the instance to be ready before attaching the disk
      await waitForInstanceStatus(instanceName, 'running');

      // Update the instance status
      await updateInstanceStatus(instanceName, 'instanceAvailable');

      // Open the required ports
      for (const port of gameInfo.ports) {
        await lightsail.send(
          new OpenInstancePublicPortsCommand({
            instanceName,
            portInfo: {
              fromPort: port.from,
              toPort: port.to,
              protocol: port.protocol,
            },
          })
        );
      }

      // Update the instance status
      await updateInstanceStatus(instanceName, 'openedPorts');

      // Get the instance IP address
      const { instance: newInstance } = await lightsail.send(
        new GetInstanceCommand({ instanceName })
      );

      if (!newInstance) {
        throw new Error("Couldn't retrieve new instance");
      }

      if (!newInstance.location?.availabilityZone) {
        throw new Error('Availability zone not found');
      }

      if (!newInstance.publicIpAddress) {
        throw new Error('Public IP address not found');
      }

      // Create a block storage disk
      const createDiskResponse = await lightsail.send(
        new CreateDiskCommand({
          diskName: nanoid(),
          availabilityZone: newInstance.location?.availabilityZone,
          sizeInGb: 20,
        })
      );

      const diskName = createDiskResponse.operations?.at(0)?.resourceName;

      if (!diskName) {
        throw new Error('Disk name not found');
      }

      // Update the instance status
      await updateInstanceStatus(instanceName, 'createdDisk');

      // Wait for the disk to be ready
      await waitForDiskStatus(diskName, 'available');

      // Update the instance status
      await updateInstanceStatus(instanceName, 'diskAvailable');

      // Attach the disk to the instance
      await lightsail.send(
        new AttachDiskCommand({
          diskName,
          instanceName,
          diskPath,
        })
      );

      // Update the instance status
      await updateInstanceStatus(instanceName, 'diskAttached');

      // Wait for the disk to be attached
      await waitForDiskStatus(diskName, 'in-use');

      // Update the instance status
      await updateInstanceStatus(instanceName, 'diskInUse');

      // Get the game script
      const installModule = await import(`../../games/${game}/install`);
      const installScript = installModule.default;

      if (typeof installScript !== 'function') {
        throw new Error(`Invalid install script for game: ${game}`);
      }

      const ssh = new Client();

      await new Promise<void>((resolve, reject) => {
        const sshTimeout = setTimeout(
          () => {
            reject(new Error('SSH command timed out'));
            ssh.end();
          },
          5 * 60 * 1000
        ); // 5 minutes

        ssh
          .on('ready', () => {
            console.log('SSH Connection ready');

            ssh.exec('bash -s', (err, stream) => {
              if (err) {
                reject(err);
                return;
              }

              stream
                .on('close', (code: number, signal: string) => {
                  console.log(`Command exited with code ${code}`);
                  clearTimeout(sshTimeout);
                  ssh.end();
                  resolve();
                })
                .on('data', (data: Buffer) => {
                  console.log(`STDOUT: ${data}`);
                })
                .stderr.on('data', (data: Buffer) => {
                  console.error(`STDERR: ${data}`);
                });

              // Combine mount + install scripts here
              stream.write(`${mountVolumeScript(diskPath)}\n`);
              stream.write(
                `${installScript(instanceName, password, 'America/New_York')}\n`
              );
              stream.end();
            });
          })
          .on('error', (err) => {
            reject(err);
          })
          .connect({
            host: newInstance.publicIpAddress,
            username: 'ubuntu',
            privateKey,
            port: 22,
          });
      });

      await updateInstanceStatus(instanceName, 'ready');

      log.info(`Server created: ${instanceName}`);
    };

    waitUntil(promise());

    return { id: instanceName };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return { error: message };
  }
};
