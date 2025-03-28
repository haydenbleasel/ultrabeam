import 'server-only';
import { env } from '@/lib/env';
import {
  type DiskState,
  GetDiskCommand,
  GetInstanceCommand,
  type InstanceState,
  LightsailClient,
} from '@aws-sdk/client-lightsail';
import { Client } from 'ssh2';

export const lightsail = new LightsailClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY,
    secretAccessKey: env.AWS_SECRET_KEY,
  },
});

export const waitForInstanceStatus = (
  instanceName: string,
  status: InstanceState['name']
) => {
  console.log(`Waiting for instance ${instanceName} to be ready...`);

  return new Promise<void>((resolve, reject) => {
    const checkInstanceState = async () => {
      const instanceResponse = await lightsail.send(
        new GetInstanceCommand({
          instanceName,
        })
      );

      const state = instanceResponse.instance?.state?.name;

      if (state === 'error') {
        reject('Something went wrong with the instance.');
      } else if (state === status) {
        console.log(`Instance ${instanceName} is now ${status}.`);
        resolve();
      } else {
        console.log(`Instance state: ${state}. Waiting...`);
        // Wait for 10 seconds before checking again
        setTimeout(checkInstanceState, 10000);
      }
    };

    checkInstanceState();
  });
};

export const waitForDiskStatus = (diskName: string, status: DiskState) => {
  console.log(`Waiting for disk ${diskName} to be attached...`);

  return new Promise<void>((resolve, reject) => {
    const checkDiskStatus = async () => {
      const response = await lightsail.send(
        new GetDiskCommand({
          diskName,
        })
      );

      const state = response.disk?.state;

      if (state === 'error') {
        reject('Something went wrong with the disk.');
      } else if (state === status) {
        console.log(`Disk ${diskName} is now ${status}.`);
        resolve();
      } else {
        console.log(`Disk state: ${state}. Waiting...`);
        setTimeout(checkDiskStatus, 10000);
      }
    };

    checkDiskStatus();
  });
};

export const getLogGroup = (instanceName: string) =>
  `/lightsail/ultrabeam/${instanceName}/docker-compose`;

export const runSSHCommand = async (
  ip: string,
  privateKey: string,
  command: string
) => {
  const ssh = new Client();
  return await new Promise<string>((resolve, reject) => {
    const sshTimeout = setTimeout(
      () => {
        reject(new Error('SSH command timed out'));
        ssh.end();
      },
      10 * 60 * 1000
    ); // 10 minutes

    let output = '';

    ssh
      .on('ready', () => {
        console.log('SSH Connection ready');

        ssh.exec('bash -s', (err, stream) => {
          if (err) {
            reject(err);
            return;
          }

          stream
            .on('close', (code: number, signal: string) => {
              console.log(`Command exited with code ${code}`);
              clearTimeout(sshTimeout);
              ssh.end();
              resolve(output);
            })
            .on('data', (data: Buffer) => {
              const text = data.toString();
              output += text;
              console.log(`STDOUT: ${text}`);
            })
            .stderr.on('data', (data: Buffer) => {
              const text = data.toString();
              output += text;
              console.error(`STDERR: ${text}`);
            });

          stream.write(`${command}\n`);
          stream.end();
        });
      })
      .on('error', (err) => {
        reject(err);
      })
      .connect({
        host: ip,
        username: 'ubuntu',
        privateKey,
        port: 22,
      });
  });
};
