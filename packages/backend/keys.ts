import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const keys = () =>
  createEnv({
    server: {
      DIGITALOCEAN_API_TOKEN: z.string().min(1).startsWith('dop_v1_'),
    },
    runtimeEnv: {
      DIGITALOCEAN_API_TOKEN: process.env.DIGITALOCEAN_API_TOKEN,
    },
  });
