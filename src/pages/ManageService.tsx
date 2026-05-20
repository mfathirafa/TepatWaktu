import { useState, useEffect } from 'react';
import { 
  Bell, 
  Calendar, 
  Wrench, 
  Car, 
  Laptop, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Search, 
  Plus,
  Flame,
  Gauge
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useServices } from '../hooks/useServices';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../hooks/useNotifications';

function getDaysLeft(dateStr: string) {
  if (!dateStr) return 999;
  const diff = new Date(dateStr).getTime() - new Date().setHours(0,0,0,0);
  return Math.ceil(diff / 86400000);
}

function formatDate(dateStr: string | null) {
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

function getAssetDetails(name: string) {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('mobil') || lowerName.includes('car') || lowerName.includes('toyota') || lowerName.includes('honda')) {
    return {
      icon: <Car size={20} />,
      bg: 'bg-[#EEEDFC]',
      color: 'text-[#3525cd]',
      label: 'Mobil / Kendaraan'
    };
  }
  if (lowerName.includes('motor') || lowerName.includes('vespa') || lowerName.includes('yamaha') || lowerName.includes('honda beat')) {
    return {
      icon: <Gauge size={20} />,
      bg: 'bg-[#EEEDFC]',
      color: 'text-[#3525cd]',
      label: 'Motor / Kendaraan'
    };
  }
  if (lowerName.includes('laptop') || lowerName.includes('komputer') || lowerName.includes('macbook') || lowerName.includes('asus') || lowerName.includes('hp')) {
    return {
      icon: <Laptop size={20} />,
      bg: 'bg-[#E0F2FE]',
      color: 'text-[#0284C7]',
      label: 'Komputer / Laptop'
    };
  }
  if (lowerName.includes('ac') || lowerName.includes('pendingin') || lowerName.includes('kulkas')) {
    return {
      icon: <Flame size={20} />,
      bg: 'bg-[#FEF6E6]',
      color: 'text-[#D97706]',
      label: 'Elektronik Rumah'
    };
  }
  return {
    icon: <Wrench size={20} />,
    bg: 'bg-gray-100',
    color: 'text-gray-500',
    label: 'Aset Umum'
  };
}

export default function ManageService() {
  const { profile, user } = useAuth();
  const { services, loading, addService, updateService, markDone, deleteService } = useServices();
  const { unreadCount } = useNotifications();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'healthy' | 'warning' | 'overdue'>('all');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formProvider, setFormProvider] = useState('');
  const [formInterval, setFormInterval] = useState('6');
  const [formLastDate, setFormLastDate] = useState('');
  const [formNextDate, setFormNextDate] = useState('');

  // Handle auto-calculating next date from last date + interval
  useEffect(() => {
    if (formLastDate && formInterval) {
      const last = new Date(formLastDate);
      last.setMonth(last.getMonth() + Number(formInterval));
      setFormNextDate(last.toISOString().split('T')[0]);
    }
  }, [formLastDate, formInterval]);

  useEffect(() => {
    const handleOpenModal = () => openAddModal();
    window.addEventListener('open-add-service-modal', handleOpenModal);
    return () => window.removeEventListener('open-add-service-modal', handleOpenModal);
  }, []);

  const openAddModal = () => {
    setSelectedService(null);
    setFormName('');
    setFormProvider('');
    setFormInterval('6');
    setFormLastDate('');
    setFormNextDate('');
    setIsModalOpen(true);
  };

  const openEditModal = (svc: any) => {
    setSelectedService(svc);
    setFormName(svc.name);
    setFormProvider(svc.provider || '');
    setFormInterval(String(svc.interval_months || 6));
    setFormLastDate(svc.last_service_date ? svc.last_service_date.split('T')[0] : '');
    setFormNextDate(svc.next_service_date ? svc.next_service_date.split('T')[0] : '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formNextDate) return;

    const payload = {
      name: formName,
      provider: formProvider || null,
      interval_months: Number(formInterval),
      last_service_date: formLastDate ? new Date(formLastDate).toISOString() : null,
      next_service_date: new Date(formNextDate).toISOString()
    };

    try {
      if (selectedService) {
        await updateService(selectedService.id, payload);
      } else {
        await addService(payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving service:', err);
    }
  };

  const handleDelete = async () => {
    if (!selectedService) return;
    if (confirm(`Apakah Anda yakin ingin menghapus jadwal servis "${selectedService.name}"?`)) {
      try {
        await deleteService(selectedService.id);
        setIsModalOpen(false);
      } catch (err) {
        console.error('Error deleting service:', err);
      }
    }
  };

  const handleMarkDone = async (e: React.MouseEvent, svc: any) => {
    e.stopPropagation(); // prevent opening edit modal
    try {
      await markDone(svc);
    } catch (err) {
      console.error('Error marking service done:', err);
    }
  };

  // Filter services
  const filteredServices = services.filter(svc => {
    const matchesSearch = 
      svc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (svc.provider && svc.provider.toLowerCase().includes(searchQuery.toLowerCase()));

    const daysLeft = getDaysLeft(svc.next_service_date);
    if (activeFilter === 'healthy') {
      return matchesSearch && daysLeft > 30;
    }
    if (activeFilter === 'warning') {
      return matchesSearch && daysLeft >= 0 && daysLeft <= 30;
    }
    if (activeFilter === 'overdue') {
      return matchesSearch && daysLeft < 0;
    }
    return matchesSearch;
  });

  // Calculate health stats
  const totalSvc = services.length;
  const sehat = services.filter(s => getDaysLeft(s.next_service_date) > 30).length;
  const perluCek = services.filter(s => { const d = getDaysLeft(s.next_service_date); return d >= 0 && d <= 30; }).length;
  const terlambat = services.filter(s => getDaysLeft(s.next_service_date) < 0).length;

  const percentSehat = totalSvc > 0 ? (sehat / totalSvc) * 100 : 0;

  const dateObj = new Date();
  const monthsIndonesian = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const currentMonthName = monthsIndonesian[dateObj.getMonth()];
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
          <span className="text-[#3525cd] font-extrabold text-lg tracking-wider">INGETIN</span>
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
        {/* Kesehatan Aset Card */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-extrabold text-gray-400 tracking-wider">
              KESEHATAN ASET
            </span>
            <span className="flex items-center gap-1 text-[#3525cd] bg-[#EEEDFC] font-bold text-[10px] px-2.5 py-1 rounded-lg">
              <Calendar size={12} /> {currentMonthName.slice(0, 3)} {currentYear}
            </span>
          </div>

          <h2 className="text-2xl font-extrabold text-gray-900 leading-none">
            {sehat} / {totalSvc} Aset Sehat
          </h2>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-[#E11D48] rounded-full overflow-hidden flex">
            <div 
              className="bg-[#059669] h-full transition-all duration-500" 
              style={{ width: `${percentSehat}%` }} 
            />
          </div>

          <div className="flex justify-between items-center text-xs font-semibold text-gray-500 pt-0.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
              <span>Sehat: {sehat} Aset</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48]" />
              <span>Perlu Cek: {perluCek + terlambat} Aset</span>
            </div>
          </div>
        </div>

        {/* Warning Alert Banner */}
        {terlambat > 0 && (
          <div className="bg-[#FDF2F2] border border-red-100/50 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
            <div className="w-10 h-10 bg-[#FDF2F2] rounded-xl flex items-center justify-center shrink-0 border border-red-200/50">
              <AlertCircle size={22} className="text-[#E11D48]" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#E11D48]">
                {terlambat} Servis Terlambat
              </p>
              <p className="text-[11px] text-[#E11D48]/80 font-medium">
                Segera servis aset Anda agar performa tetap terjaga.
              </p>
            </div>
          </div>
        )}

        {/* Section Header with Filters */}
        <div className="flex flex-col gap-3.5 pt-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-gray-800">Daftar Servis Aset</h3>
            <div className="flex items-center gap-2">
              <div className="flex bg-[#EEEDFC]/60 p-0.5 rounded-xl text-[9px] max-w-full overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-2 py-1 font-bold rounded-lg transition-all whitespace-nowrap ${
                    activeFilter === 'all' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setActiveFilter('healthy')}
                  className={`px-2 py-1 font-bold rounded-lg transition-all whitespace-nowrap ${
                    activeFilter === 'healthy' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  Sehat
                </button>
                <button
                  onClick={() => setActiveFilter('warning')}
                  className={`px-2 py-1 font-bold rounded-lg transition-all whitespace-nowrap ${
                    activeFilter === 'warning' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  Cek
                </button>
                <button
                  onClick={() => setActiveFilter('overdue')}
                  className={`px-2 py-1 font-bold rounded-lg transition-all whitespace-nowrap ${
                    activeFilter === 'overdue' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  Lambat
                </button>
              </div>
            </div>
          </div>

          {/* Search input */}
          <div className="flex items-center bg-[#EEEDFC]/40 border border-[#DCDAFF]/40 rounded-2xl px-4 py-2.5 gap-3 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 focus-within:bg-white transition-all">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Cari kendaraan atau perangkat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-xs text-gray-800 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Services Cards List */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-9 h-9 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-sm">
            <Wrench size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="font-bold text-gray-700 text-sm">Tidak ada jadwal servis</p>
            <p className="text-gray-400 text-xs mt-1">Gunakan tombol plus untuk menambahkan jadwal servis baru.</p>
          </div>
        ) : (
          <div className="space-y-3 pb-6">
            {filteredServices.map((svc) => {
              const daysLeft = getDaysLeft(svc.next_service_date);
              const category = getAssetDetails(svc.name);
              const isOverdue = daysLeft < 0;
              const isWarning = daysLeft >= 0 && daysLeft <= 30;

              return (
                <div 
                  key={svc.id} 
                  onClick={() => openEditModal(svc)}
                  className={`bg-white rounded-3xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 transition-all flex items-center justify-between cursor-pointer relative ${
                    isOverdue ? 'border-l-4 border-l-[#E11D48]' : isWarning ? 'border-l-4 border-l-[#D97706]' : 'border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    {/* Asset Icon */}
                    <div className={`w-11 h-11 ${category.bg} ${category.color} rounded-2xl flex items-center justify-center shrink-0`}>
                      {category.icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-extrabold text-gray-900 truncate leading-tight">
                        {svc.name}
                      </h4>
                      <p className="text-[10px] text-gray-500 font-semibold truncate mt-0.5">
                        {svc.provider || 'Servis Berkala'}
                      </p>
                      
                      {/* Subtitle / Status info */}
                      <div className="flex items-center gap-1 mt-1 text-[10px] font-semibold">
                        {isOverdue ? (
                          <span className="text-[#E11D48] flex items-center gap-0.5">
                            ! Terlambat {Math.abs(daysLeft)} Hari
                          </span>
                        ) : isWarning ? (
                          <span className="text-[#D97706] flex items-center gap-0.5">
                            Perlu Cek ({daysLeft} Hari Lagi)
                          </span>
                        ) : (
                          <span className="text-gray-400">
                            Jadwal: {formatDate(svc.next_service_date)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Button/Badge */}
                  <div className="shrink-0 ml-3">
                    {isOverdue || isWarning ? (
                      <button
                        onClick={(e) => handleMarkDone(e, svc)}
                        className="bg-indigo-600 hover:bg-[#2e1ebd] text-white text-[10px] font-extrabold px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
                      >
                        Servis
                      </button>
                    ) : (
                      <span className="inline-block text-[10px] font-extrabold px-3 py-1.5 rounded-xl bg-[#EDFDF5] text-[#059669]">
                        Aman
                      </span>
                    )}
                  </div>
                </div>
              );
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
                {selectedService ? 'Edit Jadwal Servis' : 'Tambah Jadwal Servis'}
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
              {/* Nama Aset */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Nama Kendaraan / Aset
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Mobil Toyota Avanza"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all text-gray-800"
                />
              </div>

              {/* Provider / Bengkel */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Bengkel / Provider Servis
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Bengkel Auto2000"
                  value={formProvider}
                  onChange={(e) => setFormProvider(e.target.value)}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all text-gray-800"
                />
              </div>

              {/* Interval Servis (Bulan) */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Interval Servis berkala (Bulan)
                </label>
                <select
                  value={formInterval}
                  onChange={(e) => setFormInterval(e.target.value)}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all text-gray-800"
                >
                  <option value="1">Setiap 1 Bulan</option>
                  <option value="3">Setiap 3 Bulan</option>
                  <option value="6">Setiap 6 Bulan (Rekomendasi)</option>
                  <option value="12">Setiap 12 Bulan (1 Tahun)</option>
                </select>
              </div>

              {/* Tanggal Servis Terakhir */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Tanggal Servis Terakhir
                </label>
                <input
                  type="date"
                  value={formLastDate}
                  onChange={(e) => setFormLastDate(e.target.value)}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all text-gray-800"
                />
              </div>

              {/* Jadwal Servis Berikutnya */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Jadwal Servis Berikutnya
                </label>
                <input
                  type="date"
                  required
                  value={formNextDate}
                  onChange={(e) => setFormNextDate(e.target.value)}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all text-gray-800"
                />
                <p className="text-[9px] text-gray-400 font-semibold mt-1">
                  *Terhitung otomatis jika tanggal servis terakhir diisi.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3 shrink-0">
                {selectedService && (
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
