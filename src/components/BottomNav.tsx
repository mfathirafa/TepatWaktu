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
    <div className="w-full border-t border-gray-100 bg-white px-2 py-2 flex justify-around items-center z-50">
      {navItems.map(item => {
        const isActive = location.pathname === item.path || 
          (item.path !== '/' && location.pathname.startsWith(item.path));
        const Icon = item.icon;
        return (
          <Link
            key={item.path}
            to={item.path}
            className="flex flex-col items-center gap-0.5 min-w-[56px] py-1"
          >
            <div className={`relative px-4 py-1 rounded-2xl transition-all duration-200 ${isActive ? 'bg-indigo-50' : ''}`}>
              <Icon
                size={20}
                className={isActive ? 'text-indigo-700' : 'text-gray-400'}
                strokeWidth={isActive ? 2.5 : 1.75}
              />
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </div>
            <span className={`text-[10px] font-semibold leading-none mt-1.5 ${isActive ? 'text-indigo-700' : 'text-gray-400'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
