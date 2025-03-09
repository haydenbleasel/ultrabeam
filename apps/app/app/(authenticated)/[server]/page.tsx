import { getServer } from '@/actions/server/get';
import { currentUser } from '@repo/auth/server';
import { database } from '@repo/database';
import { notFound } from 'next/navigation';

type Server = {
  params: Promise<{
    server: string;
  }>;
};

const ServerPage = async ({ params }: Server) => {
  const { server } = await params;
  const user = await currentUser();

  if (!user) {
    notFound();
  }

  const instance = await database.server.findUnique({
    where: { id: server },
  });

  if (!instance) {
    notFound();
  }

  const droplet = await getServer(instance.dropletId);

  if ('error' in droplet) {
    notFound();
  }

  return (
    <div>
      <pre>{JSON.stringify(droplet, null, 2)}</pre>
    </div>
  );
};

export default ServerPage;
