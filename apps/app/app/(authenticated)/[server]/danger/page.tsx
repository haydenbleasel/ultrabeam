import { currentUser } from '@repo/auth/server';
import { database } from '@repo/database';
import { notFound } from 'next/navigation';
import { DeleteServerButton } from './components/delete-server-button';

type Server = {
  params: Promise<{
    server: string;
  }>;
};

const DangerPage = async ({ params }: Server) => {
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

  return <DeleteServerButton serverId={instance.id} />;
};

export default DangerPage;
