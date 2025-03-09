'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/design-system/components/ui/select';
import { usePathname, useRouter } from 'next/navigation';

type ServerPagePickerProps = {
  data: {
    id: string;
    game: string;
  };
  status: string;
};

export const ServerPagePicker = ({ data, status }: ServerPagePickerProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleValueChange = (value: string) => {
    router.push(value);
  };

  return (
    <Select
      value={pathname}
      onValueChange={handleValueChange}
      disabled={status !== 'active'}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a page" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={`/${data.id}`}>Overview</SelectItem>
        <SelectItem value={`/${data.id}/files`}>Files</SelectItem>
        <SelectItem value={`/${data.id}/console`}>Console</SelectItem>
        <SelectItem value={`/${data.id}/backups`}>Backups</SelectItem>
        <SelectItem value={`/${data.id}/settings`}>Settings</SelectItem>
        <SelectItem value={`/${data.id}/danger`}>Danger</SelectItem>
      </SelectContent>
    </Select>
  );
};
