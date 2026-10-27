import React from 'react';
import { useStudy } from '../context/StudyContext';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useStudy();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isInfo = toast.type === 'info';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border bg-white shadow-lg transition-all transform animate-in slide-in-from-bottom-3 duration-200 ${
              isSuccess
                ? 'border-emerald-200 text-slate-800'
                : isWarning
                ? 'border-amber-200 text-slate-800'
                : isInfo
                ? 'border-indigo-200 text-slate-800'
                : 'border-rose-200 text-slate-800'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {isInfo && <Info className="w-5 h-5 text-indigo-600" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-600" />}
              {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-600" />}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 leading-tight">{toast.title}</p>
              {toast.message && (
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
              )}
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
