import React from 'react';
import { OrderTracking } from '../types';
import { EmptyState } from '../components/states/EmptyState';

interface ProgresoPedidosViewProps {
  currentOrder: OrderTracking | null;
  onOpenDetail: () => void;
  onNavigateToTablero: () => void;
}

export const ProgresoPedidosView: React.FC<ProgresoPedidosViewProps> = ({
  currentOrder,
  onOpenDetail,
  onNavigateToTablero
}) => {
  if (!currentOrder) {
    return (
      <div className="py-8">
        <EmptyState
          type="deliveries"
          title="No tienes entregas en curso"
          description="Todos tus pedidos anteriores han sido entregados con éxito. ¡Explora nuevos puestos de comida!"
          actionText="Buscar comida ahora"
          onAction={onNavigateToTablero}
        />
      </div>
    );
  }

  return (
    <div className="py-6 flex flex-col gap-8 max-w-4xl mx-auto">
      {/* View Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-soria text-[#191c1f]">
            Progreso de tus Entregas
          </h1>
          <p className="text-xs text-[#5b4138] mt-0.5">
            Monitoreo en vivo de cocina, repartidor asignado y tiempo estimado de llegada.
          </p>
        </div>

        {/* Highlighted Warm Orange & Brown State Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-300 text-orange-950 self-start sm:self-auto shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5e1e] animate-ping"></span>
          <span className="text-xs font-black">Estado: {currentOrder.statusText}</span>
        </div>
      </div>

      {/* Main Tracking Card */}
      <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-sm flex flex-col gap-6">
        {/* Header with Order ID and Restaurant */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#eceef2]">
          <div className="flex items-center gap-3">
            <img
              src={currentOrder.dishImageUrl}
              alt={currentOrder.title}
              className="w-16 h-16 rounded-2xl object-cover border border-orange-200 shrink-0 shadow-xs"
            />
            <div className="flex flex-col">
              <span className="text-xs uppercase font-extrabold text-[#ab3500]">Orden activa #{currentOrder.id}</span>
              <h2 className="text-lg font-bold font-soria text-[#191c1f]">{currentOrder.restaurantName}</h2>
              <span className="text-xs text-[#5b4138]">{currentOrder.itemsSummary}</span>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-bold text-[#5b4138]">Llegada prevista</span>
            <span className="text-xl font-extrabold text-[#ff5e1e] font-mono">
              ~ {currentOrder.etaMinutes} min ({currentOrder.estimatedArrivalHour})
            </span>
          </div>
        </div>

        {/* 4-Step Progress Flow */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#3d261e] uppercase tracking-wide">
              Etapas del Pedido
            </span>
            <span className="text-xs text-[#5b4138] font-semibold">
              Actualizado hace 1 minuto
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {currentOrder.timeline.map((step) => {
              const isDone = step.completed;
              const isCurrent = step.current;

              return (
                <div 
                  key={step.step}
                  className={`p-4 rounded-2xl border flex flex-col gap-2 transition-all ${
                    isCurrent
                      ? 'bg-orange-50/90 border-orange-300 ring-2 ring-orange-200/80 shadow-xs'
                      : isDone
                      ? 'bg-[#fdfbf7] border-emerald-200 text-emerald-950'
                      : 'bg-white border-stone-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span 
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        isDone
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-[#ff5e1e] text-white animate-pulse'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {isDone ? 'check' : step.icon}
                      </span>
                    </span>
                    <span className="text-[11px] font-mono text-stone-500">{step.time}</span>
                  </div>

                  <span className="text-xs font-bold text-[#191c1f] leading-snug">
                    {step.step}. {step.label}
                  </span>
                  <p className="text-[11px] text-[#5b4138] leading-tight">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Motorizado Contact and Direction */}
        <div className="p-4 rounded-2xl bg-[#fdfbf7] border border-orange-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-orange-100 text-[#3d261e] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[24px]">sports_motorsports</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#191c1f]">{currentOrder.driver.name}</span>
              <span className="text-[11px] text-[#5b4138]">
                {currentOrder.driver.vehicle} • Placa {currentOrder.driver.plate} • ⭐ {currentOrder.driver.rating}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${currentOrder.driver.phone}`}
              className="h-9 px-4 rounded-full bg-white hover:bg-orange-50 text-[#3d261e] border border-orange-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-[#ff5e1e]">call</span>
              <span>Llamar al Repartidor</span>
            </a>

            {/* Prominent CTA to open full modal detail */}
            <button
              onClick={onOpenDetail}
              type="button"
              className="h-9 px-4 rounded-full bg-[#3d261e] hover:bg-[#ff5e1e] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all border border-[#5b4138]"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span>Ver Detalle Completo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Historial Reciente */}
      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-bold font-soria text-[#191c1f]">
          Historial de Entregas Anteriores
        </h2>

        <div className="flex flex-col gap-3">
          <div className="p-4 rounded-2xl bg-white border border-[#eceef2] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[20px]">task_alt</span>
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#191c1f]">Ceviche Clásico Marino • La Barra Marina</span>
                <span className="text-[11px] text-[#5b4138]">Entregado ayer a las 14:10 • S/ 36.00</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onNavigateToTablero}
              className="h-8 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold"
            >
              Pedir de Nuevo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
