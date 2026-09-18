import React, { useState } from 'react';
import { Dish } from '../types';
import { MAP_BACKGROUND } from '../data/mockData';

interface LiveMapViewProps {
  dishes: Dish[];
  onAddToCart: (dish: Dish) => void;
  onToggleFavorite: (dishId: string) => void;
}

export const LiveMapView: React.FC<LiveMapViewProps> = ({
  dishes,
  onAddToCart,
  onToggleFavorite
}) => {
  const [selectedPinIndex, setSelectedPinIndex] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('Criollo');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const lomoDish = dishes.find(d => d.name.toLowerCase().includes('lomo')) || dishes[0];
  const cevicheDish = dishes.find(d => d.name.toLowerCase().includes('ceviche')) || dishes[2];

  const mapPins = [
    {
      id: 'pin-lomo',
      name: 'Sabor & Tradición Limeña',
      dishName: 'Lomo Saltado Criollo',
      time: '20-30 min',
      rating: '4.9',
      icon: 'restaurant',
      top: '25%',
      left: '28%',
      dish: lomoDish,
      color: 'bg-[#ff5e1e]'
    },
    {
      id: 'pin-ceviche',
      name: 'La Barra Marina',
      dishName: 'Ceviche Clásico Norteño',
      time: '15-25 min',
      rating: '4.8',
      icon: 'set_meal',
      top: '46%',
      left: '74%',
      dish: cevicheDish,
      color: 'bg-[#7d2dce]'
    },
    {
      id: 'pin-brasas',
      name: 'Brasas & Sazón',
      dishName: '1/4 Pollo a la Brasa',
      time: '25-35 min',
      rating: '4.8',
      icon: 'local_fire_department',
      top: '18%',
      left: '68%',
      dish: dishes[5] || lomoDish,
      color: 'bg-[#ff5e1e]'
    }
  ];

  const categories = [
    { label: 'Criollo', emoji: '🇵🇪' },
    { label: 'Mariscos', emoji: '🐟' },
    { label: 'Brasas', emoji: '🔥' },
    { label: 'Chifa', emoji: '🥟' },
    { label: 'Ofertas Flash', icon: 'bolt' }
  ];

  return (
    <div className="relative w-full overflow-hidden select-none pb-24">
      {/* Interactive Map Stage */}
      <div className="relative w-full h-[480px] sm:h-[540px] rounded-3xl overflow-hidden shadow-lg border border-[#eceef2]">
        {/* Vector map background */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out scale-105"
          style={{ backgroundImage: `url(${MAP_BACKGROUND})` }}
        />
        {/* Soft Ambient Light Tint & Depth Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-[#f8f9fd] pointer-events-none" />

        {/* Live Pulsing User Location Marker (Miraflores, Lima) */}
        <div className="absolute top-[38%] left-[48%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none">
          <div className="relative flex items-center justify-center">
            <span className="absolute w-12 h-12 rounded-full bg-[#ff5e1e]/20 animate-ping" />
            <span className="absolute w-8 h-8 rounded-full bg-[#ff5e1e]/30" />
            <div className="relative w-5 h-5 rounded-full bg-[#ff5e1e] shadow-[0_2px_10px_rgba(255,94,30,0.5)] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
          </div>
          <div className="mt-1 px-2.5 py-0.5 rounded-full bg-white shadow-md backdrop-blur-md border border-black/5">
            <span className="text-[11px] text-[#191c1f] font-bold tracking-tight">Tú estás aquí</span>
          </div>
        </div>

        {/* Map Pins */}
        {mapPins.map((pin, idx) => {
          const isSelected = selectedPinIndex === idx;
          return (
            <button
              key={pin.id}
              onClick={() => setSelectedPinIndex(idx)}
              style={{ top: pin.top, left: pin.left }}
              className={`group absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center transition-all duration-300 transform active:scale-95 focus:outline-none ${
                isSelected ? 'scale-110 z-30' : 'hover:scale-105'
              }`}
              type="button"
            >
              <div className="px-2.5 py-1 rounded-full bg-white shadow-[0_4px_16px_rgba(26,29,32,0.14)] flex items-center gap-1.5 transition-transform border border-black/5">
                <span className="w-2 h-2 rounded-full bg-[#00a870] animate-pulse" />
                <span className="text-[11px] text-[#191c1f] font-bold">{pin.time}</span>
                <span className="text-[#5b4138] text-[11px]">★ {pin.rating}</span>
              </div>
              <div className="relative mt-1">
                <div 
                  className={`w-11 h-11 rounded-full ${pin.color} shadow-[0_8px_20px_-2px_rgba(255,94,30,0.45)] flex items-center justify-center text-white transform transition-transform group-hover:-translate-y-1 ${
                    isSelected ? 'ring-4 ring-white' : ''
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">{pin.icon}</span>
                </div>
                <div className={`w-2 h-2 ${pin.color} rotate-45 mx-auto -mt-1 rounded-xs`} />
              </div>
            </button>
          );
        })}

        {/* Map Floating Controls */}
        <div className="absolute right-4 top-24 z-20 flex flex-col gap-2">
          <button 
            type="button"
            className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md shadow-md flex items-center justify-center text-[#ff5e1e] hover:bg-[#f2f3f8] transition-colors active:scale-90"
            title="Mi ubicación"
          >
            <span className="material-symbols-outlined text-[20px]">my_location</span>
          </button>
          <button 
            type="button"
            className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md shadow-md flex items-center justify-center text-[#191c1f] hover:bg-[#f2f3f8] transition-colors active:scale-90"
            title="Capas del mapa"
          >
            <span className="material-symbols-outlined text-[20px]">layers</span>
          </button>
        </div>

        {/* Capsule Search & Filter Sticky Bar */}
        <div className="absolute top-4 inset-x-0 px-4 z-30 flex flex-col gap-2.5 max-w-lg mx-auto">
          {/* Search Capsule */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-12 px-4 rounded-full bg-white/95 backdrop-blur-xl shadow-md flex items-center gap-3 border border-black/5 focus-within:ring-2 focus-within:ring-[#ff5e1e]">
              <span className="material-symbols-outlined text-[#ff5e1e] text-[20px] shrink-0">
                search
              </span>
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar 'Lomo Saltado', 'Ceviche'..."
                className="w-full bg-transparent text-xs sm:text-sm text-[#191c1f] placeholder:text-[#5b4138]/70 focus:outline-none"
              />
            </div>
            <button 
              type="button"
              className="w-12 h-12 rounded-full bg-white/95 backdrop-blur-xl shadow-md flex items-center justify-center text-[#191c1f] hover:text-[#ff5e1e] active:scale-95 transition-transform shrink-0 border border-black/5"
            >
              <span className="material-symbols-outlined text-[20px]">tune</span>
            </button>
          </div>

          {/* Horizontal Pill Categories Carousel */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {categories.map((c) => {
              const isSelected = selectedCategory === c.label;
              return (
                <button
                  key={c.label}
                  onClick={() => setSelectedCategory(c.label)}
                  className={`h-9 px-4 rounded-full shadow-sm flex items-center gap-1.5 shrink-0 text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-[#191c1f] text-white'
                      : 'bg-white/95 backdrop-blur-md text-[#191c1f] hover:bg-white'
                  }`}
                  type="button"
                >
                  {c.emoji && <span className="text-sm">{c.emoji}</span>}
                  {c.icon && <span className="material-symbols-outlined text-[#7d2dce] text-[16px]">{c.icon}</span>}
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Floating Bubbly Sheet & Dish Carousel */}
      <div className="relative -mt-14 z-30 px-4 flex flex-col gap-4 max-w-4xl mx-auto">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5e1e] animate-pulse" />
            <span className="text-lg sm:text-xl text-[#191c1f] font-bold tracking-tight">
              Cerca de ti en Miraflores
            </span>
          </div>
          <button className="text-xs text-[#ff5e1e] font-bold hover:underline" type="button">
            Ver todos (38)
          </button>
        </div>

        {/* Snap Cards Carousel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Lomo Saltado Criollo */}
          <div 
            onClick={() => setSelectedPinIndex(0)}
            className={`cursor-pointer rounded-3xl bg-white p-4 shadow-[0_12px_32px_-4px_rgba(26,29,32,0.08)] flex flex-col justify-between transition-all duration-300 border ${
              selectedPinIndex === 0 ? 'ring-2 ring-[#ff5e1e] border-[#ff5e1e]' : 'border-[#eceef2]'
            }`}
          >
            <div>
              <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-[#f2f3f8]">
                <img 
                  src={lomoDish.imageUrl} 
                  alt={lomoDish.name}
                  className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105" 
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-[#ff5e1e] text-white text-[11px] font-bold shadow-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                    Más Vendido
                  </span>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(lomoDish.id);
                  }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#ff5e1e] hover:scale-110 active:scale-90 transition-transform"
                  type="button"
                >
                  <span 
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: lomoDish.isFavorite ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    favorite
                  </span>
                </button>
              </div>

              <div className="pt-3.5 flex flex-col gap-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[11px] text-[#ab3500] uppercase tracking-wide font-bold">
                    {lomoDish.restaurant}
                  </span>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#6efcb9]/30 text-[#005234] text-[11px] font-bold">
                    <span className="material-symbols-outlined text-[13px] text-[#006c47]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    {lomoDish.rating} <span className="text-[#5b4138] font-normal">({lomoDish.reviewsCount}+)</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#191c1f] tracking-tight">
                  {lomoDish.name}
                </h3>
                <p className="text-xs text-[#5b4138] line-clamp-2 leading-relaxed">
                  {lomoDish.description}
                </p>

                <div className="mt-1 flex items-center gap-2 text-[#5b4138] text-[11px]">
                  <span className="flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[16px] text-[#ff5e1e]">electric_moped</span>
                    {lomoDish.eta}
                  </span>
                  <span>•</span>
                  <span>Envío {lomoDish.deliveryFee}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 flex items-center justify-between bg-[#f2f3f8]/50 -mx-4 -mb-4 px-4 py-3 rounded-b-3xl">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#5b4138] uppercase font-semibold">Total plato</span>
                <span className="text-lg font-black text-[#191c1f]">S/ {lomoDish.price.toFixed(2)}</span>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(lomoDish);
                }}
                className="h-10 px-4 rounded-full bg-[#ff5e1e] hover:bg-[#ab3500] text-white text-xs font-bold shadow-md shadow-[#ff5e1e]/30 flex items-center gap-1.5 active:scale-95 transition-all"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>Agregar</span>
              </button>
            </div>
          </div>

          {/* Card 2: Ceviche Clásico Norteño */}
          <div 
            onClick={() => setSelectedPinIndex(1)}
            className={`cursor-pointer rounded-3xl bg-white p-4 shadow-[0_12px_32px_-4px_rgba(26,29,32,0.08)] flex flex-col justify-between transition-all duration-300 border ${
              selectedPinIndex === 1 ? 'ring-2 ring-[#7d2dce] border-[#7d2dce]' : 'border-[#eceef2]'
            }`}
          >
            <div>
              <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-[#f2f3f8]">
                <img 
                  src={cevicheDish.imageUrl} 
                  alt={cevicheDish.name}
                  className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105" 
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-[#974ce9] text-white text-[11px] font-bold shadow-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">water_drop</span>
                    Frescura Marina
                  </span>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(cevicheDish.id);
                  }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#7d2dce] hover:scale-110 active:scale-90 transition-transform"
                  type="button"
                >
                  <span 
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: cevicheDish.isFavorite ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    favorite
                  </span>
                </button>
              </div>

              <div className="pt-3.5 flex flex-col gap-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[11px] text-[#7d2dce] uppercase tracking-wide font-bold">
                    {cevicheDish.restaurant}
                  </span>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#6efcb9]/30 text-[#005234] text-[11px] font-bold">
                    <span className="material-symbols-outlined text-[13px] text-[#006c47]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    {cevicheDish.rating} <span className="text-[#5b4138] font-normal">({cevicheDish.reviewsCount}+)</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#191c1f] tracking-tight">
                  {cevicheDish.name}
                </h3>
                <p className="text-xs text-[#5b4138] line-clamp-2 leading-relaxed">
                  {cevicheDish.description}
                </p>

                <div className="mt-1 flex items-center gap-2 text-[#5b4138] text-[11px]">
                  <span className="flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[16px] text-[#00a870]">bolt</span>
                    {cevicheDish.eta}
                  </span>
                  <span>•</span>
                  <span className="text-[#00a870] font-semibold">Envío Gratis</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 flex items-center justify-between bg-[#f2f3f8]/50 -mx-4 -mb-4 px-4 py-3 rounded-b-3xl">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#5b4138] uppercase font-semibold">Total plato</span>
                <span className="text-lg font-black text-[#191c1f]">S/ {cevicheDish.price.toFixed(2)}</span>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(cevicheDish);
                }}
                className="h-10 px-4 rounded-full bg-[#ff5e1e] hover:bg-[#ab3500] text-white text-xs font-bold shadow-md shadow-[#ff5e1e]/30 flex items-center gap-1.5 active:scale-95 transition-all"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>Agregar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
