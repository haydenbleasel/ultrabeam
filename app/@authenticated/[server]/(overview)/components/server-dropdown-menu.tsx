'use client';

import { Button } from '@/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import { EllipsisIcon, RotateCcwIcon, ScalingIcon } from 'lucide-react';
import { DeleteServerButton } from './delete-server-button';

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
        <DropdownMenuItem>
          <RotateCcwIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>Reboot</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ScalingIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>Resize</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        variant="destructive"
        onSelect={(e) => e.preventDefault()}
      >
        <DeleteServerButton serverId={id} />
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
