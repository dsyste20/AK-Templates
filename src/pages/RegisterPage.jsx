import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUp } from '../lib/supabaseClient';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Valideer wachtwoorden
    if (password !== confirmPassword) {
      setError('Wachtwoorden komen niet overeen.');
      return;
    }

    if (password.length < 6) {
      setError('Wachtwoord moet minimaal 6 tekens bevatten.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await signUp(email, password);
      
      if (error) {
        setError(error.message || 'Er is een fout opgetreden bij het registreren.');
      } else if (data.user) {
        // Succesvolle registratie, redirect naar dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Er is een onverwachte fout opgetreden.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Registreren</h1>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>
              E-mailadres
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Wachtwoord
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Bevestig wachtwoord
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>

          {error && (
            <div style={{
              padding: '0.75rem',
              backgroundColor: '#fee',
              color: '#c33',
              borderRadius: '4px',
              marginBottom: '1rem',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: loading ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '1rem'
            }}
          >
            {loading ? 'Bezig met registreren...' : 'Registreren'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            Al een account?{' '}
            <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>
              Inloggen
            </Link>
          </p>
          <Link to="/" style={{ color: '#007bff', textDecoration: 'none', fontSize: '0.9rem' }}>
            Terug naar homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
