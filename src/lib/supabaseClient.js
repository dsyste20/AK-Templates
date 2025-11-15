import { createClient } from '@supabase/supabase-js';

// Verkrijg de Supabase URL en anonieme sleutel uit environment variabelen
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Controleer of de environment variabelen zijn ingesteld
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase configuratie ontbreekt. Zorg ervoor dat VITE_SUPABASE_URL en VITE_SUPABASE_ANON_KEY zijn ingesteld in je .env bestand.');
}

// Maak de Supabase client
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

/**
 * Registreer een nieuwe gebruiker met email en wachtwoord
 * @param {string} email - Het email adres van de gebruiker
 * @param {string} password - Het wachtwoord van de gebruiker
 * @returns {Promise<{user: object, error: object}>}
 */
export const signUp = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { user: data.user, error };
  } catch (error) {
    return { user: null, error };
  }
};

/**
 * Log in met email en wachtwoord
 * @param {string} email - Het email adres van de gebruiker
 * @param {string} password - Het wachtwoord van de gebruiker
 * @returns {Promise<{user: object, error: object}>}
 */
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { user: data.user, session: data.session, error };
  } catch (error) {
    return { user: null, session: null, error };
  }
};

/**
 * Log de huidige gebruiker uit
 * @returns {Promise<{error: object}>}
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    return { error };
  }
};

/**
 * Haal de huidige ingelogde gebruiker op
 * @returns {Promise<{user: object, error: object}>}
 */
export const getUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  } catch (error) {
    return { user: null, error };
  }
};

/**
 * Luister naar wijzigingen in de authenticatiestatus
 * @param {function} callback - Callback functie die wordt aangeroepen bij statuswijzigingen
 * @returns {object} - Subscription object met unsubscribe methode
 */
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback);
};

/**
 * Haal de huidige sessie op
 * @returns {Promise<{session: object, error: object}>}
 */
export const getSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  } catch (error) {
    return { session: null, error };
  }
};
