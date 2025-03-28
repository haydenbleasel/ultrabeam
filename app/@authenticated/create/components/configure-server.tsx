import { Globe } from '@/components/globe';
import type { getRegions, getSizes } from '@/lib/backend';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/ui/select';
import type { Marker } from 'cobe';
import { useMemo } from 'react';

type ConfigureServerProps = {
  name: string;
  setName: (name: string) => void;
  password: string;
  setPassword: (password: string) => void;
  size: string;
  setSize: (size: string) => void;
  region: string;
  setRegion: (region: string) => void;
  sizes: Awaited<ReturnType<typeof getSizes>>;
  regions: Awaited<ReturnType<typeof getRegions>>;
  recommendedSizes: Awaited<ReturnType<typeof getSizes>>;
};

export const ConfigureServer = ({
  name,
  setName,
  password,
  setPassword,
  size,
  setSize,
  region,
  setRegion,
  regions,
  sizes,
  recommendedSizes,
}: ConfigureServerProps) => {
  const selectedRegion = regions.find((r) => r.id === region);

  const globeProps = useMemo(() => {
    return {
      lat: selectedRegion?.lat ?? 0,
      long: selectedRegion?.lng ?? 0,
      markers: regions.map((reg) => ({
        location: [reg.lat, reg.lng],
        size: reg.id === region ? 0.15 : 0,
      })) as Marker[],
    };
  }, [region, regions, selectedRegion]);

  return (
    <div className="grid grid-cols-2 items-start gap-6">
      <div className="grid gap-4">
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
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
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
                        {size.memory}GB RAM • {size.cpu} vCPUs
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
                          {size.memory}GB RAM • {size.cpu} vCPUs
                        </p>
                      </div>
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {size && (
          <div className="grid gap-2">
            <Label htmlFor="region">Region</Label>
            <Select value={region} onValueChange={setRegion} disabled={!size}>
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
      </div>
      <div className="flex h-[288px] w-full items-center justify-center">
        <Globe
          lat={globeProps.lat}
          long={globeProps.long}
          markers={globeProps.markers}
          size={347}
        />
      </div>
    </div>
  );
};
