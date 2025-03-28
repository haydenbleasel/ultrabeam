export default (name: string, password: string, timezone: string) => `
#!/bin/bash
set -e

# Create directory structure
mkdir -p /mnt/gamedata/minecraft/data
mkdir -p /mnt/gamedata/minecraft/backups

# Navigate to the game data directory
cd /mnt/gamedata

# Create docker-compose.yml file
cat > docker-compose.yml << 'EOF'
services:
  minecraft:
    image: itzg/minecraft-server:latest
    ports:
      - 25565:25565
    environment:
      - EULA=TRUE
      - SERVER_NAME=${name}
      - DIFFICULTY=normal
      - ALLOW_NETHER=true
      - MODE=survival
      - MOTD=${name} - Powered by Ultrabeam
      - MEMORY=4G
      - TZ=${timezone}
      - ENABLE_RCON=true
      - RCON_PASSWORD=${password}
      - OVERRIDE_SERVER_PROPERTIES=true
      - ENABLE_COMMAND_BLOCK=true
      - SPAWN_PROTECTION=0
      - MAX_TICK_TIME=60000
      - VIEW_DISTANCE=10
      - ONLINE_MODE=true
      - ENFORCE_WHITELIST=false
      - MAX_PLAYERS=20
      - SPAWN_ANIMALS=true
      - SPAWN_MONSTERS=true
      - SPAWN_NPCS=true
      - GENERATE_STRUCTURES=true
      - MAX_WORLD_SIZE=10000
      - ALLOW_FLIGHT=false
      - LEVEL_TYPE=default
      - PVP=true
      - SNOOPER_ENABLED=true
      - MAX_BUILD_HEIGHT=256
      - FORCE_GAMEMODE=false
      - HARDCORE=false
      - WHITE_LIST=false
      - ENABLE_AUTOPAUSE=false
      - BACKUP_FREQ=24
      - BACKUP_RETENTION=5
    volumes:
      - ./minecraft/data:/data
      - ./minecraft/backups:/backups
    restart: unless-stopped
EOF

# Start the server
docker-compose up -d

echo "Minecraft server has been installed and started."
`;
