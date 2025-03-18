'use server';

import fs from 'node:fs/promises';
import path from 'node:path';
import type { games } from '@/games';
import { createServer } from '@/lib/backend';
import { database } from '@/lib/database';
import { log } from '@/lib/observability/log';
import { currentUser } from '@clerk/nextjs/server';
import { waitUntil } from '@vercel/functions';
import { nanoid } from 'nanoid';

type CreateGameServerResponse =
  | {
      id: string;
    }
  | {
      error: string;
    };

const getCloudInitScript = async (game: (typeof games)[number]['id']) => {
  const cloudInitPath = path.join(process.cwd(), 'games', game, 'install.sh');

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

      const { backendId, privateKey } = await createServer({
        game,
        region,
        size,
        cloudInitScript,
        serverName,
        keyPairName,
        diskName,
        userId: user.id,
      });

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
          backendId: `${backendId}`,
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
