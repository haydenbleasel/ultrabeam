'use server';

import { currentUser } from '@repo/auth/server';
import { getServer } from '@repo/backend';
import { database } from '@repo/database';

type GetGameServerResponse =
  | {
      data: Awaited<ReturnType<typeof getServer>>;
    }
  | {
      error: string;
    };

export const getGameServer = async (
  id: string
): Promise<GetGameServerResponse> => {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error('User not found');
    }

    const server = await database.server.findFirst({
      where: { id },
    });

    if (!server) {
      throw new Error('Server not found');
    }

    if (!server.backendId) {
      throw new Error('Backend ID not found');
    }

    const data = await getServer(server.backendId);

    if (!data) {
      throw new Error('Server not found');
    }

    return { data };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return { error: message };
  }
};
