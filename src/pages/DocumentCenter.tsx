import { useState } from 'react';
import { Search, FileText, UploadCloud, Download, MoreVertical, FolderOpen } from 'lucide-react';
import { useLegalDocs } from '../hooks/useLegalDocs';

function formatDate(dateStr: string) {
  if (!dateStr) return '-';
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(dateStr));
}

const FILTERS = ['Semua', 'Pajak', 'Garansi', 'Servis', 'Lainnya'];

const CATEGORY_COLORS: Record<string, string> = {
  Pajak: 'bg-amber-100 text-amber-700',
  Garansi: 'bg-indigo-100 text-indigo-700',
  Servis: 'bg-blue-100 text-blue-700',
  Lainnya: 'bg-gray-100 text-gray-600',
  Semua: 'bg-gray-100 text-gray-600',
};

export default function DocumentCenter() {
  const { docs, loading } = useLegalDocs();
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [search, setSearch] = useState('');

  const filtered = docs.filter(d => {
    const matchFilter = activeFilter === 'Semua' || d.category === activeFilter;
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="min-h-full bg-[#F8F9FC] pb-6">
      {/* Header */}
      <div className="bg-indigo-700 px-5 pt-12 pb-6 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-36 h-36 bg-indigo-600/40 rounded-full" />
        <div className="relative z-10 flex justify-between items-start mb-4">
          <div>
            <h1 className="text-white text-lg font-bold">Pusat Dokumen</h1>
            <p className="text-indigo-200 text-xs mt-0.5">Simpan semua file penting dengan aman.</p>
          </div>
          <button className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center text-white backdrop-blur-sm">
            <UploadCloud size={18} />
          </button>
        </div>
        <div className="relative z-10">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-300" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari dokumen..."
            className="w-full bg-white/15 border border-white/20 text-white placeholder-indigo-300 rounded-xl py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === f
                ? 'bg-indigo-700 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="px-4 pb-4">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
            <FolderOpen size={32} className="text-gray-300 mx-auto mb-2" />
            <p className="font-semibold text-gray-700 text-sm">Belum ada dokumen</p>
            <p className="text-gray-400 text-xs mt-1">Upload file penting untuk disimpan aman.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
            {filtered.map(doc => (
              <div key={doc.id} className="flex items-center gap-3 px-4 py-3.5">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                  <FileText size={18} className="text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{doc.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${CATEGORY_COLORS[doc.category ?? 'Lainnya'] ?? 'bg-gray-100 text-gray-600'}`}>
                      {doc.category ?? 'Lainnya'}
                    </span>
                    <span className="text-[10px] text-gray-400">{formatDate(doc.created_at)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                    <Download size={15} />
                  </button>
                  <button className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
                    <MoreVertical size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
