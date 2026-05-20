import { useState } from 'react';
import { Bell, CheckCheck, FileText, Wrench, Receipt, Shield } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} menit yang lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} jam yang lalu`;
  return `${Math.floor(hrs/24)} hari yang lalu`;
}

const TYPE_ICONS: Record<string, any> = {
  tax: FileText, service: Wrench, bill: Receipt, warranty: Shield, default: Bell,
};
const TYPE_COLORS: Record<string, string> = {
  tax: 'bg-violet-50 text-violet-600', service: 'bg-blue-50 text-blue-600',
  bill: 'bg-indigo-50 text-indigo-600', warranty: 'bg-emerald-50 text-emerald-600',
  default: 'bg-gray-50 text-gray-500',
};
const FILTERS = ['Semua', 'Belum Dibaca', 'Pajak', 'Servis', 'Tagihan'];

export default function Notifications() {
  const { notifications, markAllRead, unreadCount } = useNotifications();
  const [activeFilter, setActiveFilter] = useState('Semua');

  const filtered = (notifications ?? []).filter((n: any) => {
    if (activeFilter === 'Belum Dibaca') return !n.read;
    if (activeFilter === 'Pajak') return n.type === 'tax';
    if (activeFilter === 'Servis') return n.type === 'service';
    if (activeFilter === 'Tagihan') return n.type === 'bill';
    return true;
  });

  return (
    <div className="min-h-full bg-[#F8F9FC] pb-6">
      <div className="bg-white px-5 pt-12 pb-4 border-b border-gray-100 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Notifikasi</h1>
            <p className="text-xs text-gray-400 mt-0.5">Kelola pengingat penting untuk aset Anda.</p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-1.5 text-indigo-600 text-xs font-bold">
              <CheckCheck size={14} /> Tandai Dibaca
            </button>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${activeFilter === f ? 'bg-indigo-700 text-white' : 'bg-gray-100 text-gray-600'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-3 space-y-2">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
            <Bell size={32} className="text-gray-300 mx-auto mb-2" />
            <p className="font-semibold text-gray-700 text-sm">Tidak ada notifikasi</p>
          </div>
        ) : (
          filtered.map((notif: any) => {
            const Icon = TYPE_ICONS[notif.type ?? 'default'] ?? Bell;
            const color = TYPE_COLORS[notif.type ?? 'default'] ?? TYPE_COLORS.default;
            return (
              <div key={notif.id} className={`bg-white rounded-2xl border p-4 flex gap-3 relative ${!notif.read ? 'border-indigo-100' : 'border-gray-100'}`}>
                {!notif.read && <div className="absolute top-4 right-4 w-2 h-2 bg-indigo-500 rounded-full" />}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0 pr-4">
                  <p className="text-sm font-bold text-gray-800">{notif.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{notif.message}</p>
                  <p className="text-[10px] text-gray-400 mt-1.5 font-medium">{timeAgo(notif.created_at)}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
