import type { Server } from '@/lib/database';
import Link from 'next/link';

type ServerListProps = {
  data: Server[];
};

export const ServerList = ({ data }: ServerListProps) => (
  <div>
    {data.map((server) => (
      <Link key={server.id} href={`/${server.id}`}>
        {server.game}
      </Link>
    ))}
  </div>
);
