'use server';

import { dots } from '@/lib/digitalocean';

export const getServer = async (
  id: number
): Promise<{ data: object } | { error: string }> => {
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
