import React from 'react';
import { Pendaftar } from '../types';
import {
  X,
  User,
  Phone,
  School,
  Award,
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Printer,
  Calendar,
  MapPin,
  Users
} from 'lucide-react';

interface ModalDetailProps {
  pendaftar: Pendaftar | null;
  onClose: () => void;
  onOpenCetak: (pendaftar: Pendaftar) => void;
  onOpenVerifikasi: (pendaftar: Pendaftar) => void;
}

export const ModalDetailPendaftar: React.FC<ModalDetailProps> = ({
  pendaftar,
  onClose,
  onOpenCetak,
  onOpenVerifikasi
}) => {
  if (!pendaftar) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        
        {/* Modal Header */}
        <div className="p-5 bg-slate-900 text-white rounded-t-2xl flex items-center justify-between sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {pendaftar.noRegistrasi}
              </span>
              <span className="text-xs text-slate-400">
                No. Urut: #{pendaftar.noUrut}
              </span>
            </div>
            <h3 className="text-lg font-bold mt-1 text-slate-100">{pendaftar.namaLengkap}</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenCetak(pendaftar)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Formulir</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-xs text-slate-700">
          
          {/* Status Alert Banner */}
          <div className="p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 border-slate-200">
            <div>
              <div className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                <span>Status Verifikasi:</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    pendaftar.status === 'Terverifikasi'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : pendaftar.status === 'Ditolak'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : pendaftar.status === 'Berkas Belum Lengkap'
                      ? 'bg-sky-100 text-sky-800 border border-sky-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {pendaftar.status}
                </span>
              </div>
              {pendaftar.catatanVerifikasi && (
                <p className="text-slate-600 text-xs mt-1 italic">
                  "{pendaftar.catatanVerifikasi}"
                </p>
              )}
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenVerifikasi(pendaftar);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors shrink-0 text-center"
            >
              Ubah Status Verifikasi
            </button>
          </div>

          {/* Section 1: Data Pribadi Siswa */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200">
              <User className="w-4 h-4 text-emerald-600" />
              <span>1. Identitas Calon Peserta Didik</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Nama Lengkap:</span>
                <span className="font-bold text-slate-900">{pendaftar.namaLengkap}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Tempat, Tanggal Lahir:</span>
                <span className="font-medium text-slate-900">
                  {pendaftar.tempatLahir}, {pendaftar.tanggalLahir}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Jenis Kelamin:</span>
                <span className="font-medium text-slate-900">{pendaftar.jenisKelamin}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">NISN:</span>
                <span className="font-mono font-medium text-slate-900">{pendaftar.nisn}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">NIK Siswa:</span>
                <span className="font-mono font-medium text-slate-900">{pendaftar.nik}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">No. HP/WhatsApp:</span>
                <a
                  href={`https://wa.me/${pendaftar.noHpWa.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-emerald-600 hover:underline flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  <span>{pendaftar.noHpWa}</span>
                </a>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Jalur Pendaftaran:</span>
                <span className="font-bold text-emerald-700">{pendaftar.jalur}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Tanggal Pendaftaran:</span>
                <span className="font-medium text-slate-900">{pendaftar.tanggalDaftar}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 mt-2">
              <span className="text-slate-500 block mb-1 font-semibold">Alamat Tempat Tinggal:</span>
              <p className="font-medium text-slate-800">
                {pendaftar.alamatSiswa}, RT/RW {pendaftar.rtRw}, Kel. {pendaftar.kelurahan}, Kec. {pendaftar.kecamatan}, {pendaftar.kabKota}, Prov. {pendaftar.provinsi}
              </p>
            </div>
          </div>

          {/* Section 2: Sekolah Asal & Nilai */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200">
              <School className="w-4 h-4 text-emerald-600" />
              <span>2. Sekolah Asal & Akademik</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Nama Sekolah Asal:</span>
                <span className="font-bold text-slate-900">{pendaftar.sekolahAsal}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Jenis Sekolah:</span>
                <span className="font-medium text-slate-900">{pendaftar.jenisSekolahAsal}</span>
              </div>
              {pendaftar.npsnSekolahAsal && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">NPSN Sekolah Asal:</span>
                  <span className="font-mono font-medium text-slate-900">{pendaftar.npsnSekolahAsal}</span>
                </div>
              )}
              {pendaftar.rataRapor && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Rata-rata Rapor (Kls 4-6):</span>
                  <span className="font-bold text-emerald-700 text-sm">{pendaftar.rataRapor}</span>
                </div>
              )}
              {pendaftar.jumlahJuzTahfizh !== undefined && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Jumlah Hafalan Al-Qur'an:</span>
                  <span className="font-bold text-amber-700">{pendaftar.jumlahJuzTahfizh} Juz</span>
                </div>
              )}
            </div>

            {pendaftar.prestasiDetail && (
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-amber-900">
                <span className="font-bold block mb-1">Rincian Prestasi / Keunggulan:</span>
                <p>{pendaftar.prestasiDetail}</p>
              </div>
            )}
          </div>

          {/* Section 3: Orang Tua / Wali */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>3. Data Orang Tua / Wali</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Nama Ayah:</span>
                <span className="font-bold text-slate-900">{pendaftar.namaAyah}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Pekerjaan Ayah:</span>
                <span className="font-medium text-slate-900">{pendaftar.pekerjaanAyah}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Nama Ibu:</span>
                <span className="font-bold text-slate-900">{pendaftar.namaIbu}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Pekerjaan Ibu:</span>
                <span className="font-medium text-slate-900">{pendaftar.pekerjaanIbu}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">No. Kontak Ortu:</span>
                <span className="font-mono font-medium text-slate-900">{pendaftar.noHpOrangTua}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Penghasilan Ortu:</span>
                <span className="font-medium text-slate-900">{pendaftar.penghasilanOrangTua}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Kelengkapan Berkas */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>4. Verifikasi Berkas Fisik / Upload</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className={`p-3 rounded-xl border flex items-center gap-2 ${pendaftar.berkas.ijazahSkl ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                {pendaftar.berkas.ijazahSkl ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                <span className="font-semibold">Ijazah / SKL</span>
              </div>

              <div className={`p-3 rounded-xl border flex items-center gap-2 ${pendaftar.berkas.kartuKeluarga ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                {pendaftar.berkas.kartuKeluarga ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                <span className="font-semibold">Kartu Keluarga</span>
              </div>

              <div className={`p-3 rounded-xl border flex items-center gap-2 ${pendaftar.berkas.aktaLahir ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                {pendaftar.berkas.aktaLahir ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                <span className="font-semibold">Akta Kelahiran</span>
              </div>

              <div className={`p-3 rounded-xl border flex items-center gap-2 ${pendaftar.berkas.pasFoto ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                {pendaftar.berkas.pasFoto ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                <span className="font-semibold">Pasfoto 3x4</span>
              </div>

              <div className={`p-3 rounded-xl border flex items-center gap-2 ${pendaftar.berkas.sertifikatPrestasi ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                {pendaftar.berkas.sertifikatPrestasi ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />}
                <span className="font-semibold">Sertifikat / Piagam</span>
              </div>

              <div className={`p-3 rounded-xl border flex items-center gap-2 ${pendaftar.berkas.kipPkhKks ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                {pendaftar.berkas.kipPkhKks ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />}
                <span className="font-semibold">KIP / PKH / KKS</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 rounded-b-2xl border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-colors text-xs"
          >
            Tutup Window
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenCetak(pendaftar)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors text-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Formulir Resmi</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
