'use client';

import { createServer } from '@/actions/server/create';
import { Button } from '@repo/design-system/components/ui/button';
import { handleError } from '@repo/design-system/lib/utils';

export const CreateServerButton = () => {
  const handleCreateServer = async () => {
    try {
      const response = await createServer('minecraft', 'nyc3', 's-2vcpu-4gb');

      if ('error' in response) {
        throw new Error(response.error);
      }

      console.log(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  return <Button onClick={handleCreateServer}>Create Server</Button>;
};
