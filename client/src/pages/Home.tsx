import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import Spots from '../components/Spots';
import ProductGrid from '../components/ProductGrid';
import type { Product } from '../types/Product';

type HeroType = {
  title: string;
  information: string;
  image: string;
  alt: string;
};

type Spot = {
  id: number;
  title: string;
  image: string;
  alt: string;
};

const Home = () => {
  const [hero, setHero] = useState<HeroType | null>(null);
  const [spots, setSpots] = useState<Spot[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/home', {
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error('Failed to load home data');
        }

        const data = await res.json();

        setHero(data.hero);
        setSpots(data.spots);
        setProducts(data.products);

      } catch (err) {
        console.error('Home fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHome();
  }, []);

  if (loading || !hero) return null;

  return (
    <>
      <Header />

      <main>
        <section id="showcase">
          <Hero hero={hero} />
          <Spots spots={spots} />
        </section>

        <section id="popular-products">
          <ProductGrid products={products} />
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Home;
