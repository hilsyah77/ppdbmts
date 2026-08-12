import React, { useState, useEffect } from 'react';
import { Pendaftar, JalurPPDB, JenisKelamin } from '../types';
import {
  X,
  User,
  Phone,
  School,
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Users,
  Edit3,
  Save,
  RotateCcw,
  Check
} from 'lucide-react';

interface ModalDetailProps {
  pendaftar: Pendaftar | null;
  jalurList?: JalurPPDB[];
  onClose: () => void;
  onSavePendaftar?: (updatedPendaftar: Pendaftar) => void;
  onOpenVerifikasi?: (pendaftar: Pendaftar) => void;
  onOpenCetak?: (pendaftar: Pendaftar) => void; // Optional fallback if referenced
}

export const ModalDetailPendaftar: React.FC<ModalDetailProps> = ({
  pendaftar,
  jalurList = [],
  onClose,
  onSavePendaftar,
  onOpenVerifikasi
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Pendaftar | null>(pendaftar);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setFormData(pendaftar);
    setIsEditing(false);
    setSavedSuccess(false);
  }, [pendaftar]);

  if (!pendaftar || !formData) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: value
      };
    });
  };

  const handleNumberInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: value === '' ? undefined : Number(value)
      };
    });
  };

  const handleBerkasToggle = (key: keyof Pendaftar['berkas']) => {
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        berkas: {
          ...prev.berkas,
          [key]: !prev.berkas[key]
        }
      };
    });
  };

  const handleSave = () => {
    if (onSavePendaftar && formData) {
      onSavePendaftar(formData);
      setIsEditing(false);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
      }, 3000);
    }
  };

  const handleCancel = () => {
    setFormData(pendaftar);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        
        {/* Modal Header */}
        <div className="p-5 bg-slate-900 text-white rounded-t-2xl flex items-center justify-between sticky top-0 z-20">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {formData.noRegistrasi}
              </span>
              <span className="text-xs text-slate-400">
                No. Urut: #{formData.noUrut}
              </span>
              {isEditing && (
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Mode Edit
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold mt-1 text-slate-100">
              {isEditing ? `Edit Data: ${formData.namaLengkap}` : formData.namaLengkap}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Data</span>
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
              title="Tutup Window"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Toast Banner */}
        {savedSuccess && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 flex items-center justify-between text-emerald-800 text-xs font-bold">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Data pendaftar berhasil diperbarui dan disimpan!</span>
            </div>
            <button
              onClick={() => setSavedSuccess(false)}
              className="text-emerald-600 hover:text-emerald-900 text-xs underline"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-xs text-slate-700">
          
          {/* Status Alert Banner */}
          {!isEditing && (
            <div className="p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 border-slate-200">
              <div>
                <div className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                  <span>Status Verifikasi:</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      formData.status === 'Di Terima' || formData.status === 'Terverifikasi'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : formData.status === 'Ditolak'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : formData.status === 'Berkas Belum Lengkap'
                        ? 'bg-sky-100 text-sky-800 border border-sky-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {formData.status === 'Terverifikasi' ? 'Di Terima' : formData.status}
                  </span>
                </div>
                {formData.catatanVerifikasi && (
                  <p className="text-slate-600 text-xs mt-1 italic">
                    "{formData.catatanVerifikasi}"
                  </p>
                )}
              </div>

              {onOpenVerifikasi && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenVerifikasi(formData);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors shrink-0 text-center"
                >
                  Ubah Status Verifikasi
                </button>
              )}
            </div>
          )}

          {/* Section 1: Data Pribadi Siswa */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200">
              <User className="w-4 h-4 text-emerald-600" />
              <span>1. Identitas Calon Peserta Didik</span>
            </h4>

            {!isEditing ? (
              // READ-ONLY VIEW
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Nama Lengkap:</span>
                    <span className="font-bold text-slate-900">{formData.namaLengkap}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Tempat, Tanggal Lahir:</span>
                    <span className="font-medium text-slate-900">
                      {formData.tempatLahir}, {formData.tanggalLahir}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Jenis Kelamin:</span>
                    <span className="font-medium text-slate-900">{formData.jenisKelamin}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">NISN:</span>
                    <span className="font-mono font-medium text-slate-900">{formData.nisn}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">NIK Siswa:</span>
                    <span className="font-mono font-medium text-slate-900">{formData.nik}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">No. HP/WhatsApp:</span>
                    <a
                      href={`https://wa.me/${formData.noHpWa.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-emerald-600 hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{formData.noHpWa}</span>
                    </a>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Jalur Pendaftaran:</span>
                    <span className="font-bold text-emerald-700">{formData.jalur}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Tanggal Pendaftaran:</span>
                    <span className="font-medium text-slate-900">{formData.tanggalDaftar}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 mt-2">
                  <span className="text-slate-500 block mb-1 font-semibold">Alamat Tempat Tinggal:</span>
                  <p className="font-medium text-slate-800">
                    {formData.alamatSiswa}, RT/RW {formData.rtRw}, Kel. {formData.kelurahan}, Kec. {formData.kecamatan}, {formData.kabKota}, Prov. {formData.provinsi}
                  </p>
                </div>
              </>
            ) : (
              // EDITING FORM
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-amber-50/40 p-4 rounded-xl border border-amber-200">
                <div className="col-span-1 sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Siswa</label>
                  <input
                    type="text"
                    name="namaLengkap"
                    value={formData.namaLengkap}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-slate-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    name="tempatLahir"
                    value={formData.tempatLahir}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    name="tanggalLahir"
                    value={formData.tanggalLahir}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    name="jenisKelamin"
                    value={formData.jenisKelamin}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NISN</label>
                  <input
                    type="text"
                    name="nisn"
                    value={formData.nisn}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIK Siswa</label>
                  <input
                    type="text"
                    name="nik"
                    value={formData.nik}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. HP / WhatsApp Siswa</label>
                  <input
                    type="text"
                    name="noHpWa"
                    value={formData.noHpWa}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jalur Pendaftaran</label>
                  <select
                    name="jalur"
                    value={formData.jalur}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-bold text-emerald-800"
                  >
                    {jalurList.map((j) => (
                      <option key={j.id} value={j.namaJalur}>
                        {j.namaJalur}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-1 sm:col-span-2 space-y-2 pt-1 border-t border-amber-200">
                  <label className="block font-semibold text-slate-700">Alamat Tempat Tinggal</label>
                  <input
                    type="text"
                    name="alamatSiswa"
                    placeholder="Jalan / Kampung / Dusun"
                    value={formData.alamatSiswa}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <input
                      type="text"
                      name="rtRw"
                      placeholder="RT/RW (cth: 002/005)"
                      value={formData.rtRw}
                      onChange={handleInputChange}
                      className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                    />
                    <input
                      type="text"
                      name="kelurahan"
                      placeholder="Kelurahan / Desa"
                      value={formData.kelurahan}
                      onChange={handleInputChange}
                      className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                    />
                    <input
                      type="text"
                      name="kecamatan"
                      placeholder="Kecamatan"
                      value={formData.kecamatan}
                      onChange={handleInputChange}
                      className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                    />
                    <input
                      type="text"
                      name="kabKota"
                      placeholder="Kabupaten / Kota"
                      value={formData.kabKota}
                      onChange={handleInputChange}
                      className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                    />
                  </div>
                  <input
                    type="text"
                    name="provinsi"
                    placeholder="Provinsi"
                    value={formData.provinsi}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Sekolah Asal & Nilai */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200">
              <School className="w-4 h-4 text-emerald-600" />
              <span>2. Sekolah Asal & Akademik</span>
            </h4>

            {!isEditing ? (
              // READ-ONLY VIEW
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Nama Sekolah Asal:</span>
                    <span className="font-bold text-slate-900">{formData.sekolahAsal}</span>
                  </div>
                  {formData.npsnSekolahAsal && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">NPSN Sekolah Asal:</span>
                      <span className="font-mono font-medium text-slate-900">{formData.npsnSekolahAsal}</span>
                    </div>
                  )}
                  {formData.rataRapor && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Rata-rata Rapor (Kls 4-6):</span>
                      <span className="font-bold text-emerald-700 text-sm">{formData.rataRapor}</span>
                    </div>
                  )}
                  {formData.jumlahJuzTahfizh !== undefined && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Jumlah Hafalan Al-Qur'an:</span>
                      <span className="font-bold text-amber-700">{formData.jumlahJuzTahfizh} Juz</span>
                    </div>
                  )}
                </div>

                {formData.prestasiDetail && (
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-amber-900">
                    <span className="font-bold block mb-1">Rincian Prestasi / Keunggulan:</span>
                    <p>{formData.prestasiDetail}</p>
                  </div>
                )}
              </>
            ) : (
              // EDITING FORM
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-amber-50/40 p-4 rounded-xl border border-amber-200">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Sekolah Asal</label>
                  <input
                    type="text"
                    name="sekolahAsal"
                    value={formData.sekolahAsal}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NPSN Sekolah Asal</label>
                  <input
                    type="text"
                    name="npsnSekolahAsal"
                    value={formData.npsnSekolahAsal || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rata-rata Nilai Rapor</label>
                  <input
                    type="number"
                    step="0.01"
                    name="rataRapor"
                    value={formData.rataRapor || ''}
                    onChange={handleNumberInputChange}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hafalan Al-Qur'an (Jumlah Juz)</label>
                  <input
                    type="number"
                    name="jumlahJuzTahfizh"
                    value={formData.jumlahJuzTahfizh || ''}
                    onChange={handleNumberInputChange}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-bold"
                  />
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Rincian Prestasi Tambahan</label>
                  <textarea
                    name="prestasiDetail"
                    rows={2}
                    value={formData.prestasiDetail || ''}
                    onChange={handleInputChange}
                    placeholder="Sebutkan juara lomba / prestasi akademik/non-akademik..."
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Orang Tua / Wali */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>3. Data Orang Tua / Wali</span>
            </h4>

            {!isEditing ? (
              // READ-ONLY VIEW
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Nama Ayah:</span>
                  <span className="font-bold text-slate-900">{formData.namaAyah}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Pekerjaan Ayah:</span>
                  <span className="font-medium text-slate-900">{formData.pekerjaanAyah}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Nama Ibu:</span>
                  <span className="font-bold text-slate-900">{formData.namaIbu}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Pekerjaan Ibu:</span>
                  <span className="font-medium text-slate-900">{formData.pekerjaanIbu}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">No. Kontak Ortu:</span>
                  <span className="font-mono font-medium text-slate-900">{formData.noHpOrangTua}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Penghasilan Ortu:</span>
                  <span className="font-medium text-slate-900">{formData.penghasilanOrangTua}</span>
                </div>
              </div>
            ) : (
              // EDITING FORM
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-amber-50/40 p-4 rounded-xl border border-amber-200">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Ayah</label>
                  <input
                    type="text"
                    name="namaAyah"
                    value={formData.namaAyah}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pekerjaan Ayah</label>
                  <input
                    type="text"
                    name="pekerjaanAyah"
                    value={formData.pekerjaanAyah}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Ibu</label>
                  <input
                    type="text"
                    name="namaIbu"
                    value={formData.namaIbu}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pekerjaan Ibu</label>
                  <input
                    type="text"
                    name="pekerjaanIbu"
                    value={formData.pekerjaanIbu}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. Kontak Orang Tua</label>
                  <input
                    type="text"
                    name="noHpOrangTua"
                    value={formData.noHpOrangTua}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Penghasilan Orang Tua</label>
                  <input
                    type="text"
                    name="penghasilanOrangTua"
                    value={formData.penghasilanOrangTua}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Kelengkapan Berkas */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>4. Verifikasi Berkas Fisik / Upload</span>
            </h4>

            {!isEditing ? (
              // READ-ONLY VIEW
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className={`p-3 rounded-xl border flex items-center gap-2 ${formData.berkas.ijazahSkl ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                  {formData.berkas.ijazahSkl ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                  <span className="font-semibold">Ijazah / SKL</span>
                </div>

                <div className={`p-3 rounded-xl border flex items-center gap-2 ${formData.berkas.kartuKeluarga ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                  {formData.berkas.kartuKeluarga ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                  <span className="font-semibold">Kartu Keluarga</span>
                </div>

                <div className={`p-3 rounded-xl border flex items-center gap-2 ${formData.berkas.aktaLahir ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                  {formData.berkas.aktaLahir ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                  <span className="font-semibold">Akta Kelahiran</span>
                </div>

                <div className={`p-3 rounded-xl border flex items-center gap-2 ${formData.berkas.pasFoto ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                  {formData.berkas.pasFoto ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                  <span className="font-semibold">Pasfoto 3x4</span>
                </div>

                <div className={`p-3 rounded-xl border flex items-center gap-2 ${formData.berkas.sertifikatPrestasi ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                  {formData.berkas.sertifikatPrestasi ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />}
                  <span className="font-semibold">Sertifikat / Piagam</span>
                </div>

                <div className={`p-3 rounded-xl border flex items-center gap-2 ${formData.berkas.kipPkhKks ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                  {formData.berkas.kipPkhKks ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />}
                  <span className="font-semibold">KIP / PKH / KKS</span>
                </div>
              </div>
            ) : (
              // EDITING CHECKBOXES
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-amber-50/40 p-4 rounded-xl border border-amber-200">
                <label className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-emerald-50">
                  <input
                    type="checkbox"
                    checked={formData.berkas.ijazahSkl}
                    onChange={() => handleBerkasToggle('ijazahSkl')}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="font-semibold text-slate-800">Ijazah / SKL</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-emerald-50">
                  <input
                    type="checkbox"
                    checked={formData.berkas.kartuKeluarga}
                    onChange={() => handleBerkasToggle('kartuKeluarga')}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="font-semibold text-slate-800">Kartu Keluarga</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-emerald-50">
                  <input
                    type="checkbox"
                    checked={formData.berkas.aktaLahir}
                    onChange={() => handleBerkasToggle('aktaLahir')}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="font-semibold text-slate-800">Akta Kelahiran</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-emerald-50">
                  <input
                    type="checkbox"
                    checked={formData.berkas.pasFoto}
                    onChange={() => handleBerkasToggle('pasFoto')}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="font-semibold text-slate-800">Pasfoto 3x4</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-emerald-50">
                  <input
                    type="checkbox"
                    checked={!!formData.berkas.sertifikatPrestasi}
                    onChange={() => handleBerkasToggle('sertifikatPrestasi')}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="font-semibold text-slate-800">Sertifikat / Piagam</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-emerald-50">
                  <input
                    type="checkbox"
                    checked={!!formData.berkas.kipPkhKks}
                    onChange={() => handleBerkasToggle('kipPkhKks')}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="font-semibold text-slate-800">KIP / PKH / KKS</span>
                </label>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 rounded-b-2xl border-t border-slate-200 flex items-center justify-between">
          {!isEditing ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-colors text-xs"
              >
                Tutup Window
              </button>

              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-colors text-xs flex items-center gap-1.5 shadow-lg"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Data Pendaftar</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-colors text-xs flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Batal Edit</span>
              </button>

              <button
                onClick={handleSave}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors text-xs flex items-center gap-2 shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Data</span>
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
