import type { ReactNode } from 'react';
import { Navbar } from './components/navbar';
import { PostHogIdentifier } from './components/posthog-identifier';

type AppLayoutProperties = {
  readonly children: ReactNode;
};

const AppLayout = ({ children }: AppLayoutProperties) => (
  <div className="pb-12">
    <Navbar />
    <div className="overflow-hidden rounded-lg border bg-card shadow-xs">
      {children}
    </div>
    <PostHogIdentifier />
  </div>
);

export default AppLayout;
