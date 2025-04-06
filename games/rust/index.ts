import image from './image.jpg';

export const rust = {
  id: 'rust',
  gamedigId: 'rust',
  name: 'Rust',
  enabled: false,
  image,
  description:
    'The only aim in Rust is to survive when everything on the island wants you to die.',
  ports: [
    // This is the default port for Rust, used for game traffic.
    {
      protocol: 'udp',
      from: 28015,
      to: 28015,
    },
    // This is the port for RCON
    {
      protocol: 'tcp',
      from: 28016,
      to: 28016,
    },
    // This port was mentioned in the dockerfile.
    {
      protocol: 'tcp',
      from: 28082,
      to: 28082,
    },
  ],
  requirements: {
    cpu: 4,
    memory: 8,
  },
} as const;
