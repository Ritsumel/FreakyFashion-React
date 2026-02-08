import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useBasket } from '../context/BasketContext';

type BasketItem = {
  name: string;
  price: number;
  quantity: number;
};

type ConfirmationData = {
  customer: {
    name: string;
    lastName: string;
    totalPrice: number;
  };
  basket: BasketItem[];
};

const Confirmation = () => {
  const [data, setData] = useState<ConfirmationData | null>(null);
  const navigate = useNavigate();

  const { refreshBasket } = useBasket();

  useEffect(() => {
    refreshBasket();

    const fetchConfirmation = async () => {
      const res = await fetch('http://localhost:5000/api/confirmation', {
        credentials: 'include',
      });

      if (!res.ok) {
        navigate('/');
        return;
      }

      const json = await res.json();
      setData(json);
    };

    fetchConfirmation();
  }, [navigate, refreshBasket]);

  if (!data) {
    return <p style={{ padding: '2rem' }}>Laddar order...</p>;
  }

  return (
    <>
      <Header />

      <main>
        <section id="confirmation">

          {/* TITLE / INTRO */}
          <div className="parent">
            <h1>Orderbekräftelse</h1>
            <h6>
              Tack för din order, {data.customer.name}{' '}
              {data.customer.lastName}!
            </h6>
          </div>

          {/* ORDER DETAILS */}
          <div className="checkout-details">

            {/* MOBILE VIEW */}
            <div className="checkout-details-mobile-view">
              {data.basket.map((item, i) => (
                <div key={i} className="checkout-single">
                  <div className="total">

                    <div className="total-header">
                      <h6>
                        {item.quantity} × {item.name}
                      </h6>
                      <p>{item.price} SEK</p>
                    </div>

                    <div className="total-footer">
                      <h6>
                        {item.price * item.quantity} SEK
                      </h6>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP VIEW */}
            <div className="checkout-details-regular products-view">

              {/* PRODUKT */}
              <div className="product-details">
                <h6>Produkt</h6>
                {data.basket.map((item, i) => (
                  <p key={i}>{item.name}</p>
                ))}
              </div>

              {/* ANTAL */}
              <div className="product-details">
                <h6>Antal</h6>
                {data.basket.map((item, i) => (
                  <p key={i}>{item.quantity}</p>
                ))}
              </div>

              {/* PRIS */}
              <div className="product-details">
                <h6>Pris</h6>
                {data.basket.map((item, i) => (
                  <p key={i}>{item.price} SEK</p>
                ))}
              </div>

              {/* TOTALT */}
              <div className="product-details">
                <h6>Totalt</h6>
                {data.basket.map((item, i) => (
                  <p key={i}>{item.price * item.quantity} SEK</p>
                ))}
              </div>

            </div>
          </div>

        </section>
      </main>

      <Footer />
    </>
  );
};

export default Confirmation;
