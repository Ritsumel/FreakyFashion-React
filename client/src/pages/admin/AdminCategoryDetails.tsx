import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

type Product = {
  id: number;
  name: string;
  sku: string;
};

type Category = {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
};

const AdminCategoryDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/admin/categories/${id}`
        );
        if (!res.ok) throw new Error('Not found');

        const data = await res.json();
        setCategory({
            id: data.id,
            name: data.name,
            slug: data.slug,
            image_url: data.image_url
        });
        setProducts(data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const deleteCategory = async () => {
    if (!confirm('Är du säker på att du vill radera kategorin?')) return;

    await fetch(
      `http://localhost:5000/api/admin/categories/${id}/delete`,
      { method: 'POST' }
    );

    navigate('/admin/categories');
  };

  if (loading) {
    return <p style={{ padding: '2rem' }}>Laddar kategori…</p>;
  }

  if (!category) {
    return <p style={{ padding: '2rem' }}>Kategorin hittades inte.</p>;
  }

  return (
    <section id="admin-category-details">
      <div className="content">
        <div className="top-container">
          <h3>{category.name}</h3>

          <div className="buttons">
            <button className="btn-theme" onClick={deleteCategory}>
              Radera
            </button>

            <Link
              to={`/admin/categories/${category.id}/edit`}
              className="btn-theme"
            >
              Redigera
            </Link>
          </div>
        </div>

        <div className="bottom-container">
            <div className="info">
                <h6>Namn</h6>
                <p>{category.name}</p>
            </div>

            <div className="info">
                <h6>Bild</h6>
                <img
                src={category.image_url || '/images/freakyfashion-placeholder.png'}
                alt={category.name}
                />
            </div>

            <div className="info">
                <h6>URL-slug</h6>
                <p>{category.slug}</p>
            </div>

            <div className="info">
                <h6 className="h6-extra">Produkter</h6>

                <div className="categories-view">
                <div className="category-details">
                    <h6>Namn</h6>
                    {products.map(p => (
                        <p key={`name-${p.id}`}>
                            <Link to={`/admin/products/${p.id}`}>{p.name}</Link>
                        </p>
                    ))}
                </div>

                <div className="category-details">
                    <h6>SKU</h6>
                    {products.map(p => (
                        <p key={`sku-${p.id}`}>{p.sku}</p>
                    ))}
                </div>
                </div>
            </div>
            </div>
      </div>
    </section>
  );
};

export default AdminCategoryDetails;
