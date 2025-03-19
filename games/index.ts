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
    port: 2456,
  },
  {
    id: 'minecraft',
    name: 'Minecraft',
    image: MinecraftImage,
    description:
      'Minecraft is a sandbox game where you can build your own world.',
    port: 25565,
  },
  {
    id: 'valheim',
    name: 'Valheim',
    image: ValheimImage,
    description:
      'Valheim is a sandbox game where you can build your own world.',
    port: 8211,
  },
] as const;
