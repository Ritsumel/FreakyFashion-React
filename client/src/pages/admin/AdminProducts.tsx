import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSiderbar';

type Product = {
  id: number;
  name: string;
  slug: string;
  sku?: string;
  price: number;
  publishDate: string | null;
};

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    const res = await fetch('http://localhost:5000/api/admin/products');
    const data = await res.json();
    setProducts(data.products);
  };

  const deleteProduct = async (id: number) => {
    if (!confirm('Är du säker?')) return;

    await fetch(`http://localhost:5000/api/admin/products/${id}`, {
      method: 'DELETE',
    });

    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <section id="products-admin">
      <AdminSidebar />

      <div className="products-view-all">
        {/* TOP BAR */}
        <div className="box1">
          <div className="search-field">
            <i id="search-icon" className="fa-solid fa-magnifying-glass"></i>
            <input
              id="search-bar"
              type="text"
              placeholder="Sök produkt"
            />
            <button type="button" className="btn-search btn-theme">
              Sök
            </button>
          </div>

          <Link to="/admin/products/new" className="btn-new btn-theme">
            Ny produkt
          </Link>
        </div>

        {/* TABLE */}
        <div className="products-view">

          {/* NAMN */}
          <div className="product-details">
            <h6>Namn</h6>
            {products.map((p, i) => (
              <p key={p.id} className={i % 2 === 0 ? 'p1' : 'p2'}>
                {p.name}
              </p>
            ))}
          </div>

          {/* SKU */}
          <div className="product-details">
            <h6>SKU</h6>
            {products.map((p, i) => (
              <p key={p.id} className={i % 2 === 0 ? 'p1' : 'p2'}>
                {p.sku || '—'}
              </p>
            ))}
          </div>

          {/* PUBLISERAD */}
          <div className="product-details">
            <h6>Publiserad</h6>
            {products.map((p, i) => (
              <p key={p.id} className={i % 2 === 0 ? 'p1' : 'p2'}>
                {p.publishDate ? 'Ja' : 'Nej'}
              </p>
            ))}
          </div>

          {/* PRIS */}
          <div className="product-details">
            <h6>Pris</h6>
            {products.map((p, i) => (
              <p key={p.id} className={i % 2 === 0 ? 'p1' : 'p2'}>
                {p.price} kr
              </p>
            ))}
          </div>

          {/* DELETE */}
          <div className="product-details">
            <h6>&nbsp;</h6>
            {products.map((p, i) => (
              <p key={p.id} className={i % 2 === 0 ? 'p1' : 'p2'}>
                <button
                  className="btn-delete"
                  onClick={() => deleteProduct(p.id)}
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </p>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default AdminProducts;
