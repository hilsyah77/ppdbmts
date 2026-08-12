import React from 'react';
import { Pendaftar, ProfilMadrasahData, PengaturanPPDBData, ItemBiayaPembayaran, RiwayatPembayaranItem } from '../types';
import { Printer, X, CheckCircle2, DollarSign, FileText, Share2 } from 'lucide-react';

interface ModalKuitansiProps {
  pendaftar: Pendaftar;
  riwayatItem: RiwayatPembayaranItem;
  itemBiayaList: ItemBiayaPembayaran[];
  profil: ProfilMadrasahData;
  pengaturan: PengaturanPPDBData;
  onClose: () => void;
}

// Helper to convert number to Indonesian words (Terbilang)
function terbilangIndonesian(n: number): string {
  if (n < 0) return 'minus ' + terbilangIndonesian(-n);
  if (n === 0) return 'Nol Rupiah';

  const angka = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
  let total = '';

  if (n < 12) {
    total = ' ' + angka[n];
  } else if (n < 20) {
    total = terbilangIndonesian(n - 10) + ' Belas';
  } else if (n < 100) {
    total = terbilangIndonesian(Math.floor(n / 10)) + ' Puluh' + terbilangIndonesian(n % 10);
  } else if (n < 200) {
    total = ' Seratus' + terbilangIndonesian(n - 100);
  } else if (n < 1000) {
    total = terbilangIndonesian(Math.floor(n / 100)) + ' Ratus' + terbilangIndonesian(n % 100);
  } else if (n < 2000) {
    total = ' Seribu' + terbilangIndonesian(n - 1000);
  } else if (n < 1000000) {
    total = terbilangIndonesian(Math.floor(n / 1000)) + ' Ribu' + terbilangIndonesian(n % 1000);
  } else if (n < 1000000000) {
    total = terbilangIndonesian(Math.floor(n / 1000000)) + ' Juta' + terbilangIndonesian(n % 1000000);
  }

  return total.trim() + ' Rupiah';
}

export const ModalKuitansi: React.FC<ModalKuitansiProps> = ({
  pendaftar,
  riwayatItem,
  itemBiayaList,
  profil,
  pengaturan,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  // Calculate gross total for student based on gender
  const isPutra = pendaftar.jenisKelamin === 'Laki-laki';
  const totalMandatory = itemBiayaList
    .filter((i) => i.sifat === 'Wajib')
    .reduce((sum, item) => sum + (isPutra ? item.nominalPutra : item.nominalPutri), 0);

  const potongan = pendaftar.pembayaran?.potonganDiskon || 0;
  const netTotal = totalMandatory - potongan;

  // Calculate cumulative paid including this payment
  const allRiwayat = pendaftar.pembayaran?.riwayat || [];
  const totalPaidAll = allRiwayat.reduce((sum, r) => sum + r.jumlah, 0);
  const remaining = Math.max(0, netTotal - totalPaidAll);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in duration-200">
        
        {/* Top Header Controls (Hidden on Print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Kuitansi Resmi Pembayaran PPDB</h3>
              <p className="text-[11px] text-slate-400">No. Kuitansi: {riwayatItem.noKuitansi}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Kuitansi</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Kuitansi Sheet */}
        <div className="p-6 sm:p-8 bg-white text-slate-900 space-y-5" id="printable-kuitansi">
          
          {/* Header Kop Surat */}
          <div className="flex items-center gap-4 pb-4 border-b-2 border-slate-800">
            <div className="w-16 h-16 rounded-xl border border-slate-300 p-1 flex items-center justify-center shrink-0">
              {profil.logoUrl ? (
                <img src={profil.logoUrl} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <span className="font-bold text-xs text-emerald-800 text-center">MTsN 1</span>
              )}
            </div>
            <div className="flex-1 text-center">
              <h4 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                {pengaturan.kopHeaderLine1 || 'KEMENTERIAN AGAMA REPUBLIK INDONESIA'}
              </h4>
              <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight">
                {profil.namaMadrasah}
              </h2>
              <p className="text-[11px] text-slate-600">
                {profil.alamat}, {profil.kelurahan}, {profil.kecamatan}, {profil.kabKota}
              </p>
              <p className="text-[10px] text-slate-500">
                Telp: {profil.telepon} | WA: {profil.whatsappCenter} | Email: {profil.email}
              </p>
            </div>
            <div className="w-16 h-16 border border-slate-200 rounded-xl p-1 bg-slate-50 flex flex-col items-center justify-center text-[10px] text-center font-bold text-slate-700 shrink-0">
              <span>PPDB</span>
              <span className="text-emerald-700">{pengaturan.tahunAjaran}</span>
            </div>
          </div>

          {/* Title & Receipt Meta */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                BUKTI PEMBAYARAN RESMI
              </span>
              <h3 className="text-base font-black text-emerald-950">
                KUITANSI PEMBAYARAN PPDB
              </h3>
            </div>
            <div className="text-right text-xs">
              <div className="font-bold text-slate-900">
                No. Kuitansi: <span className="font-mono text-emerald-800">{riwayatItem.noKuitansi}</span>
              </div>
              <div className="text-slate-600 text-[11px]">
                Tanggal: {riwayatItem.tanggal}
              </div>
            </div>
          </div>

          {/* Student Info Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <div className="bg-slate-100 px-3 py-1.5 font-bold text-slate-800 uppercase border-b border-slate-200">
              INFORMASI SISWA PENDAFTAR
            </div>
            <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 bg-slate-50/50">
              <div className="flex">
                <span className="w-32 text-slate-500 font-medium">No. Registrasi</span>
                <span className="font-bold text-slate-900">: {pendaftar.noRegistrasi}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-slate-500 font-medium">Jenis Kelamin</span>
                <span className="font-bold text-slate-900">
                  : {pendaftar.jenisKelamin} ({isPutra ? 'Putra' : 'Putri'})
                </span>
              </div>
              <div className="flex">
                <span className="w-32 text-slate-500 font-medium">Nama Lengkap</span>
                <span className="font-bold text-slate-900 uppercase">: {pendaftar.namaLengkap}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-slate-500 font-medium">Jalur PPDB</span>
                <span className="font-bold text-emerald-700">: {pendaftar.jalur}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-slate-500 font-medium">Sekolah Asal</span>
                <span className="font-bold text-slate-900">: {pendaftar.sekolahAsal}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-slate-500 font-medium">Nama Orang Tua/Wali</span>
                <span className="font-bold text-slate-900">: {pendaftar.namaAyah || pendaftar.namaIbu}</span>
              </div>
            </div>
          </div>

          {/* Financial Breakdown Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <div className="bg-slate-100 px-3 py-1.5 font-bold text-slate-800 uppercase border-b border-slate-200 flex justify-between">
              <span>RINCIAN TRANSAKSI PEMBAYARAN ({isPutra ? 'PUTRA' : 'PUTRI'})</span>
              <span className="text-[10px] text-slate-500 font-normal">Metode: {riwayatItem.metode}</span>
            </div>

            <div className="p-3 space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Total Biaya Standar PPDB ({isPutra ? 'Kategori Putra' : 'Kategori Putri'})</span>
                <span className="font-mono font-bold text-slate-800">Rp {totalMandatory.toLocaleString('id-ID')}</span>
              </div>

              {potongan > 0 && (
                <div className="flex justify-between py-1 border-b border-slate-100 text-rose-700">
                  <span>
                    Potongan / Beasiswa ({pendaftar.pembayaran?.keteranganPotongan || 'Diskon Khusus'})
                  </span>
                  <span className="font-mono font-bold">- Rp {potongan.toLocaleString('id-ID')}</span>
                </div>
              )}

              <div className="flex justify-between py-1 border-b border-slate-200 font-bold bg-slate-50 px-2 rounded">
                <span>Total Kewajiban Biaya</span>
                <span className="font-mono text-emerald-800">Rp {netTotal.toLocaleString('id-ID')}</span>
              </div>

              <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-xl mt-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950 uppercase">JUMLAH DIBAYAR SEKARANG:</span>
                  <span className="font-mono font-black text-lg text-emerald-800">
                    Rp {riwayatItem.jumlah.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="text-[11px] italic font-semibold text-emerald-900 border-t border-emerald-200/80 pt-1">
                  Terbilang: "# {terbilangIndonesian(riwayatItem.jumlah)} #"
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 text-[11px]">
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block">Total Akumulasi Terbayar:</span>
                  <span className="font-mono font-bold text-slate-900 text-xs">
                    Rp {totalPaidAll.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block">Sisa Kewajiban Pembayaran:</span>
                  <span className={`font-mono font-bold text-xs ${remaining === 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {remaining === 0 ? 'LUNAS (Rp 0)' : `Rp ${remaining.toLocaleString('id-ID')}`}
                  </span>
                </div>
              </div>

              {riwayatItem.catatan && (
                <div className="text-[11px] text-slate-600 pt-1">
                  <span className="font-bold">Catatan Kasir:</span> {riwayatItem.catatan}
                </div>
              )}
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-6 grid grid-cols-2 gap-8 text-center text-xs">
            <div className="space-y-12">
              <p className="text-slate-600">Penyetor / Orang Tua Siswa,</p>
              <div>
                <p className="font-bold underline text-slate-900">
                  ( {pendaftar.namaAyah || pendaftar.namaIbu || 'Orang Tua Siswa'} )
                </p>
                <p className="text-[10px] text-slate-500">Tanda Tangan & Nama Terang</p>
              </div>
            </div>

            <div className="space-y-12">
              <p className="text-slate-600">
                {profil.kabKota.replace('Kabupaten ', '').replace('Kota ', '')}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br />
                <span className="font-bold text-slate-800">Bendahara / Kasir PPDB</span>
              </p>
              <div>
                <p className="font-bold underline text-slate-900">
                  ( {riwayatItem.penerima || 'Hj. Siti Aminah, S.Pd.'} )
                </p>
                <p className="text-[10px] text-slate-500">NIP. 19820415 200801 2 011</p>
              </div>
            </div>
          </div>

          {/* Footnote */}
          <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400 text-center italic">
            * Kuitansi ini dicetak secara komputerisasi dari Sistem PPDB Online {profil.namaMadrasah} dan merupakan bukti pembayaran yang sah.
          </div>

        </div>

      </div>
    </div>
  );
};
