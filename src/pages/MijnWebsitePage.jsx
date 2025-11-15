import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { signOut } from '../lib/supabaseClient';

export default function MijnWebsitePage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <div style={styles.navContent}>
          <h1 style={styles.logo}>AK-Templates</h1>
          <div style={styles.navLinks}>
            <a href="/dashboard" style={styles.navLink}>Dashboard</a>
            <a href="/mijn-website" style={styles.navLink}>Mijn Websites</a>
            <a href="/publiceren" style={styles.navLink}>Publiceren</a>
            <a href="/mijn-account" style={styles.navLink}>Mijn Account</a>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Uitloggen
            </button>
          </div>
        </div>
      </nav>

      <div style={styles.content}>
        <h1 style={styles.title}>Mijn Websites</h1>
        <p style={styles.subtitle}>
          Welkom, {profile?.name || user?.email}! Hier kun je al je websites beheren.
        </p>

        <div style={styles.section}>
          <div style={styles.info}>
            <h2 style={styles.infoTitle}>📝 Beheer je Websites</h2>
            <p style={styles.infoText}>
              Op deze pagina kun je al je websites bekijken, bewerken en beheren.
              Je kunt nieuwe websites toevoegen via de website builder of bestaande websites aanpassen.
            </p>
          </div>

          <div style={styles.emptyState}>
            <p style={styles.emptyText}>
              Je hebt nog geen websites aangemaakt.
            </p>
            <p style={styles.emptyHint}>
              Ga naar het <a href="/dashboard" style={styles.link}>Dashboard</a> om te beginnen
              met het bouwen van je eerste website met onze templates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  nav: {
    backgroundColor: 'white',
    borderBottom: '1px solid #e0e0e0',
    padding: '15px 0',
  },
  navContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#007bff',
    margin: 0,
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  navLink: {
    textDecoration: 'none',
    color: '#555',
    fontSize: '16px',
    fontWeight: '500',
  },
  logoutButton: {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '18px',
    color: '#666',
    marginBottom: '40px',
  },
  section: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  info: {
    marginBottom: '30px',
  },
  infoTitle: {
    fontSize: '24px',
    marginBottom: '15px',
    color: '#333',
  },
  infoText: {
    fontSize: '16px',
    color: '#666',
    lineHeight: '1.6',
  },
  emptyState: {
    padding: '40px',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  emptyText: {
    fontSize: '18px',
    color: '#666',
    marginBottom: '10px',
  },
  emptyHint: {
    fontSize: '16px',
    color: '#888',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: '500',
  },
};
