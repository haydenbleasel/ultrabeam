'use client';

import { getLogs } from '@/actions/logs/get';
import { useEffect, useState } from 'react';

type ConsoleProps = {
  serverId: string;
  defaultValue: string;
};

export const Console = ({ serverId, defaultValue }: ConsoleProps) => {
  const [logs, setLogs] = useState(defaultValue);

  useEffect(() => {
    const interval = setInterval(async () => {
      const logs = await getLogs(serverId);

      if ('error' in logs) {
        console.error(logs.error);
      } else {
        setLogs((prev) => prev + logs.data);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [serverId]);

  return (
    <pre className="max-h-[500px] w-full overflow-auto bg-black p-4 text-sm text-white text-xs">
      {logs}
    </pre>
  );
};
