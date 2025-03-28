import { Globe } from '@/components/globe';
import { regionData } from '@/lib/backend';
import type { Marker } from 'cobe';

const markers: Marker[] = Object.values(regionData).map((region) => ({
  location: [region.lat, region.lng],
  size: 0.1,
}));

export const Deployments = () => <Globe markers={markers} size={376} />;
