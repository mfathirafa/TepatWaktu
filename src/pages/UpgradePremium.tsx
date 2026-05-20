import { Check, Star, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const FREE_FEATURES = ['Maksimal 5 reminder aktif', 'Notifikasi Email & App', 'Statistik Dasar'];
const PREMIUM_FEATURES = ['Reminder Tanpa Batas', 'WhatsApp Prioritas', 'Upload Dokumen (Legal/Pajak)', 'Backup Cloud & Enkripsi', 'Statistik & Insight Lengkap'];

export default function UpgradePremium() {
  return (
    <div className="min-h-full bg-[#F8F9FC] pb-8">
      <div className="bg-white px-5 pt-12 pb-4 border-b border-gray-100 flex items-center gap-3">
        <Link to="/" className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600">
          <ArrowLeft size={16} />
        </Link>
        <h1 className="text-lg font-bold text-gray-900">Upgrade Premium</h1>
      </div>

      <div className="px-4 pt-6 space-y-4">
        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold text-gray-900">Organisir Hidup Tanpa Batas</h2>
          <p className="text-gray-500 text-sm mt-1">Dapatkan kontrol penuh atas seluruh aset Anda.</p>
        </div>

        {/* Plans */}
        <div className="border border-gray-200 rounded-2xl p-4 bg-white">
          <p className="font-bold text-gray-800 mb-1">Free</p>
          <p className="text-3xl font-bold text-gray-900 mb-3">Rp 0 <span className="text-sm font-normal text-gray-400">/selamanya</span></p>
          {FREE_FEATURES.map((f,i) => (
            <div key={i} className="flex items-center gap-2 py-1">
              <Check size={14} className="text-emerald-500 shrink-0" />
              <span className="text-sm text-gray-600">{f}</span>
            </div>
          ))}
          <button className="w-full mt-4 border border-indigo-200 text-indigo-600 font-bold py-2.5 rounded-xl text-sm">Sudah Digunakan</button>
        </div>

        <div className="bg-indigo-700 rounded-2xl p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[9px] font-bold px-3 py-1 rounded-bl-xl">PALING POPULER</div>
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-indigo-600/30 rounded-full" />
          <div className="flex items-center gap-2 mb-1">
            <Star size={16} className="text-yellow-300" />
            <p className="font-bold text-white">Premium</p>
          </div>
          <p className="text-3xl font-bold text-white mb-1">Rp 49k <span className="text-sm font-normal text-indigo-200">/bulan</span></p>
          <p className="text-indigo-200 text-xs mb-4">Solusi lengkap asisten lifecycle Anda.</p>
          {PREMIUM_FEATURES.map((f,i) => (
            <div key={i} className="flex items-center gap-2 py-1">
              <Check size={14} className="text-white shrink-0" />
              <span className="text-sm text-indigo-100">{f}</span>
            </div>
          ))}
          <Link to="/konfirmasi-pembayaran" className="block w-full mt-4 bg-white text-indigo-700 font-bold py-2.5 rounded-xl text-sm text-center relative z-10">
            Upgrade Sekarang
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
          <p className="font-bold text-gray-800 text-sm">Pertanyaan Umum</p>
          {[
            { q: 'Apakah saya bisa berhenti kapan saja?', a: 'Ya, Anda dapat membatalkan langganan kapan saja.' },
            { q: 'Bagaimana sistem pembayarannya?', a: 'Kami mendukung E-Wallet (OVO, GoPay), Transfer Bank, hingga Kartu Kredit.' },
          ].map((item,i) => (
            <div key={i} className="border-t border-gray-50 pt-3 first:border-t-0 first:pt-0">
              <p className="text-sm font-semibold text-gray-700">{item.q}</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
