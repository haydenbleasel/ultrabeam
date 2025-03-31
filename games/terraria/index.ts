import image from './image.jpg';

export const terraria = {
  id: 'terraria',
  gamedigId: 'terrariatshock',
  name: 'Terraria',
  enabled: true,
  image,
  description:
    'Dig, fight, explore, build! Nothing is impossible in this 2D adventure game.',
  ports: [
    // This is the default port for Terraria, used for game traffic.
    {
      protocol: 'tcp',
      from: 7777,
      to: 7777,
    },
  ],
  requirements: {
    cpu: 1,
    memory: 2,
  },
} as const;
