import { init } from '@sentry/nextjs';
import { env } from './env';

const opts = {
  dsn: env.NEXT_PUBLIC_SENTRY_DSN,
};

export const register = () => {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    init(opts);
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    init(opts);
  }
};
