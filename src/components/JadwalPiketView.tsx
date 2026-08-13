import React, { useState } from 'react';
import { JadwalPiket } from '../types';
import {
  CalendarCheck,
  Clock,
  Plus,
  Trash2,
  MapPin,
  PhoneCall,
  UserCheck,
  CheckCircle2,
  Save,
  Users
} from 'lucide-react';

interface JadwalPiketViewProps {
  jadwalList: JadwalPiket[];
  onSaveJadwal: (newList: JadwalPiket[]) => void;
}

export const JadwalPiketView: React.FC<JadwalPiketViewProps> = ({
  jadwalList,
  onSaveJadwal
}) => {
  const [list, setList] = useState<JadwalPiket[]>(jadwalList);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHari, setNewHari] = useState('Senin');
  const [newTanggal, setNewTanggal] = useState('11 Agustus 2026');
  const [newShift, setNewShift] = useState<'Pagi (07.30 - 12.00)' | 'Siang (12.00 - 15.30)'>('Pagi (07.30 - 12.00)');
  const [newPetugasInput, setNewPetugasInput] = useState('');
  const [newNoKontak, setNewNoKontak] = useState('0812-9988-7766');
  const [newLokasi, setNewLokasi] = useState('Ruang Panitia PPDB (Gedung Utama Lt. 1)');

  const handleAddJadwal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPetugasInput.trim()) {
      alert('Masukkan minimal satu nama petugas piket!');
      return;
    }

    const petugasArray = newPetugasInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const newItem: JadwalPiket = {
      id: `piket-${Date.now()}`,
      hari: newHari,
      tanggal: newTanggal,
      shift: newShift,
      petugas: petugasArray,
      noKontak: newNoKontak,
      lokasi: newLokasi,
      status: 'Akan Datang'
    };

    const updated = [newItem, ...list];
    setList(updated);
    onSaveJadwal(updated);
    setShowAddModal(false);
    setNewPetugasInput('');
  };

  const handleDeleteJadwal = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus jadwal piket panitia ini?')) {
      const updated = list.filter((item) => item.id !== id);
      setList(updated);
      onSaveJadwal(updated);
    }
  };

  const handleToggleStatus = (id: string) => {
    const updated = list.map((item) => {
      if (item.id === id) {
        const nextStatus: JadwalPiket['status'] =
          item.status === 'Piket Hari Ini'
            ? 'Selesai'
            : item.status === 'Selesai'
            ? 'Akan Datang'
            : 'Piket Hari Ini';
        return { ...item, status: nextStatus };
      }
      return item;
    });
    setList(updated);
    onSaveJadwal(updated);
  };

  return (
    <div className="space-y-6 w-full">
      
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Jadwal Piket Panitia Penginputan PPDB</h2>
            <p className="text-xs text-slate-500">
              Pengaturan jadwal jaga panitia penerimaan siswa baru offline, verifikasi berkas luring, dan layanan informasi.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Jadwal Piket</span>
        </button>
      </div>

      {/* Grid of Duty Schedule Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {list.map((item) => {
          const isToday = item.status === 'Piket Hari Ini';
          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all ${
                isToday
                  ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/40 shadow-md'
                  : item.status === 'Selesai'
                  ? 'bg-slate-50 border-slate-200 opacity-75'
                  : 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-slate-900">{item.hari}</span>
                  <span className="text-xs text-slate-500">({item.tanggal})</span>
                </div>

                <button
                  onClick={() => handleToggleStatus(item.id)}
                  className={`text-[11px] font-bold px-3 py-1 rounded-full transition-colors cursor-pointer ${
                    isToday
                      ? 'bg-amber-500 text-white animate-pulse'
                      : item.status === 'Selesai'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-amber-100'
                  }`}
                  title="Klik untuk mengubah status piket"
                >
                  {item.status}
                </button>
              </div>

              <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold mb-3">
                Shift Jaga: {item.shift}
              </div>

              <div className="space-y-3 text-xs text-slate-700 bg-white/80 p-3 rounded-xl border border-slate-200/60">
                <div>
                  <span className="text-slate-500 font-semibold block mb-1">Daftar Petugas Piket:</span>
                  <div className="space-y-1">
                    {item.petugas.map((nama, idx) => (
                      <div key={idx} className="flex items-center gap-2 font-medium text-slate-900">
                        <UserCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{nama}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                  <span className="flex items-center gap-1 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{item.lokasi}</span>
                  </span>

                  <a
                    href={`https://wa.me/${item.noKontak.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>{item.noKontak}</span>
                  </a>
                </div>
              </div>

              <div className="mt-3 text-right">
                <button
                  onClick={() => handleDeleteJadwal(item.id)}
                  className="text-xs text-rose-600 hover:text-rose-700 hover:underline inline-flex items-center gap-1 font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Jadwal</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Schedule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              Tambah Jadwal Piket Panitia Baru
            </h3>

            <form onSubmit={handleAddJadwal} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Hari</label>
                <select
                  value={newHari}
                  onChange={(e) => setNewHari(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Senin">Senin</option>
                  <option value="Selasa">Selasa</option>
                  <option value="Rabu">Rabu</option>
                  <option value="Kamis">Kamis</option>
                  <option value="Jumat">Jumat</option>
                  <option value="Sabtu">Sabtu</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tanggal</label>
                <input
                  type="text"
                  value={newTanggal}
                  onChange={(e) => setNewTanggal(e.target.value)}
                  placeholder="Contoh: 15 Agustus 2026"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Shift Tugas</label>
                <select
                  value={newShift}
                  onChange={(e: any) => setNewShift(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Pagi (07.30 - 12.00)">Pagi (07.30 - 12.00)</option>
                  <option value="Siang (12.00 - 15.30)">Siang (12.00 - 15.30)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Petugas (Pisahkan dengan koma)</label>
                <textarea
                  rows={2}
                  value={newPetugasInput}
                  onChange={(e) => setNewPetugasInput(e.target.value)}
                  placeholder="Ust. M. Ridwan, Ibu Rahmawati, Bpk. Hendra"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">No. WhatsApp Kontak</label>
                <input
                  type="text"
                  value={newNoKontak}
                  onChange={(e) => setNewNoKontak(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lokasi Piket</label>
                <input
                  type="text"
                  value={newLokasi}
                  onChange={(e) => setNewLokasi(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Jadwal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
