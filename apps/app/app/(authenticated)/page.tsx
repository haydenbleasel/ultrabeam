import type { Metadata } from 'next';
import { CreateServerButton } from './components/create-server-button';
import { Header } from './components/header';

const title = 'Acme Inc';
const description = 'My application.';

export const metadata: Metadata = {
  title,
  description,
};

const App = () => {
  // const pages = await database.page.findMany();

  return (
    <>
      <Header pages={['Building Your Application']} page="Data Fetching" />
      <div className="p-4 pt-0">
        <CreateServerButton />
      </div>
    </>
  );
};

export default App;
