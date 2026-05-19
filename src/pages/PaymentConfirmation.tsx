import { ArrowLeft, Clock, ShieldCheck, CreditCard, Wallet, UploadCloud, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PaymentConfirmation() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8">
        <div className="flex items-center gap-2 text-blue-700">
          <ShieldCheck size={24} />
          <span className="font-bold text-xl tracking-tight">INGETIN</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-slate-500 hover:text-slate-700"><BellIcon size={20} /></button>
          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
            <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto w-full py-8 px-4 flex-1">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 mb-6">
          <ArrowLeft size={16} /> Kembali ke Dashboard
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="flex-1 space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <h4 className="font-bold text-amber-900 text-sm">Menunggu Pembayaran</h4>
                <p className="text-amber-700 text-xs mt-0.5">Selesaikan pembayaran dalam 23:54:12</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
              <div className="absolute top-8 right-8 text-white/50">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2-.9 2-2s-.9-2-2-2H8"/><circle cx="15" cy="7" r="4"/></svg>
              </div>
              
              <p className="text-xs font-bold text-indigo-200 tracking-wider mb-1 uppercase">Premium Assistant</p>
              <h2 className="text-2xl font-bold mb-6 relative z-10">Lifecycle PRO</h2>
              
              <div className="mb-4">
                <p className="text-[10px] text-indigo-200 uppercase tracking-widest mb-1">User ID</p>
                <p className="font-mono text-xl tracking-widest">**** **** 8821</p>
              </div>
              
              <div>
                <p className="text-[10px] text-indigo-200 uppercase tracking-widest mb-0.5">Valid Thru</p>
                <p className="font-mono text-sm">12 / 2025</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 text-blue-700 font-bold text-sm mb-4">
                  <CreditCard size={18} /> Rincian Paket
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-500 text-sm">Paket</span>
                  <span className="font-bold text-slate-800 text-sm">Pro Annual</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm">Durasi</span>
                  <span className="font-bold text-slate-800 text-sm">12 Bulan</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm mb-4">
                  <ShieldCheck size={18} /> Fitur Utama
                </div>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2"><CheckCircleIcon size={14} className="text-emerald-500" /> Unlimited Assets</li>
                  <li className="flex items-center gap-2"><CheckCircleIcon size={14} className="text-emerald-500" /> AI Legal Assistant</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-[400px] shrink-0">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Konfirmasi Pembayaran</h2>
              
              <div className="mb-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Metode Pembayaran</p>
                <div className="space-y-3">
                  <label className="flex items-center p-3 border-2 border-indigo-600 bg-indigo-50/50 rounded-xl cursor-pointer transition-colors">
                    <div className="w-10 h-6 bg-blue-800 text-white text-[10px] font-bold italic flex items-center justify-center rounded mr-3">BCA</div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-slate-800">Virtual Account BCA</h4>
                      <p className="text-[10px] text-slate-500">Otomatis Terverifikasi</p>
                    </div>
                    <div className="w-5 h-5 rounded-full border-4 border-indigo-600 bg-white"></div>
                  </label>
                  
                  <label className="flex items-center p-3 border border-slate-200 rounded-xl cursor-pointer hover:border-slate-300 transition-colors">
                    <div className="w-10 h-6 bg-teal-500 text-white flex items-center justify-center rounded mr-3"><Wallet size={14} /></div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-slate-800">E-Wallet (GoPay / OVO)</h4>
                      <p className="text-[10px] text-slate-500">Biaya Layanan Rp 1.000</p>
                    </div>
                    <div className="w-5 h-5 rounded-full border border-slate-300 bg-slate-50"></div>
                  </label>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-500 text-sm">Subtotal</span>
                  <span className="font-semibold text-slate-800 text-sm">Rp 899.000</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-emerald-600 font-medium text-sm">Promo (LAUNCH20)</span>
                  <span className="font-semibold text-emerald-600 text-sm">-Rp 179.800</span>
                </div>
                <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                  <span className="font-bold text-slate-800">Total Tagihan</span>
                  <span className="font-bold text-indigo-700 text-xl">Rp 719.200</span>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Bukti Pembayaran</p>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors">
                  <UploadCloud size={24} className="text-slate-400 mb-2" />
                  <p className="text-xs font-bold text-slate-700 mb-1">Klik atau seret file ke sini</p>
                  <p className="text-[10px] text-slate-500">JPG, PNG, atau PDF (Max 5MB)</p>
                </div>
              </div>

              <Link to="/pembayaran-berhasil">
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md">
                  <Lock size={16} /> Konfirmasi & Aktifkan
                </button>
              </Link>
              <p className="text-center text-[10px] text-slate-500 mt-4">Pembayaran aman & terenkripsi oleh <span className="font-bold text-slate-700">Stripe Secure</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BellIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>; }
function CheckCircleIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>; }
