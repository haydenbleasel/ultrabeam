'use server';

import type { Server } from '@/generated/client';
import { database } from '@/lib/database';
import { currentUser } from '@clerk/nextjs/server';

type GetGameServerResponse =
  | {
      data: Server;
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

    return { data: server };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return { error: message };
  }
};
