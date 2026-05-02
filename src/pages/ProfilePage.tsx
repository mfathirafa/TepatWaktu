import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { formatDate, getWarrantyStatus } from '../lib/utils';

interface Profile {
  id: string;
  name: string;
  email: string;
  role: string;
  subscription_tier: string;
  created_at: string;
}

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState({ total: 0, active: 0, expired: 0 });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [editName, setEditName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProfileData() {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // 1. Ambil Profil
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData as Profile);
        setEditName(profileData.name || '');

        // 2. Ambil Statistik Aset & Garansi
        const { data: assetsData, error: assetsError } = await supabase
          .from('assets')
          .select(`
            id,
            warranties ( expiry_date, status )
          `)
          .eq('user_id', user.id);

        if (assetsError) throw assetsError;

        let active = 0;
        let expired = 0;

        (assetsData || []).forEach((asset: any) => {
          if (asset.warranties && asset.warranties.length > 0) {
            const status = getWarrantyStatus(asset.warranties[0].expiry_date);
            if (status === 'active' || status === 'expiring') active++;
            else if (status === 'expired') expired++;
          }
        });

        setStats({
          total: assetsData?.length || 0,
          active,
          expired
        });

      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError('Gagal memuat profil.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfileData();
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    try {
      setIsSaving(true);
      setError('');
      setSuccessMessage('');

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ name: editName })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Update Auth Metadata as well
      await supabase.auth.updateUser({
        data: { full_name: editName }
      });

      setProfile({ ...profile, name: editName });
      setSuccessMessage('Profil berhasil diperbarui!');
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setError('Gagal menyimpan perubahan profil.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <p className="text-slate-500 font-medium">Memuat profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 md:pb-0">
      {/* Navbar Identik Dashboard */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold text-indigo-700">
                <span>📦</span> ResiKu
              </Link>
              <nav className="hidden md:flex gap-6">
                <Link to="/dashboard" className="text-slate-500 hover:text-slate-900 font-medium px-1 py-5">Dashboard</Link>
                <Link to="/warranties" className="text-slate-500 hover:text-slate-900 font-medium px-1 py-5">Garansi</Link>
                <Link to="/notifications" className="text-slate-500 hover:text-slate-900 font-medium px-1 py-5">Notifikasi</Link>
                <Link to="/profile" className="text-indigo-600 font-semibold border-b-2 border-indigo-600 px-1 py-5">Profil</Link>
              </nav>
            </div>
            <div className="hidden sm:block text-sm font-medium text-slate-700">
              Halo, {profile?.name || user?.email?.split('@')[0]}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Profil & Pengaturan</h1>
          <p className="text-slate-500 mt-2">Kelola akun dan preferensi berlangganan Anda.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Kolom Kiri: Header Profil & Statistik */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Profile Header */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-2xl opacity-50 -mr-10 -mt-10 pointer-events-none"></div>
              
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg shrink-0">
                {getInitials(profile?.name || '')}
              </div>
              
              <div className="flex-1 text-center sm:text-left z-10">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                  <h2 className="text-2xl font-extrabold text-slate-900">{profile?.name}</h2>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold w-max mx-auto sm:mx-0 ${
                    profile?.subscription_tier === 'pro' 
                      ? 'bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 shadow-sm' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {profile?.subscription_tier === 'pro' ? '★ PRO MEMBER' : 'FREE PLAN'}
                  </span>
                </div>
                <p className="text-slate-500 font-medium mb-4">{profile?.email}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Bergabung sejak {profile?.created_at ? formatDate(profile.created_at) : '-'}
                </p>
              </div>
            </div>

            {/* Statistik Akun Card */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center sm:text-left">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Aset</p>
                <div className="flex items-center justify-center sm:justify-start gap-3">
                  <span className="text-3xl font-black text-slate-900">{stats.total}</span>
                  <span className="text-xl">📦</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center sm:text-left">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Garansi Aktif</p>
                <div className="flex items-center justify-center sm:justify-start gap-3">
                  <span className="text-3xl font-black text-slate-900">{stats.active}</span>
                  <span className="text-xl">✅</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center sm:text-left">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Expired</p>
                <div className="flex items-center justify-center sm:justify-start gap-3">
                  <span className="text-3xl font-black text-slate-900">{stats.expired}</span>
                  <span className="text-xl">❌</span>
                </div>
              </div>
            </div>

            {/* Edit Profile Form */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Informasi Pribadi</h3>
              
              {error && <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium">{error}</div>}
              {successMessage && <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-medium">{successMessage}</div>}

              <form onSubmit={handleSaveProfile} className="space-y-5 max-w-lg">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Nama Lengkap</label>
                  <input 
                    type="text" 
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors outline-none text-slate-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Alamat Email</label>
                  <input 
                    type="email" 
                    disabled
                    value={profile?.email || ''}
                    className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed opacity-70"
                  />
                  <p className="text-xs text-slate-400 mt-1">Email digunakan untuk login dan tidak dapat diubah.</p>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={isSaving || editName === profile?.name}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            </div>

            {/* Danger Zone */}
            <div className="bg-rose-50/50 p-8 rounded-3xl border border-rose-100">
              <h3 className="text-lg font-bold text-rose-700 mb-2">Zona Berbahaya</h3>
              <p className="text-rose-600/70 text-sm mb-6">Keluar dari perangkat ini. Anda harus masuk kembali untuk melihat brankas Anda.</p>
              <button 
                onClick={handleLogout}
                className="px-6 py-3 bg-white border border-rose-200 text-rose-600 font-bold rounded-xl hover:bg-rose-50 transition-colors shadow-sm flex items-center gap-2"
              >
                <span>🚪</span> Keluar dari Akun
              </button>
            </div>

          </div>

          {/* Kolom Kanan: Subscription Card */}
          <div className="lg:col-span-1">
            <div className="bg-indigo-700 p-8 rounded-3xl shadow-xl shadow-indigo-600/20 relative overflow-hidden h-full sm:h-auto flex flex-col sticky top-24">
              {/* Background Ornamen */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-50 -mr-20 -mt-20 pointer-events-none"></div>
              
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold rounded-full uppercase tracking-widest mb-6">
                  Paket Saat Ini
                </span>
                
                <h3 className="text-4xl font-black text-white mb-2">
                  {profile?.subscription_tier === 'pro' ? 'PRO' : 'Gratis'}
                </h3>
                <p className="text-indigo-200 font-medium mb-8">
                  {profile?.subscription_tier === 'pro' 
                    ? 'Anda menikmati fitur penuh dari ResiKu.' 
                    : 'Penyimpanan dasar untuk aset pribadi Anda.'}
                </p>

                <div className="space-y-4 mb-10">
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <p className="text-sm text-indigo-50">Kapasitas hingga 50 aset</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <p className="text-sm text-indigo-50">Pengingat garansi via Email</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <p className="text-sm text-indigo-50">Sertifikat Jual Digital</p>
                  </div>
                  {profile?.subscription_tier !== 'pro' && (
                    <div className="flex items-start gap-3 opacity-50">
                      <span className="text-indigo-300 mt-0.5">×</span>
                      <p className="text-sm text-indigo-200">Aset Tanpa Batas</p>
                    </div>
                  )}
                  {profile?.subscription_tier !== 'pro' && (
                    <div className="flex items-start gap-3 opacity-50">
                      <span className="text-indigo-300 mt-0.5">×</span>
                      <p className="text-sm text-indigo-200">Notifikasi WhatsApp</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-auto relative z-10 pt-6 border-t border-indigo-500/50">
                {profile?.subscription_tier === 'pro' ? (
                  <button className="w-full py-4 bg-white/10 text-white border border-white/20 font-bold rounded-xl cursor-default">
                    Paket Aktif
                  </button>
                ) : (
                  <button 
                    disabled
                    className="w-full py-4 bg-white text-indigo-700 hover:bg-slate-50 font-black rounded-xl shadow-lg transition-colors disabled:opacity-80 disabled:cursor-not-allowed relative overflow-hidden group"
                  >
                    <span className="relative z-10">Upgrade ke PRO</span>
                    <span className="absolute inset-0 bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      Coming Soon 🚀
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 px-6 py-3 flex justify-between items-center">
        <Link to="/dashboard" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
          <span className="text-xl">📊</span><span className="text-[10px] font-semibold">Beranda</span>
        </Link>
        <Link to="/warranties" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
          <span className="text-xl">🛡️</span><span className="text-[10px] font-semibold">Garansi</span>
        </Link>
        <Link to="/scan" className="flex flex-col items-center gap-1 text-white bg-indigo-600 w-12 h-12 rounded-full justify-center shadow-lg -mt-8 border-4 border-slate-50">
          <span className="text-2xl">+</span>
        </Link>
        <Link to="/notifications" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
          <span className="text-xl">🔔</span><span className="text-[10px] font-semibold">Notif</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center gap-1 text-indigo-600">
          <span className="text-xl">👤</span><span className="text-[10px] font-bold">Profil</span>
        </Link>
      </nav>
    </div>
  );
}