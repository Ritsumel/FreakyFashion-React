import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

type Product = {
  id: number;
  name: string;
  sku: string;
};

type Category = {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  products: Product[];
};

const AdminCategoryDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [products, setProducts] = useState<Product[]>([]);
  const [skuInput, setSkuInput] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  /* Fetch category details */
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/admin/categories/${id}`
        );
        if (!res.ok) throw new Error('Not found');

        const data: Category = await res.json();

        setName(data.name);
        setSlug(data.slug);
        setImageUrl(data.image_url || '');
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  /* Live SKU search */
  useEffect(() => {
    const fetchBySKU = async () => {
      if (!skuInput.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:5000/api/admin/products?sku=${skuInput}`
        );
        const data = await res.json();

        const list = Array.isArray(data) ? data : [];
        setSearchResults(list);
      } catch (err) {
        console.error(err);
        setSearchResults([]);
      }
    };

    fetchBySKU();
  }, [skuInput]);

  const isSearching = skuInput.trim().length > 0;
  const rows = isSearching ? searchResults : products;

  /* Add / Remove products */
  const addProduct = (product: Product) => {
    setProducts(prev => {
      if (prev.some(p => p.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeProduct = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  /* Save category */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !slug.trim()) {
      alert('Namn och slug krävs');
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/categories/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            slug,
            image_url: imageUrl,
            productIds: products.map(p => p.id)
          })
        }
      );

      if (!res.ok) throw new Error('Misslyckades');

      navigate('/admin/categories');
    } catch (err) {
      console.error(err);
      alert('Något gick fel');
    }
  };

  if (loading) {
    return <p style={{ padding: '2rem' }}>Laddar kategori…</p>;
  }

  return (
    <section id="new-category">
      <div className="content">
        <h3>Redigera kategori</h3>

        <form className="new-category-form" onSubmit={handleSubmit}>
          {/* NAME */}
          <div className="form-group name">
            <label htmlFor="name">Namn</label>
            <input
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          {/* SLUG */}
          <div className="form-group name">
            <label htmlFor="slug">Slug</label>
            <input
              id="slug"
              value={slug}
              onChange={e => setSlug(e.target.value)}
              required
            />
          </div>

          {/* IMAGE */}
          <div className="form-group image-url">
            <label htmlFor="image-url">Bild (URL)</label>
            <input
              id="image-url"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="/images/freakyfashion-placeholder.png"
            />
          </div>

          {/* PRODUCTS */}
          <div className="products-container">
            <fieldset className="products-fieldset">
              <h3>Produkter</h3>

              <div className="form-group sku">
                <input
                  value={skuInput}
                  onChange={e =>
                    setSkuInput(e.target.value.toUpperCase())
                  }
                  onKeyDown={e => {
                    if (e.key === 'Enter') e.preventDefault();
                  }}
                  placeholder="Ange SKU"
                />
              </div>

              <div className="categories-view">
                {/* NAME */}
                <div className="category-details">
                  <h6>Namn</h6>
                  {rows.map(p => (
                    <p key={`name-${p.id}`}>{p.name}</p>
                  ))}
                </div>

                {/* SKU */}
                <div className="category-details">
                  <h6>SKU</h6>
                  {rows.map(p => (
                    <p key={`sku-${p.id}`}>{p.sku}</p>
                  ))}
                </div>

                {/* ACTION */}
                <div className="category-details">
                  <h6></h6>

                  {rows.map(p => {
                    const alreadyAdded = products.some(prod => prod.id === p.id);

                    return alreadyAdded ? (
                      <button
                        key={`remove-${p.id}`}
                        type="button"
                        className="delete-btn"
                        onClick={() => removeProduct(p.id)}
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    ) : (
                      <button
                        key={`add-${p.id}`}
                        type="button"
                        onClick={() => addProduct(p)}
                      >
                        <i className="fa-solid fa-circle-plus"></i>
                      </button>
                    );
                  })}
                </div>
              </div>
            </fieldset>
          </div>

          <div className="btn-submit">
            <button className="btn-theme">Spara</button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AdminCategoryDetails;
