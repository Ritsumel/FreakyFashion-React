import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NewProduct from './pages/admin/NewProduct';
import AdminProducts from './pages/admin/AdminProducts';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/products/new" element={<NewProduct />} />
        <Route path="/admin/products" element={<AdminProducts />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
