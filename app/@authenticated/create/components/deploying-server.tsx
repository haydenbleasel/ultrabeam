'use client';

import { getServer } from '@/actions/server/get';
import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Console } from '../../[server]/console/components/console';

type DeployingServerProps = {
  id: string;
};

const items = [
  {
    id: 'createdServer',
    title: 'Server created',
    description: 'Infrastructure is being provisioned.',
  },
  {
    id: 'createdKeyPair',
    title: 'Keys created',
    description: 'The keys have been created.',
  },
  {
    id: 'createdInstance',
    title: 'Instance created',
    description: 'The server instance has been created.',
  },
  {
    id: 'logGroupCreated',
    title: 'Log group created',
    description: 'The log group has been created.',
  },
  {
    id: 'instanceAvailable',
    title: 'Instance available',
    description: 'The server instance is ready to use.',
  },
  {
    id: 'openedPorts',
    title: 'Ports opened',
    description: 'The required ports have been opened.',
  },
  {
    id: 'createdDisk',
    title: 'Disk created',
    description: 'The disk has been created.',
  },
  {
    id: 'diskAvailable',
    title: 'Disk available',
    description: 'The disk is ready to use.',
  },
  {
    id: 'diskAttached',
    title: 'Disk attached',
    description: 'The disk has been attached to the server.',
  },
  {
    id: 'diskInUse',
    title: 'Disk in use',
    description: 'The disk is ready to use.',
  },
  {
    id: 'dockerInstalled',
    title: 'Docker installed',
    description: 'Docker has been installed.',
  },
  {
    id: 'volumeMounted',
    title: 'Volume mounted',
    description: 'The volume has been mounted.',
  },
  {
    id: 'ready',
    title: 'Server ready',
    description: 'The server is ready to use.',
  },
];

export const DeployingServer = ({ id }: DeployingServerProps) => {
  const router = useRouter();
  const [value, setValue] = useState<number>(1);

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

      if (status === 'ready') {
        clearInterval(interval);
        router.push(`/${id}`);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [id, router]);

  return (
    <div className="grid gap-2">
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
          key={items[value].id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="flex-1 font-mono text-muted-foreground text-xs"
        >
          {items[value].description}
        </motion.div>
      </AnimatePresence>
      <div className="h-[500px] rounded-xl bg-secondary">
        <Console serverId={id} defaultValue="" />
      </div>
    </div>
  );
};
