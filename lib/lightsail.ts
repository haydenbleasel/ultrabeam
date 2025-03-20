import 'server-only';
import { env } from '@/lib/env';
import { LightsailClient } from '@aws-sdk/client-lightsail';

export const lightsail = new LightsailClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY,
    secretAccessKey: env.AWS_SECRET_KEY,
  },
});
