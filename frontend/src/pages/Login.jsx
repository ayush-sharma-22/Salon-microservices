import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'CUSTOMER' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isRegister) {
        // Split name into first and last name
        const names = form.name.trim().split(' ');
        const firstName = names[0] || '';
        const lastName = names.slice(1).join(' ') || '';
        await signup({
          username: form.email,
          email: form.email,
          password: form.password,
          firstName,
          lastName,
          role: form.role,
        });
      } else {
        await login(form.email, form.password);
      }
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F3] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#C9A96E] flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <p className="font-display text-[1.8rem] font-light text-[#1C1C1A]">{isRegister ? 'Create Account' : 'Welcome Back'}</p>
          <p className="text-[12px] text-[#A09A91] mt-1">{isRegister ? 'Join Aura Salon today' : 'Sign in to your account'}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-center text-[12px]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E8E6E1] shadow-sm p-7 space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="block text-[11px] font-semibold text-[#A09A91] uppercase tracking-wider mb-1.5">Full Name</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                  className="w-full bg-[#FAFAF8] border border-[#E8E6E1] rounded-xl px-4 py-2.5 text-[13px] text-[#1C1C1A] focus:outline-none focus:border-[#C9A96E] placeholder-[#A09A91]" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#A09A91] uppercase tracking-wider mb-1.5">Role</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                  className="w-full bg-[#FAFAF8] border border-[#E8E6E1] rounded-xl px-4 py-2.5 text-[13px] text-[#1C1C1A] focus:outline-none focus:border-[#C9A96E]">
                  <option value="CUSTOMER">Customer</option>
                  <option value="OWNER">Salon Owner</option>
                </select>
              </div>
            </>
          )}
          <div>
            <label className="block text-[11px] font-semibold text-[#A09A91] uppercase tracking-wider mb-1.5">Email / Username</label>
            <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full bg-[#FAFAF8] border border-[#E8E6E1] rounded-xl px-4 py-2.5 text-[13px] text-[#1C1C1A] focus:outline-none focus:border-[#C9A96E] placeholder-[#A09A91]" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#A09A91] uppercase tracking-wider mb-1.5">Password</label>
            <input required type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="w-full bg-[#FAFAF8] border border-[#E8E6E1] rounded-xl px-4 py-2.5 text-[13px] text-[#1C1C1A] focus:outline-none focus:border-[#C9A96E] placeholder-[#A09A91]" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-[#1C1C1A] hover:bg-[#C9A96E] text-white font-semibold py-3 rounded-xl text-[13px] transition-colors mt-2 disabled:opacity-60">
            {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>

          <p className="text-center text-[12px] text-[#A09A91]">
            {isRegister ? 'Already have an account? ' : "Don't have an account? "}
            <button type="button" onClick={() => setIsRegister(r => !r)} className="text-[#C9A96E] font-semibold hover:underline">
              {isRegister ? 'Sign In' : 'Register'}
            </button>
          </p>
        </form>

        <p className="text-center text-[10px] text-[#A09A91] mt-4">
          Powered by User Service (Keycloak OAuth2) · Port 8085
        </p>
      </div>
    </div>
  );
}

