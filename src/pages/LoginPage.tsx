// src/pages/LoginPage.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';

export default function LoginPage(): JSX.Element {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'facebook' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: err } = await signIn(email.trim(), password);
      setLoading(false);

      if (err) {
        const msg = err.message || '';
        if (msg.toLowerCase().includes('email not confirmed')) {
          setError('Email belum dikonfirmasi! Silakan buka inbox email Anda atau konfirmasi via SQL di Supabase.');
        } else if (msg.toLowerCase().includes('invalid login credentials')) {
          setError('Email atau password salah. Silakan coba lagi.');
        } else {
          setError(msg || 'Gagal login. Silakan coba lagi.');
        }
        return;
      }

      navigate('/', { replace: true });
    } catch {
      setLoading(false);
      setError('Terjadi kesalahan jaringan. Silakan coba lagi.');
    }
  };

  const handleGoogleLogin = async () => {
    setSocialLoading('google');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    if (error) {
      setError('Gagal login dengan Google: ' + error.message);
      setSocialLoading(null);
    }
  };

  const handleFacebookLogin = async () => {
    setSocialLoading('facebook');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    if (error) {
      setError('Gagal login dengan Facebook: ' + error.message);
      setSocialLoading(null);
    }
  };

  return (
    <div className="h-full w-full flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#fcf8ff] to-[#f0ecf9]">
      {/* Top Banner (Compact, no scroll) */}
      <div className="relative h-[135px] w-full flex flex-col items-center justify-center p-3 overflow-hidden shrink-0">
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-indigo-200 opacity-40 rounded-full blur-2xl" />
        <div className="absolute top-1/2 -left-6 w-28 h-28 bg-violet-200 opacity-30 rounded-full blur-xl" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-13 h-13 rounded-2xl bg-white shadow-md flex items-center justify-center border border-gray-100/60 overflow-hidden relative mb-1.5">
            <img src="/logo.png" alt="TepatWaktu Logo" className="absolute w-[180%] h-[180%] max-w-none object-contain" />
          </div>
          <h1 className="text-sm font-bold text-gray-900 leading-tight tracking-tight">
            Your life, organized & perfectly timed.
          </h1>
        </div>
      </div>

      {/* Bottom Form Container (No scroll, perfectly fitted) */}
      <div className="flex-1 bg-white rounded-t-[28px] shadow-[0_-8px_30px_rgba(0,0,0,0.06)] px-5 pt-3.5 pb-4 flex flex-col justify-between overflow-hidden">
        <div>
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-2.5" />

          <div className="mb-2.5">
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest leading-none mb-1">Welcome Back</p>
            <h2 className="text-lg font-extrabold text-gray-900 leading-tight">
              Login ke <span className="text-indigo-600">TEPATWAKTU</span>
            </h2>
          </div>

          {error && (
            <div role="alert" className="bg-red-50 border border-red-100 text-red-600 text-xs px-3 py-2 rounded-xl flex items-center gap-2 mb-2 leading-tight">
              <span className="shrink-0">⚠️</span>
              <span className="flex-1">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-2.5">
            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="email" className="text-xs font-semibold text-gray-600 block">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
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
                  className="w-full pl-9 pr-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-gray-800 placeholder:text-gray-400 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-xs font-semibold text-gray-600">Password</label>
                <Link to="/lupa-password" className="text-[11px] font-semibold text-indigo-600 hover:underline">
                  Lupa Password?
                </Link>
              </div>

              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
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
                  className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl text-xs focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-gray-800 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 flex items-center justify-center p-0.5"
                  aria-pressed={showPassword}
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember */}
            <div className="flex items-center gap-2 pt-0.5">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-gray-500 font-medium cursor-pointer">
                Ingat saya di perangkat ini
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-70 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5 text-xs cursor-pointer mt-1"
            >
              {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {loading ? 'Memproses...' : (
                <>
                  Masuk
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Bottom Social & Register Section */}
        <div className="pt-2">
          {/* Divider */}
          <div className="relative flex items-center py-1.5">
            <div className="flex-grow border-t border-gray-100" />
            <span className="mx-3 text-[10px] text-gray-400 font-semibold uppercase tracking-wider">ATAU</span>
            <div className="flex-grow border-t border-gray-100" />
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={socialLoading !== null}
              className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 bg-white hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-60 cursor-pointer"
            >
              {socialLoading === 'google' ? (
                <span className="w-3.5 h-3.5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              ) : (
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
              )}
              <span className="text-xs font-semibold text-gray-700">Google</span>
            </button>
            <button
              type="button"
              onClick={handleFacebookLogin}
              disabled={socialLoading !== null}
              className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 bg-white hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-60 cursor-pointer"
            >
              {socialLoading === 'facebook' ? (
                <span className="w-3.5 h-3.5 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
              ) : (
                <div className="w-4 h-4 bg-[#1877F2] rounded-full flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold font-serif">f</span>
                </div>
              )}
              <span className="text-xs font-semibold text-gray-700">Facebook</span>
            </button>
          </div>

          {/* Register Link — Persis di bawah Google & Facebook, 0 scroll */}
          <p className="text-center text-xs text-gray-500 mt-2.5">
            Belum punya akun?{' '}
            <Link to="/register" className="text-indigo-600 font-bold hover:underline">Daftar Sekarang</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
