'use server';
import type { Instance } from '@aws-sdk/client-lightsail';
import { currentUser } from '@clerk/nextjs/server';
import SFTPClient from 'ssh2-sftp-client';

type UploadFileResponse =
  | {
      data: Instance;
    }
  | {
      error: string;
    };

export const uploadFile = async (
  ip: string,
  path: string,
  file: File
): Promise<UploadFileResponse> => {
  try {
    const sftp = new SFTPClient();
    const user = await currentUser();

    if (!user || !user.privateMetadata.privateKey) {
      throw new Error('User not found');
    }

    await sftp.connect({
      host: ip,
      port: 22,
      username: 'ubuntu',
      privateKey: user.privateMetadata.privateKey as string,
      readyTimeout: 10000,
    });

    const flattenedPath = `/${path}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await sftp.put(buffer, flattenedPath);

    await sftp.end();

    return { data: 'success' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return { error: message };
  }
};
