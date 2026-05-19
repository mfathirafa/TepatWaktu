import { useState } from 'react';
import { Plus, Trash2, CheckCircle } from 'lucide-react';
import { useServices } from '../hooks/useServices';
import { getUrgency, urgencyColor, formatDate, getDaysLeft } from '../types';
import type { ServiceInsert } from '../types';

const INPUT_CLS = 'w-full border border-slate-300 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500';
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>{children}</div>;
}
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-200">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function ManageService() {
  const { services, loading, addService, markDone, deleteService } = useServices();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Partial<ServiceInsert>>({ interval_months: 3 });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.next_service_date || !form.interval_months) return;
    await addService(form as ServiceInsert);
    setShowModal(false);
    setForm({ interval_months: 3 });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-heading">Jadwal Servis</h1>
          <p className="text-slate-500 mt-1 text-sm">Rawat barang Anda agar tahan lama.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-md">
          <Plus size={18} /> Buat Jadwal
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" /></div>
      ) : services.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <div className="text-5xl mb-3">🔧</div>
          <p className="font-semibold">Belum ada jadwal servis</p>
          <button onClick={() => setShowModal(true)} className="mt-4 text-indigo-600 font-bold text-sm hover:underline">+ Tambah sekarang</button>
        </div>
      ) : (
        <div className="space-y-4 max-w-3xl">
          {services.map(svc => {
            const days = getDaysLeft(svc.next_service_date);
            const level = getUrgency(svc.next_service_date);
            const colors = urgencyColor(level);
            return (
              <div key={svc.id} className={`bg-white p-5 rounded-2xl shadow-sm border ${colors.border}`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${colors.bg}`}>🔧</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800">{svc.name}</h4>
                    {svc.provider && <p className="text-xs text-slate-500">{svc.provider}</p>}
                  </div>
                  <button onClick={() => { if(confirm('Hapus jadwal ini?')) deleteService(svc.id); }} className="text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className={`rounded-xl p-3 flex justify-between items-center ${colors.bg} border ${colors.border}`}>
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium">Servis Berikutnya</p>
                    <p className={`text-sm font-bold ${colors.text}`}>{formatDate(svc.next_service_date)}</p>
                    <p className="text-xs text-slate-500">{days > 0 ? `${days} hari lagi` : 'Sudah lewat jadwal!'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-medium">Interval</p>
                    <p className="text-sm font-bold text-slate-700">Setiap {svc.interval_months} bulan</p>
                    <button onClick={() => markDone(svc)} className="mt-1 text-[10px] font-bold bg-indigo-600 text-white px-2.5 py-1 rounded-full hover:bg-indigo-700 flex items-center gap-1">
                      <CheckCircle size={10} /> Selesai Servis
                    </button>
                  </div>
                </div>
                {svc.last_service_date && <p className="text-xs text-slate-400 mt-2">Terakhir servis: {formatDate(svc.last_service_date)}</p>}
                {svc.notes && <p className="text-xs text-slate-500 mt-1 italic">{svc.notes}</p>}
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <Modal title="Buat Jadwal Servis" onClose={() => setShowModal(false)}>
          <form onSubmit={handleAdd} className="space-y-4">
            <Field label="Nama Servis"><input required value={form.name ?? ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ganti Oli Motor, Cuci AC..." className={INPUT_CLS} /></Field>
            <Field label="Penyedia / Bengkel"><input value={form.provider ?? ''} onChange={e => setForm(f => ({ ...f, provider: e.target.value }))} placeholder="AHASS, Teknisi AC..." className={INPUT_CLS} /></Field>
            <Field label="Interval (bulan)">
              <select value={form.interval_months} onChange={e => setForm(f => ({ ...f, interval_months: Number(e.target.value) }))} className={INPUT_CLS}>
                {[1,2,3,6,12].map(n => <option key={n} value={n}>Setiap {n} bulan</option>)}
              </select>
            </Field>
            <Field label="Tanggal Servis Terakhir (opsional)"><input type="date" value={form.last_service_date ?? ''} onChange={e => setForm(f => ({ ...f, last_service_date: e.target.value }))} className={INPUT_CLS} /></Field>
            <Field label="Tanggal Servis Berikutnya"><input type="date" required value={form.next_service_date ?? ''} onChange={e => setForm(f => ({ ...f, next_service_date: e.target.value }))} className={INPUT_CLS} /></Field>
            <Field label="Catatan"><input value={form.notes ?? ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Keterangan tambahan..." className={INPUT_CLS} /></Field>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-slate-200 rounded-xl font-semibold text-slate-600">Batal</button>
              <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700">Simpan</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
