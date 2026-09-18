import React from 'react';
import { UserSession } from '../types';

interface TopHeaderProps {
  user: UserSession;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedRadius: number;
  onRadiusChange: (radius: number) => void;
  onlyOpen: boolean;
  onToggleOnlyOpen: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onNavigateToLogin: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  user,
  searchQuery,
  onSearchChange,
  selectedRadius,
  onRadiusChange,
  onlyOpen,
  onToggleOnlyOpen,
  cartCount,
  onOpenCart,
  onNavigateToLogin
}) => {
  return (
    <header className="w-full bg-white border-b border-[#eceef2] sticky top-0 z-20 px-4 sm:px-6 py-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input for Food & Stalls */}
        <div className="w-full md:max-w-md relative flex items-center">
          <span className="material-symbols-outlined text-slate-400 absolute left-3.5 text-[20px] pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar puestos de comida, lomo saltado, ceviches..."
            className="w-full h-11 pl-10 pr-4 rounded-full bg-[#f8f9fd] border border-[#eceef2] text-xs sm:text-sm text-[#191c1f] placeholder:text-slate-400 focus:outline-none focus:border-slate-800 focus:bg-white transition-all shadow-xs"
            aria-label="Buscar comida y puestos cercanos"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 text-slate-400 hover:text-slate-600"
              aria-label="Limpiar búsqueda"
            >
              <span className="material-symbols-outlined text-[18px]">cancel</span>
            </button>
          )}
        </div>

        {/* Quick Filters Bar & User Actions */}
        <div className="flex items-center justify-between md:justify-end gap-2 w-full md:w-auto">
          {/* Distance Filter Selector */}
          <div className="flex items-center bg-[#f8f9fd] p-1 rounded-full border border-[#eceef2]">
            {[1, 2, 5].map((km) => (
              <button
                key={km}
                type="button"
                onClick={() => onRadiusChange(km)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  selectedRadius === km
                    ? 'bg-white text-[#191c1f] shadow-xs'
                    : 'text-[#5b4138] hover:text-[#191c1f]'
                }`}
              >
                &lt; {km} km
              </button>
            ))}
          </div>

          {/* Toggle Solo Abiertos (Non-color reliant with clear check icon and text) */}
          <button
            type="button"
            onClick={onToggleOnlyOpen}
            className={`h-9 px-3.5 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
              onlyOpen
                ? 'bg-emerald-50 text-emerald-950 border-emerald-300 shadow-xs'
                : 'bg-white text-[#5b4138] border-slate-200 hover:bg-slate-50'
            }`}
            aria-pressed={onlyOpen}
          >
            <span className="material-symbols-outlined text-[16px]">
              {onlyOpen ? 'check_box' : 'check_box_outline_blank'}
            </span>
            <span className="hidden sm:inline">Solo Abiertos</span>
            <span className="sm:hidden">Abiertos</span>
          </button>

          {/* Cart Trigger */}
          <button
            type="button"
            onClick={onOpenCart}
            className="h-10 px-4 rounded-full bg-[#111827] hover:bg-black text-white text-xs font-bold flex items-center gap-2 relative shadow-xs active:scale-95 transition-all cursor-pointer"
            aria-label={`Ver canasta con ${cartCount} productos`}
          >
            <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
            <span className="hidden sm:inline">Canasta</span>
            {cartCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-stone-950 font-black text-[10px]">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Profile Trigger */}
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="md:hidden w-10 h-10 rounded-full border border-slate-200 overflow-hidden shrink-0"
            aria-label="Abrir perfil de usuario"
          >
            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
          </button>
        </div>
      </div>
    </header>
  );
};
