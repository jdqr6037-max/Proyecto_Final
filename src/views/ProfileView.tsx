import React, { useState } from 'react';
import { USER_PROFILE } from '../data/mockData';
import { ScreenId } from '../types';

interface ProfileViewProps {
  onLogout: () => void;
  onNavigate: (screen: ScreenId) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onLogout, onNavigate }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [showCouponModal, setShowCouponModal] = useState(false);

  return (
    <div className="w-full flex flex-col gap-6 max-w-2xl mx-auto pb-24">
      {/* Profile Header Card */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-[#eceef2] flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
        <div className="relative">
          <img
            src={USER_PROFILE.avatarUrl}
            alt={USER_PROFILE.name}
            className="w-24 h-24 rounded-full object-cover shadow-md ring-4 ring-[#ffdbd0]"
          />
          <button 
            type="button"
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#ff5e1e] text-white flex items-center justify-center shadow-md active:scale-95"
            title="Cambiar foto de perfil"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#191c1f]">{USER_PROFILE.name}</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#ff5e1e] to-[#ab3500] text-white text-[11px] font-bold shadow-sm">
              {USER_PROFILE.membership}
            </span>
          </div>
          <p className="text-xs text-[#5b4138] mt-0.5">{USER_PROFILE.email} • {USER_PROFILE.phone}</p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#eceef2]">
            <button 
              onClick={() => onNavigate('pedidos')}
              className="flex flex-col items-center sm:items-start p-2 rounded-xl hover:bg-[#f2f3f8] transition-colors"
              type="button"
            >
              <span className="text-base font-black text-[#191c1f]">1 Activo</span>
              <span className="text-[11px] text-[#5b4138]">En curso</span>
            </button>
            <button 
              onClick={() => onNavigate('favoritos')}
              className="flex flex-col items-center sm:items-start p-2 rounded-xl hover:bg-[#f2f3f8] transition-colors"
              type="button"
            >
              <span className="text-base font-black text-[#7d2dce]">12</span>
              <span className="text-[11px] text-[#5b4138]">Favoritos</span>
            </button>
            <button 
              onClick={() => setShowCouponModal(true)}
              className="flex flex-col items-center sm:items-start p-2 rounded-xl hover:bg-[#f2f3f8] transition-colors"
              type="button"
            >
              <span className="text-base font-black text-[#00a870]">340</span>
              <span className="text-[11px] text-[#5b4138]">FoodCoins</span>
            </button>
          </div>
        </div>
      </section>

      {/* FoodPrime Club Status Banner */}
      <section className="bg-gradient-to-r from-[#7d2dce] to-[#974ce9] rounded-2xl p-5 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-[28px]">workspace_premium</span>
          </div>
          <div>
            <h3 className="text-base font-bold">Membresía FoodPrime Activa</h3>
            <p className="text-xs text-white/90">Ahorraste S/ 68.00 este mes en envíos</p>
          </div>
        </div>
        <button 
          type="button"
          className="px-3.5 py-1.5 rounded-full bg-white text-[#7d2dce] text-xs font-bold shadow-sm"
        >
          Gestionar
        </button>
      </section>

      {/* Group: Cuenta & Preferencias */}
      <section className="bg-white rounded-3xl p-5 shadow-sm border border-[#eceef2] flex flex-col gap-3">
        <h3 className="text-xs font-bold uppercase text-[#5b4138] px-1 tracking-wider">
          Preferencias de Entrega
        </h3>

        <div className="divide-y divide-[#eceef2]">
          <div className="py-3 flex items-center justify-between hover:bg-[#f2f3f8]/50 px-2 rounded-xl cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#ff5e1e] text-[22px]">location_on</span>
              <div>
                <p className="text-sm font-bold text-[#191c1f]">Mis Direcciones Guardadas</p>
                <p className="text-xs text-[#5b4138]">3 direcciones (Miraflores, San Isidro)</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#5b4138] text-[20px]">chevron_right</span>
          </div>

          <div className="py-3 flex items-center justify-between hover:bg-[#f2f3f8]/50 px-2 rounded-xl cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#7d2dce] text-[22px]">credit_card</span>
              <div>
                <p className="text-sm font-bold text-[#191c1f]">Métodos de Pago</p>
                <p className="text-xs text-[#5b4138]">Visa •••• 4821 y Billetera Yape</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#5b4138] text-[20px]">chevron_right</span>
          </div>

          <div 
            onClick={() => setShowCouponModal(true)}
            className="py-3 flex items-center justify-between hover:bg-[#f2f3f8]/50 px-2 rounded-xl cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#00a870] text-[22px]">confirmation_number</span>
              <div>
                <p className="text-sm font-bold text-[#191c1f]">Mis Cupones & Promos</p>
                <p className="text-xs text-[#5b4138]">3 cupones disponibles para canjear</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#5b4138] text-[20px]">chevron_right</span>
          </div>
        </div>
      </section>

      {/* Group: Notificaciones */}
      <section className="bg-white rounded-3xl p-5 shadow-sm border border-[#eceef2] flex flex-col gap-3">
        <h3 className="text-xs font-bold uppercase text-[#5b4138] px-1 tracking-wider">
          Alertas de Entrega
        </h3>

        <div className="divide-y divide-[#eceef2]">
          <div className="py-3 flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#ff5e1e] text-[22px]">notifications_active</span>
              <div>
                <p className="text-sm font-bold text-[#191c1f]">Notificaciones Push</p>
                <p className="text-xs text-[#5b4138]">Estado en tiempo real del repartidor</p>
              </div>
            </div>
            <input 
              type="checkbox" 
              checked={notificationsEnabled} 
              onChange={() => setNotificationsEnabled(!notificationsEnabled)}
              className="w-5 h-5 accent-[#ff5e1e] rounded cursor-pointer" 
            />
          </div>

          <div className="py-3 flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#00a870] text-[22px]">chat</span>
              <div>
                <p className="text-sm font-bold text-[#191c1f]">Avisos por WhatsApp</p>
                <p className="text-xs text-[#5b4138]">Aviso cuando el motorizado esté afuera</p>
              </div>
            </div>
            <input 
              type="checkbox" 
              checked={whatsappAlerts} 
              onChange={() => setWhatsappAlerts(!whatsappAlerts)}
              className="w-5 h-5 accent-[#00a870] rounded cursor-pointer" 
            />
          </div>
        </div>
      </section>

      {/* Group: Ayuda & Salir */}
      <section className="bg-white rounded-3xl p-5 shadow-sm border border-[#eceef2] flex flex-col gap-3">
        <div className="py-2 flex items-center justify-between hover:bg-[#f2f3f8]/50 px-2 rounded-xl cursor-pointer">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#5b4138] text-[22px]">help_center</span>
            <p className="text-sm font-bold text-[#191c1f]">Centro de Ayuda y Preguntas Frecuentes</p>
          </div>
          <span className="material-symbols-outlined text-[#5b4138] text-[20px]">chevron_right</span>
        </div>

        <div className="py-2 flex items-center justify-between hover:bg-[#f2f3f8]/50 px-2 rounded-xl cursor-pointer">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#5b4138] text-[22px]">security</span>
            <p className="text-sm font-bold text-[#191c1f]">Seguridad y Privacidad</p>
          </div>
          <span className="material-symbols-outlined text-[#5b4138] text-[20px]">chevron_right</span>
        </div>

        <button
          onClick={onLogout}
          className="mt-2 w-full h-11 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center gap-2 transition-colors active:scale-95"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span>Cerrar Sesión</span>
        </button>
      </section>

      {/* Coupons Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#191c1f]">Cupones Disponibles</h3>
              <button onClick={() => setShowCouponModal(false)} className="w-8 h-8 rounded-full bg-[#f2f3f8] flex items-center justify-center">✕</button>
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="p-3 rounded-2xl bg-[#ffdbd0]/40 border border-[#ff5e1e]/20 flex justify-between items-center">
                <div>
                  <p className="text-xs font-black text-[#ff5e1e]">BIENVENIDOFOOD</p>
                  <p className="text-[11px] text-[#5b4138]">S/ 10.00 de descuento en tu orden</p>
                </div>
                <span className="text-[10px] bg-[#ff5e1e] text-white px-2 py-0.5 rounded-full font-bold">Activo</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#efdbff]/40 border border-[#7d2dce]/20 flex justify-between items-center">
                <div>
                  <p className="text-xs font-black text-[#7d2dce]">FOODPRIMEGRATIS</p>
                  <p className="text-[11px] text-[#5b4138]">Envío sin costo en platos criollos</p>
                </div>
                <span className="text-[10px] bg-[#7d2dce] text-white px-2 py-0.5 rounded-full font-bold">Activo</span>
              </div>
            </div>
            <button
              onClick={() => setShowCouponModal(false)}
              className="w-full h-11 rounded-full bg-[#191c1f] text-white text-xs font-bold"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
