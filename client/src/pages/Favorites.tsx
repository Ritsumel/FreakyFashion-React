import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductGrid from '../components/ProductGrid';
import { useBookmarks } from '../context/BookmarkContext';
import type { Product } from '../types/Product';
import { useEffect, useState } from 'react';

const Favorites = () => {
  const { bookmarked } = useBookmarks();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();
        setProducts(data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <main>
          <p style={{ padding: '2rem' }}>Laddar favoriter...</p>
        </main>
        <Footer />
      </>
    );
  }

  const favoriteProducts = products.filter(product =>
    bookmarked.has(product.id)
  );

  return (
    <>
      <Header />

      <main>
        <section className="favorites">
          <h1>Favoriter</h1>

          {favoriteProducts.length === 0 ? (
            <p className='p1'>Du har inga favoriter ännu <i className="fa-solid fa-heart-crack"></i></p>
          ) : (
            <ProductGrid products={favoriteProducts} />
          )}
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Favorites;
