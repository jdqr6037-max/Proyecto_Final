import React, { useState } from 'react';
import { ScreenId } from '../types';
import { APP_LOGO, USER_PROFILE } from '../data/mockData';

interface HeaderProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  cartCount: number;
  onOpenCart: () => void;
  currentAddress: string;
  onSelectAddress: (addr: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  cartCount,
  onOpenCart,
  currentAddress,
  onSelectAddress
}) => {
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);

  const addresses = [
    { label: 'Casa (Predeterminada)', address: 'Av. José Larco 743, Dpto 502, Miraflores' },
    { label: 'Oficina', address: 'Av. Las Camelias 490, Piso 8, San Isidro' },
    { label: 'Casa de Playa', address: 'Malecón de la Marina 120, Miraflores' }
  ];

  return (
    <header className="sticky top-0 left-0 w-full z-40 bg-white/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#eceef2]/80">
      <div className="h-16 md:h-20 max-w-[1440px] mx-auto px-4 md:px-8 flex items-center justify-between gap-3 md:gap-6">
        {/* Logo & Address */}
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          <button 
            onClick={() => onNavigate('explorar')}
            className="flex items-center gap-2 text-left cursor-pointer group"
            type="button"
          >
            <img 
              src={APP_LOGO} 
              alt="Food Now Logo" 
              className="h-8 md:h-9 w-auto object-contain transition-transform group-hover:scale-105" 
            />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-lg md:text-xl font-black tracking-tight text-[#191c1f]">
                Food<span className="text-[#ff5e1e]">Now</span>
              </span>
              <span className="text-[10px] text-[#5b4138] font-semibold -mt-0.5">
                Entrega express en Lima
              </span>
            </div>
          </button>

          {/* Location Picker */}
          <div className="relative">
            <button 
              onClick={() => setShowAddressDropdown(!showAddressDropdown)}
              className="flex items-center gap-1.5 bg-[#f2f3f8] hover:bg-[#eceef2] transition-colors py-1.5 md:py-2 px-3 md:px-4 rounded-full text-left"
              type="button"
            >
              <span className="material-symbols-outlined text-[#ff5e1e] text-[18px] md:text-[20px]">
                location_on
              </span>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-[#5b4138] leading-none hidden md:inline">
                  Entregar en
                </span>
                <span className="text-xs md:text-sm font-bold text-[#191c1f] truncate max-w-[120px] sm:max-w-[150px] md:max-w-[190px] leading-tight">
                  {currentAddress}
                </span>
              </div>
              <span className="material-symbols-outlined text-[#5b4138] text-[16px] md:text-[18px]">
                expand_more
              </span>
            </button>

            {/* Address Modal Dropdown */}
            {showAddressDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowAddressDropdown(false)}
                />
                <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl p-3 z-50 border border-[#eceef2]">
                  <div className="flex items-center justify-between px-2 py-1 mb-1 border-b border-[#eceef2]">
                    <span className="text-xs font-bold text-[#191c1f]">Direcciones de Entrega</span>
                    <span className="text-[11px] text-[#ff5e1e] font-bold cursor-pointer">+ Nueva</span>
                  </div>
                  {addresses.map((addr) => (
                    <button
                      key={addr.label}
                      onClick={() => {
                        onSelectAddress(addr.address);
                        setShowAddressDropdown(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl transition-colors flex items-start gap-2.5 ${
                        currentAddress.includes(addr.address.slice(0, 15)) 
                          ? 'bg-[#ffdbd0]/30 text-[#191c1f]' 
                          : 'hover:bg-[#f2f3f8] text-[#5b4138]'
                      }`}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[#ff5e1e] text-[18px] mt-0.5">
                        home_pin
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-[#191c1f]">{addr.label}</span>
                        <span className="text-[11px] text-[#5b4138] truncate">{addr.address}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Global Search Bar (Desktop) */}
        <div className="flex-1 max-w-md hidden lg:block mx-4">
          <div className="relative flex items-center w-full bg-[#f2f3f8] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#ff5e1e] rounded-full transition-all">
            <span className="material-symbols-outlined absolute left-4 text-[#5b4138] text-[20px]">
              search
            </span>
            <input 
              type="text"
              placeholder="¿Qué te provoca pedir hoy? Lomo saltado, ceviche..."
              className="w-full h-11 pl-11 pr-4 bg-transparent text-sm text-[#191c1f] outline-none placeholder:text-[#5b4138]/70"
            />
          </div>
        </div>

        {/* Desktop Quick Nav Links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onNavigate('explorar')}
            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
              currentScreen === 'explorar'
                ? 'bg-[#ff5e1e] text-white shadow-md shadow-[#ff5e1e]/30'
                : 'text-[#5b4138] hover:text-[#191c1f] hover:bg-[#f2f3f8]'
            }`}
            type="button"
          >
            Explorar
          </button>
          <button
            onClick={() => onNavigate('mapa')}
            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
              currentScreen === 'mapa'
                ? 'bg-[#ff5e1e] text-white shadow-md shadow-[#ff5e1e]/30'
                : 'text-[#5b4138] hover:text-[#191c1f] hover:bg-[#f2f3f8]'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">map</span>
            <span>Mapa en Vivo</span>
          </button>
          <button
            onClick={() => onNavigate('pedidos')}
            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
              currentScreen === 'pedidos'
                ? 'bg-[#ff5e1e] text-white shadow-md shadow-[#ff5e1e]/30'
                : 'text-[#5b4138] hover:text-[#191c1f] hover:bg-[#f2f3f8]'
            }`}
            type="button"
          >
            Pedidos
          </button>
          <button
            onClick={() => onNavigate('favoritos')}
            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
              currentScreen === 'favoritos'
                ? 'bg-[#ff5e1e] text-white shadow-md shadow-[#ff5e1e]/30'
                : 'text-[#5b4138] hover:text-[#191c1f] hover:bg-[#f2f3f8]'
            }`}
            type="button"
          >
            Favoritos
          </button>
        </nav>

        {/* Action Controls: Cart & Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Canasta Cart Trigger */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center justify-center gap-1.5 h-10 px-3.5 rounded-full bg-[#f2f3f8] hover:bg-[#eceef2] transition-all text-[#191c1f]"
            type="button"
            aria-label="Abrir canasta"
          >
            <span className="material-symbols-outlined text-[20px] text-[#ff5e1e]">
              shopping_bag
            </span>
            <span className="text-xs font-bold hidden sm:inline">Canasta</span>
            {cartCount > 0 && (
              <span className="flex items-center justify-center px-1.5 min-w-5 h-5 rounded-full bg-[#ff5e1e] text-white text-[11px] font-bold shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile avatar */}
          <button
            onClick={() => onNavigate('perfil')}
            className={`w-9 h-9 rounded-full p-0.5 flex items-center justify-center transition-all ${
              currentScreen === 'perfil'
                ? 'ring-2 ring-[#ff5e1e] shadow-md'
                : 'hover:opacity-90'
            }`}
            type="button"
            title="Ir a mi perfil"
          >
            <img 
              src={USER_PROFILE.avatarUrl} 
              alt={USER_PROFILE.name}
              className="w-full h-full rounded-full object-cover shadow-sm" 
            />
          </button>
        </div>
      </div>
    </header>
  );
};
