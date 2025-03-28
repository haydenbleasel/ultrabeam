import 'server-only';
export const sshInitScript = (publicKey: string) => `
#!/bin/bash
set -e

# Ensure .ssh directory exists
mkdir -p ~/.ssh
chmod 700 ~/.ssh

echo "${publicKey}" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
`;

export const bootstrapScript = `
#!/bin/bash
set -e

# Update and install required dependencies
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo apt install docker-compose`;

export const mountVolumeScript = `
#!/bin/bash
set -e

# Find the first unmounted disk that's not the root disk
DISK=$(lsblk -dn -o NAME,MOUNTPOINT | awk '$2 == "" {print "/dev/" $1}' | grep -v nvme0n1 | head -n 1)
echo "Detected disk: $DISK"

# Format the disk (if it's a new disk)
sudo mkfs -t ext4 "$DISK"

# Create a mount directory
sudo mkdir -p /mnt/gamedata

# Mount the disk
sudo mount "$DISK" /mnt/gamedata

# Set proper permissions for the mount point
sudo chmod 777 /mnt/gamedata

# Make it persistent after reboot
echo "$DISK /mnt/gamedata ext4 defaults,nofail 0 2" | sudo tee -a /etc/fstab`;
