import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { formatDate, calculateDaysLeft, getWarrantyStatus } from '../lib/utils';

// Interfaces
interface Warranty {
  id: string;
  expiry_date: string;
  duration_months: number;
  status: string;
}

interface Receipt {
  id: string;
  file_url: string;
  file_type: string;
}

interface Asset {
  id: string;
  name: string;
  brand: string;
  category: string;
  purchase_date: string;
  price: number;
  notes: string;
  warranties: Warranty[];
  receipts: Receipt[];
}

// Helper untuk Progress Bar
const getProgressPercentage = (purchaseStr: string, expiryStr: string) => {
  if (!purchaseStr || !expiryStr) return 0;
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

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [asset, setAsset] = useState<Asset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Edit Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [editForm, setEditForm] = useState({
    name: '',
    brand: '',
    category: '',
    purchase_date: '',
    price: '',
    notes: '',
    duration_months: ''
  });

  useEffect(() => {
    async function fetchAsset() {
      if (!user || !id) return;
      
      try {
        setIsLoading(true);
        setError('');

        const { data, error: fetchError } = await supabase
          .from('assets')
          .select(`
            *,
            warranties (*),
            receipts (*)
          `)
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (fetchError) {
          throw new Error('Aset tidak ditemukan atau Anda tidak memiliki akses.');
        }

        const fetchedAsset = data as unknown as Asset;
        setAsset(fetchedAsset);

        // Siapkan form edit dengan data yang ada
        setEditForm({
          name: fetchedAsset.name || '',
          brand: fetchedAsset.brand || '',
          category: fetchedAsset.category || 'Elektronik',
          purchase_date: fetchedAsset.purchase_date || '',
          price: fetchedAsset.price ? fetchedAsset.price.toString() : '0',
          notes: fetchedAsset.notes || '',
          duration_months: fetchedAsset.warranties?.[0]?.duration_months?.toString() || '12'
        });

      } catch (err: any) {
        console.error('Error fetching asset:', err);
        setError(err.message || 'Gagal memuat data aset.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchAsset();
  }, [id, user]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleDelete = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus aset ini beserta struk dan garansinya? Tindakan ini tidak dapat dibatalkan.')) {
      return;
    }

    try {
      setIsDeleting(true);
      const { error: deleteError } = await supabase
        .from('assets')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      
      navigate('/dashboard');
    } catch (err) {
      console.error('Error deleting:', err);
      alert('Gagal menghapus aset. Silakan coba lagi.');
      setIsDeleting(false);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    if (!rawValue) {
      setEditForm({ ...editForm, price: '' });
      return;
    }
    const formatted = new Intl.NumberFormat('id-ID').format(parseInt(rawValue));
    setEditForm({ ...editForm, price: formatted });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!asset) return;

    try {
      setIsSaving(true);
      const rawPrice = parseInt(editForm.price.replace(/\D/g, '')) || 0;

      // Update Asset
      const { error: assetError } = await supabase
        .from('assets')
        .update({
          name: editForm.name,
          brand: editForm.brand,
          category: editForm.category,
          purchase_date: editForm.purchase_date,
          price: rawPrice,
          notes: editForm.notes
        })
        .eq('id', asset.id);

      if (assetError) throw assetError;

      // Update Warranty
      if (asset.warranties && asset.warranties.length > 0) {
        // Kalkulasi ulang expiry_date
        const newExpiryDate = new Date(editForm.purchase_date);
        newExpiryDate.setMonth(newExpiryDate.getMonth() + parseInt(editForm.duration_months || '0'));

        const { error: warrantyError } = await supabase
          .from('warranties')
          .update({
            expiry_date: newExpiryDate.toISOString().split('T')[0],
            duration_months: parseInt(editForm.duration_months),
            // Update status trigger akan jalan jika ada, atau kita asumsikan active dan dihandle di select nanti
          })
          .eq('id', asset.warranties[0].id);

        if (warrantyError) throw warrantyError;
      }

      // Refresh Data secara manual
      setAsset({
        ...asset,
        name: editForm.name,
        brand: editForm.brand,
        category: editForm.category,
        purchase_date: editForm.purchase_date,
        price: rawPrice,
        notes: editForm.notes,
        warranties: asset.warranties.length > 0 ? [{
          ...asset.warranties[0],
          duration_months: parseInt(editForm.duration_months),
          expiry_date: (() => {
            const d = new Date(editForm.purchase_date);
            d.setMonth(d.getMonth() + parseInt(editForm.duration_months));
            return d.toISOString().split('T')[0];
          })()
        }] : []
      });

      setIsEditModalOpen(false);
      alert('Aset berhasil diperbarui!');
    } catch (err) {
      console.error('Error updating asset:', err);
      alert('Gagal memperbarui aset. Silakan periksa koneksi Anda.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <p className="text-slate-500 font-medium">Memuat data aset...</p>
        </div>
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-4xl mb-6">
          ⚠️
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Aset Tidak Ditemukan</h2>
        <p className="text-slate-500 text-center max-w-md mb-8">{error}</p>
        <Link to="/warranties" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow-sm transition-colors">
          Kembali ke Daftar Garansi
        </Link>
      </div>
    );
  }

  const warranty = asset.warranties?.[0];
  const receipt = asset.receipts?.[0];
  const wStatus = warranty ? getWarrantyStatus(warranty.expiry_date) : 'expired';
  const daysLeft = warranty ? calculateDaysLeft(warranty.expiry_date) : 0;
  const progress = warranty ? getProgressPercentage(asset.purchase_date, warranty.expiry_date) : 100;

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
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <button onClick={() => navigate(-1)} className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold flex items-center gap-1 mb-4">
              &larr; Kembali
            </button>
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              {asset.name}
              {wStatus === 'active' && <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full align-middle">Garansi Aktif</span>}
              {wStatus === 'expiring' && <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full align-middle">Segera Expired</span>}
              {wStatus === 'expired' && <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full align-middle">Garansi Habis</span>}
            </h1>
            <p className="text-slate-500 mt-2 text-lg">{asset.brand || 'Tanpa Brand'} • {asset.category}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm"
            >
              ✏️ Edit Aset
            </button>
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-5 py-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-bold hover:bg-rose-100 transition-colors shadow-sm disabled:opacity-50"
            >
              🗑️ Hapus
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Kolom Kiri: Garansi & Aset Info */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Info Garansi Card */}
            {warranty ? (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20 pointer-events-none"></div>
                
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Status Perlindungan Garansi</h3>
                
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 relative z-10">
                  <div>
                    <div className="text-5xl font-extrabold text-slate-900 mb-2">
                      {daysLeft > 0 ? `Sisa ${daysLeft}` : daysLeft === 0 ? 'Expired' : 'Expired'}
                      {daysLeft > 0 && <span className="text-2xl text-slate-500 font-medium ml-2">hari</span>}
                    </div>
                    {daysLeft < 0 && <p className="text-rose-600 font-semibold">{Math.abs(daysLeft)} hari yang lalu</p>}
                    {daysLeft === 0 && <p className="text-rose-600 font-semibold">Hari Ini!</p>}
                  </div>
                  
                  <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Durasi Total</p>
                    <p className="text-xl font-bold text-slate-800">{warranty.duration_months} Bulan</p>
                  </div>
                </div>

                <div className="mb-8 relative z-10">
                  <div className="flex justify-between items-end mb-2 text-sm font-bold text-slate-600">
                    <span>{formatDate(asset.purchase_date)}</span>
                    <span>{formatDate(warranty.expiry_date)}</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        wStatus === 'expired' ? 'bg-rose-500' : wStatus === 'expiring' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 relative z-10">
                  <Link 
                    to={`/resale/${asset.id}`}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span>🤝</span> Buat Sertifikat Jual Kembali
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-slate-100 p-8 rounded-3xl border border-slate-200 text-center">
                <p className="text-slate-500 font-medium">Tidak ada data garansi untuk aset ini.</p>
              </div>
            )}

            {/* Detail Spesifik Aset */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Detail Pembelian</h3>
              
              <div className="grid sm:grid-cols-2 gap-y-6 gap-x-8">
                <div>
                  <p className="text-sm font-bold text-slate-400 mb-1 uppercase tracking-wider">Harga Beli</p>
                  <p className="text-xl font-bold text-slate-800">
                    Rp {new Intl.NumberFormat('id-ID').format(asset.price)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-400 mb-1 uppercase tracking-wider">Kategori</p>
                  <p className="text-lg font-medium text-slate-700">{asset.category}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-400 mb-1 uppercase tracking-wider">Tanggal Pembelian</p>
                  <p className="text-lg font-medium text-slate-700">{formatDate(asset.purchase_date)}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-400 mb-1 uppercase tracking-wider">Merek / Brand</p>
                  <p className="text-lg font-medium text-slate-700">{asset.brand || '-'}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm font-bold text-slate-400 mb-1 uppercase tracking-wider">Catatan Tambahan</p>
                  <p className="text-base text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 whitespace-pre-line">
                    {asset.notes || 'Tidak ada catatan.'}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Kolom Kanan: Preview Struk */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Salinan Struk</h3>
                {receipt && (
                  <a 
                    href={receipt.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 text-sm font-bold flex items-center gap-1"
                  >
                    Buka Penuh ↗
                  </a>
                )}
              </div>

              {receipt ? (
                <div className="bg-white rounded-2xl overflow-hidden relative">
                  {receipt.file_type?.startsWith('image/') ? (
                    <img 
                      src={receipt.file_url} 
                      alt="Struk Pembelian" 
                      className="w-full h-auto object-contain max-h-[500px]"
                    />
                  ) : receipt.file_type === 'application/pdf' ? (
                    <div className="p-12 flex flex-col items-center justify-center bg-slate-100 text-center">
                      <span className="text-6xl mb-4">📄</span>
                      <p className="font-bold text-slate-800 mb-2">Dokumen PDF</p>
                      <a 
                        href={receipt.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full text-sm font-bold shadow-sm"
                      >
                        Unduh File
                      </a>
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-slate-100">
                      <p className="text-slate-500">Format file tidak dapat dipratinjau.</p>
                      <a href={receipt.file_url} className="text-indigo-600 font-bold mt-2 inline-block">Unduh File</a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-slate-800/50 border border-slate-700 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center">
                  <span className="text-4xl mb-4 opacity-50">🧾</span>
                  <p className="text-slate-400 font-medium">Tidak ada file struk tersimpan.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modal Edit Aset */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900">Edit Data Aset</h2>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 font-bold"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <form id="editForm" onSubmit={handleSaveEdit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Nama Aset</label>
                  <input type="text" required value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors outline-none text-slate-700" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Brand / Merek</label>
                    <input type="text" value={editForm.brand} onChange={(e) => setEditForm({...editForm, brand: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors outline-none text-slate-700" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Kategori</label>
                    <select value={editForm.category} onChange={(e) => setEditForm({...editForm, category: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors outline-none text-slate-700">
                      <option value="Elektronik">Elektronik</option>
                      <option value="Furnitur">Furnitur</option>
                      <option value="Kendaraan">Kendaraan</option>
                      <option value="Pakaian">Pakaian</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Tanggal Pembelian</label>
                    <input type="date" required value={editForm.purchase_date} onChange={(e) => setEditForm({...editForm, purchase_date: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors outline-none text-slate-700" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Durasi Garansi (Bulan)</label>
                    <input type="number" min="1" required value={editForm.duration_months} onChange={(e) => setEditForm({...editForm, duration_months: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors outline-none text-slate-700" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Harga Pembelian (Rp)</label>
                  <input type="text" value={editForm.price} onChange={handlePriceChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors outline-none text-slate-700" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Catatan Tambahan</label>
                  <textarea rows={3} value={editForm.notes} onChange={(e) => setEditForm({...editForm, notes: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors outline-none text-slate-700 resize-none" />
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button 
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button 
                form="editForm"
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 px-6 py-3 flex justify-between items-center">
        <Link to="/dashboard" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
          <span className="text-xl">📊</span>
          <span className="text-[10px] font-semibold">Beranda</span>
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
    </div>
  );
}