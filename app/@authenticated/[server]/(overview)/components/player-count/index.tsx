import { getPlayers } from '@/actions/players/get';
import { PlayerCountClient } from './client';

type PlayerCountProps = {
  game: string;
  ip: string;
  port: number;
};

export const PlayerCount = async ({ game, ip, port }: PlayerCountProps) => {
  const players = await getPlayers(game, ip, port);

  if ('error' in players) {
    return (
      <PlayerCountClient
        game={game}
        ip={ip}
        port={port}
        defaultPlayers={0}
        defaultMaxPlayers={0}
      />
    );
  }

  return (
    <PlayerCountClient
      game={game}
      ip={ip}
      port={port}
      defaultPlayers={players.data.players}
      defaultMaxPlayers={players.data.maxplayers}
    />
  );
};
