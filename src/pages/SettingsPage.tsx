import { useState } from 'react';
import { Camera, ChevronRight, LogOut, Bell, Lock, Star, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function SettingsPage() {
  const { profile, signOut } = useAuth();
  const [name, setName] = useState(profile?.name ?? '');

  return (
    <div className="min-h-full bg-[#F8F9FC] pb-6">
      {/* Header */}
      <div className="bg-indigo-700 px-5 pt-12 pb-16 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-36 h-36 bg-indigo-600/40 rounded-full" />
        <h1 className="text-white text-lg font-bold relative z-10">Pengaturan</h1>
      </div>

      {/* Avatar */}
      <div className="flex justify-center -mt-10 mb-4 relative z-10">
        <div className="relative">
          <div className="w-20 h-20 bg-indigo-200 rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
            <User size={32} className="text-indigo-700" />
          </div>
          <button className="absolute bottom-0 right-0 w-7 h-7 bg-indigo-700 rounded-full flex items-center justify-center border-2 border-white">
            <Camera size={12} className="text-white" />
          </button>
        </div>
      </div>
      <p className="text-center font-bold text-gray-900 text-base">{profile?.name ?? 'Pengguna'}</p>
      <p className="text-center text-gray-400 text-xs mt-0.5 mb-6">{profile?.email ?? ''}</p>

      {/* Premium Banner */}
      <div className="mx-4 mb-5 bg-indigo-700 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center">
          <Star size={18} className="text-yellow-300" />
        </div>
        <div className="flex-1">
          <p className="text-white font-bold text-sm">Upgrade ke Premium</p>
          <p className="text-indigo-200 text-[10px]">Notifikasi WA tak terbatas & cloud backup.</p>
        </div>
        <Link to="/upgrade" className="bg-white text-indigo-700 font-bold text-[10px] px-3 py-1.5 rounded-lg">
          Mulai
        </Link>
      </div>

      {/* Profile Form */}
      <div className="mx-4 mb-4 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <p className="text-sm font-bold text-gray-800 mb-3">Edit Profil</p>
        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-semibold text-gray-500 mb-1 block uppercase tracking-wide">Nama Lengkap</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border border-gray-200 bg-gray-50 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          <div>
            <label className="text-[10px] font-semibold text-gray-500 mb-1 block uppercase tracking-wide">Email</label>
            <input
              value={profile?.email ?? ''}
              disabled
              className="w-full border border-gray-200 bg-gray-100 rounded-xl py-2.5 px-3.5 text-sm text-gray-500 cursor-not-allowed"
            />
          </div>
        </div>
        <button className="w-full mt-4 bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-sm">
          Simpan Perubahan
        </button>
      </div>

      {/* Menu Items */}
      <div className="mx-4 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
        {[
          { icon: <Lock size={16} />, label: 'Keamanan & Password', color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { icon: <Bell size={16} />, label: 'Preferensi Notifikasi', color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((item,i) => (
          <button key={i} className="flex items-center gap-3 w-full px-4 py-3.5 hover:bg-gray-50 transition-colors">
            <div className={`w-8 h-8 ${item.bg} ${item.color} rounded-xl flex items-center justify-center`}>{item.icon}</div>
            <span className="text-sm font-semibold text-gray-700 flex-1 text-left">{item.label}</span>
            <ChevronRight size={15} className="text-gray-400" />
          </button>
        ))}
      </div>

      {/* Logout */}
      <div className="mx-4 mt-4">
        <button
          onClick={signOut}
          className="flex items-center justify-center gap-2 w-full border border-red-200 text-red-600 font-bold py-3 rounded-2xl text-sm hover:bg-red-50 transition-colors"
        >
          <LogOut size={16} /> Keluar dari Akun
        </button>
      </div>
    </div>
  );
}
