'use server';

import { generateKeyPairSync } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { dots } from '@/lib/digitalocean';
import { currentUser } from '@repo/auth/server';
import { database } from '@repo/database';

type Game = 'minecraft' | 'palworld';

type CreateServerResponse =
  | {
      data: object;
    }
  | {
      error: string;
    };

const createSSHKeyPair = () =>
  generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
  });

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

    const { publicKey, privateKey } = await createSSHKeyPair();
    const cloudInitScript = await getCloudInitScript(game);

    const response = await dots.droplet.createDroplet({
      name: `ultrabeam-${game}-${Date.now()}`,
      region,
      size,
      image: 'ubuntu-22-04-x64',
      user_data: cloudInitScript,
      ssh_keys: [publicKey],
      backups: true,
      monitoring: true,
      tags: ['ultrabeam', game],
    });

    await database.server.create({
      data: {
        dropletId: response.data.droplet.id,
        game,
        ownerId: user.id,
        privateKey,
      },
    });

    return { data: response.data.droplet };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return { error: message };
  }
};
