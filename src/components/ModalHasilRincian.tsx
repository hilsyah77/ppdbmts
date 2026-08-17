import React, { useState } from 'react';
import { ItemBiayaPembayaran, ProfilMadrasahData, PengaturanPPDBData } from '../types';
import { 
  Printer, 
  X, 
  Copy, 
  Check, 
  FileText, 
  FileCheck
} from 'lucide-react';

interface ModalHasilRincianProps {
  itemBiayaList: ItemBiayaPembayaran[];
  profil: ProfilMadrasahData;
  pengaturan: PengaturanPPDBData;
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
  onClose
}) => {
  const [viewMode, setViewMode] = useState<'formulir_resmi' | 'putra' | 'putri'>('formulir_resmi');
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

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    let text = `*FORMULIR DAFTAR ULANG PESERTA DIDIK BARU*\n`;
    text += `*${profil.namaMadrasah.toUpperCase()}*\n`;
    text += `*TAHUN PELAJARAN ${pengaturan.tahunAjaran.toUpperCase()}*\n`;
    text += `========================================\n\n`;

    groupedCategories.forEach((grp, catIdx) => {
      text += `*${catIdx + 1}. ${grp.kategoriName}*\n`;
      grp.items.forEach((item, itemIdx) => {
        const char = String.fromCharCode(97 + itemIdx); // a, b, c...
        const rincianName = item.kategori || item.namaKomponen;
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
    text += `Lokasi: ${profil.alamat}, ${profil.kabupatenKota}\n`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const currentYear = new Date().getFullYear();

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
              <p className="text-[11px] text-slate-400">
                Format resmi cetak dokumen sesuai berkas formulir pendaftaran PPDB
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
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
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Print</span>
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
          
          {/* VIEW MODE 1: FORMULIR DAFTAR ULANG PESERTA DIDIK BARU (SESUAI GAMBAR SCAN ASLI) */}
          {viewMode === 'formulir_resmi' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              
              {/* TOP HEADER SECTION */}
              <div className="flex justify-between items-start pt-1">
                {/* Header Kiri: Judul Formulir */}
                <div className="space-y-1">
                  <h2 className="font-bold text-[15px] underline uppercase tracking-tight text-black">
                    FORMULIR DAFTAR ULANG PESERTA DIDIK BARU
                  </h2>
                  <h3 className="font-bold text-[14px] uppercase text-black">
                    {profil.namaMadrasah.toUpperCase()}
                  </h3>
                  <h4 className="font-bold text-[14px] underline uppercase text-black">
                    TAHUN PELAJARAN {pengaturan.tahunAjaran.replace('/', ' – ')}
                  </h4>
                </div>

                {/* Header Kanan: No PMBM & No Daftar Ulang */}
                <div className="text-right space-y-1.5 shrink-0 text-[13px]">
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="font-medium text-black">No PMBM :</span>
                    <span className="font-medium text-black">PPDB{currentYear}</span>
                    <div className="flex gap-1 ml-1">
                      <span className="w-5 h-6 border border-black inline-block text-center text-xs"></span>
                      <span className="w-5 h-6 border border-black inline-block text-center text-xs"></span>
                      <span className="w-5 h-6 border border-black inline-block text-center text-xs"></span>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-0.5">
                    <span className="font-medium text-black">No Daftar Ulang :</span>
                    <span className="inline-block border-b border-black w-28">&nbsp;</span>
                  </div>
                </div>
              </div>

              {/* TUJUAN SURAT (KEPADA YTH KEPALA) */}
              <div className="flex justify-end pt-2 text-[13px] leading-relaxed">
                <div className="w-64 text-left">
                  <p className="text-black">Kepada Yth. Kepala</p>
                  <p className="text-black">{profil.namaMadrasah}</p>
                  <p className="text-black">{profil.kecamatan || 'Jatibarang'}-{profil.kabupatenKota || 'Brebes'}</p>
                </div>
              </div>

              {/* SALAM & BIODATA ISIAN */}
              <div className="space-y-2 text-[13px] pt-1">
                <p className="text-black">Assalamualaikum Wr. Wb.</p>
                <p className="text-black">Yang bertanda tangan di bawah ini, saya:</p>

                <div className="space-y-1.5 pl-4">
                  <div className="flex items-baseline">
                    <span className="w-6 text-black">1.</span>
                    <span className="w-36 text-black">Nama</span>
                    <span className="mr-2 text-black">:</span>
                    <span className="flex-1 border-b border-dotted border-black pb-0.5">&nbsp;</span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-6 text-black">2.</span>
                    <span className="w-36 text-black">Nama Orang tua</span>
                    <span className="mr-2 text-black">:</span>
                    <span className="flex-1 border-b border-dotted border-black pb-0.5">&nbsp;</span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-6 text-black">3.</span>
                    <span className="w-36 text-black">Alamat</span>
                    <span className="mr-2 text-black">:</span>
                    <span className="flex-1 border-b border-dotted border-black pb-0.5">&nbsp;</span>
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
                                {item.kategori || item.namaKomponen}
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

              {/* SALAM PENUTUP & TANDA TANGAN */}
              <div className="pt-2 space-y-3 text-[13px]">
                <p className="text-black">Wassalamualaikum Wr. Wb</p>

                <div className="pt-2 grid grid-cols-2 gap-12 text-left">
                  {/* TTD KIRI: PETUGAS PMB */}
                  <div className="space-y-16">
                    <p className="text-black">
                      Mengetahui,<br />
                      Petugas PMB
                    </p>
                    <div>
                      <p className="font-medium text-black">
                        (&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)
                      </p>
                    </div>
                  </div>

                  {/* TTD KANAN: PENDAFTAR */}
                  <div className="space-y-16">
                    <p className="text-black">
                      {profil.kecamatan || 'Jatibarang'}, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {currentYear}<br />
                      Pendaftar
                    </p>
                    <div>
                      <p className="font-medium text-black">
                        (&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* VIEW MODE 2: TABEL KHUSUS PUTRA */}
          {viewMode === 'putra' && (
            <div className="space-y-6 font-sans">
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
                        return (
                          <tr key={item.id} className="hover:bg-blue-50/40">
                            <td className="w-10 py-2.5 pl-4 font-bold text-blue-800">{char}.</td>
                            <td className="py-2.5 font-semibold text-slate-800">{item.kategori || item.namaKomponen}</td>
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
            <div className="space-y-6 font-sans">
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
                        return (
                          <tr key={item.id} className="hover:bg-pink-50/40">
                            <td className="w-10 py-2.5 pl-4 font-bold text-pink-800">{char}.</td>
                            <td className="py-2.5 font-semibold text-slate-800">{item.kategori || item.namaKomponen}</td>
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


