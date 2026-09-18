import React from 'react';
import { OrderTracking } from '../types';

interface UpcomingDeliveryCardProps {
  order: OrderTracking;
  onOpenDetail: () => void;
  onOpenLiveMap?: () => void;
}

export const UpcomingDeliveryCard: React.FC<UpcomingDeliveryCardProps> = ({
  order,
  onOpenDetail,
  onOpenLiveMap
}) => {
  return (
    <section 
      className="w-full bg-white rounded-3xl p-5 sm:p-6 border border-[#eceef2] shadow-sm flex flex-col gap-4 relative overflow-hidden"
      aria-label="Información de próxima entrega activa"
    >
      {/* Top Banner: Status + ETA */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Pulsing Orange Motorbike State Indicator */}
          <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-300 text-[#ff5e1e] flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[28px] animate-bounce">two_wheeler</span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-orange-950 bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff5e1e] animate-ping"></span>
                <span>Próxima Entrega en Curso</span>
              </span>
              <span className="text-xs text-stone-500 font-mono">#{order.id}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-soria text-[#191c1f] mt-0.5">
              {order.title}
            </h2>
          </div>
        </div>

        {/* Highlighted Warm Brown & Orange Badge for Arrival Time */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#3d261e] border border-orange-400/40 text-white shadow-xs">
          <span className="material-symbols-outlined text-[20px] text-amber-400">timer</span>
          <div className="flex flex-col leading-none">
            <span className="text-[10px] uppercase font-bold text-amber-200">Llegada estimada</span>
            <span className="text-sm font-black text-white font-mono">
              ~ {order.etaMinutes} minutos ({order.estimatedArrivalHour})
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar & Stepper Indicator */}
      <div className="p-4 rounded-2xl bg-[#fdfbf7] border border-orange-100 flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-extrabold text-[#3d261e] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#ff5e1e]">navigation</span>
            <span>Estado: <strong>{order.statusText}</strong></span>
          </span>
          <span className="text-[11px] text-[#5b4138] font-semibold">
            Paso {order.stepNumber} de 4
          </span>
        </div>

        {/* Visual Progress Bar (Orange/Amber gradient for active progress) */}
        <div className="w-full h-2.5 rounded-full bg-stone-200 overflow-hidden relative">
          <div 
            className="h-full bg-linear-to-r from-amber-500 via-orange-500 to-[#ff5e1e] rounded-full transition-all duration-500 relative"
            style={{ width: `${(order.stepNumber / 4) * 100}%` }}
          >
            <div className="absolute inset-0 bg-white/25 animate-[shimmer_2s_infinite]"></div>
          </div>
        </div>

        {/* 4 Step Labels */}
        <div className="grid grid-cols-4 gap-1 text-[11px] font-bold text-center">
          <div className="flex flex-col items-center text-emerald-800">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            <span>1. Confirmado</span>
          </div>
          <div className="flex flex-col items-center text-emerald-800">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            <span>2. Cocinado</span>
          </div>
          <div className="flex flex-col items-center text-[#ff5e1e] font-black">
            <span className="material-symbols-outlined text-[16px] text-[#ff5e1e] animate-pulse">two_wheeler</span>
            <span>3. En Reparto</span>
          </div>
          <div className="flex flex-col items-center text-stone-400 font-medium">
            <span className="material-symbols-outlined text-[14px]">radio_button_unchecked</span>
            <span>4. Entrega</span>
          </div>
        </div>
      </div>

      {/* Driver and Delivery Location Summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#5b4138] pt-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-orange-100 text-[#3d261e] flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[18px]">sports_motorsports</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[#191c1f]">{order.driver.name}</span>
            <span className="text-[11px]">{order.driver.vehicle} ({order.driver.plate})</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-stone-600">
          <span className="material-symbols-outlined text-[16px] text-[#ab3500]">pin_drop</span>
          <span className="truncate max-w-[240px] sm:max-w-xs">{order.deliveryAddress}</span>
        </div>
      </div>

      {/* Visible Action CTAs (Prioridad requerida por el usuario) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#eceef2]">
        <div className="text-xs">
          <span className="text-[#5b4138]">Total del pedido: </span>
          <strong className="text-sm text-[#3d261e]">S/ {order.total.toFixed(2)}</strong>
        </div>

        <div className="flex items-center gap-2">
          {onOpenLiveMap && (
            <button
              onClick={onOpenLiveMap}
              type="button"
              className="h-10 px-4 rounded-full bg-orange-50 hover:bg-orange-100 text-[#3d261e] border border-orange-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-[#ff5e1e]">map</span>
              <span>Ver en Mapa</span>
            </button>
          )}

          {/* High visibility CTA to open full details */}
          <button
            onClick={onOpenDetail}
            type="button"
            className="h-10 px-5 rounded-full bg-[#3d261e] hover:bg-[#25150f] text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-transform active:scale-95 cursor-pointer border border-[#5b4138]"
            aria-label="Abrir detalle completo de la próxima entrega"
          >
            <span>Ver Detalle del Pedido</span>
            <span className="material-symbols-outlined text-[16px]">visibility</span>
          </button>
        </div>
      </div>
    </section>
  );
};
