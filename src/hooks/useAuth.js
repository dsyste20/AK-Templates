import { useState, useEffect } from 'react';
import { getUser, onAuthStateChange, getProfile } from '../lib/supabaseClient';

/**
 * Custom hook voor het beheren van authenticatie state
 * @returns {Object} Object met user, profile, loading en error state
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check initiële auth status
    checkUser();

    // Luister naar auth state changes
    const { data: authListener } = onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        // Haal profiel op wanneer user inlogt
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    // Cleanup
    return () => {
      authListener?.subscription?.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkUser() {
    try {
      const { user: currentUser, error: userError } = await getUser();
      
      if (userError) {
        setError(userError);
        setLoading(false);
        return;
      }

      if (currentUser) {
        setUser(currentUser);
        await fetchProfile(currentUser.id);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchProfile(userId) {
    try {
      const { profile: userProfile, error: profileError } = await getProfile(userId);
      
      if (profileError) {
        console.error('Fout bij ophalen profiel:', profileError);
        setError(profileError);
      } else {
        setProfile(userProfile);
      }
    } catch (err) {
      console.error('Fout bij ophalen profiel:', err);
      setError(err);
    }
  }

  return {
    user,
    profile,
    loading,
    error,
    isAuthenticated: !!user,
  };
}
