import { getBackups, getServer } from '@repo/backend';
import { database } from '@repo/database';
import { notFound } from 'next/navigation';
import { BackupTable } from './components/backup-table';

type ServerProps = {
  params: Promise<{
    server: string;
  }>;
};

const BackupsPage = async ({ params }: ServerProps) => {
  const { server } = await params;

  const instance = await database.server.findFirst({
    where: { id: server },
  });

  if (!instance) {
    notFound();
  }

  const gameServer = await getServer(instance.backendId);
  const backups = await getBackups(gameServer.id);

  return <BackupTable data={backups} />;
};

export default BackupsPage;
