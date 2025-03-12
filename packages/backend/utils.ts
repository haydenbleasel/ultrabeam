export const regions = [
  {
    slug: 'nyc',
    name: 'New York',
    flag: '🇺🇸',
    lat: 40.7128,
    lng: -74.006,
  },
  {
    slug: 'ams',
    name: 'Amsterdam',
    flag: '🇳🇱',
    lat: 52.372775,
    lng: 4.892222,
  },
  {
    slug: 'lon',
    name: 'London',
    flag: '🇬🇧',
    lat: 51.5074,
    lng: -0.0795,
  },
  {
    slug: 'fra',
    name: 'Frankfurt',
    flag: '🇩🇪',
    lat: 50.1109,
    lng: 8.6821,
  },
  {
    slug: 'sfo',
    name: 'San Francisco',
    flag: '🇺🇸',
    lat: 37.7749,
    lng: -122.4194,
  },
  {
    slug: 'syd',
    name: 'Sydney',
    flag: '🇦🇺',
    lat: -33.8688,
    lng: 151.2153,
  },
  {
    slug: 'sgp',
    name: 'Singapore',
    flag: '🇸🇬',
    lat: 1.3521,
    lng: 103.8198,
  },
  {
    slug: 'tor',
    name: 'Toronto',
    flag: '🇨🇦',
    lat: 43.65107,
    lng: -79.347015,
  },
  {
    slug: 'blr',
    name: 'Bangalore',
    flag: '🇮🇳',
    lat: 12.9716,
    lng: 77.5946,
  },
];

export const getRegion = (region: string) =>
  regions.find((r) => region.startsWith(r.slug));

export const formatBytes = (bytes: number) => {
  let newBytes = bytes;
  let i = 0;

  while (newBytes > 1024) {
    newBytes /= 1024;
    i++;
  }

  return `${newBytes.toFixed(2)} ${['B', 'KB', 'MB', 'GB', 'TB', 'PB'][i]}`;
};
