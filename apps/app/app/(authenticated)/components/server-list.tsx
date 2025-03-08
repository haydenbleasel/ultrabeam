import { currentUser } from '@repo/auth/server';
import { database } from '@repo/database';
import Link from 'next/link';

export const ServerList = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const servers = await database.server.findMany({
    where: { ownerId: user.id },
  });

  return (
    <div>
      {servers.map((server) => (
        <Link key={server.id} href={`/${server.id}`}>
          {server.game}
        </Link>
      ))}
    </div>
  );
};
