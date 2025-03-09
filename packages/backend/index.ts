import { createApiClient } from 'dots-wrapper';
import type { regions } from './config';
import { keys } from './keys';

const dots = createApiClient({ token: keys().DIGITALOCEAN_TOKEN });

export const getSizes = async () => {
  const response = await dots.size.listSizes({ per_page: 100 });

  return response.data.sizes.filter((size) => size.available);
};

export const createServer = async ({
  game,
  region,
  size,
  publicKey,
  cloudInitScript,
}: {
  game: string;
  region: (typeof regions)[number]['value'];
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
