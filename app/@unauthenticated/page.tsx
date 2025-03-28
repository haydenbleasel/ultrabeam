import { Features } from './components/features';
import { Games } from './components/games';
import { Hero } from './components/hero';

const Home = () => (
  <div className="grid gap-16 py-16">
    {/* <Header /> */}
    <Hero />
    <Games />
    <Features />
  </div>
);

export default Home;
