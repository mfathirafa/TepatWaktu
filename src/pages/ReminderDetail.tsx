import { Receipt, Calendar, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ReminderDetail() {
  return (
    <div className="min-h-full bg-slate-50 pb-4">
      {/* Header */}
      <div className="bg-white px-5 pt-8 pb-4 shadow-sm relative z-10 flex items-center gap-3 sticky top-0">
        <Link to="/tagihan" className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
          <ArrowLeft size={16} />
        </Link>
        <h1 className="text-lg font-bold text-slate-800 font-heading">Detail Tagihan</h1>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Status</span>
              <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded font-bold text-[10px]">Mendesak</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Total Tagihan</span>
              <p className="font-bold text-blue-700 text-xl">Rp 1.450.000</p>
            </div>
          </div>
          <h2 className="text-base font-bold text-slate-800 mb-1">Listrik & Air - Apartemen</h2>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Tagihan rutin bulanan untuk unit Apartemen Sudirman Park Kav. 12. Termasuk biaya abonemen listrik PLN 4400VA.
          </p>
          <div className="flex gap-2">
            <button className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl flex justify-center items-center gap-1.5"><Edit2 size={14} /> Edit</button>
            <button className="flex-1 py-2.5 bg-red-50 text-red-600 font-bold text-xs rounded-xl flex justify-center items-center gap-1.5"><Trash2 size={14} /> Hapus</button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 text-sm mb-4">Informasi Tagihan</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0"><Calendar size={16} /></div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Jatuh Tempo</p>
                <p className="text-xs font-bold text-slate-700">25 Juni 2024</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0"><Receipt size={16} /></div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Metode Pembayaran</p>
                <p className="text-xs font-bold text-slate-700">Virtual Account BCA</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 text-sm mb-4">Histori Aktivitas</h3>
          <div className="relative pl-4 border-l-2 border-slate-100 space-y-4">
            <div className="relative">
              <div className="absolute w-2.5 h-2.5 bg-blue-600 rounded-full -left-[21px] top-1 border-2 border-white" />
              <p className="text-xs font-bold text-slate-800">Status berubah Mendesak</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Hari ini, 09:45</p>
            </div>
            <div className="relative">
              <div className="absolute w-2.5 h-2.5 bg-slate-300 rounded-full -left-[21px] top-1 border-2 border-white" />
              <p className="text-xs font-bold text-slate-800">Pengingat dibuat</p>
              <p className="text-[10px] text-slate-400 mt-0.5">01 Jun 2024, 08:00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
