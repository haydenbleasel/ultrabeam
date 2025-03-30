import { getLogs } from '@/actions/logs/get';
import { gameDataDirectory } from '@/lib/consts';
import { codeToHtml } from 'shiki';
import { Console } from './components/console';

type ServerProps = {
  params: Promise<{
    server: string;
  }>;
};

const command = `cd ${gameDataDirectory} && docker compose logs --tail 500`;

const ConsolePage = async ({ params }: ServerProps) => {
  const { server: serverId } = await params;
  const logs = await getLogs(serverId, command);

  if ('error' in logs) {
    return <div className="p-4">{logs.error}</div>;
  }

  const html = await codeToHtml(logs.data, {
    lang: 'actionscript-3',
    theme: 'vitesse-light',
  });

  return <Console defaultValue={html} serverId={serverId} command={command} />;
};

export default ConsolePage;
