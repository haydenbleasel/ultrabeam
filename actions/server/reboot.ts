'use server';
import { lightsail } from '@/lib/lightsail';
import { RebootInstanceCommand } from '@aws-sdk/client-lightsail';

type GetGameServerResponse =
  | {
      success: true;
    }
  | {
      error: string;
    };

export const getGameServer = async (
  instanceName: string
): Promise<GetGameServerResponse> => {
  try {
    await lightsail.send(new RebootInstanceCommand({ instanceName }));

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return { error: message };
  }
};
