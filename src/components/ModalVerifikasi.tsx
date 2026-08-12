import React, { useState } from 'react';
import { Pendaftar, StatusPendaftar } from '../types';
import { X, CheckCircle2, XCircle, AlertTriangle, Clock, Save, ShieldAlert } from 'lucide-react';

interface ModalVerifikasiProps {
  pendaftar: Pendaftar | null;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: StatusPendaftar, catatan: string) => void;
}

export const ModalVerifikasi: React.FC<ModalVerifikasiProps> = ({
  pendaftar,
  onClose,
  onUpdateStatus
}) => {
  if (!pendaftar) return null;

  const [status, setStatus] = useState<StatusPendaftar>(pendaftar.status);
  const [catatan, setCatatan] = useState(pendaftar.catatanVerifikasi || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStatus(pendaftar.id, status, catatan);
    onClose();
  };

  const statusOptions: { value: StatusPendaftar; label: string; desc: string; icon: any; color: string }[] = [
    {
      value: 'Terverifikasi',
      label: 'Setujui (Terverifikasi)',
      desc: 'Siswa memenuhi syarat, berkas lengkap, dan resmi terdaftar.',
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-300 peer-checked:bg-emerald-600 peer-checked:text-white'
    },
    {
      value: 'Belum Diverifikasi',
      label: 'Pending (Belum Diverifikasi)',
      desc: 'Dalam antrean peninjauan oleh petugas panitia.',
      icon: Clock,
      color: 'bg-amber-50 text-amber-800 border-amber-300 peer-checked:bg-amber-600 peer-checked:text-white'
    },
    {
      value: 'Berkas Belum Lengkap',
      label: 'Minta Perbaikan / Berkas Kurang',
      desc: 'Berkas atau dokumen tertentu perlu diunggah ulang.',
      icon: AlertTriangle,
      color: 'bg-sky-50 text-sky-800 border-sky-300 peer-checked:bg-sky-600 peer-checked:text-white'
    },
    {
      value: 'Ditolak',
      label: 'Tolak Pendaftaran',
      desc: 'Siswa tidak memenuhi persyaratan minimum jalur.',
      icon: XCircle,
      color: 'bg-rose-50 text-rose-800 border-rose-300 peer-checked:bg-rose-600 peer-checked:text-white'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold">Verifikasi Pendaftar PPDB</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {pendaftar.namaLengkap} ({pendaftar.noRegistrasi})
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <p className="text-slate-600 font-medium">
            Pilih hasil verifikasi panitia untuk pendaftar jalur <strong className="text-emerald-700">{pendaftar.jalur}</strong>:
          </p>

          <div className="space-y-2">
            {statusOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <label
                  key={opt.value}
                  className="relative block cursor-pointer"
                >
                  <input
                    type="radio"
                    name="statusOption"
                    value={opt.value}
                    checked={status === opt.value}
                    onChange={() => setStatus(opt.value)}
                    className="peer sr-only"
                  />
                  <div className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${opt.color}`}>
                    <Icon className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">{opt.label}</div>
                      <div className="text-[11px] opacity-90">{opt.desc}</div>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Catatan / Alasan Verifikasi (Opsional):
            </label>
            <textarea
              rows={3}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Contoh: Berkas ijazah dan KK lengkap tervalidasi. / Sertifikat prestasi terverifikasi Juara 1."
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
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
              <span>Simpan Verifikasi</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
