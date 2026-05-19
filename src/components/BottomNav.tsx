import { Link, useLocation } from 'react-router-dom';
import { Home, Receipt, Car, Wrench, Bell } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';

export default function BottomNav() {
  const location = useLocation();
  const { unreadCount } = useNotifications();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/tagihan', label: 'Tagihan', icon: Receipt },
    { path: '/pajak', label: 'Pajak', icon: Car },
    { path: '/servis', label: 'Servis', icon: Wrench },
    { path: '/notifikasi', label: 'Notif', icon: Bell, badge: unreadCount },
  ];

  return (
    <div className="absolute bottom-0 left-0 w-full px-6 pb-6 pt-4 bg-gradient-to-t from-slate-50/90 via-slate-50/80 to-transparent pointer-events-none z-50 flex justify-center">
      <div className="w-full max-w-[360px] bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-full px-2 py-2 flex justify-between items-center pointer-events-auto">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 w-14 transition-colors duration-200 ${
                isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className={`relative p-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-indigo-50 shadow-sm' : ''}`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold shadow-sm">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[9px] ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
