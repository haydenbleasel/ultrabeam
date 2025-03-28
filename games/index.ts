import EnshroudedImage from './enshrouded/image.jpg';
import MinecraftImage from './minecraft/image.jpg';
import PalworldImage from './palworld/image.jpg';
import RustImage from './rust/image.jpg';
import TerrariaImage from './terraria/image.jpg';
import ValheimImage from './valheim/image.jpg';

export const games = [
  {
    id: 'palworld',
    gamedigId: 'palworld',
    name: 'Palworld',
    image: PalworldImage,
    description:
      'Fight, farm, build and work alongside mysterious creatures called "Pals".',
    ports: [
      {
        protocol: 'udp',
        from: 8211,
        to: 8211,
      },
      {
        protocol: 'udp',
        from: 27015,
        to: 27015,
      },
    ],
  },
  {
    id: 'minecraft',
    gamedigId: 'minecraft',
    name: 'Minecraft',
    image: MinecraftImage,
    description:
      'Minecraft is a sandbox game where you can build your own world.',
    ports: [
      {
        protocol: 'tcp',
        from: 25565,
        to: 25565,
      },
    ],
  },
  {
    id: 'valheim',
    gamedigId: 'valheim',
    name: 'Valheim',
    image: ValheimImage,
    description:
      'A Viking-themed action RPG where you explore, craft, build, and survive.',
    ports: [
      {
        protocol: 'udp',
        from: 2456,
        to: 2458,
      },
    ],
  },
  {
    id: 'enshrouded',
    gamedigId: 'enshrouded',
    name: 'Enshrouded',
    image: EnshroudedImage,
    description:
      'A game of survival, crafting, and action on a sprawling voxel-based continent.',
    ports: [
      {
        protocol: 'udp',
        from: 15637,
        to: 15637,
      },
      {
        protocol: 'udp',
        from: 15636,
        to: 15636,
      },
    ],
  },
  {
    id: 'rust',
    gamedigId: 'rust',
    name: 'Rust',
    image: RustImage,
    description:
      'The only aim in Rust is to survive when everything on the island wants you to die.',
    ports: [
      {
        protocol: 'udp',
        from: 28015,
        to: 28015,
      },
      {
        protocol: 'tcp',
        from: 28016,
        to: 28016,
      },
    ],
  },
  {
    id: 'terraria',
    gamedigId: 'terrariatshock',
    name: 'Terraria',
    image: TerrariaImage,
    description:
      'Dig, fight, explore, build! Nothing is impossible in this 2D adventure game.',
    ports: [
      {
        protocol: 'tcp',
        from: 7777,
        to: 7777,
      },
    ],
  },
] as const;
