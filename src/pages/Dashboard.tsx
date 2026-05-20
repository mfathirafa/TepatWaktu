import { useBills } from '../hooks/useBills';
import { useLegalDocs } from '../hooks/useLegalDocs';
import { useServices } from '../hooks/useServices';
import { useAuth } from '../context/AuthContext';
import { Bell, ChevronDown, ChevronRight, FileText, Calendar, AlertTriangle, ClipboardList, Car, Trash2, Wrench, Receipt, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';

function getDaysLeft(dateStr: string) {
  if (!dateStr) return 999;
  const diff = new Date(dateStr).getTime() - new Date().setHours(0,0,0,0);
  return Math.ceil(diff / 86400000);
}

function getDayName(dateStr: string) {
  const date = new Date(dateStr);
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return days[date.getDay()];
}

function getMonthNameIndonesian(date: Date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return months[date.getMonth()];
}

function formatCurrencyCompact(amount: number) {
  if (amount >= 1000000) {
    return `Rp ${(amount / 1000000).toFixed(1).replace('.0', '')}jt`;
  }
  if (amount >= 1000) {
    return `Rp ${(amount / 1000).toFixed(0)}rb`;
  }
  return `Rp ${amount}`;
}

export default function Dashboard() {
  const { profile, user } = useAuth();
  const { bills } = useBills();
  const { docs } = useLegalDocs();
  const { services } = useServices();
  const { unreadCount } = useNotifications();

  const unpaidBills = bills.filter(b => b.status === 'unpaid');
  const urgentBills = unpaidBills.filter(b => getDaysLeft(b.due_date) <= 7);
  const urgentDocs = docs.filter(d => getDaysLeft(d.expiry_date) <= 30);
  const urgentServices = services.filter(s => getDaysLeft(s.next_service_date) <= 7);
  const totalUrgent = urgentBills.length + urgentDocs.length + urgentServices.length;

  const totalReminders = bills.length + docs.length + services.length;
  const activeReminders = unpaidBills.length + docs.filter(d => getDaysLeft(d.expiry_date) > 0).length + services.length;
  const completedReminders = bills.filter(b => b.status === 'paid').length;

  const allUpcoming = [
    ...unpaidBills.map(b => ({ id: b.id, title: b.name, date: b.due_date, days: getDaysLeft(b.due_date), amount: b.amount, type: 'bill' })),
    ...docs.map(d => ({ id: d.id, title: d.name, date: d.expiry_date, days: getDaysLeft(d.expiry_date), type: 'doc' })),
    ...services.map(s => ({ id: s.id, title: s.name, date: s.next_service_date, days: getDaysLeft(s.next_service_date), type: 'service' })),
  ].sort((a, b) => a.days - b.days).slice(0, 5);

  const fullName = profile?.name || user?.user_metadata?.full_name || user?.user_metadata?.name || 'Muhammad Fathi Rafa';
  const firstName = fullName.split(' ')[0];

  const getLocalDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getWeeklyActivity = () => {
    const daysOfWeek = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const today = new Date();
    const currentDay = today.getDay();
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + distanceToMonday);

    const counts = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      const dayStr = getLocalDateString(date);
      
      const billCount = bills.filter(b => b.due_date && b.due_date.startsWith(dayStr)).length;
      const docCount = docs.filter(d => d.expiry_date && d.expiry_date.startsWith(dayStr)).length;
      const serviceCount = services.filter(s => s.next_service_date && s.next_service_date.startsWith(dayStr)).length;
      
      return {
        day: daysOfWeek[i],
        count: billCount + docCount + serviceCount
      };
    });

    const maxCount = Math.max(...counts.map(c => c.count));

    return counts.map(c => ({
      day: c.day,
      value: maxCount > 0 ? (c.count / maxCount) * 80 + 20 : 15,
      count: c.count
    }));
  };

  const activityData = getWeeklyActivity();

  const getDisplayInfo = (item: any) => {
    const titleLower = item.title.toLowerCase();
    
    let subText = '';
    if (item.days === 0) {
      subText = 'Hari ini';
    } else if (item.days === 1) {
      subText = 'Besok';
    } else if (titleLower.includes('stnk') || titleLower.includes('pajak') || titleLower.includes('mobil') || titleLower.includes('motor')) {
      subText = `Jatuh tempo ${item.days} hari lagi`;
    } else if (item.days > 1 && item.days <= 7) {
      subText = `${getDayName(item.date)} Depan`;
    } else {
      const d = new Date(item.date);
      subText = `Dijadwalkan: ${d.getDate()} ${getMonthNameIndonesian(d)}`;
    }

    if (titleLower.includes('stnk') || titleLower.includes('pajak') || titleLower.includes('mobil') || titleLower.includes('motor')) {
      return {
        icon: <Car size={18} />,
        iconColor: 'text-red-500',
        iconBg: 'bg-red-50',
        rightContent: <span className="text-xs font-bold text-red-500">Mendesak</span>,
        subText
      };
    }
    if (titleLower.includes('kebersihan') || titleLower.includes('sampah') || titleLower.includes('iuran')) {
      const formattedAmount = item.amount ? formatCurrencyCompact(item.amount) : 'Rp 50rb';
      return {
        icon: <Trash2 size={18} />,
        iconColor: 'text-indigo-600',
        iconBg: 'bg-indigo-50',
        rightContent: <span className="text-xs font-bold text-gray-500">{formattedAmount}</span>,
        subText: item.days > 1 && item.days <= 7 ? `${getDayName(item.date)} Depan` : subText
      };
    }
    if (titleLower.includes('ac') || titleLower.includes('service') || titleLower.includes('servis')) {
      const d = new Date(item.date);
      return {
        icon: <Wrench size={18} />,
        iconColor: 'text-amber-500',
        iconBg: 'bg-amber-50',
        rightContent: <span className="text-xs font-bold text-gray-400">Rumah</span>,
        subText: `Dijadwalkan: ${d.getDate()} ${getMonthNameIndonesian(d)}`
      };
    }

    return {
      icon: item.type === 'bill' ? <Receipt size={18} /> : <FileText size={18} />,
      iconColor: item.type === 'bill' ? 'text-indigo-500' : 'text-emerald-500',
      iconBg: item.type === 'bill' ? 'bg-indigo-50' : 'bg-emerald-50',
      rightContent: <span className="text-xs font-bold text-gray-500">{item.amount ? formatCurrencyCompact(item.amount) : 'Aset'}</span>,
      subText
    };
  };

  return (
    <div className="min-h-full bg-[#F8F9FC] pb-24 relative">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 pt-6 pb-4 flex justify-between items-center shadow-sm">
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

      {/* Welcome Section */}
      <div className="px-5 pt-6 pb-2">
        <h1 className="text-[26px] font-extrabold text-gray-950 leading-tight">
          Selamat pagi, {firstName}!
        </h1>
        <p className="text-gray-500 text-sm mt-2 flex items-center flex-wrap gap-1">
          Anda memiliki
          <span className="bg-red-100 text-red-600 font-bold px-2.5 py-0.5 rounded-full text-[11px] inline-flex items-center justify-center">
            {totalUrgent} pengingat mendesak
          </span>
          hari ini.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 py-3 mt-2">
        {/* Card 1: Total */}
        <div className="bg-[#EEEDFC]/70 border border-[#DCDAFF]/70 rounded-3xl p-5 min-w-[130px] flex-1 flex flex-col gap-4 shadow-sm">
          <ClipboardList size={22} className="text-[#3525cd]" />
          <div>
            <p className="text-xs text-gray-500 font-semibold">Total</p>
            <p className="text-2xl font-extrabold text-gray-950 mt-1">{totalReminders}</p>
          </div>
        </div>

        {/* Card 2: Active */}
        <div className="bg-[#EEEDFC]/70 border border-[#DCDAFF]/70 rounded-3xl p-5 min-w-[130px] flex-1 flex flex-col gap-4 shadow-sm">
          <Calendar size={22} className="text-[#3525cd]" />
          <div>
            <p className="text-xs text-indigo-600 font-semibold">Aktif</p>
            <p className="text-2xl font-extrabold text-gray-950 mt-1">{activeReminders}</p>
          </div>
        </div>

        {/* Card 3: Urgent */}
        <div className="bg-[#FDF2F2] border border-[#FDE8E8] rounded-3xl p-5 min-w-[130px] flex-1 flex flex-col gap-4 shadow-sm">
          <AlertTriangle size={22} className="text-red-600" />
          <div>
            <p className="text-xs text-red-600 font-semibold">Mendesak</p>
            <p className="text-2xl font-extrabold text-gray-950 mt-1">{totalUrgent}</p>
          </div>
        </div>

        {/* Card 4: Selesai */}
        <Link 
          to="/riwayat" 
          className="bg-[#EDFDF5]/80 border border-[#D1FAE5]/80 rounded-3xl p-5 min-w-[130px] flex-1 flex flex-col gap-4 shadow-sm hover:scale-[1.03] transition-all cursor-pointer"
        >
          <CheckCircle size={22} className="text-emerald-600" />
          <div>
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-0.5">
              Selesai <ChevronRight size={12} className="stroke-[2.5]" />
            </p>
            <p className="text-2xl font-extrabold text-gray-950 mt-1">{completedReminders}</p>
          </div>
        </Link>
      </div>

      {/* Pusat Dokumen Quick Access Banner */}
      <div className="px-5 mt-4">
        <Link 
          to="/dokumen" 
          className="relative overflow-hidden bg-gradient-to-r from-[#3525cd] to-[#4f46e5] rounded-3xl p-5 flex justify-between items-center shadow-md shadow-indigo-600/10 hover:scale-[1.01] transition-all group block"
        >
          {/* Decorative background shape */}
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-300" />
          
          <div className="flex-1 pr-4">
            <span className="text-[9px] font-extrabold text-[#E8E7FD] tracking-wider uppercase bg-white/15 px-2.5 py-1 rounded-md">
              Fitur Baru
            </span>
            <h3 className="text-white font-extrabold text-lg mt-2.5">Pusat Dokumen</h3>
            <p className="text-[#DCDAFF] text-xs mt-1 font-medium leading-snug">
              Simpan, pantau, dan digitalkan semua dokumen penting Anda di satu tempat aman.
            </p>
          </div>
          
          <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-inner group-hover:rotate-6 transition-transform duration-300">
            <FileText size={24} className="stroke-[2]" />
          </div>
        </Link>
      </div>

      {/* Reminder Activity Chart */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm mx-5 mt-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-950 text-base">Aktivitas Pengingat</h3>
          <button className="text-indigo-600 text-sm font-semibold flex items-center gap-1 hover:underline">
            7 Hari Terakhir <ChevronDown size={16} />
          </button>
        </div>
        <div className="flex justify-between items-end h-28 px-2">
          {activityData.map((data, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 flex-1">
              <div className="w-2.5 bg-indigo-50 rounded-full h-20 flex flex-col justify-end overflow-hidden">
                <div 
                  className="w-full bg-indigo-600 rounded-full transition-all duration-500 animate-pulse" 
                  style={{ height: `${data.value}%`, animationDuration: '2s' }} 
                />
              </div>
              <span className="text-[11px] text-gray-400 font-medium">{data.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Section */}
      <div className="mt-4">
        <div className="flex justify-between items-center px-5 mb-3">
          <h2 className="text-base font-extrabold text-gray-900">Mendatang</h2>
          <Link to="/tagihan" className="text-indigo-600 text-xs font-bold hover:underline">
            Lihat semua
          </Link>
        </div>

        <div className="px-5 space-y-3">
          {allUpcoming.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-emerald-500 text-xl">✓</span>
              </div>
              <p className="font-semibold text-gray-700 text-sm">Semua Aman!</p>
              <p className="text-gray-400 text-xs mt-0.5">Tidak ada item mendesak minggu ini.</p>
            </div>
          ) : (
            allUpcoming.map((item, idx) => {
              const display = getDisplayInfo(item);
              return (
                <div key={`${item.id}-${idx}`} className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${display.iconBg} ${display.iconColor} rounded-xl flex items-center justify-center shrink-0`}>
                      {display.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-400 font-semibold mt-0.5">{display.subText}</p>
                    </div>
                  </div>
                  <div>
                    {display.rightContent}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}
