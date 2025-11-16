import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Welkom bij AK-WebDesigns</h1>
        <p style={styles.subtitle}>
          Bouw eenvoudig je eigen website met onze aanpasbare componenten en templates
        </p>

        <div style={styles.features}>
          <div style={styles.feature}>
            <h3 style={styles.featureTitle}>📝 Eenvoudig te Gebruiken</h3>
            <p style={styles.featureText}>
              Geen technische kennis nodig. Sleep en pas componenten aan met onze visuele editor.
            </p>
          </div>

          <div style={styles.feature}>
            <h3 style={styles.featureTitle}>🎨 Volledig Aanpasbaar</h3>
            <p style={styles.featureText}>
              Pas kleuren, teksten en layouts aan naar jouw wensen. Maak het helemaal van jezelf.
            </p>
          </div>

          <div style={styles.feature}>
            <h3 style={styles.featureTitle}>🚀 Direct Publiceren</h3>
            <p style={styles.featureText}>
              Publiceer je website in enkele clicks. Geen hosting zorgen.
            </p>
          </div>
        </div>

        <div style={styles.cta}>
          {user ? (
            <Link to="/dashboard" style={styles.ctaButton}>
              Ga naar Dashboard
            </Link>
          ) : (
            <>
              <Link to="/register" style={styles.ctaButton}>
                Gratis Beginnen
              </Link>
              <Link to="/login" style={styles.ctaButtonSecondary}>
                Inloggen
              </Link>
            </>
          )}
        </div>

        <div style={styles.info}>
          <h2 style={styles.infoTitle}>Over AK-WebDesigns</h2>
          <p style={styles.infoText}>
              AK-WebDesigns is een React-platform waar gebruikers eenvoudig websites kunnen
            bouwen en aanpassen met vooraf gemaakte componenten. Of je nu een single-page 
            of multi-page website wilt maken, wij hebben de tools die je nodig hebt.
          </p>
          <p style={styles.infoText}>
            Registreer je vandaag nog en begin met het bouwen van je droomwebsite!
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '60px 20px',
  },
  title: {
    fontSize: '48px',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
  },
  subtitle: {
    fontSize: '20px',
    textAlign: 'center',
    color: '#666',
    marginBottom: '60px',
    maxWidth: '700px',
    margin: '0 auto 60px',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    marginBottom: '60px',
  },
  feature: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  featureTitle: {
    fontSize: '24px',
    marginBottom: '15px',
    color: '#333',
  },
  featureText: {
    fontSize: '16px',
    color: '#666',
    lineHeight: '1.6',
  },
  cta: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '60px',
    flexWrap: 'wrap',
  },
  ctaButton: {
    padding: '15px 40px',
    fontSize: '18px',
    fontWeight: '600',
    color: 'white',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '6px',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    display: 'inline-block',
  },
  ctaButtonSecondary: {
    padding: '15px 40px',
    fontSize: '18px',
    fontWeight: '600',
    color: '#007bff',
    backgroundColor: 'white',
    border: '2px solid #007bff',
    borderRadius: '6px',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'inline-block',
  },
  info: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  infoTitle: {
    fontSize: '32px',
    marginBottom: '20px',
    color: '#333',
  },
  infoText: {
    fontSize: '16px',
    color: '#666',
    lineHeight: '1.8',
    marginBottom: '15px',
    maxWidth: '800px',
    margin: '0 auto 15px',
  },
};
