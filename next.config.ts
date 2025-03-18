import { env } from '@/lib/env';
import { withLogtail } from '@logtail/next';
import withBundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

const otelRegex = /@opentelemetry\/instrumentation/;

let config: NextConfig = withLogtail({
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
    ],
  },

  // biome-ignore lint/suspicious/useAwait: rewrites is async
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
      {
        source: '/ingest/decide',
        destination: 'https://us.i.posthog.com/decide',
      },
    ];
  },

  webpack(config) {
    config.ignoreWarnings = [{ module: otelRegex }];

    return config;
  },

  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
});

if (env.VERCEL) {
  const configWithTranspile = {
    ...config,
    transpilePackages: ['@sentry/nextjs'],
  };

  config = withSentryConfig(configWithTranspile, {
    org: env.SENTRY_ORG,
    project: env.SENTRY_PROJECT,

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    /*
    * For all available options, see:
    * https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
    */

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    /*
    * Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    * This can increase your server load as well as your hosting bill.
    * Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    * side errors will fail.
    */
    tunnelRoute: '/monitoring',

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    /*
    * Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    * See the following for more information:
    * https://docs.sentry.io/product/crons/
    * https://vercel.com/docs/cron-jobs
    */
    automaticVercelMonitors: true,
  });
}

if (env.ANALYZE === 'true') {
  config = withBundleAnalyzer()(config);
}

export default config;
