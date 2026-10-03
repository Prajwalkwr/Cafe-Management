import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar.jsx';
import ErrorMessage from './ErrorMessage.jsx';
import GalleryManager from './GalleryManager.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';
import MenuManager from './MenuManager.jsx';
import ReservationTable from './ReservationTable.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { fetchManagedGallery, fetchManagedMenu, fetchReservations, fetchStats } from '../services/api.js';

const cards = [
  ['today', 'Reservations Today'],
  ['pending', 'Pending'],
  ['confirmed', 'Confirmed'],
  ['completed', 'Completed'],
  ['total', 'Total reservations'],
  ['menuItems', 'Menu items'],
  ['availableTables', 'Available tables'],
];

export default function AdminDashboard() {
  const [section, setSection] = useState('overview');
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const stats = useAsync(fetchStats);
  const reservations = useAsync(fetchReservations);
  const menu = useAsync(fetchManagedMenu);
  const gallery = useAsync(fetchManagedGallery);

  return (
    <div className="min-h-screen bg-cream md:grid md:grid-cols-[16rem_1fr]">
      <AdminSidebar section={section} onSection={setSection} />
      <div>
        <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-4 md:hidden">
          <p className="truncate text-sm text-stone">{user?.email}</p>
          <button type="button" className="btn btn-line btn-small" onClick={() => { signOut(); navigate('/'); }}>Sign out</button>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <p className="eyebrow">Admin</p>
          <h1 className="display mt-2 text-4xl">Dashboard</h1>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {stats.loading && <LoadingSpinner label="Loading statistics" />}
            {!stats.loading && stats.error && <ErrorMessage message={stats.error} onRetry={stats.reload} />}
            {!stats.loading && !stats.error && cards.map(([key, label]) => (
              <article key={key} className="rounded-3xl border border-line bg-paper px-4 py-4">
                <p className="text-xs tracking-[0.14em] text-stone uppercase">{label}</p>
                <p className="display mt-2 text-4xl">{stats.data?.[key] ?? 0}</p>
              </article>
            ))}
          </div>

          <div className="mt-8">
            {section === 'overview' && (
              <p className="max-w-xl text-stone">Review today’s tables, confirm new reservations, and keep the menu and gallery current.</p>
            )}
            {section === 'reservations' && (
              reservations.loading ? <LoadingSpinner label="Loading reservations" />
                : reservations.error ? <ErrorMessage message={reservations.error} onRetry={reservations.reload} />
                  : <ReservationTable reservations={reservations.data || []} onReload={async () => { await reservations.reload(); await stats.reload(); }} />
            )}
            {section === 'menu' && (
              menu.loading ? <LoadingSpinner label="Loading menu" />
                : menu.error ? <ErrorMessage message={menu.error} onRetry={menu.reload} />
                  : <MenuManager items={menu.data || []} onReload={async () => { await menu.reload(); await stats.reload(); }} />
            )}
            {section === 'gallery' && (
              gallery.loading ? <LoadingSpinner label="Loading gallery" />
                : gallery.error ? <ErrorMessage message={gallery.error} onRetry={gallery.reload} />
                  : <GalleryManager items={gallery.data || []} onReload={gallery.reload} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
