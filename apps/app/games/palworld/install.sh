#!/bin/bash

# Update and install required dependencies
apt update && apt upgrade -y
apt install -y software-properties-common curl wget file unzip tar bzip2 gzip bsdmainutils python3 socat jq tmux lib32gcc-s1 steamcmd

# Create a dedicated user for Palworld
useradd -m -s /bin/bash palworld

# Switch to the Palworld user and install the server
su - palworld << 'EOF'
mkdir ~/palworld
cd ~/palworld
steamcmd +login anonymous +force_install_dir ~/palworld +app_update 2394010 validate +quit
EOF

# Create a systemd service to manage the Palworld server
cat <<EOT >> /etc/systemd/system/palworld.service
[Unit]
Description=Palworld Dedicated Server
After=network.target

[Service]
User=palworld
WorkingDirectory=/home/palworld/palworld
ExecStart=/home/palworld/palworld/PalServer.sh -savedir "/mnt/gamedata/palworld" -log
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOT

# Enable and start the Palworld server
systemctl enable palworld
systemctl start palworld