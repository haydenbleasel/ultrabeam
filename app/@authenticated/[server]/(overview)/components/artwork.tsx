import { games } from '@/games';
import { lightsail } from '@/lib/lightsail';
import { GetInstanceCommand } from '@aws-sdk/client-lightsail';
import Image from 'next/image';

type ArtworkProps = {
  serverId: string;
};

export const Artwork = async ({ serverId }: ArtworkProps) => {
  const { instance } = await lightsail.send(
    new GetInstanceCommand({
      instanceName: serverId,
    })
  );

  if (!instance) {
    return null;
  }

  const gameId = instance.tags?.find((tag) => tag.key === 'game')?.value;
  const activeGame = games.find((game) => game.id === gameId);

  if (!activeGame) {
    return null;
  }

  return (
    <Image
      src={activeGame.image}
      alt={activeGame.name}
      width={600}
      height={600}
      className="aspect-square"
    />
  );
};
