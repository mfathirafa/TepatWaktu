import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { getWarrantyStatus } from '../lib/utils';

interface Warranty {
  id: string;
  expiry_date: string;
  status: string;
}

interface Asset {
  id: string;
  name: string;
  brand: string;
  category: string;
  purchase_date: string;
  price: number;
  warranties: Warranty[];
}

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Summary Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expiring: 0,
    expired: 0
  });

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return;
      
      try {
        setIsLoading(true);
        // Ambil semua aset milik user beserta garansinya untuk dihitung statistiknya
        const { data, error } = await supabase
          .from('assets')
          .select(`
            *,
            warranties (
              id,
              expiry_date,
              status
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const fetchedAssets = data as unknown as Asset[];
        setAssets(fetchedAssets);

        // Hitung statistik
        let active = 0;
        let expiring = 0;
        let expired = 0;

        fetchedAssets.forEach(asset => {
          if (asset.warranties && asset.warranties.length > 0) {
            // Ambil garansi pertama/terbaru
            const warranty = asset.warranties[0];
            const status = getWarrantyStatus(warranty.expiry_date);
            
            if (status === 'active') active++;
            else if (status === 'expiring') expiring++;
            else if (status === 'expired') expired++;
          }
        });

        setStats({
          total: fetchedAssets.length,
          active,
          expiring,
          expired
        });

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const getStatusBadge = (asset: Asset) => {
    if (!asset.warranties || asset.warranties.length === 0) {
      return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">Tidak ada garansi</span>;
    }
    
    const status = getWarrantyStatus(asset.warranties[0].expiry_date);
    
    switch (status) {
      case 'active':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">Aktif</span>;
      case 'expiring':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Segera Expired</span>;
      case 'expired':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">Expired</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header / Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold text-indigo-700">
                <span>📦</span> ResiKu
              </Link>
              
              {/* Desktop Nav */}
              <nav className="hidden md:flex gap-6">
                <Link to="/dashboard" className="text-indigo-600 font-semibold border-b-2 border-indigo-600 px-1 py-5">Dashboard</Link>
                <Link to="/warranties" className="text-slate-500 hover:text-slate-900 font-medium px-1 py-5 transition-colors">Garansi</Link>
                <Link to="/notifications" className="text-slate-500 hover:text-slate-900 font-medium px-1 py-5 transition-colors">Notifikasi</Link>
                <Link to="/profile" className="text-slate-500 hover:text-slate-900 font-medium px-1 py-5 transition-colors">Profil</Link>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-sm font-medium text-slate-700">
                Halo, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
              </div>
              <button 
                onClick={handleLogout}
                className="text-sm font-medium text-slate-500 hover:text-rose-600 transition-colors px-3 py-2 rounded-lg hover:bg-rose-50"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Ringkasan Aset Anda</h1>
            <p className="text-slate-500 mt-1">Pantau semua garansi dan struk berharga di satu tempat.</p>
          </div>
          <Link 
            to="/scan" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-colors flex items-center gap-2"
          >
            <span>+</span> Tambah Aset
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-lg">📦</div>
            </div>
            <p className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wider">Total Aset</p>
            <h3 className="text-3xl font-bold text-slate-900">
              {isLoading ? <div className="h-9 w-16 bg-slate-200 animate-pulse rounded"></div> : stats.total}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 text-lg">✅</div>
            </div>
            <p className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wider">Garansi Aktif</p>
            <h3 className="text-3xl font-bold text-slate-900">
              {isLoading ? <div className="h-9 w-16 bg-slate-200 animate-pulse rounded"></div> : stats.active}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 text-lg">⚠️</div>
            </div>
            <p className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wider">Segera Expired</p>
            <h3 className="text-3xl font-bold text-slate-900">
              {isLoading ? <div className="h-9 w-16 bg-slate-200 animate-pulse rounded"></div> : stats.expiring}
            </h3>
            <p className="text-xs text-amber-600 mt-2 font-medium">≤ 30 hari lagi</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 text-lg">❌</div>
            </div>
            <p className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wider">Sudah Expired</p>
            <h3 className="text-3xl font-bold text-slate-900">
              {isLoading ? <div className="h-9 w-16 bg-slate-200 animate-pulse rounded"></div> : stats.expired}
            </h3>
          </div>
        </div>

        {/* Recent Assets Section */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-900">Aset Terbaru</h2>
            <Link to="/warranties" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Lihat Semua Garansi &rarr;</Link>
          </div>

          {isLoading ? (
            // Loading Skeleton
            <div className="p-6 space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                  </div>
                  <div className="h-6 bg-slate-200 rounded-full w-20"></div>
                </div>
              ))}
            </div>
          ) : assets.length === 0 ? (
            // Empty State
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-4xl mb-4">
                📭
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Belum ada aset</h3>
              <p className="text-slate-500 max-w-sm mb-6">Mulai simpan struk belanja dan pantau garansi barang berharga Anda sekarang.</p>
              <Link 
                to="/scan" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-sm transition-colors"
              >
                + Tambah Aset Pertama
              </Link>
            </div>
          ) : (
            // Assets List
            <div className="divide-y divide-slate-100">
              {assets.slice(0, 5).map((asset) => (
                <Link 
                  key={asset.id} 
                  to={`/assets/${asset.id}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-slate-50 transition-colors gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-xl font-bold border border-indigo-100">
                      {asset.category === 'Elektronik' ? '💻' : asset.category === 'Kendaraan' ? '🚗' : '🏷️'}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{asset.name}</h4>
                      <p className="text-sm text-slate-500 flex items-center gap-2">
                        <span className="font-medium text-slate-700">{asset.brand || 'Tanpa Brand'}</span>
                        <span>•</span>
                        <span>{asset.category || 'Lainnya'}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
                    {getStatusBadge(asset)}
                    <span className="text-slate-400">&rsaquo;</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      
      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 px-6 py-3 flex justify-between items-center">
        <Link to="/dashboard" className="flex flex-col items-center gap-1 text-indigo-600">
          <span className="text-xl">📊</span>
          <span className="text-[10px] font-bold">Beranda</span>
        </Link>
        <Link to="/warranties" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
          <span className="text-xl">🛡️</span>
          <span className="text-[10px] font-semibold">Garansi</span>
        </Link>
        <Link to="/scan" className="flex flex-col items-center gap-1 text-white bg-indigo-600 w-12 h-12 rounded-full justify-center shadow-lg -mt-8 border-4 border-slate-50">
          <span className="text-2xl">+</span>
        </Link>
        <Link to="/notifications" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
          <span className="text-xl">🔔</span>
          <span className="text-[10px] font-semibold">Notif</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
          <span className="text-xl">👤</span>
          <span className="text-[10px] font-semibold">Profil</span>
        </Link>
      </nav>
      {/* Spasi untuk mobile bottom nav */}
      <div className="h-20 md:hidden"></div>
    </div>
  );
}