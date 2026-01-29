import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

type Product = {
  id: number;
  name: string;
  brand: string;
  description: string | null;
  price: number | null;
  sku: string;
  image: string | null;
  publishDate: string | null;
  slug: string;
};

const AdminProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/admin/products/${id}`);
        if (!res.ok) throw new Error('Failed to load product');
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const deleteProduct = async () => {
    if (!confirm('Är du säker på att du vill radera produkten?')) return;

    await fetch(`http://localhost:5000/api/admin/products/${product!.id}`, {
      method: 'DELETE'
    });

    window.location.href = '/admin/products';
  };

  const togglePublish = async () => {
    if (
      !confirm(
        product?.publishDate
          ? 'Är du säker på att du vill avpublisera produkten?'
          : 'Är du säker på att du vill publisera produkten?'
      )
    ) return;

    await fetch(
      `http://localhost:5000/api/admin/products/${product!.id}/toggle-publish`,
      { method: 'POST' }
    );

    // re-fetch product so UI updates
    const res = await fetch(
      `http://localhost:5000/api/admin/products/${product!.id}`
    );
    const updated = await res.json();
    setProduct(updated);
  };

  if (loading) {
    return <p style={{ padding: '2rem' }}>Laddar produkt…</p>;
  }

  if (!product) {
    return <p style={{ padding: '2rem' }}>Produkten hittades inte.</p>;
  }

  return (
    <section id="admin-product-details">
      <div className="content">
        <div className="top-container">
          <h3>{product.name}</h3>

          <div className="buttons">
            <button className="btn-theme" onClick={deleteProduct}>
              Radera
            </button>
            <button className="btn-theme" onClick={togglePublish}>
              {product.publishDate ? 'Avpublisera' : 'Publisera'}
            </button>
          </div>
        </div>

        <div className="bottom-container">
          <div className="info">
            <h6>Namn</h6>
            <p>{product.name}</p>
          </div>

          <div className="info">
            <h6>Märke</h6>
            <p>{product.brand}</p>
          </div>

          <div className="info">
            <h6>Beskrivning</h6>
            <p>{product.description || 'Ingen beskrivning'}</p>
          </div>

          <div className="info">
            <h6>Bild</h6>
            <img
                src={product.image || '/images/freakyfashion-placeholder.png'}
                alt={product.name}
            />
          </div>

          <div className="info">
            <h6>Pris</h6>
            <p>{product.price ? `${product.price} kr` : 'Ej angivet'}</p>
          </div>

          <div className="info">
            <h6>Publiserad</h6>
            <p>{product.publishDate ? product.publishDate : 'Ej publiserad'}</p>
          </div>

          <div className="info">
            <h6>Slug</h6>
            <p>{product.slug}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminProductDetails;
