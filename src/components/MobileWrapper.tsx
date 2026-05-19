import React from 'react';
import { useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';

const NO_BOTTOM_NAV = ['/login', '/register', '/konfirmasi-pembayaran', '/upgrade', '/pembayaran-berhasil', '/pembayaran-gagal'];

export default function MobileWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const hideBottomNav = NO_BOTTOM_NAV.includes(location.pathname);

  return (
    <div className="min-h-screen bg-slate-100 font-sans sm:flex sm:justify-center">
      {/* App Container */}
      <div className="w-full min-h-screen sm:min-h-0 sm:h-screen sm:max-w-[400px] bg-white relative flex flex-col sm:shadow-2xl sm:border-x sm:border-slate-200 overflow-hidden">
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative z-0">
          {children}
        </div>

        {/* Bottom Nav */}
        {!hideBottomNav && <BottomNav />}
      </div>
    </div>
  );
}
