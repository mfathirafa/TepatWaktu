import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ExternalLink, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';

interface AdBannerProps {
  type?: 'horizontal' | 'inline' | 'box';
  className?: string;
}

export default function AdBanner({ type = 'horizontal', className = '' }: AdBannerProps) {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [closed, setClosed] = useState(false);
  const [isLocalhost, setIsLocalhost] = useState(true);

  useEffect(() => {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    setIsLocalhost(isLocal);

    if (!isLocal && profile?.subscription_tier !== 'premium' && !closed) {
      try {
        // Trigger Google AdSense rendering
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {
        console.warn('AdSense trigger failed, likely due to an adblocker or script still loading:', e);
      }
    }
  }, [profile?.subscription_tier, closed]);

  // If user is a premium member, hide all ads
  if (profile?.subscription_tier === 'premium' || closed) {
    return null;
  }

  // Render real Google AdSense unit on production environment
  if (!isLocalhost) {
    return (
      <div className={`relative bg-white border border-gray-150 rounded-3xl p-3 flex flex-col items-center justify-center shadow-sm overflow-hidden min-h-[110px] ${className}`}>
        {/* Ad Label */}
        <div className="absolute top-2 left-3 flex items-center gap-1.5 z-10">
          <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
            Sponsor
          </span>
        </div>

        {/* Close Button */}
        <button 
          onClick={() => setClosed(true)} 
          className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full z-10"
          title="Tutup Iklan"
        >
          <X size={12} />
        </button>

        <div className="w-full flex justify-center py-3 overflow-hidden min-w-[250px] min-h-[90px]">
          <ins className="adsbygoogle"
               style={{ display: 'block', width: '100%', minHeight: '90px' }}
               data-ad-client="ca-pub-6334717698722401"
               data-ad-slot="auto"
               data-full-width-responsive="true">
          </ins>
        </div>

        <Link 
          to="/upgrade" 
          className="text-[9px] font-bold text-gray-400 hover:text-indigo-600 transition-colors flex items-center gap-1 mt-1 z-10"
        >
          <ShieldAlert size={10} /> Hapus Iklan dengan Premium
        </Link>
      </div>
    );
  }

  // Fallback Mock UI for Localhost Preview
  const adsData = {
    horizontal: {
      title: 'Solusi Keuangan Anda',
      desc: 'Bebaskan tagihan macet dengan Kredit Pintar. Aman, diawasi OJK.',
      cta: 'Cek Sekarang',
      bgGradient: 'from-blue-50 to-indigo-50/50',
      borderColor: 'border-blue-100',
      badgeColor: 'bg-blue-100 text-blue-700',
      img: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&h=80&q=80',
    },
    inline: {
      title: 'Proteksi Gadget #1',
      desc: 'Lengkapi garansi handphone kamu dengan Asuransi Gadget mulai dari Rp5rb/bulan.',
      cta: 'Daftar',
      bgGradient: 'from-amber-50 to-orange-50/40',
      borderColor: 'border-amber-100',
      badgeColor: 'bg-amber-100 text-amber-800',
      img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=80&h=80&q=80',
    },
    box: {
      title: 'Cloud Storage Aman & Fleksibel',
      desc: 'Simpan file KTP, Paspor, & SIM terenkripsi dengan Google One. Mulai Rp26.900/bln.',
      cta: 'Pelajari',
      bgGradient: 'from-emerald-50 to-teal-50/50',
      borderColor: 'border-emerald-100',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      img: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=150&h=100&q=80',
    }
  };

  const ad = adsData[type];

  if (type === 'box') {
    return (
      <div className={`relative bg-gradient-to-b ${ad.bgGradient} border ${ad.borderColor} rounded-3xl p-5 flex flex-col items-center text-center shadow-sm overflow-hidden group ${className}`}>
        <div className="absolute top-3 left-4 flex items-center gap-1.5">
          <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded ${ad.badgeColor}`}>
            Sponsor
          </span>
        </div>

        <button 
          onClick={() => setClosed(true)} 
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
          title="Tutup Iklan"
        >
          <X size={14} />
        </button>

        <img 
          src={ad.img} 
          alt="Ad Graphic" 
          className="w-20 h-20 rounded-2xl object-cover bg-white shadow-sm mt-4 group-hover:scale-105 transition-transform duration-300"
        />

        <h4 className="font-extrabold text-gray-900 text-sm mt-3 leading-tight">
          {ad.title}
        </h4>
        <p className="text-gray-500 text-[11px] font-medium leading-relaxed mt-1.5 max-w-[90%]">
          {ad.desc}
        </p>

        <div className="mt-4 w-full flex flex-col gap-2">
          <a 
            href="https://google.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            {ad.cta}
            <ExternalLink size={12} />
          </a>
          <Link 
            to="/upgrade" 
            className="text-[9px] font-bold text-gray-400 hover:text-indigo-600 transition-colors py-1 flex items-center justify-center gap-1"
          >
            <ShieldAlert size={10} /> Hapus Iklan dengan Premium
          </Link>
        </div>
      </div>
    );
  }

  if (type === 'inline') {
    return (
      <div className={`relative bg-gradient-to-r ${ad.bgGradient} border ${ad.borderColor} rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:border-gray-200 transition-all ${className}`}>
        <div className="absolute top-2 right-10">
          <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded ${ad.badgeColor}`}>
            Sponsor
          </span>
        </div>

        <button 
          onClick={() => setClosed(true)} 
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
          title="Tutup Iklan"
        >
          <X size={12} />
        </button>

        <img 
          src={ad.img} 
          alt="Ad Thumbnail" 
          className="w-12 h-12 rounded-xl object-cover bg-white shrink-0 border border-gray-100 shadow-sm"
        />

        <div className="flex-1 min-w-0 pr-8">
          <h4 className="font-extrabold text-gray-900 text-xs truncate">
            {ad.title}
          </h4>
          <p className="text-gray-500 text-[10px] font-medium leading-snug mt-0.5 line-clamp-2">
            {ad.desc}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <a 
              href="https://google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-0.5"
            >
              {ad.cta} <ExternalLink size={10} />
            </a>
            <span className="text-[9px] text-gray-300">•</span>
            <Link to="/upgrade" className="text-[9px] text-gray-400 hover:text-indigo-600 transition-colors">
              Hapus Iklan
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-gradient-to-r ${ad.bgGradient} border ${ad.borderColor} rounded-3xl p-4 flex items-center justify-between shadow-sm overflow-hidden ${className}`}>
      <div className="absolute top-3 left-4">
        <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded ${ad.badgeColor}`}>
          Sponsor
        </span>
      </div>

      <button 
        onClick={() => setClosed(true)} 
        className="absolute top-3 right-4 text-gray-450 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
        title="Tutup Iklan"
      >
        <X size={14} />
      </button>

      <div className="flex-1 pr-6 pt-2.5">
        <h4 className="font-extrabold text-gray-900 text-xs mt-1">
          {ad.title}
        </h4>
        <p className="text-gray-500 text-[10px] font-medium leading-relaxed mt-0.5 max-w-[90%] line-clamp-2">
          {ad.desc}
        </p>
        <div className="flex items-center gap-3 mt-2">
          <a 
            href="https://google.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg transition-all shadow-sm flex items-center gap-1"
          >
            {ad.cta}
            <ExternalLink size={10} />
          </a>
          <Link 
            to="/upgrade" 
            className="text-[9px] font-bold text-gray-400 hover:text-indigo-600 transition-colors flex items-center gap-0.5"
          >
            <ShieldAlert size={10} /> Hapus Iklan (Pro)
          </Link>
        </div>
      </div>

      <img 
        src={ad.img} 
        alt="Ad Artwork" 
        className="w-20 h-20 rounded-2xl object-cover bg-white shrink-0 border border-gray-100 shadow-sm hidden xs:block"
      />
    </div>
  );
}
