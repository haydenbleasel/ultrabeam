'use client';

import { getLogs } from '@/actions/logs/get';
import { handleError } from '@/lib/utils';
import { useEffect, useState } from 'react';

type ConsoleProps = {
  serverId: string;
  defaultValue: string;
};

export const Console = ({ serverId, defaultValue }: ConsoleProps) => {
  const [logs, setLogs] = useState(defaultValue);

  useEffect(() => {
    const interval = setInterval(async () => {
      const newLogs = await getLogs(serverId);

      if ('error' in newLogs) {
        handleError(newLogs.error);
        return;
      }

      setLogs(newLogs.data.map((log) => log.message).join(''));
    }, 3000);

    return () => clearInterval(interval);
  }, [serverId]);

  return (
    <pre className="max-h-[500px] w-full overflow-auto bg-black p-4 text-white text-xs">
      {logs}
    </pre>
  );
};
