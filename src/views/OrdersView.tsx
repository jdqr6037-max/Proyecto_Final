import React, { useState } from 'react';
import { CURRENT_ORDER } from '../data/mockData';
import { Dish } from '../types';

interface OrdersViewProps {
  onReorder: (dishName: string, price: number) => void;
  onNavigateToExplore: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ onReorder }) => {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [showMap3DModal, setShowMap3DModal] = useState(false);
  const [showSupportChat, setShowSupportChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ sender: 'agent' | 'user'; text: string }[]>([
    { sender: 'agent', text: '¡Hola Mateo! Tu repartidor Carlos está a solo 4 cuadras de tu dirección en Miraflores. ¿Tienes alguna consulta sobre la entrega?' }
  ]);

  const pastOrders = [
    {
      id: 'FN-78421',
      date: 'Ayer, 8:45 PM',
      restaurant: 'La Mar Cevichería Criolla',
      items: '1x Ceviche Clásico Mixto, 1x Chicha Morada 1L',
      total: 44.50,
      status: 'Entregado'
    },
    {
      id: 'FN-77319',
      date: '14 Septiembre',
      restaurant: 'Pardos Chicken Miraflores',
      items: '1x 1/4 Pollo a la Brasa, 1x Porción de Tequeños',
      total: 39.80,
      status: 'Entregado'
    },
    {
      id: 'FN-76501',
      date: '10 Septiembre',
      restaurant: 'Madam Tusan Chifa',
      items: '1x Arroz Chaufa Especial, 1x Siu Mai x4',
      total: 52.00,
      status: 'Entregado'
    }
  ];

  return (
    <div className="w-full flex flex-col gap-6 max-w-3xl mx-auto pb-24">
      {/* Header Tabs */}
      <section className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2 bg-[#f2f3f8] p-1 rounded-full shadow-inner">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'active'
                ? 'bg-white text-[#191c1f] shadow-sm'
                : 'text-[#5b4138] hover:text-[#191c1f]'
            }`}
            type="button"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00a870] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#006c47]"></span>
            </span>
            <span>En curso (1)</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-white text-[#191c1f] shadow-sm'
                : 'text-[#5b4138] hover:text-[#191c1f]'
            }`}
            type="button"
          >
            <span>Historial (14)</span>
          </button>
        </div>

        <button 
          type="button"
          className="w-10 h-10 rounded-full bg-[#f2f3f8] hover:bg-[#eceef2] flex items-center justify-center text-[#191c1f] shadow-sm"
          title="Comprobantes y facturas"
        >
          <span className="material-symbols-outlined text-[20px]">receipt</span>
        </button>
      </section>

      {activeTab === 'active' ? (
        <>
          {/* Active Order Hero Card */}
          <section className="relative bg-white rounded-3xl p-5 sm:p-6 shadow-[0_12px_32px_-4px_rgba(26,29,32,0.06)] overflow-hidden border border-[#eceef2]">
            {/* Ambient glows */}
            <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#ff5e1e]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-[#7d2dce]/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header Status */}
            <div className="relative flex items-start justify-between gap-2 mb-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdbd0] text-[#832700] mb-2 font-bold text-xs">
                  <span className="material-symbols-outlined text-[15px] animate-bounce">two_wheeler</span>
                  <span>En camino • {CURRENT_ORDER.etaMinutes} min restantes</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#191c1f] tracking-tight">
                  {CURRENT_ORDER.title}
                </h2>
              </div>
              <span className="text-xl sm:text-2xl font-black text-[#ff5e1e]">
                S/ {CURRENT_ORDER.total.toFixed(2)}
              </span>
            </div>

            {/* Stepper Progress Bar */}
            <div className="relative py-2 mb-4">
              <div className="h-2 w-full bg-[#eceef2] rounded-full overflow-hidden flex">
                <div className="h-full bg-[#ff5e1e] rounded-full w-[78%] transition-all duration-700 animate-pulse" />
              </div>
              <div className="flex justify-between items-center text-center mt-2.5 px-1">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-[#ff5e1e] text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-[14px]">check</span>
                  </div>
                  <span className="text-[11px] text-[#5b4138] mt-1 font-semibold">Recibido</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-[#ff5e1e] text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-[14px]">check</span>
                  </div>
                  <span className="text-[11px] text-[#5b4138] mt-1 font-semibold">Cocina</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-[#ff5e1e] text-white flex items-center justify-center shadow-[0_0_12px_rgba(255,94,30,0.8)] ring-4 ring-[#ffdbd0]">
                    <span className="material-symbols-outlined text-[14px]">sports_motorsports</span>
                  </div>
                  <span className="text-[11px] font-extrabold text-[#ff5e1e] mt-1">Reparto</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-[#e7e8ec] text-[#5b4138] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[14px]">home</span>
                  </div>
                  <span className="text-[11px] text-[#5b4138] mt-1 font-semibold">Llegada</span>
                </div>
              </div>
            </div>

            {/* Dish Summary */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#f2f3f8] mb-4 border border-[#eceef2]">
              <img 
                src={CURRENT_ORDER.dishImageUrl} 
                alt="Lomo Saltado" 
                className="w-16 h-16 rounded-xl object-cover shadow-sm shrink-0" 
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#efdbff] text-[#6600b7] font-bold">
                    Favorito
                  </span>
                  <span className="text-xs text-[#5b4138] font-semibold">{CURRENT_ORDER.restaurantName}</span>
                </div>
                <p className="text-sm font-bold text-[#191c1f] truncate mt-0.5">
                  {CURRENT_ORDER.itemsSummary.split('+')[0]}
                </p>
                <p className="text-xs text-[#5b4138] truncate">
                  + {CURRENT_ORDER.itemsSummary.split('+')[1]}
                </p>
              </div>
            </div>

            {/* Repartidor & CTA Rápido */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#eceef2]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative">
                  <div className="w-11 h-11 rounded-full bg-[#e1e2e6] flex items-center justify-center text-[#ff5e1e]">
                    <span className="material-symbols-outlined text-[26px]">account_circle</span>
                  </div>
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#00a870] ring-2 ring-white"></span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-[#191c1f] truncate">{CURRENT_ORDER.driverName}</p>
                  <p className="text-xs text-[#5b4138] truncate">{CURRENT_ORDER.driverVehicle} • ⭐ {CURRENT_ORDER.driverRating}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowSupportChat(true)}
                  className="w-10 h-10 rounded-full bg-[#f2f3f8] hover:bg-[#eceef2] text-[#191c1f] flex items-center justify-center active:scale-95 transition-transform"
                  type="button"
                  title="Llamar o chatear"
                >
                  <span className="material-symbols-outlined text-[19px]">call</span>
                </button>
                <button
                  onClick={() => setShowMap3DModal(true)}
                  className="flex items-center gap-1.5 h-10 px-4 rounded-full bg-[#ff5e1e] hover:bg-[#ab3500] text-white text-xs font-bold shadow-md shadow-[#ff5e1e]/30 active:scale-95 transition-all"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">map</span>
                  <span>Mapa 3D</span>
                </button>
              </div>
            </div>
          </section>

          {/* Sección Pedir de Nuevo */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#7d2dce] text-[22px]">replay</span>
                <h3 className="text-lg font-bold text-[#191c1f]">Pedir de nuevo</h3>
              </div>
              <button 
                onClick={() => setActiveTab('history')}
                className="text-xs text-[#ff5e1e] font-bold hover:underline"
                type="button"
              >
                Ver todo
              </button>
            </div>

            {/* Horizontal Snap Carousel */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Card 1 */}
              <div className="bg-white rounded-2xl p-3.5 shadow-sm flex flex-col justify-between border border-[#eceef2]">
                <div>
                  <div className="relative h-32 w-full rounded-xl overflow-hidden mb-2 bg-[#f2f3f8]">
                    <img 
                      src="https://lh3.googleusercontent.com/aida/AEtjO1UsVH3XMbr6BmWJ4rvvaTwtt19uSAHN5MRhUdWPJXdgLZ15so9bxOf_SOSZN9vqJvg1_oZ5ASrPEiRmGnJXVcLFYxQcepcsPCu2CG5xWS8oxx1SZXp9NXZSlEKSBS4S-v_PESepwlK6tsUKdvjbQ8zdSj3vhr3MzVSXssvQeCALwv78rsNVAmB9qtMxgpY1xrV5c4S3w8BLJAO5bHzv5nh0XRu0QW3WzAJku9f88if0jILhuPL6ucvs_4Zy"
                      alt="Ceviche"
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md">
                      <span className="text-[10px] text-[#191c1f] font-bold">Hace 3 días</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[#5b4138]">
                    <span className="material-symbols-outlined text-[14px] text-[#006c47]">verified</span>
                    <span className="text-xs font-semibold truncate">Cevichería La Mar</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#191c1f] truncate mt-0.5">Ceviche Clásico Mixto</h4>
                  <p className="text-xs text-[#5b4138]">Con camote glaseado y choclo</p>
                </div>
                <button
                  onClick={() => onReorder('Ceviche Clásico Mixto', 36.00)}
                  className="mt-3 w-full h-10 rounded-full bg-[#7d2dce] hover:bg-[#6600b7] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-[#7d2dce]/30 active:scale-95 transition-transform"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                  <span>Repetir • S/ 36.00</span>
                </button>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-2xl p-3.5 shadow-sm flex flex-col justify-between border border-[#eceef2]">
                <div>
                  <div className="relative h-32 w-full rounded-xl overflow-hidden mb-2 bg-[#f2f3f8]">
                    <img 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAp0i5G1q8-9Kpp2JNSLHtMxjZrVtlgBWix1TsCqMenLbV9go_-Ecmm6-VheGU6cwJuBpQ_OfB3grG8tw2WuD0F0eToW5B2MzgJxeh-Uyx5LrLgdRcvouXaQoOZxIe7QwWWLT-M5NFhxA9LNxsl8hZS4ruS8Le5UZ3LXYdm4y0-OPH8-7kwcjJEbRyzg7vJHLdAPUJeLITVcf5WAwF2wWWBYNo9xbHDENFenj1IIAKt4G4Sr96VwPjp-w"
                      alt="Pollo a la Brasa"
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md">
                      <span className="text-[10px] text-[#191c1f] font-bold">Domingo</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[#5b4138]">
                    <span className="material-symbols-outlined text-[14px] text-[#006c47]">verified</span>
                    <span className="text-xs font-semibold truncate">Pardos Chicken</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#191c1f] truncate mt-0.5">1/4 Pollo a la Brasa</h4>
                  <p className="text-xs text-[#5b4138]">Papas artesanales y cremas</p>
                </div>
                <button
                  onClick={() => onReorder('1/4 Pollo a la Brasa', 29.90)}
                  className="mt-3 w-full h-10 rounded-full bg-[#f2f3f8] hover:bg-[#eceef2] text-[#191c1f] text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                  <span>Repetir • S/ 29.90</span>
                </button>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-2xl p-3.5 shadow-sm flex flex-col justify-between border border-[#eceef2]">
                <div>
                  <div className="relative h-32 w-full rounded-xl overflow-hidden mb-2 bg-[#f2f3f8]">
                    <img 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqrfPA0PxCH1oyepJWiteG4tjX2BBUIKlgjYRPsUfQc-WAxl7dg8mM3hBjwZB5mT0z9KHMr-WL7XKXd7myoDMLoJJjgzWEL01orIXn8NAjZLGbj4rYTbyTjW3Ef3ATaZmk72P3RqzB5TiFFVidFvod-FrQ5dIwAGT7nVpp4atpF1A_RHPi8ku5VoCo5Y5w1_s7Nxnb-dcySb8LOdDziXcYOhQQyrhOLshPJo26jZj3wPiIM-NnVfpqeA"
                      alt="Poke"
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md">
                      <span className="text-[10px] text-[#191c1f] font-bold">12 May</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[#5b4138]">
                    <span className="material-symbols-outlined text-[14px] text-[#006c47]">verified</span>
                    <span className="text-xs font-semibold truncate">Kaia Poke Bar</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#191c1f] truncate mt-0.5">Salmon Ponzu Power</h4>
                  <p className="text-xs text-[#5b4138]">Palta, edamame y quinua</p>
                </div>
                <button
                  onClick={() => onReorder('Salmon Ponzu Power', 34.00)}
                  className="mt-3 w-full h-10 rounded-full bg-[#f2f3f8] hover:bg-[#eceef2] text-[#191c1f] text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                  <span>Repetir • S/ 34.00</span>
                </button>
              </div>
            </div>
          </section>

          {/* Centro de Asistencia 24/7 */}
          <section className="bg-[#efdbff]/40 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-3 shadow-sm border border-[#7d2dce]/10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#7d2dce] text-white flex items-center justify-center shrink-0 shadow-md">
                <span className="material-symbols-outlined text-[22px]">support_agent</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#2b0052] leading-tight">¿Algún inconveniente?</h4>
                <p className="text-xs text-[#6600b7]">Soporte Food Now activo 24/7 en vivo</p>
              </div>
            </div>
            <button
              onClick={() => setShowSupportChat(true)}
              className="shrink-0 px-4 py-2 rounded-full bg-white text-[#7d2dce] text-xs font-bold shadow-sm active:scale-95 transition-transform hover:bg-[#f2f3f8]"
              type="button"
            >
              Ayuda
            </button>
          </section>
        </>
      ) : (
        /* Order History List */
        <div className="flex flex-col gap-3">
          {pastOrders.map((order) => (
            <div 
              key={order.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-[#eceef2] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#191c1f]">{order.id}</span>
                  <span className="text-[11px] text-[#5b4138]">• {order.date}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#6efcb9]/30 text-[#005234] font-bold">
                    {order.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#191c1f]">{order.restaurant}</h4>
                <p className="text-xs text-[#5b4138]">{order.items}</p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#eceef2]">
                <span className="text-base font-black text-[#191c1f]">S/ {order.total.toFixed(2)}</span>
                <button
                  onClick={() => onReorder(order.restaurant, order.total)}
                  className="px-4 py-2 rounded-full bg-[#ff5e1e] hover:bg-[#ab3500] text-white text-xs font-bold shadow-sm active:scale-95"
                  type="button"
                >
                  Volver a pedir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3D Map Modal */}
      {showMap3DModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff5e1e] text-[24px]">map</span>
                <h3 className="text-lg font-bold text-[#191c1f]">Seguimiento Satelital 3D</h3>
              </div>
              <button 
                onClick={() => setShowMap3DModal(false)}
                className="w-8 h-8 rounded-full bg-[#f2f3f8] flex items-center justify-center text-[#191c1f]"
              >
                ✕
              </button>
            </div>

            <div className="relative h-64 rounded-2xl overflow-hidden bg-[#f2f3f8] flex items-center justify-center">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(https://lh3.googleusercontent.com/aida-public/AB6AXuAAq9oG1lIW072hHsuXzWaVJCT956MV02LLypPBeKW-tziyvlg1jAvua0lghmEVH8g1irWMG2J7gv8eOMy7MYOt3pS658vjFcqUVOSX9GASEUfRGoS_4Kk2e2TQK7IZfkqYbBG6CG145mnELONxppLiwxQlNAxNuvWHQAdO0gTHZoXpKEMJJ60hDW27DjwHnOcKZRpZAgsazzSvFm4FkuXtBEZXSDLyHs8H5zo5RDqz3G2bFAiHZum9yg)` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              
              <div className="relative z-10 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#ff5e1e] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px] animate-pulse">sports_motorsports</span>
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-[#191c1f]">Carlos Mendiola (Repartidor)</p>
                  <p className="text-[11px] text-[#00a870] font-semibold">A 450 metros • Llegada: 4 min</p>
                </div>
              </div>
            </div>

            <div className="bg-[#f2f3f8] p-3 rounded-2xl text-xs text-[#5b4138]">
              <span className="font-bold text-[#191c1f]">Destino: </span>
              Av. José Larco 743, Dpto 502, Miraflores
            </div>

            <button
              onClick={() => setShowMap3DModal(false)}
              className="w-full h-11 rounded-full bg-[#191c1f] text-white text-xs font-bold"
            >
              Cerrar Vista 3D
            </button>
          </div>
        </div>
      )}

      {/* 24/7 Support Live Chat Modal */}
      {showSupportChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-5 max-w-md w-full shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#eceef2]">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-[#7d2dce] text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">support_agent</span>
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#00a870] ring-2 ring-white"></span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#191c1f]">Soporte Food Now</h4>
                  <p className="text-[11px] text-[#00a870] font-semibold">Agente en línea 24/7</p>
                </div>
              </div>
              <button 
                onClick={() => setShowSupportChat(false)}
                className="w-8 h-8 rounded-full bg-[#f2f3f8] flex items-center justify-center text-[#191c1f]"
              >
                ✕
              </button>
            </div>

            {/* Chat Body */}
            <div className="h-60 overflow-y-auto flex flex-col gap-2 p-2 bg-[#f8f9fd] rounded-2xl">
              {chatHistory.map((msg, i) => (
                <div 
                  key={i}
                  className={`max-w-[80%] p-3 rounded-2xl text-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#ff5e1e] text-white self-end rounded-br-none'
                      : 'bg-white text-[#191c1f] self-start rounded-bl-none shadow-sm border border-[#eceef2]'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Escribe tu consulta aquí..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && chatMessage.trim()) {
                    setChatHistory(prev => [...prev, { sender: 'user', text: chatMessage.trim() }]);
                    setChatMessage('');
                    setTimeout(() => {
                      setChatHistory(prev => [...prev, { sender: 'agent', text: '¡Entendido! Le hemos avisado al repartidor para que toque el timbre 502 al llegar.' }]);
                    }, 1000);
                  }
                }}
                className="flex-1 h-11 px-4 rounded-full bg-[#f2f3f8] text-xs outline-none focus:ring-2 focus:ring-[#7d2dce]"
              />
              <button
                onClick={() => {
                  if (chatMessage.trim()) {
                    setChatHistory(prev => [...prev, { sender: 'user', text: chatMessage.trim() }]);
                    setChatMessage('');
                    setTimeout(() => {
                      setChatHistory(prev => [...prev, { sender: 'agent', text: '¡Entendido! Le hemos avisado al repartidor para que toque el timbre 502 al llegar.' }]);
                    }, 1000);
                  }
                }}
                className="w-11 h-11 rounded-full bg-[#7d2dce] text-white flex items-center justify-center active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
