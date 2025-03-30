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
  },
  {
    id: 'minecraft',
    gamedigId: 'minecraft',
    name: 'Minecraft',
    image: MinecraftImage,
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
  },
  {
    id: 'valheim',
    gamedigId: 'valheim',
    name: 'Valheim',
    image: ValheimImage,
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
  },
  {
    id: 'enshrouded',
    gamedigId: 'enshrouded',
    name: 'Enshrouded',
    image: EnshroudedImage,
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
  },
  {
    id: 'rust',
    gamedigId: 'rust',
    name: 'Rust',
    image: RustImage,
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
      // This is the default port for Terraria, used for game traffic.
      {
        protocol: 'tcp',
        from: 7777,
        to: 7777,
      },
    ],
  },
] as const;
