'use client';

import { Tabs, TabsList, TabsTrigger } from '@repo/design-system/ui/tabs';
import { useParams, usePathname, useRouter } from 'next/navigation';

const pages = [
  { value: '', label: 'Overview' },
  { value: '/files', label: 'Files' },
  { value: '/console', label: 'Console' },
  { value: '/backups', label: 'Backups' },
  { value: '/settings', label: 'Settings' },
  { value: '/danger', label: 'Danger' },
];

export const BottomNavigation = () => {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const activePage = pages.find((page) => pathname.endsWith(page.value));

  const handleValueChange = (value: string) => {
    router.push(`/${params.server}${value}`);
  };

  return (
    <Tabs value={activePage?.value} onValueChange={handleValueChange}>
      <TabsList className="h-auto w-full justify-start rounded-none border-b bg-transparent p-0">
        {pages.map((page) => (
          <TabsTrigger
            key={page.value}
            value={page.value}
            className="relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
          >
            {page.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
