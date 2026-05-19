import { useBills } from '../hooks/useBills';
import { useLegalDocs } from '../hooks/useLegalDocs';
import { useServices } from '../hooks/useServices';

import { useAuth } from '../context/AuthContext';
import { Bell, ArrowRight, Zap, CreditCard, ShieldAlert, Receipt } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate, getDaysLeft } from '../types';
import { useNotifications } from '../hooks/useNotifications';

export default function Dashboard() {
  const { profile } = useAuth();
  const { bills } = useBills();
  const { docs } = useLegalDocs();
  const { services } = useServices();
  const { unreadCount } = useNotifications();

  // Combine all urgent items
  const urgentBills = bills.filter(b => b.status === 'unpaid' && getDaysLeft(b.due_date) <= 7);
  const urgentDocs = docs.filter(d => getDaysLeft(d.expiry_date) <= 7);
  const urgentServices = services.filter(s => getDaysLeft(s.next_service_date) <= 7);

  const totalUrgent = urgentBills.length + urgentDocs.length + urgentServices.length;
  const totalBillAmount = bills.filter(b => b.status === 'unpaid').reduce((s, b) => s + (b.amount ?? 0), 0);

  return (
    <div className="min-h-full bg-slate-50/50 pb-24 relative overflow-y-auto no-scrollbar">
      {/* Decorative BG Blob */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Header */}
      <div className="px-6 pt-10 pb-6 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-slate-500 text-xs font-semibold mb-1 uppercase tracking-widest">Selamat Datang</p>
            <h1 className="text-slate-900 text-2xl font-extrabold font-heading tracking-tight">{profile?.name?.split(' ')[0] ?? 'Pengguna'} 👋</h1>
          </div>
          <Link to="/notifikasi" className="relative p-3 bg-white rounded-full text-slate-600 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:bg-slate-50 transition-colors">
            <Bell size={20} />
            {unreadCount > 0 && <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />}
          </Link>
        </div>

        {/* Main Balance/Summary Card */}
        <div className="bg-indigo-600 rounded-3xl p-6 shadow-[0_8px_20px_rgb(79,70,229,0.25)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-900/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3" />
          
          <div className="relative z-10">
            <p className="text-indigo-100 text-xs font-medium mb-1.5 opacity-90">Total Tagihan Belum Dibayar</p>
            <span className="text-white text-3xl font-extrabold tracking-tight">{formatCurrency(totalBillAmount)}</span>
            {totalUrgent > 0 && (
              <div className="mt-4 inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                <span className="text-[10px]">⚠️</span>
                <p className="text-white text-[10px] font-bold tracking-wide">{totalUrgent} Item Mendesak</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 relative z-20 space-y-6">
        {/* Ads Banner */}
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-4 text-white shadow-[0_8px_20px_rgb(245,158,11,0.2)] flex justify-between items-center relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-white/20 rounded-full blur-xl translate-x-1/2 -translate-y-1/2" />
          <div className="relative z-10">
            <h3 className="font-extrabold text-sm mb-0.5 tracking-tight">Premium Plan</h3>
            <p className="text-[11px] text-amber-50 font-medium">Bebas limit notifikasi WhatsApp.</p>
          </div>
          <Link to="/upgrade" className="relative z-10 bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-xl text-[10px] font-bold backdrop-blur-md uppercase tracking-wider">
            Upgrade
          </Link>
        </div>

        {/* Quick Access */}
        <div>
          <h2 className="text-sm font-bold text-slate-800 mb-3 font-heading tracking-tight">Kategori</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { path: '/tagihan', label: 'Tagihan', icon: <Zap size={22} />, iconBg: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white', count: bills.filter(b=>b.status==='unpaid').length },
              { path: '/pajak', label: 'Pajak', icon: <CreditCard size={22} />, iconBg: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white', count: docs.length },
              { path: '/servis', label: 'Servis', icon: <ShieldAlert size={22} />, iconBg: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white', count: services.length },
            ].map(item => (
              <Link key={item.path} to={item.path} className="group flex flex-col items-center gap-2 p-4 bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] active:scale-[0.98] transition-all">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${item.iconBg}`}>
                  {item.icon}
                </div>
                <span className="text-xs font-bold text-slate-700">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Urgent Items */}
        <div>
          <div className="flex justify-between items-end mb-3">
            <h2 className="text-sm font-bold text-slate-800 font-heading tracking-tight">Mendesak!</h2>
            <Link to="/tagihan" className="text-indigo-600 text-xs font-bold hover:underline flex items-center gap-1">
              Lihat Semua <ArrowRight size={14} />
            </Link>
          </div>

          {totalUrgent === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-2xl mb-3 shadow-[0_8px_30px_rgb(16,185,129,0.15)]">✓</div>
              <h3 className="font-bold text-slate-800 text-base mb-1">Semua Aman!</h3>
              <p className="text-slate-500 text-xs font-medium">Tidak ada tagihan mendesak minggu ini.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {urgentBills.slice(0, 3).map(bill => {
                const days = getDaysLeft(bill.due_date);
                return (
                  <div key={bill.id} className="bg-white p-4 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex items-center gap-4 relative overflow-hidden active:scale-[0.98] transition-transform">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500" />
                    <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 shrink-0">
                      <Receipt size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-800 text-sm truncate">{bill.name}</h4>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">Jatuh tempo: {formatDate(bill.due_date)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-extrabold text-slate-800 text-sm">{formatCurrency(bill.amount)}</p>
                      <div className="inline-block px-2 py-0.5 bg-red-50 text-red-600 rounded-md mt-1">
                        <p className="text-[10px] font-bold">{days} Hari Lagi</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
