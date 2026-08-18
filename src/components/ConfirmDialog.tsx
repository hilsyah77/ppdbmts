import React from 'react';
import { AlertTriangle, Trash2, CheckCircle2, Info, X } from 'lucide-react';

export type DialogType = 'danger' | 'warning' | 'info' | 'success';

export interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  subMessage?: string;
  type?: DialogType;
  confirmText?: string;
  cancelText?: string;
  isAlertOnly?: boolean; // if true, only show OK/Tutup button
  onConfirm: () => void;
  onCancel?: () => void;
}

interface ConfirmDialogProps {
  dialog: ConfirmDialogState;
  onClose: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ dialog, onClose }) => {
  if (!dialog.isOpen) return null;

  const {
    title,
    message,
    subMessage,
    type = 'danger',
    confirmText = 'Ya, Lanjutkan',
    cancelText = 'Batal',
    isAlertOnly = false,
    onConfirm,
    onCancel
  } = dialog;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  // Color & Icon Scheme based on DialogType
  const getIconAndStyle = () => {
    switch (type) {
      case 'danger':
        return {
          icon: <Trash2 className="w-6 h-6 text-rose-600" />,
          iconBg: 'bg-rose-50 border-rose-200 ring-4 ring-rose-50',
          confirmBtn: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
          iconBg: 'bg-amber-50 border-amber-200 ring-4 ring-amber-50',
          confirmBtn: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/30'
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
          iconBg: 'bg-emerald-50 border-emerald-200 ring-4 ring-emerald-50',
          confirmBtn: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
        };
      case 'info':
      default:
        return {
          icon: <Info className="w-6 h-6 text-blue-600" />,
          iconBg: 'bg-blue-50 border-blue-200 ring-4 ring-blue-50',
          confirmBtn: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30'
        };
    }
  };

  const { icon, iconBg, confirmBtn } = getIconAndStyle();

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleCancel}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header / Body */}
        <div className="p-6 sm:p-7">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-2xl border shrink-0 ${iconBg}`}>
              {icon}
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words whitespace-pre-line">
                {message}
              </p>
              {subMessage && (
                <p className="text-[11px] text-slate-400 font-medium pt-1">
                  {subMessage}
                </p>
              )}
            </div>

            <button
              onClick={handleCancel}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="bg-slate-50/80 px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
          {!isAlertOnly && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition-all active:scale-95 shadow-sm"
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            onClick={handleConfirm}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5 ${confirmBtn}`}
          >
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
