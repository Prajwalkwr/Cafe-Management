import { useEffect } from 'react';
import AdminDashboard from '../components/AdminDashboard.jsx';

export default function AdminDashboardPage() {
  useEffect(() => {
    document.title = 'Admin · Mithaas Café';
    return () => {
      document.title = 'Mithaas Café | Kathmandu';
    };
  }, []);

  return <AdminDashboard />;
}
