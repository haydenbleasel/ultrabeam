import { gameDataDirectory } from '@/lib/consts';

export default (name: string, password: string, timezone: string) => `
#!/bin/bash
set -e

# Create directory structure
mkdir -p ${gameDataDirectory}/enshrouded/{saves,server,backups}

# Navigate to the game data directory
cd ${gameDataDirectory}

# Create docker-compose.yml file
cat > docker-compose.yml << EOF
services:
  enshrouded:
    image: sknnr/enshrouded-dedicated-server:latest
    ports:
      - "15636:15636/udp"
    environment:
      - SERVER_NAME="${name}"
      - SERVER_PASSWORD="${password}"
      - TZ="${timezone}"
    volumes:
      - ./enshrouded/saves:/home/steam/enshrouded/savegame
      - ./enshrouded/server:/home/steam/enshrouded
      - ./enshrouded/backups:/home/steam/backups
    restart: unless-stopped
EOF

echo "Enshrouded server has been installed."
`;
