import { Skeleton } from '@/components/ui/skeleton';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ServerList } from './components/server-list';

const title = 'Ultrabeam';
const description = 'Simple, reliable dedicated game servers.';

export const metadata: Metadata = {
  title,
  description,
};

const Overview = async () => (
  <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
    <ServerList />
  </Suspense>
);

export default Overview;
