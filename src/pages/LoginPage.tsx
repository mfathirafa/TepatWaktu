import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
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
    const { error: err } = await signIn(email, password);
    setLoading(false);
    if (err) {
      setError('Email atau password salah. Silakan coba lagi.');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-full bg-white flex flex-col">
      {/* Top Brand */}
      <div className="px-6 pt-14 pb-8">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-9 h-9 bg-indigo-700 rounded-xl flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div>
            <p className="font-bold text-indigo-700 text-base leading-none">INGETIN</p>
            <p className="text-gray-400 text-[10px] font-medium">Lifecycle Assistant</p>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Selamat Datang</h1>
        <p className="text-gray-500 text-sm">Silakan masuk ke akun INGETIN Anda.</p>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Email */}
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Email</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="nama@email.com"
              required
              className="w-full border border-gray-200 bg-gray-50 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-800 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-gray-600">Password</label>
            <a href="#" className="text-xs font-semibold text-indigo-600">Lupa Password?</a>
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full border border-gray-200 bg-gray-50 rounded-xl py-3 pl-10 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-800"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Remember */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="remember"
            checked={remember}
            onChange={e => setRemember(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="remember" className="text-xs text-gray-500 font-medium">Ingat saya di perangkat ini</label>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-indigo-700 hover:bg-indigo-800 disabled:opacity-70 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-700/25 flex items-center justify-center gap-2 mt-2"
        >
          {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {loading ? 'Memproses...' : 'Masuk →'}
        </button>

        {/* Divider */}
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-[10px] text-gray-400 font-semibold uppercase tracking-widest">ATAU</span>
          </div>
        </div>

        {/* Social */}
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 bg-white hover:bg-gray-50 transition-colors">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
            <span className="text-sm font-semibold text-gray-700">Google</span>
          </button>
          <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 bg-white hover:bg-gray-50 transition-colors">
            <div className="w-4 h-4 bg-[#1877F2] rounded flex items-center justify-center">
              <span className="text-white text-[10px] font-bold font-serif">f</span>
            </div>
            <span className="text-sm font-semibold text-gray-700">Facebook</span>
          </button>
        </div>
      </div>

      {/* Register Link */}
      <div className="px-6 py-8 text-center">
        <p className="text-sm text-gray-500">
          Belum punya akun?{' '}
          <Link to="/register" className="text-indigo-600 font-bold">Daftar Sekarang</Link>
        </p>
      </div>
    </div>
  );
}
