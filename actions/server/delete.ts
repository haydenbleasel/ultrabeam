'use server';
import { lightsail } from '@/lib/lightsail';
import {
  DeleteDiskCommand,
  DeleteInstanceCommand,
  GetDiskCommand,
  GetInstanceCommand,
} from '@aws-sdk/client-lightsail';

type DeleteGameServerResponse =
  | {
      message: string;
    }
  | {
      error: string;
    };

export const deleteGameServer = async (
  id: string
): Promise<DeleteGameServerResponse> => {
  try {
    const { instance } = await lightsail.send(
      new GetInstanceCommand({
        instanceName: id,
      })
    );

    if (!instance) {
      throw new Error('Instance not found');
    }

    const { disk } = await lightsail.send(
      new GetDiskCommand({
        diskName: id,
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
