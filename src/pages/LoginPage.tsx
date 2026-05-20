// src/pages/LoginPage.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage(): JSX.Element {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Pastikan signIn menerima (email, password, remember) dan mengembalikan { error?: any, user?: any }
      const { error: err } = await signIn(email.trim(), password, remember);
      setLoading(false);

      if (err) {
        setError(typeof err === 'string' ? err : 'Email atau password salah. Silakan coba lagi.');
        return;
      }

      navigate('/', { replace: true });
    } catch (err) {
      setLoading(false);
      setError('Terjadi kesalahan jaringan. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#fcf8ff] to-[#f0ecf9]">
      {/* Top Illustration */}
      <div className="relative h-[280px] w-full flex flex-col items-center justify-center p-6 overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-200 opacity-40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-8 w-32 h-32 bg-violet-200 opacity-30 rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-4 animate-bounce" style={{ animationDuration: '3000ms' }}>
            <div className="w-24 h-24 rounded-[1.5rem] bg-white shadow-2xl flex items-center justify-center border border-gray-100/60 overflow-hidden relative">
              <img src="/logo.png" alt="Ingetin Logo" className="absolute w-[180%] h-[180%] max-w-none object-contain" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 leading-tight tracking-tight">
            Your life, organized
            <br />
            and perfectly timed.
          </h1>
        </div>
      </div>

      {/* Bottom Form */}
      <div className="flex-1 bg-white rounded-t-[32px] shadow-[0_-8px_30px_rgba(0,0,0,0.06)] px-6 pt-8 pb-8 flex flex-col">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />

        <div className="mb-6">
          <p className="text-[11px] font-semibold text-indigo-600 uppercase tracking-widest mb-1">Welcome Back</p>
          <h2 className="text-xl font-bold text-gray-900">Login ke <span className="text-indigo-600">INGETIN</span></h2>
        </div>

        {error && (
          <div role="alert" className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-2xl flex items-center gap-2 mb-4">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 flex-1">
          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-[13px] font-semibold text-gray-600">Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                required
                autoComplete="email"
                aria-label="Email"
                className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-gray-800 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-[13px] font-semibold text-gray-600">Password</label>
              <Link to="#" className="text-[12px] font-semibold text-indigo-600 hover:underline">Lupa Password?</Link>
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                required
                autoComplete="current-password"
                aria-label="Password"
                className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-2xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-gray-800"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 flex items-center justify-center"
                aria-pressed={showPassword}
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Remember */}
          <div className="flex items-center gap-2">
            <input
              id="remember"
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="remember" className="text-[13px] text-gray-500 font-medium">Ingat saya di perangkat ini</label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-70 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2"
          >
            {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {loading ? 'Memproses...' : (
              <>
                Masuk
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-gray-200" />
            <span className="mx-4 text-[11px] text-gray-400 font-semibold uppercase tracking-widest">ATAU</span>
            <div className="flex-grow border-t border-gray-200" />
          </div>

          {/* Social buttons (placeholder) */}
          <div className="grid grid-cols-2 gap-3">
            <button type="button" className="flex items-center justify-center gap-2.5 border border-gray-200 rounded-2xl py-3 bg-white hover:bg-gray-50">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              <span className="text-sm font-semibold text-gray-700">Google</span>
            </button>
            <button type="button" className="flex items-center justify-center gap-2.5 border border-gray-200 rounded-2xl py-3 bg-white hover:bg-gray-50">
              <div className="w-5 h-5 bg-[#1877F2] rounded-full flex items-center justify-center">
                <span className="text-white text-[11px] font-bold font-serif">f</span>
              </div>
              <span className="text-sm font-semibold text-gray-700">Facebook</span>
            </button>
          </div>
        </form>

        <p className="text-center text-[13px] text-gray-500 mt-6">
          Belum punya akun?{' '}
          <Link to="/register" className="text-indigo-600 font-bold hover:underline">Daftar Sekarang</Link>
        </p>
      </div>
    </div>
  );
}
