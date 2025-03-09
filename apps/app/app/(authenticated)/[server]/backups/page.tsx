import { dots } from '@/lib/digitalocean';
import { database } from '@repo/database';
import { notFound } from 'next/navigation';

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

  return (
    <div className="p-4">
      <h1>Backups</h1>
      <pre>{JSON.stringify(backups.data.backups, null, 2)}</pre>
    </div>
  );
};

export default BackupsPage;
