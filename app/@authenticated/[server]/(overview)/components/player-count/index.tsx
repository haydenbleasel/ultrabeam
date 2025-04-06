import { getPlayers } from '@/actions/players/get';
import { games } from '@/games';
import { lightsail } from '@/lib/lightsail';
import { GetInstanceCommand } from '@aws-sdk/client-lightsail';
import { PlayerCountClient } from './client';

type PlayerCountProps = {
  serverId: string;
};

export const PlayerCount = async ({ serverId }: PlayerCountProps) => {
  const { instance } = await lightsail.send(
    new GetInstanceCommand({ instanceName: serverId })
  );

  if (!instance) {
    return null;
  }

  const gameId = instance.tags?.find((tag) => tag.key === 'game')?.value;
  const activeGame = games.find((game) => game.id === gameId);

  if (!activeGame) {
    return null;
  }

  const ip = instance.publicIpAddress;
  const port = activeGame.ports.at(0)?.from ?? 0;

  if (!ip || !port) {
    return null;
  }

  const players = await getPlayers(activeGame.gamedigId, ip, port);

  if ('error' in players) {
    return (
      <PlayerCountClient
        game={activeGame.gamedigId}
        ip={ip}
        port={port}
        defaultPlayers={0}
        defaultMaxPlayers={0}
      />
    );
  }

  return (
    <PlayerCountClient
      game={activeGame.gamedigId}
      ip={ip}
      port={port}
      defaultPlayers={players.data.players}
      defaultMaxPlayers={players.data.maxplayers}
    />
  );
};
