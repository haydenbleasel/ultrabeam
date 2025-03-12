import { env } from '@/env';
import { currentUser } from '@repo/auth/server';
import { showBetaFeature } from '@repo/feature-flags';
import { NotificationsProvider } from '@repo/notifications/components/provider';
import { secure } from '@repo/security';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { Navbar } from './components/navbar';
import { PostHogIdentifier } from './components/posthog-identifier';

type AppLayoutProperties = {
  readonly children: ReactNode;
};

const AppLayout = async ({ children }: AppLayoutProperties) => {
  if (env.ARCJET_KEY) {
    await secure(['CATEGORY:PREVIEW']);
  }

  const user = await currentUser();
  const betaFeature = await showBetaFeature();

  if (!user) {
    notFound();
  }

  return (
    <NotificationsProvider userId={user.id}>
      <Navbar />
      {betaFeature && (
        <div className="m-4 rounded-full bg-blue-500 p-1.5 text-center text-sm text-white">
          Beta feature now available
        </div>
      )}
      <div className="rounded-lg border bg-card shadow-xs">{children}</div>
      <PostHogIdentifier />
    </NotificationsProvider>
  );
};

export default AppLayout;
