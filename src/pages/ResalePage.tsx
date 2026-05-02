import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { formatDate, getWarrantyStatus } from '../lib/utils';

interface AssetData {
  id: string;
  name: string;
  brand: string;
  category: string;
  purchase_date: string;
  warranties: {
    expiry_date: string;
    duration_months: number;
  }[];
}

export default function ResalePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [asset, setAsset] = useState<AssetData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchAsset() {
      if (!user || !id) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('assets')
          .select(`
            id, name, brand, category, purchase_date,
            warranties ( expiry_date, duration_months )
          `)
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setAsset(data as unknown as AssetData);
      } catch (error) {
        console.error('Error fetching asset for resale:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAsset();
  }, [id, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <p className="text-slate-500 font-medium">Menyiapkan sertifikat...</p>
        </div>
      </div>
    );
  }

  if (!asset || !asset.warranties || asset.warranties.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-4xl mb-6">⚠️</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Sertifikat Tidak Tersedia</h2>
        <p className="text-slate-500 mb-8">Data garansi tidak ditemukan untuk aset ini.</p>
        <button onClick={() => navigate(-1)} className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl shadow-sm">Kembali</button>
      </div>
    );
  }

  const warranty = asset.warranties[0];
  const status = getWarrantyStatus(warranty.expiry_date);
  const verifyLink = `${window.location.origin}/verify/${asset.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(verifyLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const message = `Halo! Saya menjual ${asset.name}. Anda bisa memverifikasi keaslian garansinya melalui ResiKu di link berikut:\n\n${verifyLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 md:pb-0">
      {/* Navbar Identik Dashboard */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold text-indigo-700">
                <span>📦</span> ResiKu
              </Link>
              <nav className="hidden md:flex gap-6">
                <Link to="/dashboard" className="text-slate-500 hover:text-slate-900 font-medium px-1 py-5">Dashboard</Link>
                <Link to="/warranties" className="text-slate-500 hover:text-slate-900 font-medium px-1 py-5">Garansi</Link>
                <Link to="/notifications" className="text-slate-500 hover:text-slate-900 font-medium px-1 py-5">Notifikasi</Link>
              </nav>
            </div>
            <div className="hidden sm:block text-sm font-medium text-slate-700">
              Halo, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900">Sertifikat Jual Digital</h1>
          <p className="text-slate-500 mt-2">Bagikan bukti garansi ke calon pembeli untuk meningkatkan nilai jual.</p>
        </div>

        {/* Sertifikat Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden mb-8 relative">
          {/* Header Sertifikat */}
          <div className="bg-slate-900 px-8 py-10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500 rounded-full blur-3xl opacity-20 -ml-20 -mb-20"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 text-3xl font-bold text-white mb-6">
                <span>📦</span> ResiKu
              </div>
              <h2 className="text-sm tracking-[0.3em] font-bold text-indigo-300 mb-2">SERTIFIKAT GARANSI DIGITAL</h2>
              <h3 className="text-4xl font-extrabold text-white mb-4">{asset.name}</h3>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                <span className="text-indigo-200 text-sm font-medium">{asset.brand || 'Tanpa Brand'}</span>
                <span className="text-indigo-200">•</span>
                <span className="text-indigo-200 text-sm font-medium">{asset.category}</span>
              </div>
            </div>
          </div>

          {/* Body Sertifikat */}
          <div className="p-8 sm:p-12 relative">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <span className="text-9xl transform -rotate-12 font-black tracking-widest text-slate-900">RESIKU</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-8 relative z-10">
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Status Garansi</p>
                  <div className="inline-flex items-center gap-2">
                    {status === 'active' && <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 text-sm font-bold rounded-full">Valid & Aktif</span>}
                    {status === 'expiring' && <span className="px-4 py-1.5 bg-amber-100 text-amber-700 text-sm font-bold rounded-full">Valid (Segera Expired)</span>}
                    {status === 'expired' && <span className="px-4 py-1.5 bg-rose-100 text-rose-700 text-sm font-bold rounded-full">Telah Kedaluwarsa</span>}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Tanggal Pembelian</p>
                  <p className="text-lg font-bold text-slate-800">{formatDate(asset.purchase_date)}</p>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Masa Berlaku Garansi</p>
                  <p className="text-lg font-bold text-slate-800">{formatDate(asset.purchase_date)} — {formatDate(warranty.expiry_date)}</p>
                  <p className="text-sm font-medium text-slate-500 mt-1">({warranty.duration_months} Bulan)</p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="w-40 h-40 bg-white p-2 rounded-xl border border-slate-200 shadow-sm mb-4 flex items-center justify-center">
                  {/* Placeholder QR Code SVG */}
                  <svg className="w-full h-full text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                    <rect x="6" y="6" width="3" height="3" fill="currentColor" />
                    <rect x="15" y="6" width="3" height="3" fill="currentColor" />
                    <rect x="6" y="15" width="3" height="3" fill="currentColor" />
                  </svg>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 text-center">Scan untuk Verifikasi</p>
                <p className="text-xs font-medium text-indigo-600 text-center break-all w-full">{verifyLink}</p>
                <p className="text-[10px] text-slate-400 mt-2 font-mono break-all text-center">ID: {asset.id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm order-3 sm:order-1"
          >
            &larr; Kembali ke Detail
          </button>
          
          <button 
            onClick={handleCopy}
            className="px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 order-2"
          >
            {copied ? (
              <><span>✓</span> Disalin!</>
            ) : (
              <><span>🔗</span> Salin Link Verifikasi</>
            )}
          </button>

          <button 
            onClick={handleWhatsApp}
            className="px-6 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl transition-colors shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 order-1 sm:order-3"
          >
            <span>💬</span> Bagikan via WhatsApp
          </button>
        </div>

      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 px-6 py-3 flex justify-between items-center">
        <Link to="/dashboard" className="flex flex-col items-center gap-1 text-slate-400">
          <span className="text-xl">📊</span><span className="text-[10px] font-semibold">Beranda</span>
        </Link>
        <Link to="/warranties" className="flex flex-col items-center gap-1 text-indigo-600">
          <span className="text-xl">🛡️</span><span className="text-[10px] font-bold">Garansi</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center gap-1 text-slate-400">
          <span className="text-xl">👤</span><span className="text-[10px] font-semibold">Profil</span>
        </Link>
      </nav>
    </div>
  );
}