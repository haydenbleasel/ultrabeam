'use server';

import fs from 'node:fs';
import path from 'node:path';
import { currentUser } from '@repo/auth/server';
import { createServer } from '@repo/backend';
import { database } from '@repo/database';
import { log } from '@repo/observability/log';
import NodeRSA from 'node-rsa';

type Game = 'minecraft' | 'palworld';

type CreateGameServerResponse =
  | {
      id: string;
    }
  | {
      error: string;
    };

const getCloudInitScript = (game: Game) => {
  const cloudInitPath = path.join(process.cwd(), 'games', `${game}.yml`);

  if (!fs.existsSync(cloudInitPath)) {
    throw new Error(`No Cloud-Init script found for game: ${game}`);
  }

  return fs.readFileSync(cloudInitPath, 'utf-8');
};

export const createGameServer = async (
  game: Game,
  region: string,
  size: string
): Promise<CreateGameServerResponse> => {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error('User not found');
    }

    const cloudInitScript = getCloudInitScript(game);
    const key = new NodeRSA({ b: 4096 });
    const publicKey = key.exportKey('openssh-public');
    const privateKey = key.exportKey('openssh-private');

    const backendId = await createServer({
      game,
      region,
      size,
      publicKey,
      cloudInitScript,
    });

    const server = await database.server.create({
      data: {
        backendId,
        game,
        ownerId: user.id,
        privateKey,
      },
    });

    log.info(`Server created: ${server.id}`);

    return { id: server.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    console.error(error);

    return { error: message };
  }
};
