import { getLogs } from '@/actions/logs/get';
import { Console } from '@/components/console';
import { gameDataDirectory } from '@/lib/consts';
import { codeToHtml } from 'shiki';

type ConsoleProps = {
  serverId: string;
};

const command = `cd ${gameDataDirectory} && docker compose logs --tail 500`;

export const ConsolePreload = async ({ serverId }: ConsoleProps) => {
  const logs = await getLogs(serverId, command);

  if ('error' in logs) {
    return <div className="p-4">{logs.error}</div>;
  }

  const html = await codeToHtml(logs.data, {
    lang: 'actionscript-3',
    theme: 'vitesse-light',
  });

  return <Console serverId={serverId} defaultValue={html} command={command} />;
};
