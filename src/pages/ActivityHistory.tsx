import { useState, useEffect } from 'react';
import { 
  Bell, 
  Calendar, 
  Wallet, 
  ArrowLeft, 
  Shield, 
  FileText, 
  Zap, 
  Car, 
  Wrench,
  Clock
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBills } from '../hooks/useBills';
import { useServices } from '../hooks/useServices';
import { useNotifications } from '../hooks/useNotifications';
import type { Bill } from '../types';

export default function ActivityHistory() {
  const { profile, user } = useAuth();
  const { bills, markPaid, refetch: refetchBills } = useBills();
  const { services, refetch: refetchServices } = useServices();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  // Compute dynamic stats based on actual DB entries
  const totalPaid = bills
    .filter(b => b.status === 'paid')
    .reduce((sum, b) => sum + (b.amount || 0), 0);

  // Format expenditure (e.g. 4.2M or 150K)
  const getFormattedExpenditure = () => {
    if (totalPaid === 0) return 'Rp 0';
    if (totalPaid >= 1000000) {
      return `Rp ${(totalPaid / 1000000).toFixed(1).replace('.0', '')}M`;
    }
    if (totalPaid >= 1000) {
      return `Rp ${(totalPaid / 1000).toFixed(0)}K`;
    }
    return `Rp ${totalPaid}`;
  };

  // Count items paid/done this month
  const getThisMonthCount = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return bills.filter(b => {
      if (b.status !== 'paid') return false;
      const d = new Date(b.updated_at);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;
  };

  const handlePayBill = async (bill: Bill) => {
    try {
      await markPaid(bill);
      alert(`Pembayaran untuk "${bill.name}" berhasil diproses!`);
      refetchBills();
    } catch (err) {
      console.error('Failed to pay bill:', err);
    }
  };

  // Map database entries to match mockup layout
  const combinedHistory = [
    ...bills.filter(b => b.status === 'paid').map(b => ({
      id: `real-b-paid-${b.id}`,
      type: 'tax',
      title: `Paid ${b.name}`,
      subtitle: `${b.category.charAt(0).toUpperCase() + b.category.slice(1)} • Home`,
      amountText: `Rp ${b.amount?.toLocaleString('id-ID') || '0'}`,
      badge: 'SUCCESS',
      badgeStyle: 'bg-[#EDFDF5] text-[#059669]',
      dateText: b.updated_at 
        ? new Date(b.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) + `, ${new Date(b.updated_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}` 
        : 'Today',
      iconType: 'receipt',
      iconStyle: 'bg-[#EEEDFC] text-[#3525cd]',
      rawDate: b.updated_at ? new Date(b.updated_at) : new Date()
    })),
    ...services.filter(s => s.last_service_date).map(s => ({
      id: `real-s-done-${s.id}`,
      type: 'service',
      title: `Service ${s.name}`,
      subtitle: `Maintenance • ${s.provider || 'Vehicle'}`,
      amountText: undefined,
      badge: 'SCHEDULED',
      badgeStyle: 'bg-gray-100 text-gray-500',
      dateText: s.updated_at 
        ? new Date(s.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) 
        : 'Yesterday',
      iconType: 'car',
      iconStyle: 'bg-[#FEF3C7] text-[#D97706]',
      rawDate: s.updated_at ? new Date(s.updated_at) : new Date()
    })),
    ...bills.filter(b => b.status === 'unpaid').map(b => ({
      id: `real-b-unpaid-${b.id}`,
      type: 'bill',
      title: b.name,
      subtitle: `${b.category.charAt(0).toUpperCase() + b.category.slice(1)} • Home`,
      amountText: `Rp ${b.amount?.toLocaleString('id-ID') || '0'}`,
      badge: 'MISSED',
      badgeStyle: 'bg-[#FDF2F2] text-[#E11D48]',
      dateText: b.due_date 
        ? new Date(b.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) 
        : 'Soon',
      iconType: 'lightning',
      iconStyle: 'bg-[#FDF2F2] text-[#E11D48]',
      showPayButton: true,
      rawBill: b,
      rawDate: b.due_date ? new Date(b.due_date) : new Date()
    }))
  ].sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());

  return (
    <div className="min-h-full bg-[#F8F9FC] pb-24 relative flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 pt-6 pb-4 flex justify-between items-center shadow-sm sticky top-0 z-30">
        <Link to="/" className="flex items-center gap-3">
          <img 
            src={profile?.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.email || 'default'}`} 
            alt="Profil" 
            className="w-10 h-10 rounded-full object-cover border border-gray-100 bg-[#E8E7FD]" 
          />
          <span className="text-[#3525cd] font-extrabold text-lg tracking-wider">TEPATWAKTU</span>
        </Link>
        <Link to="/notifikasi" className="relative p-2 hover:bg-gray-50 rounded-full transition-colors">
          <Bell size={22} className="text-[#3525cd]" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
          )}
        </Link>
      </div>

      {/* Content wrapper */}
      <div className="px-5 pt-6 flex-1 flex flex-col">
        {/* Asset Health Card */}
        <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm relative overflow-hidden shrink-0">
          {/* Custom Shield SVG matches UI design perfectly */}
          <div className="absolute right-5 top-5 text-[#E8E7FD] opacity-70">
            <svg width="68" height="76" viewBox="0 0 68 76" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M34 0C15.222 5.7 3.4 17.1 0 34.2C0 53.2 15.222 71.2 34 76C52.778 71.2 68 53.2 68 34.2C64.6 17.1 52.778 5.7 34 0ZM34 68.4C19.333 64.6 6.8 51.3 6.8 34.2C10.2 19 22.1 9.5 34 3.8C45.9 9.5 57.8 19 61.2 34.2C61.2 51.3 48.667 64.6 34 68.4Z" fill="currentColor"/>
              <path d="M31.28 25.84H36.72V33.99H44.87V39.43H36.72V47.58H31.28V39.43H23.13V33.99H31.28V25.84Z" fill="currentColor"/>
            </svg>
          </div>

          <span className="text-[10px] font-extrabold text-gray-400 tracking-wider block">
            ASSET HEALTH
          </span>
          <h2 className="text-[34px] font-extrabold text-[#3525cd] mt-2">
            94%
          </h2>

          <div className="w-full bg-[#F3F4F6] h-2.5 rounded-full overflow-hidden mt-6">
            <div className="bg-[#10B981] h-full rounded-full" style={{ width: '94%' }} />
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex gap-4 mt-6 shrink-0">
          {/* This Month Card */}
          <div className="flex-1 bg-white rounded-[26px] p-5 border border-gray-100 shadow-sm">
            <div className="w-9 h-9 bg-[#EEEDFC] text-[#3525cd] rounded-xl flex items-center justify-center shrink-0">
              <Calendar size={18} className="stroke-[2.5]" />
            </div>
            <span className="text-[9px] font-extrabold text-gray-400 tracking-wider block mt-3.5">
              This Month
            </span>
            <h3 className="text-xl font-extrabold text-gray-900 mt-1 leading-none">
              {getThisMonthCount()}
            </h3>
            <span className="text-[9px] font-extrabold text-emerald-600 mt-2 flex items-center gap-0.5 leading-none">
              ↑ 2 from last month
            </span>
          </div>

          {/* Expenditure Card */}
          <div className="flex-1 bg-white rounded-[26px] p-5 border border-gray-100 shadow-sm">
            <div className="w-9 h-9 bg-[#FEF3C7] text-[#D97706] rounded-xl flex items-center justify-center shrink-0">
              <Wallet size={18} className="stroke-[2.5]" />
            </div>
            <span className="text-[9px] font-extrabold text-gray-400 tracking-wider block mt-3.5">
              Expenditure
            </span>
            <h3 className="text-xl font-extrabold text-gray-900 mt-1 leading-none truncate">
              {getFormattedExpenditure()}
            </h3>
            <span className="text-[9px] font-bold text-gray-400 mt-2 block leading-none">
              Fixed costs included
            </span>
          </div>
        </div>

        {/* Activity Section Header */}
        <div className="flex justify-between items-center mt-7 mb-4 shrink-0">
          <h3 className="text-base font-extrabold text-gray-900">
            Activity History
          </h3>
          <button className="text-xs font-extrabold text-[#3525cd] hover:text-[#281baf] transition-colors cursor-pointer">
            Filter
          </button>
        </div>

        {/* History List */}
        <div className="space-y-6 relative mb-10 flex-1">
          {combinedHistory.length === 0 ? (
            <div className="bg-white rounded-[26px] p-8 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[220px]">
              <Clock size={36} className="text-gray-300 mb-3" />
              <p className="font-extrabold text-gray-800 text-sm">Belum Ada Riwayat</p>
              <p className="text-gray-400 text-xs mt-1">Aktivitas pembayaran atau servis Anda akan tercatat di sini.</p>
            </div>
          ) : (
            combinedHistory.map((item, index) => {
              let IconComponent = Clock;
              if (item.iconType === 'receipt') IconComponent = FileText;
              else if (item.iconType === 'car') IconComponent = Car;
              else if (item.iconType === 'shield') IconComponent = Shield;
              else if (item.iconType === 'lightning') IconComponent = Zap;

              return (
                <div key={item.id} className="flex items-stretch relative">
                  {/* Timeline vertical bar & circle indicator */}
                  <div className="flex flex-col items-center shrink-0 w-11 relative">
                    <div className={`w-9 h-9 ${item.iconStyle} rounded-full flex items-center justify-center shadow-sm relative z-10`}>
                      <IconComponent size={16} className="stroke-[2.5]" />
                    </div>
                    {index < combinedHistory.length - 1 && (
                      <div className="w-0.5 border-l border-dashed border-gray-200 grow my-2" />
                    )}
                  </div>

                  {/* Main Card */}
                  <div className="flex-1 bg-white rounded-[26px] p-5 border border-gray-100 shadow-sm relative ml-4 hover:scale-[1.01] transition-all flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="text-xs font-extrabold text-gray-900 leading-tight">
                          {item.title}
                        </h4>
                        <p className="text-[9px] text-gray-400 font-bold mt-1 leading-none">
                          {item.subtitle}
                        </p>
                      </div>
                      <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full shrink-0 ${item.badgeStyle}`}>
                        {item.badge}
                      </span>
                    </div>

                    <div className="flex justify-between items-end mt-4">
                      <span className="text-[11px] font-extrabold text-[#3525cd]">
                        {item.amountText}
                      </span>
                      <span className="text-[9px] font-bold text-gray-400">
                        {item.dateText}
                      </span>
                    </div>

                    {/* Pay Now Button */}
                    {item.showPayButton && (
                      <button 
                        onClick={() => item.rawBill ? handlePayBill(item.rawBill) : alert('Pembayaran berhasil diproses!')}
                        className="mt-4 w-full bg-[#3525cd] hover:bg-[#281baf] text-white text-[10px] font-extrabold py-3 rounded-2xl transition-all shadow-md shadow-indigo-600/10 active:scale-[0.98] cursor-pointer"
                      >
                        Pay Now
                      </button>
                    )}
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
