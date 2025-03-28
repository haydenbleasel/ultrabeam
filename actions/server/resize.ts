'use server';

import { lightsail, waitForInstanceStatus } from '@/lib/lightsail';
import {
  DeleteInstanceCommand,
  StopInstanceCommand,
} from '@aws-sdk/client-lightsail';

type ResizeServerResponse =
  | {
      success: true;
    }
  | {
      error: string;
    };

export const resizeServer = async (
  instanceName: string,
  size: string
): Promise<ResizeServerResponse> => {
  try {
    console.log(`Stopping instance: ${instanceName}...`);
    await lightsail.send(new StopInstanceCommand({ instanceName }));

    await waitForInstanceStatus(instanceName, 'stopped');

    console.log('Deleting the old instance...');
    await lightsail.send(
      new DeleteInstanceCommand({
        instanceName: instanceName,
      })
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return { error: message };
  }
};
