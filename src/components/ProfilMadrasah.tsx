import React, { useState, useRef } from 'react';
import { ProfilMadrasahData } from '../types';
import { ConfirmDialog, ConfirmDialogState } from './ConfirmDialog';
import { showNotification } from '../utils/notification';
import {
  School,
  Building,
  UserCheck,
  MapPin,
  Phone,
  Mail,
  Globe,
  Save,
  CheckCircle,
  FileText,
  Image as ImageIcon,
  Upload,
  Trash2,
  Camera,
  Link as LinkIcon,
  FileType,
  Printer,
  Sparkles
} from 'lucide-react';

interface ProfilMadrasahProps {
  profil: ProfilMadrasahData;
  onSave: (updatedProfil: ProfilMadrasahData) => void;
}

export const ProfilMadrasah: React.FC<ProfilMadrasahProps> = ({ profil, onSave }) => {
  const [formData, setFormData] = useState<ProfilMadrasahData>(profil);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isKopDragOver, setIsKopDragOver] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const kopInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setConfirmDialog({
        isOpen: true,
        title: 'Format File Tidak Sesuai',
        message: 'Harap pilih berkas gambar yang valid (format PNG, JPG, SVG, atau WebP).',
        type: 'warning',
        isAlertOnly: true,
        confirmText: 'Mengerti',
        onConfirm: () => {}
      });
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setConfirmDialog({
        isOpen: true,
        title: 'Ukuran File Terlalu Besar',
        message: 'Ukuran berkas logo madrasah maksimal 3 MB.',
        type: 'warning',
        isAlertOnly: true,
        confirmText: 'Mengerti',
        onConfirm: () => {}
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormData((prev) => ({ ...prev, logoUrl: event.target!.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setConfirmDialog({
        isOpen: true,
        title: 'Format File Tidak Sesuai',
        message: 'Harap pilih berkas gambar banner yang valid (format PNG, JPG, atau WebP).',
        type: 'warning',
        isAlertOnly: true,
        confirmText: 'Mengerti',
        onConfirm: () => {}
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setConfirmDialog({
        isOpen: true,
        title: 'Ukuran File Terlalu Besar',
        message: 'Ukuran berkas banner website maksimal 5 MB.',
        type: 'warning',
        isAlertOnly: true,
        confirmText: 'Mengerti',
        onConfirm: () => {}
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormData((prev) => ({ ...prev, bannerUrl: event.target!.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const processKopFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setConfirmDialog({
        isOpen: true,
        title: 'Format File Tidak Sesuai',
        message: 'Harap pilih berkas gambar kop surat yang valid (format JPG, PNG, atau WebP).',
        type: 'warning',
        isAlertOnly: true,
        confirmText: 'Mengerti',
        onConfirm: () => {}
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setConfirmDialog({
        isOpen: true,
        title: 'Ukuran File Terlalu Besar',
        message: 'Ukuran berkas gambar scan kop surat resmi maksimal 5 MB.',
        type: 'warning',
        isAlertOnly: true,
        confirmText: 'Mengerti',
        onConfirm: () => {}
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormData((prev) => ({ ...prev, kopSuratUrl: event.target!.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleKopFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processKopFile(file);
    }
  };

  const handleKopDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsKopDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processKopFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSaveSuccess(true);
    showNotification('Profil Madrasah Berhasil Disimpan', 'Data identitas, logo, kop surat, dan informasi madrasah telah diperbarui.', 'success');
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 w-full">
      
      {/* Title */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
            <School className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Pengaturan Profil Madrasah</h2>
            <p className="text-xs text-slate-500">
              Profil resmi {formData.namaMadrasah} yang digunakan pada formulir pendaftaran, kop surat, dan portal informasi siswa.
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Perubahan Profil</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>Profil Madrasah berhasil diperbarui dan disimpan ke dalam sistem!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Logo, Kop Surat & Banner Upload Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              <span>Upload Berkas Identitas Madrasah (Logo, Kop Surat & Banner)</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">
              Mendukung format gambar <strong className="text-slate-700 font-bold">JPG, PNG, WebP</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. Upload Logo Sekolah */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Logo Resmi Sekolah / Madrasah</h4>
                  <p className="text-[11px] text-slate-500">
                    Ditampilkan pada header navigasi, dashboard, dan dokumen resmi.
                  </p>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Logo Resmi
                </span>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <div className="w-20 h-20 rounded-2xl bg-white border-2 border-slate-300 flex items-center justify-center p-1.5 shadow-sm overflow-hidden shrink-0 relative group">
                  {formData.logoUrl ? (
                    <img
                      src={formData.logoUrl}
                      alt="Logo Sekolah"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <School className="w-10 h-10 text-slate-400" />
                  )}
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="absolute inset-0 bg-slate-900/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
                  >
                    <Camera className="w-5 h-5 mb-0.5" />
                    <span className="text-[9px] font-bold">Ganti</span>
                  </button>
                </div>

                <div className="space-y-2 flex-1">
                  <input
                    type="file"
                    ref={logoInputRef}
                    onChange={handleLogoFileChange}
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                    className="hidden"
                  />

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Logo</span>
                    </button>

                    {formData.logoUrl && (
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, logoUrl: '' }))}
                        className="px-2.5 py-1.5 bg-slate-200 hover:bg-rose-100 hover:text-rose-700 text-slate-700 font-bold rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    )}
                  </div>

                  <p className="text-[10px] text-slate-500">
                    Format: PNG, JPG (Maks. 3MB). Disarankan PNG transparan.
                  </p>
                </div>
              </div>

              {/* Direct URL Fallback Option */}
              <div className="pt-2 border-t border-slate-200/80">
                <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                  <LinkIcon className="w-3 h-3 text-slate-400" />
                  <span>Atau gunakan Link URL Logo Gambar:</span>
                </label>
                <input
                  type="text"
                  name="logoUrl"
                  value={formData.logoUrl || ''}
                  onChange={handleChange}
                  placeholder="https://domain.com/logo.png"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* 2. Upload Banner Madrasah */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Gambar Sampul Banner Gedung</h4>
                  <p className="text-[11px] text-slate-500">
                    Ditampilkan sebagai latar header profil madrasah & portal.
                  </p>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-100 text-blue-800 border border-blue-200">
                  Sampul Header
                </span>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <div className="w-28 h-20 rounded-xl bg-slate-800 border border-slate-300 flex items-center justify-center shadow-sm overflow-hidden shrink-0 relative group">
                  {formData.bannerUrl ? (
                    <img
                      src={formData.bannerUrl}
                      alt="Banner"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-slate-500" />
                  )}
                  <button
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                    className="absolute inset-0 bg-slate-900/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
                  >
                    <Camera className="w-5 h-5 mb-0.5" />
                    <span className="text-[9px] font-bold">Ganti Sampul</span>
                  </button>
                </div>

                <div className="space-y-2 flex-1">
                  <input
                    type="file"
                    ref={bannerInputRef}
                    onChange={handleBannerFileChange}
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="hidden"
                  />

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => bannerInputRef.current?.click()}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Banner</span>
                    </button>

                    {formData.bannerUrl && (
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, bannerUrl: '' }))}
                        className="px-2.5 py-1.5 bg-slate-200 hover:bg-rose-100 hover:text-rose-700 text-slate-700 font-bold rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    )}
                  </div>

                  <p className="text-[10px] text-slate-500">
                    Format: JPG, PNG (Maks. 5MB). Rasio lebar landscape.
                  </p>
                </div>
              </div>

              {/* Direct URL Fallback Option */}
              <div className="pt-2 border-t border-slate-200/80">
                <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                  <LinkIcon className="w-3 h-3 text-slate-400" />
                  <span>Atau gunakan Link URL Gambar Banner:</span>
                </label>
                <input
                  type="text"
                  name="bannerUrl"
                  value={formData.bannerUrl || ''}
                  onChange={handleChange}
                  placeholder="https://domain.com/banner.jpg"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

          </div>

          {/* 3. Dedicated Card: Upload Gambar Kop Surat Resmi (JPG / PNG) */}
          <div className="p-5 bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-slate-50 border-2 border-emerald-200/80 rounded-2xl space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-sm">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-slate-900">Upload Kop Surat Resmi Madrasah</h4>
                    <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-emerald-600 text-white shadow-xs">
                      Bentuk JPG / PNG
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Gambar Kop Surat resmi ini akan otomatis dicantumkan di bagian atas saat mencetak <strong>Formulir Pendaftaran SPMB</strong> dan <strong>Kuitansi Pembayaran</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={kopInputRef}
                  onChange={handleKopFileChange}
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => kopInputRef.current?.click()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>{formData.kopSuratUrl ? 'Ganti Kop Surat' : 'Upload Kop Surat (JPG/PNG)'}</span>
                </button>

                {formData.kopSuratUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, kopSuratUrl: '' }))}
                    className="px-3 py-2 bg-white hover:bg-rose-50 hover:text-rose-700 text-slate-700 border border-slate-300 hover:border-rose-300 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 text-rose-600" />
                    <span>Hapus Kop</span>
                  </button>
                )}
              </div>
            </div>

            {/* Drag & Drop and Preview Container */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsKopDragOver(true);
              }}
              onDragLeave={() => setIsKopDragOver(false)}
              onDrop={handleKopDrop}
              onClick={() => {
                if (!formData.kopSuratUrl) {
                  kopInputRef.current?.click();
                }
              }}
              className={`border-2 border-dashed rounded-xl p-4 sm:p-5 transition-all text-center ${
                isKopDragOver
                  ? 'border-emerald-500 bg-emerald-100/60 scale-[1.005]'
                  : formData.kopSuratUrl
                  ? 'border-emerald-300 bg-white shadow-inner'
                  : 'border-slate-300 bg-white/70 hover:bg-white hover:border-emerald-400 cursor-pointer'
              }`}
            >
              {formData.kopSuratUrl ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pb-2 border-b border-slate-100">
                    <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      Pratinjau Kop Surat Aktif (Akan Dicetak pada Dokumen)
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded">
                      Rasio Kop Surat Standar A4
                    </span>
                  </div>
                  
                  {/* Live Kop Image Frame */}
                  <div className="bg-slate-50 p-2 sm:p-3 rounded-lg border border-slate-200 flex items-center justify-center min-h-[90px] max-h-[140px] overflow-hidden">
                    <img
                      src={formData.kopSuratUrl}
                      alt="Pratinjau Kop Surat Resmi"
                      className="w-full max-h-[120px] object-contain mx-auto"
                    />
                  </div>

                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        kopInputRef.current?.click();
                      }}
                      className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Klik untuk ganti file gambar Kop</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-6 space-y-2.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Tarik & lepaskan file Kop Surat ke sini, atau <span className="text-emerald-700 underline">klik untuk mencari file</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Mendukung format gambar: <strong className="font-semibold text-slate-700">.JPG, .JPEG, .PNG</strong> (Maksimal 5 MB)
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-[10px] font-semibold text-amber-900 mt-2">
                    <Printer className="w-3 h-3 text-amber-700" />
                    <span>Tips: Gunakan resolusi tinggi (misal: lebar 1200–2400px) untuk hasil cetak dokumen yang jernih dan tajam</span>
                  </div>
                </div>
              )}
            </div>

            {/* Direct URL Fallback Option for Kop Surat */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1 shrink-0">
                <LinkIcon className="w-3 h-3 text-slate-400" />
                <span>Atau Link URL Kop Surat (JPG/PNG):</span>
              </label>
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  name="kopSuratUrl"
                  value={formData.kopSuratUrl || ''}
                  onChange={handleChange}
                  placeholder="https://domain.com/kop-surat-resmi.png"
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                {formData.kopSuratUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, kopSuratUrl: '' }))}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-600 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    title="Kosongkan"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Banner Preview & Identity Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="h-44 w-full bg-slate-800 relative overflow-hidden">
            {formData.bannerUrl ? (
              <img
                src={formData.bannerUrl}
                alt="Banner Madrasah"
                className="w-full h-full object-cover opacity-80"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-emerald-800 to-teal-900" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
            <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-white border-2 border-white/80 p-1 shadow-lg overflow-hidden shrink-0 flex items-center justify-center">
                  {formData.logoUrl ? (
                    <img src={formData.logoUrl} alt="Logo Preview" className="w-full h-full object-contain" />
                  ) : (
                    <School className="w-8 h-8 text-emerald-700" />
                  )}
                </div>
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[11px] font-bold">
                    SK Akreditasi: {formData.skAkreditasi}
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-white mt-1 drop-shadow-md">
                    {formData.namaMadrasah}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Madrasah
              </label>
              <input
                type="text"
                name="namaMadrasah"
                value={formData.namaMadrasah}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                NSM (Nomor Statistik Madrasah)
              </label>
              <input
                type="text"
                name="nsm"
                value={formData.nsm}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                NPSN (Nomor Pokok Sekolah Nasional)
              </label>
              <input
                type="text"
                name="npsn"
                value={formData.npsn}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Akreditasi
              </label>
              <input
                type="text"
                name="akreditasi"
                value={formData.akreditasi}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kepala Madrasah
              </label>
              <input
                type="text"
                name="kepalaMadrasah"
                value={formData.kepalaMadrasah}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                NIP Kepala Madrasah
              </label>
              <input
                type="text"
                name="nipKepalaMadrasah"
                value={formData.nipKepalaMadrasah}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

          </div>
        </div>

        {/* Alamat Lengkap & Kontak */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Alamat & Layanan Kontak Madrasah</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Alamat Jalan
              </label>
              <input
                type="text"
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                RT / RW
              </label>
              <input
                type="text"
                name="rtRw"
                value={formData.rtRw}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kelurahan / Desa
              </label>
              <input
                type="text"
                name="kelurahan"
                value={formData.kelurahan}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kecamatan
              </label>
              <input
                type="text"
                name="kecamatan"
                value={formData.kecamatan}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kabupaten / Kota
              </label>
              <input
                type="text"
                name="kabKota"
                value={formData.kabKota}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Provinsi
              </label>
              <input
                type="text"
                name="provinsi"
                value={formData.provinsi}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kode Pos
              </label>
              <input
                type="text"
                name="kodePos"
                value={formData.kodePos}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                No. Telepon Kantor
              </label>
              <input
                type="text"
                name="telepon"
                value={formData.telepon}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                WhatsApp Center SPMB
              </label>
              <input
                type="text"
                name="whatsappCenter"
                value={formData.whatsappCenter}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Resmi
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Website Utama
              </label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

          </div>
        </div>

      </form>

      {/* Global CSS Centered Confirm/Notification Dialog */}
      <ConfirmDialog
        dialog={confirmDialog}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />

    </div>
  );
};
