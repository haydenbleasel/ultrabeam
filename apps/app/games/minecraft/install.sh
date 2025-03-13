#!/bin/bash

# Update and install required dependencies
apt update && apt upgrade -y
apt install -y openjdk-17-jre-headless wget screen

# Create a dedicated Minecraft user
useradd -m -s /bin/bash minecraft

# Switch to the Minecraft user and install the server
su - minecraft << 'EOF'
mkdir ~/minecraft
cd ~/minecraft
wget -O server.jar https://download.minecraft.net/server.jar
echo "eula=true" > eula.txt
EOF

# Create a systemd service to manage the Minecraft server
cat <<EOT >> /etc/systemd/system/minecraft.service
[Unit]
Description=Minecraft Server
After=network.target

[Service]
User=minecraft
WorkingDirectory=/home/minecraft/minecraft
ExecStart=/usr/bin/java -Xmx2G -Xms1G -jar server.jar --world-dir /mnt/gamedata/minecraft nogui
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOT

# Enable and start the Minecraft server
systemctl enable minecraft
systemctl start minecraft