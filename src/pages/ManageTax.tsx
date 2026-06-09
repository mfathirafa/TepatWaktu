import { useState, useEffect } from 'react';
import { 
  Bell, 
  ChevronDown, 
  FileText, 
  Calendar, 
  Car, 
  Search, 
  Plus, 
  X, 
  CreditCard, 
  Globe, 
  Home
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLegalDocs } from '../hooks/useLegalDocs';
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

function getCategoryDetails(category: string) {
  switch (category) {
    case 'sim':
      return {
        icon: <CreditCard size={20} />,
        bg: 'bg-[#FEF6E6]',
        color: 'text-[#D97706]',
        label: 'Identitas Hukum'
      };
    case 'stnk':
      return {
        icon: <Car size={20} />,
        bg: 'bg-[#FDF2F2]',
        color: 'text-[#E11D48]',
        label: 'Pajak Kendaraan'
      };
    case 'pbb':
      return {
        icon: <Home size={20} />,
        bg: 'bg-[#EDFDF5]',
        color: 'text-[#059669]',
        label: 'Properti / PBB'
      };
    case 'paspor':
      return {
        icon: <Globe size={20} />,
        bg: 'bg-[#EEEDFC]',
        color: 'text-[#3525cd]',
        label: 'Dokumen Perjalanan'
      };
    default:
      return {
        icon: <FileText size={20} />,
        bg: 'bg-gray-150',
        color: 'text-gray-500',
        label: 'Dokumen Lainnya'
      };
  }
}

function getStatusDetails(days: number) {
  if (days < 0) {
    return {
      text: 'Expired',
      bg: 'bg-gray-100',
      color: 'text-gray-450',
      actionText: 'Renew'
    };
  }
  if (days <= 7) {
    return {
      text: 'Critical',
      bg: 'bg-[#FDF2F2]',
      color: 'text-[#E11D48]',
      actionText: 'Details'
    };
  }
  if (days <= 30) {
    return {
      text: 'Expiring Soon',
      bg: 'bg-[#FEF6E6]',
      color: 'text-[#D97706]',
      actionText: 'Details'
    };
  }
  return {
    text: 'Active',
    bg: 'bg-[#EDFDF5]',
    color: 'text-[#059669]',
    actionText: 'Details'
  };
}

export default function ManageTax() {
  const { profile, user } = useAuth();
  const { docs, loading, addDoc, updateDoc, deleteDoc } = useLegalDocs();
  const { unreadCount } = useNotifications();

  useEffect(() => {
    const handleOpenModal = () => openAddModal();
    window.addEventListener('open-add-document-modal', handleOpenModal);
    return () => window.removeEventListener('open-add-document-modal', handleOpenModal);
  }, []);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'expired'>('all');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formNumber, setFormNumber] = useState('');
  const [formCategory, setFormCategory] = useState<'sim' | 'stnk' | 'pbb' | 'paspor' | 'lainnya'>('lainnya');
  const [formExpiryDate, setFormExpiryDate] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const openAddModal = () => {
    setSelectedDoc(null);
    setFormName('');
    setFormNumber('');
    setFormCategory('lainnya');
    setFormExpiryDate('');
    setFormAmount('');
    setFormNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (doc: any) => {
    setSelectedDoc(doc);
    setFormName(doc.name);
    setFormNumber(doc.doc_number || '');
    setFormCategory(doc.category || 'lainnya');
    setFormExpiryDate(doc.expiry_date ? doc.expiry_date.split('T')[0] : '');
    setFormAmount(doc.amount ? String(doc.amount) : '');
    setFormNotes(doc.notes || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formExpiryDate) return;

    const payload = {
      name: formName,
      doc_number: formNumber || null,
      category: formCategory,
      expiry_date: new Date(formExpiryDate).toISOString(),
      amount: formAmount ? Number(formAmount) : null,
      notes: formNotes || null
    };

    try {
      if (selectedDoc) {
        await updateDoc(selectedDoc.id, payload);
      } else {
        await addDoc(payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving document:', err);
    }
  };

  const handleDelete = async () => {
    if (!selectedDoc) return;
    if (confirm(`Apakah Anda yakin ingin menghapus dokumen "${selectedDoc.name}"?`)) {
      try {
        await deleteDoc(selectedDoc.id);
        setIsModalOpen(false);
      } catch (err) {
        console.error('Error deleting document:', err);
      }
    }
  };

  // Filter docs
  const filteredDocs = docs.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (doc.doc_number && doc.doc_number.toLowerCase().includes(searchQuery.toLowerCase()));

    const daysLeft = getDaysLeft(doc.expiry_date);
    if (activeFilter === 'active') {
      return matchesSearch && daysLeft >= 0;
    }
    if (activeFilter === 'expired') {
      return matchesSearch && daysLeft < 0;
    }
    return matchesSearch;
  });

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

      {/* Search Input */}
      <div className="px-5 pt-6 pb-3">
        <div className="flex items-center bg-[#EEEDFC]/40 border border-[#DCDAFF]/40 rounded-2xl px-4 py-3 gap-3 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 focus-within:bg-white transition-all">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search reminders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-sm text-gray-800 placeholder-gray-450"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-5 py-2">
        <div className="bg-[#EEEDFC]/60 p-1 rounded-2xl flex gap-1">
          <button
            onClick={() => setActiveFilter('all')}
            className={`flex-1 text-center py-2 text-xs font-semibold rounded-xl transition-all ${
              activeFilter === 'all'
                ? 'bg-white text-indigo-700 shadow-sm font-bold'
                : 'text-gray-550 hover:text-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter('active')}
            className={`flex-1 text-center py-2 text-xs font-semibold rounded-xl transition-all ${
              activeFilter === 'active'
                ? 'bg-white text-indigo-700 shadow-sm font-bold'
                : 'text-gray-550 hover:text-gray-700'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveFilter('expired')}
            className={`flex-1 text-center py-2 text-xs font-semibold rounded-xl transition-all ${
              activeFilter === 'expired'
                ? 'bg-white text-indigo-700 shadow-sm font-bold'
                : 'text-gray-550 hover:text-gray-700'
            }`}
          >
            Expired
          </button>
        </div>
      </div>

      {/* Document List */}
      <div className="px-5 py-4 flex-1 space-y-4">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-9 h-9 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-sm">
            <FileText size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="font-bold text-gray-700 text-sm">Tidak ada dokumen ditemukan</p>
            <p className="text-gray-450 text-xs mt-1">Silakan tambah dokumen baru dengan tombol plus.</p>
          </div>
        ) : (
          filteredDocs.flatMap((doc, idx) => {
            const daysLeft = getDaysLeft(doc.expiry_date);
            const category = getCategoryDetails(doc.category);
            const status = getStatusDetails(daysLeft);
            const isExpired = daysLeft < 0;

            const card = (
              <div 
                key={doc.id} 
                className={`bg-white rounded-3xl border border-gray-100 p-5 shadow-sm hover:border-gray-200 transition-all flex flex-col ${
                  isExpired ? 'opacity-65 border-dashed border-gray-200 bg-gray-50/40' : ''
                }`}
              >
                {/* Upper Section */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-11 h-11 ${category.bg} ${category.color} rounded-2xl flex items-center justify-center shrink-0`}>
                      {category.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 leading-tight">{doc.name}</h4>
                      <p className="text-xs text-gray-400 font-semibold mt-0.5">
                        {doc.doc_number || category.label}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg ${status.bg} ${status.color}`}>
                    {status.text}
                  </span>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 my-4" />

                {/* Lower Section */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Calendar size={14} />
                    <span className="text-xs font-semibold">
                      {isExpired ? 'Expired' : 'Expires'}: {formatDate(doc.expiry_date)}
                    </span>
                  </div>
                  <button 
                    onClick={() => openEditModal(doc)}
                    className="text-xs font-bold text-[#3525cd] hover:underline cursor-pointer"
                  >
                    {status.actionText}
                  </button>
                </div>
              </div>
            );

            if (idx === 1) {
              return [
                card,
                <AdBanner key="tax-list-ad" type="inline" className="mt-1 mb-1" />
              ];
            }
            return [card];
          })
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
                {selectedDoc ? 'Edit Dokumen Legal' : 'Tambah Dokumen Legal'}
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
              {/* Nama Dokumen */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Nama Dokumen
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pajak Mobil Pajero"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all text-gray-800"
                />
              </div>

              {/* Nomor Dokumen */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Nomor Dokumen / Plat Nomor
                </label>
                <input
                  type="text"
                  placeholder="Contoh: B 1234 XYZ (Opsional)"
                  value={formNumber}
                  onChange={(e) => setFormNumber(e.target.value)}
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
                  <option value="stnk">Pajak Kendaraan (STNK)</option>
                  <option value="sim">Perpanjangan SIM</option>
                  <option value="pbb">Pajak Bumi Bangunan (PBB)</option>
                  <option value="paspor">Paspor</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>

              {/* Tanggal Expiry */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Tanggal Habis Masa Berlaku
                </label>
                <input
                  type="date"
                  required
                  value={formExpiryDate}
                  onChange={(e) => setFormExpiryDate(e.target.value)}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all text-gray-800"
                />
              </div>

              {/* Biaya Pajak (Opsional) */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Estimasi Biaya Pajak (Opsional)
                </label>
                <input
                  type="number"
                  placeholder="Contoh: 350000"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all text-gray-800"
                />
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
                {selectedDoc && (
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
