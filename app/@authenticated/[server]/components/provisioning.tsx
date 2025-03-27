'use client';

import { getServer } from '@/actions/server/get';
import {
  Timeline,
  TimelineContent,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from '@/ui/timeline';
import { CheckIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type ProvisioningProps = {
  id: string;
};

export const Provisioning = ({ id }: ProvisioningProps) => {
  const router = useRouter();
  const [value, setValue] = useState<number>(1);

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
      id: 'gameInstalled',
      title: 'Game installed',
      description: 'The game has been installed.',
    },
    {
      id: 'ready',
      title: 'Server ready',
      description: 'The server is ready to use.',
    },
  ];

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
        router.refresh();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [id, router]);

  return (
    <Timeline value={value}>
      {items.map((item, index) => (
        <TimelineItem
          key={item.id}
          step={index}
          className="group-data-[orientation=vertical]/timeline:ms-10 group-data-[orientation=vertical]/timeline:not-last:pb-6"
        >
          <TimelineHeader>
            <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
            <TimelineTitle>{item.title}</TimelineTitle>
            <TimelineIndicator className="group-data-[orientation=vertical]/timeline:-left-7 flex size-6 items-center justify-center group-data-completed/timeline-item:border-none group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground">
              <CheckIcon
                className="group-not-data-completed/timeline-item:hidden"
                size={16}
              />
            </TimelineIndicator>
          </TimelineHeader>
          <TimelineContent>{item.description}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};
