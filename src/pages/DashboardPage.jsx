import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { signOut } from '../lib/supabaseClient';
import TemplatesManager from '../components/TemplatesManager';

export default function DashboardPage() {
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
        <div style={styles.header}>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.welcome}>
            Welkom terug, {profile?.name || user?.email || 'gebruiker'}!
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Mijn Templates</h2>
          <TemplatesManager />
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
    transition: 'color 0.2s',
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
  header: {
    marginBottom: '40px',
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  welcome: {
    fontSize: '18px',
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
  },
};
