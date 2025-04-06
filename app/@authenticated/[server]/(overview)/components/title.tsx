import { lightsail } from '@/lib/lightsail';
import { GetInstanceCommand } from '@aws-sdk/client-lightsail';

type TitleProps = {
  serverId: string;
};

export const Title = async ({ serverId }: TitleProps) => {
  const { instance } = await lightsail.send(
    new GetInstanceCommand({ instanceName: serverId })
  );

  if (!instance) {
    return null;
  }

  const name = instance.tags?.find((tag) => tag.key === 'name')?.value;

  if (!name) {
    return null;
  }

  return <h1 className="font-semibold text-xl">{name}</h1>;
};
