// src/pages/ResetPasswordPage.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../services/supabase';

export default function ResetPasswordPage(): JSX.Element {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  // Supabase sends the user to this page with a hash fragment containing the token
  // The onAuthStateChange listener picks it up automatically
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSessionReady(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const strength = password.length >= 12 ? 4 : password.length >= 8 ? 3 : password.length >= 5 ? 2 : password.length > 0 ? 1 : 0;
  const strengthLabels = ['', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat'];
  const strengthColors = ['', 'bg-red-400', 'bg-amber-400', 'bg-emerald-400', 'bg-emerald-500'];
  const strengthTextColors = ['', 'text-red-500', 'text-amber-600', 'text-emerald-600', 'text-emerald-600'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('Password tidak cocok.');
      return;
    }
    if (password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }

    setError(null);
    setLoading(true);

    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (err) {
      setError('Gagal memperbarui password: ' + err.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => navigate('/login'), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#fcf8ff] to-[#f0ecf9]">
      {/* Top */}
      <div className="relative h-[180px] w-full flex flex-col items-center justify-center p-6 overflow-hidden shrink-0">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-200 opacity-40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-8 w-32 h-32 bg-violet-200 opacity-30 rounded-full blur-2xl" />
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-[1rem] bg-white shadow-xl flex items-center justify-center border border-gray-100/60 overflow-hidden relative mb-2">
            <img src="/logo.png" alt="TepatWaktu" className="absolute w-[180%] h-[180%] max-w-none object-contain" />
          </div>
          <p className="text-sm font-semibold text-gray-600">TepatWaktu</p>
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 bg-white rounded-t-[32px] shadow-[0_-8px_30px_rgba(0,0,0,0.06)] px-6 pt-6 pb-8 flex flex-col">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />

        {success ? (
          <div className="flex flex-col items-center text-center flex-1 justify-center py-8">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-5">
              <CheckCircle size={40} className="text-emerald-500" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Password Berhasil Diubah!</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Kamu akan diarahkan ke halaman login dalam beberapa detik...
            </p>
            <Link
              to="/login"
              className="mt-6 bg-indigo-600 text-white font-bold py-3.5 px-8 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/25 text-sm"
            >
              Login Sekarang
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-[11px] font-semibold text-indigo-600 uppercase tracking-widest mb-1">Buat Password Baru</p>
              <h2 className="text-xl font-bold text-gray-900">Reset Password</h2>
              <p className="text-sm text-gray-500 mt-2">Masukkan password baru untuk akunmu.</p>
            </div>

            {!sessionReady && (
              <div className="bg-amber-50 border border-amber-100 text-amber-700 text-sm px-4 py-3 rounded-2xl flex items-start gap-2 mb-4">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>Pastikan kamu membuka halaman ini dari link di email. Jika sudah, tunggu sebentar...</span>
              </div>
            )}

            {error && (
              <div role="alert" className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-2xl flex items-center gap-2 mb-4">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password */}
              <div>
                <label className="text-[13px] font-semibold text-gray-600 mb-1.5 block">Password Baru</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 karakter"
                    required
                    autoFocus
                    className="w-full pl-11 pr-12 py-3.5 border border-gray-200 rounded-2xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-gray-800 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i <= strength ? strengthColors[strength] : 'bg-gray-200'}`} />
                      ))}
                    </div>
                    <p className={`text-[10px] font-semibold ${strengthTextColors[strength]}`}>{strengthLabels[strength]}</p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-[13px] font-semibold text-gray-600 mb-1.5 block">Konfirmasi Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Ulangi password baru"
                    required
                    className={`w-full pl-11 pr-4 py-3.5 border rounded-2xl text-sm focus:ring-2 text-gray-800 outline-none ${
                      confirm && confirm !== password
                        ? 'border-red-300 focus:ring-red-500/20 focus:border-red-400'
                        : 'border-gray-200 focus:ring-indigo-500/20 focus:border-indigo-500'
                    }`}
                  />
                </div>
                {confirm && confirm !== password && (
                  <p className="text-red-500 text-[10px] font-medium mt-1">Password tidak cocok.</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !sessionReady}
                className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-60 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2"
              >
                {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {loading ? 'Memperbarui...' : 'Simpan Password Baru'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
