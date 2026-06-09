import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Password tidak cocok.'); return; }
    setError(null); setLoading(true);
    const { error: err } = await signUp(form.email, form.password, form.name);
    setLoading(false);
    if (err) setError('Gagal mendaftar. Coba lagi.');
    else navigate('/');
  };

  const strength = form.password.length >= 12 ? 4 : form.password.length >= 8 ? 3 : form.password.length >= 5 ? 2 : form.password.length > 0 ? 1 : 0;
  const strengthLabels = ['', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat'];
  const strengthColors = ['', 'bg-red-400', 'bg-amber-400', 'bg-emerald-400', 'bg-emerald-500'];

  return (
    <div className="min-h-full bg-white flex flex-col">
      <div className="px-6 pt-14 pb-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 bg-indigo-700 rounded-xl flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div>
            <p className="font-bold text-indigo-700 text-base leading-none">TEPATWAKTU</p>
            <p className="text-gray-400 text-[10px] font-medium">Lifecycle Assistant</p>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Buat Akun Baru</h1>
        <p className="text-gray-500 text-sm">Bergabunglah dengan TEPATWAKTU untuk asisten lifecycle yang cerdas.</p>
      </div>

      <div className="flex-1 px-6 space-y-4">
        {error && <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">⚠️ {error}</div>}

        {[
          { key: 'name', label: 'Nama Lengkap', placeholder: 'Masukkan nama lengkap', icon: <User size={16} className="text-gray-400" />, type: 'text' },
          { key: 'email', label: 'Email', placeholder: 'nama@perusahaan.com', icon: <Mail size={16} className="text-gray-400" />, type: 'email' },
        ].map(f => (
          <div key={f.key}>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">{f.label}</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2">{f.icon}</span>
              <input type={f.type} value={(form as any)[f.key]} onChange={set(f.key)} placeholder={f.placeholder}
                className="w-full border border-gray-200 bg-gray-50 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
            </div>
          </div>
        ))}

        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Nomor WhatsApp</label>
          <div className="flex gap-2">
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm font-semibold text-gray-600 flex items-center gap-1.5">
              <Phone size={14} className="text-gray-400" /> +62
            </div>
            <input value={form.phone} onChange={set('phone')} placeholder="81234567890" type="tel"
              className="flex-1 border border-gray-200 bg-gray-50 rounded-xl py-3 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Password</label>
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="••••••••"
              className="w-full border border-gray-200 bg-gray-50 rounded-xl py-3 px-3.5 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {form.password && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1,2,3,4].map(i => <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i <= strength ? strengthColors[strength] : 'bg-gray-200'}`} />)}
              </div>
              <p className={`text-[10px] font-semibold ${strength >= 3 ? 'text-emerald-600' : strength === 2 ? 'text-amber-600' : 'text-red-500'}`}>{strengthLabels[strength]}</p>
            </div>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Konfirmasi Password</label>
          <div className="relative">
            <input type="password" value={form.confirm} onChange={set('confirm')} placeholder="••••••••"
              className={`w-full border rounded-xl py-3 px-3.5 text-sm focus:outline-none focus:ring-2 transition-all bg-gray-50 ${form.confirm && form.confirm !== form.password ? 'border-red-300 focus:ring-red-500/20 focus:border-red-400' : 'border-gray-200 focus:ring-indigo-500/20 focus:border-indigo-500'}`} />
          </div>
          {form.confirm && form.confirm !== form.password && <p className="text-red-500 text-[10px] font-medium mt-1">Password tidak cocok.</p>}
        </div>

        <button onClick={handleSubmit} disabled={loading}
          className="w-full bg-indigo-700 hover:bg-indigo-800 disabled:opacity-70 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-700/25 flex items-center justify-center gap-2">
          {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {loading ? 'Memproses...' : 'Daftar →'}
        </button>
      </div>

      <div className="px-6 py-8 text-center">
        <p className="text-sm text-gray-500">Sudah punya akun? <Link to="/login" className="text-indigo-600 font-bold">Masuk Sekarang</Link></p>
      </div>
    </div>
  );
}
