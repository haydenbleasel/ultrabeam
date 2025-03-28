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
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo apt install -y docker-compose`;

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

export const cloudWatchScript = (instanceName: string) => `
#!/bin/bash
set -e

# Install and configure CloudWatch Agent
curl -O https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb
sudo mkdir -p /opt/aws/amazon-cloudwatch-agent/etc

# Write the CloudWatch Agent config to disk (customize as needed)
cat <<EOF | sudo tee /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json
{
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/log/syslog",
            "log_group_name": "/lightsail/ultrabeam/${instanceName}/syslog",
            "log_stream_name": "${instanceName}"
          }
        ]
      }
    }
  }
}
EOF

# Start the CloudWatch Agent
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \\
  -a fetch-config \\
  -m ec2 \\
  -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json \\
  -s
`;
