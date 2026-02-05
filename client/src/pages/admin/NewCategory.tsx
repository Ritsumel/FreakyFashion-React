import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Product = {
  id: number;
  name: string;
  sku: string;
};

const NewCategory = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [skuInput, setSkuInput] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const isSearching = skuInput.trim().length > 0;
  const rows = isSearching ? searchResults : products;
  const isAdded = (id: number) => {
    return products.some(p => p.id === id);
  };

  /* Live SKU search */
  useEffect(() => {
    const fetchProductsBySKU = async () => {
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

    fetchProductsBySKU();
  }, [skuInput]);

  /* Add product to category */
  const addProduct = (product: Product) => {
    setProducts(prev => {
      if (prev.some(p => p.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  /* Remove product from category */
  const removeProduct = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  /* Submit category */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Kategorin måste ha ett namn');
      return;
    }

    await fetch('http://localhost:5000/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        image_url: imageUrl,
        productIds: products.map(p => p.id)
      })
    });

    navigate('/admin/categories');
  };

  return (
    <section id="new-category">
      <div className="content">
        <h3>Ny kategori</h3>

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

              {/* SKU INPUT */}
              <div className="form-group sku">
                <input
                  value={skuInput}
                  onChange={e => setSkuInput(e.target.value.toUpperCase())}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault(); // 🔒 stop page from turning white
                    }
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

                    {rows.map(p => (
                      isSearching ? (
                        isAdded(p.id) ? (
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
                        )
                      ) : (
                        <button
                          key={`remove-${p.id}`}
                          type="button"
                          className="delete-btn"
                          onClick={() => removeProduct(p.id)}
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      )
                    ))}
                </div>
              </div>

            </fieldset>
          </div>

          <div className="btn-submit">
            <button className="btn-theme">Lägg till</button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default NewCategory;
