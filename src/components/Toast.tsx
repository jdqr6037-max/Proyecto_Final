import React from 'react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'info' | 'error';
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-bounce transition-all duration-300 pointer-events-none flex items-center gap-2.5 bg-[#191c1f] text-white px-6 py-3.5 rounded-full shadow-2xl border border-white/10">
      <span className="material-symbols-outlined text-[#6efcb9] text-[22px]">
        {type === 'error' ? 'error' : 'check_circle'}
      </span>
      <span className="text-sm font-semibold tracking-wide">{message}</span>
    </div>
  );
};
