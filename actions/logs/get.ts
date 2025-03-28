'use server';

import { getServer } from '@/lib/backend';
import { runSSHCommand } from '@/lib/lightsail';
import { currentUser } from '@clerk/nextjs/server';

type GetServerResponse =
  | {
      data: string;
    }
  | {
      error: string;
    };

export const getLogs = async (id: string): Promise<GetServerResponse> => {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error('User not found');
    }

    const instance = await getServer(id);

    if (!instance) {
      throw new Error('Instance not found');
    }

    if (!instance.name) {
      throw new Error('Instance name not found');
    }

    if (!instance.publicIpAddress) {
      throw new Error('Instance public IP address not found');
    }

    if (typeof user.privateMetadata.privateKey !== 'string') {
      throw new Error('Private key not found');
    }

    const logs = await runSSHCommand(
      instance.publicIpAddress,
      user.privateMetadata.privateKey,
      'cd /mnt/gamedata && docker compose logs --tail 500'
    );

    // Remove all instances of "gamedata_valheim_1  | " from the logs
    const cleanedLogs = logs.replace(/gamedata_valheim_1\s+\| /g, '');
    return { data: cleanedLogs };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return { error: message };
  }
};
