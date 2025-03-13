'use server';

import fs from 'node:fs/promises';
import path from 'node:path';
import type { games } from '@/games';
import { currentUser } from '@repo/auth/server';
import { createServer } from '@repo/backend';
import { database } from '@repo/database';
import { log } from '@repo/observability/log';

type CreateGameServerResponse =
  | {
      id: string;
    }
  | {
      error: string;
    };

const getCloudInitScript = async (game: (typeof games)[number]['id']) => {
  const cloudInitPath = path.join(process.cwd(), 'games', game, 'config.yml');

  if (!(await fs.stat(cloudInitPath).catch(() => false))) {
    throw new Error(`No Cloud-Init script found for game: ${game}`);
  }

  return await fs.readFile(cloudInitPath, 'utf-8');
};

export const createGameServer = async (
  name: string,
  game: (typeof games)[number]['id'],
  region: string,
  size: string
): Promise<CreateGameServerResponse> => {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error('User not found');
    }

    const cloudInitScript = await getCloudInitScript(game);
    const { backendId, privateKey } = await createServer({
      game,
      region,
      size,
      cloudInitScript,
    });

    if (!backendId || !privateKey) {
      throw new Error('Failed to create server');
    }

    const server = await database.server.create({
      data: {
        name,
        backendId: `${backendId}`,
        game,
        ownerId: user.id,
        privateKey,
      },
    });

    log.info(`Server created: ${server.id}`);

    return { id: server.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return { error: message };
  }
};
