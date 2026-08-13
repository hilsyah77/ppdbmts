import React, { useState } from 'react';
import { UserAccount, ProfilMadrasahData, PengaturanPPDBData, UserRole } from '../types';
import {
  Lock,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  School,
  Key,
  Users,
  CreditCard,
  GraduationCap,
  Sparkles,
  ArrowRight,
  LogOut
} from 'lucide-react';

interface ModalLoginProps {
  profil?: ProfilMadrasahData;
  pengaturan?: PengaturanPPDBData;
  usersList: UserAccount[];
  currentUser?: UserAccount | null;
  onLogin?: (user: UserAccount) => void;
  onLoginSuccess?: (user: UserAccount) => void;
  onLogout?: () => void;
  onClose?: () => void;
  isForceShow?: boolean;
}

export const ModalLogin: React.FC<ModalLoginProps> = ({
  profil,
  pengaturan,
  usersList = [],
  currentUser = null,
  onLogin,
  onLoginSuccess,
  onLogout,
  onClose,
  isForceShow = false
}) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedRoleTab, setSelectedRoleTab] = useState<UserRole>('admin');

  const namaMadrasah = profil?.namaMadrasah || 'MTs Negeri 1 Model';
  const logoUrl = profil?.logoUrl || '';
  const tahunAjaran = pengaturan?.tahunAjaran || '2025/2026';

  const triggerLoginSuccess = (user: UserAccount) => {
    if (onLogin) onLogin(user);
    if (onLoginSuccess) onLoginSuccess(user);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!usernameInput.trim() || !passwordInput.trim()) {
      setErrorMessage('Username dan Kata Sandi wajib diisi!');
      return;
    }

    const foundUser = usersList.find(
      (u) => u.username.toLowerCase() === usernameInput.trim().toLowerCase()
    );

    if (!foundUser) {
      setErrorMessage('Username tidak ditemukan di sistem.');
      return;
    }

    if (!foundUser.isAktif) {
      setErrorMessage('Akun ini sedang dinonaktifkan oleh Administrator.');
      return;
    }

    if (foundUser.password && foundUser.password !== passwordInput.trim()) {
      setErrorMessage('Kata sandi yang Anda masukkan salah.');
      return;
    }

    // Success login
    triggerLoginSuccess(foundUser);
    setUsernameInput('');
    setPasswordInput('');
  };

  const handleQuickLogin = (role: UserRole) => {
    const roleUser = usersList.find((u) => u.role === role && u.isAktif);
    if (roleUser) {
      triggerLoginSuccess(roleUser);
    } else {
      setErrorMessage(`Akun contoh dengan role ${role.toUpperCase()} tidak ditemukan.`);
    }
  };

  const roleDescriptions = [
    {
      role: 'admin' as UserRole,
      title: '1. Administrator / Kepala Madrasah',
      badge: 'Akses Penuh (Full Control)',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      icon: ShieldCheck,
      iconColor: 'text-emerald-400',
      desc: 'Memiliki semua hak akses: Kelola Pendaftar, Verifikasi, Keuangan/Pembayaran, Profil, Pengaturan PPDB & Manajemen User.'
    },
    {
      role: 'panitia' as UserRole,
      title: '2. Panitia & Verifikator PPDB',
      badge: 'Verifikasi & Data',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      icon: Users,
      iconColor: 'text-blue-400',
      desc: 'Dapat menambah & edit pendaftar, memverifikasi berkas fisik, menginput jadwal piket, dan mencetak formulir PPDB.'
    },
    {
      role: 'bendahara' as UserRole,
      title: '3. Bendahara Keuangan',
      badge: 'Kasir & Keuangan',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: CreditCard,
      iconColor: 'text-amber-400',
      desc: 'Khusus mengelola pembayaran pendaftaran, potongan/diskon, penerimaan kasir, serta mencetak kuitansi resmi.'
    },
    {
      role: 'siswa' as UserRole,
      title: '4. Calon Siswa / Wali Murid',
      badge: 'Portal Pendaftar',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      icon: GraduationCap,
      iconColor: 'text-purple-400',
      desc: 'Akses publik terbatas untuk mengecek status pendaftaran, melihat jadwal pengumuman, dan mencetak formulir mandiri.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col md:flex-row my-auto">
        
        {/* Left Side: Madrasah Branding & Role Selection */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border-b md:border-b-0 md:border-r border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-xl shadow-emerald-600/20 font-bold text-xl border border-emerald-400/30 overflow-hidden shrink-0">
                {logoUrl ? (
                  <img src={logoUrl} alt={namaMadrasah} className="w-full h-full object-cover" />
                ) : (
                  <School className="w-7 h-7" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-100 leading-tight">
                  {namaMadrasah}
                </h2>
                <p className="text-xs text-emerald-400 font-medium">
                  Sistem PPDB TA {tahunAjaran}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Modul Autentikasi Multi-Pengguna</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Sistem dilengkapi dengan pembagian hak akses (Role-Based Access Control) untuk menjaga keamanan dan ketertiban pengelolaan data PPDB.
              </p>
            </div>

            {/* Role Switcher Demo Cards */}
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Pilih Akun Demo (1-Click Login):
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {roleDescriptions.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.role}
                      type="button"
                      onClick={() => handleQuickLogin(item.role)}
                      className="p-2.5 rounded-xl border border-slate-800 bg-slate-800/50 hover:bg-emerald-900/30 hover:border-emerald-500/50 text-left transition-all duration-150 group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-slate-200 group-hover:text-emerald-300">
                          {item.role === 'admin' && 'Administrator'}
                          {item.role === 'panitia' && 'Panitia PPDB'}
                          {item.role === 'bendahara' && 'Bendahara'}
                          {item.role === 'siswa' && 'Siswa / Wali'}
                        </span>
                        <Icon className={`w-3.5 h-3.5 ${item.iconColor}`} />
                      </div>
                      <span className="text-[10px] text-slate-400 block truncate">
                        Username: <code className="text-emerald-400 font-mono font-bold">{item.role}</code>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/60 text-[11px] text-slate-500 flex items-center justify-between">
            <span>PPDB Online Madrasah</span>
            <span className="text-emerald-500 font-semibold">v2.5 Role-Based</span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-center bg-slate-900">
          
          {currentUser && !isForceShow ? (
            // LOGGED IN STATE INFORMATION
            <div className="space-y-5 text-center py-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Terautentikasi: {currentUser.role.toUpperCase()}
                </span>
                <h3 className="text-lg font-bold text-slate-100 mt-2">
                  {currentUser.namaLengkap}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{currentUser.jabatan}</p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
                {onClose && (
                  <button
                    onClick={onClose}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-lg"
                  >
                    Masuk ke Dashboard App
                  </button>
                )}
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-rose-400 font-bold rounded-xl text-xs transition-colors border border-slate-700 flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar / Ganti Akun</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            // LOGIN FORM
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-emerald-400" />
                  <span>Login Pengguna</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Masukkan username dan kata sandi akun Anda untuk mengakses sistem.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Nama Pengguna (Username)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      placeholder="Contoh: admin, panitia, bendahara, siswa"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium"
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Kata Sandi (Password)
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Masukkan kata sandi (Default: 123)"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                  💡 <span className="font-semibold text-slate-300">Info Akses Demo:</span> Gunakan password <code className="text-emerald-400 font-mono font-bold">123</code> untuk semua akun contoh di atas.
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <span>Masuk ke Sistem</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
