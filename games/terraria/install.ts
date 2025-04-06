import { gameDataDirectory } from '@/lib/consts';

const WORLD_SIZE = '2';
const DIFFICULTY = '0';
const MAX_PLAYERS = '8';
const PORT = '7777';

export default (name: string, password: string, timezone: string) => `
#!/bin/bash
set -e

# Create directory structure
mkdir -p ${gameDataDirectory}/terraria/{worlds,config,logs}

# Navigate to the game data directory
cd ${gameDataDirectory}

# Create docker-compose.yml file
cat > docker-compose.yml << EOF
services:
  terraria:
    image: ryshe/terraria:latest
    container_name: terraria-server
    ports:
      - "${PORT}:${PORT}/tcp"
    environment:
      - WORLD_FILENAME=${name}.wld
      - WORLD_SIZE=${WORLD_SIZE}
      - DIFFICULTY=${DIFFICULTY}
      - MAXPLAYERS=${MAX_PLAYERS}
      - SERVER_PORT=${PORT}
      - SERVER_PASSWORD=${password}
      - AUTOCREATE=1
      - TZ=${timezone}
    volumes:
      - ./terraria/worlds:/root/.local/share/Terraria/Worlds
      - ./terraria/config:/config
      - ./terraria/logs:/tshock/logs
    stdin_open: true
    tty: true
    restart: unless-stopped
EOF

echo "Terraria server has been installed."
`;
