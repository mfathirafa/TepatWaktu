import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Please check your .env file.');
}

// Initialize the Supabase client
export const supabase = createClient(
  supabaseUrl || 'http://placeholder.url',
  supabaseAnonKey || 'placeholder_key'
);
