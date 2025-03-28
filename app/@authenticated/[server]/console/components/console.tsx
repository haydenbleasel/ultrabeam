'use client';

import { getLogs } from '@/actions/logs/get';
import { handleError } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { codeToHtml } from 'shiki';

type ConsoleProps = {
  serverId: string;
  defaultValue: string;
};

export const Console = ({ serverId, defaultValue }: ConsoleProps) => {
  const [logs, setLogs] = useState(defaultValue);
  const consoleRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // Scroll to bottom when logs change
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const newLogs = await getLogs(serverId);

      if ('error' in newLogs) {
        handleError(newLogs.error);
        return;
      }

      const html = await codeToHtml(newLogs.data, {
        lang: 'actionscript-3',
        theme: 'vitesse-light',
      });

      setLogs(html);
    }, 3000);

    return () => clearInterval(interval);
  }, [serverId]);

  return (
    <div className="relative">
      <div className="absolute top-0 right-0 left-0 z-10 h-24 bg-gradient-to-b from-background to-transparent" />
      <div
        ref={consoleRef}
        className="h-[500px] overflow-auto"
        dangerouslySetInnerHTML={{ __html: logs }}
      />
    </div>
  );
};
