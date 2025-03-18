import { RedirectToSignIn } from '@clerk/nextjs/client';
import { currentUser } from '@clerk/nextjs/server';
import type { ReactNode } from 'react';
import { Navbar } from './components/navbar';
import { PostHogIdentifier } from './components/posthog-identifier';

type AppLayoutProperties = {
  readonly children: ReactNode;
};

const AppLayout = async ({ children }: AppLayoutProperties) => {
  const user = await currentUser();

  if (!user) {
    return <RedirectToSignIn />;
  }

  return (
    <>
      <Navbar />
      <div className="overflow-hidden rounded-lg border bg-card shadow-xs">
        {children}
      </div>
      <PostHogIdentifier />
    </>
  );
};

export default AppLayout;
