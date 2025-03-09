'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/design-system/ui/select';
import { useParams, useRouter } from 'next/navigation';

type ServerPickerProps = {
  data: {
    id: string;
    game: string;
  }[];
};

export const ServerPicker = ({ data }: ServerPickerProps) => {
  const params = useParams();
  const router = useRouter();

  const handleValueChange = (value: string) => {
    router.push(`/${value}`);
  };

  return (
    <Select
      value={params.server as string | undefined}
      onValueChange={handleValueChange}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a server" />
      </SelectTrigger>
      <SelectContent>
        {data.map((instance) => (
          <SelectItem key={instance.id} value={instance.id}>
            {instance.game}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
