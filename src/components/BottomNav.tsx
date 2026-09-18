import React from 'react';
import { ScreenId } from '../types';

interface BottomNavProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const navItems: { id: ScreenId; label: string; icon: string }[] = [
    { id: 'explorar', label: 'Explorar', icon: 'explore' },
    { id: 'pedidos', label: 'Pedidos', icon: 'receipt_long' },
    { id: 'favoritos', label: 'Favoritos', icon: 'favorite' },
    { id: 'perfil', label: 'Perfil', icon: 'account_circle' }
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full z-40 pb-safe pointer-events-none px-4 mb-3">
      <nav className="pointer-events-auto mx-auto max-w-md bg-white/95 backdrop-blur-xl rounded-full p-1.5 flex items-center justify-between shadow-[0_12px_32px_-4px_rgba(26,29,32,0.14)] border border-black/5">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 h-11 rounded-full transition-all duration-200 ${
                isActive
                  ? 'bg-[#ff5e1e] text-white shadow-[0_8px_20px_-2px_rgba(255,94,30,0.4)] font-bold'
                  : 'text-[#5b4138] hover:text-[#191c1f]'
              }`}
              type="button"
            >
              <span 
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span className="text-xs font-semibold">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
