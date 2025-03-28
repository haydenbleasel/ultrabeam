import { getPlayers } from '@/actions/players/get';
import { Badge } from '@/components/ui/badge';
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
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Status } from '../../components/status';
import { Connect } from './components/connect';
import { Password } from './components/password';
import { PlayerCount } from './components/player-count';
import { ServerDropdownMenu } from './components/server-dropdown-menu';

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

  const password =
    instance.tags?.find((tag) => tag.key === 'password')?.value ?? '';

  let players = await getPlayers(
    activeGame.id,
    instance.publicIpAddress ?? '',
    activeGame.ports.at(0)?.from ?? 0
  );

  if ('error' in players) {
    players = {
      data: {
        players: 0,
        maxplayers: 0,
      },
    };
  }

  return (
    <div className="grid grid-cols-2 divide-x">
      <Image
        src={activeGame.image}
        alt={activeGame.name}
        width={600}
        height={600}
        className="aspect-square"
      />
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-xl">
              {instance.tags?.find((tag) => tag.key === 'name')?.value}
            </h1>
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
          <Badge
            variant="secondary"
            className="flex items-center gap-2 px-3 py-1"
          >
            <UsersIcon size={16} />
            <PlayerCount
              game={activeGame.gamedigId}
              ip={instance.publicIpAddress ?? ''}
              port={activeGame.ports[0].from}
              defaultPlayers={players.data.players}
              defaultMaxPlayers={players.data.maxplayers}
            />
          </Badge>
        </div>
        <div className="grid gap-2">
          <Password password={password} />
          <Connect
            ip={instance.publicIpAddress ?? ''}
            port={activeGame.ports[0].from}
          />
        </div>
      </div>
    </div>
  );
};

export default ServerPage;
