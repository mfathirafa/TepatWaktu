import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';

interface Warranty {
  id: string;
  expiry_date: string;
  duration_months: number;
  status: string;
}

interface Asset {
  id: string;
  name: string;
  brand: string;
  category: string;
  purchase_date: string;
  created_at?: string;
  warranties: Warranty[];
}

// Helpers
const getStatus = (expiryDateStr: string) => {
  const expiry = new Date(expiryDateStr).getTime();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffTime = expiry - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'expired';
  if (diffDays <= 30) return 'expiring';
  return 'active';
};

const getDaysDiffText = (expiryDateStr: string) => {
  const expiry = new Date(expiryDateStr).getTime();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffTime = expiry - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return `Expired ${Math.abs(diffDays)} hari lalu`;
  if (diffDays === 0) return 'Expired hari ini';
  return `Sisa ${diffDays} hari`;
};

const getProgressPercentage = (purchaseStr: string, expiryStr: string) => {
  const purchase = new Date(purchaseStr).getTime();
  const expiry = new Date(expiryStr).getTime();
  const today = new Date().getTime();
  
  const totalDuration = expiry - purchase;
  if (totalDuration <= 0) return 100;
  
  const elapsed = today - purchase;
  let progress = (elapsed / totalDuration) * 100;
  
  if (progress < 0) progress = 0;
  if (progress > 100) progress = 100;
  
  return progress;
};

export default function WarrantyPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter & Sort states
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [sortBy, setSortBy] = useState('Terbaru');

  useEffect(() => {
    async function fetchWarranties() {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('assets')
          .select(`
            *,
            warranties (
              id,
              expiry_date,
              duration_months,
              status
            )
          `)
          .eq('user_id', user.id);

        if (error) throw error;

        // Filter aset yang hanya memiliki garansi
        const assetsWithWarranty = (data as unknown as Asset[]).filter(
          a => a.warranties && a.warranties.length > 0
        );
        
        setAssets(assetsWithWarranty);
      } catch (error) {
        console.error('Error fetching warranties:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchWarranties();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const filteredAndSortedAssets = useMemo(() => {
    return assets
      .filter(asset => {
        const warranty = asset.warranties[0];
        const status = getStatus(warranty.expiry_date);
        
        // Status filter
        if (statusFilter === 'Aktif' && status !== 'active') return false;
        if (statusFilter === 'Segera Expired' && status !== 'expiring') return false;
        if (statusFilter === 'Expired' && status !== 'expired') return false;
        
        // Category filter
        if (categoryFilter !== 'Semua' && asset.category !== categoryFilter) return false;
        
        return true;
      })
      .sort((a, b) => {
        const wA = a.warranties[0];
        const wB = b.warranties[0];
        
        if (sortBy === 'Terbaru') {
          const dateA = a.created_at || a.purchase_date;
          const dateB = b.created_at || b.purchase_date;
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        } else if (sortBy === 'Expiry Terdekat') {
          return new Date(wA.expiry_date).getTime() - new Date(wB.expiry_date).getTime();
        } else if (sortBy === 'Nama A-Z') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [assets, statusFilter, categoryFilter, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 md:pb-0">
      {/* Navbar (Identik dengan Dashboard) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold text-indigo-700">
                <span>📦</span> ResiKu
              </Link>
              
              <nav className="hidden md:flex gap-6">
                <Link to="/dashboard" className="text-slate-500 hover:text-slate-900 font-medium px-1 py-5 transition-colors">Dashboard</Link>
                <Link to="/warranties" className="text-indigo-600 font-semibold border-b-2 border-indigo-600 px-1 py-5">Garansi</Link>
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
                className="text-sm font-medium text-slate-500 hover:text-rose-600 transition-colors px-3 py-2 rounded-lg hover:bg-rose-50 hidden sm:block"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Halaman */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Pantau Garansi</h1>
          <p className="text-slate-500 mt-2 text-lg">Anda memiliki total <strong className="text-indigo-600">{assets.length}</strong> aset garansi terdaftar.</p>
        </div>

        {/* Filter & Sort Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-sm font-bold text-slate-400">STATUS</span>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 w-full sm:w-auto"
              >
                <option value="Semua">Semua Status</option>
                <option value="Aktif">Aktif</option>
                <option value="Segera Expired">Segera Expired</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-sm font-bold text-slate-400">KATEGORI</span>
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 w-full sm:w-auto"
              >
                <option value="Semua">Semua Kategori</option>
                <option value="Elektronik">Elektronik</option>
                <option value="Furnitur">Furnitur</option>
                <option value="Kendaraan">Kendaraan</option>
                <option value="Pakaian">Pakaian</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-sm font-bold text-slate-400">URUTKAN</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 w-full sm:w-auto"
            >
              <option value="Terbaru">Terbaru Ditambahkan</option>
              <option value="Expiry Terdekat">Expiry Terdekat</option>
              <option value="Nama A-Z">Nama A-Z</option>
            </select>
          </div>
        </div>

        {/* Warranty Cards List */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                  <div className="w-20 h-6 bg-slate-200 rounded-full"></div>
                </div>
                <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-6"></div>
                <div className="h-2 bg-slate-200 rounded-full w-full mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-8 bg-slate-200 rounded-lg w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredAndSortedAssets.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
              🛡️
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Belum ada aset garansi</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8">Anda belum memiliki aset dengan data garansi untuk filter ini, atau Anda belum menambahkan aset apapun.</p>
            <Link to="/scan" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow-sm transition-colors">
              + Tambah Aset Baru
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedAssets.map((asset) => {
              const warranty = asset.warranties[0];
              const status = getStatus(warranty.expiry_date);
              const progress = getProgressPercentage(asset.purchase_date, warranty.expiry_date);
              
              return (
                <div key={asset.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-xl font-bold border border-indigo-100">
                      {asset.category === 'Elektronik' ? '💻' : asset.category === 'Kendaraan' ? '🚗' : asset.category === 'Furnitur' ? '🛋️' : asset.category === 'Pakaian' ? '👕' : '🏷️'}
                    </div>
                    
                    {/* Status Badge */}
                    {status === 'active' && <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Aktif</span>}
                    {status === 'expiring' && <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">Segera Expired</span>}
                    {status === 'expired' && <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full">Expired</span>}
                  </div>

                  <div className="mb-6 flex-1">
                    <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{asset.name}</h3>
                    <p className="text-sm font-medium text-slate-500 mt-1">{asset.brand || 'Tanpa Brand'} • {asset.category}</p>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Tgl Beli</span>
                        <span className="font-semibold text-slate-700">{new Date(asset.purchase_date).toLocaleDateString('id-ID')}</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Expired</span>
                        <span className="font-semibold text-slate-700">{new Date(warranty.expiry_date).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between items-end mb-2">
                      <span className={`text-sm font-bold ${
                        status === 'expired' ? 'text-rose-600' : status === 'expiring' ? 'text-amber-600' : 'text-emerald-600'
                      }`}>
                        {getDaysDiffText(warranty.expiry_date)}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">{warranty.duration_months} Bulan Total</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          status === 'expired' ? 'bg-rose-500' : status === 'expiring' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <Link 
                    to={`/assets/${asset.id}`}
                    className="w-full py-3 bg-white border border-indigo-200 text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-colors text-center"
                  >
                    Lihat Detail
                  </Link>

                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 px-6 py-3 flex justify-between items-center">
        <Link to="/dashboard" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
          <span className="text-xl">📊</span>
          <span className="text-[10px] font-semibold">Beranda</span>
        </Link>
        <Link to="/warranties" className="flex flex-col items-center gap-1 text-indigo-600">
          <span className="text-xl">🛡️</span>
          <span className="text-[10px] font-bold">Garansi</span>
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
    </div>
  );
}