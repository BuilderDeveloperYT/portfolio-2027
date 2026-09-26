import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
  const { authenticated, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (authenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const ok = login(username, password);
    if (ok) {
      navigate('/admin/dashboard');
    } else {
      setError('Credenziali non valide.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-bg px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-neon">Area riservata</p>
          <h1 className="mt-2 text-2xl font-bold text-base-text">Accesso Admin</h1>
        </div>

        <form onSubmit={handleSubmit} className="card-panel space-y-5 p-6">
          <div>
            <label htmlFor="username" className="label-field">
              Username o Email
            </label>
            <input
              id="username"
              className="input-field"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="label-field">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="input-field"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" className="btn-primary w-full">
            Accedi
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-base-muted">
          Autenticazione locale — non pensata per un ambiente pubblico. Configura le credenziali nel file{' '}
          <code className="font-mono text-neon">.env</code>.
        </p>
      </div>
    </div>
  );
}
