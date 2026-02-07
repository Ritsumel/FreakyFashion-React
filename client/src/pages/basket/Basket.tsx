import BasketClient from './BasketClient';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useBasket } from '../../context/BasketContext';

const Basket = () => {
  const { basket } = useBasket();

  return (
    <>
      <Header />
      <BasketClient basket={basket} />
      <Footer />
    </>
  );
};

export default Basket;
