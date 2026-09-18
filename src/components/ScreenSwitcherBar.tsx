import React from 'react';
import { ScreenId } from '../types';

interface ScreenSwitcherBarProps {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  isMobileFrame: boolean;
  onToggleFrame: () => void;
}

export const ScreenSwitcherBar: React.FC<ScreenSwitcherBarProps> = ({
  currentScreen,
  onSelectScreen,
  isMobileFrame,
  onToggleFrame,
}) => {
  const screens: { id: ScreenId; label: string; icon: string; badge?: string }[] = [
    { id: 'explorar', label: 'Explorar Feed', icon: 'restaurant' },
    { id: 'mapa', label: 'Mapa en Vivo', icon: 'map', badge: 'GPS' },
    { id: 'favoritos', label: 'Tus Favoritos', icon: 'favorite' },
    { id: 'pedidos', label: 'Pedidos en Curso', icon: 'receipt_long', badge: '1 activo' },
    { id: 'checkout', label: 'Checkout Seguro', icon: 'shopping_cart_checkout' },
    { id: 'perfil', label: 'Mi Perfil', icon: 'account_circle' },
    { id: 'login', label: 'Iniciar Sesión', icon: 'login' },
  ];

  return (
    <div className="bg-[#191c1f] text-white px-3 py-2 border-b border-white/10 sticky top-0 z-50 shadow-md">
      <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Screens label & pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-white/50 mr-1 flex items-center gap-1 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#ff5e1e]"></span>
            Pantallas:
          </span>
          {screens.map((s) => {
            const isActive = currentScreen === s.id;
            return (
              <button
                key={s.id}
                onClick={() => onSelectScreen(s.id)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all ${
                  isActive
                    ? 'bg-[#ff5e1e] text-white shadow-sm font-bold'
                    : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[15px]">{s.icon}</span>
                <span>{s.label}</span>
                {s.badge && (
                  <span className="text-[9px] bg-black/40 px-1.5 py-0.2 rounded-full font-bold">
                    {s.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Toggle Mobile Phone Frame vs Full Desktop */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onToggleFrame}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
              isMobileFrame
                ? 'bg-[#7d2dce] text-white shadow-sm'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
            type="button"
            title="Alternar entre marco de celular (390px) y vista completa"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isMobileFrame ? 'phone_iphone' : 'desktop_windows'}
            </span>
            <span>{isMobileFrame ? 'Vista Móvil (390px)' : 'Vista Completa'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
