import { useState, useEffect } from 'react';
import { getUser, onAuthStateChange } from '../lib/supabaseClient';

/**
 * Custom hook voor het beheren van authenticatie status
 * @returns {{user: object|null, loading: boolean, error: object|null}}
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Haal initiële gebruiker op
    const fetchUser = async () => {
      try {
        const { data, error } = await getUser();
        if (error) {
          setError(error);
          setUser(null);
        } else {
          setUser(data.user);
        }
      } catch (err) {
        setError(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Luister naar auth wijzigingen
    const subscription = onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription bij unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return { user, loading, error };
}
