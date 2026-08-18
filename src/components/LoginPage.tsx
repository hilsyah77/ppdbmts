import React, { useState } from 'react';
import { UserAccount, ProfilMadrasahData, PengaturanSPMBData } from '../types';
import {
  Lock,
  User,
  ShieldCheck,
  AlertCircle,
  School,
  Key,
  ArrowRight,
  Eye,
  EyeOff,
  Building,
  Phone,
  Mail,
  CheckCircle,
  FileText,
  CreditCard,
  UserCheck
} from 'lucide-react';

interface LoginPageProps {
  profil: ProfilMadrasahData;
  pengaturan: PengaturanSPMBData;
  usersList: UserAccount[];
  onLogin: (user: UserAccount) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  profil,
  pengaturan,
  usersList,
  onLogin
}) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const namaMadrasah = profil.namaMadrasah || 'MTs Negeri 1 Model';
  const logoUrl = profil.logoUrl || '';
  const tahunAjaran = pengaturan.tahunAjaran || '2025/2026';
  const gelombangActive = pengaturan.gelombangActive || 'Gelombang 1';

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!usernameInput.trim() || !passwordInput.trim()) {
      setErrorMessage('Username dan Kata Sandi wajib diisi!');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const foundUser = usersList.find(
        (u) => u.username.toLowerCase() === usernameInput.trim().toLowerCase()
      );

      if (!foundUser) {
        setErrorMessage('Username tidak ditemukan di database pengguna SPMB.');
        setIsLoading(false);
        return;
      }

      if (!foundUser.isAktif) {
        setErrorMessage('Akun ini sedang dinonaktifkan oleh Administrator. Hubungi pihak madrasah.');
        setIsLoading(false);
        return;
      }

      if (foundUser.password && foundUser.password !== passwordInput.trim()) {
        setErrorMessage('Kata sandi yang Anda masukkan salah. Silakan coba lagi.');
        setIsLoading(false);
        return;
      }

      // Success login
      setIsLoading(false);
      onLogin(foundUser);
    }, 250);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white relative overflow-x-hidden font-sans">
      
      {/* Background Decorative Lighting */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none translate-y-1/2" />
      
      {/* Top Navigation Bar */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20 font-bold text-lg border border-emerald-400/30 overflow-hidden shrink-0">
              {logoUrl ? (
                <img src={logoUrl} alt={namaMadrasah} className="w-full h-full object-cover" />
              ) : (
                <School className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  {namaMadrasah}
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  SPMB TA {tahunAjaran}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Sistem Penerimaan Murid Baru Terpadu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>{gelombangActive}</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 w-full items-center">
          
          {/* Left Column: Madrasah Branding & Information Overview */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Main Greeting / Title */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Portal Autentikasi Pengguna Terintegrasi</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Selamat Datang di Portal <span className="text-emerald-400">SPMB</span> {namaMadrasah}
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                Sistem Penerimaan Murid Baru (SPMB) Tahun Ajaran {tahunAjaran}. Silakan masukkan username dan kata sandi akun resmi Anda untuk mengakses sistem pengelolaan, pendaftaran, dan informasi SPMB.
              </p>
            </div>

            {/* Information Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <UserCheck className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-200">Hak Akses Berjenjang</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Pengelolaan sistem aman dengan pembagian peran Admin, Panitia SPMB, Bendahara, dan Calon Siswa.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <FileText className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-200">Verifikasi & Formulir Cetak</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Pencatatan berkas fisik pendaftar dan cetak formulir pendaftaran serta rincian daftar ulang resmi.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-200">Kasir & Kuitansi Pembayaran</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Pencatatan transaksi pembayaran daftar ulang, biaya seragam, dan penerbitan bukti kuitansi digital.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-200">Data Realtime & Akurat</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Pemantauan kuota jalur pendaftaran, status seleksi siswa, dan jadwal piket panitia secara real-time.
                </p>
              </div>
            </div>

            {/* Footer School Contacts Pill */}
            <div className="pt-2 flex items-center gap-4 flex-wrap text-xs text-slate-400 border-t border-slate-800/80">
              {profil.telepon && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{profil.telepon}</span>
                </div>
              )}
              {profil.email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{profil.email}</span>
                </div>
              )}
              {profil.alamatLengkap && (
                <div className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="truncate max-w-xs">{profil.alamatLengkap}</span>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Secure Login Card */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-slate-900 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-slate-950/80 relative overflow-hidden backdrop-blur-xl">
              
              {/* Card Header */}
              <div className="mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/10">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Login ke Sistem SPMB
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Masukkan identitas kredensial akun Anda untuk mengakses aplikasi.
                </p>
              </div>

              {/* Error Message Box */}
              {errorMessage && (
                <div className="mb-5 p-3.5 bg-rose-500/15 border border-rose-500/40 rounded-2xl text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in zoom-in duration-150">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{errorMessage}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                
                {/* Username Field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Nama Pengguna (Username)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      placeholder="Masukkan nama pengguna"
                      className="w-full pl-10 pr-3.5 py-3 bg-slate-800/90 border border-slate-700/80 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-medium"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Kata Sandi (Password)
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Masukkan kata sandi akun"
                      className="w-full pl-10 pr-10 py-3 bg-slate-800/90 border border-slate-700/80 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 p-1 text-slate-400 hover:text-slate-200 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-75 text-white font-bold rounded-2xl text-xs sm:text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/30 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Memverifikasi Akun...</span>
                    </div>
                  ) : (
                    <>
                      <span>Masuk ke Aplikasi</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>

              {/* Card Footer Note */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 text-center">
                <span>Pastikan Anda menjaga kerahasiaan akun dan kata sandi Anda.</span>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/90 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} {namaMadrasah}. Sistem Informasi SPMB Online.</span>
          <span className="text-emerald-500 font-medium">Role-Based Access Control • v2.5</span>
        </div>
      </footer>

    </div>
  );
};
