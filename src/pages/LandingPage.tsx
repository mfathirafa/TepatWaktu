import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-extrabold text-indigo-700 flex items-center gap-2">
                <span className="text-3xl">📦</span> ResiKu
              </Link>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/login" className="text-slate-600 hover:text-indigo-700 font-semibold transition-colors">
                Masuk
              </Link>
              <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-md hover:shadow-lg">
                Daftar
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold mb-8 border border-indigo-100 shadow-sm">
              ✨ Kurator Digital Anda
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-8">
              Simpan Struk, Pantau Garansi, <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                Jual dengan Aman
              </span>
            </h1>
            <p className="mt-4 text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-12">
              ResiKu adalah brankas digital untuk semua aset dan garansi kamu. Ubah tumpukan struk kertas menjadi galeri digital yang aman dan rapi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
                Mulai Gratis <span>→</span>
              </Link>
              <Link to="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-full font-bold text-lg shadow-sm transition-all flex items-center justify-center gap-2">
                <span>▶️</span> Lihat Demo
              </Link>
            </div>
          </div>
          
          {/* Decorative Background Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-100 rounded-full blur-3xl opacity-50 -z-10 pointer-events-none"></div>
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