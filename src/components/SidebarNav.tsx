import React from 'react';
import { ScreenId, SimulationState, UserSession } from '../types';
import { APP_LOGO } from '../data/mockData';

interface SidebarNavProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  simulationState: SimulationState;
  onChangeSimulationState: (state: SimulationState) => void;
  user: UserSession;
  activeDeliveryMinutes?: number;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  currentScreen,
  onNavigate,
  simulationState,
  onChangeSimulationState,
  user,
  activeDeliveryMinutes
}) => {
  const navItems: { id: ScreenId; label: string; icon: string; badge?: string }[] = [
    { id: 'tablero', label: 'Tablero Principal', icon: 'dashboard' },
    { id: 'tareas', label: 'Planificador & IA', icon: 'psychology', badge: 'Gemini' },
    { id: 'mapa', label: 'Mapa de Locales', icon: 'map' },
    { id: 'pedidos', label: 'Progreso de Pedidos', icon: 'two_wheeler', badge: activeDeliveryMinutes ? `${activeDeliveryMinutes}m` : undefined },
    { id: 'login', label: user.isLoggedIn ? 'Mi Cuenta y Sesión' : 'Iniciar Sesión', icon: 'account_circle' },
  ];

  return (
    <aside className="hidden md:flex flex-col justify-between w-64 lg:w-72 h-screen sticky top-0 bg-white border-r border-[#eceef2] p-5 shrink-0 z-30 shadow-[1px_0_10px_rgba(0,0,0,0.02)]">
      {/* Brand Header */}
      <div className="flex flex-col gap-6">
        <div 
          onClick={() => onNavigate('tablero')}
          className="flex items-center gap-3 cursor-pointer group"
          role="button"
          tabIndex={0}
        >
          <img src={APP_LOGO} alt="Food Now Logo" className="h-9 w-auto object-contain transition-transform group-hover:scale-105" />
          <div className="flex flex-col leading-none">
            <span className="font-soria text-2xl font-bold tracking-tight text-[#191c1f]">
              Food <span className="text-[#ab3500]">Now</span>
            </span>
            <span className="text-[11px] text-[#5b4138] font-medium tracking-wide mt-0.5">
              Entregas y Locales Cercanos
            </span>
          </div>
        </div>

        {/* Live Delivery Alert Capsule (Cyan highlight button/badge for live tracking state!) */}
        {activeDeliveryMinutes && (
          <div 
            onClick={() => onNavigate('pedidos')}
            className="p-3 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-950 flex items-center justify-between cursor-pointer hover:bg-cyan-100 transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-cyan-500 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                <span className="material-symbols-outlined text-[18px]">two_wheeler</span>
              </span>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-cyan-800 tracking-wider">Próxima entrega</span>
                <span className="text-xs font-extrabold text-cyan-950">Llegada en {activeDeliveryMinutes} min</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-cyan-700 text-[18px] group-hover:translate-x-0.5 transition-transform">
              chevron_right
            </span>
          </div>
        )}

        {/* Main Navigation Menu */}
        <nav className="flex flex-col gap-1.5" aria-label="Navegación principal">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                  isActive
                    ? 'bg-[#111827] text-white shadow-sm'
                    : 'text-[#5b4138] hover:text-[#191c1f] hover:bg-[#f2f3f8]'
                }`}
                type="button"
              >
                <div className="flex items-center gap-3">
                  <span 
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-400 text-cyan-950 border border-cyan-500">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Simulation Box & User Footer */}
      <div className="flex flex-col gap-4 pt-4 border-t border-[#eceef2]">
        {/* Simulation Selector for Reviewing States */}
        <div className="p-3 rounded-2xl bg-[#f8f9fd] border border-[#eceef2] flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#5b4138]">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">tune</span>
              <span>Probar Estados UI:</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 uppercase font-semibold">
              {simulationState}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => onChangeSimulationState('normal')}
              className={`px-2 py-1.5 rounded-lg text-[11px] font-bold border transition-colors ${
                simulationState === 'normal'
                  ? 'bg-white border-slate-900 text-[#191c1f] shadow-xs'
                  : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
              }`}
              type="button"
            >
              ✓ Normal
            </button>
            <button
              onClick={() => onChangeSimulationState('loading')}
              className={`px-2 py-1.5 rounded-lg text-[11px] font-bold border transition-colors ${
                simulationState === 'loading'
                  ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-xs'
                  : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
              }`}
              type="button"
            >
              ⏳ Carga
            </button>
            <button
              onClick={() => onChangeSimulationState('error')}
              className={`px-2 py-1.5 rounded-lg text-[11px] font-bold border transition-colors ${
                simulationState === 'error'
                  ? 'bg-red-100 border-red-400 text-red-900 shadow-xs'
                  : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
              }`}
              type="button"
            >
              ⚠ Error
            </button>
            <button
              onClick={() => onChangeSimulationState('empty')}
              className={`px-2 py-1.5 rounded-lg text-[11px] font-bold border transition-colors ${
                simulationState === 'empty'
                  ? 'bg-cyan-100 border-cyan-400 text-cyan-900 shadow-xs'
                  : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
              }`}
              type="button"
            >
              ∅ Vacío
            </button>
          </div>
        </div>

        {/* User Mini Profile */}
        <div 
          onClick={() => onNavigate('login')}
          className="flex items-center gap-3 p-2 rounded-2xl hover:bg-[#f2f3f8] cursor-pointer transition-colors"
          role="button"
          tabIndex={0}
        >
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover border border-slate-200"
          />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-bold text-[#191c1f] truncate">{user.name}</span>
            <span className="text-[11px] text-[#5b4138] truncate">{user.role}</span>
          </div>
          <span className="material-symbols-outlined text-slate-400 text-[18px]">
            tune
          </span>
        </div>
      </div>
    </aside>
  );
};
