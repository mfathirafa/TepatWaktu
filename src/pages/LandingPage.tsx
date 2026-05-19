import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-extrabold text-indigo-800 tracking-tight">
                ResiKu
              </Link>
            </div>
            
            {/* Menu Center */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
              <Link to="/" className="text-indigo-700 border-b-2 border-indigo-700 py-7">
                Beranda
              </Link>
              <Link to="/scan" className="hover:text-indigo-700 py-7 transition-colors">
                Pindai Struk
              </Link>
              <Link to="/warranties" className="hover:text-indigo-700 py-7 transition-colors">
                Garansi
              </Link>
            </nav>

            {/* Actions Right */}
            <div className="flex items-center gap-4">
              <Link to="/login" className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2.5 rounded-full text-sm font-bold transition-colors">
                Masuk
              </Link>
              <Link to="/register" className="bg-[#1D4ED8] hover:bg-blue-800 text-white px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-colors shadow-sm">
                DAFTAR
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden bg-[#F5F5F5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              
              {/* Kiri: Teks */}
              <div className="text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/60 text-emerald-600 text-xs font-bold uppercase tracking-widest mb-6">
                  <span className="text-emerald-500">✦</span> KURATOR DIGITAL ANDA
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
                  Brankas digital untuk <span className="text-[#1D4ED8]">struk</span> dan garansi.
                </h1>
                <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed">
                  Ubah tumpukan struk kertas Anda menjadi galeri digital yang mewah. Pindai, lacak, dan lindungi pembelian Anda dengan ResiKu.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-[#1D4ED8] hover:bg-blue-800 text-white rounded-full font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-blue-600/30 transition-all flex items-center justify-center gap-2">
                    MULAI SEKARANG <span>→</span>
                  </Link>
                  <Link to="/#cara-kerja" className="w-full sm:w-auto px-6 py-4 text-slate-700 hover:text-slate-900 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2">
                    <span className="text-lg leading-none border-2 border-slate-700 rounded-full w-5 h-5 flex items-center justify-center text-[10px]">▶</span> Lihat Cara Kerjanya
                  </Link>
                </div>
              </div>

              {/* Kanan: Mockup / Ilustrasi */}
              <div className="relative mt-12 md:mt-0">
                <div className="bg-white p-3 rounded-[2rem] shadow-2xl relative">
                  <div className="bg-gradient-to-br from-red-900 to-red-800 w-full aspect-[4/3] rounded-[1.5rem] relative overflow-hidden flex items-center justify-center border-2 border-slate-900">
                    {/* Abstrak Frame di belakang */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-8 border-red-700/50 rounded-2xl z-0"></div>
                    
                    {/* Placeholder Struk */}
                    <div className="w-32 h-48 bg-white shadow-2xl transform rotate-3 flex flex-col p-3 rounded-sm border border-slate-200 z-10 relative">
                       {/* Edge Struk bergigi */}
                       <div className="absolute -top-1 left-0 w-full h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjQiPjxwb2x5Z29uIHBvaW50cz0iMCwwIDQsNCA4LDAiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]"></div>
                       
                       <div className="w-full h-2 bg-slate-200 mb-2 rounded mt-2"></div>
                       <div className="w-2/3 h-2 bg-slate-200 mb-4 rounded"></div>
                       <div className="border-b-2 border-dashed border-slate-300 mb-4"></div>
                       <div className="w-full flex justify-between mb-2"><div className="w-10 h-1 bg-slate-200"></div><div className="w-6 h-1 bg-slate-300"></div></div>
                       <div className="w-full flex justify-between mb-2"><div className="w-12 h-1 bg-slate-200"></div><div className="w-8 h-1 bg-slate-300"></div></div>
                       <div className="w-full flex justify-between mb-4"><div className="w-8 h-1 bg-slate-200"></div><div className="w-10 h-1 bg-slate-300"></div></div>
                       <div className="mt-auto border-t-2 border-slate-800 pt-2 flex justify-between"><div className="w-8 h-1.5 bg-slate-800"></div><div className="w-10 h-1.5 bg-slate-800"></div></div>
                    </div>
                    
                    {/* Ilustrasi Tangan (Abstrak) */}
                    <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-slate-900 rounded-tr-[4rem] z-20 flex items-start justify-end rotate-12">
                      <div className="w-16 h-24 bg-amber-200 rounded-t-full -mt-4 mr-8 -rotate-12 border-2 border-slate-900"></div>
                    </div>
                  </div>

                  {/* Floating AI Badge */}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-100 flex items-center gap-4 z-30">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">VERIFIKASI AI</p>
                      <p className="font-bold text-slate-800 text-sm">Struk Berhasil Diproses</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-6">Mengelola riwayat belanja Anda</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">Lebih dari sekadar penyimpanan—kami mengubah data Anda menjadi wawasan berharga untuk perlindungan aset jangka panjang.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 hover:shadow-xl transition-shadow group">
                <div className="text-4xl mb-6 bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-md text-indigo-600 group-hover:scale-110 transition-transform">
                  🧾
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Scan & Simpan Struk</h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Foto struk belanjamu dan biarkan sistem menyimpannya. Tidak ada lagi struk fisik yang pudar, kusut, atau hilang saat dibutuhkan untuk klaim.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-orange-50 p-10 rounded-3xl border border-orange-100 hover:shadow-xl transition-shadow group">
                <div className="text-4xl mb-6 bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-md text-orange-500 group-hover:scale-110 transition-transform">
                  🔔
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Pantau Garansi</h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Catat masa berlaku dan dapatkan notifikasi pengingat otomatis sebelum garansimu habis. Klaim jadi jauh lebih mudah dan tepat waktu.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-emerald-50 p-10 rounded-3xl border border-emerald-100 hover:shadow-xl transition-shadow group">
                <div className="text-4xl mb-6 bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-md text-emerald-500 group-hover:scale-110 transition-transform">
                  🤝
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Sertifikat Jual Digital</h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Tingkatkan nilai jual barang preloved kamu dengan bukti riwayat kepemilikan dan garansi yang valid, siap dibagikan ke calon pembeli.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-extrabold mb-6">Cara Kerja yang Sangat Mudah</h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">Tiga langkah sederhana untuk mendigitalisasi dan mengamankan aset Anda hari ini.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Connecting Line */}
              <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-1 bg-slate-800 z-0 rounded-full"></div>

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-3xl font-bold border-8 border-slate-900 mb-8 shadow-2xl">
                  1
                </div>
                <h3 className="text-2xl font-bold mb-4">Upload Struk</h3>
                <p className="text-slate-400 text-lg">Ambil foto atau upload file struk pembelian barang berharga kamu ke dalam sistem ResiKu.</p>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-3xl font-bold border-8 border-slate-900 mb-8 shadow-2xl">
                  2
                </div>
                <h3 className="text-2xl font-bold mb-4">Atur Info Garansi</h3>
                <p className="text-slate-400 text-lg">Masukkan detail produk dan masa berlaku garansi agar sistem dapat mulai melakukan pemantauan.</p>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-3xl font-bold border-8 border-slate-900 mb-8 shadow-2xl">
                  3
                </div>
                <h3 className="text-2xl font-bold mb-4">Pantau & Notifikasi</h3>
                <p className="text-slate-400 text-lg">Tenang saja, kami akan mengingatkan kamu secara otomatis saat masa garansi hampir habis.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden bg-indigo-700">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8 leading-tight">Siap untuk mengelola hidup Anda?</h2>
            <p className="text-xl text-indigo-100 mb-12 max-w-3xl mx-auto">Bergabunglah dengan ribuan pengguna lain yang telah mendigitalisasi jejak kertas mereka bersama ResiKu. Gratis untuk selamanya.</p>
            <Link to="/register" className="inline-block px-12 py-5 bg-white text-indigo-700 rounded-full font-bold text-xl shadow-2xl hover:bg-slate-50 transition-all transform hover:-translate-y-1">
              Mulai sekarang, gratis!
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 text-2xl font-bold text-slate-800 mb-2">
              <span>📦</span> ResiKu
            </div>
            <p className="text-slate-500 text-sm text-center md:text-left max-w-xs">
              Mendigitalisasi cara Anda mengelola aset materi. Brankas digital utama bagi konsumen modern.
            </p>
          </div>
          <div className="text-slate-500 text-sm font-medium">
            <p>© {new Date().getFullYear()} ResiKu. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}