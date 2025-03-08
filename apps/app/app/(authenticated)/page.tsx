import type { Metadata } from 'next';
import { Header } from './components/header';

const title = 'Acme Inc';
const description = 'My application.';

export const metadata: Metadata = {
  title,
  description,
};

const App = async () => {
  // const pages = await database.page.findMany();

  return (
    <>
      <Header pages={['Building Your Application']} page="Data Fetching" />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {[
            { id: '1', name: 'Page 1' },
            { id: '2', name: 'Page 2' },
          ].map((page) => (
            <div key={page.id} className="aspect-video rounded-xl bg-muted/50">
              {page.name}
            </div>
          ))}
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
    </>
  );
};

export default App;
