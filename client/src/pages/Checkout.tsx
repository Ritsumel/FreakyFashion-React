import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

type BasketItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

const Checkout = () => {
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  /* ===== Fetch basket ===== */
  useEffect(() => {
    const fetchBasket = async () => {
      const res = await fetch('http://localhost:5000/api/basket', {
        credentials: 'include',
      });

      if (!res.ok) {
        navigate('/basket');
        return;
      }

      const data = await res.json();
      setBasket(data.basket);
    };

    fetchBasket();
  }, [navigate]);

  /* ===== Update quantity ===== */
  const handleQuantityChange = async (productId: string, newQty: number) => {
    const data = {
      productId: [productId],
      quantity: [newQty],
    };

    const res = await fetch('http://localhost:5000/api/basket/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!res.ok) return;

    const json = await res.json();
    setBasket(json.basket);
  };

  /* ===== Remove item ===== */
  const handleRemove = async (productId: string) => {
    await fetch(`http://localhost:5000/api/basket/${productId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    setBasket(prev => prev.filter(item => item.id !== productId));
  };

  /* ===== Submit order ===== */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const res = await fetch('http://localhost:5000/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      setError('Något gick fel vid beställningen');
      return;
    }

    navigate('/confirmation');
  };

  return (
    <>
      <Header />

      <main>
        <section id="checkout">

          {/* ===== CHECKOUT DETAILS ===== */}
          <div className="checkout-details">
            <h1>Kassan</h1>

            {/* ===== MOBILE VIEW ===== */}
            <div className="checkout-details-mobile-view">
              {basket.map(item => (
                <div key={item.id} className="checkout-single">
                  <div className="total">

                    <div className="total-header">
                      <h6>{item.quantity} x {item.name}</h6>
                      <p>{item.price} SEK</p>
                    </div>

                    <div className="total-footer">
                      <h6>
                        <span className="price-output">
                          {item.price * item.quantity}
                        </span>{' '}
                        SEK
                      </h6>

                      <div className="amount">
                        <select
                          className="form-select quantity-select"
                          value={item.quantity}
                          onChange={e =>
                            handleQuantityChange(
                              item.id,
                              Number(e.target.value)
                            )
                          }
                        >
                          {Array.from({ length: 10 }, (_, i) => i + 1).map(
                            qty => (
                              <option key={qty} value={qty}>
                                {qty}
                              </option>
                            )
                          )}
                        </select>

                        <button
                          type="button"
                          className="remove-item"
                          onClick={() => handleRemove(item.id)}
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* ===== DESKTOP VIEW ===== */}
            <div className="checkout-details-regular">
              <div className="product-details">
                <h6>Produkt</h6>
                {basket.map((item, i) => (
                  <p key={item.id} className={i % 2 === 0 ? 'p1' : 'p2'}>
                    {item.name}
                  </p>
                ))}
                <p className={`spacer-row ${basket.length % 2 === 0 ? 'p1' : 'p2'}`}>&nbsp;</p>
              </div>

              <div className="product-details">
                <h6>Pris</h6>
                {basket.map((item, i) => (
                  <p key={item.id} className={i % 2 === 0 ? 'p1' : 'p2'}>
                    {item.price} SEK
                  </p>
                ))}
                <p className={`spacer-row ${basket.length % 2 === 0 ? 'p1' : 'p2'}`}>&nbsp;</p>
              </div>

              <div className="product-details">
                <h6>Totalt</h6>
                {basket.map((item, i) => (
                  <p key={item.id} className={i % 2 === 0 ? 'p1' : 'p2'}>
                    {item.price * item.quantity} SEK
                  </p>
                ))}
                <p className={`spacer-row ${basket.length % 2 === 0 ? 'p1' : 'p2'}`}>&nbsp;</p>
              </div>

              <div className="product-details">
                <h6>Antal</h6>
                {basket.map((item, i) => (
                  <div
                    key={item.id}
                    className={`amount ${i % 2 === 0 ? 'amount1' : 'amount2'}`}
                  >
                    <select
                      className="form-select"
                      value={item.quantity}
                      onChange={e =>
                        handleQuantityChange(
                          item.id,
                          Number(e.target.value)
                        )
                      }
                    >
                      {Array.from({ length: 10 }, (_, i) => i + 1).map(qty => (
                        <option key={qty} value={qty}>
                          {qty}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      className="remove-item"
                      onClick={() => handleRemove(item.id)}
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                ))}
                <p className={`spacer-row ${basket.length % 2 === 0 ? 'p1' : 'p2'}`}>&nbsp;</p>
              </div>
            </div>
          </div>

          {/* ===== CUSTOMER DETAILS ===== */}
          <div className="customer-details">
            <h1>Kunduppgifter</h1>

            {error && <p className="alert">{error}</p>}

            <form className="customer-details-form" onSubmit={handleSubmit}>
              <div className="form1">
                <div>
                  <label>Förnamn</label>
                  <input name="name" required />
                </div>
                <div>
                  <label>Efternamn</label>
                  <input name="lastName" required />
                </div>
                <div>
                  <label>E-post</label>
                  <input name="email" type="email" required />
                </div>
              </div>

              <div className="form2">
                <fieldset className="address-fieldset">
                  <h3>Adress</h3>

                  <div className="street">
                    <label>Gata</label>
                    <input name="street" required />
                  </div>

                  <div className="postal">
                    <label>Postnummer</label>
                    <input name="postal" required />
                  </div>

                  <div className="city">
                    <label>Stad</label>
                    <input name="city" required />
                  </div>
                </fieldset>
              </div>

              <div className="form-check">
                <label>
                  <input type="checkbox" name="newsletter" />
                  Jag vill ta emot nyhetsbrev
                </label>
              </div>

              <div className="button-box">
                <button className="btn-soft-glow">Köp</button>
              </div>
            </form>
          </div>

        </section>
      </main>

      <Footer />
    </>
  );
};

export default Checkout;
