import image from './image.jpg';

export const terraria = {
  id: 'terraria',
  gamedigId: 'terrariatshock',
  name: 'Terraria',
  enabled: false,
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
    // This port was mentioned in the dockerfile.
    {
      protocol: 'tcp',
      from: 7878,
      to: 7878,
    },
  ],
  requirements: {
    cpu: 1,
    memory: 2,
  },
} as const;
