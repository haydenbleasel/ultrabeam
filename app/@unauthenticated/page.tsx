import { Features } from './components/features';
import { Games } from './components/games';
import { Header } from './components/header';
import { Hero } from './components/hero';

const Home = () => (
  <div className="grid gap-16 py-4">
    <Header />
    <Hero />
    <Games />
    <Features />
  </div>
);

export default Home;
