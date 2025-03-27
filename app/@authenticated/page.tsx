import { lightsail } from '@/lib/lightsail';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/ui/breadcrumb';
import { Button } from '@/ui/button';
import { GetInstancesCommand } from '@aws-sdk/client-lightsail';
import { currentUser } from '@clerk/nextjs/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ServerList } from './components/server-list';

const title = 'Acme Inc';
const description = 'My application.';

export const metadata: Metadata = {
  title,
  description,
};

const Overview = async () => {
  const user = await currentUser();

  if (!user) {
    notFound();
  }

  const { instances } = await lightsail.send(new GetInstancesCommand({}));
  const userInstances = instances?.filter(
    ({ tags }) => tags?.find(({ key }) => key === 'user')?.value === user.id
  );

  if (!userInstances?.length) {
    return (
      <div className="flex aspect-video items-center justify-center">
        <div className="grid gap-4">
          <p className="text-muted-foreground text-sm">No servers found.</p>
          <Button asChild>
            <Link href="/create">Create server</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2 p-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Home</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <ServerList data={userInstances} />
    </>
  );
};

export default Overview;
