import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, ArrowLeft } from 'lucide-react';
import BottomNav from './BottomNav';

const NO_BOTTOM_NAV = ['/login', '/register', '/konfirmasi-pembayaran', '/upgrade', '/pembayaran-berhasil', '/pembayaran-gagal', '/notifikasi', '/riwayat', '/dokumen'];

export default function MobileWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const hideBottomNav = NO_BOTTOM_NAV.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-100 font-sans sm:flex sm:justify-center sm:items-center sm:p-4">
      {/* Phone Shell */}
      <div className="w-full min-h-screen sm:min-h-0 sm:h-[844px] sm:max-w-[390px] bg-[#F8F9FC] relative flex flex-col sm:rounded-[40px] sm:shadow-2xl sm:overflow-hidden sm:border sm:border-gray-200">
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative">
          {children}
        </div>

        {/* Floating Action Button (FAB) */}
        {!hideBottomNav && (location.pathname === '/' || location.pathname === '/pajak' || location.pathname === '/tagihan' || location.pathname === '/servis') && (
          location.pathname === '/' ? (
            <Link 
              to="/tagihan" 
              className="absolute bottom-28 right-5 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/35 hover:scale-105 active:scale-95 transition-all z-40"
            >
              <Plus size={28} />
            </Link>
          ) : location.pathname === '/pajak' ? (
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-add-document-modal'))}
              className="absolute bottom-28 right-5 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/35 hover:scale-105 active:scale-95 transition-all z-40 cursor-pointer"
            >
              <Plus size={28} />
            </button>
          ) : location.pathname === '/tagihan' ? (
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-add-bill-modal'))}
              className="absolute bottom-28 right-5 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/35 hover:scale-105 active:scale-95 transition-all z-40 cursor-pointer"
            >
              <Plus size={28} />
            </button>
          ) : (
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-add-service-modal'))}
              className="absolute bottom-28 right-5 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/35 hover:scale-105 active:scale-95 transition-all z-40 cursor-pointer"
            >
              <Plus size={28} />
            </button>
          )
        )}

        {/* Bottom Nav */}
        {!hideBottomNav && <BottomNav />}

        {/* Floating Back Button for sub-pages without bottom nav */}
        {hideBottomNav && (location.pathname === '/notifikasi' || location.pathname === '/riwayat' || location.pathname === '/dokumen') && (
          <button 
            onClick={() => window.history.back()}
            className="absolute bottom-6 right-5 w-14 h-14 bg-white hover:bg-gray-50 text-[#3525cd] rounded-full flex items-center justify-center shadow-xl shadow-indigo-600/15 border border-gray-100 hover:scale-105 active:scale-95 transition-all z-50 cursor-pointer"
            title="Kembali"
          >
            <ArrowLeft size={24} className="stroke-[2.5]" />
          </button>
        )}
      </div>
    </div>
  );
}
