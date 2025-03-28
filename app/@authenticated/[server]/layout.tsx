import { lightsail } from '@/lib/lightsail';
import { GetInstanceCommand } from '@aws-sdk/client-lightsail';
import { currentUser } from '@clerk/nextjs/server';
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
  const { server: serverId } = await params;
  const user = await currentUser();

  if (!user) {
    return {};
  }

  const { instance } = await lightsail.send(
    new GetInstanceCommand({
      instanceName: serverId,
    })
  );

  if (!instance) {
    return {};
  }

  const name = instance.tags?.find(({ key }) => key === 'name')?.value;
  const game = instance.tags?.find(({ key }) => key === 'game')?.value;

  return {
    title: name,
    description: `Server for ${game ?? 'unknown game'}.`,
  };
};

const ServerLayout = async ({ children, params }: ServerLayoutProps) => {
  const { server: serverId } = await params;
  const user = await currentUser();

  if (!user) {
    notFound();
  }

  const { instance } = await lightsail.send(
    new GetInstanceCommand({
      instanceName: serverId,
    })
  );

  if (!instance) {
    notFound();
  }

  const status = instance.tags?.find(({ key }) => key === 'status')?.value;

  if (status !== 'ready') {
    return (
      <div className="p-8">
        <Provisioning id={serverId} />
      </div>
    );
  }

  return children;
};

export default ServerLayout;
