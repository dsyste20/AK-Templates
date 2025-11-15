import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { signOut, updateProfile } from '../lib/supabaseClient';

export default function MijnAccountPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || user?.email || '',
      });
    }
  }, [profile, user]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { profile: updatedProfile, error: updateError } = await updateProfile(
        user.id,
        { name: formData.name }
      );

      if (updateError) {
        setError('Fout bij bijwerken profiel: ' + updateError.message);
      } else {
        setSuccess('Profiel succesvol bijgewerkt!');
        setIsEditing(false);
        // Update lokale state
        if (updatedProfile) {
          setFormData({
            name: updatedProfile.name,
            email: updatedProfile.email,
          });
        }
      }
    } catch {
      setError('Onverwachte fout bij bijwerken profiel');
    } finally {
      setLoading(false);
    }
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
        <h1 style={styles.title}>Mijn Account</h1>
        <p style={styles.subtitle}>
          Beheer je accountgegevens en instellingen
        </p>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>👤 Account Informatie</h2>

          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          {success && (
            <div style={styles.success}>
              {success}
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Naam</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={styles.input}
                  placeholder="Jouw naam"
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  style={{...styles.input, ...styles.inputDisabled}}
                />
                <small style={styles.hint}>
                  Email adres kan momenteel niet worden gewijzigd
                </small>
              </div>

              <div style={styles.formButtons}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    ...styles.saveButton,
                    ...(loading ? styles.buttonDisabled : {})
                  }}
                >
                  {loading ? 'Bezig met opslaan...' : 'Opslaan'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setError('');
                    setSuccess('');
                    if (profile) {
                      setFormData({
                        name: profile.name || '',
                        email: profile.email || user?.email || '',
                      });
                    }
                  }}
                  style={styles.cancelButton}
                >
                  Annuleren
                </button>
              </div>
            </form>
          ) : (
            <div style={styles.profileView}>
              <div style={styles.profileItem}>
                <span style={styles.profileLabel}>Naam:</span>
                <span style={styles.profileValue}>{formData.name || 'Niet ingesteld'}</span>
              </div>
              <div style={styles.profileItem}>
                <span style={styles.profileLabel}>Email:</span>
                <span style={styles.profileValue}>{formData.email}</span>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                style={styles.editButton}
              >
                Bewerken
              </button>
            </div>
          )}
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🔐 Account Beveiliging</h2>
          <p style={styles.infoText}>
            Je account is beveiligd met wachtwoord authenticatie. 
            Zorg ervoor dat je een sterk, uniek wachtwoord gebruikt.
          </p>
          <p style={styles.infoText}>
            Wachtwoord wijzigen functionaliteit wordt binnenkort toegevoegd.
          </p>
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
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333',
  },
  error: {
    padding: '12px',
    backgroundColor: '#fee',
    border: '1px solid #fcc',
    borderRadius: '4px',
    color: '#c33',
    marginBottom: '20px',
  },
  success: {
    padding: '12px',
    backgroundColor: '#efe',
    border: '1px solid #cfc',
    borderRadius: '4px',
    color: '#3c3',
    marginBottom: '20px',
  },
  form: {
    maxWidth: '500px',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
  inputDisabled: {
    backgroundColor: '#f5f5f5',
    cursor: 'not-allowed',
  },
  hint: {
    display: 'block',
    marginTop: '5px',
    fontSize: '12px',
    color: '#888',
  },
  formButtons: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
  saveButton: {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },
  cancelButton: {
    padding: '12px 24px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
  },
  profileView: {
    maxWidth: '500px',
  },
  profileItem: {
    display: 'flex',
    padding: '15px 0',
    borderBottom: '1px solid #eee',
  },
  profileLabel: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#555',
    width: '120px',
  },
  profileValue: {
    fontSize: '16px',
    color: '#333',
  },
  editButton: {
    marginTop: '20px',
    padding: '10px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
  },
  infoText: {
    fontSize: '16px',
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '10px',
  },
};
