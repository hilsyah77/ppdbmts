import React from 'react';
import { School, Calendar, Users, CheckCircle2, Clock, ShieldCheck, User, LogOut, KeyRound } from 'lucide-react';
import { ProfilMadrasahData, PengaturanPPDBData, UserAccount } from '../types';

interface HeaderProps {
  profil: ProfilMadrasahData;
  pengaturan: PengaturanPPDBData;
  totalPendaftar: number;
  totalTerverifikasi: number;
  totalPending: number;
  currentUser: UserAccount | null;
  onOpenLoginModal: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profil,
  pengaturan,
  totalPendaftar,
  totalTerverifikasi,
  totalPending,
  currentUser,
  onOpenLoginModal,
  onLogout
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-5 lg:px-8 py-2.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg font-bold text-lg border border-emerald-400/30 overflow-hidden shrink-0">
              {profil.logoUrl ? (
                <img src={profil.logoUrl} alt={profil.namaMadrasah} className="w-full h-full object-cover" />
              ) : (
                <School className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-100">
                  {profil.namaMadrasah}
                </h1>
                <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  PPDB TA {pengaturan.tahunAjaran}
                </span>
                <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {pengaturan.gelombangActive}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Sistem Informasi Penerimaan Peserta Didik Baru (Sistem Multi-Pengguna)
              </p>
            </div>
          </div>

          {/* User Account Info & Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs flex-wrap justify-between md:justify-end">
            
            {/* Quick Metrics (Hidden on small screens to keep header clean) */}
            <div className="hidden xl:flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <div>
                <span className="text-slate-400 block text-[9px]">Total Siswa</span>
                <span className="font-bold text-slate-100">{totalPendaftar}</span>
              </div>
            </div>

            {/* User Account Pill */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl">
                <div className="w-7 h-7 rounded-lg bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-xs shrink-0">
                  {currentUser.namaLengkap.charAt(0)}
                </div>
                <div className="text-left min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-100 text-xs truncate max-w-[120px] sm:max-w-[160px]">
                      {currentUser.namaLengkap}
                    </span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${
                        currentUser.role === 'admin'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : currentUser.role === 'panitia'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : currentUser.role === 'bendahara'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}
                    >
                      {currentUser.role}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block truncate">
                    @{currentUser.username} • {currentUser.jabatan || 'Pengguna'}
                  </span>
                </div>

                <button
                  onClick={onOpenLoginModal}
                  className="ml-1 p-1.5 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 rounded-lg transition-colors"
                  title="Ganti Peran / Modal Login"
                >
                  <KeyRound className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-md flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login Pengguna</span>
              </button>
            )}

            {currentUser && (
              <button
                onClick={onLogout}
                className="p-2 bg-slate-800 hover:bg-rose-950/50 hover:text-rose-400 text-slate-400 border border-slate-700 hover:border-rose-800/60 rounded-xl transition-colors"
                title="Keluar / Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
