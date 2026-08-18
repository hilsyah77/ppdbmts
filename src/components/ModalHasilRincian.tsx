import React, { useState, useMemo } from 'react';
import { ItemBiayaPembayaran, ProfilMadrasahData, PengaturanPPDBData, Pendaftar, JadwalPiket } from '../types';
import { initialJadwalPiket } from '../data/mockData';
import { 
  Printer, 
  X, 
  Copy, 
  Check, 
  FileText, 
  FileCheck,
  UserCheck,
  User
} from 'lucide-react';

interface ModalHasilRincianProps {
  itemBiayaList: ItemBiayaPembayaran[];
  profil: ProfilMadrasahData;
  pengaturan: PengaturanPPDBData;
  pendaftar?: Pendaftar | null;
  jadwalPiketList?: JadwalPiket[];
  onClose: () => void;
}

// Helper untuk mengubah angka rupiah menjadi format terbilang resmi Indonesia
function angkaKeTerbilang(nilai: number): string {
  const bilangan = [
    '', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima',
    'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'
  ];

  function convert(n: number): string {
    if (n < 0) return 'Minus ' + convert(Math.abs(n));
    if (n < 12) return bilangan[n];
    if (n < 20) return convert(n - 10) + ' Belas';
    if (n < 100) return (bilangan[Math.floor(n / 10)] || convert(Math.floor(n / 10))) + ' Puluh ' + convert(n % 10);
    if (n < 200) return 'Seratus ' + convert(n - 100);
    if (n < 1000) return convert(Math.floor(n / 100)) + ' Ratus ' + convert(n % 100);
    if (n < 2000) return 'Seribu ' + convert(n - 1000);
    if (n < 1000000) return convert(Math.floor(n / 1000)) + ' Ribu ' + convert(n % 1000);
    if (n < 1000000000) return convert(Math.floor(n / 1000000)) + ' Juta ' + convert(n % 1000000);
    return convert(Math.floor(n / 1000000000)) + ' Miliar ' + convert(n % 1000000000);
  }

  if (nilai === 0) return 'Nol Rupiah';
  const hasil = convert(nilai).replace(/\s+/g, ' ').trim();
  return `${hasil} Rupiah`;
}

export const ModalHasilRincian: React.FC<ModalHasilRincianProps> = ({
  itemBiayaList,
  profil,
  pengaturan,
  pendaftar,
  jadwalPiketList,
  onClose
}) => {
  const [viewMode, setViewMode] = useState<'formulir_resmi' | 'putra' | 'putri'>(
    'formulir_resmi'
  );
  const [copied, setCopied] = useState<boolean>(false);

  // Group items by category (namaKomponen)
  const groupedCategories: {
    kategoriName: string;
    items: ItemBiayaPembayaran[];
    subtotalPutra: number;
    subtotalPutri: number;
  }[] = [];

  itemBiayaList.forEach((item) => {
    const catName = item.namaKomponen || 'Lain-lain';
    let grp = groupedCategories.find((g) => g.kategoriName.trim().toLowerCase() === catName.trim().toLowerCase());
    if (!grp) {
      grp = {
        kategoriName: catName,
        items: [],
        subtotalPutra: 0,
        subtotalPutri: 0
      };
      groupedCategories.push(grp);
    }
    grp.items.push(item);
    if (item.sifat === 'Wajib') {
      grp.subtotalPutra += item.nominalPutra;
      grp.subtotalPutri += item.nominalPutri;
    }
  });

  // Totals
  const totalBiayaPutra = itemBiayaList
    .filter((i) => i.sifat === 'Wajib')
    .reduce((sum, i) => sum + i.nominalPutra, 0);

  const totalBiayaPutri = itemBiayaList
    .filter((i) => i.sifat === 'Wajib')
    .reduce((sum, i) => sum + i.nominalPutri, 0);

  const terbilangPutra = angkaKeTerbilang(totalBiayaPutra);
  const terbilangPutri = angkaKeTerbilang(totalBiayaPutri);

  // List of all Petugas Piket
  const piketList: JadwalPiket[] = useMemo(() => {
    if (jadwalPiketList && jadwalPiketList.length > 0) return jadwalPiketList;
    try {
      const saved = localStorage.getItem('ppdb_mts_piket');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return initialJadwalPiket;
  }, [jadwalPiketList]);

  // Extract all petugas names from piketList
  const allPetugasNames = useMemo(() => {
    const names: string[] = [];
    piketList.forEach((p) => {
      p.petugas.forEach((pt) => {
        if (pt && !names.includes(pt)) {
          names.push(pt);
        }
      });
    });
    return names.length > 0 ? names : ['Ust. M. Ridwan, S.Pd.I.', 'Ahmad Syafii, S.Pd.I.'];
  }, [piketList]);

  // Find today's active piket officer as default
  const defaultPetugas = useMemo(() => {
    const todayPiket = piketList.find((p) => p.status === 'Piket Hari Ini');
    if (todayPiket && todayPiket.petugas.length > 0) {
      return todayPiket.petugas[0];
    }
    return allPetugasNames[0] || 'Petugas Piket PPDB';
  }, [piketList, allPetugasNames]);

  const [selectedPetugas, setSelectedPetugas] = useState<string>(defaultPetugas);

  const handlePrint = () => {
    setViewMode('formulir_resmi');
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handleCopyText = () => {
    let text = `*FORMULIR DAFTAR ULANG SPMB*\n`;
    text += `*${profil.namaMadrasah.toUpperCase()}*\n`;
    text += `*TAHUN PELAJARAN ${pengaturan.tahunAjaran.toUpperCase()}*\n`;
    text += `========================================\n\n`;

    if (pendaftar) {
      text += `IDENTITAS SISWA:\n`;
      text += `1. Nama Lengkap: ${pendaftar.namaLengkap}\n`;
      text += `2. No Registrasi: ${pendaftar.noRegistrasi}\n`;
      text += `3. Jenis Kelamin: ${pendaftar.jenisKelamin}\n`;
      text += `4. NISN: ${pendaftar.nisn}\n`;
      text += `5. No. Telepon / WhatsApp: ${pendaftar.noHpWa || pendaftar.noHpOrangTua || '-'}\n`;
      text += `6. Nama Orang Tua: ${pendaftar.namaAyah || pendaftar.namaIbu || pendaftar.namaKepalaKeluarga || '-'}\n`;
      text += `7. Alamat Lengkap: ${alamatLengkapSiswa || '-'}\n\n`;
    }

    groupedCategories.forEach((grp, catIdx) => {
      text += `*${catIdx + 1}. ${grp.kategoriName}*\n`;
      grp.items.forEach((item, itemIdx) => {
        const char = String.fromCharCode(97 + itemIdx); // a, b, c...
        let rincianName = item.kategori || item.namaKomponen;
        if (grp.kategoriName.toLowerCase().includes('seragam') || item.namaKomponen.toLowerCase().includes('seragam')) {
          if (!/^seragam/i.test(rincianName.trim())) {
            rincianName = `Seragam ${rincianName}`;
          }
        }
        const putrStr = item.nominalPutra > 0 ? `Rp ${item.nominalPutra.toLocaleString('id-ID')}` : '----------';
        const putrIStr = item.nominalPutri > 0 ? `Rp ${item.nominalPutri.toLocaleString('id-ID')}` : '----------';
        text += `   ${char}. ${rincianName.padEnd(38, ' ')} Putra: ${putrStr} | Putri: ${putrIStr}\n`;
      });
      text += `   JUMLAH (${catIdx + 1}) : Putra Rp ${grp.subtotalPutra.toLocaleString('id-ID')} | Putri Rp ${grp.subtotalPutri.toLocaleString('id-ID')}\n\n`;
    });

    text += `========================================\n`;
    text += `*JUMLAH TOTAL:*\n`;
    text += `• PUTRA : Rp ${totalBiayaPutra.toLocaleString('id-ID')}\n  (${terbilangPutra})\n`;
    text += `• PUTRI : Rp ${totalBiayaPutri.toLocaleString('id-ID')}\n  (${terbilangPutri})\n\n`;
    text += `Ketentuan:\n`;
    text += `3. Bersedia menaati peraturan yang ada di madrasah\n`;
    text += `4. Semua biaya administrasi yang telah masuk tidak akan saya Tarik kembali\n\n`;
    text += `Lokasi: ${profil.alamat}, ${profil.kabKota || profil.kecamatan}\n`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Build full student address string
  const alamatLengkapSiswa = pendaftar
    ? [
        pendaftar.alamatSiswa,
        pendaftar.rtRw ? `RT/RW ${pendaftar.rtRw}` : '',
        pendaftar.kelurahan ? `Desa/Kel. ${pendaftar.kelurahan}` : '',
        pendaftar.kecamatan ? `Kec. ${pendaftar.kecamatan}` : '',
        pendaftar.kabKota ? `${pendaftar.kabKota}` : '',
        pendaftar.provinsi ? `Prov. ${pendaftar.provinsi}` : ''
      ].filter(Boolean).join(', ')
    : '';

  // Get father name for signature
  const namaAyah = pendaftar?.namaAyah || (pendaftar?.namaKepalaKeluarga || pendaftar?.namaIbu || '');

  // Formatted date
  const tanggalHariIni = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const lokasiKota = profil.kecamatan || profil.kabKota || 'Jakarta';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static print:overflow-visible">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[96vh] print:max-h-none print:shadow-none print:border-none print:rounded-none print:m-0 print:w-full print:static">
        
        {/* MODAL CONTROLS HEADER (HIDDEN ON PRINT) */}
        <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span>Formulir Daftar Ulang & Rincian Biaya PPDB</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold">
                  T.A. {pengaturan.tahunAjaran}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 flex items-center gap-2">
                {pendaftar ? (
                  <span className="text-emerald-300 font-semibold flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" />
                    {pendaftar.namaLengkap} ({pendaftar.jenisKelamin}) • Reg: {pendaftar.noRegistrasi}
                  </span>
                ) : (
                  <span>Format resmi cetak dokumen sesuai berkas formulir pendaftaran PPDB</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Petugas Piket Selector for Signature */}
            <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-700">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] text-slate-300 font-medium">Petugas Piket:</span>
              <select
                value={selectedPetugas}
                onChange={(e) => setSelectedPetugas(e.target.value)}
                className="bg-slate-900 text-white text-xs rounded-lg px-2 py-1 border border-slate-600 focus:outline-none focus:border-emerald-500 font-medium cursor-pointer"
              >
                {allPetugasNames.map((name, idx) => (
                  <option key={idx} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Switcher */}
            <div className="bg-slate-800 p-1 rounded-xl flex items-center text-xs">
              <button
                onClick={() => setViewMode('formulir_resmi')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'formulir_resmi' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Format Scan Resmi</span>
              </button>
              <button
                onClick={() => setViewMode('putra')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  viewMode === 'putra' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Putra Saja
              </button>
              <button
                onClick={() => setViewMode('putri')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  viewMode === 'putri' ? 'bg-pink-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Putri Saja
              </button>
            </div>

            <button
              onClick={handleCopyText}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 border border-slate-700"
              title="Salin teks rincian ke WhatsApp"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              title="Cetak Formulir Daftar Ulang Sesuai Format Scan Resmi"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Formulir Scan Resmi</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MODAL CONTENT BODY (PRINTABLE AREA) */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-6 print:p-0 print:m-0 print:overflow-visible text-slate-900 bg-white text-[13px] leading-normal font-serif">
          
          {/* VIEW MODE 1: FORMULIR DAFTAR ULANG PESERTA DIDIK BARU (SESUAI GAMBAR SCAN ASLI - SELALU DICETAK DI PRINT) */}
          <div className={`space-y-4 max-w-3xl mx-auto ${viewMode === 'formulir_resmi' ? 'block' : 'hidden print:block'}`}>
            
            {/* TOP HEADER SECTION: LOGO + JUDUL (KIRI) & TUJUAN KEPALA MADRASAH (KANAN SEJAJAR) */}
            <div className="flex justify-between items-center pt-1 pb-1 gap-4">
                {/* Header Kiri: Logo Sekolah & Judul */}
                <div className="flex items-center gap-3.5">
                  {/* Logo Sekolah Sesuai Ukuran Judul */}
                  <div className="w-16 h-16 shrink-0 flex items-center justify-center">
                    {profil.logoUrl ? (
                      <img
                        src={profil.logoUrl}
                        alt="Logo Sekolah"
                        className="w-16 h-16 object-contain"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-sm border border-emerald-800">
                        MTS
                      </div>
                    )}
                  </div>

                  {/* Teks Judul */}
                  <div className="space-y-0.5">
                    <h2 className="font-bold text-[15px] underline uppercase tracking-tight text-black leading-tight">
                      FORMULIR DAFTAR ULANG SPMB
                    </h2>
                    <h3 className="font-bold text-[13.5px] uppercase text-black leading-tight">
                      {profil.namaMadrasah ? profil.namaMadrasah.toUpperCase() : "MTs ASY-SYAFI'IYYAH"}
                    </h3>
                    <h4 className="font-bold text-[12.5px] underline uppercase text-black leading-tight">
                      TAHUN PELAJARAN {pengaturan.tahunAjaran.replace('/', ' – ')}
                    </h4>
                  </div>
                </div>

                {/* Header Kanan: Kepada Yth. Kepala (Sejajar dengan Judul) */}
                <div className="text-left shrink-0 text-[12.5px] leading-snug min-w-[200px]">
                  <p className="text-black font-normal">Kepada Yth. Kepala</p>
                  <p className="font-bold text-black">{profil.namaMadrasah || "MTs ASY-SYAFI'IYYAH"}</p>
                  <p className="text-black">{profil.kecamatan || 'Cilandak'}-{profil.kabKota || 'Jakarta Selatan'}</p>
                </div>
              </div>

              {/* SALAM & BIODATA ISIAN 7 POIN SESUAI FORMAT */}
              <div className="space-y-2 text-[13px] pt-0.5">
                <p className="text-black">Assalamualaikum Wr. Wb.</p>
                <p className="text-black">Yang bertanda tangan di bawah ini, saya:</p>

                <div className="space-y-1.5 pl-2 text-[12.5px]">
                  {/* 1. Nama Lengkap */}
                  <div className="flex items-baseline">
                    <span className="w-5 text-black font-semibold">1.</span>
                    <span className="w-48 text-black">Nama Lengkap</span>
                    <span className="mr-2 text-black">:</span>
                    <span className="flex-1 border-b border-dotted border-black pb-0.5 font-bold uppercase text-black">
                      {pendaftar?.namaLengkap || <>&nbsp;</>}
                    </span>
                  </div>

                  {/* 2. No Registrasi */}
                  <div className="flex items-baseline">
                    <span className="w-5 text-black font-semibold">2.</span>
                    <span className="w-48 text-black">No. Registrasi</span>
                    <span className="mr-2 text-black">:</span>
                    <span className="flex-1 border-b border-dotted border-black pb-0.5 font-semibold text-black">
                      {pendaftar?.noRegistrasi || <>&nbsp;</>}
                    </span>
                  </div>

                  {/* 3. Jenis Kelamin */}
                  <div className="flex items-baseline">
                    <span className="w-5 text-black font-semibold">3.</span>
                    <span className="w-48 text-black">Jenis Kelamin</span>
                    <span className="mr-2 text-black">:</span>
                    <span className="flex-1 border-b border-dotted border-black pb-0.5 font-medium text-black">
                      {pendaftar?.jenisKelamin || <>&nbsp;</>}
                    </span>
                  </div>

                  {/* 4. NISN */}
                  <div className="flex items-baseline">
                    <span className="w-5 text-black font-semibold">4.</span>
                    <span className="w-48 text-black">NISN</span>
                    <span className="mr-2 text-black">:</span>
                    <span className="flex-1 border-b border-dotted border-black pb-0.5 font-medium text-black">
                      {pendaftar?.nisn || <>&nbsp;</>}
                    </span>
                  </div>

                  {/* 5. No. Telepon / WhatsApp */}
                  <div className="flex items-baseline">
                    <span className="w-5 text-black font-semibold">5.</span>
                    <span className="w-48 text-black">No. Telepon / WhatsApp</span>
                    <span className="mr-2 text-black">:</span>
                    <span className="flex-1 border-b border-dotted border-black pb-0.5 font-medium text-black">
                      {pendaftar?.noHpWa || pendaftar?.noHpOrangTua || <>&nbsp;</>}
                    </span>
                  </div>

                  {/* 6. Nama Orang Tua */}
                  <div className="flex items-baseline">
                    <span className="w-5 text-black font-semibold">6.</span>
                    <span className="w-48 text-black">Nama Orang Tua</span>
                    <span className="mr-2 text-black">:</span>
                    <span className="flex-1 border-b border-dotted border-black pb-0.5 font-semibold text-black">
                      {pendaftar?.namaAyah || pendaftar?.namaKepalaKeluarga || pendaftar?.namaIbu || <>&nbsp;</>}
                    </span>
                  </div>

                  {/* 7. Alamat Lengkap Siswa */}
                  <div className="flex items-baseline">
                    <span className="w-5 text-black font-semibold">7.</span>
                    <span className="w-48 text-black">Alamat Lengkap Siswa</span>
                    <span className="mr-2 text-black">:</span>
                    <span className="flex-1 border-b border-dotted border-black pb-0.5 font-medium text-black">
                      {alamatLengkapSiswa || <>&nbsp;</>}
                    </span>
                  </div>
                </div>

                <p className="text-black leading-relaxed pt-1 text-justify">
                  Dengan ini menyelesaikan daftar ulang sebagai peserta didik kelas VII (Tujuh) baru {profil.namaMadrasah} tahun pelajaran {pengaturan.tahunAjaran.replace('/', ' – ')}. Serta kami serahkan persyaratan daftar ulang berupa:
                </p>
              </div>

              {/* TABEL RINCIAN BIAYA (BORDER RESMI HITAM SESUAI SCAN) */}
              <div className="pt-1">
                <table className="w-full border-collapse border border-black text-[12px] leading-tight">
                  <thead>
                    <tr className="border-b border-black text-center font-bold uppercase">
                      <th className="border-r border-black py-1.5 px-2 w-8"></th>
                      <th className="border-r border-black py-1.5 px-3 text-center">URAIAN</th>
                      <th className="border-r border-black py-1.5 px-3 text-center w-36">PUTRA</th>
                      <th className="py-1.5 px-3 text-center w-36">PUTRI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedCategories.map((grp, catIdx) => (
                      <React.Fragment key={catIdx}>
                        {/* Category Header Row (1. Pembayaran Administrasi Keuangan) */}
                        <tr className="border-t border-black font-semibold">
                          <td className="border-r border-black py-1 px-2 text-center align-top font-bold">
                            {catIdx + 1}.
                          </td>
                          <td className="border-r border-black py-1 px-2 text-left font-bold" colSpan={3}>
                            {grp.kategoriName}
                          </td>
                        </tr>

                        {/* Items Rows (a., b., c...) */}
                        {grp.items.map((item, itemIdx) => {
                          const char = String.fromCharCode(97 + itemIdx); // a, b, c...
                          const isPutraDash = item.nominalPutra === 0;
                          const isPutriDash = item.nominalPutri === 0;

                          return (
                            <tr key={item.id} className="border-t border-black/40">
                              <td className="border-r border-black py-0.5 px-2 text-center align-top">
                                {char}.
                              </td>
                              <td className="border-r border-black py-0.5 px-2 text-left">
                                {(() => {
                                  const rawName = item.kategori || item.namaKomponen;
                                  if (grp.kategoriName.toLowerCase().includes('seragam') || item.namaKomponen.toLowerCase().includes('seragam')) {
                                    return /^seragam/i.test(rawName.trim()) ? rawName : `Seragam ${rawName}`;
                                  }
                                  return rawName;
                                })()}
                              </td>
                              <td className="border-r border-black py-0.5 px-2 text-right font-mono">
                                {isPutraDash ? (
                                  <span className="text-center block tracking-widest font-serif">----------</span>
                                ) : (
                                  <div className="flex justify-between">
                                    <span>Rp</span>
                                    <span>{item.nominalPutra.toLocaleString('id-ID')}</span>
                                  </div>
                                )}
                              </td>
                              <td className="py-0.5 px-2 text-right font-mono">
                                {isPutriDash ? (
                                  <span className="text-center block tracking-widest font-serif">----------</span>
                                ) : (
                                  <div className="flex justify-between">
                                    <span>Rp</span>
                                    <span>{item.nominalPutri.toLocaleString('id-ID')}</span>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}

                        {/* Subtotal Row inside Table (JUMLAH (1), JUMLAH (2)) */}
                        <tr className="border-t border-black font-semibold">
                          <td className="border-r border-black py-1 px-2"></td>
                          <td className="border-r border-black py-1 px-2 text-right font-bold uppercase">
                            JUMLAH ({catIdx + 1})
                          </td>
                          <td className="border-r border-black py-1 px-2 text-right font-bold font-mono">
                            <div className="flex justify-between">
                              <span>Rp</span>
                              <span>{grp.subtotalPutra.toLocaleString('id-ID')}</span>
                            </div>
                          </td>
                          <td className="py-1 px-2 text-right font-bold font-mono">
                            <div className="flex justify-between">
                              <span>Rp</span>
                              <span>{grp.subtotalPutri.toLocaleString('id-ID')}</span>
                            </div>
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}

                    {/* JUMLAH TOTAL ROW */}
                    <tr className="border-t-2 border-black font-bold text-[13px]">
                      <td className="border-r border-black py-1.5 px-2"></td>
                      <td className="border-r border-black py-1.5 px-2 text-center font-black uppercase tracking-wider">
                        JUMLAH TOTAL
                      </td>
                      <td className="border-r border-black py-1.5 px-2 text-right font-black font-mono">
                        <div className="flex justify-between">
                          <span>Rp</span>
                          <span>{totalBiayaPutra.toLocaleString('id-ID')}</span>
                        </div>
                      </td>
                      <td className="py-1.5 px-2 text-right font-black font-mono">
                        <div className="flex justify-between">
                          <span>Rp</span>
                          <span>{totalBiayaPutri.toLocaleString('id-ID')}</span>
                        </div>
                      </td>
                    </tr>

                    {/* TERBILANG SECTION IN TABLE */}
                    <tr className="border-t border-black">
                      <td className="border-r border-black py-1 px-2"></td>
                      <td className="py-1 px-2 text-left italic" colSpan={3}>
                        <p className="font-semibold not-italic">Terbilang:</p>
                        <p className="pl-4">
                          Putra: Rp {totalBiayaPutra.toLocaleString('id-ID')} ({terbilangPutra})
                        </p>
                        <p className="pl-4">
                          Putri : Rp {totalBiayaPutri.toLocaleString('id-ID')} ({terbilangPutri})
                        </p>
                      </td>
                    </tr>

                    {/* PERNYATAAN 3 & 4 IN TABLE */}
                    <tr className="border-t border-black">
                      <td className="border-r border-black py-1 px-2 text-center font-bold align-top">
                        3.
                      </td>
                      <td className="py-1 px-2 text-left font-medium" colSpan={3}>
                        Bersedia menaati peraturan yang ada di madrasah
                      </td>
                    </tr>
                    <tr className="border-t border-black">
                      <td className="border-r border-black py-1 px-2 text-center font-bold align-top">
                        4.
                      </td>
                      <td className="py-1 px-2 text-left font-medium" colSpan={3}>
                        Semua biaya administrasi yang telah masuk tidak akan saya Tarik kembali
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* SALAM PENUTUP & TANDA TANGAN (PETUGAS PIKET & NAMA AYAH) */}
              <div className="pt-2 space-y-3 text-[13px]">
                <p className="text-black">Wassalamualaikum Wr. Wb</p>

                <div className="pt-2 grid grid-cols-2 gap-12 text-left">
                  {/* TTD KIRI: PETUGAS PIKET */}
                  <div className="space-y-16">
                    <p className="text-black leading-tight">
                      Mengetahui,<br />
                      Petugas Piket PPDB
                    </p>
                    <div>
                      <p className="font-bold underline text-black">
                        (&nbsp;{selectedPetugas}&nbsp;)
                      </p>
                    </div>
                  </div>

                  {/* TTD KANAN: ORANG TUA (NAMA AYAH) */}
                  <div className="space-y-16">
                    <p className="text-black leading-tight">
                      {lokasiKota}, {tanggalHariIni}<br />
                      Orang Tua / Wali (Ayah)
                    </p>
                    <div>
                      <p className="font-bold underline text-black">
                        (&nbsp;{namaAyah || '........................................'}&nbsp;)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          {/* VIEW MODE 2: TABEL KHUSUS PUTRA */}
          {viewMode === 'putra' && (
            <div className="space-y-6 font-sans print:hidden">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-blue-950">Rincian Biaya Khusus Calon Siswa Putra (Laki-laki)</h4>
                  <p className="text-xs text-blue-800">Tahun Ajaran {pengaturan.tahunAjaran}</p>
                </div>
                <span className="px-3 py-1 bg-blue-600 text-white font-bold rounded-lg text-xs">
                  Putra
                </span>
              </div>

              {groupedCategories.map((grp, catIdx) => (
                <div key={catIdx} className="border border-blue-300 rounded-xl overflow-hidden bg-white shadow-sm">
                  <div className="bg-blue-50/80 border-b border-blue-200 px-4 py-2.5 font-black text-xs text-blue-950 uppercase tracking-wide">
                    {catIdx + 1}. {grp.kategoriName}
                  </div>
                  <table className="w-full text-xs text-left border-collapse">
                    <tbody className="divide-y divide-slate-100">
                      {grp.items.map((item, itemIdx) => {
                        const char = String.fromCharCode(97 + itemIdx);
                        const displayName = grp.kategoriName.toLowerCase().includes('seragam') && !/^seragam/i.test((item.kategori || item.namaKomponen).trim())
                          ? `Seragam ${item.kategori || item.namaKomponen}`
                          : item.kategori || item.namaKomponen;
                        return (
                          <tr key={item.id} className="hover:bg-blue-50/40">
                            <td className="w-10 py-2.5 pl-4 font-bold text-blue-800">{char}.</td>
                            <td className="py-2.5 font-semibold text-slate-800">{displayName}</td>
                            <td className="py-2.5 pr-4 text-right font-mono font-bold text-blue-950">
                              Rp {item.nominalPutra.toLocaleString('id-ID')}
                            </td>
                          </tr>
                        );
                      })}
                      <tr className="bg-blue-50/60 font-bold border-t border-blue-200">
                        <td colSpan={2} className="py-2 pl-4 text-right uppercase text-[11px] text-blue-900">
                          Subtotal ({catIdx + 1}):
                        </td>
                        <td className="py-2 pr-4 text-right font-mono text-blue-950">
                          Rp {grp.subtotalPutra.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}

              <div className="p-4 bg-blue-100 border border-blue-300 rounded-xl flex items-center justify-between font-black text-blue-950">
                <span className="text-xs uppercase">TOTAL BIAYA KESELURUHAN PUTRA:</span>
                <span className="font-mono text-base text-blue-900">
                  Rp {totalBiayaPutra.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          )}

          {/* VIEW MODE 3: TABEL KHUSUS PUTRI */}
          {viewMode === 'putri' && (
            <div className="space-y-6 font-sans print:hidden">
              <div className="p-4 bg-pink-50 border border-pink-200 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-pink-950">Rincian Biaya Khusus Calon Siswi Putri (Perempuan)</h4>
                  <p className="text-xs text-pink-800">Tahun Ajaran {pengaturan.tahunAjaran}</p>
                </div>
                <span className="px-3 py-1 bg-pink-600 text-white font-bold rounded-lg text-xs">
                  Putri
                </span>
              </div>

              {groupedCategories.map((grp, catIdx) => (
                <div key={catIdx} className="border border-pink-300 rounded-xl overflow-hidden bg-white shadow-sm">
                  <div className="bg-pink-50/80 border-b border-pink-200 px-4 py-2.5 font-black text-xs text-pink-950 uppercase tracking-wide">
                    {catIdx + 1}. {grp.kategoriName}
                  </div>
                  <table className="w-full text-xs text-left border-collapse">
                    <tbody className="divide-y divide-slate-100">
                      {grp.items.map((item, itemIdx) => {
                        const char = String.fromCharCode(97 + itemIdx);
                        const displayName = grp.kategoriName.toLowerCase().includes('seragam') && !/^seragam/i.test((item.kategori || item.namaKomponen).trim())
                          ? `Seragam ${item.kategori || item.namaKomponen}`
                          : item.kategori || item.namaKomponen;
                        return (
                          <tr key={item.id} className="hover:bg-pink-50/40">
                            <td className="w-10 py-2.5 pl-4 font-bold text-pink-800">{char}.</td>
                            <td className="py-2.5 font-semibold text-slate-800">{displayName}</td>
                            <td className="py-2.5 pr-4 text-right font-mono font-bold text-pink-950">
                              {item.nominalPutri > 0 ? `Rp ${item.nominalPutri.toLocaleString('id-ID')}` : '—'}
                            </td>
                          </tr>
                        );
                      })}
                      <tr className="bg-pink-50/60 font-bold border-t border-pink-200">
                        <td colSpan={2} className="py-2 pl-4 text-right uppercase text-[11px] text-pink-900">
                          Subtotal ({catIdx + 1}):
                        </td>
                        <td className="py-2 pr-4 text-right font-mono text-pink-950">
                          Rp {grp.subtotalPutri.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}

              <div className="p-4 bg-pink-100 border border-pink-300 rounded-xl flex items-center justify-between font-black text-pink-950">
                <span className="text-xs uppercase">TOTAL BIAYA KESELURUHAN PUTRI:</span>
                <span className="font-mono text-base text-pink-900">
                  Rp {totalBiayaPutri.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};



