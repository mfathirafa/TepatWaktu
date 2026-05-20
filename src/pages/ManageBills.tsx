import { useState } from 'react';
import { Plus, Receipt, SlidersHorizontal, Download, Bell } from 'lucide-react';
import { useBills } from '../hooks/useBills';
import { Link } from 'react-router-dom';

function formatDate(dateStr: string) {
  if (!dateStr) return '-';
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(dateStr));
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

function getDaysLeft(dateStr: string) {
  if (!dateStr) return 999;
  const diff = new Date(dateStr).getTime() - new Date().setHours(0,0,0,0);
  return Math.ceil(diff / 86400000);
}

function StatusChip({ status, days }: { status: string; days: number }) {
  if (status === 'paid') return <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Terbayar</span>;
  if (days < 0) return <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">Terlambat</span>;
  if (days <= 3) return <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">Segera</span>;
  return <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Belum Bayar</span>;
}

export default function ManageBills() {
  const { bills, loading, markPaid } = useBills();
  const [filter, setFilter] = useState<'all' | 'unpaid' | 'paid'>('all');

  const filtered = bills.filter(b => {
    if (filter === 'unpaid') return b.status === 'unpaid';
    if (filter === 'paid') return b.status === 'paid';
    return true;
  });

  const totalBulanIni = bills.filter(b => b.status === 'unpaid').reduce((s, b) => s + (b.amount ?? 0), 0);
  const totalTerbayar = bills.filter(b => b.status === 'paid').reduce((s, b) => s + (b.amount ?? 0), 0);
  const urgent = bills.filter(b => b.status === 'unpaid' && getDaysLeft(b.due_date) <= 2).length;

  return (
    <div className="min-h-full bg-[#F8F9FC] pb-6">
      {/* Header */}
      <div className="bg-indigo-700 px-5 pt-12 pb-16 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-36 h-36 bg-indigo-600/40 rounded-full" />
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-white text-lg font-bold">Kelola Tagihan</h1>
              <p className="text-indigo-200 text-xs mt-0.5">Monitor dan bayar tagihan rutin Anda tepat waktu.</p>
            </div>
            <div className="flex gap-2">
              <button className="w-8 h-8 bg-white/15 rounded-xl flex items-center justify-center text-white"><SlidersHorizontal size={15} /></button>
              <button className="w-8 h-8 bg-white/15 rounded-xl flex items-center justify-center text-white"><Download size={15} /></button>
            </div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 flex gap-3">
            <div className="flex-1">
              <p className="text-indigo-200 text-[9px] font-medium">Total Bulan Ini</p>
              <p className="text-white font-bold text-base">{formatCurrency(totalBulanIni)}</p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="flex-1">
              <p className="text-indigo-200 text-[9px] font-medium">Sudah Bayar</p>
              <p className="text-emerald-300 font-bold text-base">{formatCurrency(totalTerbayar)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-8 relative z-10 space-y-4">
        {/* Alert */}
        {urgent > 0 && (
          <div className="bg-white rounded-2xl border border-amber-200 p-3 flex items-center gap-3 shadow-sm">
            <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
              <Bell size={16} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">{urgent} Tagihan Segera</p>
              <p className="text-[10px] text-gray-500">Akan jatuh tempo dalam 48 jam ke depan.</p>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="flex gap-2">
          {[['all', 'Semua'], ['unpaid', 'Belum Bayar'], ['paid', 'Terbayar']].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${filter === val ? 'bg-indigo-700 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Bills List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
            <Receipt size={32} className="text-gray-300 mx-auto mb-2" />
            <p className="font-semibold text-gray-700 text-sm">Belum ada tagihan</p>
            <p className="text-gray-400 text-xs mt-1">Tambahkan tagihan rutin baru.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(bill => {
              const days = getDaysLeft(bill.due_date);
              const urgent = bill.status === 'unpaid' && days <= 3;
              return (
                <div key={bill.id}
                  className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${urgent ? 'border-red-100' : 'border-gray-100'}`}>
                  <div className={`h-1 w-full ${bill.status === 'paid' ? 'bg-emerald-500' : urgent ? 'bg-red-500' : 'bg-amber-400'}`} />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${bill.status === 'paid' ? 'bg-emerald-50' : 'bg-indigo-50'}`}>
                          <Receipt size={16} className={bill.status === 'paid' ? 'text-emerald-600' : 'text-indigo-600'} />
                        </div>
                        <div>
                          <Link to="/tagihan/detail" state={{ bill }} className="text-sm font-bold text-gray-800 hover:text-indigo-700 transition-colors">{bill.name}</Link>
                          <p className="text-[10px] text-gray-400 mt-0.5">Jatuh Tempo: {formatDate(bill.due_date)}</p>
                        </div>
                      </div>
                      <StatusChip status={bill.status} days={days} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[9px] text-gray-400 font-medium">Nominal</p>
                        <p className="text-base font-bold text-indigo-700">{formatCurrency(bill.amount)}</p>
                      </div>
                      {bill.status === 'unpaid' ? (
                        <button
                          onClick={() => markPaid(bill.id)}
                          className="bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-indigo-800 transition-colors"
                        >
                          Tandai Lunas
                        </button>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">✓ Lunas</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add Card */}
        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center gap-2 bg-white/50">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
            <Plus size={20} className="text-indigo-600" />
          </div>
          <p className="text-sm font-bold text-gray-700">Tambah Tagihan</p>
          <p className="text-xs text-gray-400 text-center">Daftarkan tagihan rutin baru</p>
        </div>
      </div>
    </div>
  );
}
