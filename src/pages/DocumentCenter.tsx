import { useState } from 'react';
import { Search, FileText, UploadCloud, Download, MoreVertical } from 'lucide-react';
import { useLegalDocs } from '../hooks/useLegalDocs';
import { formatDate } from '../types';



export default function DocumentCenter() {
  const { docs, loading } = useLegalDocs();
  const [activeFilter, setActiveFilter] = useState('Semua');

  const filters = ['Semua', 'Pajak', 'Garansi', 'Servis', 'Lainnya'];

  return (
    <div className="min-h-full bg-slate-50 pb-4">
      {/* Header */}
      <div className="bg-slate-800 px-5 pt-8 pb-14 relative overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-white text-xl font-bold font-heading">Pusat Dokumen</h1>
            <p className="text-slate-300 text-xs mt-0.5">Semua file penting di satu tempat</p>
          </div>
          <button className="p-2 bg-white/20 rounded-full text-white"><UploadCloud size={18} /></button>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input type="text" placeholder="Cari dokumen..." className="w-full bg-white/10 border border-white/20 text-white placeholder-slate-400 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
        </div>
      </div>

      <div className="px-4 -mt-4 relative z-10">
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
          {filters.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${activeFilter === f ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200'}`}>
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" /></div>
        ) : docs.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-100">
            <div className="text-4xl mb-2">📁</div>
            <p className="font-semibold text-slate-700 text-sm">Belum ada dokumen</p>
            <p className="text-slate-400 text-xs mt-1">Upload file penting untuk disimpan aman.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {docs.map(doc => {
              return (
                <div key={doc.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-slate-100 text-slate-500`}>
                    <FileText size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-800 text-sm truncate">{doc.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">PDF • 1.2 MB • {formatDate(doc.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"><Download size={16} /></button>
                    <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"><MoreVertical size={16} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
