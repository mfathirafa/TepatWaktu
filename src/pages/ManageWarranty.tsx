import { Plus, Shield, ShieldAlert, Package } from 'lucide-react';
import { useWarranties } from '../hooks/useWarranties';

function getDaysLeft(dateStr: string) {
  if (!dateStr) return 999;
  const diff = new Date(dateStr).getTime() - new Date().setHours(0,0,0,0);
  return Math.ceil(diff / 86400000);
}

function formatDate(dateStr: string) {
  if (!dateStr) return '-';
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(dateStr));
}

export default function ManageWarranty() {
  const { assets, loading } = useWarranties();

  const soon = assets.filter(a => { const d = getDaysLeft(a.warranty_expiry); return d >= 0 && d <= 30; }).length;
  const aman = assets.filter(a => getDaysLeft(a.warranty_expiry) > 30).length;
  const total = assets.length;

  return (
    <div className="min-h-full bg-[#F8F9FC] pb-6">
      <div className="bg-white px-5 pt-12 pb-4 border-b border-gray-100 sticky top-0 z-10">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Manajemen Garansi</h1>
            <p className="text-xs text-gray-400 mt-0.5">Pantau masa berlaku garansi aset Anda.</p>
          </div>
          <button className="flex items-center gap-1.5 bg-indigo-700 text-white text-xs font-bold px-3 py-2 rounded-xl">
            <Plus size={14} /> Tambah
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 px-4 py-4">
        {[
          { label: 'Segera Berakhir', value: soon, bg: 'bg-red-50', color: 'text-red-600' },
          { label: 'Status Aman', value: aman, bg: 'bg-emerald-50', color: 'text-emerald-600' },
          { label: 'Total Aset', value: total, bg: 'bg-indigo-50', color: 'text-indigo-700' },
        ].map((s,i) => (
          <div key={i} className={`${s.bg} rounded-2xl p-3`}>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[9px] text-gray-500 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="px-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : assets.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
            <Package size={32} className="text-gray-300 mx-auto mb-2" />
            <p className="font-semibold text-gray-700 text-sm">Belum ada aset terdaftar</p>
            <p className="text-gray-400 text-xs mt-1">Tambah produk untuk mulai memantau garansi.</p>
          </div>
        ) : (
          assets.map(asset => {
            const days = getDaysLeft(asset.warranty_expiry);
            const pct = Math.min(100, Math.max(0, asset.total_warranty_months ? Math.round((1 - days / (asset.total_warranty_months * 30)) * 100) : 50));
            return (
              <div key={asset.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center">
                      {days < 0 ? <ShieldAlert size={16} className="text-red-500" /> : <Shield size={16} className="text-indigo-600" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{asset.name}</p>
                      <p className="text-[10px] text-gray-400">Beli: {formatDate(asset.purchase_date)}</p>
                    </div>
                  </div>
                  {days < 0
                    ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">Kedaluwarsa</span>
                    : days <= 30
                    ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Sisa {days} Hari</span>
                    : <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Aman</span>
                  }
                </div>
                <div className="flex gap-2 mb-3">
                  <div className="flex-1 bg-gray-50 rounded-xl p-2.5">
                    <p className="text-[9px] text-gray-400 font-medium">Total Masa Garansi</p>
                    <p className="text-xs font-bold text-gray-700 mt-0.5">{asset.total_warranty_months} Bulan</p>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-xl p-2.5">
                    <p className="text-[9px] text-gray-400 font-medium">Berakhir</p>
                    <p className={`text-xs font-bold mt-0.5 ${days < 0 ? 'text-red-600' : days <= 30 ? 'text-amber-600' : 'text-gray-700'}`}>{formatDate(asset.warranty_expiry)}</p>
                  </div>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${days < 0 ? 'bg-red-500' : days <= 30 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-right text-[9px] text-gray-400 font-medium mt-1">{pct}% Terpakai</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
