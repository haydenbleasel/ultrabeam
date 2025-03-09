import { dots } from '@/lib/digitalocean';
import { UserButton } from '@repo/auth/client';
import { currentUser } from '@repo/auth/server';
import { database } from '@repo/database';
import { notFound } from 'next/navigation';
import { BottomNavigation } from './bottom-navigation';
import { TopNavigation } from './top-navigation';

export const Navbar = async () => {
  const user = await currentUser();

  if (!user) {
    notFound();
  }

  const servers = await database.server.findMany({
    where: { ownerId: user.id },
  });

  const droplets: {
    id: string;
    game: string;
    status: string;
  }[] = [];

  for (const server of servers) {
    const droplet = await dots.droplet.getDroplet({
      droplet_id: server.dropletId,
    });

    droplets.push({
      id: server.id,
      game: server.game,
      status: droplet.data.droplet.status,
    });
  }
  return (
    <nav className="sticky top-0 z-40 flex w-full flex-col gap-4 border-b bg-background/80 py-4 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <svg
            width="32"
            height="32"
            viewBox="0 0 546 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Ultrabeam Logo</title>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M222.224 0H177.778V177.778H0V222.222H177.778V400H222.224V222.222H545.391V177.778H222.224V0ZM222.224 177.778H177.778V222.222H222.224V177.778Z"
              fill="black"
            />
          </svg>
          <TopNavigation servers={droplets} />
          <BottomNavigation />
        </div>
        <UserButton />
      </div>
    </nav>
  );
};
