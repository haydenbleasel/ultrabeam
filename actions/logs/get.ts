'use server';

import { getServer } from '@/lib/backend';
import { currentUser } from '@clerk/nextjs/server';
import { Client } from 'ssh2';

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

    const privateKey = instance.tags?.find(
      (tag) => tag.key === 'private_key'
    )?.value;

    if (!privateKey) {
      throw new Error('Private key not found');
    }

    const conn = new Client();

    const logs = await new Promise<string>((resolve, reject) => {
      conn.on('ready', () => {
        conn.exec('tail -n 50 /var/log/syslog', (err, stream) => {
          if (err) {
            reject(new Error('Failed to execute command'));
            return;
          }

          let logs = '';
          stream.on('data', (data: Buffer) => {
            logs += data.toString();
          });

          stream.on('close', () => {
            conn.end();
            resolve(logs);
          });
        });
      });

      conn.on('error', reject);

      conn.connect({
        host: instance.publicIpAddress?.at(0),
        port: 22,
        username: 'root',
        privateKey: Buffer.from(privateKey.trim()),
      });
    });

    return { data: logs };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return { error: message };
  }
};
