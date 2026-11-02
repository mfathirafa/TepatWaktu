// src/components/AdModal.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ExternalLink, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';

interface AdModalDetail {
  action?: string;
  title?: string;
}

const SPONSORS = [
  {
    brand: 'Tokopedia Care',
    headline: 'Lindungi Gadget Barumu Hingga 12 Bulan!',
    description: 'Dapatkan perlindungan layar retak, terkena cairan, dan perbaikan resmi di authorized service center.',
    cta: 'Klaim Proteksi Sekarang',
    badge: 'Disponsori oleh Tokopedia',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
    link: 'https://tokopedia.com',
  },
  {
    brand: 'BCA Finance & Asuransi',
    headline: 'Bunga Ringan & Cicilan Aman Terlindungi',
    description: 'Kemudahan proteksi aset kendaraan dan pembiayaan terpercaya, diawasi langsung oleh OJK.',
    cta: 'Simulasi Sekarang',
    badge: 'Disponsori oleh BCA',
    badgeColor: 'bg-blue-100 text-blue-800',
    img: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80',
    link: 'https://bca.co.id',
  },
  {
    brand: 'Samsung Service Smart',
    headline: 'Ganti Sparepart Asli & Garansi Resmi',
    description: 'Booking antrean servis HP & elektronik rumah tangga tanpa antre via aplikasi.',
    cta: 'Cari Service Center',
    badge: 'Official Service Partner',
    badgeColor: 'bg-indigo-100 text-indigo-800',
    img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    link: 'https://samsung.com/id',
  }
];

export default function AdModal() {
  const { profile } = useProfile();
  const [isOpen, setIsOpen] = useState(false);
  const [actionInfo, setActionInfo] = useState<string>('Aset berhasil disimpan!');
  const [countdown, setCountdown] = useState(4);
  const [sponsorIndex, setSponsorIndex] = useState(0);

  useEffect(() => {
    const handleTriggerAd = (e: CustomEvent<AdModalDetail>) => {
      // Premium members are 100% ad-free!
      if (profile?.subscription_tier === 'premium') {
        return;
      }

      if (e.detail?.action) {
        setActionInfo(e.detail.action);
      } else {
        setActionInfo('Data baru berhasil disimpan!');
      }

      // Pick a random sponsor
      setSponsorIndex(Math.floor(Math.random() * SPONSORS.length));
      setCountdown(3);
      setIsOpen(true);
    };

    window.addEventListener('show-ad-modal' as any, handleTriggerAd);
    return () => window.removeEventListener('show-ad-modal' as any, handleTriggerAd);
  }, [profile?.subscription_tier]);

  // Countdown timer for close button
  useEffect(() => {
    if (!isOpen) return;
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, countdown]);

  if (!isOpen || profile?.subscription_tier === 'premium') {
    return null;
  }

  const sponsor = SPONSORS[sponsorIndex];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl border border-gray-100 flex flex-col relative animate-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white px-5 py-3 flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
              Sponsor Mitra
            </span>
            <span className="text-[10px] text-slate-400 font-medium">• Free Tier</span>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            disabled={countdown > 0}
            className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full transition-all ${
              countdown > 0 
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed' 
                : 'bg-white text-slate-900 hover:bg-slate-100 cursor-pointer shadow-sm'
            }`}
          >
            {countdown > 0 ? (
              <span>Tutup ({countdown}s)</span>
            ) : (
              <>
                <span>Tutup</span>
                <X size={13} />
              </>
            )}
          </button>
        </div>

        {/* Success toast notification bar */}
        <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-2 flex items-center gap-2 text-emerald-800 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>✓ {actionInfo}</span>
        </div>

        {/* Ad Media Graphic */}
        <div className="relative h-44 w-full overflow-hidden bg-slate-100">
          <img 
            src={sponsor.img} 
            alt={sponsor.brand} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md self-start mb-1.5 ${sponsor.badgeColor}`}>
              {sponsor.badge}
            </span>
            <h3 className="text-white font-extrabold text-base leading-snug drop-shadow-md">
              {sponsor.headline}
            </h3>
          </div>
        </div>

        {/* Ad Body Content */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-gray-600 leading-relaxed font-medium">
            {sponsor.description}
          </p>

          <a
            href={sponsor.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="w-full bg-[#3525cd] hover:bg-[#2b1ea8] active:scale-95 text-white font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <span>{sponsor.cta}</span>
            <ExternalLink size={14} />
          </a>

          {/* Upgrade to Remove Ads Banner */}
          <div className="border border-indigo-100 bg-indigo-50/70 rounded-2xl p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Sparkles size={16} />
              </div>
              <div>
                <p className="text-[11px] font-extrabold text-indigo-950 leading-tight">
                  Mau Bebas Iklan?
                </p>
                <p className="text-[10px] text-indigo-700/80 font-medium">
                  Hanya Rp9.000/bln + WA Reminder
                </p>
              </div>
            </div>

            <Link
              to="/upgrade"
              onClick={() => setIsOpen(false)}
              className="bg-white hover:bg-indigo-600 hover:text-white text-indigo-700 text-[10px] font-extrabold px-3 py-1.5 rounded-xl border border-indigo-200 transition-all shadow-sm shrink-0 flex items-center gap-0.5"
            >
              <span>Upgrade</span>
              <ArrowRight size={10} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper to trigger ad popup after any action
export function triggerAdAfterAction(actionMessage: string = 'Aset berhasil ditambahkan!') {
  window.dispatchEvent(new CustomEvent('show-ad-modal', {
    detail: { action: actionMessage }
  }));
}
