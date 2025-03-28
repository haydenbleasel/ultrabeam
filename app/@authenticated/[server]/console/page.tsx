import { getLogs } from '@/actions/logs/get';
import { Console } from './components/console';

type ServerProps = {
  params: Promise<{
    server: string;
  }>;
};

const ConsolePage = async ({ params }: ServerProps) => {
  const { server: serverId } = await params;
  const logs = await getLogs(serverId);

  if ('error' in logs) {
    return <div className="p-4">{logs.error}</div>;
  }

  return <Console defaultValue={logs.data.join('\n')} serverId={serverId} />;
};

export default ConsolePage;
