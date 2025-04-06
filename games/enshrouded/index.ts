import image from './image.jpg';

export const enshrouded = {
  id: 'enshrouded',
  gamedigId: 'enshrouded',
  name: 'Enshrouded',
  enabled: false,
  image,
  description:
    'A game of survival, crafting, and action on a sprawling voxel-based continent.',
  ports: [
    // This is the default port for Enshrouded, used for game traffic.
    {
      protocol: 'udp',
      from: 15636,
      to: 15636,
    },
    // This is the port for Steam Query
    {
      protocol: 'udp',
      from: 27015,
      to: 27015,
    },
  ],
  requirements: {
    cpu: 2,
    memory: 4,
  },
} as const;
