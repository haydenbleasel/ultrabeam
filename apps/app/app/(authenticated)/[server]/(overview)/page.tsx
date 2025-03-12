import { games } from '@/games';
import { currentUser } from '@repo/auth/server';
import { getServer } from '@repo/backend';
import { database } from '@repo/database';
import { Badge } from '@repo/design-system/ui/badge';
import { Input } from '@repo/design-system/ui/input';
import { Label } from '@repo/design-system/ui/label';
import {
  CpuIcon,
  DockIcon,
  DollarSignIcon,
  GlobeIcon,
  HardDriveIcon,
  MemoryStickIcon,
} from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Status } from '../../components/status';

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
  const activeGame = games.find((game) => game.id === instance.game);

  if ('error' in gameServer || !activeGame) {
    notFound();
  }

  return (
    <div className="grid grid-cols-2 divide-x">
      <Image
        src={activeGame.image}
        alt={instance.game}
        width={600}
        height={600}
        className="aspect-square"
      />
      <div className="p-8">
        <div className="flex items-center gap-2">
          <h1 className="font-bold text-2xl">{instance.name}</h1>
          <Status status={gameServer.status} />
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
        <div className="grid gap-2">
          <Label>IP Address</Label>
          <Input value={gameServer.networks.v4[0].ip_address} />
        </div>
        <details className="mt-4">
          <summary className="text-muted-foreground text-sm">JSON</summary>
          <pre>{JSON.stringify(gameServer, null, 2)}</pre>
        </details>
      </div>
    </div>
  );
};

export default ServerPage;
