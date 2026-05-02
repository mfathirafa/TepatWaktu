import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const { error: signInError } = await signIn({ email, password });
      
      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          throw new Error('Email atau kata sandi yang Anda masukkan salah.');
        }
        throw signInError;
      }
      
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat masuk. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Left Sidebar - Hidden on Mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-700 relative overflow-hidden flex-col justify-center p-16">
        {/* Abstract Background Decoration */}
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="relative z-10 bg-white/10 backdrop-blur-xl p-12 rounded-3xl border border-white/20 shadow-2xl">
          <div className="w-16 h-16 bg-emerald-400 rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-lg">
            ✅
          </div>
          <h1 className="text-5xl font-bold text-white leading-tight mb-6">
            Kurator Digital Anda.
          </h1>
          <p className="text-indigo-100 text-lg mb-10 leading-relaxed">
            Tingkatkan catatan keuangan Anda dari berantakan menjadi galeri yang terkurasi. ResiKu mengarsipkan tanda terima dan garansi Anda secara cerdas dengan presisi editorial.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-white">
              <div className="w-10 h-10 rounded-full bg-indigo-500/50 flex items-center justify-center backdrop-blur-sm border border-indigo-400/30">
                <span className="text-emerald-300 text-sm">📸</span>
              </div>
              <span className="font-medium text-lg">Pemindaian struk instan</span>
            </div>
            <div className="flex items-center gap-4 text-white">
              <div className="w-10 h-10 rounded-full bg-indigo-500/50 flex items-center justify-center backdrop-blur-sm border border-indigo-400/30">
                <span className="text-indigo-200 text-sm">🔔</span>
              </div>
              <span className="font-medium text-lg">Pelacakan & notifikasi garansi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Content - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white relative">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl">
              📦
            </div>
            <span className="text-2xl font-bold text-slate-900">ResiKu</span>
          </Link>

          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Selamat datang kembali</h2>
          <p className="text-slate-500 mb-8">Akses brankas digital terkurasi Anda.</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 tracking-wide">ALAMAT EMAIL</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@perusahaan.com"
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors outline-none text-slate-700 placeholder-slate-400"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-700 tracking-wide">KATA SANDI</label>
                <Link to="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Lupa kata sandi?</Link>
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors outline-none text-slate-700 placeholder-slate-400"
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-4 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-70 flex items-center justify-center"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Memproses...
                </span>
              ) : 'MASUK'}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-xs font-semibold text-slate-400 tracking-wider">ATAU LANJUT DENGAN</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          <div className="mt-8">
            <button type="button" className="w-full py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-colors flex items-center justify-center gap-3">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google logo" />
              Akun Google
            </button>
          </div>

          <div className="mt-10 text-center">
            <p className="text-slate-600 font-medium">
              Baru di ResiKu? <Link to="/register" className="text-indigo-700 hover:text-indigo-800 font-bold">Daftar akun baru</Link>
            </p>
          </div>

          <div className="mt-12 p-4 bg-slate-50 rounded-xl flex gap-3 text-left">
            <div className="text-emerald-600 mt-0.5">🔒</div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              ResiKu menggunakan enkripsi 256-bit kelas bank untuk memastikan aset finansial dan data struk sensitif Anda hanya dapat dilihat oleh Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}