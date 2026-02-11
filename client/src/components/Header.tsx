import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useBasket } from '../context/BasketContext';

const Header = () => {
  const { count, popSignal } = useBasket();
  const [animate, setAnimate] = useState(false);
  const lastPopSignal = useRef(popSignal);

  useEffect(() => {
    if (popSignal > lastPopSignal.current) {
      setAnimate(true);
      const t = setTimeout(() => setAnimate(false), 350);
      lastPopSignal.current = popSignal;
      return () => clearTimeout(t);
    }

    lastPopSignal.current = popSignal;
  }, [popSignal]);

  return (
    <header>
      <div className="parent">
        <a href="/" id="logo">
          <img
            src="/images/logo2.png"
            alt="Freaky Fashion logotyp"
          />
        </a>

        <div className="box1">
          <form action="/search" method="GET" className="search-field">
            <i id="search-icon" className="fa-solid fa-magnifying-glass"></i>
            <input
              id="search-bar"
              name="q"
              type="text"
              placeholder="Sök produkt"
              required
            />
          </form>

          <div className="icons">
            <Link className='heart-icon' to="/favorites">
              <i className="fa-solid fa-heart"></i>
            </Link>
            <Link to="/basket" className="cart-icon">
              <i className="fa-solid fa-basket-shopping"></i>

              {count > 0 && (
                <span className={`cart-badge ${animate ? 'pop' : ''}`}>
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      <div className="menu">
        <nav>
          <a href="/">Nyheter</a>
          <a href="/">Bästsäljare</a>
          <a href="/">Kvinnor</a>
          <a href="/">Män</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
