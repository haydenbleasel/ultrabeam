import type { ReactNode } from 'react';
import { Navbar } from './components/navbar';
import { PostHogIdentifier } from './components/posthog-identifier';

type AppLayoutProperties = {
  readonly children: ReactNode;
};

const AppLayout = ({ children }: AppLayoutProperties) => (
  <>
    <Navbar />
    <div className="overflow-hidden rounded-lg border bg-card shadow-xs">
      {children}
    </div>
    <PostHogIdentifier />
  </>
);

export default AppLayout;
