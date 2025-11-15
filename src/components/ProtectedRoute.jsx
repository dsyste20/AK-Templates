import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * ProtectedRoute component dat routes beschermt tegen niet-geauthenticeerde gebruikers
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - De child componenten die beschermd moeten worden
 * @returns {React.ReactNode} - De children als de gebruiker is ingelogd, anders redirect naar /login
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Toon een loading indicator terwijl we de auth status checken
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #3498db',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem',
            }}
          />
          <p style={{ color: '#666', fontSize: '1.1rem' }}>Laden...</p>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      </div>
    );
  }

  // Als de gebruiker niet is ingelogd, redirect naar de login pagina
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Als de gebruiker is ingelogd, toon de beschermde content
  return children;
};

export default ProtectedRoute;
