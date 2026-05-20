import { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  ChevronRight, 
  LogOut, 
  Bell, 
  User, 
  Phone, 
  Mail, 
  MessageSquare, 
  AtSign, 
  Shield, 
  RotateCcw,
  Pencil,
  Clock,
  FileText,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useNotifications } from '../hooks/useNotifications';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import AdBanner from '../components/AdBanner';

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const { profile, loading: profileLoading, updateProfile, uploadAvatar } = useProfile();
  const { unreadCount } = useNotifications();
  const [seeding, setSeeding] = useState(false);

  const handleSeedData = async () => {
    if (!user) return;
    if (!confirm('Apakah Anda yakin ingin memuat data sampel super lengkap untuk akun Anda? Seluruh data aset, tagihan, servis, dokumen, dan notifikasi Anda saat ini akan di-reset dengan data sampel baru.')) {
      return;
    }
    setSeeding(true);
    try {
      // 1. Clear Existing Records
      const { error: err1 } = await supabase.from('assets').delete().eq('user_id', user.id);
      if (err1) throw new Error('Gagal menghapus assets: ' + err1.message);

      const { error: err2 } = await supabase.from('bills').delete().eq('user_id', user.id);
      if (err2) throw new Error('Gagal menghapus bills: ' + err2.message);

      const { error: err3 } = await supabase.from('services').delete().eq('user_id', user.id);
      if (err3) throw new Error('Gagal menghapus services: ' + err3.message);

      const { error: err4 } = await supabase.from('legal_docs').delete().eq('user_id', user.id);
      if (err4) throw new Error('Gagal menghapus legal_docs: ' + err4.message);

      const { error: err5 } = await supabase.from('notifications').delete().eq('user_id', user.id);
      if (err5) throw new Error('Gagal menghapus notifications: ' + err5.message);

      // 2. Insert Bills
      const billsData = [
        {
          user_id: user.id,
          name: 'Tagihan PLN (Listrik Rumah)',
          category: 'listrik',
          amount: 450000,
          due_day: 20,
          due_date: '2026-05-20', // Due today
          status: 'unpaid',
          notes: 'Pembayaran pascabayar meteran listrik utama.'
        },
        {
          user_id: user.id,
          name: 'Langganan IndiHome 100Mbps',
          category: 'internet',
          amount: 385000,
          due_day: 15,
          due_date: '2026-06-15',
          status: 'paid',
          notes: 'Pembayaran internet + TV kabel keluarga.'
        },
        {
          user_id: user.id,
          name: 'Cicilan Mobil Honda HR-V',
          category: 'cicilan',
          amount: 4200000,
          due_day: 5,
          due_date: '2026-06-05',
          status: 'unpaid',
          notes: 'Cicilan ke-24 dari 60 bulan melalui BCA Finance.'
        },
        {
          user_id: user.id,
          name: 'Netflix Premium & Spotify Family',
          category: 'hiburan',
          amount: 256000,
          due_day: 28,
          due_date: '2026-05-28',
          status: 'unpaid',
          notes: 'Auto-debet kartu kredit Bank Mandiri.'
        },
        {
          user_id: user.id,
          name: 'Iuran Air Bersih PDAM',
          category: 'air',
          amount: 112000,
          due_day: 25,
          due_date: '2026-05-25',
          status: 'unpaid',
          notes: 'Jangan sampai terlambat biar tidak didenda.'
        }
      ];
      const { error: errIns1 } = await supabase.from('bills').insert(billsData);
      if (errIns1) throw new Error('Gagal memasukkan bills: ' + errIns1.message);

      // 3. Insert Legal Docs
      const legalDocsData = [
        {
          user_id: user.id,
          name: 'Surat Izin Mengemudi (SIM A)',
          doc_number: '3122-9876-0001',
          category: 'sim',
          expiry_date: '2028-09-12',
          amount: 120000,
          notes: 'Perpanjangan SIM mobil berkala di Polresta.'
        },
        {
          user_id: user.id,
          name: 'STNK Pajak Tahunan Honda HR-V',
          doc_number: 'B 1234 RFS',
          category: 'stnk',
          expiry_date: '2026-07-20',
          amount: 3650000,
          notes: 'Pajak kaleng dan perpanjangan STNK tahunan samsat.'
        },
        {
          user_id: user.id,
          name: 'Pajak Bumi & Bangunan (PBB) Rumah',
          doc_number: '31.74.050.003.012-0045',
          category: 'pbb',
          expiry_date: '2026-08-31',
          amount: 1450000,
          notes: 'Pembayaran PBB Jakarta Selatan tahun berjalan.'
        },
        {
          user_id: user.id,
          name: 'Paspor RI 48 Halaman',
          doc_number: 'B9876543',
          category: 'paspor',
          expiry_date: '2034-03-15',
          amount: 350000,
          notes: 'Paspor elektronik 10 tahun untuk perjalanan luar negeri.'
        }
      ];
      const { error: errIns2 } = await supabase.from('legal_docs').insert(legalDocsData);
      if (errIns2) throw new Error('Gagal memasukkan legal_docs: ' + errIns2.message);

      // 4. Insert Services
      const servicesData = [
        {
          user_id: user.id,
          name: 'Servis Rutin Berkala Mobil (10.000 km)',
          provider: 'Honda Megatama',
          interval_months: 6,
          last_service_date: '2025-12-15',
          next_service_date: '2026-06-15',
          notes: 'Ganti oli mesin, filter udara, kuras minyak rem, rotasi ban.'
        },
        {
          user_id: user.id,
          name: 'Perawatan Air Conditioner (AC) Rumah',
          provider: 'Jasa AC Mandiri',
          interval_months: 3,
          last_service_date: '2026-03-10',
          next_service_date: '2026-06-10',
          notes: 'Cuci AC 3 unit kamar dan ruang tamu agar tetap dingin.'
        },
        {
          user_id: user.id,
          name: 'Pembersihan Toren Air & Filter Utama',
          provider: 'CleanWater ID',
          interval_months: 4,
          last_service_date: '2026-02-01',
          next_service_date: '2026-06-01',
          notes: 'Pembersihan endapan toren air kapasitas 1000L.'
        }
      ];
      const { error: errIns3 } = await supabase.from('services').insert(servicesData);
      if (errIns3) throw new Error('Gagal memasukkan services: ' + errIns3.message);

      // 5. Insert Assets & Warranties
      const assetsData = [
        {
          user_id: user.id,
          name: 'MacBook Pro 14 M3 Pro',
          brand: 'Apple',
          category: 'Laptop',
          purchase_date: '2024-11-20',
          price: 35999000,
          notes: 'Laptop utama kerja desainer.'
        },
        {
          user_id: user.id,
          name: 'iPhone 15 Pro Max 256GB',
          brand: 'Apple',
          category: 'Smartphone',
          purchase_date: '2023-10-15',
          price: 23499000,
          notes: 'Garansi resmi iBox Indonesia.'
        },
        {
          user_id: user.id,
          name: 'Televisi LG OLED 55 Inch',
          brand: 'LG',
          category: 'Elektronik',
          purchase_date: '2022-05-01',
          price: 17999000,
          notes: 'TV utama ruang keluarga.'
        }
      ];
      const { data: insertedAssets, error: errIns4 } = await supabase
        .from('assets')
        .insert(assetsData)
        .select();
      if (errIns4) throw new Error('Gagal memasukkan assets: ' + errIns4.message);

      if (insertedAssets) {
        const macbook = insertedAssets.find(a => a.name === 'MacBook Pro 14 M3 Pro');
        const iphone = insertedAssets.find(a => a.name === 'iPhone 15 Pro Max 256GB');
        const tv = insertedAssets.find(a => a.name === 'Televisi LG OLED 55 Inch');

        const warrantiesData = [];
        if (macbook) {
          warrantiesData.push({
            asset_id: macbook.id,
            expiry_date: '2026-11-20',
            duration_months: 24,
            status: 'active'
          });
        }
        if (iphone) {
          warrantiesData.push({
            asset_id: iphone.id,
            expiry_date: '2026-05-25',
            duration_months: 12,
            status: 'expiring'
          });
        }
        if (tv) {
          warrantiesData.push({
            asset_id: tv.id,
            expiry_date: '2024-05-01',
            duration_months: 24,
            status: 'expired'
          });
        }
        const { error: errIns5 } = await supabase.from('warranties').insert(warrantiesData);
        if (errIns5) throw new Error('Gagal memasukkan warranties: ' + errIns5.message);

        // 6. Insert Notifications
        const notificationsData = [];
        if (iphone) {
          notificationsData.push({
            user_id: user.id,
            asset_id: iphone.id,
            type: 'expiring_7',
            is_read: false,
            sent_at: new Date('2026-05-20T10:00:00Z').toISOString()
          });
        }
        if (macbook) {
          notificationsData.push({
            user_id: user.id,
            asset_id: macbook.id,
            type: 'expiring_30',
            is_read: false,
            sent_at: new Date('2026-05-19T08:00:00Z').toISOString()
          });
        }
        if (tv) {
          notificationsData.push({
            user_id: user.id,
            asset_id: tv.id,
            type: 'expired',
            is_read: true,
            sent_at: new Date('2024-05-01T09:00:00Z').toISOString()
          });
        }

        if (notificationsData.length > 0) {
          const { error: errIns6 } = await supabase.from('notifications').insert(notificationsData);
          if (errIns6) throw new Error('Gagal memasukkan notifications: ' + errIns6.message);
        }
      }

      alert('Berhasil! Data sampel super lengkap berhasil dimuat ke database untuk akun Anda.');
      window.location.reload();
    } catch (e: any) {
      console.error(e);
      alert('Gagal memuat data: ' + e.message);
    } finally {
      setSeeding(false);
    }
  };

  // Basic Information input states
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state with database profile when loaded
  useEffect(() => {
    if (profile) {
      setName(profile.name ?? '');
      setWhatsapp(profile.whatsapp ?? '');
    }
  }, [profile]);

  // Save basic info to Supabase database
  const handleSaveBasicInfo = async () => {
    if (!isDirty) return;
    try {
      await updateProfile({
        name: name.trim(),
        whatsapp: whatsapp.trim()
      });
      setIsDirty(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  // Avatar file upload handler
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadAvatar(file);
    } catch (err) {
      console.error('Failed to upload avatar:', err);
      alert('Gagal mengunggah foto profil. Silakan coba lagi.');
    } finally {
      setUploading(false);
    }
  };

  // Notification Preference toggles (saved to LocalStorage for persistence)
  const [whatsappReminders, setWhatsappReminders] = useState(() => {
    return localStorage.getItem('pref_whatsapp_reminders') !== 'false';
  });
  const [emailSummaries, setEmailSummaries] = useState(() => {
    return localStorage.getItem('pref_email_summaries') === 'true';
  });

  const toggleWhatsapp = () => {
    const newVal = !whatsappReminders;
    setWhatsappReminders(newVal);
    localStorage.setItem('pref_whatsapp_reminders', String(newVal));
  };

  const toggleEmail = () => {
    const newVal = !emailSummaries;
    setEmailSummaries(newVal);
    localStorage.setItem('pref_email_summaries', String(newVal));
  };

  // Format subscription info
  const getSubText = () => {
    if (profile?.subscription_tier === 'premium') {
      const date = profile.created_at 
        ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : 'Oct 2023';
      return `Premium Member since ${date}`;
    }
    return 'Free Member';
  };

  return (
    <div className="min-h-full bg-[#F8F9FC] pb-24 relative flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 pt-6 pb-4 flex justify-between items-center shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <img 
            src={profile?.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.email || 'default'}`} 
            alt="Profil" 
            className="w-10 h-10 rounded-full object-cover border border-gray-100 bg-[#E8E7FD]" 
          />
          <span className="text-[#3525cd] font-extrabold text-lg tracking-wider">INGETIN</span>
        </div>
        <Link to="/notifikasi" className="relative p-2 hover:bg-gray-50 rounded-full transition-colors">
          <Bell size={22} className="text-[#3525cd]" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
          )}
        </Link>
      </div>

      {/* Avatar Section */}
      <div className="flex flex-col items-center mt-6 shrink-0">
        <div className="relative">
          {/* Avatar Ring Container */}
          <div className="w-[110px] h-[110px] bg-gradient-to-tr from-[#3525cd] to-[#60a5fa] rounded-full p-[3px] shadow-lg flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-full p-[3px] overflow-hidden flex items-center justify-center">
              {uploading ? (
                <div className="w-9 h-9 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
              ) : (
                <img 
                  src={profile?.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.email || 'default'}`} 
                  alt="Profil" 
                  className="w-full h-full rounded-full object-cover bg-[#E8E7FD]" 
                />
              )}
            </div>
          </div>
          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleAvatarChange} 
            className="hidden" 
            accept="image/*" 
          />
          {/* Pencil Edit Button */}
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-8.5 h-8.5 bg-[#3525cd] hover:bg-[#2b1ea8] text-white rounded-full flex items-center justify-center border-2 border-white cursor-pointer shadow-md hover:scale-105 active:scale-95 transition-all"
            title="Ubah Foto Profil"
          >
            <Pencil size={12} className="stroke-[2.5]" />
          </button>
        </div>

        {/* User Name & Membership */}
        <h2 className="text-lg font-extrabold text-gray-900 mt-4 text-center leading-tight">
          {profile?.name || user?.user_metadata?.full_name || 'Muhammad Fathi Rafa'}
        </h2>
        <p className="text-[10px] text-gray-400 font-bold text-center mt-1">
          {getSubText()}
        </p>
      </div>

      {/* Upgrade Premium Banner */}
      {profile?.subscription_tier !== 'premium' && (
        <div className="mx-5 mt-6 bg-indigo-600 rounded-[28px] p-5 relative overflow-hidden shadow-md shadow-indigo-600/10 shrink-0">
          {/* Transparent Shield Background */}
          <div className="absolute right-[-10px] bottom-[-20px] opacity-15 pointer-events-none">
            <Shield size={140} className="text-white fill-white/5" />
          </div>
          
          <div className="flex items-center gap-2 text-white/90 mb-1.5 relative z-10">
            <Shield size={14} className="text-white fill-white/10" />
            <span className="text-[9px] font-extrabold tracking-wider">UPGRADE TO PREMIUM</span>
          </div>
          
          <p className="text-white text-xs font-bold leading-normal max-w-[80%] mb-4 relative z-10">
            Get unlimited documents and proactive WhatsApp reminders.
          </p>
          
          <Link 
            to="/upgrade" 
            className="inline-block bg-white hover:bg-indigo-50 text-indigo-700 text-[10px] font-extrabold px-5 py-2.5 rounded-xl shadow-sm hover:scale-105 active:scale-95 transition-all relative z-10"
          >
            Unlock Now
          </Link>
        </div>
      )}

      {/* Ad Placement */}
      <AdBanner type="horizontal" className="mx-5 mt-6" />

      {/* Section: BASIC INFORMATION */}
      <span className="text-[10px] font-extrabold text-gray-400 tracking-wider px-5 mt-7 mb-3 block shrink-0">
        BASIC INFORMATION
      </span>
      <div className="mx-5 bg-white rounded-[30px] border border-gray-100 p-5 shadow-sm space-y-4 shrink-0">
        {/* Full Name */}
        <div>
          <label className="text-[10px] font-extrabold text-gray-400 mb-1.5 block">Full Name</label>
          <div className="bg-[#EEEDFC]/40 border border-[#DCDAFF]/40 rounded-2xl px-4 py-3 flex items-center gap-3 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500/80 transition-all">
            <User size={16} className="text-gray-400" />
            <input 
              type="text" 
              value={name} 
              onChange={(e) => {
                setName(e.target.value);
                setIsDirty(true);
              }}
              onBlur={handleSaveBasicInfo}
              placeholder="Full name"
              className="bg-transparent border-none outline-none w-full text-xs font-extrabold text-gray-800 placeholder-gray-400"
            />
          </div>
        </div>

        {/* WhatsApp Number */}
        <div>
          <label className="text-[10px] font-extrabold text-gray-400 mb-1.5 block">WhatsApp Number</label>
          <div className="bg-[#EEEDFC]/40 border border-[#DCDAFF]/40 rounded-2xl px-4 py-3 flex items-center gap-3 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500/80 transition-all">
            <Phone size={16} className="text-gray-400" />
            <input 
              type="text" 
              value={whatsapp} 
              onChange={(e) => {
                setWhatsapp(e.target.value);
                setIsDirty(true);
              }}
              onBlur={handleSaveBasicInfo}
              placeholder="+62 123 4567 890"
              className="bg-transparent border-none outline-none w-full text-xs font-extrabold text-gray-800 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="text-[10px] font-extrabold text-gray-400 mb-1.5 block">Email Address</label>
          <div className="bg-[#EEEDFC]/20 border border-[#DCDAFF]/20 rounded-2xl px-4 py-3 flex items-center gap-3 opacity-60">
            <Mail size={16} className="text-gray-400" />
            <input 
              type="email" 
              value={profile?.email || user?.email || ''} 
              disabled 
              className="bg-transparent border-none outline-none w-full text-xs font-extrabold text-gray-500 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Section: NOTIFICATION PREFERENCES */}
      <span className="text-[10px] font-extrabold text-gray-400 tracking-wider px-5 mt-7 mb-3 block shrink-0">
        NOTIFICATION PREFERENCES
      </span>
      <div className="mx-5 bg-white rounded-[30px] border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50 shrink-0">
        {/* WhatsApp Reminders */}
        <div className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#EDFDF5] text-[#059669] rounded-xl flex items-center justify-center shrink-0">
              <MessageSquare size={18} className="stroke-[2]" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-gray-900 leading-tight">WhatsApp Reminders</h4>
              <p className="text-[10px] text-gray-400 font-bold mt-0.5">Maintenance alerts via chat</p>
            </div>
          </div>
          {/* Toggle Switch */}
          <button 
            onClick={toggleWhatsapp}
            className={`w-11 h-6 rounded-full relative transition-colors duration-200 shrink-0 cursor-pointer ${
              whatsappReminders ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          >
            <span className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-200 ${
              whatsappReminders ? 'left-5.5' : 'left-0.5'
            }`} />
          </button>
        </div>

        {/* Email Summaries */}
        <div className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#EEEDFC] text-[#3525cd] rounded-xl flex items-center justify-center shrink-0">
              <AtSign size={18} className="stroke-[2]" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-gray-900 leading-tight">Email Summaries</h4>
              <p className="text-[10px] text-gray-400 font-bold mt-0.5">Weekly digest of tasks</p>
            </div>
          </div>
          {/* Toggle Switch */}
          <button 
            onClick={toggleEmail}
            className={`w-11 h-6 rounded-full relative transition-colors duration-200 shrink-0 cursor-pointer ${
              emailSummaries ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          >
            <span className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-200 ${
              emailSummaries ? 'left-5.5' : 'left-0.5'
            }`} />
          </button>
        </div>
      </div>

      {/* Section: ACTIVITY & HISTORY */}
      <span className="text-[10px] font-extrabold text-gray-400 tracking-wider px-5 mt-7 mb-3 block shrink-0">
        ACTIVITY & HISTORY
      </span>
      <div className="mx-5 bg-white rounded-[30px] border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50 shrink-0">
        <Link 
          to="/riwayat"
          className="flex items-center justify-between w-full p-4 hover:bg-gray-50/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#EEEDFC] text-[#3525cd] rounded-xl flex items-center justify-center shrink-0">
              <Clock size={18} className="stroke-[2]" />
            </div>
            <span className="text-xs font-extrabold text-gray-800 text-left">Activity History</span>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </Link>
        <Link 
          to="/dokumen"
          className="flex items-center justify-between w-full p-4 hover:bg-gray-50/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#EEEDFC] text-[#3525cd] rounded-xl flex items-center justify-center shrink-0">
              <FileText size={18} className="stroke-[2]" />
            </div>
            <span className="text-xs font-extrabold text-gray-800 text-left">Pusat Dokumen</span>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </Link>
      </div>

      {/* Section: SECURITY */}
      <span className="text-[10px] font-extrabold text-gray-400 tracking-wider px-5 mt-7 mb-3 block shrink-0">
        SECURITY
      </span>
      <div className="mx-5 bg-white rounded-[30px] border border-gray-100 p-4.5 shadow-sm shrink-0">
        <button 
          onClick={() => alert('Email reset kata sandi telah dikirimkan ke kotak masuk Anda. Silakan periksa email Anda.')}
          className="flex items-center justify-between w-full hover:bg-gray-50/50 rounded-2xl transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FDF2F2] text-[#E11D48] rounded-xl flex items-center justify-center shrink-0">
              <RotateCcw size={18} className="stroke-[2]" />
            </div>
            <span className="text-xs font-extrabold text-gray-800 text-left">Change Password</span>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </button>
      </div>

      {/* Section: DEVELOPER OPTIONS */}
      <span className="text-[10px] font-extrabold text-gray-400 tracking-wider px-5 mt-7 mb-3 block shrink-0">
        DEVELOPER OPTIONS
      </span>
      <div className="mx-5 bg-white rounded-[30px] border border-gray-100 p-4.5 shadow-sm shrink-0">
        <button 
          onClick={handleSeedData}
          disabled={seeding}
          className="flex items-center justify-between w-full hover:bg-gray-50/50 rounded-2xl transition-colors cursor-pointer disabled:opacity-55"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#EDFDF5] text-[#059669] rounded-xl flex items-center justify-center shrink-0">
              <Sparkles size={18} className="stroke-[2]" />
            </div>
            <span className="text-xs font-extrabold text-gray-800 text-left">
              {seeding ? 'Sedang Memuat Data...' : 'Muat Data Sampel Lengkap'}
            </span>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </button>
      </div>

      {/* Logout Button */}
      <div className="mx-5 mt-7 shrink-0">
        <button
          onClick={signOut}
          className="flex items-center justify-center gap-2 w-full border border-dashed border-[#E11D48]/35 bg-[#FDF2F2]/30 hover:bg-[#FDF2F2]/60 text-[#E11D48] text-xs font-extrabold py-4 rounded-3xl transition-all cursor-pointer"
        >
          <LogOut size={16} className="stroke-[2.5]" />
          Logout
        </button>
      </div>

      {/* App Version Info */}
      <span className="text-[10px] text-gray-400 font-bold text-center mt-7 block shrink-0">
        App Version 2.4.1 (Stable)
      </span>
    </div>
  );
}
