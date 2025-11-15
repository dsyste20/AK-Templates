import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { signOut } from '../lib/supabaseClient';
import TemplatesManager from '../components/TemplatesManager';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate('/');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        padding: '1rem 2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#333' }}>Dashboard</h1>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
            Welkom, {user?.email}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => navigate('/builder')}
            style={{
              padding: '0.5rem 1.5rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Builder
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1.5rem',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Uitloggen
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem 2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ marginTop: 0, color: '#333' }}>Welkom bij je Dashboard</h2>
          <p style={{ color: '#666' }}>
            Hier kun je je website templates beheren. Maak nieuwe templates aan, bewerk bestaande 
            of verwijder templates die je niet meer nodig hebt.
          </p>
        </div>

        {/* Templates Manager */}
        <TemplatesManager />
      </main>
    </div>
  );
}
