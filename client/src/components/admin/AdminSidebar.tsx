import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar">
      <NavLink
        to="/admin/products"
        className={({ isActive }) => (isActive ? 'active' : '')}
      >
        Produkter
      </NavLink>

      <NavLink
        to="/admin/categories"
        className={({ isActive }) => (isActive ? 'active' : '')}
      >
        Kategorier
      </NavLink>
    </div>
  );
};

export default AdminSidebar;
