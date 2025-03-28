'use server';

import { lightsail } from '@/lib/lightsail';
import {
  DeleteDiskCommand,
  DeleteInstanceCommand,
  GetDiskCommand,
  GetInstanceCommand,
} from '@aws-sdk/client-lightsail';

type DeleteServerResponse =
  | {
      message: string;
    }
  | {
      error: string;
    };

export const deleteServer = async (
  id: string
): Promise<DeleteServerResponse> => {
  try {
    const { instance } = await lightsail.send(
      new GetInstanceCommand({
        instanceName: id,
      })
    );

    if (!instance) {
      throw new Error('Instance not found');
    }

    const diskName = instance.hardware?.disks?.find(
      (disk) => disk.path === '/dev/nvme1n1'
    )?.name;

    if (!diskName) {
      throw new Error('Disk name not found');
    }

    const { disk } = await lightsail.send(
      new GetDiskCommand({
        diskName,
      })
    );

    if (!disk) {
      throw new Error('Disk not found');
    }

    await lightsail.send(
      new DeleteInstanceCommand({
        instanceName: id,
        forceDeleteAddOns: true,
      })
    );

    await lightsail.send(
      new DeleteDiskCommand({
        diskName: disk.name,
      })
    );

    return { message: 'Server deleted' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return { error: message };
  }
};
