import React, { useState } from 'react';
import { UserSession } from '../types';

interface DashboardSesionViewProps {
  user: UserSession;
  onLogin: (email: string) => void;
  onLogout: () => void;
  onNavigateToTablero: () => void;
  activeDeliveriesCount: number;
}

export const DashboardSesionView: React.FC<DashboardSesionViewProps> = ({
  user,
  onLogin,
  onLogout,
  onNavigateToTablero,
  activeDeliveriesCount
}) => {
  const [email, setEmail] = useState<string>('mateo.rossi@email.pe');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    onLogin(email);
    setStatusMessage('¡Inicio de sesión exitoso! Bienvenido de vuelta.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <div className="py-6 max-w-4xl mx-auto flex flex-col gap-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-soria text-[#191c1f]">
          {user.isLoggedIn ? 'Dashboard de Cuenta y Sesión' : 'Iniciar Sesión en Food Now'}
        </h1>
        <p className="text-xs text-[#5b4138] mt-0.5">
          Gestiona tus direcciones de entrega, credenciales de acceso y estado de tu cuenta gastronómica.
        </p>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-700 text-[18px]">check_circle</span>
          <span>{statusMessage}</span>
        </div>
      )}

      {user.isLoggedIn ? (
        /* Logged In User Dashboard */
        <div className="flex flex-col gap-6">
          {/* User Profile Overview Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#eceef2] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 shadow-xs"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold font-soria text-[#191c1f]">{user.name}</h2>
                  {/* Cyan Highlighted State Badge */}
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-950 text-[11px] font-black border border-cyan-300">
                    SESIÓN ACTIVA
                  </span>
                </div>
                <span className="text-xs text-[#5b4138] mt-0.5">{user.email}</span>
                <span className="text-xs text-[#5b4138]">{user.phone}</span>

                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 text-[11px] font-bold border border-amber-300">
                    ⭐ {user.role}
                  </span>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    12 pedidos completados
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 shrink-0">
              <button
                type="button"
                onClick={onNavigateToTablero}
                className="h-10 px-5 rounded-full bg-[#111827] hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">dashboard</span>
                <span>Ir al Tablero Principal</span>
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="h-10 px-5 rounded-full bg-white hover:bg-red-50 text-red-600 border border-red-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-[#eceef2] flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-[#5b4138] uppercase">Entregas en curso</span>
                <span className="text-2xl font-black text-cyan-950 font-mono mt-1">
                  {activeDeliveriesCount}
                </span>
                <span className="text-[11px] text-cyan-800 font-medium">Llegando a Miraflores</span>
              </div>
              <span className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">two_wheeler</span>
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#eceef2] flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-[#5b4138] uppercase">FoodCoins Acumulados</span>
                <span className="text-2xl font-black text-amber-950 font-mono mt-1">
                  1,250
                </span>
                <span className="text-[11px] text-amber-800 font-medium">Canjeable por S/ 25</span>
              </div>
              <span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">loyalty</span>
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#eceef2] flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-[#5b4138] uppercase">Direcciones Guardadas</span>
                <span className="text-2xl font-black text-[#191c1f] font-mono mt-1">
                  {user.savedAddresses.length}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Miraflores & San Isidro</span>
              </div>
              <span className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">home_pin</span>
              </span>
            </div>
          </div>

          {/* Saved Addresses List */}
          <div className="bg-white rounded-3xl p-6 border border-[#eceef2] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-soria text-[#191c1f]">
                Tus Direcciones para Entregas Rápidas
              </h3>
              <button
                type="button"
                className="text-xs font-bold text-[#ab3500] hover:underline"
              >
                + Añadir Nueva
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {user.savedAddresses.map((addr) => (
                <div 
                  key={addr.id}
                  className={`p-4 rounded-2xl border flex flex-col gap-1 transition-all ${
                    addr.isDefault 
                      ? 'bg-slate-50 border-slate-900 shadow-xs' 
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#191c1f] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#ff5e1e]">pin_drop</span>
                      <span>{addr.label}</span>
                    </span>
                    {addr.isDefault && (
                      <span className="px-2 py-0.2 rounded-full bg-[#111827] text-white text-[10px] font-bold">
                        Predeterminada
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#5b4138] mt-1">{addr.address}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Login / Register Form */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#eceef2] shadow-sm max-w-lg mx-auto w-full flex flex-col gap-6">
          {/* Tab switch between Login and Register */}
          <div className="flex p-1 bg-[#f8f9fd] rounded-2xl border border-[#eceef2]">
            <button
              type="button"
              onClick={() => setIsRegisterMode(false)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                !isRegisterMode ? 'bg-white text-[#191c1f] shadow-xs' : 'text-[#5b4138]'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => setIsRegisterMode(true)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isRegisterMode ? 'bg-white text-[#191c1f] shadow-xs' : 'text-[#5b4138]'
              }`}
            >
              Crear Cuenta Nueva
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#191c1f]">
                Correo Electrónico
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu.correo@ejemplo.pe"
                className="h-11 px-4 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-slate-800"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#191c1f]">
                  Contraseña
                </label>
                <a href="#forgot" className="text-[11px] text-[#ab3500] hover:underline font-medium">
                  ¿Olvidaste tu clave?
                </a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                className="h-11 px-4 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-slate-800"
              />
            </div>

            <button
              type="submit"
              className="h-11 rounded-full bg-[#111827] hover:bg-black text-white text-xs font-bold mt-2 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              {isRegisterMode ? 'Registrarme y Comenzar' : 'Acceder al Tablero'}
            </button>
          </form>

          {/* Social login buttons */}
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] text-center text-slate-400 font-medium">O continúa con</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onLogin('mateo.google@gmail.com')}
                className="h-10 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center gap-2"
              >
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => onLogin('mateo.apple@icloud.com')}
                className="h-10 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center gap-2"
              >
                <span>Apple</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
