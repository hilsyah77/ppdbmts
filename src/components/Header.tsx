import React from 'react';
import { School, Calendar, Users, CheckCircle2, Clock, ShieldCheck, RefreshCw } from 'lucide-react';
import { ProfilMadrasahData, PengaturanPPDBData } from '../types';

interface HeaderProps {
  profil: ProfilMadrasahData;
  pengaturan: PengaturanPPDBData;
  totalPendaftar: number;
  totalTerverifikasi: number;
  totalPending: number;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profil,
  pengaturan,
  totalPendaftar,
  totalTerverifikasi,
  totalPending,
  onResetData
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-lg font-bold text-lg border border-emerald-400/30 overflow-hidden shrink-0">
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
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  PPDB TA {pengaturan.tahunAjaran}
                </span>
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {pengaturan.gelombangActive}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Sistem Informasi Penerimaan Peserta Didik Baru tingkat Madrasah Tsanawiyah (MTs)
              </p>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center gap-3 text-xs flex-wrap">
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <Users className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-slate-400 block text-[10px]">Total Pendaftar</span>
                <span className="font-bold text-slate-100">{totalPendaftar} Siswa</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <div>
                <span className="text-slate-400 block text-[10px]">Terverifikasi</span>
                <span className="font-bold text-emerald-400">{totalTerverifikasi} Siswa</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <Clock className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-slate-400 block text-[10px]">Pending / Belum</span>
                <span className="font-bold text-amber-400">{totalPending} Siswa</span>
              </div>
            </div>

            <button
              onClick={onResetData}
              title="Reset ke Data Bawaan Sistem"
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-xs">Reset Data</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
