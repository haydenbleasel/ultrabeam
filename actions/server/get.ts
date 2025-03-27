'use server';

import { lightsail } from '@/lib/lightsail';
import { GetInstanceCommand, type Instance } from '@aws-sdk/client-lightsail';

type GetServerResponse =
  | {
      data: Instance;
    }
  | {
      error: string;
    };

export const getServer = async (id: string): Promise<GetServerResponse> => {
  try {
    const { instance } = await lightsail.send(
      new GetInstanceCommand({
        instanceName: id,
      })
    );

    if (!instance) {
      throw new Error('Server not found');
    }

    return { data: instance };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return { error: message };
  }
};
