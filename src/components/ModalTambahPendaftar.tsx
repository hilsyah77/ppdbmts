import React, { useState } from 'react';
import {
  Pendaftar,
  JalurPPDB,
  JenisKelamin,
  StatusPendaftar,
  StatusOrangTua,
  PendidikanOrangTua,
  PekerjaanOrangTua,
  OPSI_STATUS_ORANG_TUA
} from '../types';
import { X, UserPlus, Save, Users } from 'lucide-react';

interface ModalTambahProps {
  jalurList: JalurPPDB[];
  onClose: () => void;
  onAddPendaftar: (pendaftarBaru: Omit<Pendaftar, 'id' | 'noUrut' | 'noRegistrasi' | 'tanggalDaftar'>) => void;
}

export const ModalTambahPendaftar: React.FC<ModalTambahProps> = ({
  jalurList,
  onClose,
  onAddPendaftar
}) => {
  const [formData, setFormData] = useState({
    namaLengkap: '',
    tempatLahir: '',
    tanggalLahir: '',
    jenisKelamin: 'Laki-laki' as JenisKelamin,
    nisn: '',
    nik: '',
    noKk: '',
    namaKepalaKeluarga: '',
    noKip: '',
    noHpWa: '',
    jumlahSaudara: 2,
    anakKe: 1,
    pembiayaSekolah: 'Orang Tua',
    praSekolah: {
      pernahTkRa: true,
      pernahPaud: false
    },
    imunisasi: {
      hepatitisB: true,
      bcg: true,
      dpt: true,
      polio: true,
      campak: true,
      covid: false
    },
    jalur: jalurList[0]?.namaJalur || 'Jalur Reguler',
    sekolahAsal: '',
    jenisSekolahAsal: 'MI Negeri' as Pendaftar['jenisSekolahAsal'],
    npsnSekolahAsal: '',
    status: 'Belum Diverifikasi' as StatusPendaftar,
    catatanVerifikasi: 'Diinput langsung oleh Panitia PPDB.',
    alamatSiswa: '',
    rtRw: '001/001',
    kelurahan: '',
    kecamatan: '',
    kabKota: 'Jakarta Selatan',
    provinsi: 'DKI Jakarta',
    // Data Ayah
    statusAyah: 'Masih Hidup' as StatusOrangTua,
    namaAyah: '',
    nikAyah: '',
    tempatLahirAyah: '',
    tanggalLahirAyah: '',
    pendidikanAyah: 'SMA/Sederajat' as PendidikanOrangTua,
    pekerjaanAyah: 'Wiraswasta' as PekerjaanOrangTua,
    // Data Ibu
    statusIbu: 'Masih Hidup' as StatusOrangTua,
    namaIbu: '',
    nikIbu: '',
    tempatLahirIbu: '',
    tanggalLahirIbu: '',
    pendidikanIbu: 'SMA/Sederajat' as PendidikanOrangTua,
    pekerjaanIbu: 'Tidak Bekerja' as PekerjaanOrangTua,
    rataRapor: 80,
    jumlahJuzTahfizh: 0,
    prestasiDetail: '',
    berkas: {
      ijazahSkl: true,
      kartuKeluarga: true,
      aktaLahir: true,
      pasFoto: true,
      sertifikatPrestasi: false,
      kipPkhKks: false
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? undefined : Number(value)) : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      berkas: {
        ...prev.berkas,
        [name]: checked
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaLengkap || !formData.sekolahAsal || !formData.noHpWa) {
      alert('Mohon isi Nama Lengkap, Sekolah Asal, dan No. HP/WA!');
      return;
    }
    onAddPendaftar(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white rounded-t-2xl flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold">Penginputan Pendaftar Baru (Panitia Piket)</h3>
              <p className="text-[11px] text-slate-400">
                Formulir pendaftaran luring/offline untuk calon peserta didik baru MTs
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div className="font-bold text-slate-800 text-xs border-b border-slate-200 pb-1 uppercase tracking-wider text-emerald-700">
            1. Data Pribadi Calon Siswa
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap Siswa *</label>
              <input
                type="text"
                name="namaLengkap"
                required
                value={formData.namaLengkap}
                onChange={handleChange}
                placeholder="Contoh: Muhammad Farhan Al-Ghifari"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tempat Lahir</label>
              <input
                type="text"
                name="tempatLahir"
                value={formData.tempatLahir}
                onChange={handleChange}
                placeholder="Jakarta"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Lahir</label>
              <input
                type="text"
                name="tanggalLahir"
                value={formData.tanggalLahir}
                onChange={handleChange}
                placeholder="15 Mei 2013"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Kelamin</label>
              <select
                name="jenisKelamin"
                value={formData.jenisKelamin}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">No. HP / WhatsApp Siswa / Ortu *</label>
              <input
                type="text"
                name="noHpWa"
                required
                value={formData.noHpWa}
                onChange={handleChange}
                placeholder="081234567890"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">NISN</label>
              <input
                type="text"
                name="nisn"
                value={formData.nisn}
                onChange={handleChange}
                placeholder="0134567890"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">NIK Siswa</label>
              <input
                type="text"
                name="nik"
                value={formData.nik}
                onChange={handleChange}
                placeholder="3174000000000001"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Jalur Pendaftaran *</label>
              <select
                name="jalur"
                value={formData.jalur}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-emerald-800"
              >
                {jalurList.map((j) => (
                  <option key={j.id} value={j.namaJalur}>
                    {j.namaJalur} (Sisa Kuota: {j.kuota - j.terisi})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Status Awal Pendaftaran</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
              >
                <option value="Belum Diverifikasi">Belum Diverifikasi</option>
                <option value="Terverifikasi">Langsung Terverifikasi</option>
                <option value="Berkas Belum Lengkap">Berkas Belum Lengkap</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-2 pt-2 border-t border-slate-200">
              <label className="block text-xs font-bold text-slate-700">Alamat Tempat Tinggal</label>
              <input
                type="text"
                name="alamatSiswa"
                placeholder="Jalan / Kampung / Dusun"
                value={formData.alamatSiswa}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <input
                  type="text"
                  name="rtRw"
                  placeholder="RT/RW (cth: 002/005)"
                  value={formData.rtRw}
                  onChange={handleChange}
                  className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <input
                  type="text"
                  name="kelurahan"
                  placeholder="Kelurahan / Desa"
                  value={formData.kelurahan}
                  onChange={handleChange}
                  className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <input
                  type="text"
                  name="kecamatan"
                  placeholder="Kecamatan"
                  value={formData.kecamatan}
                  onChange={handleChange}
                  className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <input
                  type="text"
                  name="kabKota"
                  placeholder="Kabupaten / Kota"
                  value={formData.kabKota}
                  onChange={handleChange}
                  className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <input
                type="text"
                name="provinsi"
                placeholder="Provinsi"
                value={formData.provinsi}
                onChange={handleChange}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="font-bold text-slate-800 text-xs border-b border-slate-200 pb-1 uppercase tracking-wider text-emerald-700 pt-2">
            2. Sekolah Asal Siswa
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Sekolah Asal *</label>
              <input
                type="text"
                name="sekolahAsal"
                required
                value={formData.sekolahAsal}
                onChange={handleChange}
                placeholder="Contoh: MI Negeri 3 Jakarta"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">NPSN Sekolah Asal</label>
              <input
                type="text"
                name="npsnSekolahAsal"
                value={formData.npsnSekolahAsal || ''}
                onChange={handleChange}
                placeholder="Contoh: 20108374 (8 Digit)"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Section 3: Data Orang Tua / Wali */}
          <div className="font-bold text-slate-800 text-xs border-b border-slate-200 pb-1 uppercase tracking-wider text-emerald-700 pt-2 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>3. Data Orang Tua / Wali Siswa</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box Data Ayah */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
              <div className="font-bold text-xs text-slate-800 border-b border-slate-200 pb-1 flex items-center justify-between">
                <span>Data Ayah Kandung / Wali</span>
                <span className="text-[10px] text-slate-500 font-normal">Identitas Ayah</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status Ayah</label>
                <select
                  name="statusAyah"
                  value={formData.statusAyah}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
                >
                  {OPSI_STATUS_ORANG_TUA.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Ayah *</label>
                <input
                  type="text"
                  name="namaAyah"
                  value={formData.namaAyah}
                  onChange={handleChange}
                  placeholder="Nama Lengkap Ayah"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
                />
              </div>
            </div>

            {/* Box Data Ibu */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
              <div className="font-bold text-xs text-slate-800 border-b border-slate-200 pb-1 flex items-center justify-between">
                <span>Data Ibu Kandung</span>
                <span className="text-[10px] text-slate-500 font-normal">Identitas Ibu</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status Ibu</label>
                <select
                  name="statusIbu"
                  value={formData.statusIbu}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
                >
                  {OPSI_STATUS_ORANG_TUA.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Ibu *</label>
                <input
                  type="text"
                  name="namaIbu"
                  value={formData.namaIbu}
                  onChange={handleChange}
                  placeholder="Nama Lengkap Ibu"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
                />
              </div>
            </div>
          </div>

          <div className="font-bold text-slate-800 text-xs border-b border-slate-200 pb-1 uppercase tracking-wider text-emerald-700 pt-2">
            4. Penyerahan Berkas Persyaratan
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <label className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                name="ijazahSkl"
                checked={formData.berkas.ijazahSkl}
                onChange={handleCheckboxChange}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Ijazah / SKL</span>
            </label>

            <label className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                name="kartuKeluarga"
                checked={formData.berkas.kartuKeluarga}
                onChange={handleCheckboxChange}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Kartu Keluarga</span>
            </label>

            <label className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                name="aktaLahir"
                checked={formData.berkas.aktaLahir}
                onChange={handleCheckboxChange}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Akta Kelahiran</span>
            </label>

            <label className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                name="pasFoto"
                checked={formData.berkas.pasFoto}
                onChange={handleCheckboxChange}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Pasfoto 3x4</span>
            </label>

            <label className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                name="sertifikatPrestasi"
                checked={formData.berkas.sertifikatPrestasi}
                onChange={handleCheckboxChange}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Sertifikat Prestasi</span>
            </label>

            <label className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                name="kipPkhKks"
                checked={formData.berkas.kipPkhKks || false}
                onChange={handleCheckboxChange}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Kartu KIP / PKH / KKS</span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Data Pendaftar</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
