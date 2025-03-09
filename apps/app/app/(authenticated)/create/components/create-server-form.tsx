'use client';

import { createGameServer } from '@/actions/server/create';
import type { getSizes } from '@repo/backend';
import { handleError } from '@repo/design-system/lib/error';
import { Badge } from '@repo/design-system/ui/badge';
import { Button } from '@repo/design-system/ui/button';
import { Label } from '@repo/design-system/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/design-system/ui/select';
import createGlobe from 'cobe';
import { useRouter } from 'next/navigation';
import { type FormEventHandler, useEffect, useRef, useState } from 'react';

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
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) {
      return;
    }

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [1, 1, 1],
      markerColor: [0.9, 0.9, 0.9],
      glowColor: [1, 1, 1],
      markers: [
        // longitude latitude
        { location: [37.7595, -122.4367], size: 0.03 },
        { location: [40.7128, -74.006], size: 0.1 },
      ],
      onRender: (state) => {
        // Called on every animation frame.
        // `state` will be an empty object, return updated params.
        state.phi = phi;
        phi += 0.001;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <div className="grid grid-cols-2 items-start divide-x">
      <form onSubmit={handleCreateServer} className="grid gap-4 p-8">
        <div className="grid gap-1">
          <h2 className="font-bold text-2xl">Create Server</h2>
          <p className="text-muted-foreground text-sm">
            Choose a game and size to create a new server.
          </p>
        </div>
        <fieldset className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="game">Game</Label>
            <Select value={game} onValueChange={setGame}>
              <SelectTrigger id="game">
                <SelectValue placeholder="Select a game" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minecraft">Minecraft</SelectItem>
                <SelectItem value="palworld">Palworld</SelectItem>
              </SelectContent>
            </Select>
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
                    {size.description}
                    <Badge variant="secondary" className="ml-2">
                      {size.memory}GB
                    </Badge>
                    <Badge variant="secondary" className="ml-2">
                      {size.vcpus} vCPUs
                    </Badge>
                    <Badge variant="secondary" className="ml-2">
                      {size.disk}GB
                    </Badge>
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
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? 'Creating...'
              : `Create Server for $${selectedSize?.price_monthly}/month`}
          </Button>
        </fieldset>
        <details>
          <summary>json</summary>
          <pre>{JSON.stringify(sizes, null, 2)}</pre>
        </details>
      </form>
      <div className="relative flex items-center justify-center">
        <canvas ref={canvasRef} className="size-[600px]" />
      </div>
    </div>
  );
};
