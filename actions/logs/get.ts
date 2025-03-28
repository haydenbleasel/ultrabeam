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

export const getLogs = async (
  id: string,
  command: string
): Promise<GetServerResponse> => {
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
      command
    );

    // Remove container prefixes from logs (e.g., "gamedata_valheim_1  | ", "gamedata_minecraft_1  | ", etc.)
    const cleanedLogs = logs.replace(/gamedata_\w+_\d+\s+\| /g, '');

    // Remove session start and deactivation lines
    const filteredLogs = cleanedLogs
      .split('\n')
      .filter(
        (line) =>
          !line.includes('Started Session') &&
          !line.includes('session-') &&
          !line.includes('.scope: Deactivated successfully')
      )
      .join('\n');

    return { data: filteredLogs };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return { error: message };
  }
};
