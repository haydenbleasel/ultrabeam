import { UserButton } from '@repo/auth/client';
import { currentUser } from '@repo/auth/server';
import { getServer } from '@repo/backend';
import { database } from '@repo/database';
import { ModeToggle } from '@repo/design-system/components/mode-toggle';
import { Button } from '@repo/design-system/ui/button';
import { PlusIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
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
    const gameServer = await getServer(server.backendId);

    droplets.push({
      id: server.id,
      game: server.game,
      status: gameServer.status,
    });
  }

  return (
    <nav className="top-0 z-40 flex w-full flex-col gap-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image src="/logo.svg" alt="Logo" width={20} height={20} />
          <span className="text-muted-foreground">/</span>
          <TopNavigation servers={droplets} />
          <span className="text-muted-foreground">/</span>
          <BottomNavigation />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Button variant="ghost" asChild size="icon">
              <Link href="/create">
                <PlusIcon size={16} className="text-muted-foreground" />
              </Link>
            </Button>
            <ModeToggle />
          </div>
          <UserButton />
        </div>
      </div>
    </nav>
  );
};
