import { log as logtail } from '@logtail/next';
import { env } from '../env';

export const log = env.NODE_ENV === 'production' ? logtail : console;
