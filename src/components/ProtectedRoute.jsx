import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Component voor het beschermen van routes
 * Redirect naar /login als gebruiker niet is ingelogd
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Toon loading state terwijl auth status wordt opgehaald
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem'
      }}>
        Laden...
      </div>
    );
  }

  // Redirect naar login als niet ingelogd
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Render children als ingelogd
  return children;
}
