import React, { useState } from 'react';
import { ScreenId, SimulationState, UserSession } from '../types';
import { APP_LOGO } from '../data/mockData';

interface HorizontalNavbarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  simulationState: SimulationState;
  onChangeSimulationState: (state: SimulationState) => void;
  user: UserSession;
  activeDeliveryMinutes?: number;
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedRadius: number;
  onRadiusChange: (radius: number) => void;
  onlyOpen: boolean;
  onToggleOnlyOpen: () => void;
  userAddress?: string;
  onOpenLocationModal?: () => void;
}

export const HorizontalNavbar: React.FC<HorizontalNavbarProps> = ({
  currentScreen,
  onNavigate,
  simulationState,
  onChangeSimulationState,
  user,
  activeDeliveryMinutes,
  cartCount,
  onOpenCart,
  searchQuery,
  onSearchChange,
  selectedRadius,
  onRadiusChange,
  onlyOpen,
  onToggleOnlyOpen,
  userAddress = 'Av. José Larco 743, Miraflores',
  onOpenLocationModal
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showFiltersBar, setShowFiltersBar] = useState(false);

  const navItems: { id: ScreenId; label: string; shortLabel: string; icon: string; badge?: string; isHighlight?: boolean }[] = [
    { id: 'tablero', label: 'Inicio', shortLabel: 'Inicio', icon: 'storefront' },
    { id: 'pedidos', label: 'Delivery', shortLabel: 'Delivery', icon: 'two_wheeler', badge: activeDeliveryMinutes ? `${activeDeliveryMinutes} min` : undefined, isHighlight: true },
    { id: 'tareas', label: 'Planificador IA', shortLabel: 'Planificador IA', icon: 'psychology', badge: 'Nutrición IA' },
    { id: 'mapa', label: 'Mapa de Locales', shortLabel: 'Mapa', icon: 'map' },
    { id: 'login', label: user.isLoggedIn ? 'Mi Cuenta' : 'Iniciar Sesión', shortLabel: 'Cuenta', icon: 'account_circle' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-[#eceef2] shadow-xs" role="banner">
      {/* Active Delivery Notification Strip (si hay un pedido activo) */}
      {activeDeliveryMinutes && activeDeliveryMinutes > 0 && (
        <div 
          onClick={() => onNavigate('pedidos')}
          className="w-full bg-linear-to-r from-[#2c1810] via-[#3d261e] to-[#ab3500] text-white px-4 py-2 flex items-center justify-between text-xs font-semibold cursor-pointer hover:opacity-95 transition-opacity border-b border-amber-400/20 shadow-xs"
          role="alert"
          aria-live="polite"
        >
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#ff5e1e] text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[16px] animate-pulse">two_wheeler</span>
              </span>
              <span className="font-black text-amber-300 uppercase tracking-wide text-[11px]">¡Pedido en camino!</span>
              <span className="hidden sm:inline text-amber-100/90 font-medium">Llegada estimada en {activeDeliveryMinutes} minutos a tu dirección.</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-300/40 text-amber-200 font-bold text-xs shrink-0 hover:bg-amber-500/30">
              <span>Ver tus próximas entregas</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Top Horizontal Menu Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          
          {/* 1. Brand Logo & Title */}
          <div 
            onClick={() => onNavigate('tablero')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0 focus-visible:outline-2 focus-visible:outline-slate-900 rounded-lg p-1"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onNavigate('tablero')}
            aria-label="Food Now - Ir al inicio"
          >
            <img 
              src={APP_LOGO} 
              alt="Food Now" 
              className="h-9 w-9 object-contain transition-transform group-hover:scale-105" 
            />
            <div className="flex flex-col leading-none">
              <span className="font-soria text-2xl font-black tracking-tight text-[#191c1f]">
                Food <span className="text-[#ab3500]">Now</span>
              </span>
              <span className="text-[10px] text-[#5b4138] font-bold tracking-wider uppercase mt-0.5 hidden xs:inline">
                Gastronomía Cercana
              </span>
            </div>
          </div>

          {/* 2. Primary Horizontal Navigation Links (Desktop & Tablet) - Centered & well-spaced */}
          <nav 
            className="hidden lg:flex items-center gap-2" 
            aria-label="Menú principal de navegación"
          >
            {navItems.map((item) => {
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`h-10 px-3.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#ff5e1e] ${
                    isActive
                      ? 'bg-[#3d261e] text-white shadow-sm border border-[#5b4138]'
                      : item.isHighlight
                      ? 'bg-orange-50 text-orange-950 border border-orange-300 hover:bg-orange-100'
                      : 'text-[#5b4138] hover:text-[#3d261e] hover:bg-orange-50/60'
                  }`}
                  type="button"
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span 
                    className="material-symbols-outlined text-[19px]"
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-tight ${
                      isActive 
                        ? 'bg-[#ff5e1e] text-white' 
                        : item.isHighlight 
                        ? 'bg-[#ff5e1e] text-white' 
                        : 'bg-orange-100 text-[#3d261e] border border-orange-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* 3. Right Utilities: Search & Filters toggle, Cart & Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* Quick Filter toggle for Tablero view */}
            <button
              type="button"
              onClick={() => setShowFiltersBar(!showFiltersBar)}
              className={`h-10 px-3 sm:px-3.5 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                showFiltersBar || searchQuery || onlyOpen || selectedRadius !== 2
                  ? 'bg-[#3d261e] text-white border-[#3d261e] shadow-xs'
                  : 'bg-stone-50 text-[#5b4138] border-stone-200 hover:bg-stone-100'
              }`}
              title="Filtros y búsqueda rápida"
              aria-expanded={showFiltersBar}
              aria-label="Alternar barra de filtros y búsqueda"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              <span className="hidden sm:inline">Filtros</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              type="button"
              onClick={onOpenCart}
              className="h-10 px-3.5 sm:px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 relative shadow-xs transition-all cursor-pointer active:scale-95"
              aria-label={`Canasta de compras con ${cartCount} platos`}
            >
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              <span className="hidden sm:inline font-bold">Canasta</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-emerald-950 font-black text-[11px] flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Avatar Button */}
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="hidden sm:flex items-center gap-2 p-1 pl-2.5 rounded-full border border-stone-200 bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer"
              title="Mi perfil"
            >
              <span className="text-xs font-bold text-[#3d261e] max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
              <img 
                src={user.avatarUrl} 
                alt={user.name} 
                className="w-7 h-7 rounded-full object-cover border border-stone-300" 
              />
            </button>

            {/* Mobile / Tablet Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden h-10 w-10 rounded-full border border-stone-200 bg-stone-50 hover:bg-stone-100 flex items-center justify-center text-stone-700 cursor-pointer"
              aria-label="Abrir menú de navegación"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="material-symbols-outlined text-[22px]">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>

          </div>
        </div>
      </div>

      {/* Secondary Horizontal Search & Filters Bar (Redistribuida más abajo con selector de ubicación) */}
      {(showFiltersBar || currentScreen === 'tablero') && (
        <div className="bg-[#f8f9fd] border-t border-[#eceef2] py-2.5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Ubicación de Entrega (Redistribuida más abajo para no saturar la barra principal) */}
            {onOpenLocationModal && (
              <button
                type="button"
                onClick={onOpenLocationModal}
                className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-orange-50 border border-orange-200 text-[#3d261e] text-xs font-bold transition-all shadow-2xs cursor-pointer max-w-full md:max-w-xs truncate group shrink-0"
                title="Haz clic para ingresar o cambiar tu ubicación de entrega"
                aria-label="Ingresar o cambiar ubicación de entrega"
              >
                <span className="material-symbols-outlined text-[19px] text-[#ff5e1e] shrink-0 group-hover:scale-110 transition-transform">
                  pin_drop
                </span>
                <div className="flex flex-col text-left truncate leading-tight">
                  <span className="text-[9px] text-[#ab3500] font-black uppercase tracking-wider">
                    Ubicación de entrega
                  </span>
                  <span className="truncate text-xs font-bold text-[#191c1f]">
                    {userAddress || 'Ingresar ubicación'}
                  </span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-stone-400 group-hover:text-stone-700 shrink-0 ml-auto md:ml-1">
                  edit_location_alt
                </span>
              </button>
            )}

            {/* Search Input */}
            <div className="flex-1 md:max-w-md relative flex items-center">
              <span className="material-symbols-outlined text-slate-400 absolute left-3.5 text-[20px] pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar puestos, lomo saltado, ceviches, bowls..."
                className="w-full h-10 pl-10 pr-9 rounded-full bg-white border border-[#eceef2] text-xs sm:text-sm text-[#191c1f] placeholder:text-slate-400 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all shadow-xs"
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

            {/* Quick Filters */}
            <div className="flex items-center justify-between md:justify-end gap-2 w-full md:w-auto">
              {/* Distance Radius */}
              <div className="flex items-center bg-white p-1 rounded-full border border-[#eceef2] shadow-2xs">
                <span className="text-[11px] font-bold text-slate-500 pl-2 pr-1 hidden sm:inline">Radio:</span>
                {[1, 2, 5].map((km) => (
                  <button
                    key={km}
                    type="button"
                    onClick={() => onRadiusChange(km)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                      selectedRadius === km
                        ? 'bg-[#111827] text-white shadow-2xs'
                        : 'text-[#5b4138] hover:text-[#191c1f]'
                    }`}
                  >
                    &lt; {km} km
                  </button>
                ))}
              </div>

              {/* Toggle Solo Abiertos */}
              <button
                type="button"
                onClick={onToggleOnlyOpen}
                className={`h-9 px-3.5 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  onlyOpen
                    ? 'bg-emerald-50 text-emerald-950 border-emerald-300 shadow-2xs font-extrabold'
                    : 'bg-white text-[#5b4138] border-slate-200 hover:bg-slate-50'
                }`}
                aria-pressed={onlyOpen}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {onlyOpen ? 'check_box' : 'check_box_outline_blank'}
                </span>
                <span>Solo Abiertos</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#eceef2] px-4 py-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Mobile Location Button */}
          {onOpenLocationModal && (
            <button
              type="button"
              onClick={() => {
                onOpenLocationModal();
                setIsMobileMenuOpen(false);
              }}
              className="w-full mb-3 flex items-center justify-between p-3 rounded-2xl bg-amber-50 border border-amber-300 text-[#191c1f] text-xs font-bold text-left transition-all cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="material-symbols-outlined text-[#ab3500] text-[22px] shrink-0">pin_drop</span>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] text-amber-900 font-black uppercase tracking-wider">Ubicación de entrega</span>
                  <span className="truncate text-slate-900 font-bold text-xs">{userAddress || 'Ingresar ubicación'}</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-white border border-amber-200 text-amber-950 text-[11px] font-black shrink-0 shadow-2xs">
                Cambiar
              </span>
            </button>
          )}

          <nav className="flex flex-col gap-1.5" aria-label="Navegación móvil">
            {navItems.map((item) => {
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-left transition-all ${
                    isActive
                      ? 'bg-[#111827] text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                  type="button"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#ff5e1e] text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};
