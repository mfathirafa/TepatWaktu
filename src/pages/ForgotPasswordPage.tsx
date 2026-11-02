// src/pages/ForgotPasswordPage.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { supabase } from '../services/supabase';

type Step = 'input' | 'sent';

export default function ForgotPasswordPage(): JSX.Element {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<Step>('input');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setError(null);
    setLoading(true);

    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (err) {
      setError('Gagal mengirim email. Pastikan email kamu terdaftar.');
      return;
    }

    setStep('sent');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#fcf8ff] to-[#f0ecf9]">
      {/* Top Section */}
      <div className="relative h-[200px] w-full flex flex-col items-center justify-center p-6 overflow-hidden shrink-0">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-200 opacity-40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-8 w-32 h-32 bg-violet-200 opacity-30 rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-[1.25rem] bg-white shadow-xl flex items-center justify-center border border-gray-100/60 overflow-hidden relative mb-3">
            <img src="/logo.png" alt="TepatWaktu Logo" className="absolute w-[180%] h-[180%] max-w-none object-contain" />
          </div>
          <p className="text-sm font-semibold text-gray-600">TepatWaktu</p>
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 bg-white rounded-t-[32px] shadow-[0_-8px_30px_rgba(0,0,0,0.06)] px-6 pt-6 pb-8 flex flex-col">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />

        {/* Back button */}
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 hover:text-indigo-600 transition-colors mb-6 w-fit"
        >
          <ArrowLeft size={16} />
          Kembali ke Login
        </button>

        {step === 'input' ? (
          <>
            <div className="mb-6">
              <p className="text-[11px] font-semibold text-indigo-600 uppercase tracking-widest mb-1">Reset Password</p>
              <h2 className="text-xl font-bold text-gray-900">Lupa Password?</h2>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                Masukkan email yang kamu pakai untuk mendaftar. Kami akan mengirimkan link reset password ke emailmu.
              </p>
            </div>

            {error && (
              <div role="alert" className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-2xl flex items-center gap-2 mb-4">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-[13px] font-semibold text-gray-600">Email Terdaftar</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    required
                    autoFocus
                    autoComplete="email"
                    className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-2xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-gray-800 placeholder:text-gray-400 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-60 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2"
              >
                {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {loading ? 'Mengirim...' : 'Kirim Link Reset Password'}
              </button>
            </form>

            <p className="text-center text-[13px] text-gray-500 mt-6">
              Ingat password?{' '}
              <Link to="/login" className="text-indigo-600 font-bold hover:underline">Login Sekarang</Link>
            </p>
          </>
        ) : (
          /* Success State */
          <div className="flex flex-col items-center text-center flex-1 justify-center py-8">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-5">
              <CheckCircle size={40} className="text-emerald-500" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Email Terkirim!</h2>
            <p className="text-sm text-gray-500 leading-relaxed max-w-[280px]">
              Kami telah mengirimkan link reset password ke
            </p>
            <p className="text-sm font-bold text-indigo-600 mt-1 mb-4">{email}</p>
            <p className="text-xs text-gray-400 leading-relaxed max-w-[260px]">
              Cek inbox atau folder spam kamu. Link berlaku selama <strong>1 jam</strong>.
            </p>

            <div className="mt-8 w-full space-y-3">
              <button
                onClick={() => { setStep('input'); setEmail(''); setError(null); }}
                className="w-full border border-gray-200 text-gray-700 font-semibold py-3 rounded-2xl hover:bg-gray-50 active:scale-95 transition-all text-sm"
              >
                Kirim Ulang Email
              </button>
              <Link
                to="/login"
                className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl text-center transition-all shadow-lg shadow-indigo-600/25 text-sm active:scale-95"
              >
                Kembali ke Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
