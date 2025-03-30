'use client';

import { getServer } from '@/actions/server/get';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Console } from '../../[server]/console/components/console';

type DeployingServerProps = {
  id: string;
};

const items = [
  {
    id: 'creating',
    title: 'Creating server',
    description: 'The server is being created.',
  },
  {
    id: 'attaching',
    title: 'Attaching disk and static IP',
    description: 'The disk and static IP are being attached to the server.',
  },
  {
    id: 'installing',
    title: 'Installing game and dependencies',
    description: 'The game and dependencies are being installed.',
  },
  {
    id: 'updatingPackages',
    title: 'Updating packages',
    description: 'The packages are being updated.',
  },
  {
    id: 'installingDocker',
    title: 'Installing Docker',
    description: 'Docker is being installed.',
  },
  {
    id: 'mountingVolume',
    title: 'Mounting volume',
    description: 'The volume is being mounted.',
  },
  {
    id: 'installingGame',
    title: 'Installing game',
    description: 'The game is being installed.',
  },
  {
    id: 'startingServer',
    title: 'Starting server',
    description: 'The server is being started.',
  },
  {
    id: 'ready',
    title: 'Server ready',
    description: 'The server is ready to use.',
  },
  {
    id: 'failed',
    title: 'Server failed',
    description: 'The server failed to provision.',
  },
];

export const DeployingServer = ({ id }: DeployingServerProps) => {
  const [value, setValue] = useState<number>(1);
  const activeStatus = items[value];

  useEffect(() => {
    const interval = setInterval(async () => {
      const response = await getServer(id);

      if ('error' in response) {
        throw new Error(response.error);
      }

      const status = response.data.tags?.find(
        ({ key }) => key === 'status'
      )?.value;

      setValue(items.findIndex((item) => item.id === status));

      if (status === 'ready' || status === 'failed') {
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  return (
    <div className="grid gap-2">
      <div className="overflow-hidden rounded-lg border">
        <Console
          serverId={id}
          defaultValue="Waiting for server to provision..."
          command="cat /var/log/syslog"
        />
      </div>
      <div className="w-full rounded-full bg-secondary">
        <motion.div
          style={{
            width: `${(value / (items.length - 1)) * 100}%`,
          }}
          className="h-2 w-full rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${(value / (items.length - 1)) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStatus.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="flex-1 font-mono text-muted-foreground text-xs"
        >
          {activeStatus.description}
        </motion.div>
      </AnimatePresence>
      {activeStatus.id === 'ready' && (
        <Button className="mt-6 w-fit" asChild>
          <Link href={`/${id}`}>View server</Link>
        </Button>
      )}
    </div>
  );
};
