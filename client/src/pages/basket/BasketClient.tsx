import { useState } from 'react';

type BasketItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type Props = {
  initialBasket: BasketItem[];
  message?: string;
};

const BasketClient = ({ initialBasket, message }: Props) => {
  const [basket, setBasket] = useState<BasketItem[]>(initialBasket);

  const handleQuantityChange = async (
    productId: string,
    newQty: number
  ) => {
    const data = {
      productId: [productId],
      quantity: [newQty],
    };

    try {
      const res = await fetch('/basket/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        alert('Could not update basket.');
        return;
      }

      const json = await res.json();
      setBasket(json.basket);
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    }
  };

  return (
    <main>
      {message && <div className="alert">{message}</div>}

      <section id="basket">
        <form action="/basket/checkout" method="post">
          <div className="basket-details">
            <h1>Varukorgen</h1>

            {/* MOBILE VIEW */}
            <div className="basket-details-mobile-view">
              {basket.map(item => (
                <div key={item.id} className="basket-single">
                  <div className="total">
                    <div className="total-header">
                      <h6>{item.quantity} x {item.name}</h6>
                      <p>{item.price} SEK</p>
                    </div>

                    <div className="total-footer">
                      <h6>
                        <span
                          className="price-output"
                          data-id={item.id}
                          data-price={item.price}
                        >
                          {item.price * item.quantity}
                        </span> SEK
                      </h6>

                      <div className="amount">
                        <select
                          className="form-select quantity-select"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(item.id, Number(e.target.value))
                          }
                        >
                          {Array.from({ length: 10 }, (_, i) => i + 1).map(qty => (
                            <option key={qty} value={qty}>{qty}</option>
                          ))}
                        </select>

                        <a href={`/basket/remove/${item.id}`}>
                          <i className="fa-solid fa-trash-can"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP VIEW */}
            <div className="basket-details-regular">
              <div className="product-details">
                <h6>Produkt</h6>
                {basket.map((item, i) => (
                  <p key={item.id} className={i % 2 === 0 ? 'p1' : 'p2'}>
                    {item.name}
                  </p>
                ))}
              </div>

              <div className="product-details">
                <h6>Pris</h6>
                {basket.map((item, i) => (
                  <p key={item.id} className={i % 2 === 0 ? 'p1' : 'p2'}>
                    {item.price} SEK
                  </p>
                ))}
              </div>

              <div className="product-details">
                <h6>Totalt</h6>
                {basket.map((item, i) => (
                  <p key={item.id} className={i % 2 === 0 ? 'p1' : 'p2'}>
                    <span className="price-output">{item.price * item.quantity}</span> SEK
                  </p>
                ))}
              </div>

              <div className="product-details">
                <h6>Antal</h6>
                {basket.map((item, i) => (
                  <div key={item.id} className={`amount ${i % 2 === 0 ? 'amount1' : 'amount2'}`}>
                    <select
                      className="form-select"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, Number(e.target.value))
                      }
                    >
                      {Array.from({ length: 10 }, (_, i) => i + 1).map(qty => (
                        <option key={qty} value={qty}>{qty}</option>
                      ))}
                    </select>

                    <a href={`/basket/remove/${item.id}`} className="remove-item">
                      <i className="fa-solid fa-trash-can"></i>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="button-submit">
              <button className="btn-soft-glow">Till kassan</button>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
};

export default BasketClient;
