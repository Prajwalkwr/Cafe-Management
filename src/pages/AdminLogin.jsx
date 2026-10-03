import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { TOKEN_KEY, api } from '../services/api.js';

export default function AdminLogin() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  useEffect(() => {
    document.title = 'Admin sign in · Mithaas Café';
    return () => {
      document.title = 'Mithaas Café | Kathmandu';
    };
  }, []);

  useEffect(() => {
    if (user) navigate('/admin/dashboard', { replace: true });
  }, [user, navigate]);

  async function onSubmit(event) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError('');
    try {
      const data = await api('/api/auth/login', { method: 'POST', body: { email, password } });
      sessionStorage.setItem(TOKEN_KEY, data.token);
      setUser(data.user);
      navigate(location.state?.from || '/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-cream px-4 py-16">
      <div className="w-full max-w-md rounded-[1.6rem] border border-line bg-paper p-6 sm:p-8">
        <Link to="/" aria-label="Mithaas Café home"><Logo /></Link>
        <h1 className="display mt-6 text-4xl">Admin sign in</h1>
        <p className="mt-2 text-sm text-stone">For the Mithaas Café team.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
          <label className="block">
            <span className="label">Email</span>
            <input className="field" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label className="block">
            <span className="label">Password</span>
            <input className="field" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          {error && <p role="alert" className="text-sm text-terracotta">{error}</p>}
          <button type="submit" className="btn btn-primary w-full" disabled={pending}>
            {pending ? 'Processing...' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  );
}
