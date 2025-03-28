'use server';

import { lightsail } from '@/lib/lightsail';
import { GetInstanceCommand } from '@aws-sdk/client-lightsail';
import { currentUser } from '@clerk/nextjs/server';
import SFTPClient from 'ssh2-sftp-client';

type UploadFileResponse =
  | {
      success: boolean;
    }
  | {
      error: string;
    };

export const uploadFile = async (
  instanceName: string,
  path: string,
  file: File
): Promise<UploadFileResponse> => {
  try {
    const sftp = new SFTPClient();
    const user = await currentUser();

    if (!user || !user.privateMetadata.privateKey) {
      throw new Error('User not found');
    }

    const server = await lightsail.send(
      new GetInstanceCommand({
        instanceName,
      })
    );

    if (!server.instance) {
      throw new Error('Server not found');
    }

    await sftp.connect({
      host: server.instance.publicIpAddress,
      port: 22,
      username: 'ubuntu',
      privateKey: user.privateMetadata.privateKey as string,
      readyTimeout: 10000,
    });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await sftp.put(buffer, `${path}/${file.name}`);

    await sftp.end();

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return { error: message };
  }
};
