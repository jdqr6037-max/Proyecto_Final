import React, { useState, useEffect } from 'react';
import { Restaurant } from '../types';
import { MAP_BACKGROUND } from '../data/mockData';

interface MapaCercanoViewProps {
  restaurants: Restaurant[];
  onOpenDetail: (restaurant: Restaurant) => void;
  userAddress: string;
  onOpenLocationModal?: () => void;
  initialFilterOpenOnly?: boolean;
}

export const MapaCercanoView: React.FC<MapaCercanoViewProps> = ({
  restaurants,
  onOpenDetail,
  userAddress,
  onOpenLocationModal,
  initialFilterOpenOnly = true
}) => {
  const [selectedRestoId, setSelectedRestoId] = useState<string>(restaurants[0]?.id || '');
  const [filterStallsOnly, setFilterStallsOnly] = useState<boolean>(false);
  const [filterOpenOnly, setFilterOpenOnly] = useState<boolean>(initialFilterOpenOnly);

  // Synchronize when initialFilterOpenOnly changes from outside (e.g. after entering location)
  useEffect(() => {
    if (initialFilterOpenOnly !== undefined) {
      setFilterOpenOnly(initialFilterOpenOnly);
    }
  }, [initialFilterOpenOnly, userAddress]);

  const selectedResto = restaurants.find(r => r.id === selectedRestoId) || restaurants[0];

  const visibleRestaurants = restaurants.filter(r => {
    if (filterOpenOnly && !r.isOpen) return false;
    if (filterStallsOnly && r.stallType !== 'Puesto Callejero' && r.stallType !== 'Huco Tradicional') return false;
    return true;
  });

  const totalOpenRestaurants = restaurants.filter(r => r.isOpen).length;

  return (
    <div className="py-6 flex flex-col gap-5">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
              Geolocalización & Restaurantes Abiertos
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-soria text-[#191c1f]">
            Mapa de Restaurantes Cercanos
          </h1>
          <div className="text-xs text-[#5b4138] mt-1 flex flex-wrap items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#ff5e1e]">pin_drop</span>
            <span>Ubicación actual: <strong>{userAddress}</strong></span>
            
            {onOpenLocationModal && (
              <button
                type="button"
                onClick={onOpenLocationModal}
                className="ml-1 px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 font-black text-xs flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                title="Haz clic para ingresar o cambiar tu ubicación"
              >
                <span className="material-symbols-outlined text-[15px] text-[#ab3500]">edit_location_alt</span>
                <span>Ingresar / Cambiar Ubicación</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setFilterOpenOnly(!filterOpenOnly)}
            className={`h-9 px-3.5 rounded-full text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
              filterOpenOnly
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs font-black'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {filterOpenOnly ? 'check_circle' : 'circle'}
            </span>
            <span>Solo Abiertos Actualmente ({totalOpenRestaurants})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterStallsOnly(!filterStallsOnly)}
            className={`h-9 px-3.5 rounded-full text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
              filterStallsOnly
                ? 'bg-amber-100 text-amber-950 border-amber-400 font-black'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">outdoor_grill</span>
            <span className="hidden xs:inline">Carretillas</span>
          </button>
        </div>
      </div>

      {/* Active Location & Open Restaurants Status Banner */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">near_me</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-800">
              {filterOpenOnly 
                ? `Locales abiertos actualmente y listos para despachar cerca de tu ubicación`
                : `Mostrando todos los locales gastronómicos registrados`}
            </span>
            <span className="text-[11px] text-slate-500">
              Punto de referencia: {userAddress}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-950 border border-emerald-200 text-xs font-black">
            {visibleRestaurants.length} locales activos
          </span>
          {onOpenLocationModal && (
            <button
              type="button"
              onClick={onOpenLocationModal}
              className="text-xs font-black text-amber-800 hover:text-amber-950 underline underline-offset-2 cursor-pointer"
            >
              Cambiar zona
            </button>
          )}
        </div>
      </div>

      {/* Main Map Container */}
      <div className="relative w-full h-[520px] sm:h-[600px] rounded-3xl overflow-hidden border border-[#eceef2] shadow-sm bg-slate-100">
        {/* Real Sat/Map Canvas Image */}
        <img
          src={MAP_BACKGROUND}
          alt="Mapa satelital de Miraflores con locales gastronómicos"
          className="w-full h-full object-cover select-none"
        />
        <div className="absolute inset-0 bg-slate-900/10 pointer-events-none"></div>

        {/* User Location Beacon (Cyan highlight state!) */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none"
          aria-label={`Tu ubicación actual: ${userAddress}`}
        >
          <div className="relative flex items-center justify-center">
            <span className="w-10 h-10 rounded-full bg-cyan-400/40 animate-ping absolute"></span>
            <span className="w-5 h-5 rounded-full bg-cyan-500 border-2 border-white shadow-md relative z-10 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            </span>
          </div>
          <span className="mt-1 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-bold shadow-md whitespace-nowrap max-w-[220px] sm:max-w-xs truncate border border-cyan-400">
            📍 Tu ubicación: {userAddress}
          </span>
        </div>

        {/* Interactive Food Stall Pins */}
        {visibleRestaurants.map((restaurant) => {
          const isSelected = selectedResto?.id === restaurant.id;

          return (
            <button
              key={restaurant.id}
              type="button"
              onClick={() => setSelectedRestoId(restaurant.id)}
              style={{ top: restaurant.coordinates.mapTop, left: restaurant.coordinates.mapLeft }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer transition-all duration-200 ${
                isSelected ? 'scale-110 z-30' : 'hover:scale-105'
              }`}
              aria-label={`Seleccionar ${restaurant.name} en el mapa`}
            >
              {/* Pin Bubble */}
              <div 
                className={`px-3 py-1.5 rounded-2xl flex items-center gap-2 shadow-xl border-2 transition-all ${
                  isSelected
                    ? 'bg-[#111827] text-white border-cyan-400 ring-4 ring-cyan-400/20'
                    : restaurant.isOpen
                    ? 'bg-white text-[#191c1f] border-slate-300'
                    : 'bg-slate-100 text-slate-500 border-slate-300 opacity-90'
                }`}
              >
                {/* Stall icon */}
                <span className={`material-symbols-outlined text-[18px] ${
                  restaurant.isOpen ? 'text-amber-500' : 'text-slate-400'
                }`}>
                  {restaurant.stallType === 'Puesto Callejero' ? 'outdoor_grill' : 'restaurant'}
                </span>

                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold whitespace-nowrap">{restaurant.name}</span>
                    <span 
                      className={`text-[9px] px-1 py-0.2 rounded font-extrabold uppercase ${
                        restaurant.isOpen 
                          ? 'bg-emerald-100 text-emerald-900' 
                          : 'bg-rose-100 text-rose-900'
                      }`}
                    >
                      {restaurant.isOpen ? 'Abierto' : 'Cerrado'}
                    </span>
                  </div>

                  <span className="text-[10px] text-[#5b4138]">
                    {restaurant.distanceKm} km • {restaurant.eta}
                  </span>
                </div>

                {/* Promo icon tag if active */}
                {restaurant.promotion && (
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center font-black text-[10px] shadow-xs">
                    %
                  </span>
                )}
              </div>

              {/* Little triangle arrow at bottom of pin */}
              <div 
                className={`w-2.5 h-2.5 rotate-45 mx-auto -mt-1.5 border-r-2 border-b-2 ${
                  isSelected
                    ? 'bg-[#111827] border-cyan-400'
                    : 'bg-white border-slate-300'
                }`}
              ></div>
            </button>
          );
        })}

        {/* Selected Restaurant Floating Card at Bottom of Map */}
        {selectedResto && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-30 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-[#eceef2] shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[#191c1f] text-[10px] font-bold">
                {selectedResto.stallType}
              </span>

              {/* Status Badge */}
              <span 
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                  selectedResto.isOpen
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                    : 'bg-rose-50 text-rose-900 border-rose-300'
                }`}
              >
                <span className="material-symbols-outlined text-[12px]">
                  {selectedResto.isOpen ? 'door_front' : 'lock_clock'}
                </span>
                <span>{selectedResto.statusLabel}</span>
              </span>
            </div>

            <div className="flex items-start gap-3">
              <img
                src={selectedResto.imageUrl}
                alt={selectedResto.name}
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <h3 className="font-soria text-base font-bold text-[#191c1f] truncate">
                  {selectedResto.name}
                </h3>
                <span className="text-xs text-[#5b4138] truncate">{selectedResto.cuisine}</span>
                <span className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">schedule</span>
                  <span>{selectedResto.openingHoursText}</span>
                </span>
              </div>
            </div>

            {/* Promotion box in map preview */}
            {selectedResto.promotion && (
              <div className="p-2 rounded-lg bg-amber-50 border border-amber-300 text-amber-950 text-[11px] flex flex-col gap-0.5">
                <span className="font-extrabold uppercase text-[9px] text-amber-800">
                  {selectedResto.promotion.discountTag} • {selectedResto.promotion.dateRangeText}
                </span>
                <span className="font-bold line-clamp-1">{selectedResto.promotion.title}</span>
              </div>
            )}

            {/* Visible Detail CTA Button (Prioridad requerida por el usuario) */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#5b4138]">A {selectedResto.distanceKm} km</span>
                <span className="text-xs font-bold text-[#191c1f]">{selectedResto.eta}</span>
              </div>

              <button
                onClick={() => onOpenDetail(selectedResto)}
                type="button"
                className="h-9 px-4 rounded-full bg-[#111827] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform cursor-pointer"
                aria-label={`Abrir detalle completo de ${selectedResto.name}`}
              >
                <span>Ver Detalle y Carta</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
