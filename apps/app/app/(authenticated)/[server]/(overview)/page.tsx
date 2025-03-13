import { games } from '@/games';
import { currentUser } from '@repo/auth/server';
import { getServer } from '@repo/backend';
import { database } from '@repo/database';
import { Badge } from '@repo/design-system/ui/badge';
import { Button } from '@repo/design-system/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@repo/design-system/ui/tooltip';
import {
  CpuIcon,
  DockIcon,
  GlobeIcon,
  HardDriveIcon,
  MemoryStickIcon,
  RotateCcwIcon,
} from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Status } from '../../components/status';
import { Connect } from './components/connect';

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

  console.log(instance?.backendId, 'backendId');

  if (!instance || !instance.backendId) {
    notFound();
  }

  const gameServer = await getServer(instance.backendId);
  const activeGame = games.find((game) => game.id === instance.game);

  if (!gameServer || !activeGame) {
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
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-xl">{instance.name}</h1>
            <Status status={gameServer.state?.name ?? 'pending'} />
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <RotateCcwIcon size={16} className="text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reboot server</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="my-4 flex flex-wrap items-center gap-2">
          <Badge
            variant="secondary"
            className="flex items-center gap-2 px-3 py-1"
          >
            <MemoryStickIcon size={16} />
            {new Intl.NumberFormat().format(
              gameServer.hardware?.ramSizeInGb ?? 0
            )}
            GB
          </Badge>
          <Badge
            variant="secondary"
            className="flex items-center gap-2 px-3 py-1"
          >
            <CpuIcon size={16} />
            {new Intl.NumberFormat().format(gameServer.hardware?.cpuCount ?? 0)}{' '}
            vCPUs
          </Badge>
          <Badge
            variant="secondary"
            className="flex items-center gap-2 px-3 py-1"
          >
            <HardDriveIcon size={16} />
            {new Intl.NumberFormat().format(
              gameServer.hardware?.disks?.at(0)?.sizeInGb ?? 0
            )}
            GB
          </Badge>
          <Badge
            variant="secondary"
            className="flex items-center gap-2 px-3 py-1"
          >
            <DockIcon size={16} />
            {gameServer.blueprintName}
          </Badge>
          <Badge
            variant="secondary"
            className="flex items-center gap-2 px-3 py-1"
          >
            <GlobeIcon size={16} />
            {gameServer.location?.regionName}
          </Badge>
        </div>
        <Connect ip={gameServer.publicIpAddress ?? ''} port={activeGame.port} />
      </div>
    </div>
  );
};

export default ServerPage;
