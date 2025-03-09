import { getSizes } from '@repo/backend';
import { CreateServerForm } from './components/create-server-form';

const CreatePage = async () => {
  const sizes = await getSizes();

  return <CreateServerForm sizes={sizes} />;
};

export default CreatePage;
