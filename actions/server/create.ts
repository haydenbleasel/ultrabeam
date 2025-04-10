'use server';

import crypto from 'node:crypto';
import { games } from '@/games';
import {
  lightsail,
  runSSHCommand,
  updateInstanceStatus,
  waitForDiskStatus,
  waitForInstanceStatus,
  waitForStaticIpAttached,
} from '@/lib/lightsail';
import { parseError } from '@/lib/observability/error';
import { log } from '@/lib/observability/log';
import {
  dockerInstallScript,
  mountVolumeScript,
  sshInitScript,
  startServerScript,
  updatePackagesScript,
} from '@/lib/scripts';
import {
  AllocateStaticIpCommand,
  AttachDiskCommand,
  AttachStaticIpCommand,
  CreateDiskCommand,
  CreateInstancesCommand,
  CreateKeyPairCommand,
  OpenInstancePublicPortsCommand,
} from '@aws-sdk/client-lightsail';
import { clerkClient, currentUser } from '@clerk/nextjs/server';
import { waitUntil } from '@vercel/functions';

const generateId = () => crypto.randomBytes(8).toString('hex');

type CreateServerResponse =
  | {
      id: string;
    }
  | {
      error: string;
    };

const createKeyPair = async (userId: string) => {
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);

  if (!user) {
    throw new Error('User not found');
  }

  // Create a key pair
  const createKeyPairResponse = await lightsail.send(
    new CreateKeyPairCommand({ keyPairName: generateId() })
  );

  if (!createKeyPairResponse.publicKeyBase64) {
    throw new Error('Failed to create key pair: no public key');
  }

  if (!createKeyPairResponse.privateKeyBase64) {
    throw new Error('Failed to create key pair: no private key');
  }

  const data = {
    privateKey: createKeyPairResponse.privateKeyBase64,
    publicKey: createKeyPairResponse.publicKeyBase64,
    keyPairName: createKeyPairResponse.keyPair?.name,
  };

  console.log('Updating user metadata', data);
  await clerk.users.updateUserMetadata(user.id, {
    privateMetadata: data,
  });

  return data;
};

const setupInstance = async (
  instanceName: string,
  gameInfo: (typeof games)[number]
) => {
  await waitForInstanceStatus(instanceName, 'running');

  for (const port of gameInfo.ports) {
    await lightsail.send(
      new OpenInstancePublicPortsCommand({
        instanceName,
        portInfo: {
          fromPort: port.from,
          toPort: port.to,
          protocol: port.protocol,
        },
      })
    );
  }
};

const createDisk = async (instanceName: string, availabilityZone: string) => {
  const createDiskResponse = await lightsail.send(
    new CreateDiskCommand({
      diskName: generateId(),
      availabilityZone,
      sizeInGb: 20,
    })
  );

  const diskName = createDiskResponse.operations?.at(0)?.resourceName;

  if (!diskName) {
    throw new Error('Disk name not found');
  }

  await updateInstanceStatus(instanceName, 'diskStatus', 'provisioning');

  await waitForDiskStatus(diskName, 'available');

  await updateInstanceStatus(instanceName, 'diskStatus', 'ready');

  return diskName;
};

const createStaticIp = async () => {
  const allocateStaticIpResponse = await lightsail.send(
    new AllocateStaticIpCommand({ staticIpName: generateId() })
  );

  const staticIpName = allocateStaticIpResponse.operations?.at(0)?.resourceName;

  if (!staticIpName) {
    throw new Error('Failed to allocate static IP address');
  }

  return staticIpName;
};

const attachStaticIp = async (staticIpName: string, instanceName: string) => {
  await lightsail.send(
    new AttachStaticIpCommand({
      staticIpName,
      instanceName,
    })
  );

  await updateInstanceStatus(instanceName, 'staticIpStatus', 'attaching');

  const ipAddress = await waitForStaticIpAttached(staticIpName);

  await updateInstanceStatus(instanceName, 'staticIpStatus', 'ready');

  return ipAddress;
};

const attachDisk = async (diskName: string, instanceName: string) => {
  await lightsail.send(
    new AttachDiskCommand({
      diskName,
      instanceName,
      diskPath: '/dev/xvdf',
    })
  );

  await updateInstanceStatus(instanceName, 'diskStatus', 'attaching');
  await waitForDiskStatus(diskName, 'in-use');
  await updateInstanceStatus(instanceName, 'diskStatus', 'ready');
};

const waitForSSH = async (
  ipAddress: string,
  privateKey: string,
  maxAttempts = 30
) => {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await runSSHCommand(ipAddress, privateKey, 'echo "SSH connection test"');
      return true;
    } catch (error) {
      if (i === maxAttempts - 1) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 10 seconds between attempts
    }
  }
  return false;
};

const runScripts = async (
  instanceName: string,
  privateKey: string,
  game: string,
  password: string,
  ipAddress: string
) => {
  // Get the game script
  const installModule = await import(`../../games/${game}/install`);
  const installScript = installModule.default;

  if (typeof installScript !== 'function') {
    throw new Error(`Invalid install script for game: ${game}`);
  }

  await updateInstanceStatus(instanceName, 'serverStatus', 'updatingPackages');
  await runSSHCommand(ipAddress, privateKey, updatePackagesScript);

  await updateInstanceStatus(instanceName, 'serverStatus', 'installingDocker');
  await runSSHCommand(ipAddress, privateKey, dockerInstallScript);

  await updateInstanceStatus(instanceName, 'serverStatus', 'mountingVolume');
  await runSSHCommand(ipAddress, privateKey, mountVolumeScript);

  await updateInstanceStatus(instanceName, 'serverStatus', 'installingGame');
  await runSSHCommand(
    ipAddress,
    privateKey,
    installScript(instanceName, password, 'America/New_York')
  );

  await updateInstanceStatus(instanceName, 'serverStatus', 'startingServer');
  await runSSHCommand(ipAddress, privateKey, startServerScript);
};

export const createServer = async (
  name: string,
  password: string,
  game: (typeof games)[number]['id'],
  region: string,
  size: string
): Promise<CreateServerResponse> => {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error('User not found');
    }

    const gameInfo = games.find(({ id }) => id === game);

    if (!gameInfo) {
      throw new Error('Game info not found');
    }

    let publicKey = user.privateMetadata.publicKey as string | undefined;
    let privateKey = user.privateMetadata.privateKey as string | undefined;
    let keyPairName = user.privateMetadata.keyPairName as string | undefined;

    console.log({
      publicKey: publicKey?.length,
      privateKey: privateKey?.length,
      keyPairName: keyPairName?.length,
    });

    if (!privateKey || !publicKey || !keyPairName) {
      const response = await createKeyPair(user.id);

      publicKey = response.publicKey;
      privateKey = response.privateKey;
      keyPairName = response.keyPairName;
    }

    // Create the instance
    const instance = await lightsail.send(
      new CreateInstancesCommand({
        instanceNames: [generateId()],
        availabilityZone: `${region}a`,
        blueprintId: 'ubuntu_22_04',
        bundleId: size,
        userData: sshInitScript(publicKey),
        keyPairName,
        ipAddressType: 'ipv4',
        tags: [
          { key: 'name', value: name },
          { key: 'password', value: password },
          { key: 'user', value: user.id },
          { key: 'ultrabeam', value: 'true' },
          { key: 'game', value: game },
          { key: 'serverStatus', value: 'creating' },
          { key: 'diskStatus', value: 'creating' },
          { key: 'staticIpStatus', value: 'creating' },
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

    const instanceName = instance.operations?.at(0)?.resourceName;

    if (!instanceName) {
      throw new Error('Instance ID not found');
    }

    const promise = async () => {
      try {
        const [diskName, staticIpName] = await Promise.all([
          createDisk(instanceName, `${region}a`),
          createStaticIp(),
          setupInstance(instanceName, gameInfo),
        ]);

        await updateInstanceStatus(instanceName, 'serverStatus', 'attaching');

        const [ipAddress] = await Promise.all([
          attachStaticIp(staticIpName, instanceName),
          attachDisk(diskName, instanceName),
        ]);

        await updateInstanceStatus(instanceName, 'serverStatus', 'starting');

        // Wait for SSH to be available
        await waitForSSH(ipAddress, privateKey);

        await runScripts(instanceName, privateKey, game, password, ipAddress);

        await updateInstanceStatus(instanceName, 'serverStatus', 'ready');

        log.info(`Server created: ${instanceName}`);
      } catch (error) {
        const message = parseError(error);

        console.error(message);

        await updateInstanceStatus(instanceName, 'serverStatus', 'failed');
      }
    };

    waitUntil(promise());

    return { id: instanceName };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return { error: message };
  }
};
