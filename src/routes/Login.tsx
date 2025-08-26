import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import ErrorMessage from '../components/ui/ErrorMessage';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation() as any;
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const login = useAuthStore(s => s.login);

  const from = location.state?.from || '/catalog';

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      {error && <div className="mb-3"><ErrorMessage message={error} /></div>}
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Username</label>
          <input className="w-full border rounded px-3 py-2" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button disabled={loading} className="w-full px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
} 