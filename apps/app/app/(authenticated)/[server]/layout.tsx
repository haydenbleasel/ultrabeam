import { dots } from '@/lib/digitalocean';
import { currentUser } from '@repo/auth/server';
import { database } from '@repo/database';
import { Badge } from '@repo/design-system/components/ui/badge';
import {} from '@repo/design-system/components/ui/breadcrumb';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

type ServerLayoutProps = {
  children: ReactNode;
  params: Promise<{
    server: string;
  }>;
};

const ServerLayout = async ({ children, params }: ServerLayoutProps) => {
  const { server } = await params;
  const user = await currentUser();

  if (!user) {
    notFound();
  }

  const instances = await database.server.findMany({
    where: { ownerId: user.id },
  });

  const instance = await database.server.findUnique({
    where: { id: server },
  });

  if (!instance) {
    notFound();
  }

  const droplet = await dots.droplet.getDroplet({
    droplet_id: instance.dropletId,
  });

  return (
    <>
      <Badge variant="outline">{droplet.data.droplet.status}</Badge>
      {children}
    </>
  );
};

export default ServerLayout;
