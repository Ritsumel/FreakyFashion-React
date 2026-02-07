import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
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

  const handleQuantityChange = (productId: string, newQty: number) => {
    updateQuantity(productId, newQty);
  };

  const handleRemove = (productId: string) => {
    removeFromBasket(productId);
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
                          handleQuantityChange(item.id, Number(e.target.value))
                        }
                      >
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(qty => (
                          <option key={qty} value={qty}>{qty}</option>
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
            ))}
          </div>

          {/* DESKTOP VIEW */}
          <div className="basket-details-regular products-view">
            <div className="product-details">
              <h6>Produkt</h6>
              {basket.map(item => (
                <p key={item.id}>
                  <Link to={`/products/${item.slug}`}>
                    {item.name}
                  </Link>
                </p>
              ))}
            </div>

            <div className="product-details">
              <h6>Antal</h6>
              {basket.map(item => <p key={item.id}>{item.quantity}</p>)}
            </div>

            <div className="product-details">
              <h6>Pris</h6>
              {basket.map(item => <p key={item.id}>{item.price} SEK</p>)}
            </div>

            <div className="product-details">
              <h6>Totalt</h6>
              {basket.map(item => (
                <p key={item.id}>{item.price * item.quantity} SEK</p>
              ))}
            </div>

            <div className="product-details">
              <h6>&nbsp;</h6>
              {basket.map(item => (
                <p key={item.id}>
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
                    className="btn-delete"
                    onClick={() => handleRemove(item.id)}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </p>
              ))}
            </div>
          </div>

          <div className="button-submit">
            <button
              type="button"
              className="btn-theme"
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
