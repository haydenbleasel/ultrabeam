import MinecraftImage from './minecraft/image.jpg';
import PalworldImage from './palworld/image.jpg';
import ValheimImage from './valheim/image.jpg';

export const games = [
  {
    id: 'palworld',
    name: 'Palworld',
    image: PalworldImage,
    description:
      'Fight, farm, build and work alongside mysterious creatures called "Pals".',
    ports: [
      {
        protocol: 'udp',
        from: 2456,
        to: 2458,
      },
    ],
  },
  {
    id: 'minecraft',
    name: 'Minecraft',
    image: MinecraftImage,
    description:
      'Minecraft is a sandbox game where you can build your own world.',
    ports: [
      {
        protocol: 'udp',
        from: 25565,
        to: 25565,
      },
    ],
  },
  {
    id: 'valheim',
    name: 'Valheim',
    image: ValheimImage,
    description:
      'Valheim is a sandbox game where you can build your own world.',
    ports: [
      {
        protocol: 'udp',
        from: 8211,
        to: 8211,
      },
    ],
  },
] as const;
