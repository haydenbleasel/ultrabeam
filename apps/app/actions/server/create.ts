'use server';

import fs from 'node:fs';
import path from 'node:path';
import { dots } from '@/lib/digitalocean';
import { currentUser } from '@repo/auth/server';
import { database } from '@repo/database';

type Game = 'minecraft' | 'palworld';

export const createServer = async (
  game: Game,
  region: string,
  size: string
): Promise<{ data: object } | { error: string }> => {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error('User not found');
    }

    const cloudInitPath = path.join(process.cwd(), 'games', `${game}.yml`);

    // Check if the script exists
    if (!fs.existsSync(cloudInitPath)) {
      throw new Error(`No Cloud-Init script found for game: ${game}`);
    }

    const cloudInitScript = fs.readFileSync(cloudInitPath, 'utf-8');

    const response = await dots.droplet.createDroplet({
      name: `ultrabeam-${game}-${Date.now()}`,
      region,
      size,
      image: 'ubuntu-22-04-x64',
      user_data: cloudInitScript,
      ssh_keys: [],
      backups: true,
      monitoring: true,
      tags: ['ultrabeam', game],
    });

    await database.server.create({
      data: {
        dropletId: response.data.droplet.id,
        game,
        ownerId: user.id,
      },
    });

    return { data: response.data.droplet };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return { error: message };
  }
};
