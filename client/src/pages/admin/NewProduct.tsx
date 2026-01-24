import { useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const NewProduct = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const calendarIcon = document.querySelector('.calendar-icon');
    const dateInput = document.getElementById('publication-date') as HTMLInputElement | null;

    const handleCalendarClick = () => {
      dateInput?.showPicker?.() || dateInput?.focus();
    };

    calendarIcon?.addEventListener('click', handleCalendarClick);

    // Cleanup to avoid duplicate listeners in React StrictMode (dev only)
    return () => {
      calendarIcon?.removeEventListener('click', handleCalendarClick);
    };
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch('http://localhost:5000/api/admin/products', {
        method: 'POST',
        body: new URLSearchParams(formData as any),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      navigate('/admin/products');
    } catch (err) {
      console.error('Submit failed:', err);
      alert('Något gick fel – kolla konsolen');
    }
  };

  return (
    <>
      <header id="header-admin">
        <h3>Administration</h3>
      </header>

      <main>
        <section id="new-product">
          <div className="side-menu">
            <div className="links">
              <a href="/admin/products">Produkter</a>
            </div>
          </div>

          <div className="content">
            <h3>Ny Produkt</h3>

            <form className="new-product-form" onSubmit={handleSubmit}>
              <div className="form-group name">
                <label htmlFor="name">Namn</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  maxLength={50}
                  placeholder="Ange namn"
                  required
                />
              </div>

              <div className="form-group description">
                <label htmlFor="description">Beskrivning</label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Ange beskrivning"
                />
              </div>

              <div className="form-group image">
                <label htmlFor="image">Bild (URL)</label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              <div className="form-group brand">
                <label htmlFor="brand">Märke</label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  maxLength={50}
                  placeholder="Ange märke"
                  required
                />
              </div>

              <div className="form-group sku">
                <label htmlFor="sku">SKU</label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  pattern="^[A-Za-z]{3}[0-9]{3}$"
                  title="SKU måste vara i formatet XXXYYY"
                  placeholder="Ange SKU"
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

              <div className="form-group publication-date">
                <label htmlFor="publication-date">Publiseringsdatum</label>
                <div className="date-input">
                  <input
                    type="datetime-local"
                    id="publication-date"
                    name="publication-date"
                    required
                  />
                  <span className="calendar-icon">
                    <i className="fa-regular fa-calendar-days"></i>
                  </span>
                </div>
              </div>

              <div className="btn-submit">
                <button className="btn-soft-glow" type="submit">
                  Lägg till
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </>
  );
};

export default NewProduct;
