import { ShieldCheck, Check, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UpgradePremium() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <header className="h-16 bg-white flex items-center justify-between px-8 border-b border-slate-200">
        <div className="flex items-center gap-2 text-blue-700">
          <ShieldCheck size={24} />
          <span className="font-bold text-xl tracking-tight">INGETIN</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-slate-900">Dashboard</Link>
          <Link to="/upgrade" className="text-sm font-bold text-indigo-700">Upgrade</Link>
          <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
            <button className="text-slate-500 hover:text-slate-700"><BellIcon size={20} /></button>
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
              <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto mt-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4 font-heading">Organisir Hidup Tanpa Batas</h1>
          <p className="text-slate-600 text-lg max-w-xl mx-auto">Beralih ke Premium untuk mendapatkan kontrol penuh atas seluruh aset dan jadwal maintenance Anda.</p>
        </div>

        {/* Pricing Cards */}
        <div className="flex flex-col md:flex-row justify-center gap-6 mb-16">
          <div className="w-full md:w-[340px] bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Free</h3>
            <p className="text-sm text-slate-500 mb-6">Cocok untuk penggunaan personal ringan.</p>
            <div className="mb-6 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-slate-900">Rp 0</span>
              <span className="text-slate-500 text-sm">/selamanya</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-sm text-slate-700"><Check size={18} className="text-emerald-500 shrink-0" /> Maksimal 5 reminder aktif</li>
              <li className="flex items-start gap-3 text-sm text-slate-700"><Check size={18} className="text-emerald-500 shrink-0" /> Notifikasi Email & App</li>
              <li className="flex items-start gap-3 text-sm text-slate-400"><XIcon size={18} className="shrink-0" /> Tanpa Backup Cloud</li>
              <li className="flex items-start gap-3 text-sm text-slate-400"><XIcon size={18} className="shrink-0" /> Statistik Dasar</li>
            </ul>

            <button className="w-full py-3.5 border-2 border-slate-200 text-slate-500 font-bold rounded-xl" disabled>
              Sudah Digunakan
            </button>
          </div>

          <div className="w-full md:w-[340px] bg-indigo-600 border border-indigo-500 rounded-3xl p-8 shadow-xl shadow-indigo-600/20 flex flex-col relative overflow-hidden text-white scale-105">
            <div className="absolute top-4 right-[-40px] bg-amber-400 text-amber-900 text-[10px] font-bold py-1 px-10 rotate-45 shadow-sm">Most Popular</div>
            
            <h3 className="text-2xl font-bold mb-2">Premium</h3>
            <p className="text-sm text-indigo-200 mb-6">Solusi lengkap asisten lifecycle Anda.</p>
            <div className="mb-6 flex items-baseline gap-1">
              <span className="text-4xl font-bold">Rp 49k</span>
              <span className="text-indigo-200 text-sm">/bulan</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-sm text-white"><Check size={18} className="text-emerald-400 shrink-0" /> Reminder Tanpa Batas</li>
              <li className="flex items-start gap-3 text-sm text-white"><Check size={18} className="text-emerald-400 shrink-0" /> WhatsApp Prioritas</li>
              <li className="flex items-start gap-3 text-sm text-white"><Check size={18} className="text-emerald-400 shrink-0" /> Upload Dokumen (Legal/Pajak)</li>
              <li className="flex items-start gap-3 text-sm text-white"><Check size={18} className="text-emerald-400 shrink-0" /> Backup Cloud & Enkripsi</li>
              <li className="flex items-start gap-3 text-sm text-white"><Check size={18} className="text-emerald-400 shrink-0" /> Statistik & Insight Lengkap</li>
            </ul>

            <Link to="/konfirmasi-pembayaran">
              <button className="w-full py-3.5 bg-white text-indigo-700 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-md">
                Upgrade Sekarang
              </button>
            </Link>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-8 font-heading">Perbandingan Fitur Detail</h2>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100/50">
                <tr>
                  <th className="p-4 font-bold text-slate-700 w-1/2">Fitur Utama</th>
                  <th className="p-4 font-bold text-slate-700 text-center">User Free</th>
                  <th className="p-4 font-bold text-indigo-700 text-center">User Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-4 text-slate-700">Jumlah Item/Reminder</td>
                  <td className="p-4 text-center text-slate-500">Terbatas (5)</td>
                  <td className="p-4 text-center font-bold text-indigo-700">Tanpa Batas</td>
                </tr>
                <tr>
                  <td className="p-4 text-slate-700">Notifikasi WhatsApp</td>
                  <td className="p-4 text-center text-slate-400">—</td>
                  <td className="p-4 text-center text-emerald-500"><Check size={20} className="mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 text-slate-700">Penyimpanan Dokumen</td>
                  <td className="p-4 text-center text-slate-400">—</td>
                  <td className="p-4 text-center font-bold text-slate-800">Unlimited Cloud</td>
                </tr>
                <tr>
                  <td className="p-4 text-slate-700">Backup Otomatis</td>
                  <td className="p-4 text-center text-slate-400">—</td>
                  <td className="p-4 text-center text-emerald-500"><Check size={20} className="mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 text-slate-700">Analisis Pengeluaran</td>
                  <td className="p-4 text-center text-slate-500">Basic</td>
                  <td className="p-4 text-center font-bold text-slate-800">Advanced AI Insight</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Why Premium */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-8 font-heading">Mengapa Memilih Premium?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-center">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck size={24} />
              </div>
              <h4 className="font-bold text-slate-800 mb-2">Privasi Prioritas</h4>
              <p className="text-xs text-slate-500">Data dokumen legal dan pajak Anda dienkripsi dengan standar bank AES-256 untuk keamanan mutlak.</p>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-center">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquareIcon size={24} />
              </div>
              <h4 className="font-bold text-slate-800 mb-2">Quick WhatsApp</h4>
              <p className="text-xs text-slate-500">Lupa buka aplikasi? Ingetin akan mengirim pesan langsung ke WhatsApp Anda 3 hari sebelum jatuh tempo.</p>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-center">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUpIcon size={24} />
              </div>
              <h4 className="font-bold text-slate-800 mb-2">Prediksi Biaya</h4>
              <p className="text-xs text-slate-500">Dapatkan estimasi biaya servis dan pajak tahun depan berdasarkan data historis perawatan Anda.</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-8 font-heading">Pertanyaan Umum (FAQ)</h2>
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-4">
              <div className="flex justify-between items-center cursor-pointer mb-2">
                <h4 className="font-bold text-slate-800">Apakah saya bisa berhenti kapan saja?</h4>
                <ChevronDown size={20} className="text-slate-400" />
              </div>
              <p className="text-sm text-slate-600">Ya, Anda dapat membatalkan langganan Premium kapan saja melalui pengaturan akun. Fitur Premium akan tetap aktif hingga masa langganan berakhir.</p>
            </div>
            <div className="border-b border-slate-200 pb-4">
              <div className="flex justify-between items-center cursor-pointer mb-2">
                <h4 className="font-bold text-slate-800">Bagaimana sistem pembayarannya?</h4>
                <ChevronDown size={20} className="text-slate-400" />
              </div>
              <p className="text-sm text-slate-600">Kami mendukung berbagai metode pembayaran mulai dari E-Wallet (OVO, GoPay, Dana), Transfer Bank, hingga Kartu Kredit.</p>
            </div>
            <div className="border-b border-slate-200 pb-4">
              <div className="flex justify-between items-center cursor-pointer mb-2">
                <h4 className="font-bold text-slate-800">Apakah data saya aman jika saya turun ke paket Free?</h4>
                <ChevronDown size={20} className="text-slate-400" />
              </div>
              <p className="text-sm text-slate-600">Data Anda tetap aman. Namun, Anda hanya bisa mengedit 5 reminder terakhir yang aktif. Dokumen yang sudah diunggah tetap dapat diakses namun tidak dapat menambah dokumen baru.</p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-indigo-700 to-blue-600 rounded-3xl p-10 text-center text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-900/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
          
          <h2 className="text-3xl font-bold mb-4 relative z-10 font-heading">Mulai Hidup Lebih Teratur Hari Ini</h2>
          <p className="text-indigo-100 mb-8 max-w-lg mx-auto relative z-10">Bergabunglah dengan ribuan pengguna yang telah mempercayakan pengelolaan lifecycle mereka kepada INGETIN.</p>
          <div className="flex justify-center gap-4 relative z-10">
            <button className="bg-white text-indigo-700 font-bold py-3 px-8 rounded-xl shadow-md hover:bg-slate-50 transition-colors">Dapatkan Premium Sekarang</button>
            <button className="border border-indigo-300 text-white font-bold py-3 px-8 rounded-xl hover:bg-white/10 transition-colors">Hubungi Sales</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BellIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>; }
function XIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>; }
function MessageSquareIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }
function TrendingUpIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>; }
