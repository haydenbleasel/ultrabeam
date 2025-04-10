import image from './image.jpg';

export const valheim = {
  id: 'valheim',
  gamedigId: 'valheim',
  name: 'Valheim',
  enabled: true,
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
  requirements: {
    cpu: 2,
    memory: 4,
  },
} as const;
