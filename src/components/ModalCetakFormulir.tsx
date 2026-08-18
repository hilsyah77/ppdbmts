import React, { useRef, useState, useEffect } from 'react';
import { Pendaftar, ProfilMadrasahData, PengaturanPPDBData, JadwalPiket } from '../types';
import { X, Printer, UserCheck, FileText, CheckCircle2, Upload, ImageIcon, AlertCircle } from 'lucide-react';

interface ModalCetakProps {
  pendaftar: Pendaftar | null;
  profil: ProfilMadrasahData;
  pengaturan: PengaturanPPDBData;
  jadwalPiketList?: JadwalPiket[];
  onClose: () => void;
  onUpdateProfil?: (newProfil: ProfilMadrasahData) => void;
}

export const ModalCetakFormulir: React.FC<ModalCetakProps> = ({
  pendaftar,
  profil,
  pengaturan,
  jadwalPiketList = [],
  onClose,
  onUpdateProfil
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const kopInputRef = useRef<HTMLInputElement>(null);
  const [penandatangan, setPenandatangan] = useState<string>(pengaturan.panitiaKetua);
  const [useKopGambar, setUseKopGambar] = useState<boolean>(Boolean(profil.kopSuratUrl));

  useEffect(() => {
    if (profil.kopSuratUrl) {
      setUseKopGambar(true);
    }
  }, [profil.kopSuratUrl]);

  if (!pendaftar) return null;

  const handleKopFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Harap pilih file gambar (JPG, PNG, atau WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file kop surat maksimal 5 MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result && onUpdateProfil) {
        const updated = { ...profil, kopSuratUrl: event.target.result as string };
        onUpdateProfil(updated);
        setUseKopGambar(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn print:p-0 print:m-0 print:bg-white print:fixed print:inset-0 print:overflow-hidden">
      {/* Embedded Print Styles for Exact A4 (Margin: Atas 1cm, Kiri 1.5cm, Kanan 1.5cm, Bawah 1.5cm) */}
      <style>{`
        @page {
          size: A4 portrait;
          margin-top: 1cm;
          margin-bottom: 1.5cm;
          margin-left: 1.5cm;
          margin-right: 1.5cm;
        }
        @media print {
          *, *::before, *::after {
            box-sizing: border-box !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            overflow: hidden !important;
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
          ::-webkit-scrollbar {
            display: none !important;
            width: 0px !important;
            height: 0px !important;
          }
          body * {
            visibility: hidden !important;
          }
          #printable-formulir-spmb, #printable-formulir-spmb * {
            visibility: visible !important;
          }
          #printable-formulir-spmb {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            padding: 0 !important;
            background: #ffffff !important;
            box-shadow: none !important;
            border: none !important;
            overflow: hidden !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Container for Screen Modal */}
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[94vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col print:shadow-none print:border-none print:max-w-none print:max-h-none print:w-full print:rounded-none print:overflow-hidden print:p-0 print:m-0">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="p-3 bg-slate-900 text-white rounded-t-2xl flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20 print:hidden shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold">Cetak Formulir Pendaftaran SPMB</h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Kertas A4 &bull; Margin: Atas 1cm &bull; Kiri/Kanan/Bawah 1.5cm
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                No. Registrasi: <span className="text-emerald-300 font-mono font-bold">{pendaftar.noRegistrasi}</span> — {pendaftar.namaLengkap}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Hidden Input for Kop Upload */}
            <input
              type="file"
              ref={kopInputRef}
              onChange={handleKopFileChange}
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className="hidden"
            />

            {/* Quick Upload / Switch Kop Surat Button */}
            <button
              type="button"
              onClick={() => kopInputRef.current?.click()}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title={profil.kopSuratUrl ? 'Ganti file Kop Surat' : 'Upload Kop Surat Resmi (JPG/PNG)'}
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{profil.kopSuratUrl ? 'Ganti Kop' : 'Upload Kop Surat'}</span>
            </button>

            {/* Kop Type Toggle if Kop Gambar exists */}
            {profil.kopSuratUrl && (
              <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setUseKopGambar(true)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                    useKopGambar ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Kop Gambar (JPG/PNG)
                </button>
                <button
                  type="button"
                  onClick={() => setUseKopGambar(false)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                    !useKopGambar ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Kop Teks
                </button>
              </div>
            )}

            {/* Penandatangan Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300 font-medium whitespace-nowrap text-[11px]">Penandatangan:</span>
              <select
                value={penandatangan}
                onChange={(e) => setPenandatangan(e.target.value)}
                className="bg-slate-900 text-emerald-300 text-xs font-bold rounded px-2 py-1 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 max-w-[160px] truncate cursor-pointer"
              >
                {pengaturan.panitiaKetua && (
                  <option value={pengaturan.panitiaKetua}>
                    {pengaturan.panitiaKetua} (Default)
                  </option>
                )}
                {jadwalPiketList &&
                  jadwalPiketList.map((j) => (
                    <optgroup
                      key={j.id}
                      label={`${j.hari}, ${j.tanggal} [${j.shift.split(' ')[0]}] - ${j.status}`}
                    >
                      {j.petugas.map((pName, idx) => (
                        <option key={`${j.id}-${idx}`} value={pName}>
                          {pName} {j.status === 'Piket Hari Ini' ? '⭐ (Piket Hari Ini)' : ''}
                        </option>
                      ))}
                    </optgroup>
                  ))}
              </select>
            </div>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Sekarang (Print / PDF)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Kop Surat info banner if not uploaded yet */}
        {!profil.kopSuratUrl && (
          <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 print:hidden">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Info Kop Surat:</strong> Belum ada gambar Kop Surat resmi. Anda dapat mengunggah file Kop Surat (JPG/PNG) agar muncul di bagian atas formulir.
              </span>
            </div>
            <button
              type="button"
              onClick={() => kopInputRef.current?.click()}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Kop Sekarang</span>
            </button>
          </div>
        )}

        {/* Paper Container Wrapper on Screen */}
        <div className="bg-slate-200/70 p-3 sm:p-5 flex justify-center print:bg-white print:p-0 print:m-0">
          {/* Printable Paper Area (Exact A4 specifications: Margin 2.5cm Top/Bottom, 3cm Left/Right, Font 12, Spacing 1.5) */}
          <div
            id="printable-formulir-spmb"
            ref={printRef}
            className="w-full max-w-2xl bg-white text-slate-950 shadow-xl border border-slate-300 print:border-none print:shadow-none p-6 sm:p-8 font-sans text-[12px] print:p-0"
            style={{ boxSizing: 'border-box', lineHeight: '1.5' }}
          >
            {/* 1. Kop Surat Resmi Madrasah (Gambar atau Teks Standar) */}
            {useKopGambar && profil.kopSuratUrl ? (
              <div className="mb-2.5 pb-1.5 text-center border-b-2 border-slate-900 w-full overflow-hidden">
                <img
                  src={profil.kopSuratUrl}
                  alt="Kop Surat Resmi Madrasah"
                  className="w-full h-auto max-h-28 sm:max-h-32 object-contain mx-auto print:max-h-36 block"
                />
              </div>
            ) : (
              <div className="border-b-4 border-double border-slate-950 pb-1.5 mb-2 text-center relative" style={{ lineHeight: '1.3' }}>
                {/* Logo Madrasah / Kemenag */}
                <div className="absolute left-0 top-0.5 w-14 h-14 sm:w-15 sm:h-15 flex items-center justify-center font-bold text-[11px] text-emerald-800 uppercase tracking-tighter text-center leading-tight overflow-hidden">
                  {profil.logoUrl ? (
                    <img src={profil.logoUrl} alt="Logo Sekolah" className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full border-2 border-emerald-800 rounded-full flex items-center justify-center font-black text-emerald-900 text-[11px]">
                      KEMENAG
                    </div>
                  )}
                </div>

                <div className="px-14 space-y-0.5">
                  <h1 className="text-[13.5px] sm:text-[14.5px] font-black uppercase tracking-tight text-slate-950 leading-tight">
                    {pengaturan.kopHeaderLine3 || `SISTEM PENERIMAAN MURID BARU (SPMB) ${profil.namaMadrasah.toUpperCase()}`}
                  </h1>
                  <p className="text-[9.5px] text-slate-700 leading-tight">
                    {profil.alamat}, {profil.kelurahan}, {profil.kecamatan}, {profil.kabKota}, {profil.provinsi} {profil.kodePos}
                  </p>
                  <p className="text-[9px] text-slate-700 leading-tight">
                    Telp: {profil.telepon} | WA: {profil.whatsappCenter} | Website: {profil.website} | Email: {profil.email}
                  </p>
                </div>
              </div>
            )}

            {/* 2. Judul Formulir & Ringkasan Registrasi */}
            <div className="text-center mb-2" style={{ lineHeight: '1.3' }}>
              <h2 className="text-[12.5px] font-bold uppercase tracking-wider underline decoration-2 text-slate-950 leading-tight">
                FORMULIR PENDAFTARAN SISTEM PENERIMAAN MURID BARU (SPMB)
              </h2>
              <p className="text-[10.5px] font-bold text-slate-800 mt-0.5">
                TAHUN AJARAN {pengaturan.tahunAjaran} &bull; {pengaturan.gelombangActive.toUpperCase()}
              </p>

              <div className="mt-1 grid grid-cols-4 gap-1 bg-slate-50 border border-slate-300 p-1 rounded text-left" style={{ lineHeight: '1.25' }}>
                <div className="border-r border-slate-300 pr-1">
                  <span className="text-[8.5px] uppercase font-bold text-slate-600 block">NOMOR REGISTRASI</span>
                  <span className="text-[12px] font-black font-mono text-emerald-950 block truncate">{pendaftar.noRegistrasi}</span>
                </div>
                <div className="border-r border-slate-300 px-1">
                  <span className="text-[8.5px] uppercase font-bold text-slate-600 block">JALUR SELEKSI</span>
                  <span className="text-[11px] font-bold text-slate-950 block truncate">{pendaftar.jalur}</span>
                </div>
                <div className="border-r border-slate-300 px-1">
                  <span className="text-[8.5px] uppercase font-bold text-slate-600 block">TANGGAL DAFTAR</span>
                  <span className="text-[11px] font-medium text-slate-950 block truncate">{pendaftar.tanggalDaftar}</span>
                </div>
                <div className="text-right pl-1">
                  <span className="text-[8.5px] uppercase font-bold text-slate-600 block">NO. URUT</span>
                  <span className="text-[12px] font-black font-mono text-slate-950">#{pendaftar.noUrut}</span>
                </div>
              </div>
            </div>

            {/* 3. Isi Formulir Pendaftaran (Font 12, Spasi 1.5, Ibu di bawah Ayah) */}
            <div className="space-y-1.5 text-[12px] text-slate-950" style={{ lineHeight: '1.5' }}>
              
              {/* A. IDENTITAS CALON PESERTA DIDIK */}
              <div className="border border-slate-400 rounded overflow-hidden">
                <div className="bg-slate-800 text-white px-2.5 py-0.5 text-[11.5px] font-bold uppercase tracking-wider flex items-center justify-between" style={{ lineHeight: '1.3' }}>
                  <span>A. IDENTITAS CALON PESERTA DIDIK</span>
                  <span className="text-[9.5px] font-mono text-emerald-300 font-normal">Data Calon Siswa</span>
                </div>
                <table className="w-full text-[12px] border-collapse" style={{ lineHeight: '1.5' }}>
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="py-0.5 px-2.5 w-44 font-medium bg-slate-50 border-r border-slate-200 text-slate-700">1. Nama Lengkap</td>
                      <td className="py-0.5 px-2.5 font-bold uppercase text-slate-950 text-[12px]">{pendaftar.namaLengkap}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-0.5 px-2.5 w-44 font-medium bg-slate-50 border-r border-slate-200 text-slate-700">2. Tempat, Tanggal Lahir</td>
                      <td className="py-0.5 px-2.5 text-slate-950 text-[12px]">{pendaftar.tempatLahir}, {pendaftar.tanggalLahir}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-0.5 px-2.5 w-44 font-medium bg-slate-50 border-r border-slate-200 text-slate-700">3. Jenis Kelamin</td>
                      <td className="py-0.5 px-2.5 font-semibold text-slate-950 text-[12px]">{pendaftar.jenisKelamin}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-0.5 px-2.5 w-44 font-medium bg-slate-50 border-r border-slate-200 text-slate-700">4. NISN / NIK Siswa</td>
                      <td className="py-0.5 px-2.5 font-mono text-slate-950 text-[12px]">
                        <span className="font-bold">NISN:</span> {pendaftar.nisn} <span className="text-slate-400 mx-1.5">|</span> <span className="font-bold">NIK:</span> {pendaftar.nik}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-0.5 px-2.5 w-44 font-medium bg-slate-50 border-r border-slate-200 text-slate-700">5. No. Telepon / WhatsApp</td>
                      <td className="py-0.5 px-2.5 font-mono font-bold text-slate-950 text-[12px]">{pendaftar.noHpWa}</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 px-2.5 w-44 font-medium bg-slate-50 border-r border-slate-200 text-slate-700">6. Alamat Lengkap Siswa</td>
                      <td className="py-0.5 px-2.5 leading-tight text-slate-950 text-[12px]">
                        {pendaftar.alamatSiswa}, RT/RW {pendaftar.rtRw}, Kel. {pendaftar.kelurahan}, Kec. {pendaftar.kecamatan}, {pendaftar.kabKota}, Prov. {pendaftar.provinsi}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* B. SEKOLAH ASAL */}
              <div className="border border-slate-400 rounded overflow-hidden">
                <div className="bg-slate-800 text-white px-2.5 py-0.5 text-[11.5px] font-bold uppercase tracking-wider" style={{ lineHeight: '1.3' }}>
                  B. SEKOLAH ASAL
                </div>
                <table className="w-full text-[12px] border-collapse" style={{ lineHeight: '1.5' }}>
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="py-0.5 px-2.5 w-44 font-medium bg-slate-50 border-r border-slate-200 text-slate-700">1. Nama Sekolah Asal</td>
                      <td className="py-0.5 px-2.5 font-bold text-slate-950 uppercase text-[12px]">{pendaftar.sekolahAsal}</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 px-2.5 w-44 font-medium bg-slate-50 border-r border-slate-200 text-slate-700">2. NPSN Sekolah Asal</td>
                      <td className="py-0.5 px-2.5 font-mono text-slate-950 text-[12px]">{pendaftar.npsnSekolahAsal || '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* C. DATA ORANG TUA / WALI SISWA (IBU DI BAWAH AYAH) */}
              <div className="border border-slate-400 rounded overflow-hidden">
                <div className="bg-slate-800 text-white px-2.5 py-0.5 text-[11.5px] font-bold uppercase tracking-wider" style={{ lineHeight: '1.3' }}>
                  C. DATA ORANG TUA / WALI SISWA
                </div>
                <table className="w-full text-[12px] border-collapse" style={{ lineHeight: '1.5' }}>
                  <tbody>
                    {/* Header Identitas Ayah */}
                    <tr className="bg-slate-100 border-b border-slate-200">
                      <td colSpan={2} className="py-0.5 px-2.5 font-bold text-[10.5px] text-slate-800 uppercase tracking-wide" style={{ lineHeight: '1.3' }}>
                        Identitas Ayah Kandung / Wali
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-0.5 px-2.5 w-44 font-medium bg-slate-50 border-r border-slate-200 text-slate-700">1. Nama Ayah</td>
                      <td className="py-0.5 px-2.5 font-bold uppercase text-slate-950 text-[12px]">{pendaftar.namaAyah}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-0.5 px-2.5 w-44 font-medium bg-slate-50 border-r border-slate-200 text-slate-700">2. Pekerjaan Ayah</td>
                      <td className="py-0.5 px-2.5 text-slate-950 text-[12px]">{pendaftar.pekerjaanAyah}</td>
                    </tr>

                    {/* Header Identitas Ibu (Di bawah Ayah) */}
                    <tr className="bg-slate-100 border-b border-slate-200">
                      <td colSpan={2} className="py-0.5 px-2.5 font-bold text-[10.5px] text-slate-800 uppercase tracking-wide" style={{ lineHeight: '1.3' }}>
                        Identitas Ibu Kandung
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-0.5 px-2.5 w-44 font-medium bg-slate-50 border-r border-slate-200 text-slate-700">1. Nama Ibu</td>
                      <td className="py-0.5 px-2.5 font-bold uppercase text-slate-950 text-[12px]">{pendaftar.namaIbu}</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 px-2.5 w-44 font-medium bg-slate-50 border-r border-slate-200 text-slate-700">2. Pekerjaan Ibu</td>
                      <td className="py-0.5 px-2.5 text-slate-950 text-[12px]">{pendaftar.pekerjaanIbu}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* D. STATUS KELENGKAPAN BERKAS PERSYARATAN (CEKLIST DATA KE BAWAH) */}
              <div className="border border-slate-400 rounded overflow-hidden">
                <div className="bg-slate-800 text-white px-2.5 py-0.5 text-[11.5px] font-bold uppercase tracking-wider flex items-center justify-between" style={{ lineHeight: '1.3' }}>
                  <span>D. STATUS KELENGKAPAN BERKAS PERSYARATAN</span>
                  <span className="text-[9.5px] font-mono text-emerald-300 font-normal">Ceklis Fisik Dokumen</span>
                </div>
                <table className="w-full text-[11px] border-collapse" style={{ lineHeight: '1.35' }}>
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 text-[9.5px] text-slate-700 font-bold uppercase">
                      <th className="py-0.5 px-2 text-center w-8 border-r border-slate-200">No</th>
                      <th className="py-0.5 px-2.5 text-left border-r border-slate-200">Nama Berkas / Dokumen Persyaratan</th>
                      <th className="py-0.5 px-2 text-center w-32 border-r border-slate-200">Status Penyerahan</th>
                      <th className="py-0.5 px-2 text-center w-20">Ceklis</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="py-0.5 px-2 text-center font-bold bg-slate-50 border-r border-slate-200 text-slate-700">1</td>
                      <td className="py-0.5 px-2.5 font-medium text-slate-900 border-r border-slate-200">Fotokopi Ijazah / Surat Keterangan Lulus (SKL) Legalisir</td>
                      <td className="py-0.5 px-2 text-center border-r border-slate-200">
                        <span className={`inline-flex items-center gap-1 font-bold text-[9.5px] ${pendaftar.berkas.ijazahSkl ? 'text-emerald-700' : 'text-slate-400'}`}>
                          {pendaftar.berkas.ijazahSkl ? '✓ Ada / Lengkap' : '— Belum Ada'}
                        </span>
                      </td>
                      <td className="py-0.5 px-2 text-center">
                        <span className={`inline-flex items-center justify-center w-4 h-4 rounded border font-bold text-[9.5px] leading-none ${pendaftar.berkas.ijazahSkl ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-400 bg-slate-50 text-transparent'}`}>
                          ✓
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-0.5 px-2 text-center font-bold bg-slate-50 border-r border-slate-200 text-slate-700">2</td>
                      <td className="py-0.5 px-2.5 font-medium text-slate-900 border-r border-slate-200">Fotokopi Kartu Keluarga (KK)</td>
                      <td className="py-0.5 px-2 text-center border-r border-slate-200">
                        <span className={`inline-flex items-center gap-1 font-bold text-[9.5px] ${pendaftar.berkas.kartuKeluarga ? 'text-emerald-700' : 'text-slate-400'}`}>
                          {pendaftar.berkas.kartuKeluarga ? '✓ Ada / Lengkap' : '— Belum Ada'}
                        </span>
                      </td>
                      <td className="py-0.5 px-2 text-center">
                        <span className={`inline-flex items-center justify-center w-4 h-4 rounded border font-bold text-[9.5px] leading-none ${pendaftar.berkas.kartuKeluarga ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-400 bg-slate-50 text-transparent'}`}>
                          ✓
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-0.5 px-2 text-center font-bold bg-slate-50 border-r border-slate-200 text-slate-700">3</td>
                      <td className="py-0.5 px-2.5 font-medium text-slate-900 border-r border-slate-200">Fotokopi Akta Kelahiran</td>
                      <td className="py-0.5 px-2 text-center border-r border-slate-200">
                        <span className={`inline-flex items-center gap-1 font-bold text-[9.5px] ${pendaftar.berkas.aktaLahir ? 'text-emerald-700' : 'text-slate-400'}`}>
                          {pendaftar.berkas.aktaLahir ? '✓ Ada / Lengkap' : '— Belum Ada'}
                        </span>
                      </td>
                      <td className="py-0.5 px-2 text-center">
                        <span className={`inline-flex items-center justify-center w-4 h-4 rounded border font-bold text-[9.5px] leading-none ${pendaftar.berkas.aktaLahir ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-400 bg-slate-50 text-transparent'}`}>
                          ✓
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-0.5 px-2 text-center font-bold bg-slate-50 border-r border-slate-200 text-slate-700">4</td>
                      <td className="py-0.5 px-2.5 font-medium text-slate-900 border-r border-slate-200">Pasfoto Berwarna 3x4 (3 Lembar)</td>
                      <td className="py-0.5 px-2 text-center border-r border-slate-200">
                        <span className={`inline-flex items-center gap-1 font-bold text-[9.5px] ${pendaftar.berkas.pasFoto ? 'text-emerald-700' : 'text-slate-400'}`}>
                          {pendaftar.berkas.pasFoto ? '✓ Ada / Lengkap' : '— Belum Ada'}
                        </span>
                      </td>
                      <td className="py-0.5 px-2 text-center">
                        <span className={`inline-flex items-center justify-center w-4 h-4 rounded border font-bold text-[9.5px] leading-none ${pendaftar.berkas.pasFoto ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-400 bg-slate-50 text-transparent'}`}>
                          ✓
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-0.5 px-2 text-center font-bold bg-slate-50 border-r border-slate-200 text-slate-700">5</td>
                      <td className="py-0.5 px-2.5 font-medium text-slate-900 border-r border-slate-200">Kartu KIP / PKH / KKS / Bukti Bantuan Sosial (Jika Ada)</td>
                      <td className="py-0.5 px-2 text-center border-r border-slate-200">
                        <span className={`inline-flex items-center gap-1 font-bold text-[9.5px] ${pendaftar.berkas.kipPkhKks ? 'text-emerald-700' : 'text-slate-400'}`}>
                          {pendaftar.berkas.kipPkhKks ? '✓ Ada / Lengkap' : '— Tidak Ada / Opsional'}
                        </span>
                      </td>
                      <td className="py-0.5 px-2 text-center">
                        <span className={`inline-flex items-center justify-center w-4 h-4 rounded border font-bold text-[9.5px] leading-none ${pendaftar.berkas.kipPkhKks ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-400 bg-slate-50 text-transparent'}`}>
                          ✓
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 4. BLOK PENGESAHAN & PASFOTO 3X4 */}
              <div className="pt-1 grid grid-cols-3 gap-2 text-center text-[10.5px]" style={{ lineHeight: '1.35' }}>
                {/* Kotak Pasfoto 3x4 Proporsional Standar */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-18 h-22 border-2 border-dashed border-slate-400 bg-slate-50/80 flex flex-col items-center justify-center text-[8.5px] text-slate-400 font-bold p-1 rounded uppercase">
                    <span>TEMPEL</span>
                    <span>PASFOTO</span>
                    <span className="text-[10px] text-slate-700 font-black mt-0.5">3 X 4</span>
                  </div>
                </div>

                {/* Tanda Tangan Orang Tua / Calon Siswa */}
                <div className="flex flex-col justify-between h-22 py-0.5">
                  <div>
                    <p className="text-slate-600 text-[10.5px]">Calon Siswa / Orang Tua,</p>
                  </div>
                  <div>
                    <p className="font-bold underline uppercase text-slate-950 text-[11.5px]">{pendaftar.namaAyah || pendaftar.namaLengkap}</p>
                    <p className="text-[9px] text-slate-500">Tanda Tangan & Nama Terang</p>
                  </div>
                </div>

                {/* Tanda Tangan Panitia SPMB */}
                <div className="flex flex-col justify-between h-22 py-0.5">
                  <div>
                    <p className="text-slate-600 text-[10.5px]">
                      {profil.kabKota.replace('Kota ', '').replace('Kab. ', '')}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="font-bold text-slate-900 text-[10.5px]">Panitia SPMB {profil.namaMadrasah}</p>
                  </div>
                  <div>
                    <p className="font-bold underline uppercase text-slate-950 text-[11.5px]">{penandatangan || pengaturan.panitiaKetua}</p>
                    <p className="text-[9px] text-slate-500">Panitia SPMB (Penandatangan)</p>
                  </div>
                </div>
              </div>

              {/* 5. PRINT FOOTER CATATAN RESMI */}
              <div className="pt-1 border-t border-slate-300 text-[8px] text-slate-500 flex justify-between items-center" style={{ lineHeight: '1.2' }}>
                <span>&bull; Bukti Pendaftaran Resmi SPMB {profil.namaMadrasah} TA {pengaturan.tahunAjaran} &bull; Dicetak pada: {new Date().toLocaleString('id-ID')}</span>
                <span className="font-mono font-semibold">1 Halaman Dokumen Resmi SPMB</span>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex justify-between items-center rounded-b-2xl print:hidden">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            Format cetak: Ukuran Kertas A4 &bull; Margin Kiri/Kanan 3cm &bull; Atas/Bawah 2.5cm &bull; Spasi 1.5 &bull; Font 12.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Tutup Pratinjau
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Formulir Ini</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
