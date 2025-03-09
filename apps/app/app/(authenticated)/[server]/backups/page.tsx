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

  const droplet = await dots.droplet.getDroplet({
    droplet_id: instance.dropletId,
  });

  const backups = await dots.droplet.listDropletBackups({
    droplet_id: instance.dropletId,
  });

  return (
    <div className="p-4">
      <p className="text-muted-foreground text-sm">
        Next backup:{' '}
        {new Date(
          droplet.data.droplet.next_backup_window.start
        ).toLocaleString()}{' '}
        -{' '}
        {new Date(droplet.data.droplet.next_backup_window.end).toLocaleString()}
      </p>
      <BackupTable data={backups.data.backups} />
    </div>
  );
};

export default BackupsPage;
