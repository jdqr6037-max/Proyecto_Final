import React, { useState } from 'react';
import { Dish, Restaurant } from '../types';
import { CATEGORIES } from '../data/mockData';

interface ExploreViewProps {
  dishes: Dish[];
  restaurants: Restaurant[];
  onAddToCart: (dish: Dish) => void;
  onToggleFavorite: (dishId: string) => void;
  onNavigateToMap: () => void;
  onNavigateToDish: (dish: Dish) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  dishes,
  restaurants,
  onAddToCart,
  onToggleFavorite,
  onNavigateToMap
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('todos');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filterChips = [
    { id: 'todos', label: 'Todos los platos', icon: 'lunch_dining' },
    { id: 'valorados', label: 'Mejor valorados', icon: 'star' },
    { id: 'rapidos', label: '< 30 min', icon: 'schedule' },
    { id: 'gratis', label: 'Envío gratis', icon: 'moped' },
    { id: 'ofertas', label: 'Ofertas del día', icon: 'local_fire_department' },
    { id: 'criollo', label: 'Tradición Criolla', emoji: '🇵🇪' },
  ];

  // Filtering dishes based on active filters and search
  const filteredDishes = dishes.filter((dish) => {
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = dish.name.toLowerCase().includes(q);
      const matchRest = dish.restaurant.toLowerCase().includes(q);
      const matchDesc = dish.description.toLowerCase().includes(q);
      if (!matchName && !matchRest && !matchDesc) return false;
    }

    if (selectedCategory !== 'todos') {
      if (dish.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
    }

    if (selectedFilter === 'valorados') return dish.rating >= 4.9;
    if (selectedFilter === 'rapidos') return dish.eta.includes('15') || dish.eta.includes('20');
    if (selectedFilter === 'gratis') return dish.freeDelivery || dish.deliveryFee === 'Gratis';
    if (selectedFilter === 'ofertas') return dish.originalPrice !== undefined;
    if (selectedFilter === 'criollo') return dish.category === 'Criollo';

    return true;
  });

  const heroDish = dishes.find(d => d.id === 'lomo-saltado-hero') || dishes[0];

  return (
    <div className="w-full flex flex-col gap-8 pb-16">
      {/* Top Banner & Filter Strip */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#ff5e1e]/15 text-[#ff5e1e] text-xs uppercase tracking-wider font-extrabold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">bolt</span> Entrega Express
              </span>
              <span className="text-xs text-[#5b4138] font-medium">• Miraflores, Lima</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#191c1f] tracking-tight">
              Tu comida favorita en minutos ⚡
            </h1>
            <p className="text-sm text-[#5b4138]">
              Los mejores restaurantes peruanos y antojos diarios directos a tu puerta.
            </p>
          </div>

          {/* Filter Chips Carousel */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar shrink-0">
            {filterChips.map((chip) => {
              const isActive = selectedFilter === chip.id;
              return (
                <button
                  key={chip.id}
                  onClick={() => setSelectedFilter(chip.id)}
                  className={`flex items-center gap-1.5 px-4 h-11 rounded-full text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95 shrink-0 ${
                    isActive
                      ? 'bg-[#191c1f] text-white'
                      : 'bg-white text-[#191c1f] hover:bg-[#f2f3f8]'
                  }`}
                  type="button"
                >
                  {chip.icon && (
                    <span 
                      className={`material-symbols-outlined text-[18px] ${
                        chip.id === 'valorados' ? 'text-yellow-400' : ''
                      }`}
                    >
                      {chip.icon}
                    </span>
                  )}
                  {chip.emoji && <span className="text-sm">{chip.emoji}</span>}
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories in Large Circles */}
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3 pt-2">
          {CATEGORIES.map((cat: { id: string; name: string; emoji: string; bgColor: string }) => {
            const isCatActive = selectedCategory === cat.name || (selectedCategory === 'todos' && false);
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(selectedCategory === cat.name ? 'todos' : cat.name);
                }}
                className="group flex flex-col items-center text-center gap-2 transition-transform hover:-translate-y-1"
                type="button"
              >
                <div 
                  className={`w-18 h-18 sm:w-20 sm:h-20 md:w-22 md:h-22 rounded-full ${cat.bgColor} flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-md shadow-sm relative overflow-hidden ${
                    isCatActive ? 'ring-3 ring-[#ff5e1e]' : ''
                  }`}
                >
                  <span className="text-3xl sm:text-4xl filter drop-shadow-sm group-hover:rotate-6 transition-transform">
                    {cat.emoji}
                  </span>
                </div>
                <span className="text-xs font-bold text-[#191c1f] group-hover:text-[#ff5e1e] transition-colors leading-tight">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Hero Featured Dish / Antojo del Día */}
      {heroDish && (
        <section className="relative w-full rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-[#eceef2]">
          <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-[#ff5e1e]/10 filter blur-3xl pointer-events-none"></div>
          <div className="absolute left-1/3 -bottom-20 w-80 h-80 rounded-full bg-[#7d2dce]/5 filter blur-3xl pointer-events-none"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8 lg:p-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 flex flex-col gap-4 z-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#ff5e1e] text-white text-xs font-bold shadow-md shadow-[#ff5e1e]/30 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
                  Antojo del Día
                </span>
                <span className="px-3 py-1 rounded-full bg-[#f2f3f8] text-xs text-[#5b4138] font-semibold">
                  {heroDish.restaurant} • {heroDish.district}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#191c1f] tracking-tight leading-tight">
                  Sabor de Tradición: {heroDish.name}
                </h2>
                <p className="text-sm sm:text-base text-[#5b4138] leading-relaxed">
                  {heroDish.description}
                </p>
              </div>

              {/* Quick Metrics Bar */}
              <div className="flex flex-wrap items-center gap-4 py-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#00a870]/10 flex items-center justify-center text-[#00a870]">
                    <span className="material-symbols-outlined text-[18px]">star</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#191c1f]">{heroDish.rating}</span>
                    <span className="text-[10px] text-[#5b4138] leading-none">({heroDish.reviewsCount}+ reseñas)</span>
                  </div>
                </div>
                <div className="w-[1px] h-8 bg-[#eceef2]"></div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#7d2dce]/10 flex items-center justify-center text-[#7d2dce]">
                    <span className="material-symbols-outlined text-[18px]">schedule</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#191c1f]">{heroDish.eta}</span>
                    <span className="text-[10px] text-[#5b4138] leading-none">Entrega promedio</span>
                  </div>
                </div>
                <div className="w-[1px] h-8 bg-[#eceef2]"></div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#ff5e1e]/10 flex items-center justify-center text-[#ff5e1e]">
                    <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#00a870]">Gratis</span>
                    <span className="text-[10px] text-[#5b4138] leading-none">Con FoodPrime</span>
                  </div>
                </div>
              </div>

              {/* Price & CTA */}
              <div className="flex items-center gap-4 pt-2">
                <div className="flex flex-col">
                  {heroDish.originalPrice && (
                    <span className="text-xs text-[#5b4138] line-through">S/ {heroDish.originalPrice.toFixed(2)}</span>
                  )}
                  <span className="text-2xl sm:text-3xl font-black text-[#191c1f]">
                    S/ {heroDish.price.toFixed(2)}
                  </span>
                </div>
                <button 
                  onClick={() => onAddToCart(heroDish)}
                  className="flex-1 max-w-xs h-12 px-6 rounded-full bg-[#ff5e1e] hover:bg-[#ab3500] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#ff5e1e]/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                  <span>Añadir al Pedido</span>
                </button>
              </div>
            </div>

            {/* Right Food Hero Photograph */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-xl group bg-[#f2f3f8]">
                <img 
                  src={heroDish.imageUrl} 
                  alt={heroDish.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <span className="text-xs font-semibold bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#6efcb9] animate-ping"></span>
                    Preparado al instante al wok
                  </span>
                  <span className="text-[11px] bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full">
                    Foto real del plato
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Joyas de la Gastronomía Peruana */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ff5e1e] text-[24px]">workspace_premium</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#191c1f]">
                Joyas de la Gastronomía Peruana
              </h2>
            </div>
            <p className="text-xs text-[#5b4138]">
              Platos emblemáticos seleccionados con la máxima frescura y sabor auténtico limeño.
            </p>
          </div>
          <button 
            onClick={onNavigateToMap}
            className="flex items-center gap-1 text-[#7d2dce] text-xs font-bold hover:underline"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">map</span>
            <span>Ver mapa de locales</span>
          </button>
        </div>

        {/* Dish Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredDishes.map((dish) => (
            <div 
              key={dish.id}
              className="group bg-white rounded-2xl p-3.5 shadow-[0_4px_16px_-2px_rgba(26,29,32,0.04)] hover:shadow-[0_12px_32px_-4px_rgba(26,29,32,0.08)] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 border border-[#eceef2]"
            >
              <div className="flex flex-col gap-3">
                {/* Image with Badges */}
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#f2f3f8]">
                  <img 
                    src={dish.imageUrl} 
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                    {dish.freeDelivery && (
                      <span className="px-2.5 py-1 rounded-full bg-[#00a870] text-white text-[11px] font-bold shadow-sm flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">moped</span>
                        Envío Gratis
                      </span>
                    )}
                    {dish.isPopular && !dish.freeDelivery && (
                      <span className="px-2.5 py-1 rounded-full bg-[#ff5e1e] text-white text-[11px] font-bold shadow-sm">
                        Top Seller 🔥
                      </span>
                    )}
                  </div>

                  {/* Favorite button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(dish.id);
                    }}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#7d2dce] shadow-sm hover:scale-110 active:scale-90 transition-transform"
                    type="button"
                    aria-label="Marcar como favorito"
                  >
                    <span 
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: dish.isFavorite ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      favorite
                    </span>
                  </button>

                  <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 text-[#191c1f] shadow-sm">
                    <span className="material-symbols-outlined text-yellow-500 text-[14px]">star</span>
                    <span className="text-xs font-extrabold">{dish.rating}</span>
                    <span className="text-[10px] text-[#5b4138]">({dish.reviewsCount}+)</span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="flex flex-col px-1">
                  <div className="flex items-center justify-between text-[#5b4138] text-[11px]">
                    <span className="font-semibold">{dish.restaurant}</span>
                    <span className="flex items-center gap-0.5 text-[#006c47] font-bold">
                      <span className="material-symbols-outlined text-[13px]">schedule</span> {dish.eta}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#191c1f] group-hover:text-[#ff5e1e] transition-colors mt-0.5 leading-snug line-clamp-1">
                    {dish.name}
                  </h3>
                  <p className="text-xs text-[#5b4138] line-clamp-2 mt-1 leading-relaxed">
                    {dish.description}
                  </p>
                </div>
              </div>

              {/* Bottom Price & Add button */}
              <div className="flex items-center justify-between pt-3 px-1 mt-2 border-t border-[#eceef2]">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-black text-[#191c1f]">S/ {dish.price.toFixed(2)}</span>
                  {dish.originalPrice && (
                    <span className="text-xs text-[#5b4138] line-through">
                      S/ {dish.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => onAddToCart(dish)}
                  className="h-9 px-3.5 rounded-full bg-[#ff5e1e] hover:bg-[#ab3500] text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-[#ff5e1e]/30 transition-all hover:scale-105 active:scale-95"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>Agregar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FoodPrime Club Promo Strip */}
      <section className="w-full bg-gradient-to-r from-[#7d2dce] to-[#974ce9] rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
        <div className="flex items-center gap-4 z-10">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 text-white shadow-inner">
            <span className="material-symbols-outlined text-[32px]">workspace_premium</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white text-[#7d2dce] text-[11px] font-black uppercase">
                FoodPrime Club
              </span>
              <span className="text-white/80 text-xs font-semibold">1er mes sin costo</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mt-1">
              Envíos gratis ilimitados en tus restaurantes favoritos
            </h3>
            <p className="text-xs sm:text-sm text-white/90 mt-0.5">
              Ahorra un promedio de S/ 45.00 al mes en pedidos superiores a S/ 25.00.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 z-10 shrink-0">
          <button 
            type="button"
            className="h-11 px-6 rounded-full bg-white text-[#191c1f] text-xs font-bold hover:bg-[#f2f3f8] transition-all shadow-md active:scale-95"
          >
            Probar Gratis por 30 Días
          </button>
        </div>
      </section>

      {/* Restaurantes Populares Cerca de Miraflores */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#7d2dce] text-[24px]">location_on</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#191c1f]">
                Restaurantes Populares cerca de Miraflores
              </h2>
            </div>
            <p className="text-xs text-[#5b4138]">
              Los locales con mejor tiempo y valoración en tu zona de cobertura.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {restaurants.map((resto) => (
            <div 
              key={resto.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1 border border-[#eceef2]"
            >
              <div className="relative w-full h-44 overflow-hidden bg-[#f2f3f8]">
                <img 
                  src={resto.imageUrl} 
                  alt={resto.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[#191c1f] text-[11px] font-bold flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-yellow-500 text-[14px]">star</span>
                  <span>{resto.rating}</span>
                  <span className="text-[#5b4138] font-normal">({resto.reviewsCount})</span>
                </div>

                <div className="absolute top-3 right-3 bg-[#00a870] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">moped</span>
                  <span>Envío {resto.deliveryFee}</span>
                </div>
              </div>

              <div className="p-4 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#191c1f] group-hover:text-[#ff5e1e] transition-colors truncate">
                    {resto.name}
                  </h3>
                  <span className="text-xs font-bold text-[#006c47] shrink-0">{resto.eta}</span>
                </div>
                <p className="text-xs text-[#5b4138] truncate">{resto.cuisine}</p>
                <div className="flex items-center gap-2 pt-2 text-[#5b4138] text-[11px] border-t border-[#eceef2]/60 mt-1">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00a870]"></span> Abierto ahora
                  </span>
                  <span>•</span>
                  <span>Min. S/ {resto.minOrder.toFixed(2)}</span>
                  <span>•</span>
                  <span>{resto.district}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
