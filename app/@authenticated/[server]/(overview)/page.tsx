import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { games } from '@/games';
import { lightsail } from '@/lib/lightsail';
import { GetInstanceCommand } from '@aws-sdk/client-lightsail';
import { currentUser } from '@clerk/nextjs/server';
import {
  CpuIcon,
  DockIcon,
  GlobeIcon,
  HardDriveIcon,
  MemoryStickIcon,
  UsersIcon,
} from 'lucide-react';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Status } from '../../components/status';
import { Artwork } from './components/artwork';
import { IpAddress } from './components/ip-address';
import { Password } from './components/password';
import { PlayerCount } from './components/player-count';
import { ServerDropdownMenu } from './components/server-dropdown-menu';
import { Title } from './components/title';

type Server = {
  params: Promise<{
    server: string;
  }>;
};

const ServerPage = async ({ params }: Server) => {
  const { server: serverId } = await params;
  const user = await currentUser();

  if (!user) {
    notFound();
  }

  const { instance } = await lightsail.send(
    new GetInstanceCommand({ instanceName: serverId })
  );

  if (!instance) {
    notFound();
  }

  const gameTag = instance.tags?.find((tag) => tag.key === 'game');

  if (!gameTag) {
    notFound();
  }

  const activeGame = games.find((game) => game.id === gameTag.value);

  if (!activeGame) {
    notFound();
  }

  return (
    <div className="grid grid-cols-2 divide-x">
      <Suspense fallback={<Skeleton className="aspect-square w-full" />}>
        <Artwork serverId={serverId} />
      </Suspense>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Suspense fallback={<Skeleton className="h-[26px] w-[67px]" />}>
              <Title serverId={serverId} />
            </Suspense>
            <Status
              id={serverId}
              defaultStatus={instance.state?.name ?? 'pending'}
            />
          </div>
          <ServerDropdownMenu id={serverId} />
        </div>
        <div className="my-4 flex flex-wrap items-center gap-2">
          <Badge
            variant="secondary"
            className="flex items-center gap-2 px-3 py-1"
          >
            <MemoryStickIcon size={16} />
            {new Intl.NumberFormat().format(
              instance.hardware?.ramSizeInGb ?? 0
            )}
            GB
          </Badge>
          <Badge
            variant="secondary"
            className="flex items-center gap-2 px-3 py-1"
          >
            <CpuIcon size={16} />
            {new Intl.NumberFormat().format(instance.hardware?.cpuCount ?? 0)}{' '}
            vCPUs
          </Badge>
          <Badge
            variant="secondary"
            className="flex items-center gap-2 px-3 py-1"
          >
            <HardDriveIcon size={16} />
            {new Intl.NumberFormat().format(
              instance.hardware?.disks?.at(0)?.sizeInGb ?? 0
            )}
            GB
          </Badge>
          <Badge
            variant="secondary"
            className="flex items-center gap-2 px-3 py-1"
          >
            <DockIcon size={16} />
            {instance.blueprintName}
          </Badge>
          <Badge
            variant="secondary"
            className="flex items-center gap-2 px-3 py-1"
          >
            <GlobeIcon size={16} />
            {instance.location?.regionName}
          </Badge>
          <Suspense fallback={<Skeleton className="h-[26px] w-[67px]" />}>
            <Badge
              variant="secondary"
              className="flex items-center gap-2 px-3 py-1"
            >
              <UsersIcon size={16} />
              <PlayerCount serverId={serverId} />
            </Badge>
          </Suspense>
        </div>
        <div className="grid gap-2">
          <Suspense fallback={<Skeleton className="h-[58px] w-full" />}>
            <Password serverId={serverId} />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-[58px] w-full" />}>
            <IpAddress serverId={serverId} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default ServerPage;
