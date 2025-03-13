#!/bin/bash

# Update and install required dependencies
apt update && apt upgrade -y
apt install -y software-properties-common curl wget file unzip tar bzip2 gzip bsdmainutils python3 socat jq tmux lib32gcc-s1 steamcmd

# Create a dedicated user for Valheim
useradd -m -s /bin/bash valheim

# Switch to the Valheim user and install server
su - valheim << 'EOF'
mkdir ~/valheim
cd ~/valheim
steamcmd +login anonymous +force_install_dir ~/valheim +app_update 896660 validate +quit
EOF

# Create a systemd service to manage the Valheim server
cat <<EOT >> /etc/systemd/system/valheim.service
[Unit]
Description=Valheim Dedicated Server
After=network.target

[Service]
User=valheim
WorkingDirectory=/home/valheim/valheim
ExecStart=/home/valheim/valheim/valheim_server.x86_64 -name "MyValheimServer" -port 2456 -world "Dedicated" -password "mypassword" -public 1
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOT

# Enable and start the Valheim server
systemctl enable valheim
systemctl start valheim