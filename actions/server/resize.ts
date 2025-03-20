'use server';

import { database } from '@/lib/database';
import { lightsail } from '@/lib/lightsail';
import { sshInitScript } from '@/lib/scripts';
import {
  CreateInstanceSnapshotCommand,
  CreateInstancesCommand,
  DeleteInstanceCommand,
  GetInstanceCommand,
  StopInstanceCommand,
} from '@aws-sdk/client-lightsail';

type ResizeServerResponse =
  | {
      success: true;
    }
  | {
      error: string;
    };

export const resizeServer = async (
  instanceName: string,
  size: string
): Promise<ResizeServerResponse> => {
  try {
    console.log(`Stopping instance: ${instanceName}...`);
    await lightsail.send(new StopInstanceCommand({ instanceName }));

    const databaseEntry = await database.server.findFirst({
      where: {
        backendId: instanceName,
      },
    });

    if (!databaseEntry) {
      throw new Error('No database entry found.');
    }

    console.log('Taking a snapshot of the instance...');
    await lightsail.send(
      new CreateInstanceSnapshotCommand({
        instanceName,
        instanceSnapshotName: `${instanceName}-${Date.now()}`,
      })
    );

    console.log('Get the old instance...');
    const { instance: oldInstance } = await lightsail.send(
      new GetInstanceCommand({
        instanceName,
      })
    );

    if (!oldInstance) {
      throw new Error('Failed to resize server: no old instance');
    }

    if (!oldInstance.name) {
      throw new Error('Failed to resize server: no old instance name');
    }

    if (!databaseEntry.privateKey) {
      throw new Error('No private key found in database.');
    }

    console.log('Creating a new instance with the new size...');

    // Create the instance
    const createInstanceResponse = await lightsail.send(
      new CreateInstancesCommand({
        instanceNames: [oldInstance.name],
        availabilityZone: oldInstance.location?.availabilityZone,
        blueprintId: oldInstance.blueprintId,
        bundleId: size,
        userData: [sshInitScript(databaseEntry.privateKey)].join('\n'),
        keyPairName: databaseEntry.keyPairName,
        ipAddressType: oldInstance.ipAddressType,
        tags: oldInstance.tags,
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

    console.log('Deleting the old instance...');
    await lightsail.send(
      new DeleteInstanceCommand({
        instanceName: instanceName,
      })
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return { error: message };
  }
};
