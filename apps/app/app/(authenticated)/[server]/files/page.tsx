import { database } from '@repo/database';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import SFTPClient from 'ssh2-sftp-client';

type ServerProps = {
  params: Promise<{
    server: string;
  }>;
};

const FilesPage = async ({ params }: ServerProps) => {
  const { server } = await params;
  const headersList = await headers();

  const instance = await database.server.findFirst({
    where: { id: server },
  });

  if (!instance) {
    notFound();
  }

  const sftp = new SFTPClient();
  const privateKey = instance.privateKey.replace(/\\n/g, '\n');

  await sftp.connect({
    host: headersList.get('x-forwarded-for') ?? '127.0.0.1',
    username: 'ubuntu',
    privateKey,
  });

  const fileList = await sftp.list('/');
  await sftp.end();

  return (
    <div className="p-4">
      <h1>Files</h1>
      <pre>{JSON.stringify(fileList, null, 2)}</pre>
    </div>
  );
};

export default FilesPage;
