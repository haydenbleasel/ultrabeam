import image from './image.jpg';

export const palworld = {
  id: 'palworld',
  gamedigId: 'palworld',
  name: 'Palworld',
  image,
  description:
    'Fight, farm, build and work alongside mysterious creatures called "Pals".',
  ports: [
    // This is the default port for Palworld, used for game traffic.
    {
      protocol: 'udp',
      from: 8211,
      to: 8211,
    },
    // This is the port for Steam Query
    {
      protocol: 'udp',
      from: 27015,
      to: 27015,
    },
    // This is the port for RCON
    {
      protocol: 'tcp',
      from: 25575,
      to: 25575,
    },
  ],
  requirements: {
    cpu: 2,
    memory: 4,
  },
} as const;
