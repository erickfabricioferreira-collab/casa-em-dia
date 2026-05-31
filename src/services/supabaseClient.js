const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey
);

let clientPromise = null;

export async function getSupabaseClient() {
  if (!isSupabaseConfigured) {
    return null;
  }

  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js').then(
      ({ createClient }) =>
        createClient(
          supabaseUrl,
          supabaseAnonKey
        )
    );
  }

  return clientPromise;
}