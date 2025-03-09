'use client';

import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@repo/design-system/components/ui/tabs';
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
      <TabsList>
        {pages.map((page) => (
          <TabsTrigger key={page.value} value={page.value}>
            {page.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
