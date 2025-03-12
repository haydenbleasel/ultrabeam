import { currentUser } from '@repo/auth/server';
import { database } from '@repo/database';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@repo/design-system/ui/breadcrumb';
import { Button } from '@repo/design-system/ui/button';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ServerList } from './components/server-list';

const title = 'Acme Inc';
const description = 'My application.';

export const metadata: Metadata = {
  title,
  description,
};

const App = async () => {
  const user = await currentUser();

  if (!user) {
    notFound();
  }

  const servers = await database.server.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  if (!servers.length) {
    return (
      <div className="flex aspect-video items-center justify-center">
        <div className="grid gap-4">
          <p className="text-muted-foreground text-sm">No servers found.</p>
          <Button asChild>
            <Link href="/create">Create server</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2 p-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Home</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <ServerList data={servers} />
    </>
  );
};

export default App;
