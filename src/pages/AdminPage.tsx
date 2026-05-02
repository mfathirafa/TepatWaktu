import { useEffect, useState, useMemo } from 'react';
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
  const itemsPerPage = 10;

  // Access Guard
  useEffect(() => {
    if (authLoading) return;
    
    if (!user || role !== 'admin') {
      alert('Akses Ditolak: Anda tidak memiliki izin admin untuk melihat halaman ini.');
      navigate('/dashboard');
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
        <svg className="animate-spin h-10 w-10 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        <p className="text-slate-500 font-medium">Memeriksa otorisasi...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      {/* Navbar Khusus Admin */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold text-white">
                <span>📦</span> ResiKu
              </Link>
              <span className="px-2.5 py-1 rounded bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider ml-4">
                Admin Panel
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-sm font-medium text-slate-300">
                {user?.user_metadata?.full_name || 'Administrator'}
              </div>
              <button 
                onClick={handleLogout}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors px-3 py-2"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Dashboard Administrator</h1>
          <p className="text-slate-500 mt-2">Ringkasan analitik dan manajemen pengguna platform.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-indigo-500">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Total User</p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black text-slate-900">{stats.totalUsers}</span>
                  <span className="text-xl">👥</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-blue-500">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Total Aset</p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black text-slate-900">{stats.totalAssets}</span>
                  <span className="text-xl">📦</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-emerald-500">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Garansi Aktif</p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black text-slate-900">{stats.activeWarranties}</span>
                  <span className="text-xl">✅</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-rose-500">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Garansi Expired</p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black text-slate-900">{stats.expiredWarranties}</span>
                  <span className="text-xl">❌</span>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Kolom Kiri: Tabel Users */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50">
                  <h2 className="text-xl font-bold text-slate-900">Pengguna Terdaftar</h2>
                  <div className="relative w-full sm:w-64">
                    <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
                    <input 
                      type="text" 
                      placeholder="Cari nama atau email..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <th className="px-6 py-4">No</th>
                        <th className="px-6 py-4">Nama & Email</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-center">Aset</th>
                        <th className="px-6 py-4">Bergabung</th>
                        <th className="px-6 py-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedUsers.length > 0 ? (
                        paginatedUsers.map((u, index) => {
                          const userAssetsCount = assetsList.filter(a => a.user_id === u.id).length;
                          return (
                            <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4 text-sm text-slate-500">
                                {(currentPage - 1) * itemsPerPage + index + 1}
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-sm font-bold text-slate-900">{u.name || 'Tanpa Nama'}</p>
                                <p className="text-xs text-slate-500">{u.email}</p>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                  u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' :
                                  u.subscription_tier === 'pro' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {u.role === 'admin' ? 'Admin' : u.subscription_tier}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-sm">
                                  {userAssetsCount}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-500">
                                {formatDate(u.created_at)}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button disabled className="text-xs font-bold text-indigo-600 hover:text-indigo-800 disabled:opacity-40 disabled:cursor-not-allowed">
                                  Lihat Detail
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">
                            Tidak ada pengguna yang cocok dengan pencarian.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="p-4 border-t border-slate-200 bg-white flex justify-between items-center mt-auto">
                    <p className="text-xs text-slate-500 font-medium">
                      Halaman <span className="font-bold text-slate-700">{currentPage}</span> dari <span className="font-bold text-slate-700">{totalPages}</span>
                    </p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 border border-slate-200 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                      >
                        Prev
                      </button>
                      <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 border border-slate-200 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Kolom Kanan: Asset Analytics */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-6">Distribusi Kategori Aset</h2>
                  
                  {categoryAnalytics.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-8">Belum ada aset terdaftar.</p>
                  ) : (
                    <div className="space-y-6">
                      {categoryAnalytics.map((cat, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between items-end mb-2">
                            <span className="text-sm font-bold text-slate-700">{cat.name}</span>
                            <div className="text-right">
                              <span className="text-sm font-black text-slate-900">{cat.count}</span>
                              <span className="text-xs text-slate-400 ml-1">({cat.percentage}%)</span>
                            </div>
                          </div>
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full bg-indigo-500"
                              style={{ width: `${cat.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-indigo-50 rounded-3xl border border-indigo-100 p-6 text-center">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xl mx-auto mb-4">
                    🛡️
                  </div>
                  <h3 className="text-sm font-bold text-indigo-900 mb-2">Sistem Keamanan Aktif</h3>
                  <p className="text-xs text-indigo-700/70">Seluruh data yang ditampilkan di panel ini bersifat rahasia dan tunduk pada kebijakan privasi ResiKu.</p>
                </div>
              </div>

            </div>
          </>
        )}
      </main>
    </div>
  );
}