import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';
import { ConsolePreload } from './components/console';

type ServerProps = {
  params: Promise<{
    server: string;
  }>;
};

const ConsolePage = async ({ params }: ServerProps) => {
  const { server: serverId } = await params;

  return (
    <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
      <ConsolePreload serverId={serverId} />
    </Suspense>
  );
};

export default ConsolePage;
