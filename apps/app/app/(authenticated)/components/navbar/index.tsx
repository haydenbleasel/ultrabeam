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

  return (
    <nav className="sticky top-0 z-40 flex w-full flex-col gap-4 border-b pt-4">
      <div className="flex items-center justify-between px-4">
        <TopNavigation servers={servers} />
        <UserButton />
      </div>
      <div className="px-4">
        <BottomNavigation />
      </div>
    </nav>
  );
};
