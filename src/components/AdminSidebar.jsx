import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const items = [
  ['overview', 'Overview'],
  ['reservations', 'Reservations'],
  ['menu', 'Menu'],
  ['gallery', 'Gallery'],
];

export default function AdminSidebar({ section, onSection }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="border-b border-white/10 bg-forest text-cream md:min-h-screen md:border-b-0 md:border-r">
      <div className="flex items-center justify-between px-5 py-5">
        <Link to="/" aria-label="Back to Mithaas Café">
          <Logo tone="light" />
        </Link>
      </div>
      <nav className="flex gap-2 overflow-x-auto px-4 pb-4 md:flex-col md:px-3" aria-label="Admin">
        {items.map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`rounded-full px-4 py-2 text-left text-sm md:rounded-xl ${section === id ? 'bg-cream text-ink' : 'text-cream/80 hover:bg-white/10'}`}
            aria-current={section === id ? 'page' : undefined}
            onClick={() => onSection(id)}
          >
            {label}
          </button>
        ))}
      </nav>
      <div className="hidden px-5 pb-6 md:block">
        <p className="text-xs text-cream/60">{user?.email}</p>
        <button
          type="button"
          className="btn btn-light btn-small mt-4"
          onClick={() => {
            signOut();
            navigate('/');
          }}
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
