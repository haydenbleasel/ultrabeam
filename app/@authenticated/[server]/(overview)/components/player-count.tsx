'use client';

import { getPlayers } from '@/actions/players/get';
import { handleError } from '@/lib/utils';
import { useEffect, useState } from 'react';

type PlayerCountProps = {
  game: string;
  ip: string;
  port: number;
};

export const PlayerCount = ({ game, ip, port }: PlayerCountProps) => {
  const [playerCount, setPlayerCount] = useState(0);
  const [maxPlayers, setMaxPlayers] = useState(0);

  useEffect(() => {
    const interval = setInterval(async () => {
      const result = await getPlayers(game, ip, port);

      if ('error' in result) {
        handleError(result.error);
        return;
      }

      setPlayerCount(result.data.players);
      setMaxPlayers(result.data.maxplayers);
    }, 5000);

    return () => clearInterval(interval);
  }, [game, ip, port]);

  return `${playerCount}/${maxPlayers}`;
};
