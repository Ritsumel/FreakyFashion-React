import { Outlet } from 'react-router-dom';
import AdminHeader from '../components/admin/AdminHeader';

const AdminLayout = () => {
  return (
    <>
      <AdminHeader />

      <main>
        <Outlet />
      </main>
    </>
  );
};

export default AdminLayout;
