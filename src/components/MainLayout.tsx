import React from 'react';
import Sidebar from './Sidebar';
import { Search, Bell, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { unreadCount } = useNotifications();

  return (
    <div className="flex min-h-screen bg-white font-sans text-slate-900">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="w-96 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search devices, assets, or records..."
              className="w-full bg-slate-50 border border-slate-200 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-4">
            <Link to="/notifikasi" className="text-slate-500 hover:text-slate-700 relative">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold border border-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
            <button className="text-slate-500 hover:text-slate-700">
              <HelpCircle size={20} />
            </button>
            <Link to="/pengaturan" className="w-8 h-8 rounded-full bg-indigo-100 overflow-hidden border border-indigo-200 flex items-center justify-center text-indigo-600 font-bold text-sm hover:ring-2 hover:ring-indigo-400 transition-all">
              👤
            </Link>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto bg-slate-50/30">
          {children}
        </div>
      </main>
    </div>
  );
}
