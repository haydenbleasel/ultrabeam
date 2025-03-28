import { getServer } from '@/lib/backend';
import { currentUser } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import SFTPClient from 'ssh2-sftp-client';
import FileTable from './components/file-table';

type ServerProps = {
  params: Promise<{
    server: string;
  }>;
};

const FilesPage = async ({ params }: ServerProps) => {
  const { server: serverId } = await params;
  const sftp = new SFTPClient();
  const user = await currentUser();
  const gameServer = await getServer(serverId);

  if (!user || !gameServer || !user.privateMetadata.privateKey) {
    notFound();
  }

  await sftp.connect({
    host: gameServer.publicIpAddress,
    port: 22,
    username: 'ubuntu',
    privateKey: user.privateMetadata.privateKey as string,
    readyTimeout: 10000,
  });

  const fileList = await sftp.list('/');

  await sftp.end();

  return (
    <div className="p-4">
      <FileTable data={fileList} />
    </div>
  );
};

export default FilesPage;
