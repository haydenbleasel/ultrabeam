import { currentUser } from '@repo/auth/server';
import { getServer } from '@repo/backend';
import { database } from '@repo/database';
import { Badge } from '@repo/design-system/ui/badge';
import {
  CpuIcon,
  DockIcon,
  DollarSignIcon,
  GlobeIcon,
  HardDriveIcon,
  MemoryStickIcon,
} from 'lucide-react';
import { notFound } from 'next/navigation';

type Server = {
  params: Promise<{
    server: string;
  }>;
};

const ServerPage = async ({ params }: Server) => {
  const { server } = await params;
  const user = await currentUser();

  if (!user) {
    notFound();
  }

  const instance = await database.server.findUnique({
    where: { id: server },
  });

  if (!instance) {
    notFound();
  }

  const gameServer = await getServer(instance.backendId);

  if ('error' in gameServer) {
    notFound();
  }

  return (
    <div className="grid grid-cols-2 divide-x">
      <div className="aspect-square bg-muted" />
      <div className="p-8">
        <div className="flex items-center gap-2">
          <h1 className="font-bold text-2xl">{instance.game}</h1>
          <Badge variant="secondary" className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-amber-500" />
            {gameServer.status}
          </Badge>
        </div>
        <div className="my-4 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-2">
            <MemoryStickIcon size={16} />
            {new Intl.NumberFormat().format(gameServer.memory / 4)}GB
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-2">
            <CpuIcon size={16} />
            {new Intl.NumberFormat().format(gameServer.vcpus)} vCPUs
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-2">
            <HardDriveIcon size={16} />
            {new Intl.NumberFormat().format(gameServer.disk)}GB
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-2">
            <DockIcon size={16} />
            {gameServer.image.distribution} {gameServer.image.name}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-2">
            <GlobeIcon size={16} />
            {gameServer.region.name}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-2">
            <DollarSignIcon size={16} />
            {gameServer.size.price_hourly} / hour
          </Badge>
        </div>
        <pre>{JSON.stringify(gameServer, null, 2)}</pre>
      </div>
    </div>
  );
};

export default ServerPage;
