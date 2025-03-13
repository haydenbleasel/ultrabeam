'use client';

import { createGameServer } from '@/actions/server/create';
import { games } from '@/games';
import type { getRegions, getSizes } from '@repo/backend';
import { formatBytes } from '@repo/backend/utils';
import { handleError } from '@repo/design-system/lib/error';
import { Button } from '@repo/design-system/ui/button';
import { Input } from '@repo/design-system/ui/input';
import { Label } from '@repo/design-system/ui/label';
import { RadioGroup, RadioGroupItem } from '@repo/design-system/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@repo/design-system/ui/select';
import { CheckIcon, Loader2Icon, MinusIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { type FormEventHandler, useState } from 'react';
import { Globe } from './globe';

type CreateServerFormProps = {
  sizes: Awaited<ReturnType<typeof getSizes>>;
  regions: Awaited<ReturnType<typeof getRegions>>;
};

export const CreateServerForm = ({ sizes, regions }: CreateServerFormProps) => {
  const [name, setName] = useState<string>('');
  const [game, setGame] = useState<string>('minecraft');
  const recommendedSizes = sizes.filter(
    ({ cpu, memory }) => cpu === 2 && memory === 4
  );
  const [size, setSize] = useState<string>(recommendedSizes[0].id);
  const selectedSize = sizes.find(({ id }) => id === size);
  const [region, setRegion] = useState<string>(regions[0].id);
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
        name,
        game as never,
        region,
        size
      );

      if ('error' in response) {
        throw new Error(response.error);
      }

      router.push(`/${response.id}`);
    } catch (error) {
      handleError(error);
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
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="My server"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
                  <span className="group mt-2 flex items-center gap-1 peer-data-[state=checked]:text-primary peer-data-[state=unchecked]:text-muted-foreground/70">
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
              <SelectTrigger
                id="size"
                className="[&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0 [&>span_svg]:text-muted-foreground/80"
              >
                <SelectValue placeholder="Select a size" />
              </SelectTrigger>
              <SelectContent className="[&_*[role=option]>span>svg]:shrink-0 [&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8">
                <SelectGroup>
                  <SelectLabel className="ps-2">Recommended</SelectLabel>
                  {recommendedSizes.map((size) => (
                    <SelectItem key={size.id} value={size.id}>
                      <div className="flex items-center gap-2">
                        {size.name}
                        <p className="text-muted-foreground text-xs">
                          {size.memory}GB RAM • {size.cpu} vCPUs •{' '}
                          {formatBytes(size.storage * 1024 * 1024 * 1024)} SSD
                        </p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel className="ps-2">Other</SelectLabel>
                  {sizes
                    .filter((size) => !recommendedSizes.includes(size))
                    .map((size) => (
                      <SelectItem key={size.id} value={size.id}>
                        <div className="flex items-center gap-2">
                          {size.name}
                          <p className="text-muted-foreground text-xs">
                            {size.memory}GB RAM • {size.cpu} vCPUs •{' '}
                            {formatBytes(size.storage * 1024 * 1024 * 1024)} SSD
                          </p>
                        </div>
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {selectedSize && (
            <div className="grid gap-2">
              <Label htmlFor="region">Region</Label>
              <Select
                value={region}
                onValueChange={setRegion}
                disabled={!selectedSize}
              >
                <SelectTrigger
                  id="region"
                  className="[&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0 [&>span_svg]:text-muted-foreground/80"
                >
                  <SelectValue placeholder="Select a region" />
                </SelectTrigger>
                <SelectContent className="[&_*[role=option]>span>svg]:shrink-0 [&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8">
                  {regions.map((region) => (
                    <SelectItem key={region.id} value={region.id}>
                      {region.flag} {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </fieldset>
        <Button className="w-fit" type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2Icon size={16} className="animate-spin" />
          ) : (
            `Create server for $${selectedSize?.price}/month`
          )}
        </Button>
      </form>
      <div className="relative flex h-full items-center justify-center">
        <Globe
          lat={regions.find((r) => r.id === region)?.lat ?? 0}
          long={regions.find((r) => r.id === region)?.lng ?? 0}
        />
      </div>
    </div>
  );
};
