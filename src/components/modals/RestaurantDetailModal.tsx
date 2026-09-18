import React from 'react';
import { Restaurant } from '../../types';

interface RestaurantDetailModalProps {
  restaurant: Restaurant | null;
  onClose: () => void;
  onSelectDish?: (dishName: string) => void;
}

export const RestaurantDetailModal: React.FC<RestaurantDetailModalProps> = ({
  restaurant,
  onClose,
  onSelectDish
}) => {
  if (!restaurant) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-restaurant-title"
    >
      <div 
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 border border-[#eceef2]">
        {/* Modal Banner */}
        <div className="relative h-48 sm:h-56 w-full bg-slate-100 overflow-hidden shrink-0">
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors active:scale-95"
            type="button"
            aria-label="Cerrar ventana de detalles"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>

          {/* Type Badge & Distance */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#191c1f] text-xs font-extrabold shadow-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-cyan-600">storefront</span>
              <span>{restaurant.stallType}</span>
            </span>

            <span className="px-2.5 py-1 rounded-full bg-black/60 text-white text-xs font-semibold backdrop-blur-md flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">near_me</span>
              <span>A {restaurant.distanceKm} km de ti</span>
            </span>
          </div>

          {/* Restaurant Title and District in Banner */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h2 id="modal-restaurant-title" className="text-2xl sm:text-3xl font-bold font-soria tracking-tight">
              {restaurant.name}
            </h2>
            <p className="text-xs sm:text-sm text-white/85 flex items-center gap-2 mt-0.5">
              <span>{restaurant.cuisine}</span>
              <span>•</span>
              <span>{restaurant.district}</span>
            </p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex flex-col gap-5">
          {/* Status and Opening Hours Bar (Non-color reliant indicator) */}
          <div className="p-4 rounded-2xl bg-[#f8f9fd] border border-[#eceef2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
                  restaurant.isOpen
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-rose-50 text-rose-700 border-rose-300'
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">
                  {restaurant.isOpen ? 'door_front' : 'lock_clock'}
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-[#191c1f]">
                    {restaurant.isOpen ? 'ESTADO: ABIERTO PARA PEDIDOS' : 'ESTADO: CERRADO TEMPORALMENTE'}
                  </span>
                  <span 
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                      restaurant.isOpen 
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-400' 
                        : 'bg-rose-100 text-rose-900 border-rose-400'
                    }`}
                  >
                    {restaurant.statusLabel}
                  </span>
                </div>
                <span className="text-xs text-[#5b4138] mt-0.5">
                  Horario de atención: <strong>{restaurant.openingHoursText}</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-[#5b4138] sm:border-l sm:border-[#eceef2] sm:pl-4">
              <div className="flex flex-col">
                <span className="font-bold text-[#191c1f] flex items-center gap-1">
                  <span className="material-symbols-outlined text-amber-500 text-[16px]">star</span>
                  {restaurant.rating} ({restaurant.reviewsCount}+)
                </span>
                <span className="text-[11px]">Valoración clientes</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[#191c1f] flex items-center gap-1">
                  <span className="material-symbols-outlined text-cyan-600 text-[16px]">moped</span>
                  {restaurant.eta}
                </span>
                <span className="text-[11px]">Envío {restaurant.deliveryFee}</span>
              </div>
            </div>
          </div>

          {/* Promotion Validity Dates Box (Yellow highlighted state box) */}
          {restaurant.promotion && (
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex flex-col gap-2 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-amber-400 text-amber-950 font-black text-xs flex items-center justify-center">
                    %
                  </span>
                  <span className="text-xs uppercase font-extrabold tracking-wider text-amber-900">
                    Promoción Vigente de la Tienda
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 text-xs font-black border border-amber-500">
                  {restaurant.promotion.discountTag}
                </span>
              </div>

              <h4 className="text-base font-bold text-stone-900">
                {restaurant.promotion.title}
              </h4>
              <p className="text-xs text-stone-700 leading-relaxed">
                {restaurant.promotion.description}
              </p>

              {/* Explicit validity dates requested by user */}
              <div className="mt-1 pt-2 border-t border-amber-200/80 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-amber-950">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-amber-700">calendar_today</span>
                  <span>{restaurant.promotion.dateRangeText}</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 text-[11px]">
                  Vence en {restaurant.promotion.daysLeft} días
                </span>
              </div>
            </div>
          )}

          {/* Physical Address and Direct Access */}
          <div className="flex items-start gap-2 text-xs text-[#5b4138]">
            <span className="material-symbols-outlined text-[18px] text-[#ff5e1e] shrink-0 mt-0.5">location_on</span>
            <div>
              <span className="font-bold text-[#191c1f]">Dirección del establecimiento:</span> {restaurant.address}.
              <p className="text-[11px] text-slate-500 mt-0.5">{restaurant.scheduleNote}</p>
            </div>
          </div>

          {/* Carta / Platos Sugeridos */}
          <div className="flex flex-col gap-2.5 pt-1 border-t border-[#eceef2]">
            <span className="text-sm font-bold text-[#191c1f]">Especialidades de la Casa para Pedir:</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-white border border-[#eceef2] flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#191c1f]">Plato Principal Recomendado</span>
                  <span className="text-[11px] text-[#5b4138]">Preparación al instante</span>
                  <span className="text-xs font-black text-[#191c1f] mt-1">S/ {restaurant.minOrder.toFixed(2)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onSelectDish?.(restaurant.name);
                    onClose();
                  }}
                  className="h-8 px-3 rounded-full bg-[#111827] text-white text-[11px] font-bold hover:bg-black active:scale-95"
                >
                  + Agregar
                </button>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#eceef2] flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#191c1f]">Bebida o Acompañamiento</span>
                  <span className="text-[11px] text-[#5b4138]">Chicha Morada o Gaseosa</span>
                  <span className="text-xs font-black text-[#191c1f] mt-1">S/ 6.50</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onSelectDish?.(restaurant.name);
                    onClose();
                  }}
                  className="h-8 px-3 rounded-full bg-[#111827] text-white text-[11px] font-bold hover:bg-black active:scale-95"
                >
                  + Agregar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#eceef2] flex items-center justify-between gap-3 shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-[#5b4138]">Tiempo estimado</span>
            <span className="text-sm font-extrabold text-[#191c1f]">{restaurant.eta} puerta a puerta</span>
          </div>

          <button
            type="button"
            disabled={!restaurant.isOpen}
            onClick={() => {
              onSelectDish?.(restaurant.name);
              onClose();
            }}
            className={`h-11 px-6 rounded-full text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer ${
              restaurant.isOpen
                ? 'bg-[#111827] hover:bg-black text-white'
                : 'bg-slate-200 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {restaurant.isOpen ? 'shopping_bag' : 'schedule'}
            </span>
            <span>{restaurant.isOpen ? 'Pedir Ahora para Entrega' : 'Local Cerrado por el Momento'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
