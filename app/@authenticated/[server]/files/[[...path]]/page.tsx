import { getServer } from '@/lib/backend';
import { currentUser } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import SFTPClient from 'ssh2-sftp-client';
import { FileEditor } from './components/file-editor';
import { FileTable } from './components/file-table';
import { Path } from './components/path';

type ServerProps = {
  params: Promise<{
    server: string;
    path: string[] | undefined;
  }>;
};

const FilesPage = async ({ params }: ServerProps) => {
  const { server: serverId, path } = await params;
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

  const flattenedPath = `/${path?.join('/') ?? ''}`;

  try {
    // Check if the path is a file
    const { isFile } = await sftp.stat(flattenedPath);

    if (isFile) {
      // If it's a file, download and display its content
      const fileContent = await sftp.get(flattenedPath);
      await sftp.end();

      // Display file content based on file type
      return (
        <div className="grid gap-4 p-4">
          <FileEditor value={fileContent.toString()} />
          <Path value={flattenedPath} />
        </div>
      );
    }

    // If it's a directory, list its contents
    const fileList = await sftp.list(flattenedPath);
    await sftp.end();

    return (
      <div className="grid gap-4 p-4">
        <FileTable data={fileList} path={flattenedPath} />
        <Path value={flattenedPath} />
      </div>
    );
  } catch (error) {
    console.error(error);
    await sftp.end();
    notFound();
  }
};

export default FilesPage;
