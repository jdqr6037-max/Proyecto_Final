import React, { useState } from 'react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (dishId: string, delta: number) => void;
  onProceedToCheckout: () => void;
  onApplyCoupon: (code: string) => void;
  discount: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onProceedToCheckout,
  onApplyCoupon,
  discount
}) => {
  const [couponInput, setCouponInput] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const finalTotal = Math.max(0, subtotal - discount);

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transition-transform duration-300 flex flex-col justify-between">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#eceef2] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff5e1e] text-[24px]">shopping_bag</span>
            <h3 className="text-lg font-bold text-[#191c1f]">Tu Canasta</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-[#eceef2] text-[#5b4138] text-xs font-bold">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#f2f3f8] hover:bg-[#eceef2] flex items-center justify-center text-[#191c1f] transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Drawer Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-3.5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-[#5b4138]">
              <div className="w-16 h-16 rounded-full bg-[#f2f3f8] flex items-center justify-center text-[#ff5e1e] mb-3">
                <span className="material-symbols-outlined text-[32px]">production_quantity_limits</span>
              </div>
              <p className="font-bold text-[#191c1f] text-base">Tu canasta está vacía</p>
              <p className="text-xs text-[#5b4138] mt-1">Explora nuestros platos criollos y marinos para agregar delicias.</p>
            </div>
          ) : (
            items.map((item) => (
              <div 
                key={item.dish.id}
                className="p-3.5 rounded-2xl bg-[#f2f3f8] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-[#e7e8ec]">
                    <img 
                      src={item.dish.imageUrl} 
                      alt={item.dish.name}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-[#191c1f] truncate leading-tight">
                      {item.dish.name}
                    </span>
                    <span className="text-xs text-[#5b4138] truncate">
                      {item.dish.restaurant}
                    </span>
                    <span className="text-sm font-extrabold text-[#ff5e1e] mt-1">
                      S/ {(item.dish.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-full shadow-sm shrink-0">
                  <button 
                    onClick={() => onUpdateQuantity(item.dish.id, -1)}
                    className="w-6 h-6 flex items-center justify-center text-[#5b4138] hover:text-[#191c1f] font-bold text-base hover:bg-[#f2f3f8] rounded-full"
                    type="button"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold text-[#191c1f] w-4 text-center">
                    {item.quantity}
                  </span>
                  <button 
                    onClick={() => onUpdateQuantity(item.dish.id, 1)}
                    className="w-6 h-6 flex items-center justify-center text-[#5b4138] hover:text-[#191c1f] font-bold text-base hover:bg-[#f2f3f8] rounded-full"
                    type="button"
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}

          {items.length > 0 && (
            <>
              {/* Promo Coupon Box */}
              <div className="mt-2 flex gap-2">
                <input 
                  type="text"
                  placeholder="Cupón (ej. BIENVENIDOFOOD)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 h-10 px-3.5 bg-[#f2f3f8] rounded-full text-xs font-semibold uppercase outline-none focus:ring-2 focus:ring-[#ff5e1e]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (couponInput.trim()) {
                      onApplyCoupon(couponInput.trim());
                      setCouponInput('');
                    }
                  }}
                  className="px-4 h-10 bg-[#191c1f] hover:bg-black text-white rounded-full text-xs font-bold transition-transform active:scale-95"
                >
                  Aplicar
                </button>
              </div>

              {/* Promo tip */}
              <div className="p-3 rounded-xl bg-[#00a870]/10 text-[#006c47] flex items-center gap-2 mt-1">
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                <span className="text-xs font-semibold">
                  ¡Calificas para entrega gratis con FoodPrime Club!
                </span>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer (Checkout Breakdown) */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#eceef2] flex flex-col gap-3 bg-white">
            <div className="flex flex-col gap-1.5 text-xs text-[#5b4138]">
              <div className="flex items-center justify-between">
                <span>Subtotal de platos</span>
                <span className="font-semibold text-[#191c1f]">S/ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Costo de envío estimado</span>
                <span className="text-[#00a870] font-bold">S/ 0.00 (FoodPrime)</span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between text-[#006c47] font-semibold">
                  <span>Descuento de cupón</span>
                  <span>- S/ {discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-base font-extrabold text-[#191c1f] pt-1.5 border-t border-[#e7e8ec]">
                <span>Total a Pagar</span>
                <span className="text-[#ff5e1e]">S/ {finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full h-12 rounded-full bg-[#ff5e1e] hover:bg-[#ab3500] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#ff5e1e]/35 transition-all transform active:scale-[0.98]"
              type="button"
            >
              <span>Tramitar Pedido</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};
