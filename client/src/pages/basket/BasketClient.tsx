import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type BasketItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  brand?: string;
};

type Props = {
  initialBasket: BasketItem[];
};

const BasketClient = ({ initialBasket }: Props) => {
  const [basket, setBasket] = useState<BasketItem[]>(initialBasket);
  const navigate = useNavigate();

  /* Update quantity */
  const handleQuantityChange = async (productId: string, newQty: number) => {
    const data = {
      productId: [productId],
      quantity: [newQty],
    };

    try {
      const res = await fetch('http://localhost:5000/api/basket/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        alert('Kunde inte uppdatera varukorgen.');
        return;
      }

      const json = await res.json();
      setBasket(json.basket);
    } catch (err) {
      console.error(err);
      alert('Något gick fel.');
    }
  };

  /* Remove item */
  const handleRemove = async (productId: string) => {
    try {
      await fetch(`http://localhost:5000/api/basket/${productId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      setBasket(prev => prev.filter(item => item.id !== productId));
    } catch (err) {
      console.error(err);
      alert('Kunde inte ta bort produkten.');
    }
  };

  return (
    <main>
      <section id="basket">
        <div className="basket-details">
          <h1>Varukorgen</h1>

          {/* MOBILE VIEW */}
          <div className="basket-details-mobile-view">
            {basket.map(item => (
              <div key={item.id} className="basket-single">
                <div className="total">

                  <div className="total-header">
                    <h6>
                      {item.quantity} x {item.name}
                    </h6>
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
                          handleQuantityChange(item.id, Number(e.target.value))
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
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP VIEW */}
          <div className="basket-details-regular">

            {/* Produkt */}
            <div className="product-details">
              <h6>Produkt</h6>
              {basket.map((item, i) => (
                <p key={item.id} className={i % 2 === 0 ? 'p1' : 'p2'}>
                  {item.name}
                </p>
              ))}
            </div>

            {/* Antal */}
            <div className="product-details">
              <h6>Antal</h6>
              {basket.map((item, i) => (
                <p key={item.id} className={i % 2 === 0 ? 'p1' : 'p2'}>
                  {item.quantity}
                </p>
              ))}
            </div>

            {/* Pris */}
            <div className="product-details">
              <h6>Pris</h6>
              {basket.map((item, i) => (
                <p key={item.id} className={i % 2 === 0 ? 'p1' : 'p2'}>
                  {item.price} SEK
                </p>
              ))}
            </div>

            {/* Totalt */}
            <div className="product-details">
              <h6>Totalt</h6>
              {basket.map((item, i) => (
                <p key={item.id} className={i % 2 === 0 ? 'p1' : 'p2'}>
                  {item.price * item.quantity} SEK
                </p>
              ))}
            </div>

            {/* Actions */}
            <div className="product-details">
              <h6>&nbsp;</h6>
              {basket.map((item, i) => (
                <div
                  key={item.id}
                  className={`amount ${i % 2 === 0 ? 'amount1' : 'amount2'}`}
                >
                  <select
                    className="form-select"
                    value={item.quantity}
                    onChange={e =>
                      handleQuantityChange(item.id, Number(e.target.value))
                    }
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(qty => (
                      <option key={qty} value={qty}>{qty}</option>
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
            </div>
          </div>

          <div className="button-submit">
            <button
              type="button"
              className="btn-soft-glow"
              onClick={() => navigate('/checkout')}
            >
              Till kassan
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BasketClient;
