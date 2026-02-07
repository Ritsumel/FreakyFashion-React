import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import { BookmarkProvider } from './context/BookmarkContext';
import { BasketProvider } from './context/BasketContext';

import AdminProducts from './pages/admin/AdminProducts';
import NewProduct from './pages/admin/NewProduct';
import AdminProductDetails from './pages/admin/AdminProductDetails';
import AdminCategories from './pages/admin/AdminCategories';
import NewCategory from './pages/admin/NewCategory';
import AdminCategoryDetails from './pages/admin/AdminCategoryDetails';
import EditCategory from './pages/admin/EditCategory';

import ProductDetails from './pages/ProductDetails';
import Basket from './pages/basket/Basket';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import Home from './pages/Home';
import Search from './pages/Search';
import Favorites from './pages/Favorites';

function App() {
  return (
    <BrowserRouter>
      <BasketProvider>
        <BookmarkProvider>
          <Routes>

            {/* ADMIN */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<NewProduct />} />
              <Route path="/admin/products/:id" element={<AdminProductDetails />} />
              <Route path="/admin/categories" element={<AdminCategories />} />
              <Route path="/admin/categories/new" element={<NewCategory />} />
              <Route path="/admin/categories/:id" element={<AdminCategoryDetails />} />
              <Route path="/admin/categories/:id/edit" element={<EditCategory />} />
            </Route>

            {/* PUBLIC */}
            <Route path="/products/:slug" element={<ProductDetails />} />
            <Route path="/basket" element={<Basket />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/favorites" element={<Favorites />} />

          </Routes>
        </BookmarkProvider>
      </BasketProvider>
    </BrowserRouter>
  );
}

export default App;
