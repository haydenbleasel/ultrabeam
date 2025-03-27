'use server';

import { lightsail } from '@/lib/lightsail';
import { RebootInstanceCommand } from '@aws-sdk/client-lightsail';

type RebootServerResponse =
  | {
      success: true;
    }
  | {
      error: string;
    };

export const rebootServer = async (
  instanceName: string
): Promise<RebootServerResponse> => {
  try {
    await lightsail.send(new RebootInstanceCommand({ instanceName }));

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return { error: message };
  }
};
