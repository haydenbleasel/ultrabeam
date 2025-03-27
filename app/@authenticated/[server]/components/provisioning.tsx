'use client';
import { getGameServer } from '@/actions/server/get';
import { ServerStatus } from '@/generated/client';
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
  createdAt: Date;
  id: string;
};

export const Provisioning = ({ id }: ProvisioningProps) => {
  const router = useRouter();
  const [value, setValue] = useState<number>(1);

  const items = [
    {
      id: ServerStatus.createdServer,
      title: 'Server created',
      description: 'Infrastructure is being provisioned.',
    },
    {
      id: ServerStatus.createdKeyPair,
      title: 'Keys created',
      description: 'The keys have been created.',
    },
    {
      id: ServerStatus.createdInstance,
      title: 'Instance created',
      description: 'The server instance has been created.',
    },
    {
      id: ServerStatus.instanceAvailable,
      title: 'Instance available',
      description: 'The server instance is ready to use.',
    },
    {
      id: ServerStatus.openedPorts,
      title: 'Ports opened',
      description: 'The required ports have been opened.',
    },
    {
      id: ServerStatus.createdDisk,
      title: 'Disk created',
      description: 'The disk has been created.',
    },
    {
      id: ServerStatus.diskAvailable,
      title: 'Disk available',
      description: 'The disk is ready to use.',
    },
    {
      id: ServerStatus.diskAttached,
      title: 'Disk attached',
      description: 'The disk has been attached to the server.',
    },
    {
      id: ServerStatus.diskInUse,
      title: 'Disk in use',
      description: 'The disk is ready to use.',
    },
    {
      id: ServerStatus.gameInstalled,
      title: 'Game installed',
      description: 'The game has been installed.',
    },
    {
      id: ServerStatus.ready,
      title: 'Server ready',
      description: 'The server is ready to use.',
    },
  ];

  useEffect(() => {
    const interval = setInterval(async () => {
      const response = await getGameServer(id);

      if ('error' in response) {
        throw new Error(response.error);
      }

      setValue(items.findIndex((item) => item.id === response.data.status));

      if (response.data.status === ServerStatus.ready) {
        clearInterval(interval);
        router.refresh();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [id, router, items.findIndex]);

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
