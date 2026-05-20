import { useBills } from '../hooks/useBills';
import { useLegalDocs } from '../hooks/useLegalDocs';
import { useServices } from '../hooks/useServices';
import { useAuth } from '../context/AuthContext';
import { Bell, ChevronRight, Shield, Receipt, FileText, Wrench, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

function getDaysLeft(dateStr: string) {
  if (!dateStr) return 999;
  const diff = new Date(dateStr).getTime() - new Date().setHours(0,0,0,0);
  return Math.ceil(diff / 86400000);
}

function formatDate(dateStr: string) {
  if (!dateStr) return '-';
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(dateStr));
}

function DaysChip({ days }: { days: number }) {
  if (days < 0) return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">Terlambat</span>;
  if (days === 0) return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">Hari Ini</span>;
  if (days <= 3) return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-600">{days} Hari</span>;
  if (days <= 7) return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-600">{days} Hari</span>;
  return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600">{days} Hari</span>;
}

export default function Dashboard() {
  const { profile } = useAuth();
  const { bills } = useBills();
  const { docs } = useLegalDocs();
  const { services } = useServices();
  const { unreadCount } = useNotifications();

  const unpaidBills = bills.filter(b => b.status === 'unpaid');
  const urgentBills = unpaidBills.filter(b => getDaysLeft(b.due_date) <= 7);
  const urgentDocs = docs.filter(d => getDaysLeft(d.expiry_date) <= 30);
  const urgentServices = services.filter(s => getDaysLeft(s.next_service_date) <= 7);
  const totalUrgent = urgentBills.length + urgentDocs.length + urgentServices.length;
  const totalBillAmount = unpaidBills.reduce((s, b) => s + (b.amount ?? 0), 0);

  const allUpcoming = [
    ...urgentBills.map(b => ({ id: b.id, title: b.name, sub: 'Tagihan', date: b.due_date, days: getDaysLeft(b.due_date), color: 'text-indigo-600', bg: 'bg-indigo-50', icon: <Receipt size={16} /> })),
    ...urgentDocs.map(d => ({ id: d.id, title: d.name, sub: 'Pajak & Legal', date: d.expiry_date, days: getDaysLeft(d.expiry_date), color: 'text-violet-600', bg: 'bg-violet-50', icon: <FileText size={16} /> })),
    ...urgentServices.map(s => ({ id: s.id, title: s.name, sub: 'Servis', date: s.next_service_date, days: getDaysLeft(s.next_service_date), color: 'text-blue-600', bg: 'bg-blue-50', icon: <Wrench size={16} /> })),
  ].sort((a, b) => a.days - b.days).slice(0, 5);

  const firstName = profile?.name?.split(' ')[0] ?? 'Pengguna';

  const stats = [
    { label: 'Total Tagihan', value: bills.length + docs.length, color: 'bg-indigo-600', textColor: 'text-white' },
    { label: 'Aktif', value: unpaidBills.length + docs.filter(d => getDaysLeft(d.expiry_date) > 0).length, color: 'bg-white', textColor: 'text-indigo-700', border: true },
    { label: 'Mendesak', value: totalUrgent, color: 'bg-white', textColor: 'text-red-600', border: true },
    { label: 'Selesai', value: bills.filter(b => b.status === 'paid').length, color: 'bg-white', textColor: 'text-emerald-600', border: true },
  ];

  return (
    <div className="min-h-full bg-[#F8F9FC] pb-6">
      {/* Header */}
      <div className="bg-indigo-700 px-5 pt-12 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600/40 rounded-full" />
          <div className="absolute top-6 right-8 w-20 h-20 bg-indigo-500/30 rounded-full" />
        </div>
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <p className="text-indigo-200 text-xs font-medium mb-1">Selamat pagi,</p>
            <h1 className="text-white text-2xl font-bold">{firstName}!</h1>
            <p className="text-indigo-200 text-xs mt-1">
              {totalUrgent > 0
                ? `Anda memiliki ${totalUrgent} pengingat mendesak hari ini.`
                : 'Semua aset Anda dalam kondisi aman.'}
            </p>
          </div>
          <Link to="/notifikasi" className="relative w-10 h-10 rounded-full bg-white/15 flex items-center justify-center backdrop-blur-sm">
            <Bell size={18} className="text-white" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full border border-indigo-700" />
            )}
          </Link>
        </div>
      </div>

      <div className="px-4 -mt-14 relative z-10 space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-2">
          {stats.map((s, i) => (
            <div key={i} className={`rounded-2xl p-3 flex flex-col gap-1 ${s.color} ${s.border ? 'border border-gray-200 shadow-sm' : 'shadow-md'}`}>
              <span className={`text-xl font-bold ${s.textColor}`}>{s.value}</span>
              <span className={`text-[9px] font-semibold leading-tight ${s.border ? 'text-gray-500' : 'text-indigo-200'}`}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Total Tagihan Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-400 font-medium mb-1">Total Tagihan Belum Bayar</p>
          <p className="text-2xl font-bold text-indigo-700">{formatCurrency(totalBillAmount)}</p>
          <div className="flex gap-2 mt-3">
            <div className="flex-1 bg-indigo-50 rounded-xl p-2.5">
              <p className="text-[10px] text-indigo-500 font-medium">Tagihan</p>
              <p className="text-sm font-bold text-indigo-700">{unpaidBills.length} item</p>
            </div>
            <div className="flex-1 bg-amber-50 rounded-xl p-2.5">
              <p className="text-[10px] text-amber-500 font-medium">Jatuh Tempo</p>
              <p className="text-sm font-bold text-amber-700">{urgentBills.length} segera</p>
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <div>
          <h2 className="text-sm font-bold text-gray-800 mb-3">Kategori</h2>
          <div className="grid grid-cols-4 gap-2">
            {[
              { path: '/tagihan', label: 'Tagihan', icon: <Receipt size={20} />, bg: 'bg-indigo-50', color: 'text-indigo-600', count: unpaidBills.length },
              { path: '/pajak', label: 'Pajak', icon: <Shield size={20} />, bg: 'bg-violet-50', color: 'text-violet-600', count: docs.length },
              { path: '/servis', label: 'Servis', icon: <Wrench size={20} />, bg: 'bg-blue-50', color: 'text-blue-600', count: services.length },
              { path: '/dokumen', label: 'Dokumen', icon: <FileText size={20} />, bg: 'bg-emerald-50', color: 'text-emerald-600', count: 0 },
            ].map(item => (
              <Link key={item.path} to={item.path} className="flex flex-col items-center gap-2 bg-white rounded-2xl p-3 border border-gray-100 shadow-sm active:scale-95 transition-transform">
                <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center`}>
                  {item.icon}
                </div>
                <span className="text-[10px] font-semibold text-gray-600">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming Due */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-bold text-gray-800">Mendekati Jatuh Tempo</h2>
            <Link to="/tagihan" className="text-indigo-600 text-xs font-semibold flex items-center gap-0.5">
              Lihat Semua <ChevronRight size={14} />
            </Link>
          </div>

          {allUpcoming.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-emerald-500 text-xl">✓</span>
              </div>
              <p className="font-semibold text-gray-700 text-sm">Semua Aman!</p>
              <p className="text-gray-400 text-xs mt-0.5">Tidak ada item mendesak minggu ini.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
              {allUpcoming.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="flex items-center gap-3 px-4 py-3">
                  <div className={`w-8 h-8 ${item.bg} ${item.color} rounded-xl flex items-center justify-center shrink-0`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{item.title}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{item.sub} · {formatDate(item.date)}</p>
                  </div>
                  <DaysChip days={item.days} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upgrade Banner */}
        <div className="bg-indigo-700 rounded-2xl p-4 flex items-center gap-3 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-600/50 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <Star size={18} className="text-yellow-300" />
          </div>
          <div className="flex-1 relative z-10">
            <p className="text-white font-bold text-sm">Upgrade ke Premium</p>
            <p className="text-indigo-200 text-[10px] mt-0.5">Notifikasi WA tak terbatas & backup cloud.</p>
          </div>
          <Link to="/upgrade" className="relative z-10 bg-white text-indigo-700 text-[10px] font-bold px-3 py-1.5 rounded-lg shrink-0">
            Mulai
          </Link>
        </div>
      </div>
    </div>
  );
}
