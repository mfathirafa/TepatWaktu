import { useState, useEffect } from 'react';
import { 
  Bell, 
  Calendar, 
  Zap, 
  Wifi, 
  Droplets, 
  Home, 
  Tv, 
  ShieldCheck, 
  Receipt, 
  AlertCircle, 
  Plus, 
  X, 
  Search,
  CheckCircle2,
  Wallet
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBills } from '../hooks/useBills';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import AdBanner from '../components/AdBanner';

function getDaysLeft(dateStr: string) {
  if (!dateStr) return 999;
  const diff = new Date(dateStr).getTime() - new Date().setHours(0,0,0,0);
  return Math.ceil(diff / 86400000);
}

function formatDate(dateStr: string) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function formatDateIndonesian(dateStr: string) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  return `${date.getDate()} ${months[date.getMonth()]}`;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

function getCategoryDetails(name: string, category: string) {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('bpjs') || lowerName.includes('sehat') || lowerName.includes('kesehatan')) {
    return {
      icon: <ShieldCheck size={20} />,
      bg: 'bg-[#EDFDF5]',
      color: 'text-[#059669]',
      label: 'BPJS / Kesehatan'
    };
  }
  if (category === 'listrik' || lowerName.includes('pln') || lowerName.includes('listrik')) {
    return {
      icon: <Zap size={20} />,
      bg: 'bg-[#EEEDFC]',
      color: 'text-[#3525cd]',
      label: 'Listrik / PLN'
    };
  }
  if (category === 'internet' || lowerName.includes('indihome') || lowerName.includes('internet') || lowerName.includes('wifi')) {
    return {
      icon: <Wifi size={20} />,
      bg: 'bg-[#EEEDFC]',
      color: 'text-[#3525cd]',
      label: 'Internet / WiFi'
    };
  }
  if (category === 'air' || lowerName.includes('pdam') || lowerName.includes('air')) {
    return {
      icon: <Droplets size={20} />,
      bg: 'bg-[#E0F2FE]',
      color: 'text-[#0284C7]',
      label: 'Air / PDAM'
    };
  }
  if (category === 'cicilan' || lowerName.includes('cicilan') || lowerName.includes('kredit') || lowerName.includes('rumah')) {
    return {
      icon: <Home size={20} />,
      bg: 'bg-[#EEEDFC]',
      color: 'text-[#3525cd]',
      label: 'Cicilan / Kredit'
    };
  }
  if (category === 'hiburan' || lowerName.includes('netflix') || lowerName.includes('spotify') || lowerName.includes('youtube')) {
    return {
      icon: <Tv size={20} />,
      bg: 'bg-[#FCE7F3]',
      color: 'text-[#DB2777]',
      label: 'Langganan / Hiburan'
    };
  }
  return {
    icon: <Receipt size={20} />,
    bg: 'bg-gray-100',
    color: 'text-gray-500',
    label: 'Tagihan Lain'
  };
}

export default function ManageBills() {
  const { profile, user } = useAuth();
  const { bills, loading, addBill, updateBill, markPaid, deleteBill } = useBills();
  const { unreadCount } = useNotifications();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'unpaid' | 'paid'>('all');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<any | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formDueDate, setFormDueDate] = useState('');
  const [formCategory, setFormCategory] = useState<'listrik' | 'internet' | 'air' | 'cicilan' | 'hiburan' | 'lainnya'>('lainnya');
  const [formStatus, setFormStatus] = useState<'unpaid' | 'paid'>('unpaid');
  const [formNotes, setFormNotes] = useState('');

  useEffect(() => {
    const handleOpenModal = () => openAddModal();
    window.addEventListener('open-add-bill-modal', handleOpenModal);
    return () => window.removeEventListener('open-add-bill-modal', handleOpenModal);
  }, []);

  const openAddModal = () => {
    setSelectedBill(null);
    setFormName('');
    setFormAmount('');
    setFormDueDate('');
    setFormCategory('lainnya');
    setFormStatus('unpaid');
    setFormNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (bill: any) => {
    setSelectedBill(bill);
    setFormName(bill.name);
    setFormAmount(bill.amount ? String(bill.amount) : '');
    setFormDueDate(bill.due_date ? bill.due_date.split('T')[0] : '');
    setFormCategory(bill.category || 'lainnya');
    setFormStatus(bill.status || 'unpaid');
    setFormNotes(bill.notes || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formDueDate) return;

    const payload = {
      name: formName,
      amount: formAmount ? Number(formAmount) : null,
      due_date: new Date(formDueDate).toISOString(),
      due_day: new Date(formDueDate).getDate(),
      category: formCategory,
      status: formStatus,
      notes: formNotes || null
    };

    try {
      if (selectedBill) {
        await updateBill(selectedBill.id, payload);
      } else {
        await addBill(payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving bill:', err);
    }
  };

  const handleDelete = async () => {
    if (!selectedBill) return;
    if (confirm(`Apakah Anda yakin ingin menghapus tagihan "${selectedBill.name}"?`)) {
      try {
        await deleteBill(selectedBill.id);
        setIsModalOpen(false);
      } catch (err) {
        console.error('Error deleting bill:', err);
      }
    }
  };

  const handleMarkPaid = async (e: React.MouseEvent, bill: any) => {
    e.stopPropagation(); // prevent opening edit modal
    try {
      await markPaid(bill);
    } catch (err) {
      console.error('Error marking bill paid:', err);
    }
  };

  // Filter bills
  const filteredBills = bills.filter(bill => {
    const matchesSearch = 
      bill.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      bill.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === 'unpaid') {
      return matchesSearch && bill.status === 'unpaid';
    }
    if (activeFilter === 'paid') {
      return matchesSearch && bill.status === 'paid';
    }
    return matchesSearch;
  });

  // Calculate monthly stats
  const totalBulanIni = bills.reduce((sum, b) => sum + (b.amount ?? 0), 0);
  const totalTerbayar = bills.filter(b => b.status === 'paid').reduce((sum, b) => sum + (b.amount ?? 0), 0);
  const totalSisa = bills.filter(b => b.status === 'unpaid').reduce((sum, b) => sum + (b.amount ?? 0), 0);
  const percentPaid = totalBulanIni > 0 ? (totalTerbayar / totalBulanIni) * 100 : 0;

  // Urgent Unpaid Bills Count
  const urgentCount = bills.filter(b => b.status === 'unpaid' && getDaysLeft(b.due_date) <= 3).length;

  const dateObj = new Date();
  const monthsIndonesian = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const currentMonthName = monthsIndonesian[dateObj.getMonth()];
  const currentMonthUpper = currentMonthName.toUpperCase();
  const currentYear = dateObj.getFullYear();

  return (
    <div className="min-h-full bg-[#F8F9FC] pb-24 relative flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 pt-6 pb-4 flex justify-between items-center shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <img 
            src={profile?.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.email || 'default'}`} 
            alt="Profil" 
            className="w-10 h-10 rounded-full object-cover border border-gray-100 bg-[#E8E7FD]" 
          />
          <span className="text-[#3525cd] font-extrabold text-lg tracking-wider">TEPATWAKTU</span>
        </div>
        <Link to="/notifikasi" className="relative p-2 hover:bg-gray-50 rounded-full transition-colors">
          <Bell size={22} className="text-[#3525cd]" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
          )}
        </Link>
      </div>

      {/* Main Container */}
      <div className="px-5 pt-5 space-y-4 overflow-y-auto no-scrollbar flex-1 pb-4">
        {/* Total Tagihan Card */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-extrabold text-gray-400 tracking-wider">
              TOTAL TAGIHAN {currentMonthUpper}
            </span>
            <span className="flex items-center gap-1 text-[#3525cd] bg-[#EEEDFC] font-bold text-[10px] px-2.5 py-1 rounded-lg">
              <Calendar size={12} /> {currentMonthName.slice(0, 3)} {currentYear}
            </span>
          </div>

          <h2 className="text-2xl font-extrabold text-gray-900 leading-none">
            {formatCurrency(totalBulanIni)}
          </h2>

          {/* Dual Progress Bar */}
          <div className="w-full h-2.5 bg-[#E11D48] rounded-full overflow-hidden flex">
            <div 
              className="bg-[#059669] h-full transition-all duration-500" 
              style={{ width: `${percentPaid}%` }} 
            />
          </div>

          <div className="flex justify-between items-center text-xs font-semibold text-gray-500 pt-0.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
              <span>Terbayar: {formatCurrency(totalTerbayar)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48]" />
              <span>Sisa: {formatCurrency(totalSisa)}</span>
            </div>
          </div>
        </div>

        {/* Warning Alert Banner */}
        {urgentCount > 0 && (
          <div className="bg-[#FDF2F2] border border-red-100/50 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
            <div className="w-10 h-10 bg-[#FDF2F2] rounded-xl flex items-center justify-center shrink-0 border border-red-200/50">
              <AlertCircle size={22} className="text-[#E11D48]" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#E11D48]">
                {urgentCount} Tagihan Mendesak
              </p>
              <p className="text-[11px] text-[#E11D48]/80 font-medium">
                Segera lunasi sebelum denda bertambah.
              </p>
            </div>
          </div>
        )}

        {/* Section Header with Filters */}
        <div className="flex flex-col gap-3.5 pt-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-gray-800">Daftar Tagihan</h3>
            <div className="flex items-center gap-2">
              <div className="flex bg-[#EEEDFC]/60 p-0.5 rounded-xl text-[10px]">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-2.5 py-1.5 font-bold rounded-lg transition-all ${
                    activeFilter === 'all' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setActiveFilter('unpaid')}
                  className={`px-2.5 py-1.5 font-bold rounded-lg transition-all ${
                    activeFilter === 'unpaid' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  Belum Bayar
                </button>
                <button
                  onClick={() => setActiveFilter('paid')}
                  className={`px-2.5 py-1.5 font-bold rounded-lg transition-all ${
                    activeFilter === 'paid' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  Terbayar
                </button>
              </div>
            </div>
          </div>

          {/* Search input inside list */}
          <div className="flex items-center bg-[#EEEDFC]/40 border border-[#DCDAFF]/40 rounded-2xl px-4 py-2.5 gap-3 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 focus-within:bg-white transition-all">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Cari tagihan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-xs text-gray-800 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Bills Cards List */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-9 h-9 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : filteredBills.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-sm">
            <Wallet size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="font-bold text-gray-700 text-sm">Tidak ada tagihan ditemukan</p>
            <p className="text-gray-400 text-xs mt-1">Gunakan tombol plus untuk menambahkan tagihan baru.</p>
          </div>
        ) : (
          <div className="space-y-3 pb-6">
            {filteredBills.flatMap((bill, idx) => {
              const daysLeft = getDaysLeft(bill.due_date);
              const category = getCategoryDetails(bill.name, bill.category);
              const isPaid = bill.status === 'paid';
              const isOverdue = !isPaid && daysLeft < 0;
              const isUrgent = !isPaid && daysLeft <= 3;

              // Action button text mapping based on name / category
              const lowerName = bill.name.toLowerCase();
              const isPayStyle = lowerName.includes('pln') || lowerName.includes('listrik') || lowerName.includes('cicilan') || lowerName.includes('rumah') || lowerName.includes('kredit');

              const card = (
                <div 
                  key={bill.id} 
                  onClick={() => openEditModal(bill)}
                  className={`bg-white rounded-3xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 transition-all flex items-center justify-between cursor-pointer relative ${
                    isPaid ? 'opacity-70 bg-gray-50/50' : ''
                  } ${
                    isUrgent ? 'border-l-4 border-l-[#E11D48]' : 'border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    {/* Category Icon */}
                    <div className={`w-11 h-11 ${category.bg} ${category.color} rounded-2xl flex items-center justify-center shrink-0`}>
                      {category.icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-extrabold text-gray-900 truncate leading-tight">
                        {bill.name}
                      </h4>
                      <p className="text-sm font-extrabold text-indigo-700 mt-1">
                        {formatCurrency(bill.amount ?? 0)}
                      </p>
                      
                      {/* Subtitle / Status info */}
                      <div className="flex items-center gap-1 mt-1 text-[10px] font-semibold">
                        {isPaid ? (
                          <span className="text-[#059669] flex items-center gap-0.5">
                            <CheckCircle2 size={10} /> Lunas {formatDateIndonesian(bill.updated_at || bill.due_date)}
                          </span>
                        ) : isOverdue ? (
                          <span className="text-[#E11D48] flex items-center gap-0.5">
                            ! Terlambat {Math.abs(daysLeft)} Hari
                          </span>
                        ) : isUrgent && daysLeft === 1 ? (
                          <span className="text-[#E11D48] flex items-center gap-0.5">
                            Jatuh Tempo: Besok
                          </span>
                        ) : isUrgent && daysLeft === 0 ? (
                          <span className="text-[#E11D48] flex items-center gap-0.5">
                            Jatuh Tempo: Hari Ini
                          </span>
                        ) : (
                          <span className="text-gray-400">
                            {formatDate(bill.due_date)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Button/Badge */}
                  <div className="shrink-0 ml-3">
                    {isPaid ? (
                      <span className="inline-block text-[10px] font-extrabold px-3 py-1.5 rounded-xl bg-[#EDFDF5] text-[#059669]">
                        Lunas
                      </span>
                    ) : isPayStyle ? (
                      <button
                        onClick={(e) => handleMarkPaid(e, bill)}
                        className="bg-indigo-600 hover:bg-[#2e1ebd] text-white text-[10px] font-extrabold px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
                      >
                        Bayar
                      </button>
                    ) : (
                      <button
                        onClick={(e) => handleMarkPaid(e, bill)}
                        className="bg-white border border-[#3525cd] text-[#3525cd] hover:bg-[#EEEDFC]/40 text-[10px] font-extrabold px-3 py-2 rounded-xl transition-all cursor-pointer"
                      >
                        Tandai Lunas
                      </button>
                    )}
                  </div>
                </div>
              );

              if (idx === 1) {
                return [
                  card,
                  <AdBanner key="bills-list-ad" type="inline" className="mt-1 mb-1" />
                ];
              }
              return [card];
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-end sm:items-center sm:justify-center p-0 sm:p-4 animate-fade-in">
          {/* Backdrop Closer */}
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />

          {/* Modal Container */}
          <div className="w-full bg-white rounded-t-[30px] sm:rounded-3xl sm:max-w-md p-6 relative z-10 shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col max-h-[85vh] sm:max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-5 shrink-0">
              <h3 className="font-extrabold text-gray-900 text-base">
                {selectedBill ? 'Edit Tagihan Rutin' : 'Tambah Tagihan Rutin'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSave} className="space-y-4 overflow-y-auto pr-1 no-scrollbar flex-1 pb-4">
              {/* Nama Tagihan */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Nama Tagihan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PLN - Listrik Rumah"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all text-gray-800"
                />
              </div>

              {/* Nominal */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Nominal Tagihan
                </label>
                <input
                  type="number"
                  required
                  placeholder="Contoh: 1250000"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all text-gray-800"
                />
              </div>

              {/* Kategori */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Kategori
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all text-gray-800"
                >
                  <option value="listrik">Listrik (PLN)</option>
                  <option value="internet">Internet / WiFi</option>
                  <option value="air">Air (PDAM)</option>
                  <option value="cicilan">Cicilan / Rumah / Kredit</option>
                  <option value="hiburan">Langganan Hiburan (Netflix/Spotify)</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>

              {/* Tanggal Jatuh Tempo */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Tanggal Jatuh Tempo
                </label>
                <input
                  type="date"
                  required
                  value={formDueDate}
                  onChange={(e) => setFormDueDate(e.target.value)}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all text-gray-800"
                />
              </div>

              {/* Status */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Status Pembayaran
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all text-gray-800"
                >
                  <option value="unpaid">Belum Dibayar</option>
                  <option value="paid">Sudah Dibayar</option>
                </select>
              </div>

              {/* Catatan (Opsional) */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Catatan Tambahan
                </label>
                <textarea
                  placeholder="Masukkan keterangan tambahan jika ada..."
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all text-gray-800 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3 shrink-0">
                {selectedBill && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex-1 border border-red-200 text-red-600 hover:bg-red-50 font-bold py-3 rounded-2xl text-sm transition-all"
                  >
                    Hapus
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-[2] bg-indigo-600 hover:bg-[#2e1ebd] text-white font-bold py-3 rounded-2xl text-sm transition-all shadow-md shadow-indigo-600/20"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
