import { createContext, useContext, useState, useEffect } from 'react';
import { getUser, onAuthStateChange, signIn, signOut, signUp } from '../lib/supabaseClient';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth moet gebruikt worden binnen een AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Controleer of er al een gebruiker is ingelogd bij het laden van de app
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { user: currentUser } = await getUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Fout bij het initialiseren van authenticatie:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Luister naar auth state changes
    const { data: authListener } = onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Cleanup listener bij unmount
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Login functie
  const login = async (email, password) => {
    try {
      setError(null);
      const { user: loggedInUser, error: loginError } = await signIn(email, password);
      
      if (loginError) {
        setError(loginError);
        return { success: false, error: loginError };
      }
      
      setUser(loggedInUser);
      return { success: true, user: loggedInUser };
    } catch (err) {
      setError(err);
      return { success: false, error: err };
    }
  };

  // Registratie functie
  const register = async (email, password) => {
    try {
      setError(null);
      const { user: newUser, error: registerError } = await signUp(email, password);
      
      if (registerError) {
        setError(registerError);
        return { success: false, error: registerError };
      }
      
      setUser(newUser);
      return { success: true, user: newUser };
    } catch (err) {
      setError(err);
      return { success: false, error: err };
    }
  };

  // Logout functie
  const logout = async () => {
    try {
      setError(null);
      const { error: logoutError } = await signOut();
      
      if (logoutError) {
        setError(logoutError);
        return { success: false, error: logoutError };
      }
      
      setUser(null);
      return { success: true };
    } catch (err) {
      setError(err);
      return { success: false, error: err };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
