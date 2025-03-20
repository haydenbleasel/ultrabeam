import { database } from '@/lib/database';
import { lightsail } from '@/lib/lightsail';
import { GetInstanceSnapshotsCommand } from '@aws-sdk/client-lightsail';
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

  const response = await lightsail.send(new GetInstanceSnapshotsCommand());
  const instanceSnapshots = response.instanceSnapshots?.filter(
    (snapshot) => snapshot.fromInstanceName === instance.backendId
  );

  return <BackupTable data={instanceSnapshots} />;
};

export default BackupsPage;
