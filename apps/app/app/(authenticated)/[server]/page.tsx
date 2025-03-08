import { getServer } from '@/actions/server/get';
import { database } from '@repo/database';
import { Badge } from '@repo/design-system/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@repo/design-system/components/ui/breadcrumb';
import { Separator } from '@repo/design-system/components/ui/separator';
import { SidebarTrigger } from '@repo/design-system/components/ui/sidebar';
import { FileIcon, HomeIcon, SettingsIcon, TerminalIcon } from 'lucide-react';
import { notFound } from 'next/navigation';

type Server = {
  params: Promise<{
    server: string;
  }>;
};

const ServerPage = async ({ params }: Server) => {
  const { server } = await params;

  const instance = await database.server.findUnique({
    where: { id: server },
  });

  if (!instance) {
    notFound();
  }

  const droplet = await getServer(instance.dropletId);
  const pages = [
    {
      icon: HomeIcon,
      title: 'Overview',
      href: `/${server}`,
    },
    {
      icon: FileIcon,
      title: 'Files',
      href: `/${server}/files`,
    },
    {
      icon: TerminalIcon,
      title: 'Console',
      href: `/${server}/console`,
    },
    {
      icon: SettingsIcon,
      title: 'Settings',
      href: `/${server}/settings`,
    },
  ];

  if ('error' in droplet) {
    notFound();
  }

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
              <BreadcrumbLink href={`/${server}`}>
                {droplet.data.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Overview</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Badge variant="outline">{droplet.data.status}</Badge>
      </div>
      <div>
        <pre>{JSON.stringify(droplet, null, 2)}</pre>
      </div>
    </div>
  );
};

export default ServerPage;
