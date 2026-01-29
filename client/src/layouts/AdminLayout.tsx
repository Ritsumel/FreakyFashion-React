import { Outlet } from 'react-router-dom';
import AdminHeader from '../components/admin/AdminHeader';
import AdminSidebar from '../components/admin/AdminSidebar';

const AdminLayout = () => {
  return (
    <>
      <AdminHeader />

      <main>
        <section id="products-admin">
          <AdminSidebar />
          <Outlet />
        </section>
      </main>
    </>
  );
};

export default AdminLayout;
