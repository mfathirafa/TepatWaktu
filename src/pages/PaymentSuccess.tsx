import { Link, useLocation } from 'react-router-dom';
import { Download, Home } from 'lucide-react';

export default function PaymentSuccess() {
  const location = useLocation();
  const state = location.state as { method?: string; amount?: string; txId?: string } | null;

  const txId = state?.txId || '#TW-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  const amount = state?.amount || 'Rp 719.200';
  const method = state?.method === 'ewallet' ? 'E-Wallet (GoPay / OVO)' : 'Virtual Account BCA';
  const now = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  const handleDownload = () => {
    const content = `
TEPATWAKTU — Bukti Pembayaran Premium
======================================
ID Transaksi : ${txId}
Tanggal      : ${now}
Nominal      : ${amount}
Metode       : ${method}
Status       : BERHASIL
======================================
Terima kasih telah berlangganan TepatWaktu Premium!
Akun Anda kini memiliki akses penuh ke semua fitur.
    `.trim();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resi-tepatwaktu-${txId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center justify-center px-6 py-16">
      {/* Success icon */}
      <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/30">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Pembayaran Berhasil!</h1>
      <p className="text-gray-500 text-sm text-center mb-6">
        Terima kasih atas pembayarannya. Akun Anda kini telah diperbarui ke <strong>Premium</strong>.
      </p>

      <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-sm px-4 py-2 rounded-full mb-8">
        ✦ Premium Aktif
      </div>

      {/* Detail Transaksi */}
      <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-8 space-y-3">
        <p className="font-bold text-gray-800 text-sm">Detail Transaksi</p>
        {[
          { label: 'ID Transaksi', value: txId },
          { label: 'Waktu Pembayaran', value: now },
          { label: 'Nominal', value: amount, bold: true, color: 'text-indigo-700' },
          { label: 'Metode Pembayaran', value: method },
          { label: 'Status', value: 'BERHASIL', bold: true, color: 'text-emerald-600' },
        ].map((item, i) => (
          <div key={i} className="flex justify-between items-center">
            <span className="text-sm text-gray-500">{item.label}</span>
            <span className={`text-sm ${item.bold ? 'font-bold' : 'font-medium'} ${item.color ?? 'text-gray-800'}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

      <div className="w-full space-y-3">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 w-full bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-700/25"
        >
          <Home size={16} />
          Kembali ke Dashboard
        </Link>
        <button
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 w-full border border-gray-200 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <Download size={16} /> Unduh Resi
        </button>
      </div>
    </div>
  );
}
