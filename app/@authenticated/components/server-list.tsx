import type { Instance } from '@aws-sdk/client-lightsail';
import Link from 'next/link';

type ServerListProps = {
  data: Instance[];
};

export const ServerList = ({ data }: ServerListProps) => (
  <div>
    {data.map((server) => (
      <Link key={server.name} href={`/${server.name}`}>
        {server.name}
      </Link>
    ))}
  </div>
);
