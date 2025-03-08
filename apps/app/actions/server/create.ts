'use server';

type Game = 'minecraft' | 'palworld';

const DIGITAL_OCEAN_TOKEN = process.env.DIGITAL_OCEAN_TOKEN;

if (!DIGITAL_OCEAN_TOKEN) {
  throw new Error('DIGITAL_OCEAN_TOKEN is not set');
}

export const createServer = async (
  game: Game,
  region: string,
  size: string
): Promise<{ data: object } | { error: string }> => {
  try {
    const response = await fetch('https://api.digitalocean.com/v2/droplets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${DIGITAL_OCEAN_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `ultrabeam-${game}-${Date.now()}`, // Unique name
        region, // e.g., "nyc3", "sfo3"
        size, // e.g., "s-2vcpu-4gb"
        image: `${game}-docker-image`, // Set this up in DigitalOcean
        ssh_keys: [], // Optional: Add SSH keys for admin access
        backups: true, // Enable automatic backups
        monitoring: true,
        tags: ['ultrabeam', game], // Tagging for organization
      }),
    });

    if (!response.ok) {
      const message = await response.text();
      return { error: message };
    }

    const data = await response.json();

    return { data };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return { error: message };
  }
};
