/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Pendaftar,
  JalurPPDB,
  JadwalPiket,
  ProfilMadrasahData,
  PengaturanSPMBData,
  StatusPendaftar,
  ItemBiayaPembayaran,
  UserAccount
} from './types';
import {
  initialPendaftar,
  initialJalurPPDB,
  initialJadwalPiket,
  initialProfilMadrasah,
  initialPengaturan,
  initialItemBiayaPembayaran,
  initialUsers
} from './data/mockData';

// Layout & Navigation Components
import { Header } from './components/Header';
import { Sidebar, ActiveTab } from './components/Sidebar';

// Views
import { Dashboard } from './components/Dashboard';
import { ProfilMadrasah } from './components/ProfilMadrasah';
import { DataPendaftar } from './components/DataPendaftar';
import { JadwalPiketView } from './components/JadwalPiketView';
import { PengaturanView } from './components/PengaturanView';
import { PembayaranView } from './components/PembayaranView';

// Modals & Pages
import { LoginPage } from './components/LoginPage';
import { ModalDetailPendaftar } from './components/ModalDetailPendaftar';
import { ModalCetakFormulir } from './components/ModalCetakFormulir';
import { ModalVerifikasi } from './components/ModalVerifikasi';
import { ModalTambahPendaftar } from './components/ModalTambahPendaftar';
import { ModalLogin } from './components/ModalLogin';
import { ModalHasilRincian } from './components/ModalHasilRincian';
import { ConfirmDialog, ConfirmDialogState } from './components/ConfirmDialog';
import { ToastNotification, ToastMessage } from './components/ToastNotification';
import { subscribeNotification, showNotification } from './utils/notification';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Multi-User Login & Accounts State
  const [usersList, setUsersList] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('ppdb_mts_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('ppdb_mts_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Filter Pass-Through State for Navigation from Dashboard to DataPendaftar
  const [filterJalurParam, setFilterJalurParam] = useState<string>('');
  const [filterStatusParam, setFilterStatusParam] = useState<string>('');

  // Persistent States
  const [pendaftarList, setPendaftarList] = useState<Pendaftar[]>(() => {
    const saved = localStorage.getItem('ppdb_mts_pendaftar');
    return saved ? JSON.parse(saved) : initialPendaftar;
  });

  const [jalurList, setJalurList] = useState<JalurPPDB[]>(() => {
    const saved = localStorage.getItem('ppdb_mts_jalur');
    return saved ? JSON.parse(saved) : initialJalurPPDB;
  });

  const [jadwalPiketList, setJadwalPiketList] = useState<JadwalPiket[]>(() => {
    const saved = localStorage.getItem('ppdb_mts_piket');
    return saved ? JSON.parse(saved) : initialJadwalPiket;
  });

  const [profilMadrasah, setProfilMadrasah] = useState<ProfilMadrasahData>(() => {
    const saved = localStorage.getItem('ppdb_mts_profil');
    return saved ? JSON.parse(saved) : initialProfilMadrasah;
  });

  const [pengaturan, setPengaturan] = useState<PengaturanSPMBData>(() => {
    const saved = localStorage.getItem('ppdb_mts_pengaturan');
    return saved ? JSON.parse(saved) : initialPengaturan;
  });

  const [itemBiayaList, setItemBiayaList] = useState<ItemBiayaPembayaran[]>(() => {
    const saved = localStorage.getItem('ppdb_mts_biaya');
    return saved ? JSON.parse(saved) : initialItemBiayaPembayaran;
  });

  // Modal States
  const [detailModalItem, setDetailModalItem] = useState<Pendaftar | null>(null);
  const [cetakModalItem, setCetakModalItem] = useState<Pendaftar | null>(null);
  const [hasilRincianModalItem, setHasilRincianModalItem] = useState<{ isOpen: boolean; pendaftar?: Pendaftar | null }>({
    isOpen: false,
    pendaftar: null
  });
  const [verifikasiModalItem, setVerifikasiModalItem] = useState<Pendaftar | null>(null);
  const [isTambahModalOpen, setIsTambahModalOpen] = useState<boolean>(false);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeNotification((newToast) => {
      setToasts((prev) => [...prev, newToast]);
      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
        }, newToast.duration);
      }
    });
    return unsubscribe;
  }, []);

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync Users to LocalStorage
  useEffect(() => {
    localStorage.setItem('ppdb_mts_users', JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ppdb_mts_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ppdb_mts_current_user');
    }
  }, [currentUser]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('ppdb_mts_pendaftar', JSON.stringify(pendaftarList));
  }, [pendaftarList]);

  useEffect(() => {
    localStorage.setItem('ppdb_mts_jalur', JSON.stringify(jalurList));
  }, [jalurList]);

  useEffect(() => {
    localStorage.setItem('ppdb_mts_piket', JSON.stringify(jadwalPiketList));
  }, [jadwalPiketList]);

  useEffect(() => {
    localStorage.setItem('ppdb_mts_profil', JSON.stringify(profilMadrasah));
  }, [profilMadrasah]);

  useEffect(() => {
    localStorage.setItem('ppdb_mts_pengaturan', JSON.stringify(pengaturan));
  }, [pengaturan]);

  useEffect(() => {
    localStorage.setItem('ppdb_mts_biaya', JSON.stringify(itemBiayaList));
  }, [itemBiayaList]);

  // Derived Counts
  const pendingCount = pendaftarList.filter((p) => p.status === 'Belum Diverifikasi').length;
  const verifiedCount = pendaftarList.filter((p) => p.status === 'Di Terima' || p.status === 'Terverifikasi').length;

  // Handlers
  const handleNavigateToPendaftar = (jalur?: string, status?: string) => {
    setFilterJalurParam(jalur || '');
    setFilterStatusParam(status || '');
    setActiveTab('pendaftar');
  };

  const handleUpdateStatus = (id: string, newStatus: StatusPendaftar, catatan: string) => {
    setPendaftarList((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: newStatus, catatanVerifikasi: catatan } : p
      )
    );
  };

  const handleSavePendaftar = (updatedPendaftar: Pendaftar) => {
    setPendaftarList((prev) =>
      prev.map((p) => (p.id === updatedPendaftar.id ? updatedPendaftar : p))
    );
    setDetailModalItem(updatedPendaftar);
  };

  const handleDeletePendaftar = (id: string, nama: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Hapus Data Pendaftar',
      message: `Apakah Anda yakin ingin menghapus data pendaftar "${nama}" dari sistem?`,
      subMessage: 'Tindakan ini permanen dan akan menghapus seluruh rekaman pendaftaran serta pembayaran terkait.',
      type: 'danger',
      confirmText: 'Ya, Hapus Data',
      cancelText: 'Batal',
      onConfirm: () => {
        setPendaftarList((prev) => {
          const filtered = prev.filter((p) => p.id !== id);
          // Recalculate No Urut
          return filtered.map((p, idx) => ({ ...p, noUrut: idx + 1 }));
        });
      }
    });
  };

  const handleAddPendaftar = (
    newPendaftarData: Omit<Pendaftar, 'id' | 'noUrut' | 'noRegistrasi' | 'tanggalDaftar'>
  ) => {
    const nextUrut = pendaftarList.length + 1;
    const formattedUrut = String(nextUrut).padStart(3, '0');
    const year = new Date().getFullYear();
    const newRegNo = `SPMB-${year}-${formattedUrut}`;

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const fullNewPendaftar: Pendaftar = {
      ...newPendaftarData,
      id: `pdf-${Date.now()}`,
      noUrut: nextUrut,
      noRegistrasi: newRegNo,
      tanggalDaftar: formattedDate
    };

    setPendaftarList((prev) => [fullNewPendaftar, ...prev]);

    // Also update filled seats in Jalur count
    setJalurList((prev) =>
      prev.map((j) =>
        j.namaJalur === newPendaftarData.jalur ? { ...j, terisi: j.terisi + 1 } : j
      )
    );
  };

  const handleResetData = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Reset Seluruh Database Sistem',
      message: 'Apakah Anda yakin ingin MENGHAPUS SELURUH DATABASE dan mengembalikan data pendaftar, profil, biaya, dan jadwal piket ke kondisi awal sistem?',
      subMessage: 'Peringatan: Seluruh data perubahan yang tersimpan di perangkat ini akan digantikan dengan data bawaan standar.',
      type: 'danger',
      confirmText: 'Ya, Reset Database',
      cancelText: 'Batal',
      onConfirm: () => {
        localStorage.clear();
        setPendaftarList(initialPendaftar);
        setJalurList(initialJalurPPDB);
        setJadwalPiketList(initialJadwalPiket);
        setProfilMadrasah(initialProfilMadrasah);
        setPengaturan(initialPengaturan);
        setItemBiayaList(initialItemBiayaPembayaran);
        setActiveTab('dashboard');
      }
    });
  };

  const handleClearPendaftarOnly = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Kosongkan Data Siswa Pendaftar',
      message: 'Apakah Anda yakin ingin MENGHAPUS SEMUA DATA SISWA PENDAFTAR & RIWAYAT PEMBAYARAN?\n\nSemua data pendaftar akan menjadi 0 (kosong) untuk periode pendaftaran baru.',
      subMessage: 'Data profil madrasah, jadwal piket, master rincian biaya, dan akun pengguna akan tetap aman.',
      type: 'danger',
      confirmText: 'Ya, Kosongkan Data Siswa',
      cancelText: 'Batal',
      onConfirm: () => {
        setPendaftarList([]);
        localStorage.setItem('ppdb_mts_pendaftar', JSON.stringify([]));
      }
    });
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    localStorage.setItem('ppdb_mts_current_user', JSON.stringify(user));
    setIsLoginModalOpen(false);
    setActiveTab('dashboard');
    showNotification(
      'Login Berhasil',
      `Selamat datang, ${user.namaLengkap} (${user.role.toUpperCase()})`,
      'success'
    );
  };

  const handleLogout = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Konfirmasi Keluar / Logout',
      message: `Apakah Anda yakin ingin keluar dari akun "${currentUser?.namaLengkap || 'Pengguna'}"?`,
      subMessage: 'Anda akan dialihkan kembali ke Halaman Login Utama SPMB.',
      type: 'warning',
      confirmText: 'Ya, Keluar Akun',
      cancelText: 'Batal',
      onConfirm: () => {
        setCurrentUser(null);
        localStorage.removeItem('ppdb_mts_current_user');
        setIsLoginModalOpen(false);
        showNotification('Sesi Berakhir', 'Anda telah berhasil keluar dari sistem SPMB.', 'info');
      }
    });
  };

  // If not logged in, enforce mandatory Login Page as the primary view
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
        <LoginPage
          profil={profilMadrasah}
          pengaturan={pengaturan}
          usersList={usersList}
          onLogin={handleLoginSuccess}
        />
        
        {/* Global Modern Bottom-Center CSS Floating Toast Notifications */}
        <ToastNotification
          toasts={toasts}
          onDismiss={handleDismissToast}
        />

        {/* Global Modern Centered CSS Confirm / Notification Dialog */}
        <ConfirmDialog
          dialog={confirmDialog}
          onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/90 font-sans text-slate-800 antialiased flex flex-col selection:bg-emerald-500 selection:text-white">
      
      {/* App Header */}
      <Header
        profil={profilMadrasah}
        pengaturan={pengaturan}
        totalPendaftar={pendaftarList.length}
        totalTerverifikasi={verifiedCount}
        totalPending={pendingCount}
        currentUser={currentUser}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Body Layout */}
      <div className="flex-1 w-full max-w-[1720px] mx-auto flex flex-col lg:flex-row">
        
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setFilterJalurParam('');
            setFilterStatusParam('');
            setActiveTab(tab);
          }}
          pendingCount={pendingCount}
          totalCount={pendaftarList.length}
          currentUser={currentUser}
        />

        {/* View Content Area */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 min-w-0">
          {activeTab === 'dashboard' && (
            <Dashboard
              pendaftarList={pendaftarList}
              jalurList={jalurList}
              jadwalPiketList={jadwalPiketList}
              profil={profilMadrasah}
              pengaturan={pengaturan}
              currentUser={currentUser}
              onNavigateToPendaftar={handleNavigateToPendaftar}
              onNavigateToPiket={() => setActiveTab('piket')}
              onNavigateToJalurSettings={() => setActiveTab('pengaturan')}
            />
          )}

          {activeTab === 'profil' && (
            <ProfilMadrasah
              profil={profilMadrasah}
              onSave={(updated) => setProfilMadrasah(updated)}
            />
          )}

          {activeTab === 'pendaftar' && (
            <DataPendaftar
              pendaftarList={pendaftarList}
              jalurList={jalurList}
              initialFilterJalur={filterJalurParam}
              initialFilterStatus={filterStatusParam}
              currentUser={currentUser}
              onOpenDetail={(p) => setDetailModalItem(p)}
              onOpenCetak={(p) => setCetakModalItem(p)}
              onOpenCetakDaftarUlang={(p) => setHasilRincianModalItem({ isOpen: true, pendaftar: p || null })}
              onOpenVerifikasi={(p) => setVerifikasiModalItem(p)}
              onDeletePendaftar={handleDeletePendaftar}
              onOpenTambahModal={() => setIsTambahModalOpen(true)}
            />
          )}

          {activeTab === 'pembayaran' && (
            <PembayaranView
              pendaftarList={pendaftarList}
              setPendaftarList={setPendaftarList}
              itemBiayaList={itemBiayaList}
              setItemBiayaList={setItemBiayaList}
              profil={profilMadrasah}
              pengaturan={pengaturan}
              jadwalPiketList={jadwalPiketList}
            />
          )}

          {activeTab === 'piket' && (
            <JadwalPiketView
              jadwalList={jadwalPiketList}
              onSaveJadwal={(newList) => setJadwalPiketList(newList)}
            />
          )}

          {activeTab === 'pengaturan' && (
            <PengaturanView
              pengaturan={pengaturan}
              jalurList={jalurList}
              jadwalPiketList={jadwalPiketList}
              usersList={usersList}
              currentUser={currentUser}
              onSavePengaturan={(newP) => setPengaturan(newP)}
              onSaveJalurList={(newJ) => setJalurList(newJ)}
              onSaveUsersList={(newU) => setUsersList(newU)}
              onResetDatabase={handleResetData}
              onClearPendaftarDatabase={handleClearPendaftarOnly}
            />
          )}
        </main>

      </div>

      {/* Global Modals */}
      {isLoginModalOpen && (
        <ModalLogin
          profil={profilMadrasah}
          pengaturan={pengaturan}
          usersList={usersList}
          currentUser={currentUser}
          onLogin={handleLoginSuccess}
          onLoginSuccess={handleLoginSuccess}
          onLogout={handleLogout}
          onClose={() => setIsLoginModalOpen(false)}
        />
      )}

      <ModalDetailPendaftar
        pendaftar={detailModalItem}
        jalurList={jalurList}
        onClose={() => setDetailModalItem(null)}
        onSavePendaftar={handleSavePendaftar}
        onOpenCetak={(p) => {
          setDetailModalItem(null);
          setCetakModalItem(p);
        }}
        onOpenCetakDaftarUlang={(p) => {
          setDetailModalItem(null);
          setHasilRincianModalItem({ isOpen: true, pendaftar: p });
        }}
        onOpenVerifikasi={(p) => {
          setDetailModalItem(null);
          setVerifikasiModalItem(p);
        }}
      />

      <ModalCetakFormulir
        pendaftar={cetakModalItem}
        profil={profilMadrasah}
        pengaturan={pengaturan}
        jadwalPiketList={jadwalPiketList}
        onClose={() => setCetakModalItem(null)}
        onUpdateProfil={(newProfil) => setProfilMadrasah(newProfil)}
      />

      <ModalVerifikasi
        pendaftar={verifikasiModalItem}
        onClose={() => setVerifikasiModalItem(null)}
        onUpdateStatus={handleUpdateStatus}
      />

      {isTambahModalOpen && (
        <ModalTambahPendaftar
          jalurList={jalurList}
          onClose={() => setIsTambahModalOpen(false)}
          onAddPendaftar={handleAddPendaftar}
        />
      )}

      {hasilRincianModalItem.isOpen && (
        <ModalHasilRincian
          itemBiayaList={itemBiayaList}
          profil={profilMadrasah}
          pengaturan={pengaturan}
          pendaftar={hasilRincianModalItem.pendaftar}
          jadwalPiketList={jadwalPiketList}
          onClose={() => setHasilRincianModalItem({ isOpen: false, pendaftar: null })}
        />
      )}

      {/* Global Modern Centered CSS Confirm / Notification Dialog */}
      <ConfirmDialog
        dialog={confirmDialog}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Global Modern Bottom-Center CSS Floating Toast Notifications */}
      <ToastNotification
        toasts={toasts}
        onDismiss={handleDismissToast}
      />

    </div>
  );
}
