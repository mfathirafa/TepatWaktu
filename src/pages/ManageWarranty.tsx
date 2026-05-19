import { useState } from 'react';
import { Plus, Trash2, UploadCloud } from 'lucide-react';
import { useWarranties } from '../hooks/useWarranties';
import { getUrgency, urgencyColor, formatDate, getDaysLeft } from '../types';
import type { AssetInsert, WarrantyInsert } from '../types';

const INPUT_CLS = 'w-full border border-slate-200 rounded-xl py-3 px-4 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500';

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-t-3xl p-6 w-full max-w-sm max-h-[85vh] overflow-y-auto">
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5" />
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function ManageWarranty() {
  const { assets, loading, addAsset, deleteAsset } = useWarranties();
  const [showModal, setShowModal] = useState(false);
  const [assetForm, setAssetForm] = useState<Partial<AssetInsert>>({});
  const [warrantyForm, setWarrantyForm] = useState<Partial<Omit<WarrantyInsert, 'asset_id'>>>({ status: 'active' });

  const expiring = assets.filter(a => a.warranties?.[0] && getDaysLeft(a.warranties[0].expiry_date) <= 30).length;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetForm.name || !warrantyForm.expiry_date) return;
    await addAsset(assetForm as AssetInsert, warrantyForm as Omit<WarrantyInsert, 'asset_id'>);
    setShowModal(false);
    setAssetForm({});
    setWarrantyForm({ status: 'active' });
  };

  return (
    <div className="min-h-full bg-slate-50 pb-4">
      {/* Header */}
      <div className="bg-gradient-to-br from-violet-600 to-indigo-700 px-5 pt-10 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-white text-xl font-bold font-heading">Garansi Aset</h1>
            <p className="text-violet-100 text-xs mt-0.5">Pantau masa berlaku garansi</p>
          </div>
          <button onClick={() => setShowModal(true)} className="p-2 bg-white/20 rounded-full text-white"><Plus size={18} /></button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 border border-white/20 text-center">
            <p className="text-violet-100 text-xs mb-1">Total Aset</p>
            <p className="text-white text-2xl font-bold">{assets.length}</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 border border-white/20 text-center">
            <p className="text-red-200 text-xs mb-1">Segera Berakhir</p>
            <p className={`text-2xl font-bold ${expiring > 0 ? 'text-red-300' : 'text-white'}`}>{expiring}</p>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-6 relative z-10">
        {loading ? (
          <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" /></div>
        ) : assets.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-100 mb-4">
            <div className="text-4xl mb-2">📱</div>
            <p className="font-semibold text-slate-700 text-sm">Belum ada aset terdaftar</p>
            <button onClick={() => setShowModal(true)} className="mt-3 text-indigo-600 font-bold text-xs hover:underline">+ Tambah sekarang</button>
          </div>
        ) : (
          <div className="space-y-3 mb-4">
            {assets.map(asset => {
              const warranty = asset.warranties?.[0];
              const days = warranty ? getDaysLeft(warranty.expiry_date) : 9999;
              const level = warranty ? getUrgency(warranty.expiry_date) : 'safe';
              const colors = urgencyColor(level);
              const totalDays = warranty?.duration_months ? warranty.duration_months * 30 : 365;
              const usedPct = warranty ? Math.min(100, Math.round(((totalDays - days) / totalDays) * 100)) : 0;
              return (
                <div key={asset.id} className={`bg-white rounded-2xl p-4 shadow-sm border ${colors.border}`}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-2xl shrink-0">📱</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-slate-800 text-sm">{asset.name}</h4>
                          {asset.brand && <p className="text-xs text-slate-400">{asset.brand}</p>}
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-1 rounded-full text-white ${colors.badge}`}>
                          {days <= 30 ? 'SEGERA' : days <= 90 ? 'MENENGAH' : 'AMAN'}
                        </span>
                      </div>
                    </div>
                  </div>
                  {warranty && (
                    <>
                      <div className="flex justify-between items-center mb-1.5">
                        <p className={`text-xs font-bold ${colors.text}`}>Sisa {Math.max(0, days)} hari</p>
                        <p className="text-[10px] text-slate-400">{usedPct}% terpakai · Habis {formatDate(warranty.expiry_date)}</p>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 mb-3">
                        <div className={`${colors.bar} h-1.5 rounded-full transition-all`} style={{ width: `${usedPct}%` }} />
                      </div>
                    </>
                  )}
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold flex items-center justify-center gap-1">📄 Nota</button>
                    <button className="flex-1 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-semibold flex items-center justify-center gap-1"><UploadCloud size={12} /> Upload</button>
                    <button onClick={() => { if(confirm('Hapus aset ini?')) deleteAsset(asset.id); }} className="px-3 py-2 bg-red-50 text-red-400 rounded-xl"><Trash2 size={14} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button onClick={() => setShowModal(true)} className="w-full bg-violet-50 border-2 border-dashed border-violet-200 text-violet-700 font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm">
          <Plus size={18} /> Tambah Produk Baru
        </button>
      </div>

      {showModal && (
        <Modal title="Tambah Produk & Garansi" onClose={() => setShowModal(false)}>
          <form onSubmit={handleAdd} className="space-y-4">
            {[{lbl:'Nama Produk',k:'name',ph:'MacBook Pro, Kulkas Samsung...',req:true},{lbl:'Merek',k:'brand',ph:'Apple, Samsung...'},{lbl:'Tanggal Pembelian',k:'purchase_date',type:'date'}].map(f=>(
              <div key={f.k}><label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">{f.lbl}</label>
                <input type={f.type??'text'} required={f.req} value={(assetForm as any)[f.k]??''} onChange={e=>setAssetForm(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph??''} className={INPUT_CLS} />
              </div>
            ))}
            <div><label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Garansi Berakhir</label>
              <input type="date" required value={warrantyForm.expiry_date??''} onChange={e=>setWarrantyForm(f=>({...f,expiry_date:e.target.value}))} className={INPUT_CLS} />
            </div>
            <div><label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Durasi Garansi (bulan)</label>
              <input type="number" value={warrantyForm.duration_months??''} onChange={e=>setWarrantyForm(f=>({...f,duration_months:Number(e.target.value)}))} placeholder="12" className={INPUT_CLS} />
            </div>
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={()=>setShowModal(false)} className="flex-1 py-3 border border-slate-200 rounded-xl font-semibold text-slate-600 text-sm">Batal</button>
              <button type="submit" className="flex-1 py-3 bg-violet-600 text-white rounded-xl font-semibold text-sm">Simpan</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
