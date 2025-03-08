import { createApiClient } from 'dots-wrapper';

const DIGITAL_OCEAN_TOKEN = process.env.DIGITAL_OCEAN_TOKEN;

if (!DIGITAL_OCEAN_TOKEN) {
  throw new Error('DIGITAL_OCEAN_TOKEN is not set');
}

export const dots = createApiClient({ token: DIGITAL_OCEAN_TOKEN });
