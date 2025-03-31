export const gameDataDirectory = '/mnt/gamedata';

export const statuses = {
  server: [
    {
      id: 'creating',
      title: 'Creating server',
      description: 'The server is being created.',
    },
    {
      id: 'attaching',
      title: 'Attaching disk and static IP',
      description: 'The disk and static IP are being attached to the server.',
    },
    {
      id: 'starting',
      title: 'The server is being started',
      description: 'Waiting for SSH to be available...',
    },
    {
      id: 'updatingPackages',
      title: 'Updating packages',
      description: 'Running apt update and apt upgrade...',
    },
    {
      id: 'installingDocker',
      title: 'Installing Docker',
      description: 'Docker is being installed...',
    },
    {
      id: 'mountingVolume',
      title: 'Mounting volume',
      description: 'Mounting the volume...',
    },
    {
      id: 'installingGame',
      title: 'Installing game',
      description: 'The game is being installed...',
    },
    {
      id: 'startingServer',
      title: 'Starting server',
      description: 'Starting the server...',
    },
    {
      id: 'ready',
      title: 'Server ready',
      description: 'The server is ready to use.',
    },
  ],
  disk: [
    {
      id: 'creating',
      title: 'Creating disk',
      description: 'The disk is being created.',
    },
    {
      id: 'provisioning',
      title: 'Provisioning disk',
      description: 'The disk is being provisioned.',
    },
    {
      id: 'attaching',
      title: 'Attaching disk',
      description: 'The disk is being attached to the server.',
    },
    {
      id: 'ready',
      title: 'Disk ready',
      description: 'The disk is ready to use.',
    },
  ],
  staticIp: [
    {
      id: 'creating',
      title: 'Creating static IP',
      description: 'The static IP is being created.',
    },
    {
      id: 'attaching',
      title: 'Attaching static IP',
      description: 'The static IP is being attached to the server.',
    },
    {
      id: 'ready',
      title: 'Static IP ready',
      description: 'The static IP is ready to use.',
    },
  ],
};
