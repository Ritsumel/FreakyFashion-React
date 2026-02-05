import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../../components/SearchBar';

type Product = {
  id: number;
  name: string;
  slug: string;
  sku?: string;
  price: number;
  publish_date: string | null;
};

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = async () => {
    const res = await fetch('http://localhost:5000/api/admin/products');
    const data = await res.json();
    setProducts(data.products);
  };

  const deleteProduct = async (id: number) => {
    if (!confirm('Är du säker på att du vill radera produkten?')) return;

    await fetch(`http://localhost:5000/api/admin/products/${id}`, {
      method: 'DELETE',
    });

    fetchProducts();
      };

      useEffect(() => {
        fetchProducts();
      }, []);

      const filteredProducts = products.filter(product => {
      const term = searchTerm.toLowerCase();

      return (
        product.name.toLowerCase().includes(term) ||
        product.sku?.toLowerCase().includes(term)
      );
    });

  return (
    <section id="products-admin">

      <div className="products-view-all">
        {/* TOP BAR */}
        <div className="box1">
          <SearchBar
            value={searchTerm}
            placeholder="Sök produkt"
            onChange={setSearchTerm}
          />

          <Link to="/admin/products/new" className="btn-new btn-theme">
            Ny produkt
          </Link>
        </div>

        {/* TABLE */}
        <div className="products-view">

          {/* NAMN */}
          <div className="product-details">
            <h6>Namn</h6>
            {filteredProducts.map((p, i) => (
              <p key={p.id} className={i % 2 === 0 ? 'p1' : 'p2'}>
                <Link to={`/admin/products/${p.id}`}>
                  {p.name}
                </Link>
              </p>
            ))}
          </div>

          {/* SKU */}
          <div className="product-details">
            <h6>SKU</h6>
            {filteredProducts.map((p, i) => (
              <p key={p.id} className={i % 2 === 0 ? 'p1' : 'p2'}>
                {p.sku || '—'}
              </p>
            ))}
          </div>

          {/* PUBLISERAD */}
          <div className="product-details">
            <h6>Publiserad</h6>
            {filteredProducts.map((p, i) => (
              <p key={p.id} className={i % 2 === 0 ? 'p1' : 'p2'}>
                {p.publish_date ? 'Ja' : 'Nej'}
              </p>
            ))}
          </div>

          {/* PRIS */}
          <div className="product-details">
            <h6>Pris</h6>
            {filteredProducts.map((p, i) => (
              <p key={p.id} className={i % 2 === 0 ? 'p1' : 'p2'}>
                {p.price} kr
              </p>
            ))}
          </div>

          {/* DELETE */}
          <div className="product-details">
            <h6>&nbsp;</h6>
            {filteredProducts.map((p, i) => (
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
