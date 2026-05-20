import { ArrowLeft, Edit2, Trash2, Calendar, CreditCard, Upload, FileText } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function ReminderDetail() {
  const location = useLocation();
  const bill = (location.state as any)?.bill;

  function formatDate(dateStr: string) {
    if (!dateStr) return '-';
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateStr));
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  }

  function getDaysLeft(dateStr: string) {
    if (!dateStr) return 999;
    const diff = new Date(dateStr).getTime() - new Date().setHours(0,0,0,0);
    return Math.ceil(diff / 86400000);
  }

  if (!bill) {
    return (
      <div className="min-h-full bg-[#F8F9FC] flex items-center justify-center">
        <div className="text-center px-6">
          <FileText size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-600">Data tidak ditemukan</p>
          <Link to="/tagihan" className="text-indigo-600 font-bold text-sm mt-2 block">← Kembali ke Tagihan</Link>
        </div>
      </div>
    );
  }

  const days = getDaysLeft(bill.due_date);

  return (
    <div className="min-h-full bg-[#F8F9FC] pb-8">
      <div className="bg-white px-5 pt-12 pb-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/tagihan" className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600">
            <ArrowLeft size={16} />
          </Link>
          <h1 className="text-base font-bold text-gray-900">{bill.name}</h1>
        </div>
        <div className="flex gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><Edit2 size={14} /></button>
          <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 text-red-500"><Trash2 size={14} /></button>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${days <= 2 ? 'bg-red-500' : days <= 7 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              <span className={`text-xs font-bold ${days <= 2 ? 'text-red-600' : days <= 7 ? 'text-amber-600' : 'text-emerald-600'}`}>
                {days < 0 ? 'Terlambat' : days === 0 ? 'Hari Ini' : `Jatuh tempo dalam ${days} hari lagi`}
              </span>
            </div>
            <span className="text-xl font-bold text-indigo-700">{formatCurrency(bill.amount)}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3 flex gap-2 items-start">
              <Calendar size={14} className="text-indigo-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-[9px] text-gray-400 font-medium">Tanggal Jatuh Tempo</p>
                <p className="text-xs font-bold text-gray-800 mt-0.5">{formatDate(bill.due_date)}</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 flex gap-2 items-start">
              <CreditCard size={14} className="text-indigo-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-[9px] text-gray-400 font-medium">Metode Pembayaran</p>
                <p className="text-xs font-bold text-gray-800 mt-0.5">Virtual Account</p>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex justify-between mb-1">
              <span className="text-[9px] text-gray-400 font-medium">Progress Pembayaran</span>
              <span className={`text-[9px] font-bold ${days <= 3 ? 'text-red-600' : 'text-gray-600'}`}>{Math.min(100, Math.max(0, Math.round((1 - days/30)*100)))}% Menuju Jatuh Tempo</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${days <= 3 ? 'bg-red-500' : days <= 7 ? 'bg-amber-500' : 'bg-indigo-500'}`}
                style={{ width: `${Math.min(100, Math.max(0, Math.round((1 - days/30)*100)))}%` }} />
            </div>
          </div>
        </div>

        {/* Upload */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-bold text-gray-800">Dokumen Terlampir</p>
            <button className="text-indigo-600 text-xs font-bold flex items-center gap-1"><Upload size={12} /> Unggah Baru</button>
          </div>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 flex flex-col items-center gap-2">
            <FileText size={24} className="text-gray-400" />
            <p className="text-sm text-gray-500 font-medium">Belum ada dokumen</p>
            <p className="text-xs text-gray-400">Tambahkan bukti bayar atau tagihan</p>
          </div>
        </div>
      </div>
    </div>
  );
}
