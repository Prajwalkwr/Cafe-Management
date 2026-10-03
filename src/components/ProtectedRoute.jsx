import { Navigate, useLocation } from 'react-router-dom';
import ErrorMessage from './ErrorMessage.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { user, ready, error } = useAuth();
  const location = useLocation();

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-cream">
        <LoadingSpinner label="Checking your session" />
      </div>
    );
  }

  if (!user && error) {
    return (
      <div className="grid min-h-screen place-items-center bg-cream px-6">
        <ErrorMessage message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
