import React, { useState } from 'react';
import { Pendaftar, JalurPPDB, JenisKelamin, StatusPendaftar } from '../types';
import { X, UserPlus, Save } from 'lucide-react';

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
    noHpWa: '',
    jumlahSaudara: 2,
    anakKe: 1,
    pembiayaSekolah: 'Orang Tua',
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
    namaAyah: '',
    pekerjaanAyah: 'Swasta',
    namaIbu: '',
    pekerjaanIbu: 'Ibu Rumah Tangga',
    noHpOrangTua: '',
    penghasilanOrangTua: 'Rp 3.000.000 - Rp 5.000.000',
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
              <label className="block text-xs font-bold text-slate-700 mb-1">Jumlah Saudara</label>
              <input
                type="number"
                name="jumlahSaudara"
                min={0}
                value={formData.jumlahSaudara ?? ''}
                onChange={handleChange}
                placeholder="2"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Anak Ke-</label>
              <input
                type="number"
                name="anakKe"
                min={1}
                value={formData.anakKe ?? ''}
                onChange={handleChange}
                placeholder="1"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Yang Membiayai Sekolah</label>
              <select
                name="pembiayaSekolah"
                value={formData.pembiayaSekolah || 'Orang Tua'}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
              >
                <option value="Orang Tua">Orang Tua</option>
                <option value="Wali / Orang Tua Asuh">Wali / Orang Tua Asuh</option>
                <option value="Tanggungan Sendiri">Tanggungan Sendiri</option>
                <option value="Lainnya">Lainnya</option>
              </select>
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
          </div>

          <div className="font-bold text-slate-800 text-xs border-b border-slate-200 pb-1 uppercase tracking-wider text-emerald-700 pt-2">
            2. Sekolah Asal & Orang Tua
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
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

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Singkat Tempat Tinggal</label>
              <input
                type="text"
                name="alamatSiswa"
                value={formData.alamatSiswa}
                onChange={handleChange}
                placeholder="Jl. Fatmawati No. 10, Cilandak"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Ayah</label>
              <input
                type="text"
                name="namaAyah"
                value={formData.namaAyah}
                onChange={handleChange}
                placeholder="Nama Ayah / Wali"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Ibu</label>
              <input
                type="text"
                name="namaIbu"
                value={formData.namaIbu}
                onChange={handleChange}
                placeholder="Nama Ibu"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="font-bold text-slate-800 text-xs border-b border-slate-200 pb-1 uppercase tracking-wider text-emerald-700 pt-2">
            3. Penyerahan Berkas Persyaratan
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
