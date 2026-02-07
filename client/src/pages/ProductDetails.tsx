import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useBookmarks } from '../context/BookmarkContext';
import { useBasket } from '../context/BasketContext';

interface Product {
  id: number;
  name: string;
  brand: string;
  description: string;
  price: number;
  image: string;
  alt: string;
  slug: string;
}

const ProductDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const { bookmarked, toggleBookmark } = useBookmarks();
  const { addToBasket } = useBasket();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // use BasketContext instead of fetch
  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await addToBasket({
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand,
      });
    } catch (err) {
      console.error(err);
      alert('Kunde inte lägga till i varukorgen');
    }
  };

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/products/${slug}`
        );

        if (!res.ok) {
          throw new Error('Failed to fetch product');
        }

        const data = await res.json();
        setProduct(data.product);
        setRelatedProducts(data.relatedProducts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <>
        <Header />
        <main>
          <p style={{ padding: '2rem' }}>Laddar produkt...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <main>
          <p style={{ padding: '2rem' }}>Produkten hittades inte.</p>
        </main>
        <Footer />
      </>
    );
  }

  const chunkedProducts: Product[][] = [];
  for (let i = 0; i < relatedProducts.length; i += 3) {
    chunkedProducts.push(relatedProducts.slice(i, i + 3));
  }

  return (
    <>
      <Header />

      <main>
        <section id="product-details">
          <div className="parent">
            <div className="details-card-image">
              <img
                src={product.image || '/images/freakyfashion-placeholder.png'}
                alt={product.alt}
              />
              <button
                type="button"
                className={`bookmark-tag ${
                  bookmarked.has(product.id) ? 'is-active' : ''
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleBookmark(product.id);
                }}
              >
                <i className="fa-regular fa-heart"></i>
              </button>
            </div>

            <div className="info">
              <h2>{product.name}</h2>
              <h6>{product.brand}</h6>
              <p className="text-box">{product.description}</p>
              <p className="price">{product.price} SEK</p>

              <button
                type="button"
                className="btn-theme"
                onClick={handleAddToCart}
              >
                Lägg i varukorg
              </button>
            </div>
          </div>

          {/* Carousel unchanged */}
          <div className="carousel">
            <h1>Liknande Produkter</h1>
            <div className="slideshow">
              <div
                id="carouselExampleControls"
                className="carousel slide"
                data-bs-ride="carousel"
              >
                <div className="carousel-inner">
                  {chunkedProducts.map((group, groupIndex) => (
                    <div
                      key={groupIndex}
                      className={`carousel-item ${
                        groupIndex === 0 ? 'active' : ''
                      }`}
                    >
                      <div className="row">
                        {group.map(product => (
                          <div key={product.id} className="col-custom">
                            <a href={`/products/${product.slug}`}>
                              <div className="product-card">
                                <div className="product-card-image">
                                  <img
                                    src={
                                      product.image ||
                                      '/images/freakyfashion-placeholder.png'
                                    }
                                    alt={product.alt}
                                  />
                                </div>
                                <div className="product-card-footer">
                                  <div className="upper-text">
                                    <h4>{product.name}</h4>
                                    <h4 className="price">
                                      {product.price} SEK
                                    </h4>
                                  </div>
                                  <p>{product.brand}</p>
                                </div>
                              </div>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#carouselExampleControls"
                  data-bs-slide="prev"
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Previous</span>
                </button>

                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#carouselExampleControls"
                  data-bs-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ProductDetails;
