import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import SiteLayout from './layouts/SiteLayout.jsx';
import AdminDashboardPage from './pages/AdminDashboard.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import Home from './pages/Home.jsx';
import MenuPage from './pages/MenuPage.jsx';
import NotFound from './pages/NotFound.jsx';
import ReservationDetails from './pages/ReservationDetails.jsx';

function DismissBoot() {
  useEffect(() => {
    document.getElementById('boot-loader')?.remove();
  }, []);
  return null;
}

export default function App() {
  return (
    <>
    <DismissBoot />
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="reservation/:id" element={<ReservationDetails />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="admin/login" element={<AdminLogin />} />
      <Route path="admin/dashboard" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
    </Routes>
    </>
  );
}
