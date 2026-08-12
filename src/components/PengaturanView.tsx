import React, { useState } from 'react';
import { PengaturanPPDBData, JalurPPDB } from '../types';
import {
  Settings,
  Calendar,
  Layers,
  FileText,
  Users,
  Save,
  CheckCircle,
  Plus,
  Trash2,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
  Database,
  X,
  AlertOctagon
} from 'lucide-react';

interface PengaturanViewProps {
  pengaturan: PengaturanPPDBData;
  jalurList: JalurPPDB[];
  onSavePengaturan: (newPengaturan: PengaturanPPDBData) => void;
  onSaveJalurList: (newJalurList: JalurPPDB[]) => void;
  onResetDatabase?: () => void;
  onClearPendaftarDatabase?: () => void;
}

export const PengaturanView: React.FC<PengaturanViewProps> = ({
  pengaturan,
  jalurList,
  onSavePengaturan,
  onSaveJalurList,
  onResetDatabase,
  onClearPendaftarDatabase
}) => {
  const [formData, setFormData] = useState<PengaturanPPDBData>(pengaturan);
  const [jalurs, setJalurs] = useState<JalurPPDB[]>(jalurList);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Safety confirmation modal state for Database Operations
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteType, setDeleteType] = useState<'pendaftar_only' | 'full_reset'>('pendaftar_only');
  const [confirmInputText, setConfirmInputText] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenDeleteModal = (type: 'pendaftar_only' | 'full_reset') => {
    setDeleteType(type);
    setConfirmInputText('');
    setShowDeleteModal(true);
  };

  const handleExecuteDatabaseDeletion = () => {
    if (confirmInputText.trim().toUpperCase() !== 'HAPUS') {
      alert('Konfirmasi gagal: Ketik kata "HAPUS" dengan benar untuk melanjutkan.');
      return;
    }

    setShowDeleteModal(false);

    if (deleteType === 'pendaftar_only' && onClearPendaftarDatabase) {
      onClearPendaftarDatabase();
    } else if (deleteType === 'full_reset' && onResetDatabase) {
      onResetDatabase();
    }
  };

  const handleJalurQuotaChange = (id: string, newKuota: number) => {
    setJalurs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, kuota: Math.max(1, newKuota) } : j))
    );
  };

  const handleAddJalur = () => {
    const namaBaru = prompt('Masukkan Nama Jalur Pendaftaran Baru (misal: Jalur Undangan Alumni):');
    if (!namaBaru) return;

    const newJalurItem: JalurPPDB = {
      id: `j-${Date.now()}`,
      namaJalur: namaBaru,
      kuota: 25,
      terisi: 0,
      deskripsi: 'Jalur khusus sesuai juknis panitia.',
      persyaratan: ['Persyaratan sesuai ketentuan panitia'],
      warnaBadge: 'bg-indigo-100 text-indigo-800 border-indigo-300'
    };

    setJalurs((prev) => [...prev, newJalurItem]);
  };

  const handleDeleteJalur = (id: string, nama: string) => {
    if (confirm(`Hapus jalur ${nama}?`)) {
      setJalurs((prev) => prev.filter((j) => j.id !== id));
    }
  };

  const handleSubmitAll = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePengaturan(formData);
    onSaveJalurList(jalurs);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Title */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-900 text-white rounded-xl">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Pengaturan Utama PPDB MTs</h2>
            <p className="text-xs text-slate-500">
              Konfigurasi tahun ajaran, gelombang pendaftaran, alokasi kuota per jalur, dan format kop surat cetak.
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmitAll}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Semua Pengaturan</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>Seluruh pengaturan PPDB dan kuota jalur berhasil diperbarui!</span>
        </div>
      )}

      <form onSubmit={handleSubmitAll} className="space-y-6">
        
        {/* Section 1: Tahun Ajaran & Jadwal */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>1. Jadwal & Gelombang Pendaftaran PPDB</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tahun Ajaran</label>
              <input
                type="text"
                name="tahunAjaran"
                value={formData.tahunAjaran}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Gelombang Aktif</label>
              <input
                type="text"
                name="gelombangActive"
                value={formData.gelombangActive}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-emerald-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tanggal Mulai Pendaftaran</label>
              <input
                type="date"
                name="tanggalMulai"
                value={formData.tanggalMulai}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tanggal Selesai Pendaftaran</label>
              <input
                type="date"
                name="tanggalSelesai"
                value={formData.tanggalSelesai}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tanggal Pengumuman Hasil</label>
              <input
                type="date"
                name="tanggalPengumuman"
                value={formData.tanggalPengumuman}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Biaya Pendaftaran</label>
              <input
                type="text"
                name="biariaPendaftaran"
                value={formData.biariaPendaftaran}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold text-emerald-700"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Quota per Jalur */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>2. Alokasi Kuota & Manajemen Jalur Pendaftaran</span>
            </h3>
            <button
              type="button"
              onClick={handleAddJalur}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg text-xs transition-colors flex items-center gap-1 border border-emerald-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Jalur Baru</span>
            </button>
          </div>

          <div className="space-y-3">
            {jalurs.map((j) => (
              <div
                key={j.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1 max-w-lg">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{j.namaJalur}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-bold ${j.warnaBadge}`}>
                      {j.namaJalur}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px]">{j.deskripsi}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">Kuota Target:</span>
                    <input
                      type="number"
                      min={1}
                      value={j.kuota}
                      onChange={(e) => handleJalurQuotaChange(j.id, parseInt(e.target.value) || 1)}
                      className="w-20 px-3 py-1.5 border border-slate-300 rounded-lg text-center font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <span className="text-slate-500">Siswa</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteJalur(j.id, j.namaJalur)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Header Kop Surat Form */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>3. Pengaturan Kop Surat Formulir Resmi</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Baris Header 1 (Instansi Induk)</label>
              <input
                type="text"
                name="kopHeaderLine1"
                value={formData.kopHeaderLine1}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-serif"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Baris Header 2 (Kantor Kemenag Wilayah)</label>
              <input
                type="text"
                name="kopHeaderLine2"
                value={formData.kopHeaderLine2}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-serif"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Baris Header 3 (Nama Madrasah Utama)</label>
              <input
                type="text"
                name="kopHeaderLine3"
                value={formData.kopHeaderLine3}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-serif font-bold text-emerald-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ketua Panitia PPDB (Penandatangan)</label>
                <input
                  type="text"
                  name="panitiaKetua"
                  value={formData.panitiaKetua}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Sekretaris Panitia PPDB</label>
                <input
                  type="text"
                  name="panitiaSekretaris"
                  value={formData.panitiaSekretaris}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Section 4: Hapus & Reset Database PPDB (Danger Zone) */}
        <div className="bg-white rounded-2xl p-6 border-2 border-rose-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-rose-100">
            <h3 className="text-sm font-bold text-rose-800 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>4. Manajemen Keamanan & Hapus Database PPDB</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-200 uppercase tracking-wider">
              Danger Zone
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Fitur pembersihan dan penghapusan database PPDB. Gunakan opsi di bawah ini saat hendak membuka pendaftaran tahun ajaran baru atau mengembalikan sistem ke kondisi awal.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            
            {/* Box 1: Kosongkan Hanya Data Pendaftar */}
            <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-xl space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
                  <Database className="w-4 h-4 text-rose-600" />
                  <span>Kosongkan Seluruh Data Pendaftar</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Menghapus seluruh daftar pendaftar dan riwayat kuitansi pembayaran untuk memulai periode pendaftaran baru (0 Pendaftar). Pengaturan profil madrasah & kuota tetap tersimpan.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleOpenDeleteModal('pendaftar_only')}
                className="w-full py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Data Pendaftar (0 Siswa)</span>
              </button>
            </div>

            {/* Box 2: Reset Total Database ke Factory Default */}
            <div className="p-4 bg-slate-100/80 border border-slate-300 rounded-xl space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                  <RotateCcw className="w-4 h-4 text-amber-600" />
                  <span>Reset Total Database (Awal Pabrik/Demo)</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Menghapus seluruh cache penyimpanan lokal database (Pendaftar, Rincian Biaya, Kuota, Profil Madrasah, Piket) dan mengembalikan ke data awal demo sistem.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleOpenDeleteModal('full_reset')}
                className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Reset Total Database (Demo Default)</span>
              </button>
            </div>

          </div>
        </div>

      </form>

      {/* CONFIRMATION SAFETY MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-rose-200 overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="p-4 bg-rose-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <AlertOctagon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Konfirmasi Hapus Database</h3>
                  <p className="text-[11px] text-rose-100">
                    Tindakan ini membutuhkan verifikasi keamanan
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-1.5 bg-rose-800 hover:bg-rose-900 text-white rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1.5">
                <div className="font-bold text-rose-900 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>PERINGATAN SANGAT IMPORTANT:</span>
                </div>
                <p className="text-rose-800 text-[11px] leading-relaxed">
                  {deleteType === 'pendaftar_only'
                    ? 'Anda akan MENGHAPUS SEMUA DATA PENDAFTAR & PEMBAYARAN. Seluruh riwayat transaksi kuitansi dan biodata siswa akan dikosongkan secara permanen.'
                    : 'Anda akan MENGHAPUS SELURUH DATABASE LOKAL dan mengembalikan data pendaftar, biaya, kuota, serta profil madrasah ke settingan awal (demo).'}
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Ketik kata <span className="font-black text-rose-600 underline">HAPUS</span> di bawah ini untuk mengonfirmasi:
                </label>
                <input
                  type="text"
                  value={confirmInputText}
                  onChange={(e) => setConfirmInputText(e.target.value)}
                  placeholder="Ketik HAPUS..."
                  className="w-full px-3 py-2 border-2 border-rose-300 rounded-xl font-mono font-bold text-center text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none uppercase"
                  autoFocus
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleExecuteDatabaseDeletion}
                  disabled={confirmInputText.trim().toUpperCase() !== 'HAPUS'}
                  className={`px-5 py-2 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-md ${
                    confirmInputText.trim().toUpperCase() === 'HAPUS'
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Proses Hapus Database</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
