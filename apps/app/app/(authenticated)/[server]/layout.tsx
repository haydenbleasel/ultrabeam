import type { ReactNode } from 'react';

type ServerLayoutProps = {
  children: ReactNode;
};

const ServerLayout = ({ children }: ServerLayoutProps) => (
  <div className="container mx-auto px-4 py-8">{children}</div>
);

export default ServerLayout;
