import { Logo } from '@/components/logo';
import { ModeToggle } from '@/components/mode-toggle';
import { games } from '@/games';
import { lightsail } from '@/lib/lightsail';
import { Button } from '@/ui/button';
import { GetInstancesCommand } from '@aws-sdk/client-lightsail';
import { UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { PlusIcon } from 'lucide-react';
import type { StaticImageData } from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BottomNavigation } from './bottom-navigation';
import { TopNavigation } from './top-navigation';

export const Navbar = async () => {
  const user = await currentUser();

  if (!user) {
    notFound();
  }

  const servers = await lightsail.send(new GetInstancesCommand());

  const userServers = servers.instances?.filter((instance) =>
    instance.tags?.some((tag) => tag.key === 'user' && tag.value === user.id)
  );

  const droplets: {
    id: string;
    name: string;
    game: string;
    status: string;
    image: StaticImageData;
  }[] = [];

  for (const server of userServers ?? []) {
    const game = games.find(
      (game) =>
        game.id === server.tags?.find((tag) => tag.key === 'game')?.value
    );

    if (!game) {
      continue;
    }

    droplets.push({
      name: server.name ?? '',
      id: server.name ?? '',
      game: game.id,
      status: server.tags?.find((tag) => tag.key === 'status')?.value ?? '',
      image: game.image,
    });
  }

  return (
    <nav className="top-0 z-40 flex w-full flex-col gap-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="pr-4">
            <Link href="/">
              <Logo />
            </Link>
          </div>
          <span className="text-muted-foreground opacity-50">/</span>
          <TopNavigation servers={droplets} />
          <span className="text-muted-foreground opacity-50">/</span>
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
