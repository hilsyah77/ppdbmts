import React, { useRef, useState } from 'react';
import { Pendaftar, ProfilMadrasahData, PengaturanPPDBData, JadwalPiket } from '../types';
import { X, Printer, CheckCircle, ShieldCheck, UserCheck } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn print:p-0 print:bg-white print:fixed print:inset-0">
      
      {/* Container for Screen Modal */}
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col print:shadow-none print:border-none print:max-w-none print:max-h-none print:w-full print:rounded-none">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="p-4 bg-slate-900 text-white rounded-t-2xl flex items-center justify-between sticky top-0 z-20 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold">Cetak Formulir Pendaftaran PPDB</h3>
              <p className="text-[11px] text-slate-400">
                Pratinjau Cetak / PDF untuk No. Registrasi: <span className="text-emerald-300 font-mono font-bold">{pendaftar.noRegistrasi}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Penandatangan Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300 font-medium whitespace-nowrap">Penandatangan:</span>
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
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-2 shadow-lg"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Sekarang (Print / PDF)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Area */}
        <div
          ref={printRef}
          className="p-8 sm:p-12 text-slate-900 bg-white font-serif max-w-3xl mx-auto w-full leading-normal print:p-8"
        >
          {/* 1. Kop Surat Resmi Madrasah */}
          <div className="border-b-4 border-double border-slate-900 pb-3 mb-6 text-center relative">
            
            {/* School Logo Left */}
            <div className="absolute left-0 top-1 w-16 h-16 flex items-center justify-center font-bold text-[10px] text-emerald-800 uppercase tracking-tighter text-center leading-tight overflow-hidden">
              {profil.logoUrl ? (
                <img src={profil.logoUrl} alt="Logo Sekolah" className="w-full h-full object-contain" />
              ) : (
                "MTsN 1"
              )}
            </div>

            <div className="px-16 space-y-0.5">
              <h2 className="text-sm sm:text-base font-black font-sans uppercase tracking-tight text-emerald-900">
                {pengaturan.kopHeaderLine3}
              </h2>
              <p className="text-[10px] font-sans text-slate-600">
                {profil.alamat}, {profil.kelurahan}, {profil.kecamatan}, {profil.kabKota}, {profil.provinsi} {profil.kodePos}
              </p>
              <p className="text-[10px] font-sans text-slate-600">
                Telp: {profil.telepon} | WA: {profil.whatsappCenter} | Website: {profil.website} | Email: {profil.email}
              </p>
            </div>
          </div>

          {/* Form Title & Barcode Placeholder */}
          <div className="text-center mb-6 relative">
            <h3 className="text-base font-bold font-sans uppercase tracking-wide underline decoration-2">
              FORMULIR PENDAFTARAN PESERTA DIDIK BARU (PPDB)
            </h3>
            <p className="text-xs font-sans font-medium text-slate-700 mt-0.5">
              TAHUN AJARAN {pengaturan.tahunAjaran} - {pengaturan.gelombangActive.toUpperCase()}
            </p>

            <div className="mt-3 flex items-center justify-between bg-slate-50 border border-slate-300 p-2.5 rounded-lg font-sans">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">NOMOR REGISTRASI</span>
                <span className="text-sm font-bold font-mono text-emerald-900">{pendaftar.noRegistrasi}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">JALUR SELEKSI</span>
                <span className="text-xs font-bold text-slate-800">{pendaftar.jalur}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">TANGGAL DAFTAR</span>
                <span className="text-xs font-medium text-slate-800">{pendaftar.tanggalDaftar}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">NO. URUT</span>
                <span className="text-sm font-bold font-mono text-slate-900">#{pendaftar.noUrut}</span>
              </div>
            </div>
          </div>

          {/* Form Body - Table Grid */}
          <div className="space-y-5 font-sans text-xs text-slate-900">
            
            {/* A. IDENTITAS CALON SISWA */}
            <div>
              <div className="bg-slate-800 text-white px-3 py-1 text-xs font-bold uppercase rounded-t tracking-wider">
                A. IDENTITAS CALON PESERTA DIDIK
              </div>
              <table className="w-full border border-slate-300 border-t-0 text-xs">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="p-2 w-48 font-medium bg-slate-50 border-r border-slate-200">1. Nama Lengkap</td>
                    <td className="p-2 font-bold uppercase text-slate-900">{pendaftar.namaLengkap}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2 font-medium bg-slate-50 border-r border-slate-200">2. Tempat, Tanggal Lahir</td>
                    <td className="p-2">{pendaftar.tempatLahir}, {pendaftar.tanggalLahir}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2 font-medium bg-slate-50 border-r border-slate-200">3. Jenis Kelamin</td>
                    <td className="p-2">{pendaftar.jenisKelamin}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2 font-medium bg-slate-50 border-r border-slate-200">4. NISN / NIK Siswa</td>
                    <td className="p-2 font-mono">NISN: {pendaftar.nisn} | NIK: {pendaftar.nik}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2 font-medium bg-slate-50 border-r border-slate-200">5. Jumlah Saudara & Anak Ke-</td>
                    <td className="p-2 font-medium text-slate-900">
                      {pendaftar.jumlahSaudara !== undefined ? `${pendaftar.jumlahSaudara} bersaudara` : '-'} | {pendaftar.anakKe !== undefined ? `Anak Ke-${pendaftar.anakKe}` : '-'}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2 font-medium bg-slate-50 border-r border-slate-200">6. Yang Membiayai Sekolah</td>
                    <td className="p-2 font-bold text-slate-900">{pendaftar.pembiayaSekolah || 'Orang Tua'}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-2 font-medium bg-slate-50 border-r border-slate-200">7. No. Telepon / WhatsApp</td>
                    <td className="p-2 font-mono font-bold">{pendaftar.noHpWa}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium bg-slate-50 border-r border-slate-200">8. Alamat Lengkap Siswa</td>
                    <td className="p-2">
                      {pendaftar.alamatSiswa}, RT/RW {pendaftar.rtRw}, Kel. {pendaftar.kelurahan}, Kec. {pendaftar.kecamatan}, {pendaftar.kabKota}, Prov. {pendaftar.provinsi}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* B. SEKOLAH ASAL */}
            <div>
              <div className="bg-slate-800 text-white px-3 py-1 text-xs font-bold uppercase rounded-t tracking-wider">
                B. SEKOLAH ASAL
              </div>
              <table className="w-full border border-slate-300 border-t-0 text-xs">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="p-2 w-48 font-medium bg-slate-50 border-r border-slate-200">1. Nama Sekolah Asal</td>
                    <td className="p-2 font-bold">{pendaftar.sekolahAsal}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium bg-slate-50 border-r border-slate-200">2. NPSN Sekolah Asal</td>
                    <td className="p-2 font-mono">{pendaftar.npsnSekolahAsal || '-'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* C. ORANG TUA / WALI */}
            <div>
              <div className="bg-slate-800 text-white px-3 py-1 text-xs font-bold uppercase rounded-t tracking-wider">
                C. DATA ORANG TUA / WALI SISWA
              </div>
              <table className="w-full border border-slate-300 border-t-0 text-xs">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="p-2 w-48 font-medium bg-slate-50 border-r border-slate-200">1. Nama Ayah</td>
                    <td className="p-2 font-bold">{pendaftar.namaAyah}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium bg-slate-50 border-r border-slate-200">2. Nama Ibu</td>
                    <td className="p-2 font-bold">{pendaftar.namaIbu}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* D. KELENGKAPAN BERKAS VERIFIKASI */}
            <div>
              <div className="bg-slate-800 text-white px-3 py-1 text-xs font-bold uppercase rounded-t tracking-wider">
                D. STATUS KELENGKAPAN BERKAS PERSYARATAN
              </div>
              <div className="p-3 border border-slate-300 border-t-0 grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center font-bold text-[10px] ${pendaftar.berkas.ijazahSkl ? 'bg-emerald-600 text-white' : 'border-slate-400'}`}>
                    {pendaftar.berkas.ijazahSkl ? '✓' : ''}
                  </span>
                  <span>Fotokopi Ijazah / SKL</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center font-bold text-[10px] ${pendaftar.berkas.kartuKeluarga ? 'bg-emerald-600 text-white' : 'border-slate-400'}`}>
                    {pendaftar.berkas.kartuKeluarga ? '✓' : ''}
                  </span>
                  <span>Fotokopi KK</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center font-bold text-[10px] ${pendaftar.berkas.aktaLahir ? 'bg-emerald-600 text-white' : 'border-slate-400'}`}>
                    {pendaftar.berkas.aktaLahir ? '✓' : ''}
                  </span>
                  <span>Fotokopi Akta Lahir</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center font-bold text-[10px] ${pendaftar.berkas.pasFoto ? 'bg-emerald-600 text-white' : 'border-slate-400'}`}>
                    {pendaftar.berkas.pasFoto ? '✓' : ''}
                  </span>
                  <span>Pasfoto 3x4 (3 Lbr)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center font-bold text-[10px] ${pendaftar.berkas.kipPkhKks ? 'bg-emerald-600 text-white' : 'border-slate-400'}`}>
                    {pendaftar.berkas.kipPkhKks ? '✓' : ''}
                  </span>
                  <span>Kartu KIP / PKH / KKS</span>
                </div>
              </div>
            </div>

            {/* Signature Block & Photo Box */}
            <div className="pt-6 grid grid-cols-3 gap-4 text-center text-xs font-sans">
              
              {/* Photo Box */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-24 h-32 border-2 border-dashed border-slate-400 bg-slate-50 flex flex-col items-center justify-center text-[10px] text-slate-400 font-bold p-2 uppercase">
                  <span>PASFOTO</span>
                  <span>3 X 4</span>
                </div>
              </div>

              {/* Orang Tua Signature */}
              <div className="flex flex-col justify-between h-36">
                <div>
                  <p className="text-slate-600">Calon Peserta Didik / Orang Tua,</p>
                </div>
                <div>
                  <p className="font-bold underline uppercase">{pendaftar.namaAyah || pendaftar.namaLengkap}</p>
                  <p className="text-[10px] text-slate-500">Tanda Tangan & Nama Terang</p>
                </div>
              </div>

              {/* Committee Signature */}
              <div className="flex flex-col justify-between h-36">
                <div>
                  <p className="text-slate-600">{profil.kabKota.replace('Kota ', '').replace('Kab. ', '')}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="font-bold text-slate-800">Panitia PPDB {profil.namaMadrasah}</p>
                </div>
                <div>
                  <p className="font-bold underline uppercase">{penandatangan || pengaturan.panitiaKetua}</p>
                  <p className="text-[10px] text-slate-500">Panitia PPDB (Penandatangan)</p>
                </div>
              </div>

            </div>

            {/* Print Footer Note */}
            <div className="pt-4 border-t border-slate-300 text-[9px] text-slate-500 font-sans flex justify-between">
              <span>* Bukti Pendaftaran Resmi PPDB {profil.namaMadrasah} TA {pengaturan.tahunAjaran}</span>
              <span>Dicetak Sistem pada: {new Date().toLocaleString('id-ID')}</span>
            </div>

          </div>

        </div>

        {/* Bottom Control Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center rounded-b-2xl print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-colors"
          >
            Tutup Pratinjau
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-2 shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Formulir Ini</span>
          </button>
        </div>

      </div>
    </div>
  );
};
