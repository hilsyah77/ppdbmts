import React, { useRef, useState } from 'react';
import { Pendaftar, ProfilMadrasahData, PengaturanPPDBData, JadwalPiket } from '../types';
import { X, Printer, UserCheck, FileText, Check } from 'lucide-react';

interface ModalCetakProps {
  pendaftar: Pendaftar | null;
  profil: ProfilMadrasahData;
  pengaturan: PengaturanPPDBData;
  jadwalPiketList?: JadwalPiket[];
  onClose: () => void;
}

export const ModalCetakFormulir: React.FC<ModalCetakProps> = ({
  pendaftar,
  profil,
  pengaturan,
  jadwalPiketList = [],
  onClose
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [penandatangan, setPenandatangan] = useState<string>(pengaturan.panitiaKetua);

  if (!pendaftar) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
      {/* Embedded Print Styles for Precise A4 Full Page (210mm x 297mm) */}
      <style>{`
        @page {
          size: A4 portrait;
          margin: 6mm 10mm 6mm 10mm;
        }
        @media print {
          html, body {
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body * {
            visibility: hidden;
          }
          #printable-formulir-a4, #printable-formulir-a4 * {
            visibility: visible;
          }
          #printable-formulir-a4 {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 190mm !important; /* 210mm - (10mm margin * 2) */
            max-height: 285mm !important;
            margin: 0 auto !important;
            padding: 0 !important;
            background: #ffffff !important;
            box-shadow: none !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            overflow: hidden !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      
      {/* Container for Screen Modal */}
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col print:shadow-none print:border-none print:max-w-none print:max-h-none print:w-full print:rounded-none">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="p-3.5 bg-slate-900 text-white rounded-t-2xl flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20 print:hidden shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold">Cetak Formulir PPDB</h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                  📐 Presisi A4 Full Halaman (21.0 × 29.7 cm)
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                No. Registrasi: <span className="text-emerald-300 font-mono font-bold">{pendaftar.noRegistrasi}</span> — {pendaftar.namaLengkap}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Penandatangan Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300 font-medium whitespace-nowrap text-[11px]">Penandatangan:</span>
              <select
                value={penandatangan}
                onChange={(e) => setPenandatangan(e.target.value)}
                className="bg-slate-900 text-emerald-300 text-xs font-bold rounded px-2 py-1 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
              <span>Cetak Sekarang (A4)</span>
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

        {/* Paper Container Wrapper on Screen */}
        <div className="bg-slate-200/70 p-4 sm:p-6 flex justify-center print:bg-white print:p-0">
          {/* Printable Paper Area - Scaled & Structured for A4 (210mm x 297mm) */}
          <div
            id="printable-formulir-a4"
            ref={printRef}
            className="w-full max-w-[210mm] bg-white text-slate-900 shadow-xl border border-slate-300 print:border-none print:shadow-none p-5 sm:p-7 font-sans leading-tight text-[10.5px]"
            style={{ boxSizing: 'border-box' }}
          >
            {/* 1. KOP SURAT RESMI MADRASAH */}
            <div className="border-b-4 border-double border-slate-900 pb-1.5 mb-2.5 text-center relative">
              {/* Logo Kemenag / Madrasah */}
              <div className="absolute left-1 top-0 w-13 h-13 sm:w-15 sm:h-15 flex items-center justify-center font-bold text-[10px] text-emerald-800 uppercase tracking-tighter text-center leading-tight overflow-hidden">
                {profil.logoUrl ? (
                  <img src={profil.logoUrl} alt="Logo Sekolah" className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full border-2 border-emerald-800 rounded-full flex items-center justify-center font-black text-emerald-900 text-[11px]">
                    KEMENAG
                  </div>
                )}
              </div>

              <div className="px-14 sm:px-16 space-y-0.5">
                <h1 className="text-[13px] sm:text-[14px] font-black uppercase tracking-tight text-slate-900 leading-tight">
                  {pengaturan.kopHeaderLine3 || `PENERIMAAN PESERTA DIDIK BARU (PPDB) ${profil.namaMadrasah.toUpperCase()}`}
                </h1>
                <p className="text-[9px] text-slate-600 leading-tight">
                  {profil.alamat}, {profil.kelurahan}, {profil.kecamatan}, {profil.kabKota}, {profil.provinsi} {profil.kodePos}
                </p>
                <p className="text-[9px] text-slate-600 leading-tight">
                  Telp: {profil.telepon} | WA: {profil.whatsappCenter} | Website: {profil.website} | Email: {profil.email}
                </p>
              </div>
            </div>

            {/* 2. JUDUL FORMULIR & BARIS INFORMASI REGISTRASI */}
            <div className="text-center mb-2.5">
              <h2 className="text-[12.5px] font-bold uppercase tracking-wider underline decoration-2 text-slate-950">
                FORMULIR PENDAFTARAN PESERTA DIDIK BARU (PPDB)
              </h2>
              <p className="text-[10px] font-bold text-slate-800 mt-0.5">
                TAHUN AJARAN {pengaturan.tahunAjaran} &bull; GELOMBANG: {pengaturan.gelombangActive.toUpperCase()}
              </p>

              <div className="mt-1.5 grid grid-cols-4 gap-1.5 bg-slate-50 border border-slate-300 p-1.5 rounded-lg text-left">
                <div className="border-r border-slate-200 pr-1">
                  <span className="text-[8px] uppercase font-bold text-slate-500 block">NO. REGISTRASI</span>
                  <span className="text-[11.5px] font-black font-mono text-emerald-950 block truncate">{pendaftar.noRegistrasi}</span>
                </div>
                <div className="border-r border-slate-200 px-1">
                  <span className="text-[8px] uppercase font-bold text-slate-500 block">JALUR SELEKSI</span>
                  <span className="text-[10px] font-bold text-slate-900 block truncate">{pendaftar.jalur}</span>
                </div>
                <div className="border-r border-slate-200 px-1">
                  <span className="text-[8px] uppercase font-bold text-slate-500 block">TGL. PENDAFTARAN</span>
                  <span className="text-[10px] font-medium text-slate-900 block truncate">{pendaftar.tanggalDaftar}</span>
                </div>
                <div className="text-right pl-1">
                  <span className="text-[8px] uppercase font-bold text-slate-500 block">NO. URUT</span>
                  <span className="text-[11.5px] font-black font-mono text-slate-950">#{pendaftar.noUrut}</span>
                </div>
              </div>
            </div>

            {/* 3. ISI FORMULIR PENDAFTARAN */}
            <div className="space-y-2 text-[10px] text-slate-900">
              
              {/* A. IDENTITAS CALON PESERTA DIDIK */}
              <div className="border border-slate-300 rounded overflow-hidden">
                <div className="bg-slate-800 text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider flex items-center justify-between">
                  <span>A. IDENTITAS CALON PESERTA DIDIK</span>
                  <span className="text-[8.5px] font-mono text-emerald-300 font-normal">Data Siswa</span>
                </div>
                <table className="w-full text-[9.5px] border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="py-1 px-2.5 w-40 font-medium bg-slate-50 border-r border-slate-200 text-slate-700">1. Nama Lengkap</td>
                      <td className="py-1 px-2.5 font-bold uppercase text-slate-950">{pendaftar.namaLengkap}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1 px-2.5 font-medium bg-slate-50 border-r border-slate-200 text-slate-700">2. Tempat, Tanggal Lahir</td>
                      <td className="py-1 px-2.5">{pendaftar.tempatLahir}, {pendaftar.tanggalLahir}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1 px-2.5 font-medium bg-slate-50 border-r border-slate-200 text-slate-700">3. Jenis Kelamin</td>
                      <td className="py-1 px-2.5 font-semibold">{pendaftar.jenisKelamin}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1 px-2.5 font-medium bg-slate-50 border-r border-slate-200 text-slate-700">4. NISN / NIK Siswa</td>
                      <td className="py-1 px-2.5 font-mono">
                        <span className="font-bold">NISN:</span> {pendaftar.nisn} <span className="text-slate-400 mx-1.5">|</span> <span className="font-bold">NIK:</span> {pendaftar.nik}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1 px-2.5 font-medium bg-slate-50 border-r border-slate-200 text-slate-700">5. No. Telepon / WhatsApp</td>
                      <td className="py-1 px-2.5 font-mono font-bold text-slate-900">{pendaftar.noHpWa}</td>
                    </tr>
                    <tr>
                      <td className="py-1 px-2.5 font-medium bg-slate-50 border-r border-slate-200 text-slate-700">6. Alamat Tempat Tinggal</td>
                      <td className="py-1 px-2.5 leading-snug">
                        {pendaftar.alamatSiswa}, RT/RW {pendaftar.rtRw}, Kel. {pendaftar.kelurahan}, Kec. {pendaftar.kecamatan}, {pendaftar.kabKota}, Prov. {pendaftar.provinsi}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* B. SEKOLAH ASAL */}
              <div className="border border-slate-300 rounded overflow-hidden">
                <div className="bg-slate-800 text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  B. SEKOLAH ASAL
                </div>
                <table className="w-full text-[9.5px] border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="py-1 px-2.5 w-40 font-medium bg-slate-50 border-r border-slate-200 text-slate-700">1. Nama Sekolah Asal</td>
                      <td className="py-1 px-2.5 font-bold text-slate-900 uppercase">{pendaftar.sekolahAsal}</td>
                    </tr>
                    <tr>
                      <td className="py-1 px-2.5 font-medium bg-slate-50 border-r border-slate-200 text-slate-700">2. NPSN Sekolah Asal</td>
                      <td className="py-1 px-2.5 font-mono">{pendaftar.npsnSekolahAsal || '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* C. DATA ORANG TUA / WALI SISWA */}
              <div className="border border-slate-300 rounded overflow-hidden">
                <div className="bg-slate-800 text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  C. DATA ORANG TUA / WALI SISWA
                </div>
                <table className="w-full text-[9.5px] border-collapse">
                  <tbody>
                    {/* AYAH */}
                    <tr className="border-b border-slate-200 bg-slate-100 font-bold">
                      <td colSpan={2} className="py-0.5 px-2.5 text-slate-800 text-[9px] uppercase tracking-wide">
                        Identitas Ayah Kandung / Wali
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1 px-2.5 w-40 font-medium bg-slate-50 border-r border-slate-200 text-slate-700">1. Nama Lengkap Ayah</td>
                      <td className="py-1 px-2.5 font-bold uppercase text-slate-900">{pendaftar.namaAyah}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1 px-2.5 font-medium bg-slate-50 border-r border-slate-200 text-slate-700">2. Pekerjaan Ayah</td>
                      <td className="py-1 px-2.5">{pendaftar.pekerjaanAyah}</td>
                    </tr>

                    {/* IBU */}
                    <tr className="border-b border-slate-200 bg-slate-100 font-bold">
                      <td colSpan={2} className="py-0.5 px-2.5 text-slate-800 text-[9px] uppercase tracking-wide">
                        Identitas Ibu Kandung
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1 px-2.5 font-medium bg-slate-50 border-r border-slate-200 text-slate-700">3. Nama Lengkap Ibu</td>
                      <td className="py-1 px-2.5 font-bold uppercase text-slate-900">{pendaftar.namaIbu}</td>
                    </tr>
                    <tr>
                      <td className="py-1 px-2.5 font-medium bg-slate-50 border-r border-slate-200 text-slate-700">4. Pekerjaan Ibu</td>
                      <td className="py-1 px-2.5">{pendaftar.pekerjaanIbu}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* D. STATUS KELENGKAPAN BERKAS PERSYARATAN */}
              <div className="border border-slate-300 rounded overflow-hidden">
                <div className="bg-slate-800 text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  D. STATUS KELENGKAPAN BERKAS PERSYARATAN
                </div>
                <div className="p-1.5 bg-white grid grid-cols-2 sm:grid-cols-5 gap-1 text-[9px]">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center font-bold text-[8.5px] ${pendaftar.berkas.ijazahSkl ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-400 bg-slate-50'}`}>
                      {pendaftar.berkas.ijazahSkl ? '✓' : ''}
                    </span>
                    <span className="font-medium text-slate-800">Fotokopi Ijazah/SKL</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center font-bold text-[8.5px] ${pendaftar.berkas.kartuKeluarga ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-400 bg-slate-50'}`}>
                      {pendaftar.berkas.kartuKeluarga ? '✓' : ''}
                    </span>
                    <span className="font-medium text-slate-800">Fotokopi KK</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center font-bold text-[8.5px] ${pendaftar.berkas.aktaLahir ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-400 bg-slate-50'}`}>
                      {pendaftar.berkas.aktaLahir ? '✓' : ''}
                    </span>
                    <span className="font-medium text-slate-800">Fotokopi Akta Lahir</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center font-bold text-[8.5px] ${pendaftar.berkas.pasFoto ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-400 bg-slate-50'}`}>
                      {pendaftar.berkas.pasFoto ? '✓' : ''}
                    </span>
                    <span className="font-medium text-slate-800">Pasfoto 3x4 (3 Lbr)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center font-bold text-[8.5px] ${pendaftar.berkas.kipPkhKks ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-400 bg-slate-50'}`}>
                      {pendaftar.berkas.kipPkhKks ? '✓' : ''}
                    </span>
                    <span className="font-medium text-slate-800">KIP / PKH / KKS</span>
                  </div>
                </div>
              </div>

              {/* 4. BLOK PENGESAHAN & PASFOTO 3X4 */}
              <div className="pt-1.5 grid grid-cols-3 gap-2.5 text-center text-[9.5px]">
                {/* Kotak Pasfoto 3x4 Proporsional */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-18 h-24 sm:w-20 sm:h-26 border-2 border-dashed border-slate-400 bg-slate-50/70 flex flex-col items-center justify-center text-[8.5px] text-slate-400 font-bold p-1 rounded uppercase">
                    <span>TEMPEL</span>
                    <span>PASFOTO</span>
                    <span className="text-[9.5px] text-slate-600 font-black mt-0.5">3 X 4</span>
                  </div>
                </div>

                {/* Tanda Tangan Orang Tua / Wali */}
                <div className="flex flex-col justify-between h-24 py-0.5">
                  <div>
                    <p className="text-slate-600">Calon Siswa / Orang Tua,</p>
                  </div>
                  <div>
                    <p className="font-bold underline uppercase text-slate-900 text-[10px]">{pendaftar.namaAyah || pendaftar.namaLengkap}</p>
                    <p className="text-[8px] text-slate-500">Tanda Tangan & Nama Terang</p>
                  </div>
                </div>

                {/* Tanda Tangan Panitia PPDB */}
                <div className="flex flex-col justify-between h-24 py-0.5">
                  <div>
                    <p className="text-slate-600">
                      {profil.kabKota.replace('Kota ', '').replace('Kab. ', '')}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="font-bold text-slate-800">Panitia PPDB {profil.namaMadrasah}</p>
                  </div>
                  <div>
                    <p className="font-bold underline uppercase text-slate-900 text-[10px]">{penandatangan || pengaturan.panitiaKetua}</p>
                    <p className="text-[8px] text-slate-500">Panitia PPDB (Penandatangan)</p>
                  </div>
                </div>
              </div>

              {/* 5. PRINT FOOTER CATATAN RESMI */}
              <div className="pt-1.5 border-t border-slate-300 text-[8px] text-slate-500 flex justify-between items-center">
                <span>&bull; Bukti Pendaftaran Resmi PPDB {profil.namaMadrasah} TA {pengaturan.tahunAjaran} &bull; Dicetak pada: {new Date().toLocaleString('id-ID')}</span>
                <span className="font-mono font-semibold">Format Kertas A4 (21.0 × 29.7 cm)</span>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Control Bar (Hidden when printing) */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex justify-between items-center rounded-b-2xl print:hidden">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            Format cetak telah disesuaikan dengan ukuran standar **A4 (210 × 297 mm) Full Halaman**.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Tutup
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Formulir Ini (A4)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

