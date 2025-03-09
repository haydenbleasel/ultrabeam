'use server';

import { dots } from '@/lib/digitalocean';
import { database } from '@repo/database';
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
    const server = await database.server.findUnique({
      where: { id },
    });

    if (!server) {
      throw new Error('Server not found');
    }

    const droplet = await dots.droplet.getDroplet({
      droplet_id: server.dropletId,
    });

    const conn = new Client();

    const logs = await new Promise<string>((resolve, reject) => {
      conn.on('ready', () => {
        conn.exec(`tail -n 50 /var/log/syslog`, (err, stream) => {
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

      console.log(server.privateKey);

      conn.connect({
        host: droplet.data.droplet.networks.v4[0].ip_address,
        port: 22,
        username: 'root',
        privateKey: Buffer.from(server.privateKey.trim()),
      });
    });

    return { data: logs };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return { error: message };
  }
};
