import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@repo/design-system/components/ui/breadcrumb';
import type { Metadata } from 'next';
import { CreateServerButton } from './components/create-server-button';
import { ServerList } from './components/server-list';

const title = 'Acme Inc';
const description = 'My application.';

export const metadata: Metadata = {
  title,
  description,
};

const App = () => (
  <>
    <div className="flex items-center gap-2 p-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Home</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
    <div className="p-4 pt-0">
      <h2 className="font-bold text-2xl">Create a Server</h2>
      <CreateServerButton />
      <h2 className="font-bold text-2xl">Your Servers</h2>
      <ServerList />
    </div>
  </>
);

export default App;
