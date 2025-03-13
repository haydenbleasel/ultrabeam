import {
  AttachDiskCommand,
  CreateDiskCommand,
  CreateInstanceSnapshotCommand,
  CreateInstancesCommand,
  CreateKeyPairCommand,
  DeleteDiskCommand,
  DeleteInstanceCommand,
  DeleteKeyPairCommand,
  GetBundlesCommand,
  GetInstanceCommand,
  GetInstanceSnapshotsCommand,
  GetRegionsCommand,
  LightsailClient,
  RebootInstanceCommand,
  StopInstanceCommand,
} from '@aws-sdk/client-lightsail';
import { nanoid } from 'nanoid';
import { keys } from './keys';

const lightsail = new LightsailClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: keys().AWS_ACCESS_KEY,
    secretAccessKey: keys().AWS_SECRET_KEY,
  },
});

export const getSizes = async () => {
  const response = await lightsail.send(new GetBundlesCommand({}));
  const sizes: {
    id: string;
    name: string;
    price: number;
    cpu: number;
    memory: number;
    storage: number;
  }[] = [];
  const supportedSizes = response.bundles?.filter(
    (bundle) =>
      bundle.isActive &&
      bundle.supportedPlatforms?.includes('LINUX_UNIX') &&
      bundle.publicIpv4AddressCount
  );

  const parseName = (name: string) => {
    if (name === 'Xlarge') {
      return 'XL';
    }

    return name.replace(/(\d+)Xlarge/g, '$1XL');
  };

  for (const bundle of supportedSizes ?? []) {
    sizes.push({
      id: bundle.bundleId ?? '',
      name: parseName(bundle.name ?? ''),
      price: bundle.price ?? 0,
      cpu: bundle.cpuCount ?? 0,
      memory: bundle.ramSizeInGb ?? 0,
      storage: bundle.diskSizeInGb ?? 0,
    });
  }

  return sizes;
};

const regionData = {
  'us-east-1': {
    // N. Virginia
    lat: 37.7749,
    lng: -77.3754,
    flag: '🇺🇸',
  },
  'us-east-2': {
    // Ohio
    lat: 40.4173,
    lng: -82.9071,
    flag: '🇺🇸',
  },
  'us-west-1': {
    // N. California
    lat: 37.7749,
    lng: -122.4194,
    flag: '🇺🇸',
  },
  'us-west-2': {
    // Oregon
    lat: 45.5051,
    lng: -122.675,
    flag: '🇺🇸',
  },
  'af-south-1': {
    // Cape Town
    lat: -33.9249,
    lng: 18.4241,
    flag: '🇿🇦',
  },
  'ap-east-1': {
    // Hong Kong
    lat: 22.3193,
    lng: 114.1694,
    flag: '🇭🇰',
  },
  'ap-south-1': {
    // Mumbai
    lat: 19.076,
    lng: 72.8777,
    flag: '🇮🇳',
  },
  'ap-northeast-1': {
    // Tokyo
    lat: 35.6762,
    lng: 139.6503,
    flag: '🇯🇵',
  },
  'ap-northeast-2': {
    // Seoul
    lat: 37.5665,
    lng: 126.978,
    flag: '🇰🇷',
  },
  'ap-northeast-3': {
    // Osaka
    lat: 34.6937,
    lng: 135.5022,
    flag: '🇯🇵',
  },
  'ap-southeast-1': {
    // Singapore
    lat: 1.3521,
    lng: 103.8198,
    flag: '🇸🇬',
  },
  'ap-southeast-2': {
    // Sydney
    lat: -33.8688,
    lng: 151.2093,
    flag: '🇦🇺',
  },
  'ca-central-1': {
    // Central Canada
    lat: 45.5017,
    lng: -73.5673,
    flag: '🇨🇦',
  },
  'eu-central-1': {
    // Frankfurt
    lat: 50.1109,
    lng: 8.6821,
    flag: '🇩🇪',
  },
  'eu-west-1': {
    // Ireland
    lat: 53.3498,
    lng: -6.2603,
    flag: '🇮🇪',
  },
  'eu-west-2': {
    // London
    lat: 51.5074,
    lng: -0.1278,
    flag: '🇬🇧',
  },
  'eu-west-3': {
    // Paris
    lat: 48.8566,
    lng: 2.3522,
    flag: '🇫🇷',
  },
  'eu-north-1': {
    // Stockholm
    lat: 59.3293,
    lng: 18.0686,
    flag: '🇸🇪',
  },
  'eu-south-1': {
    // Milan
    lat: 45.4642,
    lng: 9.19,
    flag: '🇮🇹',
  },
  'me-south-1': {
    // Bahrain
    lat: 26.0667,
    lng: 50.5577,
    flag: '🇧🇭',
  },
  'sa-east-1': {
    // São Paulo
    lat: -23.5505,
    lng: -46.6333,
    flag: '🇧🇷',
  },
};

const sshInitScript = (publicKey: string) =>
  `echo "${publicKey}" >> ~/.ssh/authorized_keys`;

const mountVolumeScript = `
#!/bin/bash

# Update system
apt update && apt upgrade -y

# Format the disk if not already formatted
if ! lsblk | grep -q xvdf; then
  mkfs.ext4 /dev/xvdf
fi

# Create a mount point
mkdir -p /mnt/gamedata

# Mount the volume
mount /dev/xvdf /mnt/gamedata

# Ensure it mounts automatically on reboot
echo "/dev/xvdf /mnt/gamedata ext4 defaults,nofail 0 2" >> /etc/fstab

# Change ownership to the game server user (e.g., valheim)
chown -R valheim:valheim /mnt/gamedata`;

export const getRegions = async () => {
  const response = await lightsail.send(new GetRegionsCommand({}));
  const regions: {
    id: string;
    name: string;
    flag: string;
    lat: number;
    lng: number;
  }[] = [];

  for (const region of response.regions ?? []) {
    const data = regionData[region.name as keyof typeof regionData] ?? {
      lat: 0,
      lng: 0,
    };

    regions.push({
      id: region.name ?? '',
      name: region.displayName ?? '',
      flag: data.flag,
      lat: data.lat,
      lng: data.lng,
    });
  }

  return regions;
};

export const createServer = async ({
  game,
  region,
  size,
  cloudInitScript,
}: {
  game: string;
  region: string;
  size: string;
  cloudInitScript: string;
}) => {
  const id = nanoid();
  const suffix = `ultrabeam-${game}-${id}`;
  const serverName = `server-${suffix}`;
  const keyPairName = `key-${suffix}`;
  const diskName = `disk-${suffix}`;

  // Create a key pair
  const createKeyPairResponse = await lightsail.send(
    new CreateKeyPairCommand({ keyPairName })
  );

  if (!createKeyPairResponse.publicKeyBase64) {
    throw new Error('Failed to create key pair: no public key');
  }

  // Create the instance
  const createInstanceResponse = await lightsail.send(
    new CreateInstancesCommand({
      instanceNames: [serverName],
      availabilityZone: `${region}a`,
      blueprintId: 'ubuntu_22_04',
      bundleId: size,
      userData: [
        sshInitScript(createKeyPairResponse.publicKeyBase64),
        mountVolumeScript,
        cloudInitScript,
      ].join('\n'),
      keyPairName,
      ipAddressType: 'ipv4',
      tags: [
        { key: 'ultrabeam', value: 'true' },
        { key: 'game', value: game },
      ],
      addOns: [
        {
          addOnType: 'AutoSnapshot',
          autoSnapshotAddOnRequest: {
            snapshotTimeOfDay: '06:00',
          },
        },
      ],
    })
  );

  // Create a block storage disk
  await lightsail.send(
    new CreateDiskCommand({
      diskName,
      availabilityZone: `${region}a`,
      sizeInGb: 20,
    })
  );

  // Attach the disk to the instance
  await lightsail.send(
    new AttachDiskCommand({
      diskName,
      instanceName: serverName,
      diskPath: '/dev/xvdf',
    })
  );

  const backendId = createInstanceResponse.operations?.[0]?.resourceName;

  if (!backendId) {
    throw new Error('Failed to create server: no backend id');
  }

  return {
    backendId,
    privateKey: createKeyPairResponse.privateKeyBase64,
    keyPairName,
    serverName,
    diskName,
  };
};

export const getServer = async (id: string) => {
  const response = await lightsail.send(
    new GetInstanceCommand({
      instanceName: id,
    })
  );

  return response.instance;
};

export const deleteServer = async (
  instanceName: string,
  keyPairName: string,
  diskName: string
) => {
  await lightsail.send(
    new DeleteKeyPairCommand({
      keyPairName,
    })
  );

  await lightsail.send(
    new DeleteInstanceCommand({
      instanceName,
    })
  );

  await lightsail.send(
    new DeleteDiskCommand({
      diskName,
    })
  );
};

export const getBackups = async (instanceName: string) => {
  const response = await lightsail.send(new GetInstanceSnapshotsCommand());

  // Filter snapshots that belong to the given instance
  const instanceSnapshots = response.instanceSnapshots?.filter(
    (snapshot) => snapshot.fromInstanceName === instanceName
  );

  return instanceSnapshots;
};

export const resizeServer = async (instanceName: string, size: string) => {
  console.log(`Stopping instance: ${instanceName}...`);
  await lightsail.send(new StopInstanceCommand({ instanceName }));

  console.log('Taking a snapshot of the instance...');
  await lightsail.send(
    new CreateInstanceSnapshotCommand({
      instanceName,
      instanceSnapshotName: `${instanceName}-${Date.now()}`,
    })
  );

  console.log('Creating a new instance with the new size...');
  await createServer({
    game: 'test',
    region: 'us-east-1',
    size: size,
    cloudInitScript: '',
  });

  console.log('Deleting the old instance...');
  await lightsail.send(
    new DeleteInstanceCommand({
      instanceName: instanceName,
    })
  );
};

export const rebootServer = async (id: string) => {
  await lightsail.send(new RebootInstanceCommand({ instanceName: id }));
};
