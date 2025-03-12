import { env } from '@/env';
import { currentUser } from '@repo/auth/server';
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

  if (!user) {
    notFound();
  }

  return (
    <NotificationsProvider userId={user.id}>
      <Navbar />
      <div className="overflow-hidden rounded-lg border bg-card shadow-xs">
        {children}
      </div>
      <PostHogIdentifier />
    </NotificationsProvider>
  );
};

export default AppLayout;
