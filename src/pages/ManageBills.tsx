import { useState } from 'react';
import { Plus, Trash2, CheckCircle, Bell } from 'lucide-react';
import { useBills } from '../hooks/useBills';
import { getUrgency, urgencyColor, formatCurrency, formatDate, getDaysLeft } from '../types';
import type { BillInsert } from '../types';
import { Link } from 'react-router-dom';

const CATEGORY_ICONS: Record<string, string> = {
  listrik: '⚡', internet: '📶', air: '💧', cicilan: '🏦', hiburan: '🎬', lainnya: '📋'
};
const CATEGORIES = ['listrik', 'internet', 'air', 'cicilan', 'hiburan', 'lainnya'];
const INPUT_CLS = 'w-full border border-slate-200 rounded-xl py-3 px-4 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">{label}</label>{children}</div>;
}
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-t-3xl p-6 w-full max-w-sm max-h-[85vh] overflow-y-auto shadow-2xl">
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

export default function ManageBills() {
  const { bills, loading, addBill, markPaid, deleteBill } = useBills();
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<BillInsert>>({ category: 'listrik', status: 'unpaid' });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.due_date) return;
    await addBill({ ...form, due_day: new Date(form.due_date!).getDate() } as BillInsert);
    setShowModal(false);
    setForm({ category: 'listrik', status: 'unpaid' });
  };

  const unpaidTotal = bills.filter(b => b.status === 'unpaid').reduce((s, b) => s + (b.amount ?? 0), 0);

  return (
    <div className="min-h-full bg-slate-50 pb-4">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 px-5 pt-10 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-white text-xl font-bold font-heading">Kelola Tagihan</h1>
            <p className="text-blue-100 text-xs mt-0.5">Pantau tagihan bulanan Anda</p>
          </div>
          <Link to="/notifikasi" className="p-2 bg-white/15 rounded-full text-white">
            <Bell size={18} />
          </Link>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <p className="text-blue-100 text-xs mb-1">Total Belum Dibayar</p>
          <p className="text-white text-2xl font-bold">{formatCurrency(unpaidTotal)}</p>
          <p className="text-blue-200 text-xs mt-1">{bills.filter(b => b.status === 'unpaid').length} tagihan aktif</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 -mt-6 relative z-10">
        {loading ? (
          <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" /></div>
        ) : (
          <>
            <div className="space-y-3 mb-4">
              {bills.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-100">
                  <div className="text-4xl mb-3">📋</div>
                  <p className="font-semibold text-slate-700 text-sm">Belum ada tagihan</p>
                  <p className="text-slate-400 text-xs mt-1">Tambahkan tagihan untuk mulai memantau</p>
                </div>
              ) : bills.map(bill => {
                const daysLeft = getDaysLeft(bill.due_date);
                const level = getUrgency(bill.due_date);
                const colors = urgencyColor(level);
                const isPaid = bill.status === 'paid';
                return (
                  <div key={bill.id} className={`bg-white rounded-2xl p-4 shadow-sm border flex items-center gap-3 ${isPaid ? 'opacity-60 border-slate-100' : colors.border}`}>
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${isPaid ? 'bg-slate-50' : colors.bg}`}>
                      {CATEGORY_ICONS[bill.category] ?? '📋'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-800 text-sm truncate">{bill.name}</h4>
                      <p className={`text-xs mt-0.5 ${isPaid ? 'text-slate-400' : colors.text}`}>
                        {isPaid ? `Lunas · ${formatDate(bill.due_date)}` : `${daysLeft > 0 ? daysLeft + ' hari lagi' : 'Terlambat!'} · ${formatDate(bill.due_date)}`}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-slate-800 text-sm">{formatCurrency(bill.amount)}</p>
                      {isPaid ? (
                        <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">LUNAS</span>
                      ) : (
                        <button onClick={() => markPaid(bill)} className="text-[9px] font-bold bg-indigo-600 text-white px-2.5 py-1 rounded-full mt-1 flex items-center gap-1 ml-auto">
                          <CheckCircle size={10} /> Bayar
                        </button>
                      )}
                    </div>
                    <button onClick={async () => { if(confirm('Hapus?')) { setDeleting(bill.id); await deleteBill(bill.id); setDeleting(null); } }} disabled={deleting === bill.id} className="text-slate-300 hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>

            <button onClick={() => setShowModal(true)} className="w-full bg-indigo-50 border-2 border-dashed border-indigo-200 text-indigo-600 font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-100 transition-colors text-sm">
              <Plus size={18} /> Tambah Tagihan Baru
            </button>
          </>
        )}
      </div>

      {showModal && (
        <Modal title="Tambah Tagihan" onClose={() => setShowModal(false)}>
          <form onSubmit={handleAdd} className="space-y-4">
            <Field label="Nama Tagihan"><input required value={form.name ?? ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Listrik PLN, Indihome..." className={INPUT_CLS} /></Field>
            <Field label="Kategori">
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as any }))} className={INPUT_CLS}>
                {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_ICONS[c]} {c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </Field>
            <Field label="Nominal (Rp)"><input type="number" value={form.amount ?? ''} onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))} placeholder="350000" className={INPUT_CLS} /></Field>
            <Field label="Jatuh Tempo"><input type="date" required value={form.due_date ?? ''} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} className={INPUT_CLS} /></Field>
            <Field label="Catatan"><input value={form.notes ?? ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Opsional..." className={INPUT_CLS} /></Field>
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
