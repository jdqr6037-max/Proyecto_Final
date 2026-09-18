import React, { useEffect } from 'react';
import { OrderTracking } from '../../types';

interface DeliveryDetailModalProps {
  isOpen?: boolean;
  order: OrderTracking | null;
  onClose: () => void;
  onAdvanceOrderStep?: () => void;
  onNavigateToTracking?: () => void;
}

export const DeliveryDetailModal: React.FC<DeliveryDetailModalProps> = ({
  isOpen = true,
  order,
  onClose,
  onAdvanceOrderStep,
  onNavigateToTracking
}) => {
  // Manejo de cierre con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Si el modal está cerrado o no hay orden, no renderizar nada
  if (!isOpen || !order) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-delivery-title"
    >
      <div 
        className="fixed inset-0" 
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 border border-[#eceef2]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">two_wheeler</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 id="modal-delivery-title" className="text-lg font-bold font-soria">
                  Detalle de Entrega #{order.id}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-400 text-cyan-950 text-[10px] font-extrabold uppercase border border-cyan-300">
                  {order.statusText}
                </span>
              </div>
              <span className="text-xs text-slate-300">
                Llegada estimada a las <strong>{order.estimatedArrivalHour}</strong> ({order.etaMinutes} min restantes)
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            type="button"
            aria-label="Cerrar modal de entrega"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex flex-col gap-6">
          {/* Progress Timeline Stepper */}
          <div className="p-5 rounded-2xl bg-[#f8f9fd] border border-[#eceef2] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold text-[#5b4138] tracking-wider">
                Progreso de la Entrega (Paso {order.stepNumber} de 4)
              </span>
              <span className="text-xs font-bold text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
                Tiempo Real GPS
              </span>
            </div>

            <div className="flex flex-col gap-4 relative pl-4 border-l-2 border-slate-200 ml-2">
              {order.timeline.map((step) => {
                const isPassed = step.completed;
                const isCurrent = step.current;

                return (
                  <div key={step.step} className="relative flex flex-col gap-1 pl-4">
                    {/* Step Icon Marker */}
                    <div 
                      className={`absolute -left-[27px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isPassed
                          ? 'bg-emerald-600 text-white ring-2 ring-emerald-100'
                          : isCurrent
                          ? 'bg-cyan-500 text-white ring-4 ring-cyan-200 animate-pulse'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {isPassed ? 'check' : step.icon}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isCurrent ? 'text-cyan-950 font-extrabold' : 'text-[#191c1f]'}`}>
                        {step.label}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">{step.time}</span>
                    </div>

                    <p className="text-xs text-[#5b4138] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Motorizado Details */}
          <div className="p-4 rounded-2xl bg-white border border-[#eceef2] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700">
                <span className="material-symbols-outlined text-[28px] text-slate-600">sports_motorsports</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs uppercase font-bold text-[#5b4138]">Tu Repartidor Asignado</span>
                <span className="text-sm font-bold text-[#191c1f]">{order.driver.name}</span>
                <span className="text-xs text-[#5b4138] flex items-center gap-2 mt-0.5">
                  <span>{order.driver.vehicle}</span>
                  <span>•</span>
                  <span className="font-mono font-bold text-[#191c1f] bg-slate-100 px-1.5 py-0.2 rounded">
                    {order.driver.plate}
                  </span>
                </span>
              </div>
            </div>

            <a
              href={`tel:${order.driver.phone}`}
              className="h-10 px-4 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border border-cyan-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">call</span>
              <span>Llamar</span>
            </a>
          </div>

          {/* Addresses breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-[#f8f9fd] border border-[#eceef2] flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-[#5b4138] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">store</span>
                Puesto de preparación
              </span>
              <span className="text-xs font-bold text-[#191c1f]">{order.restaurantName}</span>
              <span className="text-[11px] text-[#5b4138]">{order.restaurantAddress}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#f8f9fd] border border-[#eceef2] flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-[#5b4138] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-red-500">pin_drop</span>
                Destino de entrega
              </span>
              <span className="text-xs font-bold text-[#191c1f]">Tu Dirección</span>
              <span className="text-[11px] text-[#5b4138]">{order.deliveryAddress}</span>
            </div>
          </div>

          {/* Items Summary */}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#eceef2]">
            <span className="text-xs font-bold text-[#191c1f]">Contenido de tu Orden:</span>
            <div className="flex flex-col divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[10px]">
                      {item.quantity}x
                    </span>
                    <span className="font-semibold text-[#191c1f]">{item.name}</span>
                  </div>
                  <span className="font-bold text-[#191c1f]">S/ {item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-200 text-sm font-extrabold">
              <span>Total Pagado</span>
              <span className="text-[#191c1f]">S/ {order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-[#eceef2] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="h-10 px-5 rounded-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
            type="button"
            aria-label="Cerrar ventana de detalle de entrega"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
            <span>Cerrar Ventana</span>
          </button>

          <div className="flex items-center gap-2">
            {onAdvanceOrderStep && order.stepNumber < 4 && (
              <button
                type="button"
                onClick={onAdvanceOrderStep}
                className="h-10 px-4 rounded-full bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border border-cyan-300 text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                title="Avanzar etapa del pedido al siguiente estado"
              >
                <span className="material-symbols-outlined text-[18px]">fast_forward</span>
                <span>Avanzar Estado</span>
              </button>
            )}

            <button
              onClick={() => {
                if (onNavigateToTracking) {
                  onNavigateToTracking();
                } else {
                  onClose();
                }
              }}
              className="h-10 px-5 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-2"
              type="button"
            >
              <span>Avanzar al Rastreo Completo</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
