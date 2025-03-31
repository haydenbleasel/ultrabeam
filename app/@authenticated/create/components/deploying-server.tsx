'use client';

import { getServer } from '@/actions/server/get';
import { Console } from '@/components/console';
import { Button } from '@/components/ui/button';
import { statuses } from '@/lib/consts';
import { cn } from '@/lib/utils';
import { AlertCircleIcon, CheckCircle2Icon, Loader2Icon } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type DeployingServerProps = {
  id: string;
};

const StatusProgress = ({
  status,
  options,
  index,
  className,
}: {
  status: (typeof statuses.server)[number];
  options: typeof statuses.server;
  index: number;
  className?: string;
}) => {
  const activeIndex = options.findIndex((item) => item.id === status.id);
  const isReady = status.id === 'ready';
  const readyWidth = 100 - index * 2;

  return (
    <div
      className={cn(
        'relative isolate flex w-full items-center justify-between overflow-hidden rounded-lg border bg-background px-4 py-3 transition-all',
        status.id === 'failed' ? 'border-destructive/20' : 'border-primary/20',
        className,
        isReady && index > 1 && '-mt-18'
      )}
      style={{
        width: isReady && index > 1 ? `${readyWidth}%` : '100%',
        marginLeft: isReady && index > 1 ? `${index}%` : '0',
        marginRight: isReady && index > 1 ? `${index}%` : '0',
      }}
      key={status.id}
    >
      <motion.div
        className={cn(
          'absolute inset-0 bg-primary-foreground',
          status.id === 'failed' && 'bg-destructive-foreground'
        )}
        initial={{ width: 0 }}
        animate={{ width: `${((activeIndex + 1) / options.length) * 100}%` }}
        transition={{ duration: 0.5 }}
      />
      <div className="relative z-10 grid flex-1 gap-1">
        <p
          className={cn(
            'font-medium',
            status.id === 'failed' ? 'text-destructive' : 'text-primary'
          )}
        >
          {status.title}
        </p>
        <p
          className={cn(
            'text-sm',
            status.id === 'failed' ? 'text-destructive/80' : 'text-primary/80'
          )}
        >
          {status.description}
        </p>
      </div>
      <div className="relative z-10 shrink-0">
        {isReady && <CheckCircle2Icon size={16} className="text-primary" />}
        {status.id === 'failed' && (
          <AlertCircleIcon size={16} className="text-destructive" />
        )}
        {status.id !== 'ready' && status.id !== 'failed' && (
          <Loader2Icon size={16} className="animate-spin text-primary" />
        )}
      </div>
    </div>
  );
};

export const DeployingServer = ({ id }: DeployingServerProps) => {
  const [value, setValue] = useState<number>(0);
  const [diskValue, setDiskValue] = useState<number>(0);
  const [staticIpValue, setStaticIpValue] = useState<number>(0);

  const activeServerStatus =
    value === -1
      ? {
          id: 'failed',
          title: 'Server failed',
          description: 'The server failed to provision.',
        }
      : statuses.server[value];
  const activeDiskStatus =
    diskValue === -1
      ? {
          id: 'failed',
          title: 'Disk failed',
          description: 'The disk failed to provision.',
        }
      : statuses.disk[diskValue];
  const activeStaticIpStatus =
    staticIpValue === -1
      ? {
          id: 'failed',
          title: 'Static IP failed',
          description: 'The static IP failed to provision.',
        }
      : statuses.staticIp[staticIpValue];

  useEffect(() => {
    const interval = setInterval(async () => {
      const response = await getServer(id);

      if ('error' in response) {
        throw new Error(response.error);
      }

      const serverStatus = response.data.tags?.find(
        ({ key }) => key === 'serverStatus'
      )?.value;
      const diskStatus = response.data.tags?.find(
        ({ key }) => key === 'diskStatus'
      )?.value;
      const staticIpStatus = response.data.tags?.find(
        ({ key }) => key === 'staticIpStatus'
      )?.value;

      const newServerStatus =
        statuses.server.findIndex((item) => item.id === serverStatus) ?? -1;
      const newDiskStatus =
        statuses.disk.findIndex((item) => item.id === diskStatus) ?? -1;
      const newStaticIpStatus =
        statuses.staticIp.findIndex((item) => item.id === staticIpStatus) ?? -1;

      setValue(newServerStatus);
      setDiskValue(newDiskStatus);
      setStaticIpValue(newStaticIpStatus);

      const allStatuses = [serverStatus, diskStatus, staticIpStatus];

      if (
        allStatuses.every((status) => status === 'ready') ||
        allStatuses.some((status) => status === 'failed')
      ) {
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  return (
    <div className="grid gap-2">
      <div className="overflow-hidden rounded-lg border">
        <Console serverId={id} defaultValue="" command="cat /var/log/syslog" />
      </div>
      <div className="grid gap-2">
        <StatusProgress
          status={activeServerStatus}
          options={statuses.server}
          index={1}
          className="z-30"
        />
        <StatusProgress
          status={activeDiskStatus}
          options={statuses.disk}
          index={2}
          className="z-20"
        />
        <StatusProgress
          status={activeStaticIpStatus}
          options={statuses.staticIp}
          index={3}
          className="z-10"
        />
      </div>
      {activeServerStatus.id === 'ready' && (
        <Button className="mt-6 w-fit" asChild>
          <Link href={`/${id}`}>View server</Link>
        </Button>
      )}
    </div>
  );
};
