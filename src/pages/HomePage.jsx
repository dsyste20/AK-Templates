import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        padding: '1rem 2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#333' }}>
          AK-Templates
        </h1>
        <nav>
          {user ? (
            <Link
              to="/dashboard"
              style={{
                padding: '0.5rem 1.5rem',
                backgroundColor: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px'
              }}
            >
              Dashboard
            </Link>
          ) : (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link
                to="/login"
                style={{
                  padding: '0.5rem 1.5rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px'
                }}
              >
                Inloggen
              </Link>
              <Link
                to="/register"
                style={{
                  padding: '0.5rem 1.5rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px'
                }}
              >
                Registreren
              </Link>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '3rem',
          marginBottom: '1rem',
          color: '#333'
        }}>
          Welkom bij AK-Templates
        </h2>
        <p style={{
          fontSize: '1.25rem',
          color: '#666',
          marginBottom: '2rem',
          maxWidth: '700px',
          margin: '0 auto 2rem'
        }}>
          Een React-platform waar gebruikers eenvoudig websites kunnen bouwen en aanpassen 
          met vooraf gemaakte componenten.
        </p>

        {!user && (
          <div style={{ marginTop: '2rem' }}>
            <Link
              to="/register"
              style={{
                padding: '1rem 2rem',
                backgroundColor: '#28a745',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                fontSize: '1.1rem',
                display: 'inline-block'
              }}
            >
              Nu beginnen
            </Link>
          </div>
        )}

        {/* Features */}
        <div style={{
          marginTop: '4rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          textAlign: 'left'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#007bff', marginBottom: '1rem' }}>Website Builder</h3>
            <p style={{ color: '#666' }}>
              Bouw gemakkelijk single-page of multi-page websites met onze intuïtieve builder.
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#007bff', marginBottom: '1rem' }}>Aanpasbare Componenten</h3>
            <p style={{ color: '#666' }}>
              Pas kleuren, tekst en styling aan van alle componenten met eenvoudige formulieren.
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#007bff', marginBottom: '1rem' }}>Live Preview</h3>
            <p style={{ color: '#666' }}>
              Zie je wijzigingen direct in real-time terwijl je je website aanpast.
            </p>
          </div>
        </div>

        {/* Info Section */}
        <div style={{
          marginTop: '4rem',
          backgroundColor: 'white',
          padding: '3rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'left'
        }}>
          <h3 style={{ color: '#333', marginBottom: '1rem', fontSize: '1.8rem' }}>
            Hoe werkt het?
          </h3>
          <ol style={{ color: '#666', lineHeight: '2', fontSize: '1.1rem' }}>
            <li>Maak een account aan en log in</li>
            <li>Kies tussen een single-page of multi-page website</li>
            <li>Pas de navbar en secties aan naar jouw wensen</li>
            <li>Gebruik de live preview om je wijzigingen te zien</li>
            <li>Sla je templates op en beheer ze in je dashboard</li>
          </ol>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: 'white',
        padding: '2rem',
        textAlign: 'center',
        borderTop: '1px solid #e0e0e0',
        marginTop: '4rem'
      }}>
        <p style={{ color: '#666', margin: 0 }}>
          © 2024 AK-Templates. Alle rechten voorbehouden.
        </p>
      </footer>
    </div>
  );
}
