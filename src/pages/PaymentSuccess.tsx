import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';

export default function PaymentSuccess() {
  return (
    <div className="min-h-full bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center justify-center px-6 py-16">
      <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/30">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Pembayaran Berhasil!</h1>
      <p className="text-gray-500 text-sm text-center mb-6">Terima kasih atas pembayarannya. Akun Anda kini telah diperbarui secara otomatis.</p>

      <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-sm px-4 py-2 rounded-full mb-8">
        ✦ Premium Aktif
      </div>

      <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-8 space-y-3">
        <p className="font-bold text-gray-800 text-sm">Detail Transaksi</p>
        {[
          { label: 'ID Transaksi', value: '#ING-88294401' },
          { label: 'Waktu Pembayaran', value: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) },
          { label: 'Nominal', value: 'Rp 149.000', bold: true, color: 'text-indigo-700' },
          { label: 'Metode Pembayaran', value: 'Virtual Account' },
        ].map((item,i) => (
          <div key={i} className="flex justify-between items-center">
            <span className="text-sm text-gray-500">{item.label}</span>
            <span className={`text-sm ${item.bold ? 'font-bold' : 'font-medium'} ${item.color ?? 'text-gray-800'}`}>{item.value}</span>
          </div>
        ))}
      </div>

      <div className="w-full space-y-3">
        <Link to="/" className="flex items-center justify-center gap-2 w-full bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-700/25">
          Kembali ke Dashboard
        </Link>
        <button className="flex items-center justify-center gap-2 w-full border border-gray-200 text-gray-600 font-bold py-3 rounded-xl">
          <Download size={16} /> Unduh Resi
        </button>
      </div>
    </div>
  );
}
