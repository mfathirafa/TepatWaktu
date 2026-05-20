import { Link } from 'react-router-dom';
import { RefreshCw, ArrowLeft } from 'lucide-react';

export default function PaymentFailed() {
  return (
    <div className="min-h-full bg-white flex flex-col items-center justify-center px-6 py-16">
      <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-red-500/30">
        <span className="text-white text-4xl font-bold">!</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Pembayaran Gagal</h1>
      <p className="text-gray-500 text-sm text-center mb-6">Maaf, kami tidak dapat memproses pembayaran Anda saat ini. Jangan khawatir, saldo Anda tidak terpotong.</p>

      <div className="w-full bg-red-50 border border-red-100 rounded-2xl p-4 mb-6">
        <p className="text-sm font-bold text-red-700 mb-1">Alasan Kegagalan</p>
        <p className="text-sm text-red-600">Koneksi dengan bank terputus atau saldo tidak mencukupi untuk menyelesaikan transaksi ini.</p>
      </div>

      <div className="w-full flex justify-between text-sm mb-8">
        <div><p className="text-gray-400 font-medium">ID Transaksi</p><p className="font-bold text-gray-800">#ING-98231048</p></div>
        <div className="text-right"><p className="text-gray-400 font-medium">Total Tagihan</p><p className="font-bold text-indigo-700">Rp 450.000</p></div>
      </div>

      <div className="w-full space-y-3">
        <Link to="/konfirmasi-pembayaran" className="flex items-center justify-center gap-2 w-full bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-700/25">
          <RefreshCw size={16} /> Coba Lagi
        </Link>
        <Link to="/" className="flex items-center justify-center gap-2 w-full border border-gray-200 text-gray-600 font-bold py-3 rounded-xl">
          <ArrowLeft size={16} /> Kembali
        </Link>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-gray-400">Butuh bantuan lebih lanjut?</p>
        <div className="flex justify-center gap-4 mt-1">
          <button className="text-indigo-600 text-xs font-bold">Hubungi CS</button>
          <button className="text-indigo-600 text-xs font-bold">Bantuan</button>
        </div>
      </div>
    </div>
  );
}
