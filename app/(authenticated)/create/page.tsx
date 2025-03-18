import { getRegions, getSizes } from '@/lib/backend';
import { CreateServerForm } from './components/create-server-form';

const CreatePage = async () => {
  const [sizes, regions] = await Promise.all([getSizes(), getRegions()]);

  return <CreateServerForm sizes={sizes} regions={regions} />;
};

export default CreatePage;
