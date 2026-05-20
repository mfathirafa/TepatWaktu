import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validasi
    if (password.length < 6) {
      setError('Kata sandi minimal harus 6 karakter.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    if (!fullName.trim()) {
      setError('Nama lengkap wajib diisi.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error: signUpError } = await signUp(email, password, fullName);
      
      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          throw new Error('Email ini sudah terdaftar. Silakan masuk.');
        }
        throw signUpError;
      }
      
      // Jika berhasil dan auto-login
      if (data.user) {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Left Sidebar - Hidden on Mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-700 relative overflow-hidden flex-col justify-center p-16">
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="relative z-10 bg-white/10 backdrop-blur-xl p-12 rounded-3xl border border-white/20 shadow-2xl">
          <div className="w-16 h-16 bg-orange-400 rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-lg">
            ✨
          </div>
          <h1 className="text-5xl font-bold text-white leading-tight mb-6">
            Mulai Perjalanan Anda.
          </h1>
          <p className="text-indigo-100 text-lg mb-10 leading-relaxed">
            Bergabunglah dengan komunitas modern yang cerdas dalam mengelola aset. Buat akun gratis sekarang dan nikmati kemudahan mencatat setiap barang berharga Anda.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-white">
              <div className="w-10 h-10 rounded-full bg-indigo-500/50 flex items-center justify-center backdrop-blur-sm border border-indigo-400/30">
                <span className="text-emerald-300 text-sm">✓</span>
              </div>
              <span className="font-medium text-lg">Gratis 50 struk pertama</span>
            </div>
            <div className="flex items-center gap-4 text-white">
              <div className="w-10 h-10 rounded-full bg-indigo-500/50 flex items-center justify-center backdrop-blur-sm border border-indigo-400/30">
                <span className="text-emerald-300 text-sm">✓</span>
              </div>
              <span className="font-medium text-lg">Akses fitur pantau garansi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Content - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white relative">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-10">
            <div className="w-14 h-14 relative flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="Ingetin Logo" className="absolute w-[180%] h-[180%] max-w-none object-contain" />
            </div>
            <span className="text-3xl font-black text-slate-900 tracking-tight">Ingetin</span>
          </Link>

          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Daftar Akun Baru</h2>
          <p className="text-slate-500 mb-8">Buat brankas digital Anda hari ini.</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 tracking-wide">NAMA LENGKAP</label>
              <input 
                type="text" 
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Budi Santoso"
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors outline-none text-slate-700 placeholder-slate-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 tracking-wide">ALAMAT EMAIL</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors outline-none text-slate-700 placeholder-slate-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 tracking-wide">KATA SANDI</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 karakter"
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors outline-none text-slate-700 placeholder-slate-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 tracking-wide">KONFIRMASI KATA SANDI</label>
              <input 
                type="password" 
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi"
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors outline-none text-slate-700 placeholder-slate-400"
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-4 mt-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-70 flex items-center justify-center"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Mendaftar...
                </span>
              ) : 'DAFTAR SEKARANG'}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-600 font-medium">
              Sudah memiliki akun? <Link to="/login" className="text-indigo-700 hover:text-indigo-800 font-bold">Masuk di sini</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}