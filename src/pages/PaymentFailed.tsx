import { AlertTriangle, ArrowLeft, RefreshCw, HelpCircle, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PaymentFailed() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8">
        <div className="flex items-center gap-2 text-blue-700">
          <ShieldCheckIcon size={24} />
          <span className="font-bold text-xl tracking-tight">INGETIN</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500 hover:text-slate-700 cursor-pointer">
          <HelpCircle size={20} />
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm text-center">
            
            <div className="relative mb-6 mx-auto w-24 h-24">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-100 rounded-full blur-xl" />
              <div className="relative w-24 h-24 bg-red-50 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                <div className="w-12 h-12 bg-red-700 rounded-full flex items-center justify-center text-white">
                  <AlertTriangle size={24} strokeWidth={2.5} />
                </div>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-3 font-heading">Pembayaran Gagal</h1>
            <p className="text-slate-500 mb-8">Maaf, kami tidak dapat memproses pembayaran Anda saat ini. Jangan khawatir, saldo Anda tidak terpotong.</p>

            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3 mb-8 text-left">
              <div className="text-red-500 mt-0.5"><AlertCircleIcon size={18} /></div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">Alasan Kegagalan</h4>
                <p className="text-xs text-slate-600">Koneksi dengan bank terputus atau saldo tidak mencukupi untuk menyelesaikan transaksi ini.</p>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-slate-100 pt-6 pb-8 text-left">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">ID Transaksi</p>
                <p className="font-bold text-slate-800 text-sm">#ING-98231048</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Tagihan</p>
                <p className="font-bold text-blue-700 text-lg">Rp 450.000</p>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md">
                <RefreshCw size={18} /> Coba Lagi
              </button>
              <Link to="/konfirmasi-pembayaran" className="w-full flex items-center justify-center gap-2 py-3.5 text-slate-600 hover:text-slate-900 font-bold hover:bg-slate-50 rounded-xl transition-colors">
                <ArrowLeft size={18} /> Kembali
              </Link>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-slate-500 mb-3">Butuh bantuan lebih lanjut?</p>
            <div className="flex justify-center gap-6 text-sm font-bold text-blue-700">
              <a href="#" className="flex items-center gap-2 hover:underline"><PhoneCall size={16} /> Hubungi CS</a>
              <a href="#" className="flex items-center gap-2 hover:underline"><FileTextIcon size={16} /> Bantuan</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShieldCheckIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>; }
function AlertCircleIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>; }
function FileTextIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>; }
