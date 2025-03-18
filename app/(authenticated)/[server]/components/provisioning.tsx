'use client';

import { getGameServer } from '@/actions/server/get';
import {
  Timeline,
  TimelineContent,
  TimelineDate,
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

const calculateState = (backendId?: string, state?: string) => {
  if (state === 'running') {
    return 4;
  }

  if (state === 'pending') {
    return 3;
  }

  if (backendId) {
    return 2;
  }

  return 1;
};

export const Provisioning = ({ createdAt, id }: ProvisioningProps) => {
  const router = useRouter();
  const [value, setValue] = useState(1);

  const items = [
    {
      id: 1,
      date: createdAt.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      title: 'Server created',
      description: 'The server has been created and is being provisioned.',
    },
    {
      id: 2,
      date: 'Server provisioned',
      title: 'Server provisioned',
      description: 'The server has been provisioned and is ready to use.',
    },
    {
      id: 3,
      date: 'Disk attached',
      title: 'Disk attached',
      description: 'The disk has been attached to the server.',
    },
    {
      id: 4,
      date: 'Server ready',
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

      const state = calculateState(
        response.data?.bundleId,
        response.data?.state?.name
      );

      setValue(state);

      if (state === 4) {
        clearInterval(interval);
        router.refresh();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [id, router]);

  return (
    <Timeline value={value}>
      {items.map((item) => (
        <TimelineItem
          key={item.id}
          step={item.id}
          className="group-data-[orientation=vertical]/timeline:ms-10"
        >
          <TimelineHeader>
            <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
            <TimelineDate>{item.date}</TimelineDate>
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
