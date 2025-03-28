import type { Instance } from '@aws-sdk/client-lightsail';

type ServerListProps = {
  data: Instance[];
};

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
import Image from 'next/image';
import Link from 'next/link';

const getGame = (server: Instance) => {
  const game = games.find(
    (game) => game.id === server.tags?.find((tag) => tag.key === 'game')?.value
  );

  return game;
};

const getRegion = (server: Instance) => {
  return regionData[server.location?.regionName as keyof typeof regionData];
};

export const ServerList = ({ data }: ServerListProps) => (
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
      {data.map((item) => (
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
