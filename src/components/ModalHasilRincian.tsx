import React, { useState } from 'react';
import { ItemBiayaPembayaran, ProfilMadrasahData, PengaturanPPDBData } from '../types';
import { 
  Printer, 
  X, 
  Copy, 
  Check, 
  Receipt, 
  FileText, 
  Info, 
  Layers, 
  User, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { KATEGORI_OPSI_ADMINISTRASI, KATEGORI_OPSI_SERAGAM } from './PembayaranView';

interface ModalHasilRincianProps {
  itemBiayaList: ItemBiayaPembayaran[];
  profil: ProfilMadrasahData;
  pengaturan: PengaturanPPDBData;
  onClose: () => void;
}

export const ModalHasilRincian: React.FC<ModalHasilRincianProps> = ({
  itemBiayaList,
  profil,
  pengaturan,
  onClose
}) => {
  const [viewMode, setViewMode] = useState<'standar' | 'lengkap' | 'putra' | 'putri'>('standar');
  const [copied, setCopied] = useState<boolean>(false);

  // Group items by category / component name
  const adminItems = itemBiayaList.filter(
    (i) => i.namaKomponen === 'Pembayaran Administrasi keuangan' || 
           i.kategori.toLowerCase().includes('spp') || 
           i.kategori.toLowerCase().includes('osis') || 
           i.kategori.toLowerCase().includes('administrasi') ||
           i.kategori.toLowerCase().includes('gedung')
  );

  const seragamItems = itemBiayaList.filter(
    (i) => i.namaKomponen === 'Pembelian Pakaian Seragam' || 
           i.kategori.toLowerCase().includes('seragam') || 
           i.kategori.toLowerCase().includes('batik') || 
           i.kategori.toLowerCase().includes('pramuka')
  );

  const otherItems = itemBiayaList.filter(
    (i) => !adminItems.includes(i) && !seragamItems.includes(i)
  );

  // Totals
  const totalBiayaPutra = itemBiayaList
    .filter((i) => i.sifat === 'Wajib')
    .reduce((sum, i) => sum + i.nominalPutra, 0);

  const totalBiayaPutri = itemBiayaList
    .filter((i) => i.sifat === 'Wajib')
    .reduce((sum, i) => sum + i.nominalPutri, 0);

  const selisihBiaya = Math.abs(totalBiayaPutri - totalBiayaPutra);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    let text = `*RINCIAN BIAYA PPDB ${pengaturan.tahunAjaran.toUpperCase()}*\n`;
    text += `*${profil.namaMadrasah.toUpperCase()}*\n`;
    text += `----------------------------------------\n\n`;

    text += `*1. Pembayaran Administrasi keuangan:*\n`;
    KATEGORI_OPSI_ADMINISTRASI.forEach((item, idx) => {
      const char = String.fromCharCode(97 + idx); // a, b, c...
      text += `   ${char}. ${item}\n`;
    });

    text += `\n*2. Pembelian Pakaian Seragam:*\n`;
    KATEGORI_OPSI_SERAGAM.forEach((item, idx) => {
      const char = String.fromCharCode(97 + idx);
      text += `   ${char}. ${item}\n`;
    });

    text += `\n----------------------------------------\n`;
    text += `*ESTIMASI TOTAL BIAYA:*\n`;
    text += `• Total Biaya Putra : Rp ${totalBiayaPutra.toLocaleString('id-ID')}\n`;
    text += `• Total Biaya Putri : Rp ${totalBiayaPutri.toLocaleString('id-ID')}\n`;
    text += `*(Selisih Rp ${selisihBiaya.toLocaleString('id-ID')} untuk seragam & kerudung putri)*\n\n`;
    text += `Informasi Sekretariat: ${profil.alamat}, ${profil.kabupatenKota}\n`;
    text += `Kontak Layanan: ${profil.telepon} / ${profil.email}\n`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[94vh]">
        
        {/* MODAL CONTROLS HEADER (HIDDEN ON PRINT) */}
        <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span>Tampilan Hasil Rincian Biaya PPDB</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold">
                  T.A. {pengaturan.tahunAjaran}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Format resmi struktur komponen administrasi keuangan & seragam madrasah
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Switcher */}
            <div className="bg-slate-800 p-1 rounded-xl flex items-center text-xs">
              <button
                onClick={() => setViewMode('standar')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  viewMode === 'standar' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Format Standar
              </button>
              <button
                onClick={() => setViewMode('lengkap')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  viewMode === 'lengkap' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tabel Komparasi
              </button>
              <button
                onClick={() => setViewMode('putra')}
                className={`px-2 py-1 rounded-lg font-medium transition-all ${
                  viewMode === 'putra' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Putra
              </button>
              <button
                onClick={() => setViewMode('putri')}
                className={`px-2 py-1 rounded-lg font-medium transition-all ${
                  viewMode === 'putri' ? 'bg-pink-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Putri
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
              <span>Cetak Dokumen</span>
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
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 print:p-0 print:m-0 print:overflow-visible">
          
          {/* KOP MADRASAH */}
          <div className="border-b-2 border-slate-900 pb-4 text-center relative">
            <div className="flex items-center justify-center gap-4">
              {profil.logoUrl && (
                <img
                  src={profil.logoUrl}
                  alt="Logo Madrasah"
                  className="w-16 h-16 object-contain shrink-0"
                />
              )}
              <div>
                <h4 className="text-xs uppercase font-bold tracking-wider text-slate-600">
                  KEMENTERIAN AGAMA REPUBLIK INDONESIA
                </h4>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {profil.namaMadrasah.toUpperCase()}
                </h2>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  NSM: {profil.nsm || '121132710001'} | NPSN: {profil.npsn || '20278891'} | Akreditasi: {profil.akreditasi || 'A (Unggul)'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {profil.alamat}, Kec. {profil.kecamatan || 'Prambon'}, {profil.kabupatenKota}, {profil.provinsi}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-300">
              <h3 className="text-base font-black text-slate-900 tracking-wide uppercase">
                RINCIAN BIAYA PENERIMAAN PESERTA DIDIK BARU (PPDB)
              </h3>
              <p className="text-xs text-slate-600 font-semibold">
                TAHUN AJARAN {pengaturan.tahunAjaran}
              </p>
            </div>
          </div>

          {/* VIEW MODE 1: FORMAT STANDAR (MATCHING EXACT USER SCREENSHOT) */}
          {viewMode === 'standar' && (
            <div className="space-y-6">
              
              {/* SECTION 1: PEMBAYARAN ADMINISTRASI KEUANGAN */}
              <div className="border border-slate-900 rounded-lg overflow-hidden bg-white shadow-sm">
                <div className="bg-slate-100 border-b border-slate-900 px-4 py-2.5">
                  <h4 className="text-sm font-black text-slate-900">
                    1. Pembayaran Administrasi keuangan
                  </h4>
                </div>
                <table className="w-full text-xs text-left border-collapse">
                  <tbody>
                    {KATEGORI_OPSI_ADMINISTRASI.map((item, idx) => {
                      const char = String.fromCharCode(97 + idx); // a, b, c...
                      return (
                        <tr key={idx} className="border-b border-slate-300 last:border-b-0 hover:bg-slate-50/80">
                          <td className="w-10 py-2.5 pl-6 pr-2 font-bold text-slate-800 align-top">
                            {char}.
                          </td>
                          <td className="py-2.5 pr-4 font-semibold text-slate-800">
                            {item}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* SECTION 2: PEMBELIAN PAKAIAN SERAGAM */}
              <div className="border border-slate-900 rounded-lg overflow-hidden bg-white shadow-sm">
                <div className="bg-slate-100 border-b border-slate-900 px-4 py-2.5">
                  <h4 className="text-sm font-black text-slate-900">
                    2. Pembelian Pakaian Seragam
                  </h4>
                </div>
                <table className="w-full text-xs text-left border-collapse">
                  <tbody>
                    {KATEGORI_OPSI_SERAGAM.map((item, idx) => {
                      const char = String.fromCharCode(97 + idx); // a, b, c...
                      return (
                        <tr key={idx} className="border-b border-slate-300 last:border-b-0 hover:bg-slate-50/80">
                          <td className="w-10 py-2.5 pl-6 pr-2 font-bold text-slate-800 align-top">
                            {char}.
                          </td>
                          <td className="py-2.5 pr-4 font-semibold text-slate-800">
                            {item}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* ESTIMASI NOMINAL REKAPITULASI BIAYA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50/80 border-2 border-blue-200 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                    <span>ESTIMASI TOTAL BIAYA PUTRA</span>
                    <span className="px-2 py-0.5 rounded bg-blue-200 text-blue-900 text-[10px]">Laki-laki</span>
                  </div>
                  <div className="text-xl font-black text-blue-950 font-mono">
                    Rp {totalBiayaPutra.toLocaleString('id-ID')}
                  </div>
                  <p className="text-[11px] text-blue-700">
                    Termasuk paket perlengkapan seragam, peci songkok & seluruh administrasi keuangan madrasah.
                  </p>
                </div>

                <div className="p-4 bg-pink-50/80 border-2 border-pink-200 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-pink-900">
                    <span>ESTIMASI TOTAL BIAYA PUTRI</span>
                    <span className="px-2 py-0.5 rounded bg-pink-200 text-pink-900 text-[10px]">Perempuan</span>
                  </div>
                  <div className="text-xl font-black text-pink-950 font-mono">
                    Rp {totalBiayaPutri.toLocaleString('id-ID')}
                  </div>
                  <p className="text-[11px] text-pink-700">
                    Termasuk paket seragam rok panjang, 2 stel jilbab/kerudung & seluruh administrasi keuangan madrasah.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* VIEW MODE 2: TABEL KOMPARASI LENGKAP */}
          {viewMode === 'lengkap' && (
            <div className="space-y-4">
              <div className="border border-slate-300 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white font-bold text-[11px] uppercase tracking-wider">
                      <th className="p-3 w-12 text-center">No</th>
                      <th className="p-3">Nama Komponen / Kategori</th>
                      <th className="p-3">Rincian & Keterangan</th>
                      <th className="p-3 text-right bg-blue-900/60 w-36">Putra (Rp)</th>
                      <th className="p-3 text-right bg-pink-900/60 w-36">Putri (Rp)</th>
                      <th className="p-3 text-center w-20">Sifat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {itemBiayaList.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="p-3 text-center font-bold text-slate-500">{idx + 1}</td>
                        <td className="p-3 font-bold text-slate-900">
                          <div>{item.namaKomponen}</div>
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                            {item.kategori}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 text-[11px] leading-relaxed">
                          <div><span className="font-semibold text-blue-900">L:</span> {item.keteranganPutra}</div>
                          <div><span className="font-semibold text-pink-900">P:</span> {item.keteranganPutri}</div>
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-blue-900 bg-blue-50/30">
                          Rp {item.nominalPutra.toLocaleString('id-ID')}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-pink-900 bg-pink-50/30">
                          Rp {item.nominalPutri.toLocaleString('id-ID')}
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.sifat === 'Wajib' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {item.sifat}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100 font-black text-slate-900 border-t-2 border-slate-300">
                      <td colSpan={3} className="p-3 text-right uppercase text-xs">
                        TOTAL BIAYA KESELURUHAN (WAJIB):
                      </td>
                      <td className="p-3 text-right font-mono text-sm text-blue-950 bg-blue-100/60">
                        Rp {totalBiayaPutra.toLocaleString('id-ID')}
                      </td>
                      <td className="p-3 text-right font-mono text-sm text-pink-950 bg-pink-100/60">
                        Rp {totalBiayaPutri.toLocaleString('id-ID')}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* VIEW MODE 3: KHUSUS PUTRA */}
          {viewMode === 'putra' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-900 text-white rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-300" />
                  <span className="font-bold text-sm">RINCIAN KHUSUS SISWA PUTRA (LAKI-LAKI)</span>
                </div>
                <span className="font-mono font-bold text-sm bg-blue-800 px-3 py-1 rounded-lg">
                  Total: Rp {totalBiayaPutra.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="border border-slate-300 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-bold border-b">
                      <th className="p-3 w-12 text-center">No</th>
                      <th className="p-3">Nama Komponen & Kategori</th>
                      <th className="p-3">Rincian Kelengkapan</th>
                      <th className="p-3 text-right w-36">Nominal (Rp)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {itemBiayaList.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-blue-50/40">
                        <td className="p-3 text-center font-bold text-slate-400">{idx + 1}</td>
                        <td className="p-3 font-bold text-slate-800">
                          <div>{item.namaKomponen}</div>
                          <span className="text-[10px] text-slate-500 font-normal">{item.kategori}</span>
                        </td>
                        <td className="p-3 text-slate-600">{item.keteranganPutra}</td>
                        <td className="p-3 text-right font-mono font-bold text-blue-900">
                          Rp {item.nominalPutra.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-blue-50 font-black text-blue-950 border-t">
                      <td colSpan={3} className="p-3 text-right uppercase">TOTAL BIAYA PUTRA:</td>
                      <td className="p-3 text-right font-mono text-sm">
                        Rp {totalBiayaPutra.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* VIEW MODE 4: KHUSUS PUTRI */}
          {viewMode === 'putri' && (
            <div className="space-y-4">
              <div className="p-3 bg-pink-800 text-white rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-pink-200" />
                  <span className="font-bold text-sm">RINCIAN KHUSUS SISWI PUTRI (PEREMPUAN)</span>
                </div>
                <span className="font-mono font-bold text-sm bg-pink-900 px-3 py-1 rounded-lg">
                  Total: Rp {totalBiayaPutri.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="border border-slate-300 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-bold border-b">
                      <th className="p-3 w-12 text-center">No</th>
                      <th className="p-3">Nama Komponen & Kategori</th>
                      <th className="p-3">Rincian Kelengkapan</th>
                      <th className="p-3 text-right w-36">Nominal (Rp)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {itemBiayaList.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-pink-50/40">
                        <td className="p-3 text-center font-bold text-slate-400">{idx + 1}</td>
                        <td className="p-3 font-bold text-slate-800">
                          <div>{item.namaKomponen}</div>
                          <span className="text-[10px] text-slate-500 font-normal">{item.kategori}</span>
                        </td>
                        <td className="p-3 text-slate-600">{item.keteranganPutri}</td>
                        <td className="p-3 text-right font-mono font-bold text-pink-900">
                          Rp {item.nominalPutri.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-pink-50 font-black text-pink-950 border-t">
                      <td colSpan={3} className="p-3 text-right uppercase">TOTAL BIAYA PUTRI:</td>
                      <td className="p-3 text-right font-mono text-sm">
                        Rp {totalBiayaPutri.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* CATATAN & PETUNJUK PEMBAYARAN */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-emerald-600" />
              <span>Ketentuan & Informasi Pembayaran:</span>
            </h5>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px] leading-relaxed">
              <li>Pembayaran dapat diangsur/dicicil minimal 50% saat daftar ulang awal peserta didik baru.</li>
              <li>Pelunasan biaya seragam dan administrasi dilakukan sebelum pelaksanaan Masa Ta'aruf Siswa Madrasah (MATSAMA).</li>
              <li>Pembayaran tunai dapat langsung dilakukan melalui Bendahara PPDB di loket madrasah.</li>
              <li>Untuk transfer bank, gunakan rekening resmi madrasah dan lampirkan bukti transfer untuk validasi sistem.</li>
            </ol>
          </div>

          {/* TANDA TANGAN RESMI */}
          <div className="pt-6 grid grid-cols-2 gap-8 text-xs text-center">
            <div className="space-y-16">
              <p className="text-slate-600">
                Mengetahui,<br />
                <strong>Kepala {profil.namaMadrasah}</strong>
              </p>
              <div>
                <p className="font-bold text-slate-900 underline">
                  {profil.kepalaMadrasah || 'Drs. H. M. Badruddin, M.Ag.'}
                </p>
                <p className="text-[11px] text-slate-500">
                  NIP. {profil.nipKepala || '197503152003121002'}
                </p>
              </div>
            </div>

            <div className="space-y-16">
              <p className="text-slate-600">
                {profil.kabupatenKota || 'Sidoarjo'}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br />
                <strong>Bendahara / Panitia PPDB</strong>
              </p>
              <div>
                <p className="font-bold text-slate-900 underline">
                  Siti Aminah, S.E.
                </p>
                <p className="text-[11px] text-slate-500">
                  Panitia Penerimaan Peserta Didik Baru
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
