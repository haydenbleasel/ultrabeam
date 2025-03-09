'use server';

import { dots } from '@/lib/digitalocean';

type GetServerResponse =
  | {
      data: object;
    }
  | {
      error: string;
    };

export const getServer = async (id: number): Promise<GetServerResponse> => {
  try {
    const response = await dots.droplet.getDroplet({
      droplet_id: id,
    });

    return { data: response.data.droplet };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return { error: message };
  }
};
