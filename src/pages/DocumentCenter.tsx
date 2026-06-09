import { useState, useEffect } from 'react';
import { 
  Bell, 
  ArrowLeft, 
  Search, 
  Plus, 
  X, 
  FileText, 
  Calendar, 
  Download, 
  MoreVertical, 
  FolderOpen, 
  Car, 
  Shield, 
  Sparkles, 
  Camera,
  Check,
  Eye,
  Trash2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLegalDocs } from '../hooks/useLegalDocs';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import AdBanner from '../components/AdBanner';

function formatDate(dateStr: string) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export default function DocumentCenter() {
  const { profile, user } = useAuth();
  const { docs, loading, addDoc, updateDoc, deleteDoc } = useLegalDocs();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Semua');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formNumber, setFormNumber] = useState('');
  const [formCategory, setFormCategory] = useState<'paspor' | 'pbb' | 'stnk' | 'sim' | 'lainnya'>('lainnya');
  const [formExpiryDate, setFormExpiryDate] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Helper mappings from DB enum to UI text/colors
  const getDocVisuals = (category: string | null | undefined, name: string | null | undefined) => {
    const safeCategory = category || 'lainnya';
    const safeName = name || '';
    switch (safeCategory) {
      case 'paspor':
        return {
          label: 'Sertifikat',
          badgeStyle: 'bg-[#EDFDF5] text-[#059669]',
          iconBg: 'bg-[#EDFDF5] text-[#059669]',
          imageUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df53f7ec?q=80&w=400&auto=format&fit=crop'
        };
      case 'pbb':
        return {
          label: 'Pajak',
          badgeStyle: 'bg-[#FDF2F2] text-[#E11D48]',
          iconBg: 'bg-[#FDF2F2] text-[#E11D48]',
          imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=400&auto=format&fit=crop'
        };
      case 'stnk':
        return {
          label: 'Kendaraan',
          badgeStyle: 'bg-[#EEEDFC] text-[#3525cd]',
          iconBg: 'bg-[#EEEDFC] text-[#3525cd]',
          imageUrl: null // Renders elegant Lucide icon placeholder
        };
      case 'sim':
        return {
          label: 'Medis',
          badgeStyle: 'bg-[#FEF6E6] text-[#D97706]',
          iconBg: 'bg-[#FEF6E6] text-[#D97706]',
          imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=400&auto=format&fit=crop'
        };
      default:
        // Try guessing by name
        const lowerName = safeName.toLowerCase();
        if (lowerName.includes('sertifikat') || lowerName.includes('certificate')) {
          return {
            label: 'Sertifikat',
            badgeStyle: 'bg-[#EDFDF5] text-[#059669]',
            iconBg: 'bg-[#EDFDF5] text-[#059669]',
            imageUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df53f7ec?q=80&w=400&auto=format&fit=crop'
          };
        }
        if (lowerName.includes('pajak') || lowerName.includes('pbb') || lowerName.includes('tax')) {
          return {
            label: 'Pajak',
            badgeStyle: 'bg-[#FDF2F2] text-[#E11D48]',
            iconBg: 'bg-[#FDF2F2] text-[#E11D48]',
            imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=400&auto=format&fit=crop'
          };
        }
        if (lowerName.includes('medis') || lowerName.includes('kesehatan') || lowerName.includes('medical') || lowerName.includes('dokter')) {
          return {
            label: 'Medis',
            badgeStyle: 'bg-[#FEF6E6] text-[#D97706]',
            iconBg: 'bg-[#FEF6E6] text-[#D97706]',
            imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=400&auto=format&fit=crop'
          };
        }
        return {
          label: 'Lainnya',
          badgeStyle: 'bg-gray-100 text-gray-500',
          iconBg: 'bg-gray-50 text-gray-500',
          imageUrl: null
        };
    }
  };

  // Merge database items (no mocks)
  const dbDocsMapped = (docs || []).map(d => ({
    id: d.id,
    name: d.name,
    doc_number: d.doc_number,
    category: d.category,
    expiry_date: d.expiry_date,
    amount: d.amount,
    notes: d.notes,
    created_at: d.created_at,
    updated_at: d.updated_at,
    fileSize: d.amount ? `${(d.amount % 5 + 1.2).toFixed(1)}MB` : '1.5MB', // Pseudo size based on doc properties
    imageUrl: getDocVisuals(d.category, d.name).imageUrl
  }));

  const combinedDocs = [...dbDocsMapped];

  // Filters setup
  const filters = ['Semua', 'Sertifikat', 'Pajak', 'Kendaraan', 'Medis'];

  // Apply filters & search
  const filteredDocs = combinedDocs.filter(doc => {
    const visuals = getDocVisuals(doc.category, doc.name);
    const matchFilter = activeFilter === 'Semua' || visuals.label.toLowerCase() === activeFilter.toLowerCase();
    const matchSearch = !searchQuery || (doc.name && doc.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
                        (doc.doc_number && doc.doc_number.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchFilter && matchSearch;
  });

  // Calculate dynamic cloud storage metrics based on actual documents count
  const docsUploadedCount = (docs || []).length;
  const totalLimitMb = 100; // 100 MB total space limit
  const estimatedSizeMb = parseFloat((docsUploadedCount * 1.5).toFixed(1));
  const calculatedPercentage = Math.min(100, Math.round((estimatedSizeMb / totalLimitMb) * 100));

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
    // If it's a mock document, don't trigger edit or alert the user
    if (doc.id && typeof doc.id === 'string' && doc.id.startsWith('mock-')) {
      alert(`Berkas "${doc.name}" adalah dokumen sampel bawaan. Silakan klik tombol "+" atau scan kamera untuk menambah berkas Anda sendiri!`);
      return;
    }
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

  return (
    <div className="min-h-full bg-[#F8F9FC] pb-28 relative flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 pt-6 pb-4 flex justify-between items-center shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <img 
            src={profile?.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.email || 'default'}`} 
            alt="Profil" 
            className="w-8 h-8 rounded-full object-cover border border-gray-100 bg-[#E8E7FD]" 
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

      {/* Cloud Storage Card */}
      <div className="mx-5 mt-6 bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm flex flex-col relative overflow-hidden shrink-0">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-extrabold text-gray-900 text-base">Cloud Storage</h3>
          <span className="text-gray-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
              <path d="M12 12v9" />
              <path d="m8 17 4-4 4 4" />
            </svg>
          </span>
        </div>

        {/* Circular Progress Gauge */}
        <div className="flex flex-col items-center justify-center my-2 relative">
          <svg width="140" height="140" viewBox="0 0 140 140" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="70"
              cy="70"
              r="58"
              className="stroke-[#EEEDFC]"
              strokeWidth="9"
              fill="transparent"
            />
            {/* Foreground circle */}
            <circle
              cx="70"
              cy="70"
              r="58"
              className="stroke-[#3525cd]"
              strokeWidth="9"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 58}
              strokeDashoffset={2 * Math.PI * 58 * (1 - calculatedPercentage / 100)}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[28px] font-extrabold text-gray-950 leading-none">
              {calculatedPercentage}%
            </span>
            <span className="text-[10px] font-extrabold text-gray-400 mt-1 uppercase tracking-wider">
              Used
            </span>
          </div>
        </div>

        <span className="text-xs text-gray-500 font-semibold text-center mt-6">
          {estimatedSizeMb.toFixed(1)} MB of {totalLimitMb} MB total used
        </span>

        <button 
          onClick={openAddModal}
          className="mt-6 w-full bg-[#3525cd] hover:bg-[#281baf] text-white text-xs font-extrabold py-3.5 rounded-2xl transition-all shadow-md shadow-indigo-600/10 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="text-sm font-bold">+</span> Upload New
        </button>
      </div>

      {/* Filter Tabs Scroll area */}
      <div className="flex gap-2 px-5 py-4 overflow-x-auto no-scrollbar mt-4 shrink-0">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-5 py-2.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === f
                ? 'bg-[#3525cd] text-white shadow-sm shadow-indigo-600/10'
                : 'bg-white text-gray-500 border border-gray-100 hover:border-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Search Input bar */}
      <div className="px-5 pb-3 shrink-0">
        <div className="flex items-center bg-[#EEEDFC]/40 border border-[#DCDAFF]/40 rounded-2xl px-4 py-3 gap-3 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 focus-within:bg-white transition-all">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Cari berkas atau dokumen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-sm text-gray-800 placeholder-gray-450"
          />
        </div>
      </div>

      {/* Recent Documents Header */}
      <div className="flex justify-between items-center px-5 mt-4 mb-3 shrink-0">
        <h3 className="text-base font-extrabold text-gray-900">Recent Documents</h3>
        <button 
          onClick={() => {
            setActiveFilter('Semua');
            setSearchQuery('');
          }} 
          className="text-xs font-extrabold text-[#3525cd] hover:underline cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Documents Grid */}
      <div className="px-5 flex-1">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-9 h-9 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[200px]">
            <FolderOpen size={40} className="text-gray-300 mb-3" />
            <p className="font-extrabold text-gray-800 text-sm">Tidak ada dokumen</p>
            <p className="text-gray-400 text-xs mt-1">Gunakan tombol kamera scan atau upload berkas baru.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredDocs.flatMap((doc, idx) => {
              const visuals = getDocVisuals(doc.category, doc.name);
              const isExpired = doc.expiry_date ? new Date(doc.expiry_date).getTime() < new Date().getTime() : false;

              const card = (
                <div 
                  key={doc.id}
                  onClick={() => openEditModal(doc)}
                  className="bg-white rounded-[26px] border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:scale-[1.02] transition-all cursor-pointer relative group"
                >
                  {/* Image Container / Thumbnail */}
                  <div className="h-28 w-full bg-[#EEEDFC]/40 relative overflow-hidden flex items-center justify-center border-b border-gray-50 shrink-0">
                    {visuals.imageUrl ? (
                      <img 
                        src={visuals.imageUrl} 
                        alt={doc.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <Car size={32} className="text-[#3525cd] opacity-80 stroke-[1.75]" />
                      </div>
                    )}

                    {/* Category Badge */}
                    <span className={`absolute top-3 right-3 text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide shadow-sm ${visuals.badgeStyle}`}>
                      {visuals.label}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-3.5 flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="text-[11px] font-extrabold text-gray-900 leading-tight truncate-2-lines" title={doc.name}>
                        {doc.name}
                      </h4>
                    </div>

                    <div className="mt-3 text-[9px] text-gray-400 font-bold leading-none flex flex-wrap gap-1 items-center">
                      <span>{doc.created_at ? formatDate(doc.created_at) : 'Today'}</span>
                      <span className="text-gray-300">•</span>
                      <span>{doc.fileSize}</span>
                    </div>
                  </div>

                  {/* Lock Indicator if real uploaded */}
                  {!doc.id.startsWith('mock-') && (
                    <div className="absolute left-3 top-3 w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
                      <Sparkles size={11} className="text-[#3525cd]" />
                    </div>
                  )}
                </div>
              );

              if (idx === 1) {
                return [
                  card,
                  <div key="doc-center-ad" className="col-span-2 mt-1 mb-1">
                    <AdBanner type="inline" />
                  </div>
                ];
              }
              return [card];
            })}
          </div>
        )}
      </div>

      {/* Floating Action Shutter Button */}
      <Link 
        to="/scan"
        className="fixed bottom-[92px] right-5 w-14 h-14 bg-[#3525cd] hover:bg-[#281baf] text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all z-40"
        title="Pindai Dokumen Baru"
      >
        {/* Shutter Camera lens icon matching mockup */}
        <Camera size={22} className="stroke-[2]" />
      </Link>

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
                {selectedDoc ? 'Edit Dokumen' : 'Upload Dokumen Baru'}
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
                  placeholder="Contoh: HM-20921820 (Opsional)"
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
                  <option value="paspor">Sertifikat</option>
                  <option value="pbb">Pajak</option>
                  <option value="stnk">Kendaraan</option>
                  <option value="sim">Medis</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>

              {/* Tanggal Expiry */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Habis Masa Berlaku
                </label>
                <input
                  type="date"
                  required
                  value={formExpiryDate}
                  onChange={(e) => setFormExpiryDate(e.target.value)}
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
                  rows={2.5}
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
                  Simpan Dokumen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
