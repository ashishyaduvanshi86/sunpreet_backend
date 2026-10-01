import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';

export default function AdminLogin() {
  const { user, login } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
      navigate('/admin');
    } catch (err) {
      setError(err?.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1C1917] flex items-center justify-center p-6" data-testid="admin-login">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#D6C0A6] mb-2">Admin Panel</p>
          <h1 className="font-['Playfair_Display'] text-4xl text-[#FBFBF9]">Sunpreet Singh</h1>
        </div>
        <form onSubmit={handleSubmit} className="bg-[#FBFBF9] p-8 space-y-5" data-testid="login-form">
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="w-full bg-transparent border-b border-[#1C1917]/30 focus:border-[#1C1917] py-2 text-[#1C1917] outline-none"
              data-testid="login-email"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-[#57534E] mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-transparent border-b border-[#1C1917]/30 focus:border-[#1C1917] py-2 text-[#1C1917] outline-none"
              data-testid="login-password"
            />
          </div>
          {error && <p className="text-sm text-red-600" data-testid="login-error">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1C1917] text-[#FBFBF9] py-3 text-xs uppercase tracking-[0.2em] hover:bg-[#D6C0A6] hover:text-[#1C1917] transition-colors disabled:opacity-60"
            data-testid="login-submit"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
