import React, { createContext, useCallback, useContext, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

const ToastContext = createContext<{
  toast: (type: ToastType, message: string) => void;
}>({ toast: () => {} });

export const useToast = () => useContext(ToastContext);

const ESTILOS: Record<ToastType, string> = {
  success: 'bg-emerald-600',
  error: 'bg-red-600',
  info: 'bg-slate-700',
  warning: 'bg-amber-500',
};

const ICONOS: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((type: ToastType, message: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`${ESTILOS[t.type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-start gap-3 animate-[slideIn_.25s_ease-out]`}
          >
            <span className="font-bold text-lg leading-none mt-0.5">{ICONOS[t.type]}</span>
            <p className="text-sm flex-1">{t.message}</p>
          </div>
        ))}
      </div>
      <style>{`@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
    </ToastContext.Provider>
  );
}
