'use server';

import { database } from '@/lib/database';
import { lightsail } from '@/lib/lightsail';
import { DeleteInstanceCommand } from '@aws-sdk/client-lightsail';
import { DeleteKeyPairCommand } from '@aws-sdk/client-lightsail';

type DeleteGameServerResponse =
  | {
      message: string;
    }
  | {
      error: string;
    };

export const deleteGameServer = async (
  id: string
): Promise<DeleteGameServerResponse> => {
  try {
    const server = await database.server.findUnique({
      where: { id },
    });

    if (!server) {
      throw new Error('Server not found');
    }

    if (!server.backendId || !server.keyPairName || !server.diskName) {
      throw new Error('Server is missing required fields');
    }

    console.log('Deleting key pair...');
    await lightsail.send(
      new DeleteKeyPairCommand({
        keyPairName: server.keyPairName,
      })
    );

    console.log('Deleting instance...');
    await lightsail.send(
      new DeleteInstanceCommand({
        instanceName: server.backendId,
        forceDeleteAddOns: true,
      })
    );

    await database.server.delete({
      where: { id },
    });

    return { message: 'Server deleted' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return { error: message };
  }
};
