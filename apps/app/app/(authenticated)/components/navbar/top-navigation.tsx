'use client';

import { games } from '@/games';
import { cn } from '@repo/design-system/lib/utils';
import { Button } from '@repo/design-system/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@repo/design-system/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/design-system/ui/popover';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useId, useState } from 'react';
import { Status } from '../status';

type TopNavigationProperties = {
  servers: {
    id: string;
    game: string;
    status: string;
    name: string;
  }[];
};

export const TopNavigation = ({ servers }: TopNavigationProperties) => {
  const params = useParams();
  const router = useRouter();
  const id = useId();
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>(params.server as string);
  const activeServer = servers.find((server) => server.id === value);
  const activeGame = games.find((game) => game.id === activeServer?.game);

  const handleValueChange = (value: string) => {
    router.push(`/${value}`);
  };

  useEffect(() => {
    setValue(params.server as string);
  }, [params.server]);

  return (
    <div className="*:not-first:mt-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            aria-expanded={open}
            className="border-transparent bg-transparent shadow-none"
            disabled={!servers.length}
          >
            <span className={cn('truncate', !value && 'text-muted-foreground')}>
              {activeServer && activeGame ? (
                <div className="flex items-center gap-2">
                  <Image
                    src={activeGame.image}
                    alt={activeServer.game}
                    width={16}
                    height={16}
                    className="rounded-xs"
                  />
                  {activeServer.name}
                  <Status status={activeServer.status} />
                </div>
              ) : (
                'Select server'
              )}
            </span>
            <ChevronDownIcon
              size={16}
              className="shrink-0 text-muted-foreground/80"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full min-w-[var(--radix-popper-anchor-width)] border-input p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Search servers..." />
            <CommandList>
              <CommandEmpty>No server found.</CommandEmpty>
              <CommandGroup>
                {servers.map((server) => (
                  <CommandItem
                    key={server.id}
                    value={server.id}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? '' : currentValue);
                      setOpen(false);
                      handleValueChange(currentValue);
                    }}
                  >
                    {server.name}
                    {value === server.id && (
                      <CheckIcon size={16} className="ml-auto" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
