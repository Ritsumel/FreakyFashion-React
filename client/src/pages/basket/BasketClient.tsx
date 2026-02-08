import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useBasket } from '../../context/BasketContext';

export type BasketItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  brand?: string;
};

type Props = {
  basket: BasketItem[];
};

const BasketClient = ({ basket }: Props) => {
  const navigate = useNavigate();
  const { updateQuantity, removeFromBasket } = useBasket();

  const [attemptedCheckout, setAttemptedCheckout] = useState(false);

  const isEmpty = basket.length === 0;

  const handleQuantityChange = (productId: string, newQty: number) => {
    updateQuantity(productId, newQty);
  };

  const handleRemove = (productId: string) => {
    removeFromBasket(productId);
  };

  const handleCheckoutClick = () => {
    if (isEmpty) {
      setAttemptedCheckout(true);
      return;
    }
    navigate('/checkout');
  };

  return (
    <main>
      <section id="basket">
        <div className="basket-details">
          <h1>Varukorgen</h1>

          {/* ================= MOBILE VIEW ================= */}
          <div className="basket-details-mobile-view">
            {isEmpty ? (
              <div className="basket-single">
                <div className="total">
                  <div className="total-header">
                    <h6>Din varukorg är tom.</h6>
                  </div>
                </div>
              </div>
            ) : (
              basket.map(item => (
                <div key={item.id} className="basket-single">
                  <div className="total">
                    <div className="total-header">
                      <h6>
                        {item.quantity} x{' '}
                        <Link to={`/products/${item.slug}`}>
                          {item.name}
                        </Link>
                      </h6>
                      <p>{item.price} SEK</p>
                    </div>

                    <div className="total-footer">
                      <h6>{item.price * item.quantity} SEK</h6>

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
                          {Array.from({ length: 10 }, (_, i) => i + 1).map(qty => (
                            <option key={qty} value={qty}>
                              {qty}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          className="btn-delete"
                          onClick={() => handleRemove(item.id)}
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ================= DESKTOP VIEW ================= */}
          <div className="basket-details-regular products-view">
            {/* PRODUKT */}
            <div className="product-details">
              <h6>Produkt</h6>

              {isEmpty ? (
                <p className="basket-empty basket-empty--center">
                  Din varukorg är tom.
                </p>
              ) : (
                basket.map(item => (
                  <p key={item.id}>
                    <Link to={`/products/${item.slug}`}>
                      {item.name}
                    </Link>
                  </p>
                ))
              )}
            </div>

            {/* ANTAL */}
            <div className="product-details">
              <h6>Antal</h6>

              {isEmpty ? (
                <p>&nbsp;</p>
              ) : (
                basket.map(item => (
                  <p key={item.id}>{item.quantity}</p>
                ))
              )}
            </div>

            {/* PRIS */}
            <div className="product-details">
              <h6>Pris</h6>

              {isEmpty ? (
                <p>&nbsp;</p>
              ) : (
                basket.map(item => (
                  <p key={item.id}>{item.price} SEK</p>
                ))
              )}
            </div>

            {/* TOTALT */}
            <div className="product-details">
              <h6>Totalt</h6>

              {isEmpty ? (
                <p>&nbsp;</p>
              ) : (
                basket.map(item => (
                  <p key={item.id}>
                    {item.price * item.quantity} SEK
                  </p>
                ))
              )}
            </div>

            {/* ACTIONS */}
            <div className="product-details">
              <h6>&nbsp;</h6>

              {isEmpty ? (
                <p>&nbsp;</p>
              ) : (
                basket.map(item => (
                  <p key={item.id}>
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
                      className="btn-delete"
                      onClick={() => handleRemove(item.id)}
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </p>
                ))
              )}
            </div>
          </div>

          {/* CHECKOUT BUTTON */}
          <div className="button-submit">
            <button
              type="button"
              className="btn-theme"
              onClick={handleCheckoutClick}
            >
              Till kassan
            </button>

            {attemptedCheckout && isEmpty && (
              <p className="basket-warning">
                Du kan inte gå vidare till kassan när varukorgen är tom.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default BasketClient;
