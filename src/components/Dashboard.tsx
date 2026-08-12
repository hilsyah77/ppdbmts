import React from 'react';
import {
  Pendaftar,
  JalurPPDB,
  JadwalPiket,
  ProfilMadrasahData,
  PengaturanPPDBData
} from '../types';
import {
  Users,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  School,
  TrendingUp,
  CalendarCheck,
  PhoneCall,
  MapPin,
  ArrowRight,
  BookOpen,
  Award,
  Sparkles,
  PieChart as PieChartIcon,
  BarChart3,
  UserCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts';

interface DashboardProps {
  pendaftarList: Pendaftar[];
  jalurList: JalurPPDB[];
  jadwalPiketList: JadwalPiket[];
  profil: ProfilMadrasahData;
  pengaturan: PengaturanPPDBData;
  onNavigateToPendaftar: (filterJalur?: string, filterStatus?: string) => void;
  onNavigateToPiket: () => void;
  onNavigateToJalurSettings: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  pendaftarList,
  jalurList,
  jadwalPiketList,
  profil,
  pengaturan,
  onNavigateToPendaftar,
  onNavigateToPiket,
  onNavigateToJalurSettings
}) => {
  // Stats Calculations
  const totalPendaftar = pendaftarList.length;
  const totalTerverifikasi = pendaftarList.filter((p) => p.status === 'Di Terima' || p.status === 'Terverifikasi').length;
  const totalPending = pendaftarList.filter((p) => p.status === 'Belum Diverifikasi').length;
  const totalDitolak = pendaftarList.filter((p) => p.status === 'Ditolak').length;
  const totalBerkasKurang = pendaftarList.filter((p) => p.status === 'Berkas Belum Lengkap').length;

  // Total Quota
  const totalKuota = jalurList.reduce((acc, curr) => acc + curr.kuota, 0);
  const totalTerisi = pendaftarList.filter((p) => p.status === 'Di Terima' || p.status === 'Terverifikasi').length;
  const sisaKuota = Math.max(0, totalKuota - totalTerisi);

  // 1. Data Statistik Sekolah Asal
  const sekolahAsalGroup: Record<string, number> = {
    'MI Negeri': 0,
    'MI Swasta': 0,
    'SD Negeri': 0,
    'SD Swasta': 0,
    'Lainnya': 0
  };

  const schoolDetailCount: Record<string, { count: number; jenis: string }> = {};

  pendaftarList.forEach((p) => {
    const jenis = p.jenisSekolahAsal || 'Lainnya';
    sekolahAsalGroup[jenis] = (sekolahAsalGroup[jenis] || 0) + 1;

    if (p.sekolahAsal) {
      if (!schoolDetailCount[p.sekolahAsal]) {
        schoolDetailCount[p.sekolahAsal] = { count: 0, jenis };
      }
      schoolDetailCount[p.sekolahAsal].count += 1;
    }
  });

  const pieSekolahData = Object.keys(sekolahAsalGroup).map((key) => ({
    name: key,
    value: sekolahAsalGroup[key]
  }));

  const COLORS_SEKOLAH = ['#059669', '#10b981', '#2563eb', '#3b82f6', '#8b5cf6'];

  const topFeederSchools = Object.entries(schoolDetailCount)
    .map(([nama, val]) => ({
      nama,
      jenis: val.jenis,
      jumlah: val.count,
      persentase: totalPendaftar > 0 ? Math.round((val.count / totalPendaftar) * 100) : 0
    }))
    .sort((a, b) => b.jumlah - a.jumlah);

  // 2. Statistik Pendaftar (By Jalur, By Status, By Date)
  const statusPieData = [
    { name: 'Di Terima', value: totalTerverifikasi, color: '#059669' },
    { name: 'Belum Diverifikasi', value: totalPending, color: '#f59e0b' },
    { name: 'Berkas Belum Lengkap', value: totalBerkasKurang, color: '#0284c7' },
    { name: 'Ditolak', value: totalDitolak, color: '#dc2626' }
  ].filter((d) => d.value > 0);

  const jalurBarData = jalurList.map((j) => {
    const pendaftarJalur = pendaftarList.filter((p) => p.jalur === j.namaJalur).length;
    const verifiedJalur = pendaftarList.filter(
      (p) => p.jalur === j.namaJalur && (p.status === 'Di Terima' || p.status === 'Terverifikasi')
    ).length;
    return {
      name: j.namaJalur,
      Mendaftar: pendaftarJalur,
      'Di Terima': verifiedJalur,
      Kuota: j.kuota
    };
  });

  // Mock registration trend by day
  const timelineData = [
    { tanggal: '01 Jun', pendaftar: 2 },
    { tanggal: '02 Jun', pendaftar: 5 },
    { tanggal: '03 Jun', pendaftar: 12 },
    { tanggal: '04 Jun', pendaftar: 18 },
    { tanggal: '05 Jun', pendaftar: 25 },
    { tanggal: '06 Jun', pendaftar: 32 },
    { tanggal: 'Hari Ini', pendaftar: totalPendaftar }
  ];

  // Gender breakdown
  const totalLaki = pendaftarList.filter((p) => p.jenisKelamin === 'Laki-laki').length;
  const totalPerempuan = pendaftarList.filter((p) => p.jenisKelamin === 'Perempuan').length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Welcome Card */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden border border-emerald-600/30">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-400/30 text-emerald-200 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Sistem PPDB Online MTs Terpadu</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Dashboard Utama Admin Panitia PPDB
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Monitoring real-time pendaftaran, verifikasi berkas, statistik asal sekolah, kuota jalur, dan jadwal piket panitia penginputan {profil.namaMadrasah}.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateToPendaftar()}
              className="px-4 py-2.5 bg-white text-emerald-800 font-bold rounded-xl text-xs hover:bg-emerald-50 transition-colors shadow-md flex items-center gap-2 shrink-0"
            >
              <Users className="w-4 h-4" />
              <span>Kelola Pendaftar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* Total Pendaftar */}
        <div
          onClick={() => onNavigateToPendaftar()}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Pendaftar</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-800">{totalPendaftar}</div>
          <p className="text-[11px] text-emerald-600 mt-1 font-medium">Siswa terdaftar online</p>
        </div>

        {/* Di Terima */}
        <div
          onClick={() => onNavigateToPendaftar(undefined, 'Di Terima')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Di Terima</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600">{totalTerverifikasi}</div>
          <p className="text-[11px] text-slate-500 mt-1">Siswa diterima / lolos seleksi</p>
        </div>

        {/* Belum Diverifikasi */}
        <div
          onClick={() => onNavigateToPendaftar(undefined, 'Belum Diverifikasi')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Perlu Verifikasi</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600">{totalPending}</div>
          <p className="text-[11px] text-amber-600 font-medium mt-1">Antrean verifikasi panitia</p>
        </div>

        {/* Berkas Kurang */}
        <div
          onClick={() => onNavigateToPendaftar(undefined, 'Berkas Belum Lengkap')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Berkas Kurang</span>
            <div className="p-2 rounded-lg bg-sky-50 text-sky-600 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-sky-600">{totalBerkasKurang}</div>
          <p className="text-[11px] text-slate-500 mt-1">Perlu perbaikan siswa</p>
        </div>

        {/* Sisa Kuota */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Sisa Kuota</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <School className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-700">{sisaKuota}</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Dari total kuota <span className="font-bold">{totalKuota}</span>
          </p>
        </div>

      </div>

      {/* SECTION 1: Jalur Pendaftaran */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>Jalur Pendaftaran & Monitoring Kuota PPDB</span>
            </h3>
            <p className="text-xs text-slate-500">
              Rincian kuota, jumlah pendaftar, dan persentase keterisian masing-masing jalur pendaftaran.
            </p>
          </div>
          <button
            onClick={onNavigateToJalurSettings}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Atur Kuota Jalur</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {jalurList.map((jalur) => {
            const registeredInJalur = pendaftarList.filter((p) => p.jalur === jalur.namaJalur).length;
            const verifiedInJalur = pendaftarList.filter(
              (p) => p.jalur === jalur.namaJalur && p.status === 'Terverifikasi'
            ).length;
            const percentage = Math.round((registeredInJalur / jalur.kuota) * 100);

            return (
              <div
                key={jalur.id}
                onClick={() => onNavigateToPendaftar(jalur.namaJalur)}
                className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer bg-slate-50/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${jalur.warnaBadge}`}
                    >
                      {jalur.namaJalur}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {registeredInJalur} / {jalur.kuota}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 my-2 leading-relaxed">
                    {jalur.deskripsi}
                  </p>
                </div>

                <div className="space-y-2 mt-3 pt-3 border-t border-slate-200/60">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Terverifikasi: <strong className="text-emerald-600">{verifiedInJalur}</strong></span>
                    <span>Keterisian: <strong className="text-slate-800">{percentage}%</strong></span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        percentage >= 100
                          ? 'bg-rose-500'
                          : percentage >= 80
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, percentage)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2 & 3: DATA STATISTIK SEKOLAH ASAL & STATISTIK PENDAFTAR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* DATA STATISTIK SEKOLAH ASAL */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <School className="w-5 h-5 text-blue-600" />
                  <span>Data Statistik Sekolah Asal</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Distribusi latar belakang jenis sekolah asal pendaftar (MI/SD Negeri & Swasta).
                </p>
              </div>
              <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <PieChartIcon className="w-4 h-4" />
              </span>
            </div>

            {/* Chart Area */}
            <div className="h-56 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieSekolahData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieSekolahData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_SEKOLAH[index % COLORS_SEKOLAH.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value} Siswa`, 'Jumlah']}
                    contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Top Feeder Schools List */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Daftar Sekolah Asal Terbanyak
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {topFeederSchools.slice(0, 5).map((sch, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs text-slate-700"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                        {i + 1}
                      </span>
                      <span className="font-medium truncate">{sch.nama}</span>
                      {sch.jenis && sch.jenis !== 'Lainnya' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-semibold shrink-0">
                          {sch.jenis}
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-slate-900 shrink-0 ml-2">
                      {sch.jumlah} Siswa ({sch.persentase}%)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* STATISTIK PENDAFTAR */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <span>Statistik & Tren Pendaftar</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Grafik pertumbuhan pendaftaran harian dan rasio status verifikasi.
                </p>
              </div>
              <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <BarChart3 className="w-4 h-4" />
              </span>
            </div>

            {/* Registration Trend Area Chart */}
            <div className="h-52 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData}>
                  <defs>
                    <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="tanggal" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                    formatter={(val: number) => [`${val} Pendaftar`, 'Total Kumulatif']}
                  />
                  <Area
                    type="monotone"
                    dataKey="pendaftar"
                    stroke="#059669"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorTrend)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Summary Badges */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-100">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-500 font-medium">Siswa Laki-laki</div>
                  <div className="text-base font-bold text-slate-800">{totalLaki} Siswa</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  L
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-500 font-medium">Siswa Perempuan</div>
                  <div className="text-base font-bold text-slate-800">{totalPerempuan} Siswa</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-xs">
                  P
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* SECTION 4: JADWAL PIKET PANITIA PENGINPUTAN */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-amber-600" />
              <span>Jadwal Piket Panitia Penginputan Berkas</span>
            </h3>
            <p className="text-xs text-slate-500">
              Jadwal tugas petugas panitia yang berjaga untuk membantu penginputan, pelayanan, dan verifikasi berkas luring/offline.
            </p>
          </div>
          <button
            onClick={onNavigateToPiket}
            className="px-3 py-1.5 bg-amber-50 text-amber-800 hover:bg-amber-100 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto border border-amber-200"
          >
            <UserCheck className="w-4 h-4" />
            <span>Kelola Kelengkapan Jadwal Piket</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jadwalPiketList.slice(0, 3).map((piket) => {
            const isToday = piket.status === 'Piket Hari Ini';
            return (
              <div
                key={piket.id}
                className={`p-4 rounded-xl border transition-all ${
                  isToday
                    ? 'bg-amber-50/60 border-amber-300 ring-2 ring-amber-400/30 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-800">{piket.hari}</span>
                    <span className="text-xs text-slate-500">({piket.tanggal})</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isToday
                        ? 'bg-amber-500 text-white animate-pulse'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {piket.status}
                  </span>
                </div>

                <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md mb-3 inline-block">
                  Shift: {piket.shift}
                </div>

                <div className="space-y-2 text-xs text-slate-700">
                  <div className="font-medium text-slate-900 mb-1">Petugas Bertugas:</div>
                  <ul className="space-y-1 pl-1">
                    {piket.petugas.map((nama, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>{nama}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 truncate" title={piket.lokasi}>
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{piket.lokasi}</span>
                    </span>
                    <a
                      href={`https://wa.me/${piket.noKontak.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1 shrink-0"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>{piket.noKontak}</span>
                    </a>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
