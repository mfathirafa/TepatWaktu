import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError('Kata sandi minimal 8 karakter.'); return; }
    setError(null);
    setLoading(true);
    const { error: err } = await signUp(email, password, name);
    setLoading(false);
    if (err) {
      setError(err.message === 'User already registered' ? 'Email sudah terdaftar.' : 'Terjadi kesalahan. Silakan coba lagi.');
    } else {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    }
  };

  return (
    <div className="min-h-full flex flex-col bg-slate-50/50 font-sans p-6 pb-12 relative overflow-y-auto no-scrollbar">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-10 pt-2">
        <Link to="/login" className="w-10 h-10 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors">
          <ArrowLeft size={18} />
        </Link>
      </div>

      {/* Hero Headline */}
      <div className="text-center mb-8 px-2">
        <h1 className="text-[32px] leading-tight font-extrabold text-slate-900 mb-3 font-heading">
          Buat Akun <br /><span className="text-indigo-600">Ingetin</span>
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed font-medium">
          Mulai atur jadwal tagihan dan pajakmu dengan mudah.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/60 relative z-10 flex-1 flex flex-col">
        {success ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-5 py-10">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-4xl shadow-[0_8px_30px_rgb(16,185,129,0.2)]">✓</div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Pendaftaran Berhasil!</h2>
              <p className="text-slate-500 text-sm leading-relaxed">Cek email Anda untuk verifikasi. Anda akan dialihkan ke halaman login...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-2xl mb-2 font-medium flex items-start gap-2">
                <span className="shrink-0 mt-0.5">⚠️</span> {error}
              </div>
            )}

            <div className="space-y-1.5">
              <div className="relative">
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nama Lengkap" required
                  className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-800 placeholder:text-slate-400" />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="relative">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Alamat Email" required
                  className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-800 placeholder:text-slate-400" />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="relative">
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Kata Sandi (Min. 8 karakter)" required
                  className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-800 placeholder:text-slate-400" />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>

            <div className="pt-6 mt-auto">
              <button type="submit" disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 disabled:hover:bg-indigo-600 text-white font-bold py-4 rounded-2xl transition-all shadow-[0_8px_20px_rgb(79,70,229,0.25)] flex items-center justify-center gap-2">
                {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                {loading ? 'Memproses...' : 'Daftar Sekarang →'}
              </button>
              <p className="text-center text-xs text-slate-500 mt-6 font-medium">
                Sudah punya akun? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Masuk di sini</Link>
              </p>
            </div>
          </form>
        )}
      </div>

      {/* Decorative BG Blob */}
      <div className="fixed top-[15%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-50/50 rounded-full blur-3xl -z-10 pointer-events-none" />
    </div>
  );
}
