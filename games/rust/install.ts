import { gameDataDirectory } from '@/lib/consts';

const SERVER_PORT = 28015;
const RCON_PORT = 28016;
const MAX_PLAYERS = 50;
const WORLD_SIZE = 3500;
const SEED = 12345;
const UPDATE_CHECKING = 1;
const OXYDE_ENABLED = 1;

export default (name: string, password: string, timezone: string) => `
#!/bin/bash
set -e

# Create directory structure
mkdir -p ${gameDataDirectory}/rust/{server,backups}

# Navigate to the game data directory
cd ${gameDataDirectory}

# Create docker-compose.yml file
cat > docker-compose.yml << EOF
services:
  rust:
    image: didstopia/rust-server:latest
    ports:
      - "${SERVER_PORT}:${SERVER_PORT}/udp"
      - "${RCON_PORT}:${RCON_PORT}"
    environment:
      - RUST_SERVER_NAME="${name}"
      - RUST_SERVER_DESCRIPTION="${name} - managed by Ultrabeam"
      - RUST_SERVER_PORT="${SERVER_PORT}"
      - RUST_RCON_PORT="${RCON_PORT}"
      - RUST_RCON_PASSWORD="${password}"
      - RUST_SERVER_MAXPLAYERS="${MAX_PLAYERS}"
      - RUST_SERVER_WORLDSIZE="${WORLD_SIZE}"
      - RUST_SERVER_SEED="${SEED}"
      - RUST_UPDATE_CHECKING="${UPDATE_CHECKING}"
      - RUST_OXIDE_ENABLED="${OXYDE_ENABLED}"
      - TZ="${timezone}"
    volumes:
      - ./rust/server:/steamcmd/rust
      - ./rust/backups:/steamcmd/rust/backups
    restart: unless-stopped
EOF

echo "Rust server has been installed."
`;
