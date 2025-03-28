'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover';
import {
  ChartBarIcon,
  CheckIcon,
  ChevronDownIcon,
  DatabaseIcon,
  FileIcon,
  HomeIcon,
  TerminalIcon,
} from 'lucide-react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useId, useState } from 'react';

export const BottomNavigation = () => {
  const id = useId();
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const pages = [
    { value: `/${params.server}`, label: 'Overview', icon: HomeIcon },
    { value: `/${params.server}/files`, label: 'Files', icon: FileIcon },
    {
      value: `/${params.server}/console`,
      label: 'Console',
      icon: TerminalIcon,
    },
    {
      value: `/${params.server}/backups`,
      label: 'Backups',
      icon: DatabaseIcon,
    },
    {
      value: `/${params.server}/metrics`,
      label: 'Metrics',
      icon: ChartBarIcon,
    },
  ];

  const activePage = pages.find((page) => pathname.endsWith(page.value));

  const handleValueChange = (value: string) => {
    router.push(value);
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
            disabled={!activePage}
          >
            <span
              className={cn('truncate', !activePage && 'text-muted-foreground')}
            >
              {activePage ? (
                <div className="flex items-center gap-2">
                  <activePage.icon
                    size={16}
                    className="text-muted-foreground"
                  />
                  {activePage.label}
                </div>
              ) : (
                'Select page'
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
            <CommandInput placeholder="Search pages..." />
            <CommandList>
              <CommandEmpty>No pages found.</CommandEmpty>
              <CommandGroup>
                {pages.map((page) => (
                  <CommandItem
                    key={page.value}
                    value={page.value}
                    onSelect={(currentValue) => {
                      setOpen(false);
                      handleValueChange(currentValue);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <page.icon size={16} className="text-muted-foreground" />
                      {page.label}
                    </div>
                    {activePage?.value === page.value && (
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
