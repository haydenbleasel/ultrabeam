import { games } from '@/games';
import { lightsail } from '@/lib/lightsail';
import { GetInstanceCommand } from '@aws-sdk/client-lightsail';
import { IpAddressClient } from './client';

type IpAddressProps = {
  serverId: string;
};

export const IpAddress = async ({ serverId }: IpAddressProps) => {
  const { instance } = await lightsail.send(
    new GetInstanceCommand({
      instanceName: serverId,
    })
  );

  if (!instance) {
    return null;
  }

  const activeGame = games.find(
    (game) =>
      game.id === instance.tags?.find((tag) => tag.key === 'game')?.value
  );

  if (!activeGame) {
    return null;
  }

  return (
    <IpAddressClient
      ip={instance.publicIpAddress}
      port={activeGame.ports[0].from}
    />
  );
};
