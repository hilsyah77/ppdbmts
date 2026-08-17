import React, { useState, useEffect } from 'react';
import {
  Pendaftar,
  JalurPPDB,
  JenisKelamin,
  OPSI_STATUS_ORANG_TUA,
  OPSI_PENDIDIKAN_ORANG_TUA,
  OPSI_PEKERJAAN_ORANG_TUA
} from '../types';
import {
  X,
  User,
  Phone,
  School,
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Users,
  Edit3,
  Save,
  RotateCcw,
  Check,
  Printer
} from 'lucide-react';

interface ModalDetailProps {
  pendaftar: Pendaftar | null;
  jalurList?: JalurPPDB[];
  onClose: () => void;
  onSavePendaftar?: (updatedPendaftar: Pendaftar) => void;
  onOpenVerifikasi?: (pendaftar: Pendaftar) => void;
  onOpenCetak?: (pendaftar: Pendaftar) => void;
  onOpenCetakDaftarUlang?: (pendaftar: Pendaftar) => void;
}

export const ModalDetailPendaftar: React.FC<ModalDetailProps> = ({
  pendaftar,
  jalurList = [],
  onClose,
  onSavePendaftar,
  onOpenVerifikasi,
  onOpenCetak,
  onOpenCetakDaftarUlang
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Pendaftar | null>(pendaftar);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: boolean }>({});
  const [missingFieldsList, setMissingFieldsList] = useState<string[]>([]);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  useEffect(() => {
    setFormData(pendaftar);
    setIsEditing(false);
    setSavedSuccess(false);
    setValidationErrors({});
    setMissingFieldsList([]);
    setShowErrorAlert(false);
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
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
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
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
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

  const handlePraSekolahToggle = (key: 'pernahTkRa' | 'pernahPaud') => {
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        praSekolah: {
          ...(prev.praSekolah || {}),
          [key]: !prev.praSekolah?.[key]
        }
      };
    });
  };

  const handleImunisasiToggle = (key: 'hepatitisB' | 'bcg' | 'dpt' | 'polio' | 'campak' | 'covid') => {
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        imunisasi: {
          ...(prev.imunisasi || {}),
          [key]: !prev.imunisasi?.[key]
        }
      };
    });
  };

  const handleSave = () => {
    if (!formData) return;

    const errors: { [key: string]: boolean } = {};
    const missing: string[] = [];

    // 1. Identitas Calon Siswa
    if (!formData.namaLengkap?.trim()) {
      errors.namaLengkap = true;
      missing.push('Nama Lengkap Siswa');
    }
    if (!formData.tempatLahir?.trim()) {
      errors.tempatLahir = true;
      missing.push('Tempat Lahir');
    }
    if (!formData.tanggalLahir?.trim()) {
      errors.tanggalLahir = true;
      missing.push('Tanggal Lahir');
    }
    if (!formData.jenisKelamin) {
      errors.jenisKelamin = true;
      missing.push('Jenis Kelamin');
    }
    if (!formData.nisn?.trim()) {
      errors.nisn = true;
      missing.push('NISN');
    }
    if (!formData.nik?.trim()) {
      errors.nik = true;
      missing.push('NIK Siswa');
    }
    if (formData.jumlahSaudara === undefined || formData.jumlahSaudara === null || String(formData.jumlahSaudara).trim() === '') {
      errors.jumlahSaudara = true;
      missing.push('Jumlah Saudara');
    }
    if (formData.anakKe === undefined || formData.anakKe === null || String(formData.anakKe).trim() === '') {
      errors.anakKe = true;
      missing.push('Anak Ke-');
    }
    if (!formData.pembiayaSekolah?.trim()) {
      errors.pembiayaSekolah = true;
      missing.push('Yang Membiayai Sekolah');
    }
    if (!formData.noKk?.trim()) {
      errors.noKk = true;
      missing.push('Nomor Kartu Keluarga (No. KK)');
    }
    if (!formData.noHpWa?.trim()) {
      errors.noHpWa = true;
      missing.push('No. HP / WhatsApp Siswa');
    }
    if (!formData.alamatSiswa?.trim()) {
      errors.alamatSiswa = true;
      missing.push('Alamat Tempat Tinggal');
    }

    // 2. Sekolah Asal
    if (!formData.sekolahAsal?.trim()) {
      errors.sekolahAsal = true;
      missing.push('Nama Sekolah Asal');
    }
    if (!formData.npsnSekolahAsal?.trim()) {
      errors.npsnSekolahAsal = true;
      missing.push('NPSN Sekolah Asal');
    }

    // 3. Data Ayah
    if (!formData.statusAyah?.trim()) {
      errors.statusAyah = true;
      missing.push('Status Ayah');
    }
    if (!formData.namaAyah?.trim()) {
      errors.namaAyah = true;
      missing.push('Nama Ayah');
    }
    if (!formData.nikAyah?.trim()) {
      errors.nikAyah = true;
      missing.push('NIK Ayah (16 Digit)');
    }
    if (!formData.tempatLahirAyah?.trim()) {
      errors.tempatLahirAyah = true;
      missing.push('Tempat Lahir (Ayah)');
    }
    if (!formData.tanggalLahirAyah?.trim()) {
      errors.tanggalLahirAyah = true;
      missing.push('Tgl Lahir (yyyy-mm-dd) (Ayah)');
    }
    if (!formData.pendidikanAyah?.trim()) {
      errors.pendidikanAyah = true;
      missing.push('Pendidikan (Ayah)');
    }
    if (!formData.pekerjaanAyah?.trim()) {
      errors.pekerjaanAyah = true;
      missing.push('Pekerjaan (Ayah)');
    }

    // 4. Data Ibu
    if (!formData.statusIbu?.trim()) {
      errors.statusIbu = true;
      missing.push('Status Ibu');
    }
    if (!formData.namaIbu?.trim()) {
      errors.namaIbu = true;
      missing.push('Nama Ibu');
    }
    if (!formData.nikIbu?.trim()) {
      errors.nikIbu = true;
      missing.push('NIK Ibu (16 Digit)');
    }
    if (!formData.tempatLahirIbu?.trim()) {
      errors.tempatLahirIbu = true;
      missing.push('Tempat Lahir (Ibu)');
    }
    if (!formData.tanggalLahirIbu?.trim()) {
      errors.tanggalLahirIbu = true;
      missing.push('Tgl Lahir (yyyy-mm-dd) (Ibu)');
    }
    if (!formData.pendidikanIbu?.trim()) {
      errors.pendidikanIbu = true;
      missing.push('Pendidikan (Ibu)');
    }
    if (!formData.pekerjaanIbu?.trim()) {
      errors.pekerjaanIbu = true;
      missing.push('Pekerjaan (Ibu)');
    }

    if (missing.length > 0) {
      setValidationErrors(errors);
      setMissingFieldsList(missing);
      setShowErrorAlert(true);
      return;
    }

    setValidationErrors({});
    setMissingFieldsList([]);
    setShowErrorAlert(false);

    if (onSavePendaftar) {
      onSavePendaftar(formData);
      setIsEditing(false);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
      }, 3500);
    }
  };

  const handleCancel = () => {
    setFormData(pendaftar);
    setIsEditing(false);
    setValidationErrors({});
    setMissingFieldsList([]);
    setShowErrorAlert(false);
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

          <div className="flex items-center gap-2 flex-wrap">
            {!isEditing && (
              <>
                {onOpenCetak && (
                  <button
                    onClick={() => onOpenCetak(formData)}
                    className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                    title="Cetak Formulir Pendaftaran (Biodata)"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak Formulir</span>
                  </button>
                )}

                {onOpenCetakDaftarUlang && (
                  <button
                    onClick={() => onOpenCetakDaftarUlang(formData)}
                    className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                    title="Cetak Formulir Daftar Ulang & Rincian Biaya PPDB"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Cetak Daftar Ulang & Rincian</span>
                  </button>
                )}
              </>
            )}

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
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 flex items-center justify-between text-emerald-800 text-xs font-bold animate-fadeIn">
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

        {/* Error Alert Box when required fields are missing */}
        {showErrorAlert && (
          <div className="bg-rose-50 border-b border-rose-200 px-6 py-4 text-rose-900 text-xs animate-fadeIn">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm text-rose-800">
                    Gagal Menyimpan Data! Terdapat Kolom Wajib yang Belum Terisi
                  </div>
                  <p className="text-rose-700 mt-1">
                    Semua kolom yang bertanda bintang (<span className="text-rose-600 font-bold">*</span>) wajib diisi agar perubahan data pendaftar dapat disimpan ke dalam sistem. Silakan lengkapi kolom berikut:
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {missingFieldsList.map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-0.5 rounded-md bg-rose-100 border border-rose-300 text-rose-800 text-[11px] font-semibold"
                      >
                        • {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowErrorAlert(false)}
                className="text-rose-500 hover:text-rose-800 font-bold text-xs p-1"
                title="Tutup Pesan"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-xs text-slate-700">
          
          {/* Mode Edit Notice */}
          {isEditing && (
            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-300 flex items-center justify-between text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Mode Edit Data Aktif:</strong> Kolom dengan tanda bintang (<span className="text-rose-600 font-bold">*</span>) wajib diisi agar data berhasil disimpan.
                </span>
              </div>
            </div>
          )}

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
                    <span className="text-slate-500">Jumlah Saudara:</span>
                    <span className="font-medium text-slate-900">{formData.jumlahSaudara !== undefined ? `${formData.jumlahSaudara} bersaudara` : '-'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Anak Ke-:</span>
                    <span className="font-medium text-slate-900">{formData.anakKe !== undefined ? `Anak Ke-${formData.anakKe}` : '-'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Yang Membiayai Sekolah:</span>
                    <span className="font-bold text-slate-900">{formData.pembiayaSekolah || 'Orang Tua'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">No. Kartu Keluarga (KK):</span>
                    <span className="font-mono font-medium text-slate-900">{formData.noKk || '-'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Nama Kepala Keluarga:</span>
                    <span className="font-bold text-slate-900">{formData.namaKepalaKeluarga || '-'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Nomor KIP:</span>
                    <span className="font-mono font-bold text-amber-700">{formData.noKip || '-'}</span>
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

                {/* Badges Pra Sekolah & Imunisasi */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-200">
                    <span className="text-xs font-bold text-emerald-900 block mb-1.5">Riwayat Pra Sekolah:</span>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 ${formData.praSekolah?.pernahTkRa ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                        {formData.praSekolah?.pernahTkRa ? '✓ Pernah TK/RA' : '✗ Belum TK/RA'}
                      </span>
                      <span className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 ${formData.praSekolah?.pernahPaud ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                        {formData.praSekolah?.pernahPaud ? '✓ Pernah PAUD' : '✗ Belum PAUD'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-blue-50/60 p-2.5 rounded-xl border border-blue-200">
                    <span className="text-xs font-bold text-blue-900 block mb-1.5">Riwayat Imunisasi Calon Siswa:</span>
                    <div className="flex flex-wrap gap-1.5 text-[11px]">
                      {[
                        { key: 'hepatitisB', label: 'Hepatitis B' },
                        { key: 'bcg', label: 'BCG' },
                        { key: 'dpt', label: 'DPT' },
                        { key: 'polio', label: 'Polio' },
                        { key: 'campak', label: 'Campak' },
                        { key: 'covid', label: 'Covid' },
                      ].map((item) => {
                        const isGiven = !!formData.imunisasi?.[item.key as keyof NonNullable<Pendaftar['imunisasi']>];
                        return (
                          <span
                            key={item.key}
                            className={`px-2 py-0.5 rounded-md font-medium ${isGiven ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}
                          >
                            {isGiven ? `✓ ${item.label}` : item.label}
                          </span>
                        );
                      })}
                    </div>
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
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Lengkap Siswa <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    name="namaLengkap"
                    value={formData.namaLengkap}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-1.5 border rounded-lg focus:outline-none font-bold text-slate-900 bg-white ${
                      validationErrors.namaLengkap
                        ? 'border-rose-500 ring-2 ring-rose-300'
                        : 'border-slate-300 focus:ring-2 focus:ring-emerald-500'
                    }`}
                  />
                  {validationErrors.namaLengkap && (
                    <span className="text-[11px] text-rose-600 font-semibold block mt-1">Wajib diisi *</span>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tempat Lahir <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    name="tempatLahir"
                    value={formData.tempatLahir}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-1.5 border rounded-lg focus:outline-none bg-white ${
                      validationErrors.tempatLahir
                        ? 'border-rose-500 ring-2 ring-rose-300'
                        : 'border-slate-300 focus:ring-2 focus:ring-emerald-500'
                    }`}
                  />
                  {validationErrors.tempatLahir && (
                    <span className="text-[11px] text-rose-600 font-semibold block mt-1">Wajib diisi *</span>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tanggal Lahir <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input
                    type="date"
                    name="tanggalLahir"
                    value={formData.tanggalLahir}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-1.5 border rounded-lg focus:outline-none bg-white ${
                      validationErrors.tanggalLahir
                        ? 'border-rose-500 ring-2 ring-rose-300'
                        : 'border-slate-300 focus:ring-2 focus:ring-emerald-500'
                    }`}
                  />
                  {validationErrors.tanggalLahir && (
                    <span className="text-[11px] text-rose-600 font-semibold block mt-1">Wajib diisi *</span>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Jenis Kelamin <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <select
                    name="jenisKelamin"
                    value={formData.jenisKelamin}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-1.5 border rounded-lg focus:outline-none bg-white font-medium ${
                      validationErrors.jenisKelamin
                        ? 'border-rose-500 ring-2 ring-rose-300'
                        : 'border-slate-300 focus:ring-2 focus:ring-emerald-500'
                    }`}
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                  {validationErrors.jenisKelamin && (
                    <span className="text-[11px] text-rose-600 font-semibold block mt-1">Wajib diisi *</span>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    NISN <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    name="nisn"
                    value={formData.nisn}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-1.5 border rounded-lg focus:outline-none font-mono bg-white ${
                      validationErrors.nisn
                        ? 'border-rose-500 ring-2 ring-rose-300'
                        : 'border-slate-300 focus:ring-2 focus:ring-emerald-500'
                    }`}
                  />
                  {validationErrors.nisn && (
                    <span className="text-[11px] text-rose-600 font-semibold block mt-1">Wajib diisi *</span>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    NIK Siswa <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    name="nik"
                    value={formData.nik}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-1.5 border rounded-lg focus:outline-none font-mono bg-white ${
                      validationErrors.nik
                        ? 'border-rose-500 ring-2 ring-rose-300'
                        : 'border-slate-300 focus:ring-2 focus:ring-emerald-500'
                    }`}
                  />
                  {validationErrors.nik && (
                    <span className="text-[11px] text-rose-600 font-semibold block mt-1">Wajib diisi *</span>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Jumlah Saudara <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input
                    type="number"
                    name="jumlahSaudara"
                    min={0}
                    value={formData.jumlahSaudara ?? ''}
                    onChange={handleNumberInputChange}
                    placeholder="2"
                    className={`w-full px-3 py-1.5 border rounded-lg focus:outline-none bg-white font-medium ${
                      validationErrors.jumlahSaudara
                        ? 'border-rose-500 ring-2 ring-rose-300'
                        : 'border-slate-300 focus:ring-2 focus:ring-emerald-500'
                    }`}
                  />
                  {validationErrors.jumlahSaudara && (
                    <span className="text-[11px] text-rose-600 font-semibold block mt-1">Wajib diisi *</span>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Anak Ke- <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input
                    type="number"
                    name="anakKe"
                    min={1}
                    value={formData.anakKe ?? ''}
                    onChange={handleNumberInputChange}
                    placeholder="1"
                    className={`w-full px-3 py-1.5 border rounded-lg focus:outline-none bg-white font-medium ${
                      validationErrors.anakKe
                        ? 'border-rose-500 ring-2 ring-rose-300'
                        : 'border-slate-300 focus:ring-2 focus:ring-emerald-500'
                    }`}
                  />
                  {validationErrors.anakKe && (
                    <span className="text-[11px] text-rose-600 font-semibold block mt-1">Wajib diisi *</span>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Yang Membiayai Sekolah <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <select
                    name="pembiayaSekolah"
                    value={formData.pembiayaSekolah || 'Orang Tua'}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-1.5 border rounded-lg focus:outline-none bg-white font-medium ${
                      validationErrors.pembiayaSekolah
                        ? 'border-rose-500 ring-2 ring-rose-300'
                        : 'border-slate-300 focus:ring-2 focus:ring-emerald-500'
                    }`}
                  >
                    <option value="Orang Tua">Orang Tua</option>
                    <option value="Wali / Orang Tua Asuh">Wali / Orang Tua Asuh</option>
                    <option value="Tanggungan Sendiri">Tanggungan Sendiri</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                  {validationErrors.pembiayaSekolah && (
                    <span className="text-[11px] text-rose-600 font-semibold block mt-1">Wajib diisi *</span>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nomor Kartu Keluarga (No. KK) <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    name="noKk"
                    value={formData.noKk || ''}
                    onChange={handleInputChange}
                    placeholder="3174010000000001"
                    className={`w-full px-3 py-1.5 border rounded-lg focus:outline-none font-mono bg-white ${
                      validationErrors.noKk
                        ? 'border-rose-500 ring-2 ring-rose-300'
                        : 'border-slate-300 focus:ring-2 focus:ring-emerald-500'
                    }`}
                  />
                  {validationErrors.noKk && (
                    <span className="text-[11px] text-rose-600 font-semibold block mt-1">Wajib diisi *</span>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Kepala Keluarga</label>
                  <input
                    type="text"
                    name="namaKepalaKeluarga"
                    value={formData.namaKepalaKeluarga || ''}
                    onChange={handleInputChange}
                    placeholder="Sesuai Kartu Keluarga"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor KIP (Jika Ada)</label>
                  <input
                    type="text"
                    name="noKip"
                    value={formData.noKip || ''}
                    onChange={handleInputChange}
                    placeholder="Contoh: KIP-3174-2025-XXXX"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono bg-white"
                  />
                </div>

                {/* Edit Riwayat Pra Sekolah */}
                <div className="col-span-1 sm:col-span-2 bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
                  <label className="block text-xs font-bold text-emerald-900 mb-2">Riwayat Pendidikan Pra Sekolah:</label>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-emerald-300 text-xs font-medium hover:bg-emerald-50">
                      <input
                        type="checkbox"
                        checked={!!formData.praSekolah?.pernahTkRa}
                        onChange={() => handlePraSekolahToggle('pernahTkRa')}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Pernah TK / RA</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-emerald-300 text-xs font-medium hover:bg-emerald-50">
                      <input
                        type="checkbox"
                        checked={!!formData.praSekolah?.pernahPaud}
                        onChange={() => handlePraSekolahToggle('pernahPaud')}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Pernah PAUD</span>
                    </label>
                  </div>
                </div>

                {/* Edit Riwayat Imunisasi */}
                <div className="col-span-1 sm:col-span-2 bg-blue-50/70 p-3 rounded-xl border border-blue-200">
                  <label className="block text-xs font-bold text-blue-900 mb-2">Riwayat Imunisasi Calon Siswa:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    {[
                      { key: 'hepatitisB', label: 'Hepatitis B' },
                      { key: 'bcg', label: 'BCG' },
                      { key: 'dpt', label: 'DPT' },
                      { key: 'polio', label: 'Polio' },
                      { key: 'campak', label: 'Campak' },
                      { key: 'covid', label: 'Covid' },
                    ].map((item) => (
                      <label key={item.key} className="flex items-center gap-2 cursor-pointer bg-white px-2.5 py-1.5 rounded-lg border border-blue-300 text-xs font-medium hover:bg-blue-50">
                        <input
                          type="checkbox"
                          checked={!!formData.imunisasi?.[item.key as keyof NonNullable<Pendaftar['imunisasi']>]}
                          onChange={() => handleImunisasiToggle(item.key as keyof NonNullable<Pendaftar['imunisasi']>)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    No. HP / WhatsApp Siswa <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    name="noHpWa"
                    value={formData.noHpWa}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-1.5 border rounded-lg focus:outline-none font-mono bg-white ${
                      validationErrors.noHpWa
                        ? 'border-rose-500 ring-2 ring-rose-300'
                        : 'border-slate-300 focus:ring-2 focus:ring-emerald-500'
                    }`}
                  />
                  {validationErrors.noHpWa && (
                    <span className="text-[11px] text-rose-600 font-semibold block mt-1">Wajib diisi *</span>
                  )}
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
                  <label className="block font-semibold text-slate-700">
                    Alamat Tempat Tinggal <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    name="alamatSiswa"
                    placeholder="Jalan / Kampung / Dusun"
                    value={formData.alamatSiswa}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-1.5 border rounded-lg focus:outline-none bg-white ${
                      validationErrors.alamatSiswa
                        ? 'border-rose-500 ring-2 ring-rose-300'
                        : 'border-slate-300 focus:ring-2 focus:ring-emerald-500'
                    }`}
                  />
                  {validationErrors.alamatSiswa && (
                    <span className="text-[11px] text-rose-600 font-semibold block mt-1">Wajib diisi *</span>
                  )}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Nama Sekolah Asal:</span>
                  <span className="font-bold text-slate-900">{formData.sekolahAsal}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">NPSN Sekolah Asal:</span>
                  <span className="font-mono font-bold text-slate-900">{formData.npsnSekolahAsal || '-'}</span>
                </div>
              </div>
            ) : (
              // EDITING FORM
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-amber-50/40 p-4 rounded-xl border border-amber-200">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Sekolah Asal <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    name="sekolahAsal"
                    value={formData.sekolahAsal}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-1.5 border rounded-lg focus:outline-none font-medium bg-white ${
                      validationErrors.sekolahAsal
                        ? 'border-rose-500 ring-2 ring-rose-300'
                        : 'border-slate-300 focus:ring-2 focus:ring-emerald-500'
                    }`}
                  />
                  {validationErrors.sekolahAsal && (
                    <span className="text-[11px] text-rose-600 font-semibold block mt-1">Wajib diisi *</span>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    NPSN Sekolah Asal <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    name="npsnSekolahAsal"
                    value={formData.npsnSekolahAsal || ''}
                    onChange={handleInputChange}
                    placeholder="Contoh: 20108374 (8 Digit)"
                    className={`w-full px-3 py-1.5 border rounded-lg focus:outline-none font-mono bg-white ${
                      validationErrors.npsnSekolahAsal
                        ? 'border-rose-500 ring-2 ring-rose-300'
                        : 'border-slate-300 focus:ring-2 focus:ring-emerald-500'
                    }`}
                  />
                  {validationErrors.npsnSekolahAsal && (
                    <span className="text-[11px] text-rose-600 font-semibold block mt-1">Wajib diisi *</span>
                  )}
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
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card Data Ayah */}
                  <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                    <div className="font-bold text-slate-900 border-b border-slate-200 pb-1 flex justify-between items-center">
                      <span>Data Ayah Kandung / Wali</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        formData.statusAyah === 'Masih Hidup'
                          ? 'bg-emerald-100 text-emerald-800'
                          : formData.statusAyah === 'Sudah Meninggal'
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {formData.statusAyah || 'Masih Hidup'}
                      </span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-100">
                      <span className="text-slate-500">Nama Lengkap:</span>
                      <span className="font-bold text-slate-900">{formData.namaAyah}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-100">
                      <span className="text-slate-500">NIK Ayah:</span>
                      <span className="font-mono font-bold text-slate-900">{formData.nikAyah || '-'}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-100">
                      <span className="text-slate-500">Tempat, Tgl Lahir:</span>
                      <span className="font-medium text-slate-900">
                        {formData.tempatLahirAyah || '-'}{formData.tanggalLahirAyah ? `, ${formData.tanggalLahirAyah}` : ''}
                      </span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-100">
                      <span className="text-slate-500">Pendidikan:</span>
                      <span className="font-medium text-slate-900">{formData.pendidikanAyah || '-'}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-500">Pekerjaan:</span>
                      <span className="font-medium text-slate-900">{formData.pekerjaanAyah}</span>
                    </div>
                  </div>

                  {/* Card Data Ibu */}
                  <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                    <div className="font-bold text-slate-900 border-b border-slate-200 pb-1 flex justify-between items-center">
                      <span>Data Ibu Kandung</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        formData.statusIbu === 'Masih Hidup'
                          ? 'bg-emerald-100 text-emerald-800'
                          : formData.statusIbu === 'Sudah Meninggal'
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {formData.statusIbu || 'Masih Hidup'}
                      </span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-100">
                      <span className="text-slate-500">Nama Lengkap:</span>
                      <span className="font-bold text-slate-900">{formData.namaIbu}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-100">
                      <span className="text-slate-500">NIK Ibu:</span>
                      <span className="font-mono font-bold text-slate-900">{formData.nikIbu || '-'}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-100">
                      <span className="text-slate-500">Tempat, Tgl Lahir:</span>
                      <span className="font-medium text-slate-900">
                        {formData.tempatLahirIbu || '-'}{formData.tanggalLahirIbu ? `, ${formData.tanggalLahirIbu}` : ''}
                      </span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-100">
                      <span className="text-slate-500">Pendidikan:</span>
                      <span className="font-medium text-slate-900">{formData.pendidikanIbu || '-'}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-500">Pekerjaan:</span>
                      <span className="font-medium text-slate-900">{formData.pekerjaanIbu}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // EDITING FORM
              <div className="space-y-4 bg-amber-50/40 p-4 rounded-xl border border-amber-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Edit Ayah */}
                  <div className="p-3 bg-white rounded-lg border border-amber-200 space-y-2.5">
                    <div className="font-bold text-xs text-amber-900 border-b border-amber-100 pb-1">
                      Data Ayah Kandung / Wali
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Status Ayah <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <select
                        name="statusAyah"
                        value={formData.statusAyah || 'Masih Hidup'}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-1.5 border rounded-lg focus:outline-none bg-white font-medium ${
                          validationErrors.statusAyah
                            ? 'border-rose-500 ring-2 ring-rose-300'
                            : 'border-slate-300 focus:ring-2 focus:ring-emerald-500'
                        }`}
                      >
                        {OPSI_STATUS_ORANG_TUA.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {validationErrors.statusAyah && (
                        <span className="text-[11px] text-rose-600 font-semibold block mt-1">Wajib diisi *</span>
                      )}
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Nama Ayah <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        name="namaAyah"
                        value={formData.namaAyah}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-1.5 border rounded-lg focus:outline-none font-bold bg-white ${
                          validationErrors.namaAyah
                            ? 'border-rose-500 ring-2 ring-rose-300'
                            : 'border-slate-300 focus:ring-2 focus:ring-emerald-500'
                        }`}
                      />
                      {validationErrors.namaAyah && (
                        <span className="text-[11px] text-rose-600 font-semibold block mt-1">Wajib diisi *</span>
                      )}
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        NIK Ayah (16 Digit) <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        name="nikAyah"
                        value={formData.nikAyah || ''}
                        onChange={handleInputChange}
                        placeholder="Contoh: 3174010000000001"
                        className={`w-full px-3 py-1.5 border rounded-lg focus:outline-none font-mono bg-white ${
                          validationErrors.nikAyah
                            ? 'border-rose-500 ring-2 ring-rose-300'
                            : 'border-slate-300 focus:ring-2 focus:ring-emerald-500'
                        }`}
                      />
                      {validationErrors.nikAyah && (
                        <span className="text-[11px] text-rose-600 font-semibold block mt-1">Wajib diisi *</span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Tempat Lahir <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          name="tempatLahirAyah"
                          value={formData.tempatLahirAyah || ''}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-1.5 border rounded-lg focus:outline-none bg-white ${
                            validationErrors.tempatLahirAyah
                              ? 'border-rose-500 ring-2 ring-rose-300'
                              : 'border-slate-300 focus:ring-2 focus:ring-emerald-500'
                          }`}
                        />
                        {validationErrors.tempatLahirAyah && (
                          <span className="text-[11px] text-rose-600 font-semibold block mt-1">Wajib diisi *</span>
                        )}
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Tgl Lahir (yyyy-mm-dd) <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                          type="date"
                          name="tanggalLahirAyah"
                          value={formData.tanggalLahirAyah || ''}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-1.5 border rounded-lg focus:outline-none font-mono bg-white ${
                            validationErrors.tanggalLahirAyah
                              ? 'border-rose-500 ring-2 ring-rose-300'
                              : 'border-slate-300 focus:ring-2 focus:ring-emerald-500'
                          }`}
                        />
                        {validationErrors.tanggalLahirAyah && (
                          <span className="text-[11px] text-rose-600 font-semibold block mt-1">Wajib diisi *</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Pendidikan <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <select
                          name="pendidikanAyah"
                          value={formData.pendidikanAyah || 'SMA/Sederajat'}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-1.5 border rounded-lg focus:outline-none bg-white ${
                            validationErrors.pendidikanAyah
                              ? 'border-rose-500 ring-2 ring-rose-300'
                              : 'border-slate-300 focus:ring-2 focus:ring-emerald-500'
                          }`}
                        >
                          {OPSI_PENDIDIKAN_ORANG_TUA.map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                        {validationErrors.pendidikanAyah && (
                          <span className="text-[11px] text-rose-600 font-semibold block mt-1">Wajib diisi *</span>
                        )}
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Pekerjaan <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <select
                          name="pekerjaanAyah"
                          value={formData.pekerjaanAyah || 'Wiraswasta'}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-1.5 border rounded-lg focus:outline-none bg-white ${
                            validationErrors.pekerjaanAyah
                              ? 'border-rose-500 ring-2 ring-rose-300'
                              : 'border-slate-300 focus:ring-2 focus:ring-emerald-500'
                          }`}
                        >
                          {OPSI_PEKERJAAN_ORANG_TUA.map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                        {validationErrors.pekerjaanAyah && (
                          <span className="text-[11px] text-rose-600 font-semibold block mt-1">Wajib diisi *</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Edit Ibu */}
                  <div className="p-3 bg-white rounded-lg border border-amber-200 space-y-2.5">
                    <div className="font-bold text-xs text-amber-900 border-b border-amber-100 pb-1">
                      Data Ibu Kandung
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Status Ibu <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <select
                        name="statusIbu"
                        value={formData.statusIbu || 'Masih Hidup'}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-1.5 border rounded-lg focus:outline-none bg-white font-medium ${
                          validationErrors.statusIbu
                            ? 'border-rose-500 ring-2 ring-rose-300'
                            : 'border-slate-300 focus:ring-2 focus:ring-emerald-500'
                        }`}
                      >
                        {OPSI_STATUS_ORANG_TUA.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {validationErrors.statusIbu && (
                        <span className="text-[11px] text-rose-600 font-semibold block mt-1">Wajib diisi *</span>
                      )}
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Nama Ibu <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        name="namaIbu"
                        value={formData.namaIbu}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-1.5 border rounded-lg focus:outline-none font-bold bg-white ${
                          validationErrors.namaIbu
                            ? 'border-rose-500 ring-2 ring-rose-300'
                            : 'border-slate-300 focus:ring-2 focus:ring-emerald-500'
                        }`}
                      />
                      {validationErrors.namaIbu && (
                        <span className="text-[11px] text-rose-600 font-semibold block mt-1">Wajib diisi *</span>
                      )}
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        NIK Ibu (16 Digit) <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        name="nikIbu"
                        value={formData.nikIbu || ''}
                        onChange={handleInputChange}
                        placeholder="Contoh: 3174010000000002"
                        className={`w-full px-3 py-1.5 border rounded-lg focus:outline-none font-mono bg-white ${
                          validationErrors.nikIbu
                            ? 'border-rose-500 ring-2 ring-rose-300'
                            : 'border-slate-300 focus:ring-2 focus:ring-emerald-500'
                        }`}
                      />
                      {validationErrors.nikIbu && (
                        <span className="text-[11px] text-rose-600 font-semibold block mt-1">Wajib diisi *</span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Tempat Lahir <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          name="tempatLahirIbu"
                          value={formData.tempatLahirIbu || ''}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-1.5 border rounded-lg focus:outline-none bg-white ${
                            validationErrors.tempatLahirIbu
                              ? 'border-rose-500 ring-2 ring-rose-300'
                              : 'border-slate-300 focus:ring-2 focus:ring-emerald-500'
                          }`}
                        />
                        {validationErrors.tempatLahirIbu && (
                          <span className="text-[11px] text-rose-600 font-semibold block mt-1">Wajib diisi *</span>
                        )}
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Tgl Lahir (yyyy-mm-dd) <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                          type="date"
                          name="tanggalLahirIbu"
                          value={formData.tanggalLahirIbu || ''}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-1.5 border rounded-lg focus:outline-none font-mono bg-white ${
                            validationErrors.tanggalLahirIbu
                              ? 'border-rose-500 ring-2 ring-rose-300'
                              : 'border-slate-300 focus:ring-2 focus:ring-emerald-500'
                          }`}
                        />
                        {validationErrors.tanggalLahirIbu && (
                          <span className="text-[11px] text-rose-600 font-semibold block mt-1">Wajib diisi *</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Pendidikan <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <select
                          name="pendidikanIbu"
                          value={formData.pendidikanIbu || 'SMA/Sederajat'}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-1.5 border rounded-lg focus:outline-none bg-white ${
                            validationErrors.pendidikanIbu
                              ? 'border-rose-500 ring-2 ring-rose-300'
                              : 'border-slate-300 focus:ring-2 focus:ring-emerald-500'
                          }`}
                        >
                          {OPSI_PENDIDIKAN_ORANG_TUA.map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                        {validationErrors.pendidikanIbu && (
                          <span className="text-[11px] text-rose-600 font-semibold block mt-1">Wajib diisi *</span>
                        )}
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Pekerjaan <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <select
                          name="pekerjaanIbu"
                          value={formData.pekerjaanIbu || 'Tidak Bekerja'}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-1.5 border rounded-lg focus:outline-none bg-white ${
                            validationErrors.pekerjaanIbu
                              ? 'border-rose-500 ring-2 ring-rose-300'
                              : 'border-slate-300 focus:ring-2 focus:ring-emerald-500'
                          }`}
                        >
                          {OPSI_PEKERJAAN_ORANG_TUA.map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                        {validationErrors.pekerjaanIbu && (
                          <span className="text-[11px] text-rose-600 font-semibold block mt-1">Wajib diisi *</span>
                        )}
                      </div>
                    </div>
                  </div>
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
