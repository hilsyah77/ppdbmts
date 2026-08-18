import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastNotificationProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      id="bottom-center-notification-container"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2.5 pointer-events-none w-full max-w-md px-4"
    >
      {toasts.map((t) => {
        const isSuccess = t.type === 'success';
        const isError = t.type === 'error';
        const isWarning = t.type === 'warning';

        return (
          <div
            key={t.id}
            id={`toast-item-${t.id}`}
            className={`pointer-events-auto w-full max-w-md flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-md transition-all transform animate-in slide-in-from-bottom-5 duration-300 ${
              isSuccess
                ? 'bg-slate-900/95 text-white border-emerald-500/40 shadow-emerald-950/40 ring-1 ring-emerald-500/20'
                : isError
                ? 'bg-slate-900/95 text-white border-rose-500/40 shadow-rose-950/40 ring-1 ring-rose-500/20'
                : isWarning
                ? 'bg-slate-900/95 text-white border-amber-500/40 shadow-amber-950/40 ring-1 ring-amber-500/20'
                : 'bg-slate-900/95 text-white border-blue-500/40 shadow-blue-950/40 ring-1 ring-blue-500/20'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isSuccess
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : isError
                    ? 'bg-rose-500/20 text-rose-400'
                    : isWarning
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-blue-500/20 text-blue-400'
                }`}
              >
                {isSuccess && <CheckCircle2 className="w-4 h-4" />}
                {isError && <AlertCircle className="w-4 h-4" />}
                {isWarning && <AlertTriangle className="w-4 h-4" />}
                {!isSuccess && !isError && !isWarning && <Info className="w-4 h-4" />}
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-100 truncate">{t.title}</p>
                {t.message && (
                  <p className="text-[11px] text-slate-300 font-normal truncate mt-0.5">
                    {t.message}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => onDismiss(t.id)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0"
              title="Tutup Notifikasi"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
