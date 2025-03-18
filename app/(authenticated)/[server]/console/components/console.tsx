'use client';

import { getLogs } from '@/actions/logs/get';
import { diffLines } from 'diff';
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
        console.error(newLogs.error);
      } else {
        const diff = diffLines(logs, newLogs.data);
        const newLog = diff.map((change) => change.value).join('');

        setLogs((prev) => prev + newLog);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [serverId, logs]);

  return (
    <pre className="max-h-[500px] w-full overflow-auto bg-black p-4 text-white text-xs">
      {logs}
    </pre>
  );
};
