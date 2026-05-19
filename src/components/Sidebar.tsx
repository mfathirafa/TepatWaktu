import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Scale, 
  Receipt, 
  Wrench, 
  ShieldCheck, 
  FileText, 
  History,
  Settings,
  HelpCircle,
  PlusCircle
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/pajak', label: 'Pajak & Legal', icon: Scale },
    { path: '/tagihan', label: 'Tagihan', icon: Receipt },
    { path: '/servis', label: 'Servis', icon: Wrench },
    { path: '/garansi', label: 'Garansi', icon: ShieldCheck },
    { path: '/dokumen', label: 'Dokumen', icon: FileText },
    { path: '/riwayat', label: 'Riwayat', icon: History },
  ];

  return (
    <aside className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-blue-600 text-white p-1.5 rounded-lg">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight text-blue-900 tracking-tight">INGETIN</h1>
          <p className="text-[10px] text-slate-500 font-semibold tracking-wider">LIFECYCLE ASSISTANT</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || (location.pathname === '/' && item.path === '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-blue-100/50 text-blue-700' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
              {item.label}
            </Link>
          );
        })}

        <div className="pt-4 pb-2">
          <button className="w-full bg-blue-700 hover:bg-blue-800 text-white rounded-lg py-2.5 px-4 flex items-center justify-center gap-2 text-sm font-medium transition-colors">
            <PlusCircle size={18} />
            Add Reminder
          </button>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-200 space-y-1">
        <Link to="/pengaturan" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          location.pathname === '/pengaturan' ? 'bg-blue-100/50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
        }`}>
          <Settings size={18} className={location.pathname === '/pengaturan' ? 'text-blue-600' : 'text-slate-400'} />
          Settings
        </Link>
        <Link to="/support" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
          <HelpCircle size={18} className="text-slate-400" />
          Support
        </Link>
      </div>
    </aside>
  );
}
