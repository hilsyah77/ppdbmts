import React, { useRef, useState } from 'react';
import { Pendaftar, ProfilMadrasahData, PengaturanPPDBData, JadwalPiket } from '../types';
import { X, Printer, UserCheck, FileText, CheckCircle2 } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn print:p-0 print:m-0 print:bg-white print:fixed print:inset-0 print:overflow-hidden">
      {/* Embedded Print Styles for Full, Clean, 1-Page A4 Precision Layout */}
      <style>{`
        @page {
          size: A4 portrait;
          margin: 6mm 10mm 6mm 10mm;
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
          #printable-formulir-ppdb, #printable-formulir-ppdb * {
            visibility: visible !important;
          }
          #printable-formulir-ppdb {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
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
        <div className="p-3.5 bg-slate-900 text-white rounded-t-2xl flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20 print:hidden shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold">Cetak Formulir Pendaftaran PPDB</h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Full Rapi &bull; 1 Halaman Pas A4
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                No. Registrasi: <span className="text-emerald-300 font-mono font-bold">{pendaftar.noRegistrasi}</span> — {pendaftar.namaLengkap}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Penandatangan Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300 font-medium whitespace-nowrap text-[11px]">Penandatangan:</span>
              <select
                value={penandatangan}
                onChange={(e) => setPenandatangan(e.target.value)}
                className="bg-slate-900 text-emerald-300 text-xs font-bold rounded px-2 py-1 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 max-w-[160px] truncate"
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

        {/* Paper Container Wrapper on Screen */}
        <div className="bg-slate-200/70 p-3 sm:p-5 flex justify-center print:bg-white print:p-0 print:m-0">
          {/* Printable Paper Area (Full Width, Crisp Borders & Elegant Balanced Layout) */}
          <div
            id="printable-formulir-ppdb"
            ref={printRef}
            className="w-full max-w-3xl bg-white text-slate-900 shadow-xl border border-slate-300 print:border-none print:shadow-none p-5 sm:p-7 font-sans leading-snug text-[10px] print:p-0"
            style={{ boxSizing: 'border-box' }}
          >
            {/* 1. Kop Surat Resmi Madrasah */}
            <div className="border-b-4 border-double border-slate-900 pb-2 mb-2 text-center relative">
              {/* Logo Madrasah / Kemenag */}
              <div className="absolute left-1 top-0.5 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center font-bold text-[10px] text-emerald-800 uppercase tracking-tighter text-center leading-tight overflow-hidden">
                {profil.logoUrl ? (
                  <img src={profil.logoUrl} alt="Logo Sekolah" className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full border-2 border-emerald-800 rounded-full flex items-center justify-center font-black text-emerald-900 text-[10px]">
                    KEMENAG
                  </div>
                )}
              </div>

              <div className="px-16 space-y-0.5">
                <h1 className="text-[13.5px] sm:text-[15px] font-black uppercase tracking-tight text-slate-950 leading-tight">
                  {pengaturan.kopHeaderLine3 || `PENERIMAAN PESERTA DIDIK BARU (PPDB) ${profil.namaMadrasah.toUpperCase()}`}
                </h1>
                <p className="text-[9.5px] text-slate-700 leading-tight">
                  {profil.alamat}, {profil.kelurahan}, {profil.kecamatan}, {profil.kabKota}, {profil.provinsi} {profil.kodePos}
                </p>
                <p className="text-[9.5px] text-slate-700 leading-tight">
                  Telp: {profil.telepon} | WA: {profil.whatsappCenter} | Website: {profil.website} | Email: {profil.email}
                </p>
              </div>
            </div>

            {/* 2. Judul Formulir & Kartu Registrasi */}
            <div className="text-center mb-2.5">
              <h2 className="text-[13px] font-bold uppercase tracking-wider underline decoration-2 text-slate-950 leading-tight">
                FORMULIR PENDAFTARAN PESERTA DIDIK BARU (PPDB)
              </h2>
              <p className="text-[10px] font-bold text-slate-800 mt-0.5">
                TAHUN AJARAN {pengaturan.tahunAjaran} &bull; {pengaturan.gelombangActive.toUpperCase()}
              </p>

              <div className="mt-1.5 grid grid-cols-4 gap-1.5 bg-slate-50 border border-slate-300 p-1.5 rounded text-left">
                <div className="border-r border-slate-300 pr-1.5">
                  <span className="text-[8px] uppercase font-bold text-slate-500 block">NOMOR REGISTRASI</span>
                  <span className="text-[11.5px] font-black font-mono text-emerald-950 block truncate">{pendaftar.noRegistrasi}</span>
                </div>
                <div className="border-r border-slate-300 px-1.5">
                  <span className="text-[8px] uppercase font-bold text-slate-500 block">JALUR SELEKSI</span>
                  <span className="text-[10px] font-bold text-slate-900 block truncate">{pendaftar.jalur}</span>
                </div>
                <div className="border-r border-slate-300 px-1.5">
                  <span className="text-[8px] uppercase font-bold text-slate-500 block">TANGGAL DAFTAR</span>
                  <span className="text-[10px] font-medium text-slate-900 block truncate">{pendaftar.tanggalDaftar}</span>
                </div>
                <div className="text-right pl-1.5">
                  <span className="text-[8px] uppercase font-bold text-slate-500 block">NO. URUT</span>
                  <span className="text-[11.5px] font-black font-mono text-slate-950">#{pendaftar.noUrut}</span>
                </div>
              </div>
            </div>

            {/* 3. Isi Formulir Pendaftaran (Full Rapi & Proporsional) */}
            <div className="space-y-2 text-[10px] text-slate-900">
              
              {/* A. IDENTITAS CALON PESERTA DIDIK */}
              <div className="border border-slate-400 rounded overflow-hidden">
                <div className="bg-slate-800 text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider flex items-center justify-between">
                  <span>A. IDENTITAS CALON PESERTA DIDIK</span>
                  <span className="text-[8.5px] font-mono text-emerald-300 font-normal">Data Calon Siswa</span>
                </div>
                <table className="w-full text-[9.5px] border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="py-1 px-2.5 w-40 font-medium bg-slate-50 border-r border-slate-200 text-slate-700">1. Nama Lengkap</td>
                      <td className="py-1 px-2.5 font-bold uppercase text-slate-950">{pendaftar.namaLengkap}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1 px-2.5 w-40 font-medium bg-slate-50 border-r border-slate-200 text-slate-700">2. Tempat, Tanggal Lahir</td>
                      <td className="py-1 px-2.5">{pendaftar.tempatLahir}, {pendaftar.tanggalLahir}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1 px-2.5 w-40 font-medium bg-slate-50 border-r border-slate-200 text-slate-700">3. Jenis Kelamin</td>
                      <td className="py-1 px-2.5 font-semibold">{pendaftar.jenisKelamin}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1 px-2.5 w-40 font-medium bg-slate-50 border-r border-slate-200 text-slate-700">4. NISN / NIK Siswa</td>
                      <td className="py-1 px-2.5 font-mono">
                        <span className="font-bold">NISN:</span> {pendaftar.nisn} <span className="text-slate-400 mx-1.5">|</span> <span className="font-bold">NIK:</span> {pendaftar.nik}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1 px-2.5 w-40 font-medium bg-slate-50 border-r border-slate-200 text-slate-700">5. No. Telepon / WhatsApp</td>
                      <td className="py-1 px-2.5 font-mono font-bold text-slate-900">{pendaftar.noHpWa}</td>
                    </tr>
                    <tr>
                      <td className="py-1 px-2.5 w-40 font-medium bg-slate-50 border-r border-slate-200 text-slate-700">6. Alamat Lengkap Siswa</td>
                      <td className="py-1 px-2.5 leading-tight">
                        {pendaftar.alamatSiswa}, RT/RW {pendaftar.rtRw}, Kel. {pendaftar.kelurahan}, Kec. {pendaftar.kecamatan}, {pendaftar.kabKota}, Prov. {pendaftar.provinsi}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* B. SEKOLAH ASAL */}
              <div className="border border-slate-400 rounded overflow-hidden">
                <div className="bg-slate-800 text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  B. SEKOLAH ASAL
                </div>
                <table className="w-full text-[9.5px] border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="py-1 px-2.5 w-40 font-medium bg-slate-50 border-r border-slate-200 text-slate-700">1. Nama Sekolah Asal</td>
                      <td className="py-1 px-2.5 font-bold text-slate-950 uppercase">{pendaftar.sekolahAsal}</td>
                    </tr>
                    <tr>
                      <td className="py-1 px-2.5 w-40 font-medium bg-slate-50 border-r border-slate-200 text-slate-700">2. NPSN Sekolah Asal</td>
                      <td className="py-1 px-2.5 font-mono">{pendaftar.npsnSekolahAsal || '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* C. DATA ORANG TUA / WALI SISWA (SEJAJAR 2 KOLOM: AYAH & IBU) */}
              <div className="border border-slate-400 rounded overflow-hidden">
                <div className="bg-slate-800 text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  C. DATA ORANG TUA / WALI SISWA
                </div>
                <div className="grid grid-cols-2 divide-x divide-slate-300">
                  {/* Kolom Kiri: Ayah Kandung / Wali */}
                  <div>
                    <div className="bg-slate-100 font-bold px-2.5 py-0.5 text-[9px] text-slate-800 border-b border-slate-200 uppercase tracking-wide">
                      Identitas Ayah Kandung / Wali
                    </div>
                    <table className="w-full text-[9.5px] border-collapse">
                      <tbody>
                        <tr className="border-b border-slate-200">
                          <td className="py-1 px-2 w-32 font-medium bg-slate-50 border-r border-slate-200 text-slate-700">1. Nama Ayah</td>
                          <td className="py-1 px-2 font-bold uppercase text-slate-950">{pendaftar.namaAyah}</td>
                        </tr>
                        <tr>
                          <td className="py-1 px-2 w-32 font-medium bg-slate-50 border-r border-slate-200 text-slate-700">2. Pekerjaan Ayah</td>
                          <td className="py-1 px-2">{pendaftar.pekerjaanAyah}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Kolom Kanan: Ibu Kandung (Sejajar dengan Ayah) */}
                  <div>
                    <div className="bg-slate-100 font-bold px-2.5 py-0.5 text-[9px] text-slate-800 border-b border-slate-200 uppercase tracking-wide">
                      Identitas Ibu Kandung
                    </div>
                    <table className="w-full text-[9.5px] border-collapse">
                      <tbody>
                        <tr className="border-b border-slate-200">
                          <td className="py-1 px-2 w-32 font-medium bg-slate-50 border-r border-slate-200 text-slate-700">1. Nama Ibu</td>
                          <td className="py-1 px-2 font-bold uppercase text-slate-950">{pendaftar.namaIbu}</td>
                        </tr>
                        <tr>
                          <td className="py-1 px-2 w-32 font-medium bg-slate-50 border-r border-slate-200 text-slate-700">2. Pekerjaan Ibu</td>
                          <td className="py-1 px-2">{pendaftar.pekerjaanIbu}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* D. STATUS KELENGKAPAN BERKAS PERSYARATAN */}
              <div className="border border-slate-400 rounded overflow-hidden">
                <div className="bg-slate-800 text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  D. STATUS KELENGKAPAN BERKAS PERSYARATAN
                </div>
                <div className="p-1.5 bg-white grid grid-cols-5 gap-1.5 text-[9px]">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center font-bold text-[8.5px] ${pendaftar.berkas.ijazahSkl ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-400 bg-slate-50'}`}>
                      {pendaftar.berkas.ijazahSkl ? '✓' : ''}
                    </span>
                    <span className="font-medium text-slate-900 truncate">Fotokopi Ijazah/SKL</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center font-bold text-[8.5px] ${pendaftar.berkas.kartuKeluarga ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-400 bg-slate-50'}`}>
                      {pendaftar.berkas.kartuKeluarga ? '✓' : ''}
                    </span>
                    <span className="font-medium text-slate-900 truncate">Fotokopi KK</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center font-bold text-[8.5px] ${pendaftar.berkas.aktaLahir ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-400 bg-slate-50'}`}>
                      {pendaftar.berkas.aktaLahir ? '✓' : ''}
                    </span>
                    <span className="font-medium text-slate-900 truncate">Fotokopi Akta Lahir</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center font-bold text-[8.5px] ${pendaftar.berkas.pasFoto ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-400 bg-slate-50'}`}>
                      {pendaftar.berkas.pasFoto ? '✓' : ''}
                    </span>
                    <span className="font-medium text-slate-900 truncate">Pasfoto 3x4 (3 Lbr)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center font-bold text-[8.5px] ${pendaftar.berkas.kipPkhKks ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-400 bg-slate-50'}`}>
                      {pendaftar.berkas.kipPkhKks ? '✓' : ''}
                    </span>
                    <span className="font-medium text-slate-900 truncate">KIP / PKH / KKS</span>
                  </div>
                </div>
              </div>

              {/* 4. BLOK PENGESAHAN & PASFOTO 3X4 (FULL & SEIMBANG) */}
              <div className="pt-2 grid grid-cols-3 gap-3 text-center text-[9.5px]">
                {/* Kotak Pasfoto 3x4 Proporsional Standar */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-20 h-28 border-2 border-dashed border-slate-400 bg-slate-50/80 flex flex-col items-center justify-center text-[8.5px] text-slate-400 font-bold p-1 rounded uppercase">
                    <span>TEMPEL</span>
                    <span>PASFOTO</span>
                    <span className="text-[10px] text-slate-700 font-black mt-0.5">3 X 4</span>
                  </div>
                </div>

                {/* Tanda Tangan Orang Tua / Calon Siswa */}
                <div className="flex flex-col justify-between h-28 py-0.5">
                  <div>
                    <p className="text-slate-600">Calon Siswa / Orang Tua,</p>
                  </div>
                  <div>
                    <p className="font-bold underline uppercase text-slate-950 text-[10px]">{pendaftar.namaAyah || pendaftar.namaLengkap}</p>
                    <p className="text-[8.5px] text-slate-500">Tanda Tangan & Nama Terang</p>
                  </div>
                </div>

                {/* Tanda Tangan Panitia PPDB */}
                <div className="flex flex-col justify-between h-28 py-0.5">
                  <div>
                    <p className="text-slate-600">
                      {profil.kabKota.replace('Kota ', '').replace('Kab. ', '')}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="font-bold text-slate-900">Panitia PPDB {profil.namaMadrasah}</p>
                  </div>
                  <div>
                    <p className="font-bold underline uppercase text-slate-950 text-[10px]">{penandatangan || pengaturan.panitiaKetua}</p>
                    <p className="text-[8.5px] text-slate-500">Panitia PPDB (Penandatangan)</p>
                  </div>
                </div>
              </div>

              {/* 5. PRINT FOOTER CATATAN RESMI */}
              <div className="pt-2 border-t border-slate-300 text-[8px] text-slate-500 flex justify-between items-center">
                <span>&bull; Bukti Pendaftaran Resmi PPDB {profil.namaMadrasah} TA {pengaturan.tahunAjaran} &bull; Dicetak pada: {new Date().toLocaleString('id-ID')}</span>
                <span className="font-mono font-semibold">1 Halaman Dokumen Resmi PPDB</span>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex justify-between items-center rounded-b-2xl print:hidden">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            Format cetak full rapi, mengisi kertas A4 secara presisi dan pas 1 halaman.
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
