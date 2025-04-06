import { lightsail } from '@/lib/lightsail';
import { GetInstanceCommand } from '@aws-sdk/client-lightsail';
import { PasswordClient } from './client';

type PasswordProps = {
  serverId: string;
};

export const Password = async ({ serverId }: PasswordProps) => {
  const { instance } = await lightsail.send(
    new GetInstanceCommand({
      instanceName: serverId,
    })
  );

  if (!instance) {
    return null;
  }

  const password =
    instance.tags?.find((tag) => tag.key === 'password')?.value ?? '';

  return <PasswordClient password={password} />;
};
