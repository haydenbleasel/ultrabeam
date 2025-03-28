import { vercel } from '@t3-oss/env-core/presets-zod';
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  extends: [vercel()],
  client: {
    // PostHog
    NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1).startsWith('phc_'),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().min(1).url(),

    // Google Analytics
    NEXT_PUBLIC_GA_MEASUREMENT_ID: z
      .string()
      .min(1)
      .startsWith('G-')
      .optional(),

    // Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1).startsWith('pk_'),
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().min(1).startsWith('/'),
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().min(1).startsWith('/'),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string().min(1).startsWith('/'),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string().min(1).startsWith('/'),

    // Sentry (automatically by Sentry Integration in Vercel Marketplace)
    NEXT_PUBLIC_SENTRY_DSN: z.string().min(1).url().optional(),
  },
  server: {
    // Clerk
    CLERK_SECRET_KEY: z.string().min(1).startsWith('sk_'),

    // AWS
    AWS_ACCESS_KEY: z.string().min(1),
    AWS_SECRET_KEY: z.string().min(1),

    // Stripe
    STRIPE_SECRET_KEY: z.string().min(1),

    // BetterStack
    BETTERSTACK_API_KEY: z.string().min(1).optional(),
    BETTERSTACK_URL: z.string().min(1).url().optional(),

    // Sentry (automatically by Sentry Integration in Vercel Marketplace)
    SENTRY_ORG: z.string().min(1).optional(),
    SENTRY_PROJECT: z.string().min(1).optional(),

    // Vercel (automatically by Vercel deployment)
    NEXT_RUNTIME: z.enum(['nodejs', 'edge']).optional(),

    // Optional, for bundle analysis
    ANALYZE: z.string().optional(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL:
      process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL:
      process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
    ANALYZE: process.env.ANALYZE,
    NEXT_RUNTIME: process.env.NEXT_RUNTIME,
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    BETTERSTACK_API_KEY: process.env.BETTERSTACK_API_KEY,
    BETTERSTACK_URL: process.env.BETTERSTACK_URL,
    SENTRY_ORG: process.env.SENTRY_ORG,
    SENTRY_PROJECT: process.env.SENTRY_PROJECT,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
});
