import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';

interface Notification {
  id: string;
  user_id: string;
  asset_id: string;
  type: string;
  sent_at: string;
  is_read: boolean;
  assets: {
    name: string;
  };
}

const getRelativeTime = (dateStr: string) => {
  const date = new Date(dateStr).getTime();
  const now = new Date().getTime();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Baru saja';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit lalu`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
  if (diffInSeconds < 172800) return 'Kemarin';
  
  const days = Math.floor(diffInSeconds / 86400);
  if (days < 7) return `${days} hari lalu`;
  if (days < 30) return `${Math.floor(days / 7)} minggu lalu`;
  return `${Math.floor(days / 30)} bulan lalu`;
};

const getNotificationDetails = (type: string, assetName: string) => {
  switch (type) {
    case 'expiring_30':
      return {
        icon: '⚠️',
        iconBg: 'bg-amber-100 text-amber-600',
        title: 'Segera Berakhir',
        message: `Garansi ${assetName} akan habis dalam 30 hari.`,
      };
    case 'expiring_7':
      return {
        icon: '⚠️',
        iconBg: 'bg-amber-100 text-amber-600',
        title: 'Segera Berakhir',
        message: `Garansi ${assetName} akan habis dalam 7 hari.`,
      };
    case 'expiring_1':
      return {
        icon: '⚠️',
        iconBg: 'bg-amber-100 text-amber-600',
        title: 'Mendesak',
        message: `Garansi ${assetName} akan habis besok!`,
      };
    case 'expired':
      return {
        icon: '❌',
        iconBg: 'bg-rose-100 text-rose-600',
        title: 'Telah Kedaluwarsa',
        message: `Garansi ${assetName} telah habis.`,
      };
    default:
      return {
        icon: '✅',
        iconBg: 'bg-emerald-100 text-emerald-600',
        title: 'Pembaruan',
        message: `Pembaruan status untuk ${assetName}.`,
      };
  }
};

export default function NotificationsPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'Semua' | 'Belum Dibaca' | 'Sudah Dibaca'>('Semua');

  useEffect(() => {
    async function fetchNotifications() {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('notifications')
          .select(`
            *,
            assets ( name )
          `)
          .eq('user_id', user.id)
          .order('sent_at', { ascending: false });

        if (error) throw error;
        setNotifications(data as unknown as Notification[]);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNotifications();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleNotificationClick = async (notif: Notification) => {
    // Optimistic UI update
    if (!notif.is_read) {
      setNotifications(prev => 
        prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n)
      );
      
      // Update in background
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notif.id);
    }
    
    navigate(`/assets/${notif.asset_id}`);
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;
    
    // Optimistic UI update
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const filteredNotifications = useMemo(() => {
    if (filter === 'Belum Dibaca') return notifications.filter(n => !n.is_read);
    if (filter === 'Sudah Dibaca') return notifications.filter(n => n.is_read);
    return notifications;
  }, [notifications, filter]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 md:pb-0">
      {/* Navbar (Identik dengan Dashboard) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold text-indigo-700">
                <span>📦</span> ResiKu
              </Link>
              
              <nav className="hidden md:flex gap-6">
                <Link to="/dashboard" className="text-slate-500 hover:text-slate-900 font-medium px-1 py-5 transition-colors">Dashboard</Link>
                <Link to="/warranties" className="text-slate-500 hover:text-slate-900 font-medium px-1 py-5 transition-colors">Garansi</Link>
                <Link to="/notifications" className="text-indigo-600 font-semibold border-b-2 border-indigo-600 px-1 py-5">Notifikasi</Link>
                <Link to="/profile" className="text-slate-500 hover:text-slate-900 font-medium px-1 py-5 transition-colors">Profil</Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-sm font-medium text-slate-700">
                Halo, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
              </div>
              <button 
                onClick={handleLogout}
                className="text-sm font-medium text-slate-500 hover:text-rose-600 transition-colors px-3 py-2 rounded-lg hover:bg-rose-50 hidden sm:block"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Halaman */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              Notifikasi
              {unreadCount > 0 && (
                <span className="px-3 py-1 bg-rose-100 text-rose-700 text-sm font-bold rounded-full">
                  {unreadCount} Baru
                </span>
              )}
            </h1>
            <p className="text-slate-500 mt-2">Tetap terupdate dengan status aset dan garansi Anda.</p>
          </div>
          
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllAsRead}
              className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-colors"
            >
              ✓ Tandai Semua Dibaca
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200 pb-px">
          {['Semua', 'Belum Dibaca', 'Sudah Dibaca'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab as any)}
              className={`px-4 py-2 font-bold text-sm transition-colors border-b-2 ${
                filter === tab 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {isLoading ? (
            // Skeleton Loading
            [1, 2, 3].map(i => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 animate-pulse flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-200 shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-16"></div>
                  </div>
                  <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                </div>
              </div>
            ))
          ) : filteredNotifications.length === 0 ? (
            // Empty State
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center my-8">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                📭
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Belum ada notifikasi</h3>
              <p className="text-slate-500 max-w-sm mx-auto">
                {filter === 'Semua' 
                  ? 'Anda akan mendapatkan pemberitahuan di sini saat garansi Anda akan habis.'
                  : `Tidak ada notifikasi untuk kategori "${filter}".`}
              </p>
            </div>
          ) : (
            // List Items
            filteredNotifications.map((notif) => {
              const { icon, iconBg, title, message } = getNotificationDetails(notif.type, notif.assets?.name || 'Aset');
              
              return (
                <div 
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`relative p-5 rounded-2xl border cursor-pointer transition-all flex gap-4 ${
                    notif.is_read 
                      ? 'bg-white border-slate-200 hover:border-slate-300' 
                      : 'bg-indigo-50/50 border-indigo-200 hover:bg-indigo-50 shadow-sm'
                  }`}
                >
                  {/* Unread Indicator Bar */}
                  {!notif.is_read && (
                    <div className="absolute left-0 top-4 bottom-4 w-1 bg-indigo-600 rounded-r-full"></div>
                  )}

                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${iconBg}`}>
                    {icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</span>
                      <span className="text-xs font-medium text-slate-400 whitespace-nowrap ml-2">
                        {getRelativeTime(notif.sent_at)}
                      </span>
                    </div>
                    <p className={`text-base ${notif.is_read ? 'text-slate-700' : 'text-slate-900 font-semibold'}`}>
                      {message}
                    </p>
                  </div>

                  <div className="flex items-center text-slate-400">
                    <span className="text-xl">&rsaquo;</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 px-6 py-3 flex justify-between items-center">
        <Link to="/dashboard" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
          <span className="text-xl">📊</span>
          <span className="text-[10px] font-semibold">Beranda</span>
        </Link>
        <Link to="/warranties" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
          <span className="text-xl">🛡️</span>
          <span className="text-[10px] font-semibold">Garansi</span>
        </Link>
        <Link to="/scan" className="flex flex-col items-center gap-1 text-white bg-indigo-600 w-12 h-12 rounded-full justify-center shadow-lg -mt-8 border-4 border-slate-50">
          <span className="text-2xl">+</span>
        </Link>
        <Link to="/notifications" className="flex flex-col items-center gap-1 text-indigo-600">
          <span className="relative text-xl">
            🔔
            {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>}
          </span>
          <span className="text-[10px] font-bold">Notif</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
          <span className="text-xl">👤</span>
          <span className="text-[10px] font-semibold">Profil</span>
        </Link>
      </nav>
    </div>
  );
}