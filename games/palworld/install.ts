import { gameDataDirectory } from '@/lib/consts';

export default (name: string, password: string, timezone: string) => `
#!/bin/bash
set -e

# Create directory structure
mkdir -p ${gameDataDirectory}/palworld/data
mkdir -p ${gameDataDirectory}/palworld/backups

# Navigate to the game data directory
cd ${gameDataDirectory}

# Create docker-compose.yml file
cat > docker-compose.yml << 'EOF'
version: "3"
services:
  palworld:
    image: thijsvanloef/palworld-server-docker:latest
    ports:
      - 8211:8211/udp
      - 27015:27015/udp
    environment:
      - SERVER_NAME=${name}
      - PUID=1000
      - PGID=1000
      - PORT=8211
      - PLAYERS=16
      - ADMIN_PASSWORD=${password}
      - SERVER_PASSWORD=${password}
      - COMMUNITY=false
      - TZ=${timezone}
      - BACKUP_ENABLED=true
      - BACKUP_CRON_EXPRESSION="0 */6 * * *"
      - BACKUP_RETENTION=3
      - AUTO_UPDATE_ENABLED=true
      - AUTO_UPDATE_CRON_EXPRESSION="0 4 * * *"
      - RCON_ENABLED=true
      - RCON_PORT=27015
    volumes:
      - ./palworld/data:/palworld
      - ./palworld/backups:/backups
    restart: unless-stopped
EOF

echo "Palworld server has been installed."
`;
