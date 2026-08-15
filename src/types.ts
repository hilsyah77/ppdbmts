export type StatusPendaftar = 'Di Terima' | 'Belum Diverifikasi' | 'Ditolak' | 'Berkas Belum Lengkap';

export type JenisKelamin = 'Laki-laki' | 'Perempuan';

export type StatusOrangTua = 'Masih Hidup' | 'Sudah Meninggal' | 'Tidak Diketahui';

export type PendidikanOrangTua =
  | 'SD/Sederajat'
  | 'SMP/Sederajat'
  | 'SMA/Sederajat'
  | 'D1'
  | 'D2'
  | 'D3'
  | 'D4/S1'
  | 'S2'
  | 'S3';

export type PekerjaanOrangTua =
  | 'Tidak Bekerja'
  | 'Pensiunan'
  | 'PNS'
  | 'TNI/Polisi'
  | 'Guru/Dosen'
  | 'Pegawai Swasta'
  | 'Wiraswasta'
  | 'Pengacara/Hakim/Notaris'
  | 'Seniman/Pelukis/Artis/Sejenis'
  | 'Dokter/Bidan/Perawat'
  | 'Pilot/Pramugara'
  | 'Pedagang'
  | 'Petani/Peternak'
  | 'Nelayan'
  | 'Buruh (Tani/Pabrik/Bangunan)'
  | 'Sopir/Masinis/Kondektur'
  | 'Politikus'
  | 'Lainnya';

export const OPSI_STATUS_ORANG_TUA: StatusOrangTua[] = [
  'Masih Hidup',
  'Sudah Meninggal',
  'Tidak Diketahui'
];

export const OPSI_PENDIDIKAN_ORANG_TUA: PendidikanOrangTua[] = [
  'SD/Sederajat',
  'SMP/Sederajat',
  'SMA/Sederajat',
  'D1',
  'D2',
  'D3',
  'D4/S1',
  'S2',
  'S3'
];

export const OPSI_PEKERJAAN_ORANG_TUA: PekerjaanOrangTua[] = [
  'Tidak Bekerja',
  'Pensiunan',
  'PNS',
  'TNI/Polisi',
  'Guru/Dosen',
  'Pegawai Swasta',
  'Wiraswasta',
  'Pengacara/Hakim/Notaris',
  'Seniman/Pelukis/Artis/Sejenis',
  'Dokter/Bidan/Perawat',
  'Pilot/Pramugara',
  'Pedagang',
  'Petani/Peternak',
  'Nelayan',
  'Buruh (Tani/Pabrik/Bangunan)',
  'Sopir/Masinis/Kondektur',
  'Politikus',
  'Lainnya'
];

export interface Pendaftar {
  id: string;
  noUrut: number;
  noRegistrasi: string;
  namaLengkap: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: JenisKelamin;
  nisn: string;
  nik: string;
  noKk?: string;
  namaKepalaKeluarga?: string;
  noKip?: string;
  noHpWa: string;
  jumlahSaudara?: number;
  anakKe?: number;
  pembiayaSekolah?: 'Orang Tua' | 'Wali / Orang Tua Asuh' | 'Tanggungan Sendiri' | 'Lainnya' | string;
  praSekolah?: {
    pernahTkRa?: boolean;
    pernahPaud?: boolean;
  };
  imunisasi?: {
    hepatitisB?: boolean;
    bcg?: boolean;
    dpt?: boolean;
    polio?: boolean;
    campak?: boolean;
    covid?: boolean;
  };
  jalur: string; // e.g., 'Reguler', 'Prestasi', 'Afirmasi', 'Tahfizh'
  sekolahAsal: string;
  jenisSekolahAsal?: 'MI Negeri' | 'MI Swasta' | 'SD Negeri' | 'SD Swasta' | 'Lainnya' | string;
  npsnSekolahAsal?: string;
  alamatSekolahAsal?: string;
  status: StatusPendaftar;
  catatanVerifikasi?: string;
  tanggalDaftar: string;
  // Detail tambahan
  alamatSiswa: string;
  rtRw: string;
  kelurahan: string;
  kecamatan: string;
  kabKota: string;
  provinsi: string;
  // Orang Tua
  statusAyah?: StatusOrangTua | string;
  namaAyah: string;
  nikAyah?: string;
  tempatLahirAyah?: string;
  tanggalLahirAyah?: string;
  pendidikanAyah?: PendidikanOrangTua | string;
  pekerjaanAyah: PekerjaanOrangTua | string;

  statusIbu?: StatusOrangTua | string;
  namaIbu: string;
  nikIbu?: string;
  tempatLahirIbu?: string;
  tanggalLahirIbu?: string;
  pendidikanIbu?: PendidikanOrangTua | string;
  pekerjaanIbu: PekerjaanOrangTua | string;

  noHpOrangTua?: string;
  penghasilanOrangTua?: string;
  // Prestasi / Rapor / Tahfizh (optional)
  rataRapor?: number;
  jumlahJuzTahfizh?: number;
  prestasiDetail?: string;
  // Status Berkas
  berkas: {
    ijazahSkl: boolean;
    kartuKeluarga: boolean;
    aktaLahir: boolean;
    pasFoto: boolean;
    sertifikatPrestasi?: boolean;
    kipPkhKks?: boolean;
  };
  pembayaran?: {
    potonganDiskon: number;
    keteranganPotongan?: string;
    riwayat: RiwayatPembayaranItem[];
  };
}

export interface ItemBiayaPembayaran {
  id: string;
  namaKomponen: string;
  kategori: string;
  nominalPutra: number;
  nominalPutri: number;
  keteranganPutra: string;
  keteranganPutri: string;
  sifat: 'Wajib' | 'Pilihan';
}

export interface RiwayatPembayaranItem {
  id: string;
  noKuitansi: string;
  tanggal: string;
  jumlah: number;
  metode: 'Tunai / Kasir PPDB' | 'Transfer Bank' | 'QRIS' | 'Lainnya';
  penerima: string;
  catatan?: string;
}

export interface JalurPPDB {
  id: string;
  namaJalur: string;
  kuota: number;
  terisi: number;
  deskripsi: string;
  persyaratan: string[];
  warnaBadge: string;
}

export interface StatistikSekolah {
  namaSekolah: string;
  jenis: 'MI Negeri' | 'MI Swasta' | 'SD Negeri' | 'SD Swasta' | 'Lainnya';
  jumlahSiswa: number;
  persentase: number;
}

export interface JadwalPiket {
  id: string;
  hari: string; // e.g. 'Senin', 'Selasa'
  tanggal: string;
  shift: 'Pagi (07.30 - 12.00)' | 'Siang (12.00 - 15.30)';
  petugas: string[];
  noKontak: string;
  lokasi: string;
  status: 'Piket Hari Ini' | 'Akan Datang' | 'Selesai';
}

export interface ProfilMadrasahData {
  namaMadrasah: string;
  nsm: string;
  npsn: string;
  akreditasi: string;
  skAkreditasi: string;
  kepalaMadrasah: string;
  nipKepalaMadrasah: string;
  alamat: string;
  rtRw: string;
  kelurahan: string;
  kecamatan: string;
  kabKota: string;
  provinsi: string;
  kodePos: string;
  telepon: string;
  whatsappCenter: string;
  email: string;
  website: string;
  visi?: string;
  misi?: string[];
  slogan?: string;
  logoUrl?: string;
  bannerUrl?: string;
  kopSuratUrl?: string;
}

export interface PengaturanPPDBData {
  tahunAjaran: string;
  gelombangActive: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  tanggalPengumuman: string;
  kopHeaderLine1: string;
  kopHeaderLine2: string;
  kopHeaderLine3: string;
  biariaPendaftaran: string;
  nomorSuratKonfirmasi: string;
  panitiaKetua: string;
  panitiaSekretaris: string;
}

export type UserRole = 'admin' | 'panitia' | 'bendahara' | 'siswa';

export interface UserAccount {
  id: string;
  username: string;
  namaLengkap: string;
  email: string;
  role: UserRole;
  password?: string;
  jabatan?: string;
  avatarUrl?: string;
  noHp?: string;
  isAktif: boolean;
  nisnNik?: string; // Khusus role siswa/orang tua
}
