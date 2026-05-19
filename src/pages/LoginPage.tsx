import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';
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
    <div className="min-h-full flex flex-col bg-slate-50/50 font-sans p-6 pb-12 relative overflow-y-auto no-scrollbar">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-16 pt-2">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-sm">
            <ShieldCheck size={20} />
          </div>
          <span className="font-bold text-lg text-indigo-950 tracking-tight">Ingetin</span>
        </div>
        <Link to="/register" className="px-4 py-1.5 bg-indigo-50 text-indigo-700 font-semibold text-sm rounded-full hover:bg-indigo-100 transition-colors">
          Daftar
        </Link>
      </div>

      {/* Hero Headline */}
      <div className="text-center mb-10 px-2">
        <h1 className="text-[32px] leading-tight font-extrabold text-slate-900 mb-3 font-heading">
          Kelola Tagihan <br /><span className="text-indigo-600">Tanpa Ribet</span>
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed font-medium">
          Pantau semua jatuh tempo, bayar tepat waktu, dan bebas dari denda keterlambatan.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/60 relative z-10">
        <div className="mb-6">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">MASUK KEMBALI</h2>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-2xl mb-5 font-medium flex items-start gap-2">
            <span className="shrink-0 mt-0.5">⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Alamat Email"
                required
                className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-800 placeholder:text-slate-400"
              />
              <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Kata Sandi"
                required
                className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl py-3.5 pl-12 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-800 placeholder:text-slate-400"
              />
              <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center pt-1 pb-2">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" checked={remember} onChange={e => setRemember(e.target.checked)} className="rounded-md w-4 h-4 border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              <label htmlFor="remember" className="text-xs font-semibold text-slate-500">Ingat saya</label>
            </div>
            <a href="#" className="text-xs text-indigo-600 font-bold hover:underline">Lupa Sandi?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 disabled:hover:bg-indigo-600 text-white font-bold py-4 rounded-2xl transition-all shadow-[0_8px_20px_rgb(79,70,229,0.25)] flex items-center justify-center gap-2 mt-2"
          >
            {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
            {loading ? 'Memproses...' : 'Masuk Sekarang →'}
          </button>
        </form>

        <div className="mt-8 mb-4 relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100" /></div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-slate-300 text-[10px] font-bold tracking-widest uppercase">Atau Lanjutkan Dengan</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button type="button" className="flex items-center justify-center gap-2 bg-slate-50 border border-slate-100 rounded-xl py-3 hover:bg-slate-100 transition-colors">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
            <span className="text-xs font-bold text-slate-600">Google</span>
          </button>
          <button type="button" className="flex items-center justify-center gap-2 bg-slate-50 border border-slate-100 rounded-xl py-3 hover:bg-slate-100 transition-colors">
            <div className="w-4 h-4 bg-[#1877F2] rounded-full flex items-center justify-center text-white"><span className="text-[10px] font-bold font-serif leading-none">f</span></div>
            <span className="text-xs font-bold text-slate-600">Facebook</span>
          </button>
        </div>
      </div>
      
      {/* Decorative BG Blob */}
      <div className="fixed top-[15%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-50/50 rounded-full blur-3xl -z-10 pointer-events-none" />
    </div>
  );
}

function MailIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>; }
function LockIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>; }