import { getLocalSession, setLocalSession } from './storageService.js';
import { getSupabaseClient, isSupabaseConfigured } from './supabaseClient.js';

export async function getSession() {
  if (!isSupabaseConfigured) return { isLogged: getLocalSession(), mode: 'local' };
  const supabase = await getSupabaseClient();
  const { data } = await supabase.auth.getSession();
  return { isLogged: Boolean(data.session), session: data.session, mode: 'supabase' };
}

export async function signIn({ email, password }) {
  if (!email?.trim()) throw new Error('Informe o e-mail.');
  if (!password?.trim()) throw new Error('Informe a senha.');

  if (!isSupabaseConfigured) {
    setLocalSession(true);
    return { mode: 'local' };
  }

  const supabase = await getSupabaseClient();
  const { error, data } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return { mode: 'supabase', data };
}

export async function signOut() {
  if (isSupabaseConfigured) {
    const supabase = await getSupabaseClient();
    await supabase.auth.signOut();
  }
  setLocalSession(false);
}
export async function signUp({ email, password }) {
  if (!email?.trim()) throw new Error('Informe o e-mail.')
  if (!password?.trim()) throw new Error('Informe a senha.')

  const supabase = await getSupabaseClient()

  const { error, data } = await supabase.auth.signUp({
    email,
    password
  })

  if (error) throw new Error(error.message)

  return data
}