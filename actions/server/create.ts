'use server';

import { games } from '@/games';
import { lightsail } from '@/lib/lightsail';
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
  type DiskState,
  GetDiskCommand,
  GetInstanceCommand,
  type InstanceState,
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

const waitForInstanceStatus = (
  instanceName: string,
  status: InstanceState['name']
) => {
  console.log(`Waiting for instance ${instanceName} to be ready...`);

  return new Promise<void>((resolve, reject) => {
    const checkInstanceState = async () => {
      const instanceResponse = await lightsail.send(
        new GetInstanceCommand({
          instanceName,
        })
      );

      const state = instanceResponse.instance?.state?.name;

      if (state === 'error') {
        reject('Something went wrong with the instance.');
      } else if (state === status) {
        console.log(`Instance ${instanceName} is now ${status}.`);
        resolve();
      } else {
        console.log(`Instance state: ${state}. Waiting...`);
        // Wait for 10 seconds before checking again
        setTimeout(checkInstanceState, 10000);
      }
    };

    checkInstanceState();
  });
};

const waitForDiskStatus = (diskName: string, status: DiskState) => {
  console.log(`Waiting for disk ${diskName} to be attached...`);

  return new Promise<void>((resolve, reject) => {
    const checkDiskStatus = async () => {
      const response = await lightsail.send(
        new GetDiskCommand({
          diskName,
        })
      );

      const state = response.disk?.state;

      if (state === 'error') {
        reject('Something went wrong with the disk.');
      } else if (state === status) {
        console.log(`Disk ${diskName} is now ${status}.`);
        resolve();
      } else {
        console.log(`Disk state: ${state}. Waiting...`);
        setTimeout(checkDiskStatus, 10000);
      }
    };

    checkDiskStatus();
  });
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

    const id = nanoid();
    const suffix = `ultrabeam-${game}-${id}`;
    const serverName = `server-${suffix}`;
    const keyPairName = `key-${suffix}`;
    const diskName = `disk-${suffix}`;
    const diskPath = '/dev/xvdf';

    let privateKey = user.privateMetadata.privateKey as string | undefined;
    let publicKey = user.privateMetadata.publicKey as string | undefined;

    if (!privateKey) {
      const clerk = await clerkClient();

      // Create a key pair
      const createKeyPairResponse = await lightsail.send(
        new CreateKeyPairCommand({ keyPairName })
      );

      if (!createKeyPairResponse.publicKeyBase64) {
        throw new Error('Failed to create key pair: no public key');
      }

      if (!createKeyPairResponse.privateKeyBase64) {
        throw new Error('Failed to create key pair: no private key');
      }

      privateKey = createKeyPairResponse.privateKeyBase64;
      publicKey = createKeyPairResponse.publicKeyBase64;

      await clerk.users.updateUserMetadata(user.id, {
        privateMetadata: {
          privateKey,
          publicKey,
        },
      });
    }

    // Create the instance
    const instance = await lightsail.send(
      new CreateInstancesCommand({
        instanceNames: [serverName],
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
      await waitForInstanceStatus(serverName, 'running');

      // Update the instance status
      await updateInstanceStatus(instanceName, 'instanceAvailable');

      // Open the required ports
      for (const port of gameInfo.ports) {
        await lightsail.send(
          new OpenInstancePublicPortsCommand({
            instanceName: serverName,
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
        new GetInstanceCommand({ instanceName: serverName })
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
      await lightsail.send(
        new CreateDiskCommand({
          diskName,
          availabilityZone: newInstance.location?.availabilityZone,
          sizeInGb: 20,
        })
      );

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
          instanceName: serverName,
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
                `${installScript(serverName, password, 'America/New_York')}\n`
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
