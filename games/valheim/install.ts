import { gameDataDirectory } from '@/lib/consts';

export default (name: string, password: string, timezone: string) => `
#!/bin/bash
set -e

# Create directory structure
mkdir -p ${gameDataDirectory}/valheim/saves
mkdir -p ${gameDataDirectory}/valheim/server
mkdir -p ${gameDataDirectory}/valheim/backups

# Navigate to the game data directory
cd ${gameDataDirectory}

# Create docker-compose.yml file
cat > docker-compose.yml << 'EOF'
services:
  valheim:
    image: mbround18/valheim:latest
    ports:
      - 2456:2456/udp
      - 2457:2457/udp
      - 2458:2458/udp
    environment:
      - PORT=2456
      - NAME="${name}"
      - WORLD="Dedicated"
      - PASSWORD="${password}"
      - TZ=${timezone}
      - PUBLIC=1
      - AUTO_UPDATE=1
      - AUTO_UPDATE_SCHEDULE="0 1 * * *"
      - AUTO_BACKUP=1
      - AUTO_BACKUP_SCHEDULE="*/15 * * * *"
      - AUTO_BACKUP_REMOVE_OLD=1
      - AUTO_BACKUP_DAYS_TO_LIVE=3
      - AUTO_BACKUP_ON_UPDATE=1
      - AUTO_BACKUP_ON_SHUTDOWN=1
    volumes:
      - ./valheim/saves:/home/steam/.config/unity3d/IronGate/Valheim
      - ./valheim/server:/home/steam/valheim
      - ./valheim/backups:/home/steam/backups
EOF

echo "Valheim server has been installed."
`;
