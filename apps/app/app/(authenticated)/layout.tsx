import { env } from '@/env';
import { auth, currentUser } from '@repo/auth/server';
import { showBetaFeature } from '@repo/feature-flags';
import { NotificationsProvider } from '@repo/notifications/components/provider';
import { secure } from '@repo/security';
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
  const { redirectToSignIn } = await auth();
  const betaFeature = await showBetaFeature();

  if (!user) {
    return redirectToSignIn();
  }

  return (
    <NotificationsProvider userId={user.id}>
      <Navbar />
      {betaFeature && (
        <div className="m-4 rounded-full bg-blue-500 p-1.5 text-center text-sm text-white">
          Beta feature now available
        </div>
      )}
      {children}
      <PostHogIdentifier />
    </NotificationsProvider>
  );
};

export default AppLayout;
