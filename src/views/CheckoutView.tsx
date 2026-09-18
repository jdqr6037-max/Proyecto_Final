import React, { useState } from 'react';
import { CartItem } from '../types';

interface CheckoutViewProps {
  items: CartItem[];
  discount: number;
  onConfirmOrder: () => void;
  onBackToMenu: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  items,
  discount,
  onConfirmOrder,
  onBackToMenu
}) => {
  const [selectedAddress, setSelectedAddress] = useState<'casa' | 'oficina'>('casa');
  const [deliveryNote, setDeliveryNote] = useState('Timbre 502, dejar en recepción si no contesto.');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'yape' | 'cash'>('card');
  const [selectedTip, setSelectedTip] = useState<number>(5);
  const [includeCutlery, setIncludeCutlery] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
  const finalTotal = Math.max(0, subtotal - discount + selectedTip);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onConfirmOrder();
    }, 1200);
  };

  return (
    <div className="w-full flex flex-col gap-6 max-w-5xl mx-auto pb-24">
      {/* Back Button & Title */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToMenu}
          className="flex items-center gap-1.5 text-xs font-bold text-[#5b4138] hover:text-[#ff5e1e] transition-colors"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Regresar a la carta</span>
        </button>
        <div className="flex items-center gap-1 text-[#00a870] text-xs font-bold bg-[#00a870]/10 px-3 py-1 rounded-full">
          <span className="material-symbols-outlined text-[16px]">lock</span>
          <span>Encriptación SSL 256-bit</span>
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-black text-[#191c1f] tracking-tight">
        Checkout Seguro 🛒
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Delivery & Payment Details */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Step 1: Dirección de Entrega */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-[#eceef2] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#ff5e1e] text-white flex items-center justify-center text-xs font-bold">1</span>
                <h3 className="text-base font-bold text-[#191c1f]">Dirección de Entrega</h3>
              </div>
              <span className="text-xs text-[#006c47] font-bold bg-[#6efcb9]/30 px-2.5 py-0.5 rounded-full">
                20 - 30 min (Express)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label 
                className={`p-3.5 rounded-2xl border-2 cursor-pointer flex flex-col gap-1 transition-all ${
                  selectedAddress === 'casa'
                    ? 'border-[#ff5e1e] bg-[#ffdbd0]/20'
                    : 'border-[#eceef2] hover:border-[#cfd1d5]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#191c1f] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#ff5e1e] text-[18px]">home</span>
                    Casa (Predeterminada)
                  </span>
                  <input
                    type="radio"
                    name="addr"
                    checked={selectedAddress === 'casa'}
                    onChange={() => setSelectedAddress('casa')}
                    className="accent-[#ff5e1e]"
                  />
                </div>
                <p className="text-xs text-[#5b4138]">Av. José Larco 743, Dpto 502, Miraflores, Lima</p>
              </label>

              <label 
                className={`p-3.5 rounded-2xl border-2 cursor-pointer flex flex-col gap-1 transition-all ${
                  selectedAddress === 'oficina'
                    ? 'border-[#ff5e1e] bg-[#ffdbd0]/20'
                    : 'border-[#eceef2] hover:border-[#cfd1d5]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#191c1f] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#7d2dce] text-[18px]">business</span>
                    Oficina
                  </span>
                  <input
                    type="radio"
                    name="addr"
                    checked={selectedAddress === 'oficina'}
                    onChange={() => setSelectedAddress('oficina')}
                    className="accent-[#ff5e1e]"
                  />
                </div>
                <p className="text-xs text-[#5b4138]">Av. Las Camelias 490, Piso 8, San Isidro, Lima</p>
              </label>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#5b4138]">Notas para el repartidor:</label>
              <input
                type="text"
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
                placeholder="Instrucciones del timbre, piso o dejar en recepción..."
                className="h-10 px-3.5 rounded-xl bg-[#f2f3f8] text-xs outline-none focus:ring-2 focus:ring-[#ff5e1e]"
              />
            </div>
          </div>

          {/* Step 2: Método de Pago */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-[#eceef2] flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#ff5e1e] text-white flex items-center justify-center text-xs font-bold">2</span>
              <h3 className="text-base font-bold text-[#191c1f]">Método de Pago</h3>
            </div>

            {/* Selector Tabs */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2.5 px-3 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-[#ff5e1e] bg-[#ffdbd0]/20 font-bold text-[#191c1f]'
                    : 'border-[#eceef2] text-[#5b4138] hover:bg-[#f2f3f8]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] text-[#ff5e1e]">credit_card</span>
                <span className="text-xs">Tarjeta</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('yape')}
                className={`py-2.5 px-3 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${
                  paymentMethod === 'yape'
                    ? 'border-[#7d2dce] bg-[#efdbff]/30 font-bold text-[#191c1f]'
                    : 'border-[#eceef2] text-[#5b4138] hover:bg-[#f2f3f8]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] text-[#7d2dce]">qr_code_2</span>
                <span className="text-xs">Yape / Plin</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`py-2.5 px-3 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${
                  paymentMethod === 'cash'
                    ? 'border-[#00a870] bg-[#6efcb9]/20 font-bold text-[#191c1f]'
                    : 'border-[#eceef2] text-[#5b4138] hover:bg-[#f2f3f8]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] text-[#00a870]">payments</span>
                <span className="text-xs">Efectivo</span>
              </button>
            </div>

            {paymentMethod === 'card' && (
              <div className="flex flex-col gap-3 p-4 rounded-2xl bg-[#f2f3f8] border border-[#eceef2]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#191c1f]">Tarjeta guardada: Visa terminada en 4821</span>
                  <span className="px-2 py-0.5 rounded bg-white text-[10px] font-bold text-[#ff5e1e]">Predeterminada</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    defaultValue="Mateo Rossi"
                    placeholder="Titular de la tarjeta"
                    className="h-10 px-3 rounded-xl bg-white text-xs outline-none"
                  />
                  <input
                    type="password"
                    defaultValue="123"
                    placeholder="CVV"
                    className="h-10 px-3 rounded-xl bg-white text-xs outline-none"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'yape' && (
              <div className="p-4 rounded-2xl bg-[#efdbff]/30 border border-[#7d2dce]/30 flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-[#7d2dce] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">qr_code_2</span>
                </div>
                <p className="text-xs font-bold text-[#2b0052]">Paga al instante con Yape o Plin</p>
                <p className="text-[11px] text-[#5b4138]">El repartidor mostrará el código QR en su llegada o confirmas con tu número de teléfono.</p>
              </div>
            )}

            {paymentMethod === 'cash' && (
              <div className="p-4 rounded-2xl bg-[#f2f3f8] border border-[#eceef2] text-xs text-[#5b4138]">
                <p className="font-bold text-[#191c1f]">Pago contra entrega</p>
                <p className="mt-1">Pagas en efectivo directamente a nuestro repartidor. El repartidor lleva cambio para billetes de hasta S/ 100.</p>
              </div>
            )}
          </div>

          {/* Step 3: Propina al Repartidor & Opciones ecológicas */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-[#eceef2] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#191c1f] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#ff5e1e] text-[20px]">volunteer_activism</span>
                <span>Propina para el motorizado</span>
              </h3>
              <span className="text-[11px] text-[#5b4138]">100% para tu repartidor</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {[0, 2, 5, 8].map((tip) => (
                <button
                  key={tip}
                  onClick={() => setSelectedTip(tip)}
                  className={`h-9 px-4 rounded-full text-xs font-bold transition-all shrink-0 ${
                    selectedTip === tip
                      ? 'bg-[#191c1f] text-white shadow-sm'
                      : 'bg-[#f2f3f8] text-[#5b4138] hover:bg-[#eceef2]'
                  }`}
                  type="button"
                >
                  {tip === 0 ? 'Sin propina' : `S/ ${tip}.00 ${tip === 5 ? '★' : ''}`}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-[#eceef2] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00a870] text-[20px]">eco</span>
                <div>
                  <p className="text-xs font-bold text-[#191c1f]">Cubiertos y servilletas</p>
                  <p className="text-[11px] text-[#5b4138]">Ayuda a reducir residuos plásticos</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={includeCutlery}
                onChange={() => setIncludeCutlery(!includeCutlery)}
                className="w-5 h-5 accent-[#00a870] rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-[#eceef2] flex flex-col gap-4 sticky top-28">
            <h3 className="text-base font-bold text-[#191c1f]">Resumen del Pedido</h3>

            {/* Items list */}
            <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.dish.id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img 
                      src={item.dish.imageUrl} 
                      alt={item.dish.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0" 
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-[#191c1f] truncate">{item.quantity}x {item.dish.name}</p>
                      <p className="text-[#5b4138] text-[11px] truncate">{item.dish.restaurant}</p>
                    </div>
                  </div>
                  <span className="font-bold text-[#191c1f] shrink-0">
                    S/ {(item.dish.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals Breakdown */}
            <div className="flex flex-col gap-2 pt-3 border-t border-[#eceef2] text-xs text-[#5b4138]">
              <div className="flex justify-between">
                <span>Subtotal de platos</span>
                <span className="font-semibold text-[#191c1f]">S/ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#006c47] font-semibold">
                <span>Costo de envío (FoodPrime)</span>
                <span>Gratis (S/ 0.00)</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#ff5e1e] font-semibold">
                  <span>Descuento cupón</span>
                  <span>- S/ {discount.toFixed(2)}</span>
                </div>
              )}
              {selectedTip > 0 && (
                <div className="flex justify-between text-[#191c1f]">
                  <span>Propina voluntaria</span>
                  <span className="font-semibold">S/ {selectedTip.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between items-baseline text-base font-black text-[#191c1f] pt-2 border-t border-[#eceef2]">
                <span>Total a Pagar</span>
                <span className="text-xl text-[#ff5e1e]">S/ {finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Big CTA */}
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full h-13 rounded-full bg-[#ff5e1e] hover:bg-[#ab3500] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#ff5e1e]/35 transition-all transform active:scale-98 disabled:opacity-75 cursor-pointer"
              type="button"
            >
              {isProcessing ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Procesando pedido...</span>
                </>
              ) : (
                <>
                  <span>Confirmar Pedido</span>
                  <span>•</span>
                  <span>S/ {finalTotal.toFixed(2)}</span>
                </>
              )}
            </button>

            <div className="text-center text-[11px] text-[#5b4138]">
              Al confirmar aceptas los Términos de Servicio y Entrega Garantizada de Food Now.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
