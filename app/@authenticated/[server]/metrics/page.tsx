import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';
import { CpuChart } from './components/cpu-chart';
import { NetworkInChart } from './components/network-in-chart';
import { NetworkOutChart } from './components/network-out-chart';

type ServerProps = {
  params: Promise<{
    server: string;
  }>;
};

const MetricsPage = async ({ params }: ServerProps) => {
  const instanceName = (await params).server;
  const endTime = new Date();
  const startTime = new Date(Date.now() - 1000 * 60 * 60 * 24); // since yesterday
  const period = 60; // 1 minute

  return (
    <div className="grid gap-6 p-6">
      <Suspense fallback={<Skeleton className="h-[473px] w-full" />}>
        <CpuChart
          instanceName={instanceName}
          endTime={endTime}
          startTime={startTime}
          period={period}
        />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-[473px] w-full" />}>
        <NetworkInChart
          instanceName={instanceName}
          endTime={endTime}
          startTime={startTime}
          period={period}
        />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-[473px] w-full" />}>
        <NetworkOutChart
          instanceName={instanceName}
          endTime={endTime}
          startTime={startTime}
          period={period}
        />
      </Suspense>
    </div>
  );
};

export default MetricsPage;
