'use server';

import { GameDig } from 'gamedig';

type GetPlayersResponse =
  | {
      data: {
        players: number;
        maxplayers: number;
      };
    }
  | {
      error: string;
    };

export const getPlayers = async (
  game: string,
  ip: string,
  port: number
): Promise<GetPlayersResponse> => {
  try {
    const result = await GameDig.query({
      type: game,
      host: ip,
      port: port,
    });

    return {
      data: {
        players: result.players.length,
        maxplayers: result.maxplayers,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return { error: message };
  }
};
