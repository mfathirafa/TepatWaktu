import { useNotifications } from '../hooks/useNotifications';
import { Check, Receipt, ShieldAlert, PenTool, FileText } from 'lucide-react';

function timeAgo(isoStr: string): string {
  const diff = Date.now() - new Date(isoStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} mnt lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} jam lalu`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} hari lalu`;
  return new Date(isoStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

const TYPE_ICON: Record<string, React.ReactNode> = {
  bill_paid: <Receipt size={18} className="text-emerald-600" />,
  warranty_expiring: <ShieldAlert size={18} className="text-red-500" />,
  service_due: <PenTool size={18} className="text-blue-500" />,
  default: <FileText size={18} className="text-slate-500" />,
};

export default function Notifications() {
  const { notifications, loading, markAllRead, markRead } = useNotifications();

  const unread = notifications.filter(n => !n.is_read);
  const readList = notifications.filter(n => n.is_read);

  return (
    <div className="min-h-full bg-slate-50 pb-4">
      {/* Header */}
      <div className="bg-white px-5 pt-8 pb-4 shadow-sm relative z-10 flex justify-between items-center sticky top-0">
        <div>
          <h1 className="text-xl font-bold text-slate-800 font-heading">Notifikasi</h1>
        </div>
        {unread.length > 0 && (
          <button onClick={markAllRead} className="text-indigo-600 text-xs font-semibold flex items-center gap-1">
            <Check size={14} /> Tandai Dibaca
          </button>
        )}
      </div>

      <div className="p-4">
        {loading ? (
          <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" /></div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-100">
            <div className="text-4xl mb-2">🔔</div>
            <p className="font-semibold text-slate-700 text-sm">Tidak ada notifikasi</p>
          </div>
        ) : (
          <div className="space-y-6">
            {unread.length > 0 && (
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Belum Dibaca ({unread.length})</h4>
                <div className="space-y-2">
                  {unread.map(n => (
                    <NotifCard key={n.id} notif={n} onRead={() => markRead(n.id)} />
                  ))}
                </div>
              </div>
            )}

            {readList.length > 0 && (
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Sudah Dibaca</h4>
                <div className="space-y-2">
                  {readList.map(n => (
                    <NotifCard key={n.id} notif={n} isRead />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function NotifCard({ notif, onRead, isRead }: { notif: any; onRead?: () => void; isRead?: boolean }) {
  const icon = TYPE_ICON[notif.type] ?? TYPE_ICON.default;
  return (
    <div
      onClick={onRead}
      className={`bg-white rounded-xl p-4 flex gap-3 items-start transition-all cursor-pointer relative overflow-hidden ${isRead ? 'opacity-70 border border-slate-100' : 'border border-slate-200 shadow-sm'}`}
    >
      {!isRead && <div className="absolute left-0 top-3 bottom-3 w-1 bg-indigo-600 rounded-r" />}
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isRead ? 'bg-slate-100' : 'bg-indigo-50'}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-0.5">
          <h3 className="font-semibold text-slate-800 text-sm truncate pr-2">{notif.title ?? notif.type}</h3>
          <span className="text-[10px] text-slate-400 shrink-0">{timeAgo(notif.sent_at)}</span>
        </div>
        <p className="text-xs text-slate-500 line-clamp-2">{notif.message ?? ''}</p>
      </div>
    </div>
  );
}
