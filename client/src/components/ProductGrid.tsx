import { Link } from 'react-router-dom';
import type { Product } from '../types/Product';

type Props = {
  products: Product[];
};

const ProductGrid = ({ products }: Props) => {
  return (
    <div className="product-grid">
      {products.map(product => (
        <Link key={product.slug} to={`/products/${product.slug}`}>
          <div className="product-card">
            <div className="product-card-image">
              <img
                src={product.image}
                alt={product.alt}
              />

              {product.showNewTag === 1 && (
                <div className="news-tag">
                  <p>Nyhet</p>
                </div>
              )}

              <button className="bookmark-tag">
                <i className="fa-regular fa-heart"></i>
              </button>
            </div>

            <div className="product-card-footer">
              <div className="upper-text">
                <h4>{product.name}</h4>
                <h4>{product.price} SEK</h4>
              </div>
              <p>{product.brand}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;
