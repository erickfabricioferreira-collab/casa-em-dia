import { useState } from 'react';
import { CheckCircle2, House } from 'lucide-react';
import { signIn } from '../services/authService.js';
import { isSupabaseConfigured } from '../services/supabaseClient.js';

export function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ email: 'erick@casa.com', password: '123456' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(form);
      onLogin();
    } catch (err) {
      setError(err.message || 'Não foi possível entrar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="brand-block">
        <div className="app-logo" aria-hidden="true">
          <House />
          <CheckCircle2 />
        </div>
        <h1>Organizador Contas Familiar</h1>
        <p>Organizar a casa sem transformar isso em uma dor.</p>
      </section>

      <form className="card form-card" onSubmit={handleSubmit} noValidate>
        <label>
          E-mail
          <input type="email" value={form.email} autoComplete="email" onChange={event => setForm({ ...form, email: event.target.value })} />
        </label>
        <label>
          Senha
          <input type="password" value={form.password} autoComplete="current-password" onChange={event => setForm({ ...form, password: event.target.value })} />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="primary-button" type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar na casa'}</button>
        <small>{isSupabaseConfigured ? 'Login conectado ao Supabase.' : 'Modo local para MVP. Supabase preparado para ativação.'}</small>
      </form>
    </main>
  );
}
