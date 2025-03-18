import { database } from '@/lib/database';
import { currentUser } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import { DeleteServerButton } from './components/delete-server-button';

type Server = {
  params: Promise<{
    server: string;
  }>;
};

const SettingsPage = async ({ params }: Server) => {
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

  return (
    <div className="p-4">
      <DeleteServerButton serverId={instance.id} />
    </div>
  );
};

export default SettingsPage;
