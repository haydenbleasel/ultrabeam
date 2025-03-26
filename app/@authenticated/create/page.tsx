import { getRegions, getSizes } from '@/lib/backend';
import type { Metadata } from 'next';
import { CreateServerForm } from './components/create-server-form';

export const metadata: Metadata = {
  title: 'Create a new game server',
  description: "Let's spin up a new game server!",
};

const CreatePage = async () => {
  const [sizes, regions] = await Promise.all([getSizes(), getRegions()]);

  return <CreateServerForm sizes={sizes} regions={regions} />;
};

export default CreatePage;
