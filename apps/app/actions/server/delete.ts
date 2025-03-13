'use server';

import { deleteServer } from '@repo/backend';
import { database } from '@repo/database';

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
    const server = await database.server.findUnique({
      where: { id },
    });

    if (!server) {
      throw new Error('Server not found');
    }

    await deleteServer(server.backendId, server.keyPairName);

    await database.server.delete({
      where: { id },
    });

    return { message: 'Server deleted' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return { error: message };
  }
};
