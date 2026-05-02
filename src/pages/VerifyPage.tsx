import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { formatDate, calculateDaysLeft, getWarrantyStatus } from '../lib/utils';

interface VerifyData {
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

export default function VerifyPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<VerifyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function verifyAsset() {
      if (!id) return;

      try {
        setIsLoading(true);
        // Note: Membutuhkan RLS Policy "Public can verify assets" & "Public can verify warranties"
        // di Supabase agar fungsi select public ini berhasil tanpa login.
        const { data: assetData, error: fetchError } = await supabase
          .from('assets')
          .select(`
            id, name, brand, category, purchase_date,
            warranties ( expiry_date, duration_months )
          `)
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        if (!assetData) throw new Error('Data tidak ditemukan');

        setData(assetData as unknown as VerifyData);
      } catch (err: any) {
        console.error('Error verifying asset:', err);
        setError('Sertifikat tidak valid atau tidak ditemukan di sistem kami.');
      } finally {
        setIsLoading(false);
      }
    }

    verifyAsset();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <svg className="animate-spin h-10 w-10 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        <p className="text-slate-500 font-medium">Memverifikasi keaslian di buku besar...</p>
      </div>
    );
  }

  // Jika error / data tidak ada
  if (error || !data || !data.warranties || data.warranties.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-2xl mb-8 font-bold">📦</div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-md w-full text-center">
          <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
            ❌
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Verifikasi Gagal</h1>
          <p className="text-slate-500 mb-6">{error || 'Data garansi tidak lengkap.'}</p>
          <div className="p-4 bg-slate-50 rounded-xl text-sm text-slate-600 border border-slate-100">
            Pastikan link verifikasi yang Anda buka sudah benar dan tidak terpotong.
          </div>
        </div>
      </div>
    );
  }

  const warranty = data.warranties[0];
  const status = getWarrantyStatus(warranty.expiry_date);
  const daysLeft = calculateDaysLeft(warranty.expiry_date);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      {/* Navbar Public Sederhana */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-center">
          <div className="flex items-center gap-2 text-xl font-bold text-indigo-700">
            <span>📦</span> ResiKu
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 mt-10">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden relative">
          
          {/* Header Status */}
          <div className={`p-8 text-center relative overflow-hidden ${
            status === 'expired' ? 'bg-rose-50' : status === 'expiring' ? 'bg-amber-50' : 'bg-emerald-50'
          }`}>
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl shadow-sm mb-4 ${
              status === 'expired' ? 'bg-white text-rose-500' : status === 'expiring' ? 'bg-white text-amber-500' : 'bg-white text-emerald-500'
            }`}>
              {status === 'expired' ? '⚠️' : '✅'}
            </div>
            <h2 className={`text-xl font-black uppercase tracking-widest ${
              status === 'expired' ? 'text-rose-700' : status === 'expiring' ? 'text-amber-700' : 'text-emerald-700'
            }`}>
              {status === 'expired' ? 'Garansi Kedaluwarsa' : status === 'expiring' ? 'Valid (Segera Expired)' : 'Valid & Terverifikasi'}
            </h2>
            <p className="text-slate-600 font-medium mt-2 max-w-md mx-auto">
              Dokumen ini secara resmi diverifikasi otentik oleh sistem buku besar ResiKu.
            </p>
          </div>

          <div className="p-8 sm:p-12">
            <h3 className="text-3xl font-extrabold text-slate-900 mb-2">{data.name}</h3>
            <p className="text-lg font-medium text-slate-500 mb-10">{data.brand || 'Tanpa Brand'} • {data.category}</p>

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between pb-6 border-b border-slate-100 gap-2">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">TANGGAL PEMBELIAN</span>
                <span className="font-bold text-slate-800 text-lg">{formatDate(data.purchase_date)}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between pb-6 border-b border-slate-100 gap-2">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">MASA BERLAKU GARANSI</span>
                <div className="sm:text-right">
                  <span className="font-bold text-slate-800 text-lg block">{formatDate(data.purchase_date)} — {formatDate(warranty.expiry_date)}</span>
                  <span className="text-sm font-medium text-slate-500">Durasi {warranty.duration_months} Bulan</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between pb-6 border-b border-slate-100 gap-2">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">SISA WAKTU GARANSI</span>
                <span className={`font-black text-xl ${
                  status === 'expired' ? 'text-rose-600' : status === 'expiring' ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                  {daysLeft > 0 ? `${daysLeft} Hari` : daysLeft === 0 ? 'Hari Ini' : 'Telah Berakhir'}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row justify-between pt-2 gap-2">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">ID VERIFIKASI ASET</span>
                <span className="font-mono text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                  {data.id}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900 p-6 text-center">
            <p className="text-slate-400 text-sm font-medium flex justify-center items-center gap-2">
              <span className="text-lg">🔒</span> Diamankan dengan Enkripsi ResiKu
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Ingin membuat sertifikat garansi digital untuk barang Anda sendiri? <br className="hidden sm:block"/>
            <a href="/" className="text-indigo-600 font-bold hover:underline">Gunakan ResiKu Sekarang →</a>
          </p>
        </div>
      </main>
    </div>
  );
}