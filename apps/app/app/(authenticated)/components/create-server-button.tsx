'use client';

import { createGameServer } from '@/actions/server/create';
import { handleError } from '@repo/design-system/lib/error';
import { Button } from '@repo/design-system/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/design-system/ui/select';
import { useRouter } from 'next/navigation';
import { type FormEventHandler, useState } from 'react';

export const CreateServerButton = () => {
  const [game, setGame] = useState<string>('minecraft');
  const [region, setRegion] = useState<string>('nyc3');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCreateServer: FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await createGameServer(
        game as never,
        region,
        's-2vcpu-4gb'
      );

      if ('error' in response) {
        throw new Error(response.error);
      }

      router.push(`/${response.id}`);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleCreateServer} className="flex gap-2">
      <Select value={game} onValueChange={setGame}>
        <SelectTrigger>
          <SelectValue placeholder="Select a game" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="minecraft">Minecraft</SelectItem>
          <SelectItem value="palworld">Palworld</SelectItem>
        </SelectContent>
      </Select>
      <Select value={region} onValueChange={setRegion}>
        <SelectTrigger>
          <SelectValue placeholder="Select a region" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="nyc3">New York</SelectItem>
          <SelectItem value="sfo3">San Francisco</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Server'}
      </Button>
    </form>
  );
};
