import { database } from '@repo/database';
import type { ReactNode } from 'react';

type ServerLayoutProps = {
  children: ReactNode;
  params: Promise<{
    server: string;
  }>;
};

export const generateMetadata = async ({ params }: ServerLayoutProps) => {
  const { server } = await params;
  const instance = await database.server.findFirst({
    where: { id: server },
  });

  if (!instance) {
    return {};
  }

  return {
    title: `${instance.name} - ${instance.game}`,
    description: `Server for ${instance.game}`,
  };
};

const ServerLayout = ({ children }: ServerLayoutProps) => children;

export default ServerLayout;
