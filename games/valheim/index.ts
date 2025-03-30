import image from './image.jpg';

export const valheim = {
  id: 'valheim',
  gamedigId: 'valheim',
  name: 'Valheim',
  image,
  description:
    'A Viking-themed action RPG where you explore, craft, build, and survive.',
  ports: [
    // This is the default port for Valheim, used for game traffic.
    {
      protocol: 'udp',
      from: 2456,
      to: 2458,
    },
  ],
} as const;
