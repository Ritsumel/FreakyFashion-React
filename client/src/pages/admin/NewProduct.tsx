import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewProduct = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [brand, setBrand] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [publish, setPublish] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // SKU validation (same rule as old project)
    const skuPattern = /^[A-Z]{3}[0-9]{3}$/;
    if (!skuPattern.test(sku)) {
      setError('SKU måste vara i formatet ABC123');
      return;
    }

    const payload = {
      name,
      description,
      image_url: imageUrl,
      brand,
      sku,
      price: price ? Number(price) : null,
      publishDate: publish
        ? publishDate || new Date().toISOString()
        : null
    };

    try {
      const res = await fetch('http://localhost:5000/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Kunde inte skapa produkt');
      }

      navigate('/admin/products');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <section id="new-product">

      <div className="content">
        <h3>Ny produkt</h3>

        <form className="new-product-form" onSubmit={handleSubmit}>
          {/* NAMN */}
          <div className="form-group name">
            <label htmlFor="name">Namn</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={50}
              required
            />
          </div>

          {/* BESKRIVNING */}
          <div className="form-group description">
            <label htmlFor="description">Beskrivning</label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          {/* BILD */}
          <div className="form-group image-url">
            <label htmlFor="image">Bild (URL)</label>
            <input
              id="image"
              type="url"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              required
            />
          </div>

          {/* MÄRKE */}
          <div className="form-group brand">
            <label htmlFor="brand">Märke</label>
            <input
              id="brand"
              type="text"
              value={brand}
              onChange={e => setBrand(e.target.value)}
              required
            />
          </div>

          {/* SKU */}
          <div className="form-group sku">
            <label htmlFor="sku">SKU</label>
            <input
              id="sku"
              type="text"
              value={sku}
              onChange={e => setSku(e.target.value.toUpperCase())}
              pattern="^[A-Z]{3}[0-9]{3}$"
              title="SKU måste vara i formatet ABC123"
              required
            />
          </div>

          {/* PRIS */}
          <div className="form-group price">
            <label htmlFor="price">Pris</label>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={e => setPrice(e.target.value)}
            />
          </div>

          {/* PUBLICERINGSDATUM */}
          <div className="form-group publication-date">
            <label htmlFor="publishDate">Publiseringsdatum</label>

            <div className="date-input">
              <input
                type="datetime-local"
                id="publishDate"
                name="publishDate"
                value={publishDate}
                onChange={e => setPublishDate(e.target.value)}
              />

              <span
                className="calendar-icon"
                onClick={() => {
                  const input = document.getElementById(
                    'publishDate'
                  ) as HTMLInputElement | null;

                  input?.showPicker();
                }}
              >
                <i className="fa-regular fa-calendar-days"></i>
              </span>
            </div>
          </div>

          {/* PUBLISERA */}
          <div className="checkbox">
            <input
              type="checkbox"
              id="publish"
              checked={publish}
              onChange={e => setPublish(e.target.checked)}
            />
            <label htmlFor="publish">Publisera</label>
          </div>

          {error && <p className="error-text">{error}</p>}

          <div className="btn-submit">
            <button className="btn-theme" type="submit">
              Lägg till
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default NewProduct;
