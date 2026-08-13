import React from 'react';
import {
  LayoutDashboard,
  School,
  Users,
  CalendarCheck,
  Receipt,
  Settings,
  ShieldCheck
} from 'lucide-react';
import { UserAccount, UserRole } from '../types';

export type ActiveTab = 'dashboard' | 'profil' | 'pendaftar' | 'piket' | 'pembayaran' | 'pengaturan';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingCount: number;
  totalCount: number;
  currentUser: UserAccount | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingCount,
  totalCount,
  currentUser
}) => {
  const role: UserRole = currentUser?.role || 'admin';

  const allMenuItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: role === 'siswa' ? 'Portal Calon Siswa' : 'Dashboard Utama',
      sublabel: role === 'siswa' ? 'Status & Ringkasan PPDB' : 'Jalur, Statistik & Piket',
      icon: LayoutDashboard,
      badge: null,
      allowedRoles: ['admin', 'panitia', 'bendahara', 'siswa']
    },
    {
      id: 'profil' as ActiveTab,
      label: 'Profil Madrasah',
      sublabel: 'Informasi MTs & Visi Misi',
      icon: School,
      badge: null,
      allowedRoles: ['admin', 'panitia', 'bendahara', 'siswa']
    },
    {
      id: 'pendaftar' as ActiveTab,
      label: role === 'siswa' ? 'Status Pendaftaran' : 'Data Pendaftar',
      sublabel: role === 'siswa' ? 'Cek NISN & Cetak Form' : 'Daftar, Verifikasi & Cetak',
      icon: Users,
      badge: role === 'siswa' ? 'Cek NISN' : pendingCount > 0 ? `${pendingCount} Perlu Verifikasi` : `${totalCount} Siswa`,
      allowedRoles: ['admin', 'panitia', 'bendahara', 'siswa']
    },
    {
      id: 'pembayaran' as ActiveTab,
      label: 'Pembayaran PPDB',
      sublabel: 'Kasir, Biaya & Kuitansi',
      icon: Receipt,
      badge: 'Keuangan',
      allowedRoles: ['admin', 'bendahara']
    },
    {
      id: 'piket' as ActiveTab,
      label: 'Jadwal Piket Panitia',
      sublabel: 'Petugas Piket & Shift',
      icon: CalendarCheck,
      badge: 'Aktif',
      allowedRoles: ['admin', 'panitia']
    },
    {
      id: 'pengaturan' as ActiveTab,
      label: 'Pengaturan System',
      sublabel: 'User, Kuota & Tahun Ajaran',
      icon: Settings,
      badge: 'Admin',
      allowedRoles: ['admin']
    }
  ];

  const visibleMenuItems = allMenuItems.filter((item) =>
    item.allowedRoles.includes(role)
  );

  return (
    <aside className="w-full lg:w-64 xl:w-72 bg-white border-r border-slate-200 lg:min-h-[calc(100vh-61px)] flex flex-col justify-between p-4 shrink-0">
      <div className="space-y-1">
        
        {/* Role Header Banner */}
        <div className="px-3 py-2.5 mb-2 bg-slate-900 text-white rounded-xl flex items-center justify-between shadow-sm border border-slate-800">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">
              Hak Akses Role:
            </span>
            <span className="text-xs font-bold text-emerald-400 uppercase">
              {role === 'admin' && 'Administrator'}
              {role === 'panitia' && 'Panitia PPDB'}
              {role === 'bendahara' && 'Bendahara'}
              {role === 'siswa' && 'Calon Siswa / Wali'}
            </span>
          </div>
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        </div>

        <nav className="space-y-1">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100/80 hover:text-emerald-700'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-emerald-700/50 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{item.label}</div>
                    <div
                      className={`text-[11px] truncate ${
                        isActive ? 'text-emerald-100' : 'text-slate-500'
                      }`}
                    >
                      {item.sublabel}
                    </div>
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-1 shrink-0 ${
                      isActive
                        ? 'bg-white/20 text-white border border-white/30'
                        : item.id === 'pendaftar' && pendingCount > 0
                        ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Admin Information Footer Box */}
      <div className="mt-6 p-3 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl text-white text-xs border border-slate-700 space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Informasi Pengguna</span>
        </div>
        <p className="text-slate-300 text-[11px] leading-relaxed">
          Logged as: <strong className="text-emerald-300">@{currentUser?.username || 'admin'}</strong> ({currentUser?.namaLengkap || 'Administrator'}).
        </p>
      </div>
    </aside>
  );
};
