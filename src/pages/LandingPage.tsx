import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Check, 
  Star, 
  Smartphone, 
  Sparkles, 
  Shield, 
  Bell, 
  Clock, 
  DollarSign 
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FC] font-sans text-slate-900 flex flex-col">
      
      {/* 1. Header / Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-indigo-50 border border-indigo-100">
            <img src="/logo.png" alt="TepatWaktu Logo" className="w-[160%] h-[160%] max-w-none object-contain" />
          </div>
          <span className="text-base font-extrabold text-indigo-700 tracking-tight">
            TEPATWAKTU
          </span>
        </div>
        
        <Link 
          to="/login" 
          className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-md shadow-indigo-600/10"
        >
          Masuk
        </Link>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-8 pb-12 px-5 bg-gradient-to-b from-[#fcf8ff] to-[#F8F9FC] overflow-hidden flex flex-col items-center text-center">
        {/* Abstract shapes behind */}
        <div className="absolute top-10 right-4 w-32 h-32 bg-indigo-200/30 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-4 -left-8 w-24 h-24 bg-violet-200/35 rounded-full blur-2xl -z-10" />

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100/60 text-indigo-600 text-[10px] font-extrabold uppercase tracking-wider mb-4">
          <span>✦</span> APLIKASI ASISTEN SIKLUS HIDUP
        </div>

        <h1 className="text-[25px] font-black text-slate-900 tracking-tight leading-tight mb-3 px-1">
          Asisten Siklus Hidup Terbaik untuk <span className="text-indigo-600">Hidup Pintar</span> Anda
        </h1>

        <p className="text-xs text-slate-500 max-w-[320px] leading-relaxed mb-6">
          Kelola kerusakan, manajemen aset, batas jadwal pembuatan, dan dapatkan alat organisasi produktif yang dirancang untuk gaya hidup modern.
        </p>

        <Link 
          to="/register" 
          className="w-full max-w-[280px] bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold py-3.5 px-6 rounded-2xl text-xs transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2"
        >
          Mulai Sekarang
          <ArrowRight size={14} className="stroke-[2.5]" />
        </Link>

        {/* CSS-rendered Premium Phone Mockup */}
        <div className="mt-8 w-full max-w-[260px] bg-slate-900 p-2.5 rounded-[36px] shadow-2xl border-4 border-slate-800 relative">
          {/* Speaker & camera slot */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-slate-800 rounded-full flex items-center justify-center z-20">
            <div className="w-1.5 h-1.5 bg-slate-900 rounded-full mr-2" />
            <div className="w-6 h-0.5 bg-slate-700 rounded-full" />
          </div>

          {/* Screen area */}
          <div className="bg-[#F8F9FC] rounded-[28px] overflow-hidden pt-7 pb-4 px-3 flex flex-col text-left border border-slate-700/30">
            {/* App Mockup Header */}
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-[9px] text-slate-400 font-medium">Selamat Datang,</p>
                <p className="text-[11px] text-slate-800 font-bold">Rafa M. Fathi</p>
              </div>
              <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100">
                <Bell size={10} className="text-indigo-600" />
              </div>
            </div>

            {/* Micro Dashboard Card */}
            <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-md relative overflow-hidden mb-3.5">
              <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-indigo-500/30 rounded-full" />
              <p className="text-[8px] text-indigo-100 font-bold uppercase tracking-wider mb-0.5">PREMIUM MEMBER</p>
              <p className="text-xs font-bold">Resi & Garansi Aman</p>
              <div className="mt-2 flex justify-between items-center text-[9px] text-indigo-100">
                <span>9 Reminder Aktif</span>
                <span className="bg-white/20 px-1.5 py-0.5 rounded-md font-bold">PRO</span>
              </div>
            </div>

            {/* Mock Item List */}
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Reminder Terdekat</p>
            <div className="space-y-2">
              {/* Item 1 */}
              <div className="bg-white p-2 rounded-xl border border-gray-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
                    <DollarSign size={12} className="text-red-500" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-800 leading-tight">Tagihan Listrik</p>
                    <p className="text-[8px] text-slate-400 leading-none">Rp 350.000</p>
                  </div>
                </div>
                <span className="bg-red-50 text-red-600 text-[8px] font-bold px-1.5 py-0.5 rounded">H-2</span>
              </div>

              {/* Item 2 */}
              <div className="bg-white p-2 rounded-xl border border-gray-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
                    <Clock size={12} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-800 leading-tight">Pajak Kendaraan</p>
                    <p className="text-[8px] text-slate-400 leading-none">Rp 420.000</p>
                  </div>
                </div>
                <span className="bg-orange-50 text-orange-600 text-[8px] font-bold px-1.5 py-0.5 rounded">H-5</span>
              </div>

              {/* Item 3 */}
              <div className="bg-white p-2 rounded-xl border border-gray-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <Check size={12} className="text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-800 leading-tight">Servis Rutin AC</p>
                    <p className="text-[8px] text-slate-400 leading-none">Rekomendasi Bulanan</p>
                  </div>
                </div>
                <span className="bg-emerald-50 text-emerald-600 text-[8px] font-bold px-1.5 py-0.5 rounded">Besok</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Section ("Fitur Kami") */}
      <section className="py-12 px-5 bg-white border-y border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Fitur Kami</h2>
          <p className="text-xs text-slate-500 max-w-[280px] mx-auto mt-1.5 leading-relaxed">
            Nikmati rangkaian alat cerdas yang dirancang untuk menghindari keterlambatan dan kelalaian dalam kehidupan sehari-hari Anda.
          </p>
        </div>

        <div className="space-y-4">
          {/* Feature 1 */}
          <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100/50 flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
              <Smartphone className="text-indigo-600" size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-1">Desain UI Sempurna</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Antarmuka yang dibuat dengan cermat memprioritaskan kejelasan, kemudahan penggunaan, dan estetika premium.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-violet-50/50 p-5 rounded-2xl border border-violet-100/50 flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
              <Sparkles className="text-violet-600" size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-1">Otomasi Cerdas</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Mesin cerdas kami memprediksi kebutuhan pemeliharaan sebelum menjadi masalah yang mendesak.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100/50 flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
              <Shield className="text-blue-600" size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-1">Keamanan Cloud</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Dekripsi tingkat perusahaan menjaga data siklus hidup Anda tetap aman, terenkripsi, dan selalu dapat diakses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Showcase Section */}
      <section className="py-12 px-5 bg-gradient-to-b from-[#F8F9FC] to-white relative overflow-hidden flex flex-col items-center">
        <div className="absolute top-24 -right-12 w-32 h-32 bg-indigo-100 rounded-full blur-2xl -z-10" />

        {/* Tilted Screen Mockup */}
        <div className="w-full max-w-[240px] bg-slate-900 p-2 rounded-[32px] shadow-xl border-2 border-slate-800 rotate-[-4deg] mb-8">
          <div className="bg-[#1e1b4b] rounded-[24px] overflow-hidden pt-5 pb-3 px-3 border border-indigo-900/50 text-white">
            <div className="flex justify-between items-center mb-3">
              <div className="w-4 h-4 rounded bg-indigo-500/20" />
              <div className="w-12 h-2 bg-indigo-500/20 rounded-full" />
              <div className="w-4 h-4 rounded-full bg-indigo-500/20" />
            </div>
            <div className="border border-indigo-500/20 rounded-xl p-2.5 bg-indigo-950/40 backdrop-blur-md mb-2">
              <p className="text-[7px] text-indigo-300 font-bold uppercase tracking-widest mb-0.5">PREDIKSI BIAYA</p>
              <p className="text-sm font-black text-indigo-200">Estimasi Pengeluaran</p>
              <div className="mt-1 h-8 flex items-end gap-1">
                <div className="flex-1 bg-indigo-500/30 rounded-sm h-[40%]" />
                <div className="flex-1 bg-indigo-500/40 rounded-sm h-[60%]" />
                <div className="flex-1 bg-indigo-400 rounded-sm h-[90%]" />
                <div className="flex-1 bg-indigo-500/50 rounded-sm h-[50%]" />
                <div className="flex-1 bg-indigo-500/70 rounded-sm h-[75%]" />
              </div>
            </div>
            <p className="text-[8px] text-indigo-300/80 leading-relaxed text-center">Data dienkripsi secara real-time</p>
          </div>
        </div>

        <div className="text-left w-full">
          <h2 className="text-lg font-black text-slate-900 leading-snug mb-3">
            Solusi Mudah & Sempurna Untuk Aplikasi Bisnis Anda
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed mb-5">
            TEPATWAKTU mengubah cara Anda menangani tugas rutin. Dari perawatan kendaraan, tagihan rumah, atau pemeriksaan kesehatan, kami menyatukan semuanya dalam satu dasbor terpadu.
          </p>

          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100">
                <Check size={10} className="text-indigo-600" />
              </div>
              <span className="text-[11px] font-bold text-slate-700">Pengenalan data otomatis untuk semua jenis aset</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100">
                <Check size={10} className="text-indigo-600" />
              </div>
              <span className="text-[11px] font-bold text-slate-700">Analisa prediksi untuk biaya pemeliharaan</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works Section */}
      <section className="py-12 px-5 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl -z-10" />

        <div className="text-center mb-8">
          <h2 className="text-lg font-black tracking-tight">Bagaimana Aplikasi Ini Bekerja?</h2>
          <p className="text-xs text-slate-400 max-w-[280px] mx-auto mt-1.5">
            Tiga langkah mudah untuk mengontrol waktu dan kelola seluruh jadwal hidup Anda.
          </p>
        </div>

        <div className="space-y-6 mb-8">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-black text-white shrink-0 shadow-lg shadow-indigo-600/30">
              1
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-200 mb-1">Buat Profil</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Semua proses onboarding sederhana untuk mengatur preferensi dan mengidentifikasi aset utama Anda.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-black text-white shrink-0 shadow-lg shadow-indigo-600/30">
              2
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-200 mb-1">Unduh Gratis</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Dapatkan akses secara instan fitur inti tanpa biaya apapun sama sekali.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-black text-white shrink-0 shadow-lg shadow-indigo-600/30">
              3
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-200 mb-1">Nikmati Aplikasi</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Jalan hidup bebas stres sementara kami mengawasi siklus pemeliharaan Anda.
              </p>
            </div>
          </div>
        </div>

        {/* Micro Glassmorphic Client Element */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Aktivitas Terkini</span>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="space-y-2">
            {[
              { name: 'Doni Sendi', role: 'Premium Aset', amount: 'Rp 22.359' },
              { name: 'Dea Sila', role: 'Pengingat Standar', amount: 'Rp 40.234' },
              { name: 'Khrisdiana', role: 'Servis Kendaraan', amount: 'Rp 14.876' }
            ].map((client, idx) => (
              <div key={idx} className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0 last:pb-0">
                <div>
                  <p className="text-[10px] font-bold text-slate-200 leading-none">{client.name}</p>
                  <p className="text-[8px] text-slate-400 leading-none mt-0.5">{client.role}</p>
                </div>
                <span className="text-[10px] font-bold text-indigo-300">{client.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Pricing Section ("Pilih Paket Anda") */}
      <section className="py-12 px-5 bg-gradient-to-b from-white to-[#F8F9FC] border-b border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Pilih Paket Anda</h2>
          <p className="text-xs text-slate-500 max-w-[280px] mx-auto mt-1.5 leading-relaxed">
            Buka potensi penuh dengan paket fleksibel kami yang dirancang untuk setiap kebutuhan.
          </p>
        </div>

        <div className="space-y-6">
          {/* Plan 1: Basic */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative">
            <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Basic</p>
            <p className="text-[10px] text-slate-400 mb-2">Untuk penggunaan personal pribadi</p>
            <p className="text-2xl font-black text-slate-900 mb-4">Rp 0 <span className="text-xs font-normal text-slate-400">/ selamanya</span></p>
            
            <div className="space-y-2 mb-6 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Check size={12} className="text-emerald-500 shrink-0" />
                <span>Maksimal 5 reminder aktif</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={12} className="text-emerald-500 shrink-0" />
                <span>Notifikasi Email & App</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={12} className="text-emerald-500 shrink-0" />
                <span>Statistik Dasar</span>
              </div>
            </div>

            <Link 
              to="/register" 
              className="block w-full border border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-bold py-2.5 rounded-xl text-xs text-center transition-all"
            >
              Paket Saat Ini
            </Link>
          </div>

          {/* Plan 2: Premium (Highlighted) */}
          <div className="bg-indigo-700 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[8px] font-extrabold px-3 py-1 rounded-bl-xl tracking-wider">
              POPULER
            </div>
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-indigo-600 rounded-full blur-xl -z-0 opacity-40" />

            <p className="text-xs font-black text-indigo-200 uppercase tracking-wider mb-1">Premium</p>
            <p className="text-[10px] text-indigo-200 mb-2">Solusi siklus hidup lengkap</p>
            <p className="text-2xl font-black text-white mb-4">Rp 49k <span className="text-xs font-normal text-indigo-200">/ bulan</span></p>
            
            <div className="space-y-2 mb-6 text-xs text-indigo-100 relative z-10">
              <div className="flex items-center gap-2">
                <Star size={12} className="text-yellow-400 fill-yellow-400 shrink-0" />
                <span>Reminder Tanpa Batas</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={12} className="text-white shrink-0" />
                <span>WhatsApp Prioritas</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={12} className="text-white shrink-0" />
                <span>Upload Dokumen (Legal/Pajak)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={12} className="text-white shrink-0" />
                <span>Backup Cloud & Enkripsi</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={12} className="text-white shrink-0" />
                <span>Statistik & Insight Lengkap</span>
              </div>
            </div>

            <Link 
              to="/register" 
              className="block w-full bg-white hover:bg-slate-50 text-indigo-700 font-bold py-2.5 rounded-xl text-xs text-center transition-all shadow-md relative z-10"
            >
              Tingkatkan Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Developer Team Section */}
      <section className="py-12 px-5 bg-white">
        <div className="text-center mb-8">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Tim Pengembang</h2>
          <p className="text-xs text-slate-500 max-w-[280px] mx-auto mt-1.5 leading-relaxed">
            Kami orang-orang industri terbaik TEPATWAKTU yang berdedikasi untuk memberikan pengalaman terbaik bagi Anda.
          </p>
        </div>

        {/* 2x2 Responsive Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Muhammad Fathi Rafa */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm mb-3">MR</div>
            <p className="text-xs font-bold text-slate-800 leading-tight mb-0.5">Muhammad Fathi Rafa</p>
            <p className="text-[9px] text-slate-400 font-semibold mb-3">Technical</p>
            <div className="flex gap-2">
              <a href="https://www.instagram.com/mfathirafa_/" target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-full bg-white hover:bg-pink-50 border border-slate-200 hover:border-pink-200 flex items-center justify-center cursor-pointer transition-colors" title="Instagram">
                <svg className="w-2.5 h-2.5 text-slate-500 hover:text-pink-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://github.com/mfathirafa" target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-full bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center cursor-pointer transition-colors" title="GitHub">
                <svg className="w-2.5 h-2.5 text-slate-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Eduardo Bagus Prima Julian */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm mb-3">EJ</div>
            <p className="text-xs font-bold text-slate-800 leading-tight mb-0.5">Eduardo Bagus Prima Julian</p>
            <p className="text-[9px] text-slate-400 font-semibold mb-3">Creative</p>
            <div className="flex gap-2">
              <a href="https://www.instagram.com/eiidhize_y/" target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-full bg-white hover:bg-pink-50 border border-slate-200 hover:border-pink-200 flex items-center justify-center cursor-pointer transition-colors" title="Instagram">
                <svg className="w-2.5 h-2.5 text-slate-500 hover:text-pink-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://github.com/eduardobagus" target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-full bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center cursor-pointer transition-colors" title="GitHub">
                <svg className="w-2.5 h-2.5 text-slate-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Fajar Budiawan */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm mb-3">FB</div>
            <p className="text-xs font-bold text-slate-800 leading-tight mb-0.5">Fajar Budiawan</p>
            <p className="text-[9px] text-slate-400 font-semibold mb-3">Administrator</p>
            <div className="flex gap-2">
              <a href="https://www.instagram.com/pajjaarrrr/" target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-full bg-white hover:bg-pink-50 border border-slate-200 hover:border-pink-200 flex items-center justify-center cursor-pointer transition-colors" title="Instagram">
                <svg className="w-2.5 h-2.5 text-slate-500 hover:text-pink-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://github.com/FajarBudiawan" target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-full bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center cursor-pointer transition-colors" title="GitHub">
                <svg className="w-2.5 h-2.5 text-slate-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Ung PengSeng */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm mb-3">UP</div>
            <p className="text-xs font-bold text-slate-800 leading-tight mb-0.5">Ung PengSeng</p>
            <p className="text-[9px] text-slate-400 font-semibold mb-3">Business</p>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="bg-slate-50 border-t border-slate-100 px-5 py-8 text-center flex flex-col items-center">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg overflow-hidden flex items-center justify-center bg-indigo-50 border border-indigo-100">
            <img src="/logo.png" alt="TepatWaktu Logo" className="w-[160%] h-[160%] max-w-none object-contain" />
          </div>
          <span className="text-xs font-black text-indigo-700 tracking-tight">TEPATWAKTU</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed max-w-[240px] mb-4">
          Mendigitalisasi cara Anda mengelola aset & waktu. Asisten digital utama bagi konsumen modern.
        </p>
        <p className="text-[9px] text-slate-400">
          © {new Date().getFullYear()} TepatWaktu. All rights reserved.
        </p>
      </footer>

    </div>
  );
}