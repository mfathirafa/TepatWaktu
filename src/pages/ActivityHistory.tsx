import { Filter } from 'lucide-react';
import { useBills } from '../hooks/useBills';
import { useServices } from '../hooks/useServices';
import { formatDate } from '../types';

export default function ActivityHistory() {
  const { bills, loading: billsLoading } = useBills();
  const { services, loading: svcsLoading } = useServices();

  const loading = billsLoading || svcsLoading;
  
  // Combine all activities
  const history = [
    ...bills.filter(b => b.status === 'paid').map(b => ({
      id: `b-${b.id}`,
      title: `Pembayaran ${b.name}`,
      desc: 'Tagihan telah dibayar lunas.',
      date: new Date(b.updated_at),
      type: 'payment',
      amount: b.amount
    })),
    ...services.filter(s => s.last_service_date).map(s => ({
      id: `s-${s.id}`,
      title: `Servis ${s.name}`,
      desc: s.provider ? `Dikerjakan oleh ${s.provider}` : 'Selesai diservis.',
      date: new Date(s.updated_at),
      type: 'service',
      amount: undefined
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="min-h-full bg-slate-50 pb-4">
      {/* Header */}
      <div className="bg-white px-5 pt-8 pb-4 shadow-sm relative z-10 sticky top-0 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800 font-heading">Riwayat Aktivitas</h1>
        </div>
        <button className="w-8 h-8 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center text-slate-600">
          <Filter size={14} />
        </button>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" /></div>
        ) : history.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-100">
            <div className="text-4xl mb-2">🕒</div>
            <p className="font-semibold text-slate-700 text-sm">Belum ada riwayat</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map(item => (
              <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.type === 'payment' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                  {item.type === 'payment' ? '💳' : '🔧'}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-slate-400 font-medium">{formatDate(item.date.toISOString())}</p>
                  {item.amount && <p className="text-xs font-bold text-slate-800 mt-1">Rp {item.amount.toLocaleString('id-ID')}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
