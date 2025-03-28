import 'server-only';
import { env } from './env';
import { getLogGroup } from './lightsail';

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
sudo apt install -y docker-compose
rm get-docker.sh

# Add current user to the docker group
sudo usermod -aG docker $USER

# Apply new group (if script runs interactively)
newgrp docker`;

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

# Configure AWS credentials
sudo mkdir -p /root/.aws
cat <<EOF | sudo tee /root/.aws/credentials
[AmazonCloudWatchAgent]
aws_access_key_id=${env.AWS_ACCESS_KEY}
aws_secret_access_key=${env.AWS_SECRET_KEY}
EOF

# Create a log file for docker compose logs
sudo mkdir -p /var/log/docker
sudo touch /var/log/docker/compose.log
sudo chmod 666 /var/log/docker/compose.log

# Create a script to collect docker logs and rotate them
cat <<EOF | sudo tee /usr/local/bin/collect-docker-logs.sh
#!/bin/bash
# Get docker compose logs
docker compose logs --tail=100 >> /var/log/docker/compose.log

# Keep the log file size under control (max 10MB)
if [ \$(stat -c%s "/var/log/docker/compose.log") -gt 10485760 ]; then
  # Truncate the file to the last 5MB
  tail -c 5242880 /var/log/docker/compose.log > /var/log/docker/compose.log.tmp
  mv /var/log/docker/compose.log.tmp /var/log/docker/compose.log
fi
EOF

# Make the script executable
sudo chmod +x /usr/local/bin/collect-docker-logs.sh

# Set up a cron job to run the script every minute
(crontab -l 2>/dev/null || echo "") | grep -v "collect-docker-logs.sh" | { cat; echo "* * * * * /usr/local/bin/collect-docker-logs.sh"; } | crontab -

# Write the CloudWatch Agent config to disk
cat <<EOF | sudo tee /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json
{
  "agent": {
    "run_as_user": "root"
  },
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/log/docker/compose.log",
            "log_group_name": "${getLogGroup(instanceName)}",
            "log_stream_name": "${instanceName}",
            "timezone": "UTC"
          }
        ]
      }
    },
    "force_flush_interval": 5
  }
}
EOF

# Start the CloudWatch Agent with debug logging
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \\
  -a fetch-config \\
  -m ec2 \\
  -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json \\
  -s

# Verify agent is running and check its status
sleep 5
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -m ec2 -a status
`;
