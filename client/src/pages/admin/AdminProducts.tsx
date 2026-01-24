import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type Product = {
  id: number;
  name: string;
  sku?: string;
  price: number;
};

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productCount, setProductCount] = useState(0);

  const fetchProducts = async () => {
    const res = await fetch('http://localhost:5000/admin/products');
    const data = await res.json();
    setProducts(data.products);
    setProductCount(data.productCount);
  };

  const deleteProduct = async (id: number) => {
    if (!confirm('Är du säker?')) return;

    await fetch(`http://localhost:5000/admin/products/${id}`, {
      method: 'DELETE'
    });

    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <header id="header-admin">
        <h3>Administration</h3>
      </header>

      <main>
        <section id="admin-products">
          <div className="side-menu">
            <div className="links">
              <Link to="/admin/products">Produkter</Link>
            </div>
          </div>

          <div className="products-view-all">
            <div className="product-text">
              <h3>Produkter ({productCount})</h3>
              <Link to="/admin/products/new" className="btn-soft-glow">
                Ny Produkt
              </Link>
            </div>

            <div className="products-view">
              <div className="product-details">
                <h6>Namn</h6>
                {products.map((item, i) => (
                  <p key={item.id} className={i % 2 === 0 ? 'p1' : 'p2'}>
                    {item.name}
                  </p>
                ))}
              </div>

              <div className="product-details">
                <h6>SKU</h6>
                {products.map((item, i) => (
                  <p key={item.id} className={i % 2 === 0 ? 'p1' : 'p2'}>
                    {item.sku || '—'}
                  </p>
                ))}
              </div>

              <div className="product-details">
                <h6>Pris</h6>
                {products.map((item, i) => (
                  <p key={item.id} className={i % 2 === 0 ? 'p1' : 'p2'}>
                    {item.price}
                  </p>
                ))}
              </div>

              <div className="product-details">
                <h6>&nbsp;</h6>
                {products.map((item, i) => (
                  <div
                    key={item.id}
                    className={`icon ${i % 2 === 0 ? 'icon1' : 'icon2'}`}
                  >
                    <button
                      className="remove-item"
                      onClick={() => deleteProduct(item.id)}
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default AdminProducts;
