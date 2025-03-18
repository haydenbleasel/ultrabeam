import { cn } from '@/lib/utils';

type StatusProps = {
  status: string;
};

export const Status = ({ status }: StatusProps) => (
  <div
    className={cn(
      'size-2 rounded-full',
      status === 'running' && 'bg-green-500',
      status === 'pending' && 'bg-yellow-500'
    )}
  />
);
