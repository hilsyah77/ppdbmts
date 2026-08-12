import React, { useState, useMemo } from 'react';
import { Pendaftar, JalurPPDB, StatusPendaftar } from '../types';
import {
  Users,
  Search,
  Download,
  Plus,
  Eye,
  Printer,
  ShieldCheck,
  Trash2,
  PhoneCall,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';

interface DataPendaftarProps {
  pendaftarList: Pendaftar[];
  jalurList: JalurPPDB[];
  initialFilterJalur?: string;
  initialFilterStatus?: string;
  onOpenDetail: (pendaftar: Pendaftar) => void;
  onOpenCetak: (pendaftar: Pendaftar) => void;
  onOpenVerifikasi: (pendaftar: Pendaftar) => void;
  onDeletePendaftar: (id: string, nama: string) => void;
  onOpenTambahModal: () => void;
}

export const DataPendaftar: React.FC<DataPendaftarProps> = ({
  pendaftarList,
  jalurList,
  initialFilterJalur = '',
  initialFilterStatus = '',
  onOpenDetail,
  onOpenCetak,
  onOpenVerifikasi,
  onDeletePendaftar,
  onOpenTambahModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJalur, setSelectedJalur] = useState<string>(initialFilterJalur);
  const [selectedStatus, setSelectedStatus] = useState<string>(initialFilterStatus);
  // Filtering Logic
  const filteredData = useMemo(() => {
    return pendaftarList.filter((p) => {
      const matchSearch =
        !searchTerm.trim() ||
        p.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.noRegistrasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sekolahAsal.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.noHpWa.includes(searchTerm) ||
        p.nisn.includes(searchTerm);

      const matchJalur = !selectedJalur || p.jalur === selectedJalur;
      const matchStatus =
        !selectedStatus ||
        p.status === selectedStatus ||
        (selectedStatus === 'Di Terima' && p.status === 'Terverifikasi');

      return matchSearch && matchJalur && matchStatus;
    });
  }, [pendaftarList, searchTerm, selectedJalur, selectedStatus]);

  // Export to CSV Functionality
  const exportToCSV = () => {
    if (filteredData.length === 0) {
      alert('Tidak ada data pendaftar untuk diekspor!');
      return;
    }

    const headers = [
      'No Urut',
      'No Registrasi',
      'Nama Lengkap',
      'Tempat Lahir',
      'Tanggal Lahir',
      'Jenis Kelamin',
      'NISN',
      'NIK',
      'No HP WA',
      'Jalur Pendaftaran',
      'Sekolah Asal',
      'Status Verifikasi',
      'Catatan Verifikasi',
      'Nama Ayah',
      'Pekerjaan Ayah',
      'Nama Ibu',
      'No Kontak Ortu',
      'Alamat Lengkap',
      'Rata Rapor',
      'Tanggal Daftar'
    ];

    const rows = filteredData.map((p) => [
      p.noUrut,
      `"${p.noRegistrasi}"`,
      `"${p.namaLengkap}"`,
      `"${p.tempatLahir}"`,
      `"${p.tanggalLahir}"`,
      `"${p.jenisKelamin}"`,
      `"${p.nisn}"`,
      `"${p.nik}"`,
      `"${p.noHpWa}"`,
      `"${p.jalur}"`,
      `"${p.sekolahAsal}"`,
      `"${p.status}"`,
      `"${p.catatanVerifikasi || ''}"`,
      `"${p.namaAyah}"`,
      `"${p.pekerjaanAyah}"`,
      `"${p.namaIbu}"`,
      `"${p.noHpOrangTua}"`,
      `"${p.alamatSiswa}, ${p.kabKota}"`,
      p.rataRapor || '',
      `"${p.tanggalDaftar}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const timeStamp = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `DATA_PENDAFTAR_PPDB_MTS_${timeStamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      
      {/* Title & Top Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Data Pendaftar PPDB MTs</h2>
              <p className="text-xs text-slate-500">
                Kelola data calon siswa, verifikasi berkas, cetak formulir resmi, dan ekspor CSV.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Export CSV Button */}
          <button
            onClick={exportToCSV}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition-colors shadow-sm flex items-center gap-2"
            title="Download file CSV dari data tabel pendaftar"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Ekspor CSV</span>
          </button>

          {/* Add New Registrant Button */}
          <button
            onClick={onOpenTambahModal}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pendaftar Baru</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Live Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari Nama, No. Reg, Sekolah Asal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Jalur */}
          <select
            value={selectedJalur}
            onChange={(e) => setSelectedJalur(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-700 font-medium"
          >
            <option value="">Semua Jalur Pendaftaran</option>
            {jalurList.map((j) => (
              <option key={j.id} value={j.namaJalur}>
                {j.namaJalur}
              </option>
            ))}
          </select>

          {/* Filter Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-700 font-medium"
          >
            <option value="">Semua Status Verifikasi</option>
            <option value="Di Terima">Di Terima</option>
            <option value="Belum Diverifikasi">Belum Diverifikasi (Pending)</option>
            <option value="Berkas Belum Lengkap">Berkas Belum Lengkap</option>
            <option value="Ditolak">Ditolak</option>
          </select>

        </div>

        {/* Quick Filter Info Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 flex-wrap gap-2">
          <div>
            Menampilkan <strong className="text-slate-800">{filteredData.length}</strong> dari{' '}
            <strong className="text-slate-800">{pendaftarList.length}</strong> total pendaftar
          </div>

          {(selectedJalur || selectedStatus || searchTerm) && (
            <button
              onClick={() => {
                setSelectedJalur('');
                setSelectedStatus('');
                setSearchTerm('');
              }}
              className="text-xs text-rose-600 hover:underline font-semibold"
            >
              Reset Filter & Pencarian
            </button>
          )}
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            
            {/* Table Header */}
            <thead>
              <tr className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[11px] border-b border-slate-800">
                <th className="p-3.5 text-center w-12">No Urut</th>
                <th className="p-3.5 whitespace-nowrap">No Registrasi</th>
                <th className="p-3.5 whitespace-nowrap min-w-[180px]">Nama Lengkap</th>
                <th className="p-3.5 whitespace-nowrap">Tempat, Tanggal Lahir</th>
                <th className="p-3.5 whitespace-nowrap">No HP / WA</th>
                <th className="p-3.5 whitespace-nowrap">Jalur</th>
                <th className="p-3.5 whitespace-nowrap min-w-[160px]">Sekolah Asal</th>
                <th className="p-3.5 whitespace-nowrap text-center">Status</th>
                <th className="p-3.5 text-center whitespace-nowrap min-w-[210px]">Aksi</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-200">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500">
                    <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold">Tidak ada data pendaftar yang sesuai filter.</p>
                    <p className="text-[11px] text-slate-400 mt-1">Coba ubah kata kunci pencarian atau reset filter.</p>
                  </td>
                </tr>
              ) : (
                filteredData.map((pendaftar) => {
                  return (
                    <tr
                      key={pendaftar.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* 1. No Urut */}
                      <td className="p-3.5 text-center font-bold text-slate-600 bg-slate-50/50">
                        {pendaftar.noUrut}
                      </td>

                      {/* 2. No Registrasi */}
                      <td className="p-3.5 font-mono font-bold text-emerald-800 whitespace-nowrap">
                        {pendaftar.noRegistrasi}
                      </td>

                      {/* 3. Nama Lengkap */}
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{pendaftar.namaLengkap}</div>
                        <div className="text-[10px] text-slate-500">
                          {pendaftar.jenisKelamin} • NISN: {pendaftar.nisn}
                        </div>
                      </td>

                      {/* 4. Tempat Tanggal Lahir */}
                      <td className="p-3.5 text-slate-700 whitespace-nowrap">
                        <div>{pendaftar.tempatLahir}</div>
                        <div className="text-[10px] text-slate-500">{pendaftar.tanggalLahir}</div>
                      </td>

                      {/* 5. No HP / WA */}
                      <td className="p-3.5 whitespace-nowrap">
                        <a
                          href={`https://wa.me/${pendaftar.noHpWa.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 hover:underline"
                          title="Kirim Pesan WhatsApp ke Siswa / Orang Tua"
                        >
                          <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{pendaftar.noHpWa}</span>
                        </a>
                      </td>

                      {/* 6. Jalur */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                          {pendaftar.jalur}
                        </span>
                      </td>

                      {/* 7. Sekolah Asal */}
                      <td className="p-3.5">
                        <div className="font-medium text-slate-800">{pendaftar.sekolahAsal}</div>
                      </td>

                      {/* 8. Status */}
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            pendaftar.status === 'Di Terima' || pendaftar.status === 'Terverifikasi'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : pendaftar.status === 'Ditolak'
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : pendaftar.status === 'Berkas Belum Lengkap'
                              ? 'bg-sky-100 text-sky-800 border-sky-300'
                              : 'bg-amber-100 text-amber-800 border-amber-300'
                          }`}
                        >
                          {(pendaftar.status === 'Di Terima' || pendaftar.status === 'Terverifikasi') && <CheckCircle2 className="w-3 h-3" />}
                          {pendaftar.status === 'Ditolak' && <XCircle className="w-3 h-3" />}
                          {pendaftar.status === 'Belum Diverifikasi' && <Clock className="w-3 h-3" />}
                          {pendaftar.status === 'Berkas Belum Lengkap' && <AlertTriangle className="w-3 h-3" />}
                          <span>{pendaftar.status === 'Terverifikasi' ? 'Di Terima' : pendaftar.status}</span>
                        </span>
                      </td>

                      {/* 9. Aksi (Detail, Cetak Formulir, Verifikasi, Hapus) */}
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          
                          {/* Detail */}
                          <button
                            onClick={() => onOpenDetail(pendaftar)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors flex items-center gap-1 text-[11px]"
                            title="Lihat Detail Profil Siswa"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-600" />
                            <span className="hidden sm:inline">Detail</span>
                          </button>

                          {/* Cetak Formulir */}
                          <button
                            onClick={() => onOpenCetak(pendaftar)}
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-semibold transition-colors flex items-center gap-1 text-[11px] border border-emerald-200"
                            title="Cetak Formulir Pendaftaran Official"
                          >
                            <Printer className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="hidden sm:inline">Cetak</span>
                          </button>

                          {/* Verifikasi */}
                          <button
                            onClick={() => onOpenVerifikasi(pendaftar)}
                            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg font-semibold transition-colors flex items-center gap-1 text-[11px] border border-blue-200"
                            title="Ubah Status Verifikasi"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                            <span className="hidden sm:inline">Verifikasi</span>
                          </button>

                          {/* Hapus */}
                          <button
                            onClick={() => onDeletePendaftar(pendaftar.id, pendaftar.namaLengkap)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-semibold transition-colors flex items-center gap-1 text-[11px] border border-rose-200"
                            title="Hapus Data Pendaftar Ini"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          </button>

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
  );
};
