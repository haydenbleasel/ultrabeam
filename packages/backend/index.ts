import { createApiClient } from 'dots-wrapper';

const DIGITAL_OCEAN_TOKEN = process.env.DIGITAL_OCEAN_TOKEN;

if (!DIGITAL_OCEAN_TOKEN) {
  throw new Error('DIGITAL_OCEAN_TOKEN is not set');
}

const dots = createApiClient({ token: DIGITAL_OCEAN_TOKEN });

export const createServer = async ({
  game,
  region,
  size,
  publicKey,
  cloudInitScript,
}: {
  game: string;
  region: string;
  size: string;
  publicKey: string;
  cloudInitScript: string;
}) => {
  const sshKeyResponse = await dots.sshKey.createSshKey({
    name: `ultrabeam-${game}-${Date.now()}`,
    public_key: publicKey.trim(),
  });

  const sshKeyId = sshKeyResponse.data.ssh_key.id;

  const response = await dots.droplet.createDroplet({
    name: `ultrabeam-${game}-${Date.now()}`,
    region,
    size,
    image: 'ubuntu-22-04-x64',
    user_data: cloudInitScript,
    ssh_keys: [sshKeyId],
    backups: true,
    monitoring: true,
    tags: ['ultrabeam', game],
  });

  return response.data.droplet.id;
};

export const getServer = async (id: number) => {
  const response = await dots.droplet.getDroplet({
    droplet_id: id,
  });

  return response.data.droplet;
};

export const deleteServer = async (id: number, sshKeyId: number) => {
  await dots.sshKey.destroySshKey({
    ssh_key_id: sshKeyId,
  });

  await dots.droplet.deleteDroplet({
    droplet_id: id,
  });
};

export const getBackups = async (id: number) => {
  const response = await dots.droplet.listDropletBackups({
    droplet_id: id,
  });

  return response.data.backups;
};
