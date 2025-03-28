'use server';

import { getServer } from '@/lib/backend';
import { env } from '@/lib/env';
import {
  CloudWatchLogsClient,
  FilterLogEventsCommand,
} from '@aws-sdk/client-cloudwatch-logs';
import { currentUser } from '@clerk/nextjs/server';

type GetServerResponse =
  | {
      data: string[];
    }
  | {
      error: string;
    };

export const getLogs = async (id: string): Promise<GetServerResponse> => {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error('User not found');
    }

    const instance = await getServer(id);

    if (!instance) {
      throw new Error('Instance not found');
    }

    const logGroupName = `/lightsail/ultrabeam/${instance.name}/syslog`;

    const client = new CloudWatchLogsClient({
      region: instance.location?.regionName,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY,
        secretAccessKey: env.AWS_SECRET_KEY,
      },
    });

    const logs = await client.send(
      new FilterLogEventsCommand({
        logGroupName,
        limit: 50,
        interleaved: true,
      })
    );

    return { data: logs.events?.map((event) => event.message ?? '') ?? [] };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return { error: message };
  }
};
