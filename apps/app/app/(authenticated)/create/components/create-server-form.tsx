'use client';

import { createGameServer } from '@/actions/server/create';
import { games } from '@/games';
import type { getSizes } from '@repo/backend';
import { getRegion } from '@repo/backend/utils';
import { handleError } from '@repo/design-system/lib/error';
import { Badge } from '@repo/design-system/ui/badge';
import { Button } from '@repo/design-system/ui/button';
import { Label } from '@repo/design-system/ui/label';
import { RadioGroup, RadioGroupItem } from '@repo/design-system/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/design-system/ui/select';
import {
  CheckIcon,
  CpuIcon,
  HardDriveIcon,
  MemoryStickIcon,
  MinusIcon,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { type FormEventHandler, useState } from 'react';
import { Globe } from './globe';

type CreateServerFormProps = {
  sizes: Awaited<ReturnType<typeof getSizes>>;
};

export const CreateServerForm = ({ sizes }: CreateServerFormProps) => {
  const [game, setGame] = useState<string>('minecraft');
  const [size, setSize] = useState<string>(sizes[0].slug);
  const [region, setRegion] = useState<string>(sizes[0].regions[0]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const selectedSize = sizes.find(({ slug }) => slug === size);

  const handleCreateServer: FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await createGameServer(game as never, region, size);

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
    <div className="grid grid-cols-2 items-start divide-x">
      <form onSubmit={handleCreateServer} className="grid gap-8 p-8">
        <div className="grid gap-1">
          <h2 className="font-bold text-2xl">Create Server</h2>
          <p className="text-muted-foreground text-sm">
            Choose a game and size to create a new server.
          </p>
        </div>
        <fieldset className="space-y-4">
          <div className="grid gap-2">
            <legend className="font-medium text-foreground text-sm leading-none">
              Game
            </legend>
            <RadioGroup
              className="flex gap-3"
              value={game}
              onValueChange={setGame}
            >
              {games.map((game) => (
                <label key={game.id} htmlFor={game.id}>
                  <RadioGroupItem
                    id={game.id}
                    value={game.id}
                    className="peer sr-only after:absolute after:inset-0"
                  />
                  <Image
                    src={game.image}
                    alt={game.name}
                    width={600}
                    height={600}
                    className="relative cursor-pointer overflow-hidden rounded-md border border-input shadow-xs outline-none transition-[color,box-shadow] peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50 peer-data-disabled:cursor-not-allowed peer-data-[state=checked]:border-ring peer-data-[state=checked]:bg-accent peer-data-disabled:opacity-50"
                  />
                  <span className="group mt-2 flex items-center gap-1 peer-data-[state=unchecked]:text-muted-foreground/70">
                    <CheckIcon
                      size={16}
                      className="group-peer-data-[state=unchecked]:hidden"
                      aria-hidden="true"
                    />
                    <MinusIcon
                      size={16}
                      className="group-peer-data-[state=checked]:hidden"
                      aria-hidden="true"
                    />
                    <span className="font-medium text-xs">{game.name}</span>
                  </span>
                </label>
              ))}
            </RadioGroup>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="size">Size</Label>
            <Select value={size} onValueChange={setSize}>
              <SelectTrigger id="size">
                <SelectValue placeholder="Select a size" />
              </SelectTrigger>
              <SelectContent>
                {sizes.map((size) => (
                  <SelectItem key={size.slug} value={size.slug}>
                    <div className="flex items-center gap-1">
                      <Badge variant="secondary">
                        <MemoryStickIcon size={16} />
                        {size.memory}GB
                      </Badge>
                      <Badge variant="secondary">
                        <CpuIcon size={16} />
                        {size.vcpus} vCPUs
                      </Badge>
                      <Badge variant="secondary">
                        <HardDriveIcon size={16} />
                        {size.disk}GB
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="region">Region</Label>
            <Select
              value={region}
              onValueChange={setRegion}
              disabled={!selectedSize}
            >
              <SelectTrigger id="region">
                <SelectValue placeholder="Select a region" />
              </SelectTrigger>
              <SelectContent>
                {selectedSize?.regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {getRegion(region)?.flag} {getRegion(region)?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </fieldset>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? 'Creating...'
            : `Create Server for $${selectedSize?.price_monthly}/month`}
        </Button>
      </form>
      <div className="relative flex h-full items-center justify-center">
        <Globe lat={getRegion(region)?.lat} long={getRegion(region)?.lng} />
      </div>
    </div>
  );
};
