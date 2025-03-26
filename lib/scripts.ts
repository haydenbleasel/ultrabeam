import 'server-only';

export const sshInitScript = (publicKey: string) => `
#!/bin/bash
set -e

echo "${publicKey}" >> ~/.ssh/authorized_keys
`;

export const bootstrapScript = `
#!/bin/bash
set -e

# Update and install required dependencies
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo apt install docker-compose

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
