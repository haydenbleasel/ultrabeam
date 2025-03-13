import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const keys = () =>
  createEnv({
    server: {
      AWS_ACCESS_KEY: z.string().min(1),
      AWS_SECRET_KEY: z.string().min(1),
    },
    runtimeEnv: {
      AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
      AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
    },
  });
