import React, { useState } from 'react';
import {
  Pendaftar,
  ItemBiayaPembayaran,
  ProfilMadrasahData,
  PengaturanPPDBData,
  RiwayatPembayaranItem,
  JadwalPiket
} from '../types';
import {
  Receipt,
  User,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  Edit2,
  Trash2,
  Printer,
  Search,
  Filter,
  DollarSign,
  Info,
  ShieldAlert,
  RotateCcw,
  Tag,
  CreditCard,
  ArrowRight,
  Sparkles,
  FileSpreadsheet,
  FileCheck,
  X
} from 'lucide-react';
import { ModalKuitansi } from './ModalKuitansi';
import { ModalBayar } from './ModalBayar';
import { ModalHasilRincian } from './ModalHasilRincian';
import { ConfirmDialog, ConfirmDialogState } from './ConfirmDialog';

// Opsi Kategori Berdasarkan Nama Komponen Biaya
export const KATEGORI_OPSI_ADMINISTRASI = [
  'Titipan SPP',
  'Iuran OSIS, Pramuka 1 Tahun',
  'Pemeliharaan Alat Drumband 1 Tahun',
  'Dana Sosial 1 Tahun',
  'Perpustakaan 1 Tahun + Kartu OSIS',
  'Modul 5 Mapel Agama 1 Semester',
  'Pemeliharaan Komputer 1 Tahun',
  'Buku Pembiasaan Harian (PH)'
];

export const KATEGORI_OPSI_SERAGAM = [
  'BET (OSIS, Pramuka, Nama, Jenjang Kelas)',
  'Bahan Pramuka 1 Set',
  'Bahan Batik 1 Set',
  'Biru Putih 1 Set',
  'Kaos Olah Raga 1 Set',
  'Topi + Sabuk + Hasduk + Dasi',
  'Kerudung'
];

interface PembayaranViewProps {
  pendaftarList: Pendaftar[];
  setPendaftarList: React.Dispatch<React.SetStateAction<Pendaftar[]>>;
  itemBiayaList: ItemBiayaPembayaran[];
  setItemBiayaList: React.Dispatch<React.SetStateAction<ItemBiayaPembayaran[]>>;
  profil: ProfilMadrasahData;
  pengaturan: PengaturanPPDBData;
  jadwalPiketList?: JadwalPiket[];
}

export const PembayaranView: React.FC<PembayaranViewProps> = ({
  pendaftarList,
  setPendaftarList,
  itemBiayaList,
  setItemBiayaList,
  profil,
  pengaturan,
  jadwalPiketList
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'rincian' | 'siswa' | 'laporan'>('rincian');
  
  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterGender, setFilterGender] = useState<string>('semua');
  const [filterStatusBayar, setFilterStatusBayar] = useState<string>('semua');

  // Modal States
  const [isModalHasilRincianOpen, setIsModalHasilRincianOpen] = useState<boolean>(false);
  const [selectedPendaftarForRincian, setSelectedPendaftarForRincian] = useState<Pendaftar | null>(null);
  const [selectedPendaftarForPay, setSelectedPendaftarForPay] = useState<Pendaftar | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<{
    pendaftar: Pendaftar;
    riwayat: RiwayatPembayaranItem;
  } | null>(null);

  // Fee Edit Modal state
  const [editingItemBiaya, setEditingItemBiaya] = useState<ItemBiayaPembayaran | null>(null);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState<boolean>(false);
  const [isCustomAddName, setIsCustomAddName] = useState<boolean>(false);
  const [isCustomEditName, setIsCustomEditName] = useState<boolean>(false);
  const [isCustomAddKategori, setIsCustomAddKategori] = useState<boolean>(false);
  const [isCustomEditKategori, setIsCustomEditKategori] = useState<boolean>(false);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });
  const [newItemForm, setNewItemForm] = useState<Omit<ItemBiayaPembayaran, 'id'>>({
    namaKomponen: 'Pembayaran Administrasi keuangan',
    kategori: 'Titipan SPP',
    nominalPutra: 0,
    nominalPutri: 0,
    keteranganPutra: 'Administrasi Keuangan SPMB & Layanan Madrasah',
    keteranganPutri: 'Administrasi Keuangan SPMB & Layanan Madrasah',
    sifat: 'Wajib'
  });

  // Calculate totals for Putra and Putri mandatory components
  const totalBiayaPutra = itemBiayaList
    .filter((i) => i.sifat === 'Wajib')
    .reduce((sum, i) => sum + i.nominalPutra, 0);

  const totalBiayaPutri = itemBiayaList
    .filter((i) => i.sifat === 'Wajib')
    .reduce((sum, i) => sum + i.nominalPutri, 0);

  const selisihBiaya = Math.abs(totalBiayaPutri - totalBiayaPutra);

  // Financial Stats across all registered students
  let totalTargetPenerimaan = 0;
  let totalDanaTerkumpul = 0;
  let countLunas = 0;
  let countSebagian = 0;
  let countBelumBayar = 0;

  pendaftarList.forEach((p) => {
    const isPutra = p.jenisKelamin === 'Laki-laki';
    const standardCost = itemBiayaList
      .filter((i) => i.sifat === 'Wajib')
      .reduce((sum, i) => sum + (isPutra ? i.nominalPutra : i.nominalPutri), 0);
    const diskon = p.pembayaran?.potonganDiskon || 0;
    const netCost = Math.max(0, standardCost - diskon);

    const riwayat = p.pembayaran?.riwayat || [];
    const dibayar = riwayat.reduce((sum, r) => sum + r.jumlah, 0);

    totalTargetPenerimaan += netCost;
    totalDanaTerkumpul += dibayar;

    if (dibayar >= netCost && netCost > 0) {
      countLunas++;
    } else if (dibayar > 0) {
      countSebagian++;
    } else {
      countBelumBayar++;
    }
  });

  const totalPiutang = Math.max(0, totalTargetPenerimaan - totalDanaTerkumpul);

  // Filtered Pendaftar for Student Payment Table
  const filteredPendaftar = pendaftarList.filter((p) => {
    const matchQuery =
      p.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.noRegistrasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sekolahAsal.toLowerCase().includes(searchQuery.toLowerCase());

    const matchGender =
      filterGender === 'semua' ||
      (filterGender === 'laki-laki' && p.jenisKelamin === 'Laki-laki') ||
      (filterGender === 'perempuan' && p.jenisKelamin === 'Perempuan');

    const isPutra = p.jenisKelamin === 'Laki-laki';
    const standardCost = itemBiayaList
      .filter((i) => i.sifat === 'Wajib')
      .reduce((sum, i) => sum + (isPutra ? i.nominalPutra : i.nominalPutri), 0);
    const diskon = p.pembayaran?.potonganDiskon || 0;
    const netCost = Math.max(0, standardCost - diskon);
    const riwayat = p.pembayaran?.riwayat || [];
    const dibayar = riwayat.reduce((sum, r) => sum + r.jumlah, 0);

    let statusBayar = 'belum';
    if (dibayar >= netCost && netCost > 0) statusBayar = 'lunas';
    else if (dibayar > 0) statusBayar = 'sebagian';

    const matchStatus =
      filterStatusBayar === 'semua' ||
      (filterStatusBayar === 'lunas' && statusBayar === 'lunas') ||
      (filterStatusBayar === 'sebagian' && statusBayar === 'sebagian') ||
      (filterStatusBayar === 'belum' && statusBayar === 'belum');

    return matchQuery && matchGender && matchStatus;
  });

  // Handler for Saving Payment
  const handleSavePayment = (
    pendaftarId: string,
    jumlah: number,
    metode: 'Tunai / Kasir SPMB' | 'Transfer Bank' | 'QRIS' | 'Lainnya',
    catatan: string,
    penerima: string,
    diskonBaru?: number,
    ketDiskon?: string
  ) => {
    let newReceiptItem: RiwayatPembayaranItem | null = null;

    setPendaftarList((prev) =>
      prev.map((p) => {
        if (p.id !== pendaftarId) return p;

        const currentRiwayat = p.pembayaran?.riwayat || [];
        const nextNoKuitansi = `KUIT-2026-${String(
          currentRiwayat.length + 101
        ).padStart(3, '0')}`;

        if (jumlah > 0) {
          newReceiptItem = {
            id: `pay-${Date.now()}`,
            noKuitansi: nextNoKuitansi,
            tanggal: new Date().toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            }) + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            jumlah,
            metode,
            penerima: penerima || 'Bendahara SPMB',
            catatan
          };
        }

        const updatedRiwayat = newReceiptItem
          ? [newReceiptItem, ...currentRiwayat]
          : currentRiwayat;

        return {
          ...p,
          pembayaran: {
            potonganDiskon: diskonBaru !== undefined ? diskonBaru : (p.pembayaran?.potonganDiskon || 0),
            keteranganPotongan: ketDiskon !== undefined ? ketDiskon : p.pembayaran?.keteranganPotongan,
            riwayat: updatedRiwayat
          }
        };
      })
    );

    const updatedPendaftar = pendaftarList.find((p) => p.id === pendaftarId);
    setSelectedPendaftarForPay(null);

    // If new receipt was created, open receipt modal automatically!
    if (newReceiptItem && updatedPendaftar) {
      setSelectedReceipt({
        pendaftar: updatedPendaftar,
        riwayat: newReceiptItem
      });
    }
  };

  // Handler for saving edited component
  const handleSaveEditedComponent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItemBiaya) return;

    const rincianVal = editingItemBiaya.kategori || editingItemBiaya.namaKomponen;
    const updated = {
      ...editingItemBiaya,
      keteranganPutra: rincianVal,
      keteranganPutri: rincianVal
    };

    setItemBiayaList((prev) =>
      prev.map((item) => (item.id === editingItemBiaya.id ? updated : item))
    );
    setEditingItemBiaya(null);
  };

  const handleOpenEditComponent = (item: ItemBiayaPembayaran) => {
    setEditingItemBiaya({ ...item });
    const isStandardName = ['Pembayaran Administrasi keuangan', 'Pembelian Pakaian Seragam'].includes(item.namaKomponen);
    setIsCustomEditName(!isStandardName);
    
    if (item.namaKomponen === 'Pembayaran Administrasi keuangan') {
      setIsCustomEditKategori(!KATEGORI_OPSI_ADMINISTRASI.includes(item.kategori));
    } else if (item.namaKomponen === 'Pembelian Pakaian Seragam') {
      setIsCustomEditKategori(!KATEGORI_OPSI_SERAGAM.includes(item.kategori));
    } else {
      setIsCustomEditKategori(false);
    }
  };

  const handleOpenAddComponent = () => {
    setIsCustomAddName(false);
    setIsCustomAddKategori(false);
    setNewItemForm({
      namaKomponen: 'Pembayaran Administrasi keuangan',
      kategori: KATEGORI_OPSI_ADMINISTRASI[0],
      nominalPutra: 0,
      nominalPutri: 0,
      keteranganPutra: KATEGORI_OPSI_ADMINISTRASI[0],
      keteranganPutri: KATEGORI_OPSI_ADMINISTRASI[0],
      sifat: 'Wajib'
    });
    setIsAddItemModalOpen(true);
  };

  // Handler for adding new component
  const handleAddNewComponent = (e: React.FormEvent) => {
    e.preventDefault();
    const finalKategori = newItemForm.namaKomponen.trim();
    const finalRincian = newItemForm.kategori.trim();
    if (!finalKategori || !finalRincian) return;

    const newItem: ItemBiayaPembayaran = {
      ...newItemForm,
      namaKomponen: finalKategori,
      kategori: finalRincian,
      keteranganPutra: finalRincian,
      keteranganPutri: finalRincian,
      id: `biaya-${Date.now()}`
    };

    setItemBiayaList((prev) => [...prev, newItem]);
    setIsAddItemModalOpen(false);
    setIsCustomAddName(false);
    setIsCustomAddKategori(false);
    setNewItemForm({
      namaKomponen: 'Pembayaran Administrasi keuangan',
      kategori: KATEGORI_OPSI_ADMINISTRASI[0],
      nominalPutra: 0,
      nominalPutri: 0,
      keteranganPutra: KATEGORI_OPSI_ADMINISTRASI[0],
      keteranganPutri: KATEGORI_OPSI_ADMINISTRASI[0],
      sifat: 'Wajib'
    });
  };

  const handleDeleteComponent = (id: string, nama: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Hapus Komponen Biaya',
      message: `Apakah Anda yakin ingin menghapus komponen biaya "${nama}" dari daftar rincian SPMB?`,
      subMessage: 'Komponen ini tidak akan lagi muncul dalam kalkulasi daftar ulang calon siswa baru.',
      type: 'danger',
      confirmText: 'Ya, Hapus Komponen',
      cancelText: 'Batal',
      onConfirm: () => {
        setItemBiayaList((prev) => prev.filter((i) => i.id !== id));
      }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-2xl p-6 text-white shadow-lg border border-emerald-600/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-bold text-[10px] tracking-wider uppercase border border-white/30">
                Keuangan SPMB Online
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200 font-bold text-[10px] tracking-wider uppercase border border-amber-300/30">
                Tahun Ajaran {pengaturan.tahunAjaran}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Rincian & Sistem Pembayaran SPMB
            </h1>
            <p className="text-xs text-emerald-100 max-w-2xl leading-relaxed">
              Pengelolaan rincian biaya terpisah antara siswa **Laki-Laki (Putra)** dan **Perempuan (Putri)**, transaksi kasir pembayaran, serta pencetakan kuitansi resmi madrasah.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Rekap Keuangan</span>
            </button>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-emerald-600/50 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('rincian')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'rincian'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'bg-emerald-800/60 text-emerald-100 hover:bg-emerald-800'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>1. Rincian Biaya (Putra vs Putri)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('siswa')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'siswa'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'bg-emerald-800/60 text-emerald-100 hover:bg-emerald-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>2. Data Pembayaran Siswa ({pendaftarList.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('laporan')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'laporan'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'bg-emerald-800/60 text-emerald-100 hover:bg-emerald-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>3. Ringkasan Kas & Statistika</span>
          </button>
        </div>
      </div>

      {/* Quick Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Target Penerimaan (100%)</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 font-mono">
            Rp {totalTargetPenerimaan.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-slate-500">Estimasi total dari {pendaftarList.length} pendaftar</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Dana Terkumpul (Kas)</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-emerald-700 font-mono">
            Rp {totalDanaTerkumpul.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium">
            {totalTargetPenerimaan > 0 ? Math.round((totalDanaTerkumpul / totalTargetPenerimaan) * 100) : 0}% terbayar
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Sisa Piutang / Belum Lunas</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-amber-700 font-mono">
            Rp {totalPiutang.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-amber-600 font-medium">{countSebagian + countBelumBayar} siswa belum lunas</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Status Kelunasan Siswa</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold pt-1">
            <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-lg">
              {countLunas} Lunas
            </span>
            <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-lg">
              {countSebagian} Cicil
            </span>
            <span className="px-2 py-1 bg-rose-100 text-rose-800 rounded-lg">
              {countBelumBayar} Belum
            </span>
          </div>
        </div>
      </div>

      {/* TAB 1: RINCIAN BIAYA PEMBAYARAN PUTRA VS PUTRI */}
      {activeSubTab === 'rincian' && (
        <div className="space-y-6">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 text-white p-4 rounded-2xl">
            <div>
              <h3 className="text-base font-bold flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-400" />
                <span>Rincian Komponen Biaya SPMB (Perbandingan Putra & Putri)</span>
              </h3>
              <p className="text-xs text-slate-300">
                Tabel perbedaan biaya antara siswa Laki-laki dengan Perempuan sesuai kebutuhan seragam & atribut madrasah.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <button
                onClick={() => setIsModalHasilRincianOpen(true)}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                title="Tampilkan popup hasil rincian biaya sesuai format resmi"
              >
                <Receipt className="w-4 h-4 text-indigo-200" />
                <span>Lihat Hasil Rincian (Modal)</span>
              </button>

              <button
                onClick={handleOpenAddComponent}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Komponen Biaya</span>
              </button>
            </div>
          </div>

          {/* SIDE BY SIDE COMPARISON CARDS (LAKI-LAKI VS PEREMPUAN) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* CARD 1: LAKI-LAKI (PUTRA) */}
            <div className="bg-white rounded-2xl border-2 border-blue-200 overflow-hidden shadow-md flex flex-col justify-between">
              <div>
                <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-black tracking-tight uppercase">
                        RINCIAN BIAYA PUTRA (LAKI-LAKI)
                      </h4>
                      <p className="text-[11px] text-blue-100">
                        Termasuk Peci, Celana, Kemeja, Infaq & Perlengkapan
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-white text-blue-900 rounded-full font-black text-xs">
                    PUTRA
                  </span>
                </div>

                <div className="p-4 space-y-4 text-xs">
                  {Array.from(new Set(itemBiayaList.map((i) => i.namaKomponen || 'Lain-lain'))).map((catName, catIdx) => {
                    const catItems = itemBiayaList.filter((i) => (i.namaKomponen || 'Lain-lain') === catName);

                    return (
                      <div key={catIdx} className="border border-blue-100 rounded-xl overflow-hidden bg-blue-50/20">
                        <div className="bg-blue-100/70 px-3.5 py-2 font-black text-blue-950">
                          <span className="text-[11px] uppercase tracking-wide">
                            {catIdx + 1}. {catName}
                          </span>
                        </div>
                        <div className="p-3 divide-y divide-blue-50 space-y-1">
                          {catItems.map((item, itemIdx) => {
                            const char = String.fromCharCode(97 + itemIdx);
                            return (
                              <div key={item.id} className="pt-2 first:pt-0 flex items-start justify-between gap-2">
                                <div className="flex items-start gap-2">
                                  <span className="font-bold text-blue-800 text-[11px] w-4 shrink-0">
                                    {char}.
                                  </span>
                                  <div>
                                    <span className="font-semibold text-slate-800">
                                      {item.kategori || item.namaKomponen}
                                    </span>
                                    {item.keteranganPutra && item.keteranganPutra !== item.kategori && (
                                      <p className="text-[10px] text-slate-500">{item.keteranganPutra}</p>
                                    )}
                                  </div>
                                </div>
                                <span className="font-mono text-blue-950 font-bold shrink-0">
                                  Rp {item.nominalPutra.toLocaleString('id-ID')}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 bg-blue-50 border-t border-blue-200 flex items-center justify-between font-black text-slate-900">
                <span className="text-xs uppercase text-blue-900">TOTAL BIAYA STANDAR PUTRA:</span>
                <span className="font-mono text-lg text-blue-800">
                  Rp {totalBiayaPutra.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* CARD 2: PEREMPUAN (PUTRI) */}
            <div className="bg-white rounded-2xl border-2 border-pink-200 overflow-hidden shadow-md flex flex-col justify-between">
              <div>
                <div className="bg-gradient-to-r from-pink-600 to-rose-700 text-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-black tracking-tight uppercase">
                        RINCIAN BIAYA PUTRI (PEREMPUAN)
                      </h4>
                      <p className="text-[11px] text-pink-100">
                        Termasuk Jilbab/Kerudung (2 Stel), Rok Panjang & Gamis
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-white text-pink-900 rounded-full font-black text-xs">
                    PUTRI
                  </span>
                </div>

                <div className="p-4 space-y-4 text-xs">
                  {Array.from(new Set(itemBiayaList.map((i) => i.namaKomponen || 'Lain-lain'))).map((catName, catIdx) => {
                    const catItems = itemBiayaList.filter((i) => (i.namaKomponen || 'Lain-lain') === catName);

                    return (
                      <div key={catIdx} className="border border-pink-100 rounded-xl overflow-hidden bg-pink-50/20">
                        <div className="bg-pink-100/70 px-3.5 py-2 font-black text-pink-950">
                          <span className="text-[11px] uppercase tracking-wide">
                            {catIdx + 1}. {catName}
                          </span>
                        </div>
                        <div className="p-3 divide-y divide-pink-50 space-y-1">
                          {catItems.map((item, itemIdx) => {
                            const char = String.fromCharCode(97 + itemIdx);
                            return (
                              <div key={item.id} className="pt-2 first:pt-0 flex items-start justify-between gap-2">
                                <div className="flex items-start gap-2">
                                  <span className="font-bold text-pink-800 text-[11px] w-4 shrink-0">
                                    {char}.
                                  </span>
                                  <div>
                                    <span className="font-semibold text-slate-800">
                                      {item.kategori || item.namaKomponen}
                                    </span>
                                    {item.keteranganPutri && item.keteranganPutri !== item.kategori && (
                                      <p className="text-[10px] text-slate-500">{item.keteranganPutri}</p>
                                    )}
                                  </div>
                                </div>
                                <span className="font-mono text-pink-950 font-bold shrink-0">
                                  {item.nominalPutri > 0 ? `Rp ${item.nominalPutri.toLocaleString('id-ID')}` : '—'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 bg-pink-50 border-t border-pink-200 flex items-center justify-between font-black text-slate-900">
                <span className="text-xs uppercase text-pink-900">TOTAL BIAYA STANDAR PUTRI:</span>
                <span className="font-mono text-lg text-pink-800">
                  Rp {totalBiayaPutri.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

          </div>

          {/* SELISIH EXPLANATION BOX */}
          <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-950 text-xs">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-200 text-amber-900 shrink-0 mt-0.5">
                <Info className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h5 className="font-bold text-sm text-amber-900">
                  Keterangan Selisih Rincian Biaya Putra vs Putri:
                </h5>
                <p className="text-amber-800 leading-relaxed">
                  Terdapat selisih biaya sebesar{' '}
                  <strong className="font-mono font-bold text-amber-950 underline">
                    Rp {selisihBiaya.toLocaleString('id-ID')}
                  </strong>{' '}
                  dikarenakan penambahan perlengkapan seragam muslimah pendaftaran siswi (2 pasang Jilbab/Kerudung madrasah, seragam rok panjang, & atribut kerudung).
                </p>
              </div>
            </div>
          </div>

          {/* EDITABLE TABLE OF FEE COMPONENTS */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm space-y-0">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">
                  Kelola Master Data Komponen Biaya
                </h4>
                <p className="text-[11px] text-slate-500">
                  Kelola kategori (1, 2...), rincian biaya (a, b...), serta nominal untuk calon siswa Putra dan Putri.
                </p>
              </div>

              <button
                onClick={() => setIsModalHasilRincianOpen(true)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-sm shrink-0"
              >
                <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                <span>Buka Modal Rincian Resmi</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200 text-[11px]">
                    <th className="p-3 w-16">No</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Rincian Komponen</th>
                    <th className="p-3 text-right text-blue-900 bg-blue-50/50">Putra (Rp)</th>
                    <th className="p-3 text-right text-pink-900 bg-pink-50/50">Putri (Rp)</th>
                    <th className="p-3">Sifat</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {Array.from(new Set(itemBiayaList.map((i) => i.namaKomponen || 'Lain-lain'))).map((catName, catIdx) => {
                    const catItems = itemBiayaList.filter((i) => (i.namaKomponen || 'Lain-lain') === catName);
                    return catItems.map((item, itemIdx) => {
                      const char = String.fromCharCode(97 + itemIdx);
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 font-bold text-slate-700">
                            {catIdx + 1}.{char}
                          </td>
                          <td className="p-3 font-bold text-slate-800">
                            {itemIdx === 0 ? (
                              <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold text-[11px]">
                                {catIdx + 1}. {catName}
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[11px]">—</span>
                            )}
                          </td>
                          <td className="p-3">
                            <span className="font-bold text-slate-800 mr-1.5 text-blue-700">
                              {char}.
                            </span>
                            <span className="font-semibold text-slate-800">
                              {item.kategori || item.namaKomponen}
                            </span>
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-blue-900 bg-blue-50/20">
                            Rp {item.nominalPutra.toLocaleString('id-ID')}
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-pink-900 bg-pink-50/20">
                            Rp {item.nominalPutri.toLocaleString('id-ID')}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${item.sifat === 'Wajib' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                              {item.sifat}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleOpenEditComponent(item)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit Rincian Biaya"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteComponent(item.id, item.kategori || item.namaKomponen)}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Hapus Rincian Biaya"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    });
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: DATA PEMBAYARAN SISWA PENDAFTAR */}
      {activeSubTab === 'siswa' && (
        <div className="space-y-4">
          
          {/* Search & Filter Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, no. reg, atau sekolah..."
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl p-1">
                <span className="text-[11px] font-bold text-slate-500 pl-2">Gender:</span>
                <button
                  onClick={() => setFilterGender('semua')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${filterGender === 'semua' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setFilterGender('laki-laki')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${filterGender === 'laki-laki' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`}
                >
                  Laki-Laki (Putra)
                </button>
                <button
                  onClick={() => setFilterGender('perempuan')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${filterGender === 'perempuan' ? 'bg-pink-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`}
                >
                  Perempuan (Putri)
                </button>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl p-1">
                <span className="text-[11px] font-bold text-slate-500 pl-2">Status Bayar:</span>
                <select
                  value={filterStatusBayar}
                  onChange={(e) => setFilterStatusBayar(e.target.value)}
                  className="bg-white border border-slate-300 text-slate-700 font-bold rounded-lg px-2 py-1 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="semua">Semua Status</option>
                  <option value="lunas">Lunas</option>
                  <option value="sebagian">Sebagian / Dicicil</option>
                  <option value="belum">Belum Bayar</option>
                </select>
              </div>
            </div>
          </div>

          {/* Student Payment Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Daftar Pendaftar & Riwayat Transaksi ({filteredPendaftar.length} Siswa)
              </h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200 text-[10px]">
                    <th className="p-3">No</th>
                    <th className="p-3">Siswa & Registrasi</th>
                    <th className="p-3">Gender</th>
                    <th className="p-3">Jalur Pendaftaran</th>
                    <th className="p-3 text-right">Biaya Standar</th>
                    <th className="p-3 text-right">Beasiswa / Diskon</th>
                    <th className="p-3 text-right font-black text-slate-900">Total Harus Dibayar</th>
                    <th className="p-3 text-right text-emerald-800">Jumlah Terbayar</th>
                    <th className="p-3 text-right text-amber-800">Sisa Piutang</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Aksi Kasir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredPendaftar.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="p-8 text-center text-slate-400">
                        Tidak ada data siswa pendaftar yang cocok dengan filter pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredPendaftar.map((p, idx) => {
                      const isPutra = p.jenisKelamin === 'Laki-laki';
                      const standardCost = itemBiayaList
                        .filter((i) => i.sifat === 'Wajib')
                        .reduce((sum, i) => sum + (isPutra ? i.nominalPutra : i.nominalPutri), 0);
                      const diskon = p.pembayaran?.potonganDiskon || 0;
                      const netCost = Math.max(0, standardCost - diskon);

                      const riwayat = p.pembayaran?.riwayat || [];
                      const dibayar = riwayat.reduce((sum, r) => sum + r.jumlah, 0);
                      const sisa = Math.max(0, netCost - dibayar);

                      let badgeBg = 'bg-rose-100 text-rose-800 border-rose-300';
                      let statusText = 'Belum Bayar';
                      if (dibayar >= netCost && netCost > 0) {
                        badgeBg = 'bg-emerald-100 text-emerald-800 border-emerald-300';
                        statusText = 'LUNAS';
                      } else if (dibayar > 0) {
                        badgeBg = 'bg-amber-100 text-amber-800 border-amber-300';
                        statusText = 'SEBAGIAN';
                      }

                      return (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 font-bold text-slate-400">{idx + 1}</td>
                          <td className="p-3">
                            <div className="font-bold text-slate-900">{p.namaLengkap}</div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {p.noRegistrasi} • {p.sekolahAsal}
                            </div>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${isPutra ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}`}>
                              {p.jenisKelamin} ({isPutra ? 'Putra' : 'Putri'})
                            </span>
                          </td>
                          <td className="p-3 text-slate-700">{p.jalur}</td>
                          <td className="p-3 text-right font-mono text-slate-600">
                            Rp {standardCost.toLocaleString('id-ID')}
                          </td>
                          <td className="p-3 text-right font-mono text-rose-700">
                            {diskon > 0 ? `- Rp ${diskon.toLocaleString('id-ID')}` : '-'}
                          </td>
                          <td className="p-3 text-right font-mono font-black text-slate-900 bg-slate-50/50">
                            Rp {netCost.toLocaleString('id-ID')}
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-emerald-700 bg-emerald-50/30">
                            Rp {dibayar.toLocaleString('id-ID')}
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-amber-700">
                            {sisa === 0 ? 'Rp 0' : `Rp ${sisa.toLocaleString('id-ID')}`}
                          </td>
                          <td className="p-3 text-center">
                            <span className={`px-2.5 py-1 rounded-full font-extrabold text-[10px] border ${badgeBg}`}>
                              {statusText}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => setSelectedPendaftarForPay(p)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg transition-all shadow-sm flex items-center gap-1"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Bayar</span>
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedPendaftarForRincian(p);
                                  setIsModalHasilRincianOpen(true);
                                }}
                                className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 font-bold text-[11px] rounded-lg transition-all flex items-center gap-1"
                                title="Cetak Formulir Daftar Ulang & Rincian Biaya SPMB"
                              >
                                <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
                                <span>Daftar Ulang</span>
                              </button>

                              {riwayat.length > 0 && (
                                <button
                                  onClick={() => setSelectedReceipt({ pendaftar: p, riwayat: riwayat[0] })}
                                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white font-bold text-[11px] rounded-lg transition-all flex items-center gap-1"
                                  title="Cetak Kuitansi Terakhir"
                                >
                                  <Receipt className="w-3.5 h-3.5" />
                                  <span>Kuitansi</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: LAPORAN & RINGKASAN KAS */}
      {activeSubTab === 'laporan' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <span>Rekapitulasi Keuangan SPMB Berdasarkan Gender (Putra vs Putri)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              {/* Putra Summary */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                  <h4 className="font-bold text-blue-900 text-sm">REKAP KEUANGAN SISWA PUTRA</h4>
                  <span className="px-2 py-0.5 bg-blue-200 text-blue-900 rounded font-bold text-xs">
                    {pendaftarList.filter((p) => p.jenisKelamin === 'Laki-laki').length} Siswa
                  </span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Biaya Standar per Putra:</span>
                    <span className="font-mono font-bold text-slate-900">
                      Rp {totalBiayaPutra.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Total Target Penerimaan Putra:</span>
                    <span className="font-mono font-bold text-slate-900">
                      Rp {pendaftarList
                        .filter((p) => p.jenisKelamin === 'Laki-laki')
                        .reduce((sum, p) => sum + (totalBiayaPutra - (p.pembayaran?.potonganDiskon || 0)), 0)
                        .toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-800 pt-1 border-t border-blue-200">
                    <span>Dana Terkumpul Putra:</span>
                    <span className="font-mono text-sm">
                      Rp {pendaftarList
                        .filter((p) => p.jenisKelamin === 'Laki-laki')
                        .reduce((sum, p) => sum + (p.pembayaran?.riwayat || []).reduce((s, r) => s + r.jumlah, 0), 0)
                        .toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Putri Summary */}
              <div className="p-4 bg-pink-50 border border-pink-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-pink-200 pb-2">
                  <h4 className="font-bold text-pink-900 text-sm">REKAP KEUANGAN SISWA PUTRI</h4>
                  <span className="px-2 py-0.5 bg-pink-200 text-pink-900 rounded font-bold text-xs">
                    {pendaftarList.filter((p) => p.jenisKelamin === 'Perempuan').length} Siswa
                  </span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Biaya Standar per Putri:</span>
                    <span className="font-mono font-bold text-slate-900">
                      Rp {totalBiayaPutri.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Total Target Penerimaan Putri:</span>
                    <span className="font-mono font-bold text-slate-900">
                      Rp {pendaftarList
                        .filter((p) => p.jenisKelamin === 'Perempuan')
                        .reduce((sum, p) => sum + (totalBiayaPutri - (p.pembayaran?.potonganDiskon || 0)), 0)
                        .toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-pink-800 pt-1 border-t border-pink-200">
                    <span>Dana Terkumpul Putri:</span>
                    <span className="font-mono text-sm">
                      Rp {pendaftarList
                        .filter((p) => p.jenisKelamin === 'Perempuan')
                        .reduce((sum, p) => sum + (p.pembayaran?.riwayat || []).reduce((s, r) => s + r.jumlah, 0), 0)
                        .toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: PAYMENT INPUT */}
      {selectedPendaftarForPay && (
        <ModalBayar
          pendaftar={selectedPendaftarForPay}
          itemBiayaList={itemBiayaList}
          onSavePayment={handleSavePayment}
          onClose={() => setSelectedPendaftarForPay(null)}
        />
      )}

      {/* MODAL 2: PRINTABLE RECEIPT */}
      {selectedReceipt && (
        <ModalKuitansi
          pendaftar={selectedReceipt.pendaftar}
          riwayatItem={selectedReceipt.riwayat}
          itemBiayaList={itemBiayaList}
          profil={profil}
          pengaturan={pengaturan}
          onClose={() => setSelectedReceipt(null)}
        />
      )}

      {/* MODAL 3: EDIT FEE ITEM */}
      {editingItemBiaya && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-base text-slate-900">
                Edit Komponen Biaya: {editingItemBiaya.kategori || editingItemBiaya.namaKomponen}
              </h3>
              <button
                type="button"
                onClick={() => setEditingItemBiaya(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveEditedComponent} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kategori *</label>
                <select
                  value={
                    ['Pembayaran Administrasi keuangan', 'Pembelian Pakaian Seragam'].includes(editingItemBiaya.namaKomponen) && !isCustomEditName
                      ? editingItemBiaya.namaKomponen
                      : 'Lainnya'
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'Pembayaran Administrasi keuangan') {
                      setIsCustomEditName(false);
                      setIsCustomEditKategori(false);
                      setEditingItemBiaya({
                        ...editingItemBiaya,
                        namaKomponen: 'Pembayaran Administrasi keuangan',
                        kategori: KATEGORI_OPSI_ADMINISTRASI[0],
                        keteranganPutra: KATEGORI_OPSI_ADMINISTRASI[0],
                        keteranganPutri: KATEGORI_OPSI_ADMINISTRASI[0]
                      });
                    } else if (val === 'Pembelian Pakaian Seragam') {
                      setIsCustomEditName(false);
                      setIsCustomEditKategori(false);
                      setEditingItemBiaya({
                        ...editingItemBiaya,
                        namaKomponen: 'Pembelian Pakaian Seragam',
                        kategori: KATEGORI_OPSI_SERAGAM[0],
                        keteranganPutra: KATEGORI_OPSI_SERAGAM[0],
                        keteranganPutri: KATEGORI_OPSI_SERAGAM[0]
                      });
                    } else {
                      setIsCustomEditName(true);
                    }
                  }}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white font-medium text-slate-800"
                >
                  <option value="Pembayaran Administrasi keuangan">1. Pembayaran Administrasi keuangan</option>
                  <option value="Pembelian Pakaian Seragam">2. Pembelian Pakaian Seragam</option>
                  <option value="Lainnya">Lainnya / Kategori Khusus</option>
                </select>

                {(!['Pembayaran Administrasi keuangan', 'Pembelian Pakaian Seragam'].includes(editingItemBiaya.namaKomponen) || isCustomEditName) && (
                  <input
                    type="text"
                    value={editingItemBiaya.namaKomponen}
                    onChange={(e) => setEditingItemBiaya({ ...editingItemBiaya, namaKomponen: e.target.value })}
                    className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-amber-50/50"
                    placeholder="Ketik kategori biaya..."
                    required
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rincian *</label>
                  <select
                    value={isCustomEditKategori ? 'Lainnya' : editingItemBiaya.kategori}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'Lainnya') {
                        setIsCustomEditKategori(true);
                      } else {
                        setIsCustomEditKategori(false);
                        setEditingItemBiaya({
                          ...editingItemBiaya,
                          kategori: val,
                          keteranganPutra: val,
                          keteranganPutri: val
                        });
                      }
                    }}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white font-medium text-slate-800"
                  >
                    {editingItemBiaya.namaKomponen === 'Pembayaran Administrasi keuangan' && (
                      <optgroup label="Opsi Pembayaran Administrasi Keuangan">
                        <option value="Titipan SPP">a. Titipan SPP</option>
                        <option value="Iuran OSIS, Pramuka 1 Tahun">b. Iuran OSIS, Pramuka 1 Tahun</option>
                        <option value="Pemeliharaan Alat Drumband 1 Tahun">c. Pemeliharaan Alat Drumband 1 Tahun</option>
                        <option value="Dana Sosial 1 Tahun">d. Dana Sosial 1 Tahun</option>
                        <option value="Perpustakaan 1 Tahun + Kartu OSIS">e. Perpustakaan 1 Tahun + Kartu OSIS</option>
                        <option value="Modul 5 Mapel Agama 1 Semester">f. Modul 5 Mapel Agama 1 Semester</option>
                        <option value="Pemeliharaan Komputer 1 Tahun">g. Pemeliharaan Komputer 1 Tahun</option>
                        <option value="Buku Pembiasaan Harian (PH)">h. Buku Pembiasaan Harian (PH)</option>
                      </optgroup>
                    )}

                    {editingItemBiaya.namaKomponen === 'Pembelian Pakaian Seragam' && (
                      <optgroup label="Opsi Pembelian Pakaian Seragam">
                        <option value="BET (OSIS, Pramuka, Nama, Jenjang Kelas)">a. BET (OSIS, Pramuka, Nama, Jenjang Kelas)</option>
                        <option value="Bahan Pramuka 1 Set">b. Bahan Pramuka 1 Set</option>
                        <option value="Bahan Batik 1 Set">c. Bahan Batik 1 Set</option>
                        <option value="Biru Putih 1 Set">d. Biru Putih 1 Set</option>
                        <option value="Kaos Olah Raga 1 Set">e. Kaos Olah Raga 1 Set</option>
                        <option value="Topi + Sabuk + Hasduk + Dasi">f. Topi + Sabuk + Hasduk + Dasi</option>
                        <option value="Kerudung">g. Kerudung</option>
                      </optgroup>
                    )}

                    {editingItemBiaya.namaKomponen !== 'Pembayaran Administrasi keuangan' && editingItemBiaya.namaKomponen !== 'Pembelian Pakaian Seragam' && (
                      <>
                        <optgroup label="Administrasi Keuangan">
                          {KATEGORI_OPSI_ADMINISTRASI.map((k) => (
                            <option key={k} value={k}>{k}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Seragam">
                          {KATEGORI_OPSI_SERAGAM.map((k) => (
                            <option key={k} value={k}>{k}</option>
                          ))}
                        </optgroup>
                      </>
                    )}
                    <option value="Lainnya">Lainnya (Ketik Manual)</option>
                  </select>

                  {isCustomEditKategori && (
                    <input
                      type="text"
                      value={editingItemBiaya.kategori}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditingItemBiaya({
                          ...editingItemBiaya,
                          kategori: val,
                          keteranganPutra: val,
                          keteranganPutri: val
                        });
                      }}
                      className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-amber-50/50"
                      placeholder="Ketik rincian item biaya..."
                      required
                    />
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sifat Biaya</label>
                  <select
                    value={editingItemBiaya.sifat}
                    onChange={(e: any) => setEditingItemBiaya({ ...editingItemBiaya, sifat: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Wajib">Wajib</option>
                    <option value="Pilihan">Pilihan / Opsional</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-blue-900 mb-1">Nominal Putra (Laki-laki) Rp</label>
                  <input
                    type="number"
                    value={editingItemBiaya.nominalPutra}
                    onChange={(e) => setEditingItemBiaya({ ...editingItemBiaya, nominalPutra: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg font-mono font-bold focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-pink-900 mb-1">Nominal Putri (Perempuan) Rp</label>
                  <input
                    type="number"
                    value={editingItemBiaya.nominalPutri}
                    onChange={(e) => setEditingItemBiaya({ ...editingItemBiaya, nominalPutri: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-pink-300 rounded-lg font-mono font-bold focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItemBiaya(null)}
                  className="px-3.5 py-2 border border-slate-300 rounded-xl hover:bg-slate-100 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-sm"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD NEW FEE ITEM */}
      {isAddItemModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-base text-slate-900">
                Tambah Komponen Biaya Baru
              </h3>
              <button
                type="button"
                onClick={() => setIsAddItemModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddNewComponent} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kategori *</label>
                <select
                  value={isCustomAddName ? 'Lainnya' : newItemForm.namaKomponen}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'Pembayaran Administrasi keuangan') {
                      setIsCustomAddName(false);
                      setIsCustomAddKategori(false);
                      setNewItemForm((prev) => ({
                        ...prev,
                        namaKomponen: 'Pembayaran Administrasi keuangan',
                        kategori: KATEGORI_OPSI_ADMINISTRASI[0],
                        keteranganPutra: KATEGORI_OPSI_ADMINISTRASI[0],
                        keteranganPutri: KATEGORI_OPSI_ADMINISTRASI[0]
                      }));
                    } else if (val === 'Pembelian Pakaian Seragam') {
                      setIsCustomAddName(false);
                      setIsCustomAddKategori(false);
                      setNewItemForm((prev) => ({
                        ...prev,
                        namaKomponen: 'Pembelian Pakaian Seragam',
                        kategori: KATEGORI_OPSI_SERAGAM[0],
                        keteranganPutra: KATEGORI_OPSI_SERAGAM[0],
                        keteranganPutri: KATEGORI_OPSI_SERAGAM[0]
                      }));
                    } else {
                      setIsCustomAddName(true);
                      setNewItemForm((prev) => ({
                        ...prev,
                        namaKomponen: ''
                      }));
                    }
                  }}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white font-medium text-slate-800"
                  required
                >
                  <option value="Pembayaran Administrasi keuangan">1. Pembayaran Administrasi keuangan</option>
                  <option value="Pembelian Pakaian Seragam">2. Pembelian Pakaian Seragam</option>
                  <option value="Lainnya">Lainnya (Ketik Manual)</option>
                </select>

                {isCustomAddName && (
                  <input
                    type="text"
                    value={newItemForm.namaKomponen}
                    onChange={(e) => setNewItemForm({ ...newItemForm, namaKomponen: e.target.value })}
                    className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-amber-50/50"
                    placeholder="Masukkan nama kategori biaya..."
                    autoFocus
                    required
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rincian *</label>
                  <select
                    value={isCustomAddKategori ? 'Lainnya' : newItemForm.kategori}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'Lainnya') {
                        setIsCustomAddKategori(true);
                      } else {
                        setIsCustomAddKategori(false);
                        setNewItemForm({
                          ...newItemForm,
                          kategori: val,
                          keteranganPutra: val,
                          keteranganPutri: val
                        });
                      }
                    }}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white font-medium text-slate-800"
                    required
                  >
                    {(!isCustomAddName && newItemForm.namaKomponen === 'Pembayaran Administrasi keuangan') && (
                      <optgroup label="Opsi Pembayaran Administrasi Keuangan">
                        <option value="Titipan SPP">a. Titipan SPP</option>
                        <option value="Iuran OSIS, Pramuka 1 Tahun">b. Iuran OSIS, Pramuka 1 Tahun</option>
                        <option value="Pemeliharaan Alat Drumband 1 Tahun">c. Pemeliharaan Alat Drumband 1 Tahun</option>
                        <option value="Dana Sosial 1 Tahun">d. Dana Sosial 1 Tahun</option>
                        <option value="Perpustakaan 1 Tahun + Kartu OSIS">e. Perpustakaan 1 Tahun + Kartu OSIS</option>
                        <option value="Modul 5 Mapel Agama 1 Semester">f. Modul 5 Mapel Agama 1 Semester</option>
                        <option value="Pemeliharaan Komputer 1 Tahun">g. Pemeliharaan Komputer 1 Tahun</option>
                        <option value="Buku Pembiasaan Harian (PH)">h. Buku Pembiasaan Harian (PH)</option>
                      </optgroup>
                    )}

                    {(!isCustomAddName && newItemForm.namaKomponen === 'Pembelian Pakaian Seragam') && (
                      <optgroup label="Opsi Pembelian Pakaian Seragam">
                        <option value="BET (OSIS, Pramuka, Nama, Jenjang Kelas)">a. BET (OSIS, Pramuka, Nama, Jenjang Kelas)</option>
                        <option value="Bahan Pramuka 1 Set">b. Bahan Pramuka 1 Set</option>
                        <option value="Bahan Batik 1 Set">c. Bahan Batik 1 Set</option>
                        <option value="Biru Putih 1 Set">d. Biru Putih 1 Set</option>
                        <option value="Kaos Olah Raga 1 Set">e. Kaos Olah Raga 1 Set</option>
                        <option value="Topi + Sabuk + Hasduk + Dasi">f. Topi + Sabuk + Hasduk + Dasi</option>
                        <option value="Kerudung">g. Kerudung</option>
                      </optgroup>
                    )}

                    {isCustomAddName && (
                      <>
                        <optgroup label="Administrasi Keuangan">
                          {KATEGORI_OPSI_ADMINISTRASI.map((k) => (
                            <option key={k} value={k}>{k}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Seragam">
                          {KATEGORI_OPSI_SERAGAM.map((k) => (
                            <option key={k} value={k}>{k}</option>
                          ))}
                        </optgroup>
                      </>
                    )}
                    <option value="Lainnya">Lainnya (Ketik Manual)</option>
                  </select>

                  {isCustomAddKategori && (
                    <input
                      type="text"
                      value={newItemForm.kategori}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNewItemForm({
                          ...newItemForm,
                          kategori: val,
                          keteranganPutra: val,
                          keteranganPutri: val
                        });
                      }}
                      className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-amber-50/50"
                      placeholder="Ketik rincian item biaya..."
                      required
                    />
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sifat Biaya</label>
                  <select
                    value={newItemForm.sifat}
                    onChange={(e: any) => setNewItemForm({ ...newItemForm, sifat: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Wajib">Wajib</option>
                    <option value="Pilihan">Pilihan / Opsional</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-blue-900 mb-1">Nominal Putra (Rp)</label>
                  <input
                    type="number"
                    value={newItemForm.nominalPutra}
                    onChange={(e) => setNewItemForm({ ...newItemForm, nominalPutra: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-pink-900 mb-1">Nominal Putri (Rp)</label>
                  <input
                    type="number"
                    value={newItemForm.nominalPutri}
                    onChange={(e) => setNewItemForm({ ...newItemForm, nominalPutri: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-pink-300 rounded-lg font-mono focus:ring-2 focus:ring-pink-500 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddItemModalOpen(false)}
                  className="px-3.5 py-2 border border-slate-300 rounded-xl hover:bg-slate-100 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-sm"
                >
                  Tambah Komponen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: TAMPILAN HASIL RINCIAN BIAYA SPMB RESMI */}
      {isModalHasilRincianOpen && (
        <ModalHasilRincian
          itemBiayaList={itemBiayaList}
          profil={profil}
          pengaturan={pengaturan}
          pendaftar={selectedPendaftarForRincian}
          jadwalPiketList={jadwalPiketList}
          onClose={() => {
            setIsModalHasilRincianOpen(false);
            setSelectedPendaftarForRincian(null);
          }}
        />
      )}

      {/* Confirm / Alert Dialog */}
      <ConfirmDialog
        dialog={confirmDialog}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />

    </div>
  );
};
