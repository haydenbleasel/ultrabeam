'use server';

import { dots } from '@/lib/digitalocean';
import { database } from '@repo/database';

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
    const server = await database.server.findUnique({
      where: { id },
    });

    if (!server) {
      throw new Error('Server not found');
    }

    await dots.droplet.deleteDroplet({
      droplet_id: server.dropletId,
    });

    await database.server.delete({
      where: { id },
    });

    return { message: 'Server deleted' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return { error: message };
  }
};
