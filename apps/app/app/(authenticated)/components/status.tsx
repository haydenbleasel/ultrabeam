import { cn } from '@repo/design-system/lib/utils';

type StatusProps = {
  status: string;
};

export const Status = ({ status }: StatusProps) => (
  <div
    className={cn(
      'size-2 rounded-full',
      status === 'new' && 'bg-blue-500',
      status === 'active' && 'bg-green-500',
      status === 'off' && 'bg-gray-500',
      status === 'archive' && 'bg-red-500'
    )}
  />
);
