import { useState } from 'react';
import { LogOut, Check, MessageSquare, Mail, ChevronRight, User } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const INPUT_CLS = 'w-full border border-slate-200 rounded-xl py-3 px-4 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500';

export default function SettingsPage() {
  const { signOut } = useAuth();
  const { profile, saving, updateProfile } = useProfile();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [saved, setSaved] = useState(false);

  if (profile && name === '' && profile.name) setName(profile.name);
  if (profile && whatsapp === '' && profile.whatsapp) setWhatsapp(profile.whatsapp);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ name: name || profile?.name, whatsapp: whatsapp || undefined });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-full bg-slate-50 pb-8">
      {/* Header */}
      <div className="bg-white px-5 pt-8 pb-4 shadow-sm relative z-10 flex justify-between items-center sticky top-0">
        <h1 className="text-xl font-bold text-slate-800 font-heading">Pengaturan</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Profile Info */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-xl font-bold text-indigo-600 shrink-0">
            {profile?.name?.[0]?.toUpperCase() ?? <User size={24} />}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-800 text-lg truncate">{profile?.name ?? 'Pengguna'}</h3>
            <p className="text-slate-500 text-xs truncate">{profile?.email}</p>
            <span className={`inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold ${profile?.subscription_tier === 'premium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
              {profile?.subscription_tier === 'premium' ? 'PREMIUM' : 'FREE PLAN'}
            </span>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm mb-4">Informasi Personal</h3>
          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Nama Lengkap</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={profile?.name ?? 'Nama Anda'} className={INPUT_CLS} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">No. WhatsApp</label>
              <input type="text" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="+62 8xxx" className={INPUT_CLS} />
            </div>
            <button disabled={saving} className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
              {saved ? <><Check size={16} /> Tersimpan!</> : saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Menyimpan...</> : 'Simpan Perubahan'}
            </button>
          </form>
        </div>

        {/* Prefs */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm mb-4">Preferensi Notifikasi</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><MessageSquare size={14} /></div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">WhatsApp Alert</h4>
                  <p className="text-[10px] text-slate-500">Pengingat H-7 jatuh tempo</p>
                </div>
              </div>
              <div className={`w-10 h-6 rounded-full relative cursor-pointer ${profile?.whatsapp ? 'bg-emerald-400' : 'bg-slate-200'}`}>
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><Mail size={14} /></div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Email Digest</h4>
                  <p className="text-[10px] text-slate-500">Laporan bulanan aset</p>
                </div>
              </div>
              <div className="w-10 h-6 bg-emerald-400 rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm" /></div>
            </div>
          </div>
        </div>

        {/* Links & Danger */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 border-b border-slate-100 transition">
            <span className="text-sm font-semibold text-slate-700">Ubah Kata Sandi</span>
            <ChevronRight size={16} className="text-slate-400" />
          </button>
          <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 border-b border-slate-100 transition">
            <span className="text-sm font-semibold text-slate-700">Bantuan & FAQ</span>
            <ChevronRight size={16} className="text-slate-400" />
          </button>
          <button onClick={handleSignOut} className="w-full px-5 py-4 flex items-center justify-center gap-2 hover:bg-red-50 text-red-600 transition">
            <LogOut size={16} />
            <span className="text-sm font-bold">Keluar Akun</span>
          </button>
        </div>
      </div>
    </div>
  );
}
