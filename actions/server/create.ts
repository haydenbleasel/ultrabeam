'use server';

import { games } from '@/games';
import { database } from '@/lib/database';
import { env } from '@/lib/env';
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
} from '@aws-sdk/client-lightsail';
import { SSMClient, SendCommandCommand } from '@aws-sdk/client-ssm';
import { currentUser } from '@clerk/nextjs/server';
import { waitUntil } from '@vercel/functions';
import { nanoid } from 'nanoid';

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
    const server = await database.server.create({
      data: {
        name,
        game,
        ownerId: user.id,
        serverName,
        keyPairName,
        diskName,
      },
    });

    const promise = async () => {
      // Create a key pair
      const createKeyPairResponse = await lightsail.send(
        new CreateKeyPairCommand({ keyPairName })
      );

      if (!createKeyPairResponse.publicKeyBase64) {
        throw new Error('Failed to create key pair: no public key');
      }

      // Create the instance
      const createInstanceResponse = await lightsail.send(
        new CreateInstancesCommand({
          instanceNames: [serverName],
          availabilityZone: `${region}a`,
          blueprintId: 'ubuntu_22_04',
          bundleId: size,
          userData: [
            sshInitScript(createKeyPairResponse.publicKeyBase64),
            bootstrapScript,
          ].join('\n'),
          keyPairName,
          ipAddressType: 'ipv4',
          tags: [
            { key: 'user', value: user.id },
            { key: 'ultrabeam', value: 'true' },
            { key: 'game', value: game },
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

      // Wait for the instance to be ready before attaching the disk
      await waitForInstanceStatus(serverName, 'running');

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

      // Get the new instance
      const newInstance = createInstanceResponse.operations?.at(0);

      if (!newInstance) {
        throw new Error("Couldn't retrieve new instance");
      }

      // Create a block storage disk
      await lightsail.send(
        new CreateDiskCommand({
          diskName,
          availabilityZone: newInstance.location?.availabilityZone,
          sizeInGb: 20,
        })
      );

      // Wait for the disk to be ready
      await waitForDiskStatus(diskName, 'available');

      // Attach the disk to the instance
      await lightsail.send(
        new AttachDiskCommand({
          diskName,
          instanceName: serverName,
          diskPath,
        })
      );

      // Wait for the disk to be attached
      await waitForDiskStatus(diskName, 'in-use');

      const backendId = newInstance.resourceName;
      const privateKey = createKeyPairResponse.privateKeyBase64;

      if (!backendId || !privateKey) {
        await database.server.delete({
          where: {
            id: server.id,
          },
        });

        throw new Error('Failed to create server');
      }

      // Get the game script
      const installModule = await import(`../../games/${game}/install`);
      const installScript = installModule.default;

      if (typeof installScript !== 'function') {
        throw new Error(`Invalid install script for game: ${game}`);
      }

      // Mount the disk and run the scripts
      await new SSMClient({
        region: newInstance.location?.regionName,
        credentials: {
          accessKeyId: env.AWS_ACCESS_KEY,
          secretAccessKey: env.AWS_SECRET_KEY,
        },
      }).send(
        new SendCommandCommand({
          InstanceIds: [backendId],
          DocumentName: 'AWS-RunShellScript',
          Parameters: {
            commands: [
              mountVolumeScript(diskPath),
              installScript(serverName, password, 'America/New_York'),
            ],
          },
        })
      );

      await database.server.update({
        where: {
          id: server.id,
        },
        data: {
          backendId,
          privateKey,
        },
      });

      log.info(`Server created: ${server.id}`);
    };

    waitUntil(promise());

    return { id: server.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return { error: message };
  }
};
