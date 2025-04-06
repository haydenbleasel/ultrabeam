'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisIcon, ScalingIcon } from 'lucide-react';
import { DeleteButton } from './delete-button';
import { RebootButton } from './reboot-button';

type ServerDropdownMenuProps = {
  id: string;
};

export const ServerDropdownMenu = ({ id }: ServerDropdownMenuProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon">
        <EllipsisIcon size={16} className="opacity-60" aria-hidden="true" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuGroup>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <RebootButton serverId={id} />
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()} disabled>
          <ScalingIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>Resize</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        variant="destructive"
        onSelect={(e) => e.preventDefault()}
      >
        <DeleteButton serverId={id} />
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
