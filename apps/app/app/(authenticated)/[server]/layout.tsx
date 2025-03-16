import { database } from '@repo/database';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { Provisioning } from './components/provisioning';

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

const ServerLayout = async ({ children, params }: ServerLayoutProps) => {
  const { server } = await params;
  const instance = await database.server.findFirst({
    where: { id: server },
  });

  if (!instance) {
    notFound();
  }

  if (!instance.backendId || !instance.privateKey) {
    return (
      <div className="p-8">
        <Provisioning createdAt={instance.createdAt} id={server} />
      </div>
    );
  }

  return children;
};

export default ServerLayout;
