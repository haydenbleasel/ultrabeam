import { lightsail } from '@/lib/lightsail';
import { GetInstanceSnapshotsCommand } from '@aws-sdk/client-lightsail';
import { BackupTable } from './components/backup-table';

type ServerProps = {
  params: Promise<{
    server: string;
  }>;
};

const BackupsPage = async ({ params }: ServerProps) => {
  const { server: serverId } = await params;

  const { instanceSnapshots } = await lightsail.send(
    new GetInstanceSnapshotsCommand()
  );

  const data = instanceSnapshots?.filter(
    (snapshot) => snapshot.fromInstanceName === serverId
  );

  return <BackupTable data={data} />;
};

export default BackupsPage;
