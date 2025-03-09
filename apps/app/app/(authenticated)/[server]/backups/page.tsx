import { dots } from '@/lib/digitalocean';
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

  const backups = await dots.droplet.listDropletBackups({
    droplet_id: instance.dropletId,
  });

  return <BackupTable data={backups.data.backups} />;
};

export default BackupsPage;
