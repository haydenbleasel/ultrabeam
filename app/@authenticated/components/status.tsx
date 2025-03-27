'use client';

import { getServer } from '@/actions/server/get';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

type StatusProps = {
  id: string;
  defaultStatus: string;
};

export const Status = ({ id, defaultStatus }: StatusProps) => {
  const [status, setStatus] = useState(defaultStatus);

  useEffect(() => {
    const interval = setInterval(async () => {
      const response = await getServer(id);

      if ('error' in response) {
        throw new Error(response.error);
      }

      const status = response.data.state?.name;

      if (status) {
        setStatus(status);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  return (
    <div
      className={cn(
        'size-2 rounded-full',
        status === 'running' && 'bg-green-500',
        status === 'pending' && 'bg-yellow-500'
      )}
    />
  );
};
