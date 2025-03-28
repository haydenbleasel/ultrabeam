'use server';

import { getServer } from '@/lib/backend';
import { env } from '@/lib/env';
import { getLogGroup } from '@/lib/lightsail';
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

    if (!instance.name) {
      throw new Error('Instance name not found');
    }

    const client = new CloudWatchLogsClient({
      region: instance.location?.regionName,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY,
        secretAccessKey: env.AWS_SECRET_KEY,
      },
    });

    const logs = await client.send(
      new FilterLogEventsCommand({
        logGroupName: getLogGroup(instance.name),
        limit: 50,
        interleaved: true,
      })
    );

    console.log(logs);

    return { data: logs.events?.map((event) => event.message ?? '') ?? [] };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return { error: message };
  }
};
