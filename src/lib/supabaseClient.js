import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase configuratie ontbreekt. Controleer je .env bestand.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

/**
 * Registreer een nieuwe gebruiker en maak een profile aan
 * @param {string} email - Email adres van de gebruiker
 * @param {string} password - Wachtwoord van de gebruiker
 * @param {string} name - Naam van de gebruiker
 * @returns {Promise<{user, error}>}
 */
export async function signUp(email, password, name) {
  try {
    // Maak een nieuw account aan
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return { user: null, error: authError };
    }

    if (!authData.user) {
      return { user: null, error: new Error('Gebruiker kon niet worden aangemaakt') };
    }

    // Maak een profile record aan in de profiles tabel
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: authData.user.id,
          email: email,
          name: name,
        },
      ]);

    if (profileError) {
      console.error('Fout bij aanmaken profile:', profileError);
      // We geven de user toch terug, het account is aangemaakt
      return { 
        user: authData.user, 
        error: new Error('Account aangemaakt maar profiel kon niet worden opgeslagen') 
      };
    }

    return { user: authData.user, error: null };
  } catch (error) {
    return { user: null, error };
  }
}

/**
 * Log in met email en wachtwoord
 * @param {string} email - Email adres
 * @param {string} password - Wachtwoord
 * @returns {Promise<{user, error}>}
 */
export async function signIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { user: data?.user || null, error };
  } catch (error) {
    return { user: null, error };
  }
}

/**
 * Log de huidige gebruiker uit
 * @returns {Promise<{error}>}
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    return { error };
  }
}

/**
 * Haal de huidige ingelogde gebruiker op
 * @returns {Promise<{user, error}>}
 */
export async function getUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  } catch (error) {
    return { user: null, error };
  }
}

/**
 * Luister naar auth state veranderingen
 * @param {Function} callback - Callback functie die wordt aangeroepen bij auth veranderingen
 * @returns {Object} Subscription object met unsubscribe functie
 */
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}

/**
 * Haal het profiel van een gebruiker op
 * @param {string} userId - ID van de gebruiker
 * @returns {Promise<{profile, error}>}
 */
export async function getProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    return { profile: data, error };
  } catch (error) {
    return { profile: null, error };
  }
}

/**
 * Update het profiel van een gebruiker
 * @param {string} userId - ID van de gebruiker
 * @param {Object} updates - Object met velden om te updaten
 * @returns {Promise<{profile, error}>}
 */
export async function updateProfile(userId, updates) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    return { profile: data, error };
  } catch (error) {
    return { profile: null, error };
  }
}
