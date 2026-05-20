import { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCheck, 
  FileText, 
  Wrench, 
  Receipt, 
  Shield, 
  ArrowLeft 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '../context/AuthContext';

function formatNotificationTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  
  const diffTime = now.setHours(0,0,0,0) - new Date(dateStr).setHours(0,0,0,0);
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  }
}

export default function Notifications() {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const { notifications: dbNotifications, markRead, markAllRead, loading } = useNotifications();
  const [activeFilter, setActiveFilter] = useState<'All' | 'Unread' | 'Pajak' | 'Servis' | 'Tagihan'>('All');
  
  const [localNotifications, setLocalNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && dbNotifications) {
      setLocalNotifications(dbNotifications);
    }
  }, [dbNotifications, loading]);

  const handleMarkRead = async (id: string) => {
    await markRead(id);
  };

  const handleMarkAllRead = async () => {
    if (dbNotifications && dbNotifications.length > 0) {
      await markAllRead();
    }
  };

  // Filter items
  const filtered = localNotifications.filter((n) => {
    if (activeFilter === 'Unread') return !n.is_read;
    if (activeFilter === 'Pajak') return n.type === 'tax';
    if (activeFilter === 'Servis') return n.type === 'service';
    if (activeFilter === 'Tagihan') return n.type === 'bill';
    return true;
  });

  // Calculate unread count locally
  const unreadCount = filtered.filter(n => !n.is_read).length;

  // Group notifications into Today, Yesterday, and Older
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const formatKey = (d: Date) => d.toDateString();

  const grouped = {
    today: filtered.filter(n => formatKey(new Date(n.sent_at)) === formatKey(today)),
    yesterday: filtered.filter(n => formatKey(new Date(n.sent_at)) === formatKey(yesterday)),
    older: filtered.filter(n => {
      const key = formatKey(new Date(n.sent_at));
      return key !== formatKey(today) && key !== formatKey(yesterday);
    })
  };

  const renderCard = (notif: any) => {
    const isUnread = !notif.is_read;
    
    // Icon configuration
    let icon = <Bell size={20} />;
    let iconBg = 'bg-[#EEEDFC]';
    let iconColor = 'text-[#3525cd]';
    
    if (notif.type === 'tax') {
      icon = <FileText size={20} />;
      iconBg = 'bg-[#FDF2F2]';
      iconColor = 'text-[#E11D48]';
    } else if (notif.type === 'service') {
      icon = <Wrench size={20} />;
      iconBg = 'bg-[#EDFDF5]';
      iconColor = 'text-[#059669]';
    } else if (notif.type === 'bill') {
      icon = <Receipt size={20} />;
      iconBg = 'bg-[#FEF6E6]';
      iconColor = 'text-[#D97706]';
    } else if (notif.type === 'warranty') {
      icon = <Shield size={20} />;
      iconBg = 'bg-[#EEEDFC]';
      iconColor = 'text-[#3525cd]';
    }

    return (
      <div 
        key={notif.id}
        className={`bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-4 transition-all relative ${
          isUnread && notif.type === 'tax' ? 'border-l-4 border-l-[#E11D48]' : ''
        } ${isUnread && notif.type !== 'tax' ? 'bg-[#EEEDFC]/10' : ''}`}
      >
        {isUnread && (
          <span className="absolute top-5 right-5 w-2 h-2 bg-indigo-600 rounded-full" />
        )}

        <div className="flex gap-4">
          {/* Icon Wrapper */}
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${iconBg} ${iconColor}`}>
            {icon}
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0 pr-2">
            <div className="flex justify-between items-start gap-2">
              <h4 className="text-sm font-extrabold text-gray-900 leading-snug">
                {notif.title || 'Pemberitahuan'}
              </h4>
              <span className="text-[10px] text-gray-400 font-bold shrink-0 mt-0.5">
                {formatNotificationTime(notif.sent_at)}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium leading-relaxed mt-1">
              {notif.message}
            </p>
          </div>
        </div>

        {/* Dynamic Buttons */}
        {notif.type === 'tax' && (
          <div className="flex gap-3 pt-0.5">
            <Link 
              to="/pajak"
              onClick={() => handleMarkRead(notif.id)}
              className="flex-1 bg-indigo-600 hover:bg-[#2e1ebd] text-white text-[10px] font-extrabold py-2.5 px-4 rounded-xl text-center shadow-sm transition-all"
            >
              Pay Now
            </Link>
            <Link 
              to="/pajak"
              onClick={() => handleMarkRead(notif.id)}
              className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 text-[10px] font-extrabold py-2.5 px-4 rounded-xl text-center transition-all"
            >
              View Detail
            </Link>
          </div>
        )}

        {notif.type === 'service' && (
          <div className="pt-0.5">
            <Link 
              to="/servis"
              onClick={() => handleMarkRead(notif.id)}
              className="w-full inline-block bg-[#F3F4F6] hover:bg-[#E5E7EB] text-gray-700 text-[10px] font-extrabold py-2.5 px-4 rounded-xl text-center transition-all"
            >
              Reschedule
            </Link>
          </div>
        )}

        {notif.type === 'bill' && (
          <div className="pt-0.5">
            <button 
              onClick={() => {
                handleMarkRead(notif.id);
                alert('Kuitansi berhasil diunduh ke folder unduhan Anda!');
              }}
              className="w-full bg-[#F3F4F6] hover:bg-[#E5E7EB] text-gray-700 text-[10px] font-extrabold py-2.5 px-4 rounded-xl text-center transition-all cursor-pointer"
            >
              Download Receipt
            </button>
          </div>
        )}

        {notif.type === 'warranty' && (
          <div className="pt-0.5">
            <Link 
              to="/pajak"
              onClick={() => handleMarkRead(notif.id)}
              className="w-full inline-block bg-[#F3F4F6] hover:bg-[#E5E7EB] text-gray-700 text-[10px] font-extrabold py-2.5 px-4 rounded-xl text-center transition-all"
            >
              View Document
            </Link>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-full bg-[#F8F9FC] pb-24 relative flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 pt-6 pb-4 flex justify-between items-center shadow-sm sticky top-0 z-30">
        <Link to="/" className="flex items-center gap-3">
          <img 
            src={profile?.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.email || 'default'}`} 
            alt="Profil" 
            className="w-10 h-10 rounded-full object-cover border border-gray-100 bg-[#E8E7FD]" 
          />
          <span className="text-[#3525cd] font-extrabold text-lg tracking-wider">INGETIN</span>
        </Link>
        <div className="w-8" />
      </div>

      {/* Title Section */}
      <div className="px-5 pt-6 flex justify-between items-end shrink-0">
        <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Notifications</h1>
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllRead} 
            className="text-indigo-600 hover:text-[#2e1ebd] text-xs font-extrabold transition-colors cursor-pointer"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="px-5 pt-4 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
        {(['All', 'Unread', 'Pajak', 'Servis', 'Tagihan'] as const).map(f => (
          <button 
            key={f} 
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 rounded-full text-[11px] font-extrabold whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === f 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/15' 
                : 'bg-[#EEEDFC]/60 text-gray-500 hover:bg-[#EEEDFC] hover:text-gray-700'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Content List */}
      <div className="px-5 pt-4 flex-1 space-y-5 overflow-y-auto no-scrollbar">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-9 h-9 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm mt-4">
            <Bell size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="font-extrabold text-gray-700 text-sm">Tidak ada notifikasi</p>
            <p className="text-gray-400 text-xs mt-1">Semua pengingat penting Anda akan muncul di sini.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* TODAY Group */}
            {grouped.today.length > 0 && (
              <div>
                <span className="text-[10px] font-extrabold text-gray-400 tracking-wider mb-3 block">
                  TODAY
                </span>
                <div className="space-y-3.5">
                  {grouped.today.map(n => renderCard(n))}
                </div>
              </div>
            )}

            {/* YESTERDAY Group */}
            {grouped.yesterday.length > 0 && (
              <div className="pt-2">
                <span className="text-[10px] font-extrabold text-gray-400 tracking-wider mb-3 block">
                  YESTERDAY
                </span>
                <div className="space-y-3.5">
                  {grouped.yesterday.map(n => renderCard(n))}
                </div>
              </div>
            )}

            {/* OLDER Group */}
            {grouped.older.length > 0 && (
              <div className="pt-2">
                <span className="text-[10px] font-extrabold text-gray-400 tracking-wider mb-3 block">
                  OLDER
                </span>
                <div className="space-y-3.5">
                  {grouped.older.map(n => renderCard(n))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
