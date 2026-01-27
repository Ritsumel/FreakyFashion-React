import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductGrid from '../components/ProductGrid';
import type { Product } from '../types/Product';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const fetchSearch = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/search?q=${encodeURIComponent(query)}`,
          { cache: 'no-store' }
        );

        if (!res.ok) throw new Error('Search failed');

        const data = await res.json();
        setProducts(data.products);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearch();
  }, [query]);

  return (
    <>
      <Header />

      <main>
        <section id="search-results">
          {loading ? (
            <p style={{ padding: '2rem' }}>Söker…</p>
          ) : (
            <>
              <h1>
                Hittade {products.length} produkt
                {products.length !== 1 ? 'er' : ''}
              </h1>

              <ProductGrid products={products} />
            </>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Search;
