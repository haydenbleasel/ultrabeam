import { dots } from '@/lib/digitalocean';
import { currentUser } from '@repo/auth/server';
import { database } from '@repo/database';
import { Badge } from '@repo/design-system/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@repo/design-system/components/ui/breadcrumb';
import { Separator } from '@repo/design-system/components/ui/separator';
import { SidebarTrigger } from '@repo/design-system/components/ui/sidebar';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { ServerPagePicker } from './components/server-page-picker';
import { ServerPicker } from './components/server-picker';

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
    <div className="divide-y">
      <div className="flex items-center gap-2 p-4">
        <SidebarTrigger className="-ml-1 shrink-0" />
        <Separator orientation="vertical" className="mr-2 h-4 shrink-0" />
        <Breadcrumb className="flex-1">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <ServerPicker data={instances} />
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <ServerPagePicker data={instance} />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Badge variant="outline">{droplet.data.droplet.status}</Badge>
      </div>
      {children}
    </div>
  );
};

export default ServerLayout;
