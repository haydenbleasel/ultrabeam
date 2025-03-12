'use client';

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
import { useParams, useRouter } from 'next/navigation';
import { useId, useState } from 'react';

type TopNavigationProperties = {
  servers: {
    id: string;
    game: string;
    status: string;
  }[];
};

export const TopNavigation = ({ servers }: TopNavigationProperties) => {
  const params = useParams();
  const router = useRouter();
  const id = useId();
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>(params.server as string);

  const handleValueChange = (value: string) => {
    router.push(`/${value}`);
  };

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
              {value
                ? servers.find((server) => server.id === value)?.game
                : 'Select server'}
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
                    {server.game}
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
