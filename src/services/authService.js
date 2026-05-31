import { getSupabaseClient } from './supabaseClient.js';

export async function getSession() {
  const supabase = await getSupabaseClient();

  if (!supabase) {
    return { isLogged: false, session: null, mode: 'error' };
  }

  const { data, error } = await supabase.auth.getSession();

  if (error) {
    return { isLogged: false, session: null, mode: 'error' };
  }

  return {
    isLogged: Boolean(data.session),
    session: data.session,
    mode: 'supabase'
  };
}

export async function signIn({ email, password }) {
  if (!email?.trim()) throw new Error('Informe o e-mail.');
  if (!password?.trim()) throw new Error('Informe a senha.');

  const supabase = await getSupabaseClient();

  if (!supabase) {
    throw new Error('Supabase não configurado corretamente.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw new Error(error.message);

  return { mode: 'supabase', data };
}

export async function signUp({ email, password }) {
  if (!email?.trim()) throw new Error('Informe o e-mail.');
  if (!password?.trim()) throw new Error('Informe a senha.');

  const supabase = await getSupabaseClient();

  if (!supabase) {
    throw new Error('Supabase não configurado corretamente.');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) throw new Error(error.message);

  return data;
}

export async function signOut() {
  const supabase = await getSupabaseClient();

  if (supabase) {
    await supabase.auth.signOut();
  }
}