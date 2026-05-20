import { Link, useLocation } from 'react-router-dom';
import { Home, Scale, Wallet, Wrench, User } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';

export default function BottomNav() {
  const location = useLocation();
  const { unreadCount } = useNotifications();

  const navItems = [
    { path: '/', label: 'Beranda', icon: Home },
    { path: '/pajak', label: 'Pajak', icon: Scale },
    { path: '/tagihan', label: 'Tagihan', icon: Wallet },
    { path: '/servis', label: 'Servis', icon: Wrench },
    { path: '/pengaturan', label: 'Profil', icon: User },
  ];

  return (
    <div className="absolute bottom-6 left-6 right-6 bg-white/80 backdrop-blur-xl border border-white/60 rounded-[32px] px-2 py-2 flex justify-around items-center z-50 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
      {navItems.map(item => {
        const isActive = location.pathname === item.path || 
          (item.path !== '/' && location.pathname.startsWith(item.path));
        const Icon = item.icon;
        return (
          <Link
            key={item.path}
            to={item.path}
            className="flex flex-col items-center gap-1 min-w-[56px] py-1"
          >
            <div className={`relative px-4 py-1.5 rounded-2xl transition-all duration-300 ${isActive ? 'bg-indigo-600 shadow-md shadow-indigo-600/20 scale-110' : 'hover:bg-gray-50'}`}>
              <Icon
                size={20}
                className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-400'}`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              {item.badge && item.badge > 0 && (
                <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold border-2 border-white ${isActive ? 'bg-white text-indigo-600' : 'bg-rose-500 text-white'}`}>
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </div>
            <span className={`text-[10px] font-bold leading-none transition-colors duration-300 ${isActive ? 'text-indigo-700' : 'text-gray-400'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
