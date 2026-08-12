import React from 'react';
import {
  LayoutDashboard,
  School,
  Users,
  CalendarCheck,
  Receipt,
  Settings,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'profil' | 'pendaftar' | 'piket' | 'pembayaran' | 'pengaturan';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingCount: number;
  totalCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingCount,
  totalCount
}) => {
  const menuItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard Utama',
      sublabel: 'Jalur, Statistik & Jadwal Piket',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'profil' as ActiveTab,
      label: 'Profil Madrasah',
      sublabel: 'Informasi MTs & Visi Misi',
      icon: School,
      badge: null
    },
    {
      id: 'pendaftar' as ActiveTab,
      label: 'Data Pendaftar',
      sublabel: 'Daftar, Verifikasi & Cetak',
      icon: Users,
      badge: pendingCount > 0 ? `${pendingCount} Perlu Verifikasi` : `${totalCount} Siswa`
    },
    {
      id: 'pembayaran' as ActiveTab,
      label: 'Pembayaran PPDB',
      sublabel: 'Rincian Putra/Putri & Kuitansi',
      icon: Receipt,
      badge: 'Keuangan'
    },
    {
      id: 'piket' as ActiveTab,
      label: 'Jadwal Piket Panitia',
      sublabel: 'Jadwal Petugas Penginputan',
      icon: CalendarCheck,
      badge: 'Aktif'
    },
    {
      id: 'pengaturan' as ActiveTab,
      label: 'Pengaturan PPDB',
      sublabel: 'Tahun Ajaran, Kuota & Kop',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <aside className="w-full lg:w-64 bg-white border-r border-slate-200 lg:min-h-[calc(100vh-61px)] flex flex-col justify-between p-4 shrink-0">
      <div className="space-y-1">
        <div className="px-3 py-2 mb-2">
          <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Menu Utama Admin PPDB
          </p>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
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
          <span>Sistem Online Panitia</span>
        </div>
        <p className="text-slate-300 text-[11px] leading-relaxed">
          Hak Akses Admin Panitia PPDB MTs. Pastikan seluruh berkas pendaftar diverifikasi sesuai Juknis Kemenag.
        </p>
      </div>
    </aside>
  );
};
