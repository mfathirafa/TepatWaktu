// src/pages/AdminPage.tsx
import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { formatDate, getWarrantyStatus } from '../lib/utils';
import { ArrowLeft, ShieldCheck, Users, Package, CheckCircle2, AlertTriangle, Search, Sparkles } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  email: string;
  role: string;
  subscription_tier: string;
  created_at: string;
}

interface Asset {
  id: string;
  user_id: string;
  category: string;
  warranties: {
    expiry_date: string;
    status: string;
  }[];
}

export default function AdminPage() {
  const { user, role, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();

  const [usersList, setUsersList] = useState<Profile[]>([]);
  const [assetsList, setAssetsList] = useState<Asset[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const itemsPerPage = 10;

  // Access Guard
  useEffect(() => {
    if (authLoading) return;
    
    if (!user || role !== 'admin') {
      alert('Akses Ditolak: Anda tidak memiliki izin admin untuk melihat halaman ini.');
      navigate('/');
    }
  }, [user, role, authLoading, navigate]);

  useEffect(() => {
    async function fetchAdminData() {
      if (role !== 'admin') return;

      try {
        setIsLoading(true);
        
        // Fetch all profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (profilesError) throw profilesError;

        // Fetch all assets with warranties
        const { data: assetsData, error: assetsError } = await supabase
          .from('assets')
          .select(`
            id, user_id, category,
            warranties ( expiry_date, status )
          `);

        if (assetsError) throw assetsError;

        setUsersList(profilesData as Profile[]);
        setAssetsList(assetsData as unknown as Asset[]);

      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (role === 'admin') {
      fetchAdminData();
    }
  }, [role]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleToggleTier = async (targetUser: Profile) => {
    const newTier = targetUser.subscription_tier === 'premium' ? 'free' : 'premium';
    setUpdatingUserId(targetUser.id);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ subscription_tier: newTier })
        .eq('id', targetUser.id);

      if (error) throw error;

      setUsersList(prev => prev.map(u => u.id === targetUser.id ? { ...u, subscription_tier: newTier } : u));
    } catch (err: any) {
      alert('Gagal mengubah tier pengguna: ' + err.message);
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Calculate Statistics
  const stats = useMemo(() => {
    let activeWarranties = 0;
    let expiredWarranties = 0;

    assetsList.forEach(asset => {
      if (asset.warranties && asset.warranties.length > 0) {
        const status = getWarrantyStatus(asset.warranties[0].expiry_date);
        if (status === 'active' || status === 'expiring') activeWarranties++;
        else if (status === 'expired') expiredWarranties++;
      }
    });

    return {
      totalUsers: usersList.length,
      totalAssets: assetsList.length,
      activeWarranties,
      expiredWarranties
    };
  }, [usersList, assetsList]);

  // Asset Analytics Breakdown
  const categoryAnalytics = useMemo(() => {
    if (assetsList.length === 0) return [];
    
    const countMap: Record<string, number> = {};
    assetsList.forEach(asset => {
      const cat = asset.category || 'Lainnya';
      countMap[cat] = (countMap[cat] || 0) + 1;
    });

    return Object.entries(countMap)
      .map(([name, count]) => ({
        name,
        count,
        percentage: ((count / assetsList.length) * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count);
  }, [assetsList]);

  // Pagination & Search
  const filteredUsers = useMemo(() => {
    return usersList.filter(u => 
      (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (u.email || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [usersList, searchQuery]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  if (authLoading || role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Memeriksa otorisasi administrator...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      {/* Navbar Khusus Admin */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2 text-xl font-black text-white hover:opacity-90 transition-opacity">
                <span className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-sm">TW</span>
                <span>TepatWaktu</span>
              </Link>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[10px] font-black uppercase tracking-wider ml-2">
                Admin Panel
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl transition-all"
              >
                <ArrowLeft size={14} />
                <span>Kembali ke Aplikasi</span>
              </Link>

              <div className="hidden sm:block text-xs font-semibold text-slate-400">
                {user?.user_metadata?.full_name || user?.email}
              </div>

              <button 
                onClick={handleLogout}
                className="text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Administrator</h1>
            <p className="text-slate-500 mt-1 text-sm font-medium">Ringkasan analitik, inventaris aset, dan manajemen pengguna platform.</p>
          </div>

          <Link
            to="/"
            className="sm:hidden flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3.5 py-2 rounded-xl"
          >
            <ArrowLeft size={14} />
            <span>Kembali ke Aplikasi</span>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-slate-500 text-sm font-medium">Mengambil data sistem...</p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs border-l-4 border-l-indigo-600">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Total Pengguna</p>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-slate-900">{stats.totalUsers}</span>
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Users size={20} />
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs border-l-4 border-l-blue-600">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Total Aset Tercatat</p>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-slate-900">{stats.totalAssets}</span>
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Package size={20} />
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs border-l-4 border-l-emerald-600">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Garansi Aktif</p>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-slate-900">{stats.activeWarranties}</span>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 size={20} />
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs border-l-4 border-l-rose-500">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Garansi Kedaluwarsa</p>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-slate-900">{stats.expiredWarranties}</span>
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <AlertTriangle size={20} />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Kolom Kiri: Tabel Users */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">Pengguna Terdaftar</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Kelola tingkat langganan dan akses platform</p>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3.5 top-2.5 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Cari nama atau email..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        <th className="px-6 py-4">No</th>
                        <th className="px-6 py-4">Pengguna</th>
                        <th className="px-6 py-4">Tier / Role</th>
                        <th className="px-6 py-4 text-center">Aset</th>
                        <th className="px-6 py-4">Bergabung</th>
                        <th className="px-6 py-4 text-right">Aksi Tier</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {paginatedUsers.length > 0 ? (
                        paginatedUsers.map((u, index) => {
                          const userAssetsCount = assetsList.filter(a => a.user_id === u.id).length;
                          const isUpdating = updatingUserId === u.id;
                          const isPremium = u.subscription_tier === 'premium' || u.subscription_tier === 'pro';

                          return (
                            <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                              <td className="px-6 py-4 text-slate-400 font-semibold">
                                {(currentPage - 1) * itemsPerPage + index + 1}
                              </td>
                              <td className="px-6 py-4">
                                <p className="font-extrabold text-slate-900">{u.name || 'Pengguna Baru'}</p>
                                <p className="text-[11px] text-slate-400 font-medium">{u.email}</p>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                  u.role === 'admin' 
                                    ? 'bg-indigo-100 text-indigo-800' 
                                    : isPremium 
                                    ? 'bg-amber-100 text-amber-800' 
                                    : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {isPremium && <Sparkles size={10} />}
                                  {u.role === 'admin' ? 'Admin' : u.subscription_tier}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-black text-xs">
                                  {userAssetsCount}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-slate-500 font-medium">
                                {formatDate(u.created_at)}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  onClick={() => handleToggleTier(u)}
                                  disabled={isUpdating}
                                  className={`text-[10px] font-black px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                                    isPremium
                                      ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white'
                                  }`}
                                >
                                  {isUpdating ? '...' : isPremium ? 'Ubah ke Free' : 'Jadikan Premium'}
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">
                            Tidak ada pengguna yang cocok dengan pencarian.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="p-4 border-t border-slate-100 bg-white flex justify-between items-center mt-auto">
                    <p className="text-xs text-slate-500 font-medium">
                      Halaman <span className="font-bold text-slate-700">{currentPage}</span> dari <span className="font-bold text-slate-700">{totalPages}</span>
                    </p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                      >
                        Prev
                      </button>
                      <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Kolom Kanan: Asset Analytics */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6">
                  <h2 className="text-base font-black text-slate-900 mb-5">Distribusi Kategori Aset</h2>
                  
                  {categoryAnalytics.length === 0 ? (
                    <p className="text-slate-400 text-xs text-center py-8 font-medium">Belum ada aset terdaftar di sistem.</p>
                  ) : (
                    <div className="space-y-4">
                      {categoryAnalytics.map((cat, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between items-end mb-1.5">
                            <span className="text-xs font-extrabold text-slate-700">{cat.name}</span>
                            <div className="text-right">
                              <span className="text-xs font-black text-slate-900">{cat.count}</span>
                              <span className="text-[10px] text-slate-400 ml-1">({cat.percentage}%)</span>
                            </div>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full bg-indigo-600"
                              style={{ width: `${cat.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-indigo-50/70 rounded-3xl border border-indigo-100 p-6 text-center space-y-2">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-xl mx-auto shadow-xs">
                    <ShieldCheck size={24} />
                  </div>
                  <h3 className="text-xs font-black text-indigo-950 uppercase tracking-wider">Keamanan & Privasi Data</h3>
                  <p className="text-[11px] text-indigo-800/70 leading-relaxed font-medium">
                    Semua data aset, struk, dan nomor kontak dienkripsi aman pada database Supabase sesuai kebijakan privasi TepatWaktu.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
