import 'server-only';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { games } from '../games';

export const getCloudInitScript = async (
  game: (typeof games)[number]['id']
) => {
  const cloudInitPath = path.join(process.cwd(), 'games', game, 'install.sh');

  if (!(await fs.stat(cloudInitPath).catch(() => false))) {
    throw new Error(`No Cloud-Init script found for game: ${game}`);
  }

  return await fs.readFile(cloudInitPath, 'utf-8');
};

export const sshInitScript = (publicKey: string) =>
  `echo "${publicKey}" >> ~/.ssh/authorized_keys`;

export const bootstrapScript = `
# Update and install required dependencies
apt update && apt upgrade -y

# Create a dedicated user for the game
useradd -m -s /bin/bash ultrabeam`;

export const mountVolumeScript = (diskPath: string) => `
#!/bin/bash
set -e

# Find attached disk
lsblk

# Format the disk (if it's a new disk)
sudo mkfs -t ext4 ${diskPath}

# Create a mount directory
sudo mkdir -p /mnt/gamedata

# Mount the disk
sudo mount ${diskPath} /mnt/gamedata

# Make it persistent after reboot
echo '${diskPath} /mnt/gamedata ext4 defaults,nofail 0 2' | sudo tee -a /etc/fstab

# Change ownership of the mount directory
chown -R ultrabeam:ultrabeam /mnt/gamedata`;
