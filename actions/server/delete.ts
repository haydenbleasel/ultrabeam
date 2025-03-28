'use server';

import {
  lightsail,
  waitForDiskStatus,
  waitForInstanceStatus,
} from '@/lib/lightsail';
import {
  DeleteDiskCommand,
  DeleteInstanceCommand,
  DetachDiskCommand,
  GetInstanceCommand,
  StopInstanceCommand,
} from '@aws-sdk/client-lightsail';

type DeleteServerResponse =
  | {
      message: string;
    }
  | {
      error: string;
    };

export const deleteServer = async (
  instanceName: string
): Promise<DeleteServerResponse> => {
  try {
    const { instance } = await lightsail.send(
      new GetInstanceCommand({
        instanceName,
      })
    );

    if (!instance) {
      throw new Error('Instance not found');
    }

    const diskName = instance.hardware?.disks?.find(
      (disk) => !disk.isSystemDisk
    )?.name;

    if (!diskName) {
      throw new Error('Disk name not found');
    }

    // Stop the instance
    await lightsail.send(
      new StopInstanceCommand({
        instanceName,
      })
    );

    // Wait for the instance to be stopped
    await waitForInstanceStatus(instanceName, 'stopped');

    // Detach the disk
    await lightsail.send(
      new DetachDiskCommand({
        diskName,
      })
    );

    // Wait for the disk to be detached
    await waitForDiskStatus(diskName, 'available');

    // Delete the instance
    await lightsail.send(
      new DeleteInstanceCommand({
        instanceName,
        forceDeleteAddOns: true,
      })
    );

    // Delete the disk
    await lightsail.send(
      new DeleteDiskCommand({
        diskName,
      })
    );

    return { message: 'Server deleted' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return { error: message };
  }
};
