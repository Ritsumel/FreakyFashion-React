import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSiderbar';

const NewProduct = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const payload = {
      name: formData.get('name'),
      description: formData.get('description'),
      image_url: formData.get('image_url'),
      price: formData.get('price'),
      sku: formData.get('sku'),
      publishDate: formData.get('publish')
        ? new Date().toISOString()
        : null,
    };

    try {
      const res = await fetch('http://localhost:5000/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to create product');

      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      alert('Något gick fel – kolla konsolen');
    }
  };

  return (
    <section id="new-product">
      <AdminSidebar />

      <div className="content">
        <h3>Ny produkt</h3>

        <form className="new-product-form" onSubmit={handleSubmit}>
          <div className="form-group name">
            <label htmlFor="name">Namn</label>
            <input
              type="text"
              id="name"
              name="name"
              maxLength={50}
              required
            />
          </div>

          <div className="form-group description">
            <label htmlFor="description">Beskrivning</label>
            <textarea
              id="description"
              name="description"
              rows={4}
            />
          </div>

          <div className="form-group image-url">
            <label htmlFor="image-url">Bild (URL)</label>
            <input
              type="url"
              id="image-url"
              name="image_url"
              required
            />
          </div>

          <div className="form-group price">
            <label htmlFor="price">Pris</label>
            <input
              type="number"
              id="price"
              name="price"
              min={0}
              step="0.01"
            />
          </div>

          <div className="form-group sku">
            <label htmlFor="sku">SKU</label>
            <input
              type="text"
              id="sku"
              name="sku"
              pattern="^[A-Za-z]{3}[0-9]{3}$"
              title="SKU måste vara i formatet XXXYYY (t.ex. ABC123)"
              required
            />
          </div>

          <div className="checkbox">
            <input
              type="checkbox"
              id="publish"
              name="publish"
              className="form-check-input"
            />
            <label htmlFor="publish">Publisera</label>
          </div>

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
