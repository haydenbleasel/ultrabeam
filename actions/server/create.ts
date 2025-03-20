'use server';

import type { games } from '@/games';
import { database } from '@/lib/database';
import { env } from '@/lib/env';
import { lightsail } from '@/lib/lightsail';
import { log } from '@/lib/observability/log';
import {
  bootstrapScript,
  getCloudInitScript,
  mountVolumeScript,
  sshInitScript,
} from '@/lib/scripts';
import {
  AttachDiskCommand,
  CreateDiskCommand,
  CreateInstancesCommand,
  CreateKeyPairCommand,
  GetDiskCommand,
  GetInstanceCommand,
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

const waitForInstanceReady = (instanceName: string) => {
  console.log(`Waiting for instance ${instanceName} to be ready...`);

  return new Promise<void>((resolve) => {
    const checkInstanceState = async () => {
      const instanceResponse = await lightsail.send(
        new GetInstanceCommand({
          instanceName,
        })
      );

      const state = instanceResponse.instance?.state?.name;

      if (state === 'running') {
        console.log(`Instance ${instanceName} is now ready.`);
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

const waitForDiskAttached = (diskName: string) => {
  console.log(`Waiting for disk ${diskName} to be attached...`);

  return new Promise<void>((resolve) => {
    const checkDiskStatus = async () => {
      const response = await lightsail.send(
        new GetDiskCommand({
          diskName,
        })
      );

      if (response.disk?.state === 'in-use') {
        console.log(`Disk ${diskName} is now attached.`);
        resolve();
      } else {
        console.log(`Disk state: ${response.disk?.state}. Waiting...`);
        setTimeout(checkDiskStatus, 10000);
      }
    };

    checkDiskStatus();
  });
};

export const createServer = async (
  name: string,
  game: (typeof games)[number]['id'],
  region: string,
  size: string
): Promise<CreateServerResponse> => {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error('User not found');
    }

    const id = nanoid();
    const suffix = `ultrabeam-${game}-${id}`;
    const serverName = `server-${suffix}`;
    const keyPairName = `key-${suffix}`;
    const diskName = `disk-${suffix}`;
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
      const cloudInitScript = await getCloudInitScript(game);

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
          userData: [sshInitScript(createKeyPairResponse.publicKeyBase64)].join(
            '\n'
          ),
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

      // Create a block storage disk
      await lightsail.send(
        new CreateDiskCommand({
          diskName,
          availabilityZone: `${region}a`,
          sizeInGb: 20,
        })
      );

      // Wait for the instance to be ready before attaching the disk
      await waitForInstanceReady(serverName);

      // Attach the disk to the instance
      await lightsail.send(
        new AttachDiskCommand({
          diskName,
          instanceName: serverName,
          diskPath: '/dev/xvdf',
        })
      );

      // Wait for the disk to be attached
      await waitForDiskAttached(diskName);

      // Mount the disk
      const ssm = new SSMClient({
        region,
        credentials: {
          accessKeyId: env.AWS_ACCESS_KEY,
          secretAccessKey: env.AWS_SECRET_KEY,
        },
      });

      await ssm.send(
        new SendCommandCommand({
          InstanceIds: [serverName],
          DocumentName: 'AWS-RunShellScript',
          Parameters: {
            commands: [bootstrapScript, mountVolumeScript, cloudInitScript],
          },
        })
      );

      const backendId = createInstanceResponse.operations?.[0]?.resourceName;

      if (!backendId) {
        throw new Error('Failed to create server: no backend id');
      }

      const privateKey = createKeyPairResponse.privateKeyBase64;

      if (!backendId || !privateKey) {
        await database.server.delete({
          where: {
            id: server.id,
          },
        });

        throw new Error('Failed to create server');
      }

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
