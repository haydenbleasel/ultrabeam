'use client';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { games } from '@/games';
import { cn } from '@/lib/utils';
import type { Instance } from '@aws-sdk/client-lightsail';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useId, useState } from 'react';
import { Status } from '../status';

type TopNavigationProperties = {
  servers: Instance[];
};

const getGame = (server: Instance) => {
  const game = games.find(
    (game) => game.id === server.tags?.find((tag) => tag.key === 'game')?.value
  );

  return game;
};

export const TopNavigation = ({ servers }: TopNavigationProperties) => {
  const params = useParams();
  const router = useRouter();
  const id = useId();
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>(params.server as string);
  const activeServer = servers.find((server) => server.name === value);
  const activeGame = activeServer ? getGame(activeServer) : undefined;

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
                    alt={activeGame.id}
                    width={16}
                    height={16}
                    className="rounded-xs"
                  />
                  {activeServer.tags?.find((tag) => tag.key === 'name')?.value}
                  <Status
                    id={activeServer.name ?? ''}
                    defaultStatus={activeServer.state?.name ?? 'pending'}
                  />
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
                    key={server.name}
                    value={server.name}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? '' : currentValue);
                      setOpen(false);
                      handleValueChange(currentValue);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src={getGame(server)?.image ?? ''}
                        alt={getGame(server)?.id ?? ''}
                        width={16}
                        height={16}
                        className="rounded-xs"
                      />
                      {server.tags?.find((tag) => tag.key === 'name')?.value}
                      <Status
                        id={server.name ?? ''}
                        defaultStatus={server.state?.name ?? 'unknown'}
                      />
                      {value === server.name && (
                        <CheckIcon size={16} className="ml-auto" />
                      )}
                    </div>
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
