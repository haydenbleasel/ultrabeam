import { database } from '@repo/database';
import { notFound } from 'next/navigation';

type ServerProps = {
  params: Promise<{
    server: string;
  }>;
};

const FilesPage = async ({ params }: ServerProps) => {
  const { server } = await params;

  const instance = await database.server.findFirst({
    where: { id: server },
  });

  if (!instance) {
    notFound();
  }

  return (
    <div className="p-4">
      <h1>Backups</h1>
      <pre>{JSON.stringify([], null, 2)}</pre>
    </div>
  );
};

export default FilesPage;
