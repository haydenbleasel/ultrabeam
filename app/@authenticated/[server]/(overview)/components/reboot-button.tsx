'use client';
import { rebootServer } from '@/actions/server/reboot';
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
import { CircleAlertIcon, RotateCcwIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type RebootButtonProps = {
  serverId: string;
};

export const RebootButton = ({ serverId }: RebootButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleRebootServer = async () => {
    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true);

      const response = await rebootServer(serverId);

      if ('error' in response) {
        throw new Error(response.error);
      }

      toast.success('Server rebooting...');
      setOpen(false);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex w-full items-center gap-2">
        <RotateCcwIcon size={16} className="opacity-60" aria-hidden="true" />
        <span>Reboot</span>
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
              This action will restart the server, which may take a few minutes
              to complete.
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
              onClick={handleRebootServer}
              disabled={isLoading}
            >
              Reboot
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
