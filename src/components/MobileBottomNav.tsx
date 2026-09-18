import React from 'react';
import { ScreenId } from '../types';

interface MobileBottomNavProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  activeDeliveryMinutes?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentScreen,
  onNavigate,
  activeDeliveryMinutes
}) => {
  const items: { id: ScreenId; label: string; icon: string; badge?: string; isSpecial?: boolean }[] = [
    { id: 'tablero', label: 'Inicio', icon: 'storefront' },
    { id: 'pedidos', label: 'Delivery', icon: 'two_wheeler', badge: activeDeliveryMinutes ? `${activeDeliveryMinutes}m` : undefined, isSpecial: true },
    { id: 'tareas', label: 'Plan IA', icon: 'psychology', badge: 'AI' },
    { id: 'mapa', label: 'Mapa', icon: 'map' },
    { id: 'login', label: 'Mi Cuenta', icon: 'account_circle' },
  ];

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#eceef2] px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      aria-label="Navegación móvil inferior"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {items.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center min-w-[60px] min-h-[48px] py-1 px-1.5 rounded-xl transition-all relative cursor-pointer ${
                item.isSpecial && !isActive
                  ? 'text-[#ab3500] font-bold'
                  : isActive
                  ? 'text-[#3d261e] font-extrabold bg-orange-50/80'
                  : 'text-[#5b4138] hover:text-[#3d261e]'
              }`}
              type="button"
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <span 
                  className={`material-symbols-outlined text-[22px] ${item.isSpecial ? 'text-[#ff5e1e]' : ''}`}
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>

                {item.badge && (
                  <span className="absolute -top-1.5 -right-3.5 px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-[#ff5e1e] text-white shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] leading-tight mt-0.5">{item.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff5e1e] mt-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
