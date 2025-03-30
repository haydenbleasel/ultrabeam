import image from './image.jpg';

export const minecraft = {
  id: 'minecraft',
  gamedigId: 'minecraft',
  name: 'Minecraft',
  image,
  description:
    'Minecraft is a sandbox game where you can build your own world.',
  ports: [
    // This is the default port for Minecraft Java Edition, used for game traffic.
    {
      protocol: 'tcp',
      from: 25565,
      to: 25565,
    },
    // For Bedrock clients via a proxy like Geyser.
    {
      protocol: 'udp',
      from: 19132,
      to: 19133,
    },
  ],
} as const;
