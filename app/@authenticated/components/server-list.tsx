import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { games } from '@/games';
import { regionData } from '@/lib/backend';
import { lightsail } from '@/lib/lightsail';
import type { Instance } from '@aws-sdk/client-lightsail';
import { GetInstancesCommand } from '@aws-sdk/client-lightsail';
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const getGame = (server: Instance) => {
  const game = games.find(
    (game) => game.id === server.tags?.find((tag) => tag.key === 'game')?.value
  );

  return game;
};

const getRegion = (server: Instance) => {
  return regionData[server.location?.regionName as keyof typeof regionData];
};

export const ServerList = async () => {
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
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Name</TableHead>
          <TableHead>Hardware</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {userInstances.map((item) => (
          <TableRow key={item.name}>
            <TableCell>
              <Link
                className="flex items-center gap-3"
                href={`/${item.name}`}
                prefetch
              >
                <Image
                  src={getGame(item)?.image ?? ''}
                  alt={getGame(item)?.id ?? ''}
                  width={40}
                  height={40}
                  className="rounded-xs"
                />
                <div>
                  <div className="font-medium">
                    {item.tags?.find((tag) => tag.key === 'name')?.value}
                  </div>
                  <span className="mt-0.5 text-muted-foreground text-xs capitalize">
                    {item.tags?.find((tag) => tag.key === 'game')?.value}
                  </span>
                </div>
              </Link>
            </TableCell>
            <TableCell>
              {item.hardware?.cpuCount} CPU, {item.hardware?.ramSizeInGb} GB RAM
            </TableCell>
            <TableCell className="items-center gap-2">
              {getRegion(item).flag} {item.location?.regionName}
            </TableCell>
            <TableCell className="capitalize">{item.state?.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
