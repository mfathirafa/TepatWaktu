import { Plus, Wrench, CheckCircle, AlertTriangle, Car } from 'lucide-react';
import { useServices } from '../hooks/useServices';

function getDaysLeft(dateStr: string) {
  if (!dateStr) return 999;
  const diff = new Date(dateStr).getTime() - new Date().setHours(0,0,0,0);
  return Math.ceil(diff / 86400000);
}

function formatDate(dateStr: string) {
  if (!dateStr) return '-';
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(dateStr));
}

function StatusPill({ days }: { days: number }) {
  if (days < 0) return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">Terlambat</span>;
  if (days <= 7) return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">Segera</span>;
  if (days <= 30) return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Perlu Cek</span>;
  return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Sehat</span>;
}

export default function ManageService() {
  const { services, loading } = useServices();

  const sehat = services.filter(s => getDaysLeft(s.next_service_date) > 30).length;
  const perluCek = services.filter(s => { const d = getDaysLeft(s.next_service_date); return d >= 0 && d <= 30; }).length;
  const terlambat = services.filter(s => getDaysLeft(s.next_service_date) < 0).length;

  return (
    <div className="min-h-full bg-[#F8F9FC] pb-6">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-4 border-b border-gray-100 sticky top-0 z-10">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Kelola Servis</h1>
            <p className="text-xs text-gray-400 mt-0.5">Pantau kesehatan kendaraan & perangkat Anda.</p>
          </div>
          <button className="flex items-center gap-1.5 bg-indigo-700 text-white text-xs font-bold px-3 py-2 rounded-xl">
            <Plus size={14} /> Tambah
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="grid grid-cols-3 gap-3 px-4 py-4">
        {[
          { label: 'Sehat', value: sehat, bg: 'bg-emerald-50', color: 'text-emerald-700' },
          { label: 'Perlu Cek', value: perluCek, bg: 'bg-amber-50', color: 'text-amber-700' },
          { label: 'Terlambat', value: terlambat, bg: 'bg-red-50', color: 'text-red-700' },
        ].map((s,i) => (
          <div key={i} className={`${s.bg} rounded-2xl p-3`}>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[9px] text-gray-500 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="px-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : services.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
            <Car size={32} className="text-gray-300 mx-auto mb-2" />
            <p className="font-semibold text-gray-700 text-sm">Belum ada aset servis</p>
            <p className="text-gray-400 text-xs mt-1">Tambah kendaraan atau perangkat Anda.</p>
          </div>
        ) : (
          services.map(svc => {
            const days = getDaysLeft(svc.next_service_date);
            return (
              <div key={svc.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                      <Wrench size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{svc.name}</p>
                      <p className="text-[10px] text-gray-400">{svc.provider ?? 'Terakhir: ' + formatDate(svc.last_service_date)}</p>
                    </div>
                  </div>
                  <StatusPill days={days} />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-gray-50 rounded-xl p-2.5">
                    <p className="text-[9px] text-gray-400 font-medium">Terakhir Servis</p>
                    <p className="text-xs font-bold text-gray-700 mt-0.5">{formatDate(svc.last_service_date)}</p>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-xl p-2.5">
                    <p className="text-[9px] text-gray-400 font-medium">Servis Berikutnya</p>
                    <p className={`text-xs font-bold mt-0.5 ${days < 0 ? 'text-red-600' : days <= 7 ? 'text-orange-600' : 'text-gray-700'}`}>{formatDate(svc.next_service_date)}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-[9px] text-gray-400 font-medium">Progress ke servis</span>
                    <span className="text-[9px] font-bold text-gray-600">{Math.min(100, Math.max(0, Math.round((1 - days/90)*100)))}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${days < 0 ? 'bg-red-500' : days <= 7 ? 'bg-orange-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(100, Math.max(0, Math.round((1 - days/90)*100)))}%` }}
                    />
                  </div>
                </div>
                {days <= 7 && (
                  <button className="w-full mt-3 border border-indigo-200 text-indigo-700 font-bold text-xs py-2 rounded-xl hover:bg-indigo-50 transition-colors">
                    Servis Sekarang
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
