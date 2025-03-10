'use client';

import { deleteGameServer } from '@/actions/server/delete';
import { handleError } from '@repo/design-system/lib/error';
import { Button } from '@repo/design-system/ui/button';
import { useRouter } from 'next/navigation';

type DeleteServerButtonProps = {
  serverId: string;
};

export const DeleteServerButton = ({ serverId }: DeleteServerButtonProps) => {
  const router = useRouter();

  const handleDeleteServer = async () => {
    try {
      const response = await deleteGameServer(serverId);

      if ('error' in response) {
        throw new Error(response.error);
      }

      router.push('/');
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Button type="submit" variant="destructive" onClick={handleDeleteServer}>
      Delete Server
    </Button>
  );
};
