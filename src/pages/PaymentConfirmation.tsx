import { ArrowLeft, Upload } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function PaymentConfirmation() {
  const [method, setMethod] = useState('bca');

  return (
    <div className="min-h-full bg-[#F8F9FC] pb-8">
      <div className="bg-white px-5 pt-12 pb-4 border-b border-gray-100 flex items-center gap-3">
        <Link to="/upgrade" className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600">
          <ArrowLeft size={16} />
        </Link>
        <h1 className="text-lg font-bold text-gray-900">Konfirmasi Pembayaran</h1>
      </div>

      <div className="px-4 pt-5 space-y-4">
        {/* Order Card */}
        <div className="bg-indigo-700 rounded-2xl p-4 text-white relative overflow-hidden">
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-indigo-600/30 rounded-full" />
          <p className="text-indigo-200 text-xs font-medium mb-1">PREMIUM ASSISTANT</p>
          <p className="text-white font-bold text-lg">Lifecycle PRO</p>
          <p className="text-indigo-300 text-xs mt-1">Pro Annual · 12 Bulan</p>
        </div>

        {/* Method */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-sm font-bold text-gray-800 mb-3">Metode Pembayaran</p>
          {[{ id: 'bca', label: 'Virtual Account BCA', sub: 'Otomatis Terverifikasi' }, { id: 'ewallet', label: 'E-Wallet (GoPay / OVO)', sub: 'Biaya Layanan Rp 1.000' }].map(m => (
            <button key={m.id} onClick={() => setMethod(m.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border mb-2 last:mb-0 transition-all ${method === m.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${method === m.id ? 'border-indigo-600' : 'border-gray-300'}`}>
                {method === m.id && <div className="w-2 h-2 bg-indigo-600 rounded-full" />}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800">{m.label}</p>
                <p className="text-[10px] text-gray-400">{m.sub}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-semibold text-gray-800">Rp 899.000</span></div>
            <div className="flex justify-between"><span className="text-emerald-600 font-medium">Promo (LAUNCH20)</span><span className="font-bold text-emerald-600">-Rp 179.800</span></div>
            <div className="border-t border-gray-100 pt-2 flex justify-between">
              <span className="font-bold text-gray-800">Total Tagihan</span>
              <span className="font-bold text-indigo-700 text-base">Rp 719.200</span>
            </div>
          </div>
        </div>

        {/* Upload */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-sm font-bold text-gray-800 mb-3">Bukti Pembayaran</p>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center gap-2">
            <Upload size={24} className="text-gray-400" />
            <p className="text-sm font-medium text-gray-600">Klik atau seret file ke sini</p>
            <p className="text-xs text-gray-400">JPG, PNG, atau PDF (Maks 5MB)</p>
          </div>
        </div>

        <Link to="/pembayaran-berhasil" className="block w-full bg-indigo-700 text-white font-bold py-3.5 rounded-xl text-center shadow-lg shadow-indigo-700/25">
          🔒 Konfirmasi & Aktifkan
        </Link>
        <p className="text-center text-[10px] text-gray-400">Pembayaran aman & terenkripsi oleh Stripe Secure</p>
      </div>
    </div>
  );
}
