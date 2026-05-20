import React from 'react';
import { useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';

const NO_BOTTOM_NAV = ['/login', '/register', '/konfirmasi-pembayaran', '/upgrade', '/pembayaran-berhasil', '/pembayaran-gagal'];

export default function MobileWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const hideBottomNav = NO_BOTTOM_NAV.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-100 font-sans sm:flex sm:justify-center sm:items-center sm:p-4">
      {/* Phone Shell */}
      <div className="w-full min-h-screen sm:min-h-0 sm:h-[844px] sm:max-w-[390px] bg-[#F8F9FC] relative flex flex-col sm:rounded-[40px] sm:shadow-2xl sm:overflow-hidden sm:border sm:border-gray-200">
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {children}
        </div>
        {/* Bottom Nav */}
        {!hideBottomNav && <BottomNav />}
      </div>
    </div>
  );
}
