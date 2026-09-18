import React from 'react';
import { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onOpenDetail: (restaurant: Restaurant) => void;
  onToggleFavorite?: (id: string) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onOpenDetail,
  onToggleFavorite
}) => {
  return (
    <article 
      className="bg-white rounded-2xl border border-[#eceef2] shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group"
      aria-labelledby={`resto-${restaurant.id}-name`}
    >
      <div>
        {/* Card Image Banner with Status Indicators */}
        <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

          {/* Top Indicators: Stall Type & Favorite */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#3d261e] text-[11px] font-bold shadow-xs flex items-center gap-1 border border-orange-100">
              <span className="material-symbols-outlined text-[14px] text-[#ff5e1e]">storefront</span>
              <span>{restaurant.stallType}</span>
            </span>

            {onToggleFavorite && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(restaurant.id);
                }}
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
                aria-label={restaurant.isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
              >
                <span 
                  className={`material-symbols-outlined text-[18px] ${restaurant.isFavorite ? 'text-red-500' : 'text-white'}`}
                  style={{ fontVariationSettings: restaurant.isFavorite ? "'FILL' 1" : "'FILL' 0" }}
                >
                  favorite
                </span>
              </button>
            )}
          </div>

          {/* Distance and ETA Capsule */}
          <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 text-white text-xs font-semibold">
            <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs flex items-center gap-1 text-[11px]">
              <span className="material-symbols-outlined text-[13px] text-amber-400">near_me</span>
              <span>{restaurant.distanceKm} km</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs flex items-center gap-1 text-[11px]">
              <span className="material-symbols-outlined text-[13px] text-orange-400">schedule</span>
              <span>{restaurant.eta}</span>
            </span>
          </div>

          {/* Rating Badge */}
          <div className="absolute bottom-2.5 right-3 px-2.5 py-0.5 rounded-md bg-linear-to-r from-amber-400 to-orange-400 text-[#2c1810] font-black text-[11px] flex items-center gap-1 shadow-xs">
            <span className="material-symbols-outlined text-[14px]">star</span>
            <span>{restaurant.rating}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 flex flex-col gap-3">
          {/* Status Label */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span 
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase border ${
                  restaurant.isOpen
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                    : 'bg-rose-50 text-rose-900 border-rose-300'
                }`}
              >
                <span className="material-symbols-outlined text-[13px]">
                  {restaurant.isOpen ? 'door_front' : 'lock_clock'}
                </span>
                <span>{restaurant.statusLabel}</span>
              </span>

              <span className="text-[11px] text-[#5b4138]">
                {restaurant.openingHoursText}
              </span>
            </div>
          </div>

          {/* Title & Cuisine */}
          <div className="flex flex-col">
            <h3 
              id={`resto-${restaurant.id}-name`}
              className="font-soria text-lg font-bold text-[#191c1f] leading-snug group-hover:text-[#ff5e1e] transition-colors"
            >
              {restaurant.name}
            </h3>
            <p className="text-xs text-[#5b4138] line-clamp-1 mt-0.5">
              {restaurant.cuisine}
            </p>
          </div>

          {/* Promotion Window Box */}
          {restaurant.promotion && (
            <div className="p-2.5 rounded-xl bg-orange-50/80 border border-orange-200 text-[#3d261e] flex flex-col gap-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold uppercase text-[10px] tracking-wider text-[#ab3500] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-[#ff5e1e]">local_offer</span>
                  <span>{restaurant.promotion.discountTag}</span>
                </span>
                <span className="text-[10px] font-black text-[#561600] bg-orange-200/80 px-1.5 py-0.2 rounded">
                  Faltan {restaurant.promotion.daysLeft}d
                </span>
              </div>
              <span className="font-bold text-stone-900 text-[11px] line-clamp-1">
                {restaurant.promotion.title}
              </span>
              <span className="text-[10px] text-[#5b4138] flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[12px] text-[#ff5e1e]">event</span>
                <span>{restaurant.promotion.dateRangeText}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Prominent CTA for opening details */}
      <div className="px-4 pb-4 pt-1 flex items-center justify-between gap-2 border-t border-[#eceef2] mt-2">
        <div className="flex flex-col">
          <span className="text-[10px] text-[#5b4138] uppercase font-bold">Costo de envío</span>
          <span className="text-xs font-extrabold text-[#3d261e]">
            {restaurant.deliveryFee === 'Gratis' || restaurant.deliveryFee === 'S/ 0.00' ? '¡Envío Gratis!' : restaurant.deliveryFee}
          </span>
        </div>

        {/* Visible CTA button in rich brown with orange hover */}
        <button
          onClick={() => onOpenDetail(restaurant)}
          type="button"
          className="h-9 px-4 rounded-full bg-[#3d261e] hover:bg-[#ff5e1e] text-white text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-xs cursor-pointer border border-[#5b4138]"
          aria-label={`Ver detalle completo y promociones de ${restaurant.name}`}
        >
          <span>Ver Detalle</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
    </article>
  );
};
