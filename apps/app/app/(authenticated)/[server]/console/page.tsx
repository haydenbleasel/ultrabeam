import { getLogs } from '@/actions/logs/get';
import { database } from '@repo/database';
import { notFound } from 'next/navigation';
import { Console } from './components/console';

type ServerProps = {
  params: Promise<{
    server: string;
  }>;
};

const ConsolePage = async ({ params }: ServerProps) => {
  const { server } = await params;

  const instance = await database.server.findFirst({
    where: { id: server },
  });

  if (!instance) {
    notFound();
  }

  const logs = await getLogs(instance.id);

  if ('error' in logs) {
    return <div className="p-4">{logs.error}</div>;
  }

  return <Console defaultValue={logs.data} serverId={instance.id} />;
};

export default ConsolePage;
