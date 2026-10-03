import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { TOKEN_KEY, api } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function restore() {
      const token = sessionStorage.getItem(TOKEN_KEY);
      if (!token) {
        setReady(true);
        return;
      }
      try {
        const data = await api('/api/auth/me');
        if (!ignore) setUser(data.user);
      } catch (err) {
        if (err.status === 401) sessionStorage.removeItem(TOKEN_KEY);
        if (!ignore) setError(err.status === 401 ? '' : err.message);
      } finally {
        if (!ignore) setReady(true);
      }
    }

    restore();

    function onUnauthorized() {
      setUser(null);
    }
    window.addEventListener('mithaas:unauthorized', onUnauthorized);
    return () => {
      ignore = true;
      window.removeEventListener('mithaas:unauthorized', onUnauthorized);
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      error,
      setUser,
      signOut() {
        sessionStorage.removeItem(TOKEN_KEY);
        setUser(null);
      },
    }),
    [user, ready, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used within AuthProvider');
  return value;
}
