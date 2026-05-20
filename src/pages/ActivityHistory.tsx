import { Filter, CreditCard, Wrench, FileText, Clock } from 'lucide-react';
import { useBills } from '../hooks/useBills';
import { useServices } from '../hooks/useServices';

function formatDate(dateStr: string) {
  if (!dateStr) return '-';
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(dateStr));
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

export default function ActivityHistory() {
  const { bills, loading: billsLoading } = useBills();
  const { services, loading: svcsLoading } = useServices();
  const loading = billsLoading || svcsLoading;

  const history = [
    ...bills.filter(b => b.status === 'paid').map(b => ({
      id: `b-${b.id}`,
      title: `Pembayaran ${b.name}`,
      desc: 'Tagihan telah dibayar lunas.',
      date: new Date(b.updated_at),
      type: 'payment',
      amount: b.amount,
      badge: 'LUNAS',
      badgeColor: 'bg-emerald-100 text-emerald-700',
    })),
    ...services.filter(s => s.last_service_date).map(s => ({
      id: `s-${s.id}`,
      title: `Servis ${s.name}`,
      desc: s.provider ? `Dikerjakan oleh ${s.provider}` : 'Selesai diservis.',
      date: new Date(s.updated_at),
      type: 'service',
      amount: undefined,
      badge: 'SELESAI',
      badgeColor: 'bg-blue-100 text-blue-700',
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  // Group by date
  const grouped: Record<string, typeof history> = {};
  history.forEach(item => {
    const key = item.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(item);
  });

  return (
    <div className="min-h-full bg-[#F8F9FC] pb-6">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-4 border-b border-gray-100 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Riwayat Aktivitas</h1>
          <p className="text-xs text-gray-400 mt-0.5">Pantau jejak pemeliharaan aset Anda.</p>
        </div>
        <button className="w-8 h-8 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center text-gray-500">
          <Filter size={14} />
        </button>
      </div>

      {/* Summary Strip */}
      <div className="flex gap-3 px-4 py-3 overflow-x-auto no-scrollbar">
        {[
          { label: 'Selesai Bulan Ini', value: bills.filter(b => b.status === 'paid').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Total Bayar', value: formatCurrency(bills.filter(b=>b.status==='paid').reduce((s,b)=>s+(b.amount??0),0)), color: 'text-indigo-700', bg: 'bg-indigo-50' },
          { label: 'Kesehatan Aset', value: 'Sangat Baik', color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((s,i)=>(
          <div key={i} className={`flex-shrink-0 ${s.bg} rounded-2xl px-4 py-3 min-w-[130px]`}>
            <p className="text-[10px] text-gray-500 font-medium mb-0.5">{s.label}</p>
            <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="px-4 space-y-4 pb-4">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
            <Clock size={32} className="text-gray-300 mx-auto mb-2" />
            <p className="font-semibold text-gray-700 text-sm">Belum ada riwayat</p>
            <p className="text-gray-400 text-xs mt-1">Aktivitas akan muncul di sini.</p>
          </div>
        ) : (
          Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                <p className="text-xs font-bold text-gray-700">{date}</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3 px-4 py-3.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.type === 'payment' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                      {item.type === 'payment' ? <CreditCard size={16} /> : <Wrench size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{item.title}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{item.desc}</p>
                    </div>
                    <div className="text-right shrink-0">
                      {item.amount && <p className="text-xs font-bold text-gray-700">{formatCurrency(item.amount)}</p>}
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${item.badgeColor}`}>{item.badge}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
