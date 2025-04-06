'use client';

import { deleteServer } from '@/actions/server/delete';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { handleError } from '@/lib/utils';
import { CircleAlertIcon, TrashIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type DeleteButtonProps = {
  serverId: string;
};

export const DeleteButton = ({ serverId }: DeleteButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteServer = async () => {
    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true);

      const response = await deleteServer(serverId);

      if ('error' in response) {
        throw new Error(response.error);
      }

      router.push('/');
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="flex w-full items-center gap-2">
        <TrashIcon className="text-destructive" size={16} aria-hidden="true" />
        <span>Delete</span>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <CircleAlertIcon className="opacity-80" size={16} />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">Are you sure?</DialogTitle>
            <DialogDescription className="sm:text-center">
              This action cannot be undone. This will delete both the server and
              all the save data associated with it.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-5">
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="flex-1">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              className="flex-1"
              onClick={handleDeleteServer}
              disabled={isLoading}
              variant="destructive"
            >
              Delete
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
