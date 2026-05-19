import { Check, Star, Download, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans p-4">
      <div className="max-w-xl w-full flex flex-col items-center">
        {/* Success Icon */}
        <div className="relative mb-8 mt-12">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-300/30 rounded-full blur-2xl" />
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-amber-200/50 rounded-full blur-xl" />
          <div className="relative w-32 h-32 bg-emerald-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-400/30">
            <div className="w-16 h-16 bg-emerald-900 rounded-full flex items-center justify-center">
              <Check size={36} className="text-emerald-400" strokeWidth={3} />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-3 font-heading">Pembayaran Berhasil!</h1>
        <p className="text-slate-500 text-center mb-6">Terima kasih atas pembayarannya. Akun Anda kini telah diperbarui secara otomatis.</p>
        
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full font-bold text-sm mb-12 shadow-sm border border-emerald-200">
          <Star size={16} className="text-emerald-600" /> Premium Aktif
        </div>

        {/* Transaction Detail Card */}
        <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Detail Transaksi</h3>
            <ReceiptIcon size={20} className="text-slate-400" />
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <span className="text-slate-500">ID Transaksi</span>
              <span className="font-bold text-slate-800">#ING-88294401</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <span className="text-slate-500">Waktu Pembayaran</span>
              <span className="font-bold text-slate-800">24 Okt 2024, 14:30 WIB</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <span className="text-slate-500">Nominal</span>
              <span className="font-bold text-indigo-700 text-lg">Rp 149.000</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-500">Metode Pembayaran</span>
              <span className="font-bold text-slate-800">Virtual Account</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Link to="/" className="flex-1">
            <button className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md">
              <LayoutDashboard size={18} /> Kembali ke Dashboard
            </button>
          </Link>
          <button className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors">
            <Download size={18} /> Unduh Resi
          </button>
        </div>

        <p className="text-xs text-slate-500 mt-12 mb-4 text-center">Butuh bantuan? <a href="#" className="text-indigo-600 hover:underline">Hubungi Support</a></p>
        <p className="text-[10px] text-slate-400 text-center">© 2024 INGETIN Assistant. All rights reserved.</p>
      </div>
    </div>
  );
}

function ReceiptIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/></svg>; }
