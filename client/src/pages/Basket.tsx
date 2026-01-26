import { useEffect, useState } from 'react';
import BasketClient from './basket/BasketClient';
import Header from '../components/Header';
import Footer from '../components/Footer';

type BasketItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  brand?: string;
};

const Basket = () => {
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBasket = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/basket', {
          credentials: 'include', // VERY important for session cookies
        });

        if (!res.ok) {
          throw new Error('Failed to fetch basket');
        }

        const json = await res.json();
        setBasket(json.basket || []);
      } catch (err) {
        console.error('Basket fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBasket();
  }, []);

  if (loading) {
    return <p style={{ padding: '2rem' }}>Laddar varukorg…</p>;
  }

  return (
    <>
        <Header />

        <BasketClient initialBasket={basket} />

        <Footer />
    </>
    );
};

export default Basket;
