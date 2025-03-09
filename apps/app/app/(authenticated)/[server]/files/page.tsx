import { getServer } from '@repo/backend';
import { database } from '@repo/database';
import { notFound } from 'next/navigation';
import SFTPClient from 'ssh2-sftp-client';
import FileTable from './components/file-table';

type ServerProps = {
  params: Promise<{
    server: string;
  }>;
};

const FilesPage = async ({ params }: ServerProps) => {
  const { server } = await params;
  const sftp = new SFTPClient();

  const instance = await database.server.findFirst({
    where: { id: server },
  });

  if (!instance) {
    notFound();
  }

  const gameServer = await getServer(instance.dropletId);

  await sftp.connect({
    host: gameServer.networks.v4[0].ip_address,
    port: 22,
    username: 'root',
    privateKey: Buffer.from(instance.privateKey.trim()),
  });

  const fileList = await sftp.list('/');
  await sftp.end();

  return (
    <div className="p-4">
      <h1>Files</h1>
      <FileTable data={fileList} />
    </div>
  );
};

export default FilesPage;
