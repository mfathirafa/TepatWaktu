import { useState, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';

export default function ScanPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // File states
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'Elektronik',
    purchase_date: new Date().toISOString().split('T')[0],
    price: '',
    duration_months: '12',
    notes: ''
  });

  // Calculate Expiry Date
  const expiryDate = useMemo(() => {
    if (!formData.purchase_date || !formData.duration_months) return null;
    const date = new Date(formData.purchase_date);
    date.setMonth(date.getMonth() + parseInt(formData.duration_months || '0'));
    return date;
  }, [formData.purchase_date, formData.duration_months]);

  const handleFileChange = (selectedFile: File) => {
    setError('');
    
    // Validasi tipe file
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Format file tidak didukung. Gunakan JPG, PNG, atau PDF.');
      return;
    }

    // Validasi ukuran (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('Ukuran file terlalu besar. Maksimal 5MB.');
      return;
    }

    setFile(selectedFile);

    // Buat preview jika berupa gambar
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null); // PDF tidak ada image preview sederhana
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format angka sederhana untuk tampilan (hapus non-digit)
    const rawValue = e.target.value.replace(/\D/g, '');
    if (!rawValue) {
      setFormData({ ...formData, price: '' });
      return;
    }
    
    // Format as Rupiah (e.g., 1000000 -> 1.000.000)
    const formatted = new Intl.NumberFormat('id-ID').format(parseInt(rawValue));
    setFormData({ ...formData, price: formatted });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Silakan unggah foto atau file struk terlebih dahulu.');
      return;
    }
    if (!user) {
      setError('Anda harus masuk untuk menambahkan aset.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // 1. Upload File ke Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload Error Details:', uploadError);
        throw new Error('Gagal mengunggah file struk. Pastikan bucket "receipts" sudah tersedia dan RLS policy diatur dengan benar.');
      }

      const { data: urlData } = supabase.storage.from('receipts').getPublicUrl(fileName);
      const fileUrl = urlData.publicUrl;

      // 2. Insert Aset
      const rawPrice = parseInt(formData.price.replace(/\D/g, '')) || 0;
      
      const { data: assetData, error: assetError } = await supabase
        .from('assets')
        .insert({
          user_id: user.id,
          name: formData.name,
          brand: formData.brand || null,
          category: formData.category,
          purchase_date: formData.purchase_date,
          price: rawPrice,
          notes: formData.notes || null
        })
        .select()
        .single();

      if (assetError) throw assetError;

      // 3. Insert Resi/Struk
      const { error: receiptError } = await supabase
        .from('receipts')
        .insert({
          asset_id: assetData.id,
          file_url: fileUrl,
          file_type: file.type
        });

      if (receiptError) throw receiptError;

      // 4. Insert Garansi
      if (expiryDate) {
        const { error: warrantyError } = await supabase
          .from('warranties')
          .insert({
            asset_id: assetData.id,
            expiry_date: expiryDate.toISOString().split('T')[0],
            duration_months: parseInt(formData.duration_months),
            status: 'active'
          });

        if (warrantyError) throw warrantyError;
      }

      // Berhasil, redirect ke dashboard
      navigate('/dashboard');

    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat memproses data. Silakan coba lagi.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navbar (Identik dengan Dashboard) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold text-indigo-700">
                <span>📦</span> ResiKu
              </Link>
              
              <nav className="hidden md:flex gap-6">
                <Link to="/dashboard" className="text-slate-500 hover:text-slate-900 font-medium px-1 py-5 transition-colors">Dashboard</Link>
                <Link to="/warranties" className="text-slate-500 hover:text-slate-900 font-medium px-1 py-5 transition-colors">Garansi</Link>
                <Link to="/notifications" className="text-slate-500 hover:text-slate-900 font-medium px-1 py-5 transition-colors">Notifikasi</Link>
                <Link to="/profile" className="text-slate-500 hover:text-slate-900 font-medium px-1 py-5 transition-colors">Profil</Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-sm font-medium text-slate-700">
                Halo, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold flex items-center gap-1 mb-4">
            &larr; Kembali ke Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900">Digitalkan Aset Anda</h1>
          <p className="text-slate-500 mt-2 text-lg">Unggah struk fisik Anda dan lengkapi detail garansi untuk mulai memantau perlindungannya.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-center gap-3">
            <span className="text-lg">⚠️</span> {error}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Kolom Kiri: Upload Area & Preview */}
          <div className="space-y-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`
                relative border-2 border-dashed rounded-3xl overflow-hidden cursor-pointer transition-all duration-200
                ${isDragOver ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50'}
                ${file ? 'h-96' : 'h-80 flex flex-col items-center justify-center'}
              `}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
                accept="image/jpeg,image/png,application/pdf"
                className="hidden"
              />

              {file ? (
                preview ? (
                  <img src={preview} alt="Preview Struk" className="w-full h-full object-contain bg-slate-900" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-500">
                    <span className="text-5xl mb-4">📄</span>
                    <p className="font-medium text-lg">{file.name}</p>
                    <p className="text-sm mt-1">Dokumen PDF Terpilih</p>
                  </div>
                )
              ) : (
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                    📸
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">Unggah Struk Belanja</h3>
                  <p className="text-slate-500 mb-6">Drag & drop file di sini, atau klik untuk memilih file</p>
                  <span className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 shadow-sm">
                    Pilih File dari Perangkat
                  </span>
                  <p className="text-xs text-slate-400 mt-6">Format didukung: JPG, PNG, PDF (Maks. 5MB)</p>
                </div>
              )}
            </div>

            {/* Panduan Area */}
            {!file && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Panduan Pemindaian</h4>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">☀️</div>
                  <div>
                    <h5 className="font-bold text-slate-700 text-sm">Pencahayaan Baik</h5>
                    <p className="text-xs text-slate-500 mt-1">Hindari bayangan dan pantulan cahaya pada kertas struk untuk keterbacaan yang optimal.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">📐</div>
                  <div>
                    <h5 className="font-bold text-slate-700 text-sm">Cakup Seluruh Bagian</h5>
                    <p className="text-xs text-slate-500 mt-1">Pastikan keempat sudut struk terlihat jelas dan teks tidak terpotong di dalam bingkai.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Kolom Kanan: Form Detail Aset */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Detail Aset & Garansi</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">NAMA ASET <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Contoh: MacBook Pro 14 M2"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors outline-none text-slate-700 placeholder-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">BRAND / MEREK</label>
                  <input 
                    type="text" 
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    placeholder="Contoh: Apple"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors outline-none text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">KATEGORI</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors outline-none text-slate-700"
                  >
                    <option value="Elektronik">Elektronik</option>
                    <option value="Furnitur">Furnitur</option>
                    <option value="Kendaraan">Kendaraan</option>
                    <option value="Pakaian">Pakaian</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">TANGGAL PEMBELIAN <span className="text-rose-500">*</span></label>
                  <input 
                    type="date" 
                    required
                    value={formData.purchase_date}
                    onChange={(e) => setFormData({...formData, purchase_date: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors outline-none text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">HARGA (RP)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-slate-400 font-medium">Rp</span>
                    <input 
                      type="text" 
                      value={formData.price}
                      onChange={handlePriceChange}
                      placeholder="0"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors outline-none text-slate-700"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">DURASI GARANSI (BULAN) <span className="text-rose-500">*</span></label>
                <div className="flex items-center gap-4">
                  <input 
                    type="number" 
                    min="1"
                    required
                    value={formData.duration_months}
                    onChange={(e) => setFormData({...formData, duration_months: e.target.value})}
                    className="w-24 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors outline-none text-slate-700 text-center font-bold"
                  />
                  {expiryDate && (
                    <div className="flex-1 bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl text-sm font-semibold border border-emerald-100 flex items-center gap-2">
                      <span>🛡️</span> Garansi berlaku hingga: {expiryDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">CATATAN TAMBAHAN</label>
                <textarea 
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Misal: Nomor serial produk, nama toko, dll."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors outline-none text-slate-700 placeholder-slate-400 resize-none"
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting || !file}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Menyimpan Aset...
                    </>
                  ) : (
                    <>
                      <span>💾</span> Simpan Aset & Garansi
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 px-6 py-3 flex justify-between items-center">
        <Link to="/dashboard" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
          <span className="text-xl">📊</span>
          <span className="text-[10px] font-semibold">Beranda</span>
        </Link>
        <Link to="/warranties" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
          <span className="text-xl">🛡️</span>
          <span className="text-[10px] font-semibold">Garansi</span>
        </Link>
        <Link to="/scan" className="flex flex-col items-center gap-1 text-white bg-indigo-600 w-12 h-12 rounded-full justify-center shadow-lg -mt-8 border-4 border-slate-50">
          <span className="text-2xl">+</span>
        </Link>
        <Link to="/notifications" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
          <span className="text-xl">🔔</span>
          <span className="text-[10px] font-semibold">Notif</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
          <span className="text-xl">👤</span>
          <span className="text-[10px] font-semibold">Profil</span>
        </Link>
      </nav>
      <div className="h-20 md:hidden"></div>
    </div>
  );
}