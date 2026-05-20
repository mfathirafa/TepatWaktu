import { useState } from 'react';
import { Plus, Edit2, Trash2, FileText, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useLegalDocs } from '../hooks/useLegalDocs';

function formatDate(dateStr: string) {
  if (!dateStr) return '-';
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(dateStr));
}

function getDaysLeft(dateStr: string) {
  if (!dateStr) return 999;
  const diff = new Date(dateStr).getTime() - new Date().setHours(0,0,0,0);
  return Math.ceil(diff / 86400000);
}

function StatusBadge({ days }: { days: number }) {
  if (days < 0) return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">Terlambat</span>;
  if (days <= 7) return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">Segera Berakhir</span>;
  if (days <= 30) return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Jatuh Tempo 30 Hari</span>;
  return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Aktif</span>;
}

export default function ManageTax() {
  const { docs, loading, deleteDoc } = useLegalDocs();
  const [activeFilter, setActiveFilter] = useState('Semua Kategori');

  const expired = docs.filter(d => getDaysLeft(d.expiry_date) < 0).length;
  const soon = docs.filter(d => { const d2 = getDaysLeft(d.expiry_date); return d2 >= 0 && d2 <= 30; }).length;
  const active = docs.filter(d => getDaysLeft(d.expiry_date) > 30).length;

  return (
    <div className="min-h-full bg-[#F8F9FC] pb-6">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-4 border-b border-gray-100 sticky top-0 z-10">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Kelola Pajak & Legal</h1>
            <p className="text-xs text-gray-400 mt-0.5">Pantau masa berlaku dokumen penting Anda.</p>
          </div>
          <button className="flex items-center gap-1.5 bg-indigo-700 text-white text-xs font-bold px-3 py-2 rounded-xl">
            <Plus size={14} /> Tambah
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 px-4 py-4">
        {[
          { label: 'Masa Habis', value: expired, icon: <AlertCircle size={16} />, bg: 'bg-red-50', color: 'text-red-600' },
          { label: 'Jatuh Tempo (30H)', value: soon, icon: <Clock size={16} />, bg: 'bg-amber-50', color: 'text-amber-600' },
          { label: 'Total Aktif', value: active, icon: <CheckCircle size={16} />, bg: 'bg-emerald-50', color: 'text-emerald-600' },
        ].map((s,i) => (
          <div key={i} className={`${s.bg} rounded-2xl p-3`}>
            <div className={`${s.color} mb-1`}>{s.icon}</div>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[9px] text-gray-500 font-medium leading-tight mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* List */}
      <div className="px-4">
        <h2 className="text-sm font-bold text-gray-800 mb-3">Daftar Dokumen</h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : docs.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
            <FileText size={32} className="text-gray-300 mx-auto mb-2" />
            <p className="font-semibold text-gray-700 text-sm">Belum ada dokumen</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
            {docs.map(doc => (
              <div key={doc.id} className="px-4 py-3.5 flex items-center gap-3">
                <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                  <FileText size={16} className="text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{doc.name}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Jatuh Tempo: {formatDate(doc.expiry_date)}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <StatusBadge days={getDaysLeft(doc.expiry_date)} />
                  <div className="flex gap-1">
                    <button className="text-gray-400 hover:text-indigo-600 p-1"><Edit2 size={13} /></button>
                    <button onClick={() => deleteDoc(doc.id)} className="text-gray-400 hover:text-red-500 p-1"><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
