import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useLegalDocs } from '../hooks/useLegalDocs';
import { getUrgency, urgencyColor, formatCurrency, formatDate, getDaysLeft } from '../types';
import type { LegalDocInsert } from '../types';

const CAT_ICONS: Record<string, string> = { sim: '🪪', stnk: '🚗', pbb: '🏠', paspor: '📘', lainnya: '📄' };
const CAT_COLORS: Record<string, string> = { sim: 'bg-blue-50 text-blue-600', stnk: 'bg-orange-50 text-orange-600', pbb: 'bg-green-50 text-green-600', paspor: 'bg-purple-50 text-purple-600', lainnya: 'bg-slate-100 text-slate-600' };
const CATEGORIES = ['sim', 'stnk', 'pbb', 'paspor', 'lainnya'];
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

export default function ManageTax() {
  const { docs, loading, addDoc, deleteDoc } = useLegalDocs();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<LegalDocInsert>>({ category: 'stnk' });
  const [activeFilter, setActiveFilter] = useState('Semua');

  const filters = ['Semua', 'SIM', 'STNK', 'PBB', 'Paspor'];
  const filtered = activeFilter === 'Semua' ? docs : docs.filter(d => d.category === activeFilter.toLowerCase());

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.expiry_date || !form.category) return;
    await addDoc(form as LegalDocInsert);
    setShowModal(false);
    setForm({ category: 'stnk' });
  };

  const totalAmount = docs.reduce((s, d) => s + (d.amount ?? 0), 0);

  return (
    <div className="min-h-full bg-slate-50 pb-4">
      {/* Header */}
      <div className="bg-gradient-to-br from-rose-500 to-orange-500 px-5 pt-10 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-white text-xl font-bold font-heading">Pajak & Legal</h1>
            <p className="text-rose-100 text-xs mt-0.5">Pantau dokumen penting Anda</p>
          </div>
          <button onClick={() => setShowModal(true)} className="p-2 bg-white/20 rounded-full text-white">
            <Plus size={18} />
          </button>
        </div>
        <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <p className="text-rose-100 text-xs mb-1">Total Estimasi Biaya</p>
          <p className="text-white text-2xl font-bold">{formatCurrency(totalAmount)}</p>
          <p className="text-rose-200 text-xs mt-1">{docs.length} dokumen terdaftar</p>
        </div>
      </div>

      <div className="px-4 -mt-6 relative z-10">
        {/* Filter chips */}
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
          {filters.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${activeFilter === f ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200'}`}>
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-100">
            <div className="text-4xl mb-2">📄</div>
            <p className="font-semibold text-slate-700 text-sm">Belum ada dokumen</p>
            <button onClick={() => setShowModal(true)} className="mt-3 text-indigo-600 font-bold text-xs hover:underline">+ Tambah sekarang</button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(doc => {
              const days = getDaysLeft(doc.expiry_date);
              const level = getUrgency(doc.expiry_date);
              const colors = urgencyColor(level);
              return (
                <div key={doc.id} className={`bg-white rounded-2xl p-4 shadow-sm border flex items-start gap-3 ${colors.border}`}>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${CAT_COLORS[doc.category] ?? 'bg-slate-100'}`}>
                    {CAT_ICONS[doc.category] ?? '📄'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h4 className="font-semibold text-slate-800 text-sm truncate">{doc.name}</h4>
                      <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase shrink-0">{doc.category}</span>
                    </div>
                    {doc.doc_number && <p className="text-xs text-slate-400 mb-0.5">No: {doc.doc_number}</p>}
                    <p className={`text-xs font-semibold ${colors.text}`}>
                      {days > 0 ? `${days} hari lagi` : 'Sudah kadaluarsa!'} · {formatDate(doc.expiry_date)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-slate-800 text-sm">{formatCurrency(doc.amount)}</p>
                    <button onClick={() => { if(confirm('Hapus?')) deleteDoc(doc.id); }} className="mt-2 text-slate-300 hover:text-red-400"><Trash2 size={14} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <Modal title="Tambah Pajak / Legal" onClose={() => setShowModal(false)}>
          <form onSubmit={handleAdd} className="space-y-4">
            {[
              { label: 'Nama Dokumen', el: <input required value={form.name ?? ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Pajak Motor, SIM A..." className={INPUT_CLS} /> },
            ].map(({ label, el }) => (
              <div key={label}><label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">{label}</label>{el}</div>
            ))}
            <div><label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Kategori</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as any }))} className={INPUT_CLS}>
                {CATEGORIES.map(c => <option key={c} value={c}>{CAT_ICONS[c]} {c.toUpperCase()}</option>)}
              </select>
            </div>
            <div><label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Nomor Dokumen</label>
              <input value={form.doc_number ?? ''} onChange={e => setForm(f => ({ ...f, doc_number: e.target.value }))} placeholder="B 1234 ABC" className={INPUT_CLS} />
            </div>
            <div><label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Tanggal Berakhir</label>
              <input type="date" required value={form.expiry_date ?? ''} onChange={e => setForm(f => ({ ...f, expiry_date: e.target.value }))} className={INPUT_CLS} />
            </div>
            <div><label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Estimasi Biaya (Rp)</label>
              <input type="number" value={form.amount ?? ''} onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))} placeholder="450000" className={INPUT_CLS} />
            </div>
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-slate-200 rounded-xl font-semibold text-slate-600 text-sm">Batal</button>
              <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-semibold text-sm">Simpan</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
