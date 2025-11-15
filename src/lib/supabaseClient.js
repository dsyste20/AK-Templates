import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL en/of Anon Key ontbreken. Controleer je .env bestand.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Registreer een nieuwe gebruiker met e-mail en wachtwoord
 * @param {string} email - E-mailadres
 * @param {string} password - Wachtwoord
 * @returns {Promise<{data, error}>}
 */
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
}

/**
 * Log in met e-mail en wachtwoord
 * @param {string} email - E-mailadres
 * @param {string} password - Wachtwoord
 * @returns {Promise<{data, error}>}
 */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

/**
 * Log uit
 * @returns {Promise<{error}>}
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Haal de huidige gebruiker op
 * @returns {Promise<{data, error}>}
 */
export async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  return { data, error };
}

/**
 * Luister naar auth status wijzigingen
 * @param {Function} callback - Callback functie die wordt aangeroepen bij status wijziging
 * @returns {object} Subscription object met unsubscribe methode
 */
export function onAuthStateChange(callback) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
  return subscription;
}
