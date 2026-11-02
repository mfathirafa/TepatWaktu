// src/pages/ManageWarranty.tsx
import { useState, useMemo } from 'react';
import { 
  Bell, 
  Shield, 
  ShieldAlert, 
  Package, 
  Plus, 
  Search, 
  X, 
  MessageSquare, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  Camera, 
  Smartphone,
  Tv,
  Car,
  Home
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWarranties } from '../hooks/useWarranties';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useNotifications } from '../hooks/useNotifications';
import AdBanner from '../components/AdBanner';
import { triggerAdAfterAction } from '../components/AdModal';
import { openWhatsAppReminder } from '../lib/whatsappReminder';

function getDaysLeft(dateStr: string | null | undefined): number {
  if (!dateStr) return 999;
  const diff = new Date(dateStr).getTime() - new Date().setHours(0, 0, 0, 0);
  return Math.ceil(diff / 86400000);
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function formatCurrency(amount: number | null | undefined): string {
  if (!amount) return '-';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

function getCategoryIcon(cat: string | null | undefined) {
  const c = (cat || '').toLowerCase();
  if (c.includes('smartphone') || c.includes('gadget') || c.includes('hp') || c.includes('laptop')) {
    return <Smartphone size={18} />;
  }
  if (c.includes('elektronik') || c.includes('tv') || c.includes('audio')) {
    return <Tv size={18} />;
  }
  if (c.includes('otomotif') || c.includes('kendaraan') || c.includes('mobil') || c.includes('motor')) {
    return <Car size={18} />;
  }
  if (c.includes('rumah') || c.includes('furnitur') || c.includes('ac')) {
    return <Home size={18} />;
  }
  return <Package size={18} />;
}

export default function ManageWarranty() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { assets, loading, addAsset, deleteAsset } = useWarranties();
  const { unreadCount } = useNotifications();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'safe' | 'warning' | 'expired'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ocrScanning, setOcrScanning] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formCategory, setFormCategory] = useState('Elektronik');
  const [formPurchaseDate, setFormPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [formDurationMonths, setFormDurationMonths] = useState('12');
  const [formPrice, setFormPrice] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Calculate Expiry Date Live
  const calculatedExpiryDate = useMemo(() => {
    if (!formPurchaseDate || !formDurationMonths) return '';
    const date = new Date(formPurchaseDate);
    date.setMonth(date.getMonth() + parseInt(formDurationMonths || '0'));
    return date.toISOString().split('T')[0];
  }, [formPurchaseDate, formDurationMonths]);

  // Statistics
  const stats = useMemo(() => {
    let warning = 0;
    let safe = 0;
    let expired = 0;

    assets.forEach(a => {
      const expiry = a.warranties?.[0]?.expiry_date;
      const days = getDaysLeft(expiry);
      if (days < 0) expired++;
      else if (days <= 30) warning++;
      else safe++;
    });

    return { total: assets.length, warning, safe, expired };
  }, [assets]);

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    return assets.filter(a => {
      const nameMatch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (a.brand || '').toLowerCase().includes(searchQuery.toLowerCase());
      if (!nameMatch) return false;

      if (categoryFilter !== 'all' && (a.category || '').toLowerCase() !== categoryFilter.toLowerCase()) {
        return false;
      }

      const expiry = a.warranties?.[0]?.expiry_date;
      const days = getDaysLeft(expiry);

      if (activeFilter === 'safe') return days > 30;
      if (activeFilter === 'warning') return days >= 0 && days <= 30;
      if (activeFilter === 'expired') return days < 0;

      return true;
    });
  }, [assets, searchQuery, activeFilter, categoryFilter]);

  // Simulate OCR scan from receipt photo
  const handleSimulateOCR = () => {
    setOcrScanning(true);
    setTimeout(() => {
      setFormName('Sony Wireless Headphones WH-1000XM5');
      setFormBrand('Sony');
      setFormCategory('Elektronik');
      setFormPrice('4999000');
      setFormDurationMonths('12');
      setFormNotes('Nomor Seri Struk: SN-8842-ID • iBox / Electronic City');
      setOcrScanning(false);
    }, 1200);
  };

  const handleOpenModal = () => {
    // Check Free tier limit (5 items max)
    if (profile?.subscription_tier !== 'premium' && assets.length >= 5) {
      if (confirm('Batas Free Tier Tercapai (Maksimal 5 aset).\n\nUpgrade ke Premium seharga Rp9.000/bln untuk mencatat aset tanpa batas & pengingat WhatsApp otomatis.\n\nBuka halaman Upgrade sekarang?')) {
        window.location.href = '/upgrade';
      }
      return;
    }

    setFormName('');
    setFormBrand('');
    setFormCategory('Elektronik');
    setFormPurchaseDate(new Date().toISOString().split('T')[0]);
    setFormDurationMonths('12');
    setFormPrice('');
    setFormNotes('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !calculatedExpiryDate) return;

    setSubmitting(true);
    try {
      const rawPrice = formPrice ? parseInt(formPrice.replace(/\D/g, '')) : null;
      const duration = parseInt(formDurationMonths || '12');

      await addAsset(
        {
          name: formName.trim(),
          brand: formBrand.trim() || null,
          category: formCategory,
          purchase_date: formPurchaseDate,
          price: rawPrice,
          notes: formNotes.trim() || null,
        },
        {
          expiry_date: calculatedExpiryDate,
          duration_months: duration,
          status: 'active',
        }
      );

      setIsModalOpen(false);

      // Trigger Interstitial Ad Modal for Free Tier Users
      triggerAdAfterAction(`Aset ${formName.trim()} berhasil ditambahkan!`);
    } catch (err: any) {
      alert('Gagal menambahkan aset: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus aset "${name}" dari pemantauan garansi?`)) return;
    try {
      await deleteAsset(id);
    } catch (err: any) {
      alert('Gagal menghapus aset: ' + err.message);
    }
  };

  const handleSendWhatsApp = (asset: any) => {
    const expiry = asset.warranties?.[0]?.expiry_date;
    const days = getDaysLeft(expiry);

    openWhatsAppReminder({
      phone: profile?.whatsapp,
      userName: profile?.name || user?.user_metadata?.full_name || 'Pelanggan TepatWaktu',
      itemTitle: `${asset.name} (${asset.brand || 'Original'})`,
      category: 'garansi',
      dueDate: formatDate(expiry),
      daysLeft: days,
      amount: asset.price,
      notes: asset.notes
    });
  };

  return (
    <div className="min-h-full bg-[#F8F9FC] pb-24 relative flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 pt-6 pb-4 flex justify-between items-center shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link to="/" className="w-10 h-10 rounded-full border border-gray-100 bg-[#E8E7FD] flex items-center justify-center text-[#3525cd] font-black text-sm">
            TW
          </Link>
          <div>
            <span className="text-[#3525cd] font-extrabold text-base tracking-wider block leading-none">
              MANAJEMEN GARANSI
            </span>
            <span className="text-[10px] text-gray-400 font-bold">Pantau masa berlaku aset Anda</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/notifikasi" className="relative p-2 hover:bg-gray-50 rounded-full transition-colors">
            <Bell size={20} className="text-[#3525cd]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            )}
          </Link>

          <button
            onClick={handleOpenModal}
            className="bg-[#3525cd] hover:bg-[#2b1ea8] active:scale-95 text-white font-extrabold text-xs px-3.5 py-2 rounded-2xl flex items-center gap-1.5 shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Tambah</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-3 gap-2.5 px-5 pt-5 pb-2">
        {/* Total Aset */}
        <div 
          onClick={() => { setActiveFilter('all'); setCategoryFilter('all'); }}
          className={`rounded-2xl p-3 border transition-all cursor-pointer ${
            activeFilter === 'all' 
              ? 'bg-[#EEEDFC] border-[#3525cd]/30 shadow-sm' 
              : 'bg-white border-gray-100'
          }`}
        >
          <div className="w-7 h-7 rounded-xl bg-indigo-100 text-[#3525cd] flex items-center justify-center mb-1.5">
            <Package size={15} />
          </div>
          <p className="text-[10px] text-gray-400 font-bold">Total Aset</p>
          <p className="text-xl font-extrabold text-gray-900 mt-0.5">{stats.total}</p>
        </div>

        {/* Segera Berakhir */}
        <div 
          onClick={() => setActiveFilter(activeFilter === 'warning' ? 'all' : 'warning')}
          className={`rounded-2xl p-3 border transition-all cursor-pointer ${
            activeFilter === 'warning' 
              ? 'bg-amber-100/60 border-amber-400/40 shadow-sm' 
              : 'bg-amber-50/60 border-amber-100/80'
          }`}
        >
          <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-1.5">
            <ShieldAlert size={15} />
          </div>
          <p className="text-[10px] text-amber-700 font-bold">Mendesak</p>
          <p className="text-xl font-extrabold text-amber-950 mt-0.5">{stats.warning}</p>
        </div>

        {/* Aman */}
        <div 
          onClick={() => setActiveFilter(activeFilter === 'safe' ? 'all' : 'safe')}
          className={`rounded-2xl p-3 border transition-all cursor-pointer ${
            activeFilter === 'safe' 
              ? 'bg-emerald-100/60 border-emerald-400/40 shadow-sm' 
              : 'bg-emerald-50/60 border-emerald-100/80'
          }`}
        >
          <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1.5">
            <Shield size={15} />
          </div>
          <p className="text-[10px] text-emerald-700 font-bold">Garansi Aman</p>
          <p className="text-xl font-extrabold text-emerald-950 mt-0.5">{stats.safe}</p>
        </div>
      </div>

      {/* Free Tier Limit Indicator */}
      {profile?.subscription_tier !== 'premium' && (
        <div className="mx-5 mt-2 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100/80 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span className="text-[11px] font-extrabold text-indigo-950">
              Free Tier: <strong className="text-indigo-600">{stats.total} / 5</strong> Aset
            </span>
          </div>
          <Link
            to="/upgrade"
            className="text-[10px] font-extrabold text-indigo-700 bg-white hover:bg-indigo-600 hover:text-white border border-indigo-200 px-2.5 py-1 rounded-xl transition-all shadow-xs shrink-0"
          >
            Upgrade Unlimited
          </Link>
        </div>
      )}

      {/* Search & Category Tabs */}
      <div className="px-5 pt-3 space-y-2.5">
        <div className="bg-white border border-gray-200/80 rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5 shadow-xs focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500">
          <Search size={16} className="text-gray-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari aset, merek, atau tipe..."
            className="bg-transparent border-none outline-none w-full text-xs font-bold text-gray-800 placeholder-gray-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'Elektronik', label: 'Elektronik' },
            { id: 'Smartphone', label: 'Gadget / HP' },
            { id: 'Laptop', label: 'Laptop' },
            { id: 'Kendaraan', label: 'Otomotif' },
            { id: 'Rumah Tangga', label: 'Rumah' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`text-[11px] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                categoryFilter.toLowerCase() === cat.id.toLowerCase()
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-gray-500 border border-gray-150 hover:bg-gray-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ad Placement */}
      <AdBanner type="inline" className="mx-5 mt-3" />

      {/* Asset List */}
      <div className="px-5 mt-3 space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-xs text-gray-400 font-semibold">Memuat aset Anda...</p>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-gray-150 shadow-xs space-y-3">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Package size={28} />
            </div>
            <div>
              <p className="font-extrabold text-gray-900 text-sm">Tidak ada aset ditemukan</p>
              <p className="text-gray-400 text-xs mt-1">
                {searchQuery ? 'Coba kata kunci pencarian lain' : 'Mulai catat barang berharga Anda untuk memantau garansinya.'}
              </p>
            </div>
            <button
              onClick={handleOpenModal}
              className="inline-flex items-center gap-1.5 bg-[#3525cd] hover:bg-[#2b1ea8] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all"
            >
              <Plus size={14} /> Tambah Aset Pertama
            </button>
          </div>
        ) : (
          filteredAssets.map(asset => {
            const warranty = asset.warranties?.[0];
            const expiry = warranty?.expiry_date;
            const duration = warranty?.duration_months || 12;
            const days = getDaysLeft(expiry);

            // Calculate percentage used
            const totalDays = duration * 30;
            const pctUsed = Math.min(100, Math.max(0, Math.round((1 - days / totalDays) * 100)));

            const isExpired = days < 0;
            const isWarning = days >= 0 && days <= 30;

            return (
              <div 
                key={asset.id} 
                className="bg-white rounded-3xl border border-gray-100 p-4.5 shadow-xs hover:border-gray-200 transition-all flex flex-col gap-3 group"
              >
                {/* Top Info */}
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                      isExpired 
                        ? 'bg-red-50 text-red-500' 
                        : isWarning 
                        ? 'bg-amber-50 text-amber-600' 
                        : 'bg-indigo-50 text-[#3525cd]'
                    }`}>
                      {getCategoryIcon(asset.category)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-extrabold text-gray-950 truncate leading-snug">
                        {asset.name}
                      </h4>
                      <p className="text-[11px] text-gray-400 font-semibold flex items-center gap-1.5 mt-0.5">
                        <span>{asset.brand || 'Original'}</span>
                        <span>•</span>
                        <span>{asset.category || 'Elektronik'}</span>
                        {asset.price ? (
                          <>
                            <span>•</span>
                            <span className="text-gray-600 font-bold">{formatCurrency(asset.price)}</span>
                          </>
                        ) : null}
                      </p>
                    </div>
                  </div>

                  {/* Badge Status */}
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 ${
                    isExpired
                      ? 'bg-red-100 text-red-700'
                      : isWarning
                      ? 'bg-amber-100 text-amber-800 animate-pulse'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {isExpired ? 'Kedaluwarsa' : isWarning ? `Sisa ${days} Hari` : 'Aktif'}
                  </span>
                </div>

                {/* Warranty Dates & Usage Bar */}
                <div className="bg-gray-50/80 rounded-2xl p-3 border border-gray-100/60 space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-gray-400">
                      Beli: <strong className="text-gray-700">{formatDate(asset.purchase_date)}</strong>
                    </span>
                    <span className="text-gray-400">
                      Garansi: <strong className={isExpired ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-emerald-700'}>
                        {formatDate(expiry)} ({duration} bln)
                      </strong>
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200/70 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isExpired ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${isExpired ? 100 : pctUsed}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[9px] text-gray-400 font-medium">
                    <span>Masa Garansi Berjalan</span>
                    <span>{isExpired ? '100% Selesai' : `${pctUsed}% Terpakai`}</span>
                  </div>
                </div>

                {/* Notes if any */}
                {asset.notes && (
                  <p className="text-[11px] text-gray-500 bg-amber-50/40 border border-amber-100/40 rounded-xl px-3 py-1.5 font-medium leading-relaxed">
                    📝 {asset.notes}
                  </p>
                )}

                {/* Actions: WhatsApp Reminder + Delete */}
                <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                  <button
                    onClick={() => handleSendWhatsApp(asset)}
                    className="flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                    title="Kirim Pengingat ke WhatsApp"
                  >
                    <MessageSquare size={13} className="stroke-[2.5]" />
                    <span>Kirim Pengingat WA</span>
                  </button>

                  <button
                    onClick={() => handleDelete(asset.id, asset.name)}
                    className="text-gray-300 hover:text-rose-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                    title="Hapus Aset"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Tambah Aset & Garansi Baru */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full sm:max-w-md rounded-t-[32px] sm:rounded-[32px] max-h-[88vh] overflow-y-auto no-scrollbar shadow-2xl border border-gray-100 flex flex-col p-6 pb-10 animate-in slide-in-from-bottom duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-black text-gray-900 leading-tight">Tambah Aset & Garansi</h3>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">Digitalkan struk dan pantau garansinya</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Quick OCR Scanner Simulator Banner */}
            <div className="mt-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Camera size={16} />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-indigo-950">Scan Struk Otomatis (OCR)</p>
                  <p className="text-[10px] text-indigo-600/80 font-medium">Isi otomatis nama, harga & garansi</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSimulateOCR}
                disabled={ocrScanning}
                className="bg-white hover:bg-indigo-600 hover:text-white text-indigo-700 text-[10px] font-extrabold px-3 py-1.5 rounded-xl border border-indigo-200 transition-all shadow-xs flex items-center gap-1 cursor-pointer shrink-0"
              >
                {ocrScanning ? (
                  <span className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles size={11} />
                    <span>Coba Scan</span>
                  </>
                )}
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5 mt-4">
              {/* Nama Aset */}
              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">
                  Nama Aset / Barang <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: MacBook Pro 14 M3 / iPhone 15"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Merek & Kategori */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Merek / Brand</label>
                  <input
                    type="text"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    placeholder="Contoh: Apple / Sony"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Kategori</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="Elektronik">Elektronik</option>
                    <option value="Smartphone">Smartphone / Gadget</option>
                    <option value="Laptop">Komputer / Laptop</option>
                    <option value="Kendaraan">Kendaraan / Otomotif</option>
                    <option value="Rumah Tangga">Rumah Tangga</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              {/* Tanggal Beli & Durasi Garansi */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">
                    Tanggal Beli <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formPurchaseDate}
                    onChange={(e) => setFormPurchaseDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">
                    Masa Garansi <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="1"
                      required
                      value={formDurationMonths}
                      onChange={(e) => setFormDurationMonths(e.target.value)}
                      className="w-20 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                    <span className="text-xs font-bold text-gray-500">Bulan</span>
                  </div>
                </div>
              </div>

              {/* Calculated Expiry Preview */}
              {calculatedExpiryDate && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-2.5 flex items-center gap-2 text-emerald-800 text-xs font-bold">
                  <Shield size={14} className="text-emerald-600 shrink-0" />
                  <span>Garansi berakhir pada: {formatDate(calculatedExpiryDate)}</span>
                </div>
              )}

              {/* Harga Beli */}
              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Harga Pembelian (Rp)</label>
                <input
                  type="number"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  placeholder="Contoh: 15000000"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Catatan / Nomor Seri */}
              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Nomor Seri / Catatan</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Misal: Nomor IMEI / Serial Number / Toko pembelian"
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#3525cd] hover:bg-[#2b1ea8] active:scale-95 text-white font-extrabold py-3.5 rounded-2xl shadow-lg shadow-indigo-600/25 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {submitting ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Simpan Aset & Garansi</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
