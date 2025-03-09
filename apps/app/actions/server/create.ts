'use server';

import fs from 'node:fs';
import path from 'node:path';
import { dots } from '@/lib/digitalocean';
import { currentUser } from '@repo/auth/server';
import { database } from '@repo/database';
import { log } from '@repo/observability/log';
import NodeRSA from 'node-rsa';

type Game = 'minecraft' | 'palworld';

type CreateServerResponse =
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

export const createServer = async (
  game: Game,
  region: string,
  size: string
): Promise<CreateServerResponse> => {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error('User not found');
    }

    const cloudInitScript = getCloudInitScript(game);

    const key = new NodeRSA({ b: 4096 });
    const publicKey = key.exportKey('openssh-public');
    const privateKey = key.exportKey('openssh-private');

    const sshKeyResponse = await dots.sshKey.createSshKey({
      name: `ultrabeam-${game}-${Date.now()}`,
      public_key: publicKey.trim(),
    });

    const sshKeyId = sshKeyResponse.data.ssh_key.id;

    const response = await dots.droplet.createDroplet({
      name: `ultrabeam-${game}-${Date.now()}`,
      region,
      size,
      image: 'ubuntu-22-04-x64',
      user_data: cloudInitScript,
      ssh_keys: [sshKeyId],
      backups: true,
      monitoring: true,
      tags: ['ultrabeam', game],
    });

    const server = await database.server.create({
      data: {
        dropletId: response.data.droplet.id,
        game,
        ownerId: user.id,
        privateKey,
        sshKeyId,
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
