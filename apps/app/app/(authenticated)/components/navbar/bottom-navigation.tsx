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
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useId, useState } from 'react';

export const BottomNavigation = () => {
  const id = useId();
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const pages = [
    { value: `/${params.server}`, label: 'Overview' },
    { value: `/${params.server}/files`, label: 'Files' },
    { value: `/${params.server}/console`, label: 'Console' },
    { value: `/${params.server}/backups`, label: 'Backups' },
    { value: `/${params.server}/settings`, label: 'Settings' },
    { value: `/${params.server}/danger`, label: 'Danger' },
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
              {activePage ? activePage.label : 'Select page'}
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
                    {page.label}
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
