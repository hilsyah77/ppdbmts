import React, { useState } from 'react';
import { Pendaftar, ItemBiayaPembayaran } from '../types';
import { CreditCard, DollarSign, X, Check, Gift, Tag } from 'lucide-react';

interface ModalBayarProps {
  pendaftar: Pendaftar;
  itemBiayaList: ItemBiayaPembayaran[];
  onSavePayment: (
    pendaftarId: string,
    jumlah: number,
    metode: 'Tunai / Kasir PPDB' | 'Transfer Bank' | 'QRIS' | 'Lainnya',
    catatan: string,
    penerima: string,
    diskonBaru?: number,
    ketDiskon?: string
  ) => void;
  onClose: () => void;
}

export const ModalBayar: React.FC<ModalBayarProps> = ({
  pendaftar,
  itemBiayaList,
  onSavePayment,
  onClose
}) => {
  const isPutra = pendaftar.jenisKelamin === 'Laki-laki';

  // Calculate standard total for this gender
  const standardTotal = itemBiayaList
    .filter((i) => i.sifat === 'Wajib')
    .reduce((sum, item) => sum + (isPutra ? item.nominalPutra : item.nominalPutri), 0);

  const [diskon, setDiskon] = useState<number>(pendaftar.pembayaran?.potonganDiskon || 0);
  const [ketDiskon, setKetDiskon] = useState<string>(pendaftar.pembayaran?.keteranganPotongan || '');
  const [showDiskonEdit, setShowDiskonEdit] = useState<boolean>(false);

  // Previous payments total
  const riwayat = pendaftar.pembayaran?.riwayat || [];
  const totalPaidPrev = riwayat.reduce((sum, r) => sum + r.jumlah, 0);

  const netObligation = Math.max(0, standardTotal - diskon);
  const remainingObligation = Math.max(0, netObligation - totalPaidPrev);

  // Form states for new payment
  const [jumlah, setJumlah] = useState<number>(remainingObligation);
  const [metode, setMetode] = useState<'Tunai / Kasir PPDB' | 'Transfer Bank' | 'QRIS' | 'Lainnya'>('Tunai / Kasir PPDB');
  const [penerima, setPenerima] = useState<string>('Hj. Siti Aminah, S.Pd (Bendahara)');
  const [catatan, setCatatan] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jumlah <= 0 && diskon === pendaftar.pembayaran?.potonganDiskon) {
      alert('Masukkan nominal pembayaran yang valid (lebih dari Rp 0).');
      return;
    }

    onSavePayment(
      pendaftar.id,
      jumlah,
      metode,
      catatan || (jumlah >= remainingObligation ? `Pelunasan Biaya PPDB ${isPutra ? 'Putra' : 'Putri'}` : `Pembayaran Angsuran Biaya PPDB ${isPutra ? 'Putra' : 'Putri'}`),
      penerima,
      diskon,
      ketDiskon
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="p-4 bg-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm">Input & Transaksi Pembayaran PPDB</h3>
              <p className="text-[11px] text-emerald-100">
                {pendaftar.namaLengkap} ({pendaftar.noRegistrasi})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-emerald-800 hover:bg-emerald-900 text-emerald-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          
          {/* Student Banner Info */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 uppercase">{pendaftar.namaLengkap}</span>
              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${isPutra ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-pink-100 text-pink-800 border border-pink-200'}`}>
                {pendaftar.jenisKelamin} ({isPutra ? 'Putra' : 'Putri'})
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 border-t border-slate-200/60 pt-2">
              <div>Jalur: <strong className="text-slate-800">{pendaftar.jalur}</strong></div>
              <div>Sekolah Asal: <strong className="text-slate-800">{pendaftar.sekolahAsal}</strong></div>
            </div>
          </div>

          {/* Rincian Finansial Box */}
          <div className="border border-slate-200 rounded-xl p-3.5 bg-emerald-50/40 space-y-2 text-xs">
            <div className="flex items-center justify-between font-medium text-slate-700">
              <span>Rincian Biaya Standar ({isPutra ? 'Laki-Laki / Putra' : 'Perempuan / Putri'}):</span>
              <span className="font-mono font-bold text-slate-900">
                Rp {standardTotal.toLocaleString('id-ID')}
              </span>
            </div>

            {/* Discount Row */}
            <div className="flex items-center justify-between text-rose-700">
              <div className="flex items-center gap-1">
                <span>Potongan / Beasiswa:</span>
                <button
                  type="button"
                  onClick={() => setShowDiskonEdit(!showDiskonEdit)}
                  className="text-[10px] font-bold text-emerald-700 hover:underline flex items-center gap-0.5 ml-1"
                >
                  <Tag className="w-3 h-3" />
                  <span>{showDiskonEdit ? 'Tutup Edit' : 'Ubah Beasiswa'}</span>
                </button>
              </div>
              <span className="font-mono font-bold">- Rp {diskon.toLocaleString('id-ID')}</span>
            </div>

            {/* Optional Edit Discount Panel */}
            {showDiskonEdit && (
              <div className="p-2.5 bg-white border border-rose-200 rounded-lg space-y-2 text-xs animate-in fade-in">
                <div className="font-bold text-rose-800 text-[11px]">Pengaturan Potongan / Beasiswa Jalur</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Nominal Potongan (Rp)</label>
                    <input
                      type="number"
                      value={diskon}
                      onChange={(e) => setDiskon(Number(e.target.value))}
                      className="w-full px-2.5 py-1 border border-slate-300 rounded text-xs font-mono focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Alasan / Nama Beasiswa</label>
                    <input
                      type="text"
                      value={ketDiskon}
                      onChange={(e) => setKetDiskon(e.target.value)}
                      placeholder="Misal: Beasiswa Tahfizh 3 Juz"
                      className="w-full px-2.5 py-1 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between font-bold border-t border-slate-200 pt-1.5 text-slate-900">
              <span>Total Kewajiban Biaya:</span>
              <span className="font-mono text-emerald-800">Rp {netObligation.toLocaleString('id-ID')}</span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Total Sudah Dibayar Sebelumnya:</span>
              <span className="font-mono font-bold text-slate-900">Rp {totalPaidPrev.toLocaleString('id-ID')}</span>
            </div>

            <div className="p-2 bg-emerald-100 border border-emerald-300 rounded-lg flex items-center justify-between font-black text-xs text-emerald-950">
              <span>SISA KEWAJIBAN PEMBAYARAN:</span>
              <span className="font-mono text-sm text-emerald-900">
                {remainingObligation === 0 ? 'LUNAS (Rp 0)' : `Rp ${remainingObligation.toLocaleString('id-ID')}`}
              </span>
            </div>
          </div>

          {/* Form Pembayaran Baru */}
          <div className="space-y-3 pt-1">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1">
              Catat Pembayaran Baru
            </h4>

            {/* Quick Preset Buttons */}
            {remainingObligation > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap text-xs">
                <span className="text-[11px] font-bold text-slate-500">Pilihan Cepat:</span>
                <button
                  type="button"
                  onClick={() => setJumlah(remainingObligation)}
                  className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold rounded text-[11px] border border-emerald-300 transition-colors"
                >
                  Bayar Lunas (Rp {remainingObligation.toLocaleString('id-ID')})
                </button>
                {remainingObligation > 500000 && (
                  <button
                    type="button"
                    onClick={() => setJumlah(500000)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-[11px] border border-slate-300 transition-colors"
                  >
                    DP Rp 500.000
                  </button>
                )}
                {remainingObligation > 1000000 && (
                  <button
                    type="button"
                    onClick={() => setJumlah(1000000)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-[11px] border border-slate-300 transition-colors"
                  >
                    DP Rp 1.000.000
                  </button>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Jumlah Pembayaran (Rp) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">Rp</span>
                  <input
                    type="number"
                    value={jumlah}
                    onChange={(e) => setJumlah(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Metode Pembayaran *
                </label>
                <select
                  value={metode}
                  onChange={(e: any) => setMetode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
                >
                  <option value="Tunai / Kasir PPDB">Tunai / Kasir PPDB</option>
                  <option value="Transfer Bank">Transfer Bank (BSI / Mandiri)</option>
                  <option value="QRIS">QRIS Kasir</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Penerima / Kasir PPDB
                </label>
                <input
                  type="text"
                  value={penerima}
                  onChange={(e) => setPenerima(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Nama Bendahara"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Transaksi / Keterangan
                </label>
                <input
                  type="text"
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Misal: Pembayaran Seragam & Infaq"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Simpan & Buat Kuitansi</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
