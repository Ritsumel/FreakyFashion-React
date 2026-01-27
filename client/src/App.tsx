import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NewProduct from './pages/admin/NewProduct';
import AdminProducts from './pages/admin/AdminProducts';
import ProductDetails from './pages/ProductDetails';
import Basket from './pages/basket/Basket';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import Home from './pages/Home';
import Search from './pages/Search';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/products/new" element={<NewProduct />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/products/:slug" element={<ProductDetails />} />
        <Route path="/basket" element={<Basket />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
