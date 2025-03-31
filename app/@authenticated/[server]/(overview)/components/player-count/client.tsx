'use client';

import { getPlayers } from '@/actions/players/get';
import { useEffect, useState } from 'react';

type PlayerCountClientProps = {
  game: string;
  ip: string;
  port: number;
  defaultPlayers: number;
  defaultMaxPlayers: number;
};

export const PlayerCountClient = ({
  game,
  ip,
  port,
  defaultPlayers,
  defaultMaxPlayers,
}: PlayerCountClientProps) => {
  const [playerCount, setPlayerCount] = useState(defaultPlayers);
  const [maxPlayers, setMaxPlayers] = useState(defaultMaxPlayers);

  useEffect(() => {
    const interval = setInterval(async () => {
      const result = await getPlayers(game, ip, port);

      if ('error' in result) {
        console.error(result.error);
        return;
      }

      setPlayerCount(result.data.players);
      setMaxPlayers(result.data.maxplayers);
    }, 5000);

    return () => clearInterval(interval);
  }, [game, ip, port]);

  return `${playerCount}/${maxPlayers}`;
};
