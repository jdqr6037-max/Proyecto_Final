import React, { useState } from 'react';
import { Dish, Restaurant } from '../types';

interface FavoritesViewProps {
  favoriteDishes: Dish[];
  favoriteRestaurants: Restaurant[];
  onAddToCart: (dish: Dish) => void;
  onToggleFavorite: (dishId: string) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favoriteDishes,
  favoriteRestaurants,
  onAddToCart,
  onToggleFavorite
}) => {
  const [activeTab, setActiveTab] = useState<'dishes' | 'places'>('dishes');
  const [activePill, setActivePill] = useState<string>('todos');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const pills = [
    { id: 'todos', label: 'Todos (12)' },
    { id: 'criollos', label: 'Platos Criollos (5)' },
    { id: 'marinos', label: 'Marinos & Ceviches (4)' },
    { id: 'postres', label: 'Dulces & Postres (3)' }
  ];

  return (
    <div className="w-full flex flex-col gap-6 max-w-3xl mx-auto pb-24">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span 
                className="material-symbols-outlined text-[#7d2dce] text-[22px]" 
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                favorite
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#191c1f]">
                Tus Favoritos
              </h1>
            </div>
            <p className="text-xs text-[#5b4138] mt-0.5">12 delicias guardadas para hoy</p>
          </div>

          <button 
            type="button"
            className="w-10 h-10 rounded-full bg-[#f2f3f8] hover:bg-[#eceef2] flex items-center justify-center text-[#5b4138] active:scale-95 transition-transform"
            title="Organizar carpetas"
          >
            <span className="material-symbols-outlined text-[20px]">create_new_folder</span>
          </button>
        </div>

        {/* Mode Switcher Pill */}
        <div className="p-1 rounded-full bg-[#eceef2] flex items-center shadow-inner max-w-md">
          <button
            onClick={() => setActiveTab('dishes')}
            className={`flex-1 py-2 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'dishes'
                ? 'bg-white text-[#191c1f] shadow-sm'
                : 'text-[#5b4138] hover:text-[#191c1f]'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[#ff5e1e] text-[18px]">lunch_dining</span>
            <span>Platos Favoritos</span>
          </button>
          <button
            onClick={() => setActiveTab('places')}
            className={`flex-1 py-2 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'places'
                ? 'bg-white text-[#191c1f] shadow-sm'
                : 'text-[#5b4138] hover:text-[#191c1f]'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            <span>Restaurantes</span>
          </button>
        </div>
      </div>

      {/* Filter Pills Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {pills.map((pill) => (
          <button
            key={pill.id}
            onClick={() => setActivePill(pill.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activePill === pill.id
                ? 'bg-[#191c1f] text-white shadow-sm'
                : 'bg-white text-[#5b4138] hover:text-[#191c1f] border border-[#eceef2]'
            }`}
            type="button"
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      {activeTab === 'dishes' ? (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-[#191c1f]">Platos Destacados</span>
            <button className="text-xs text-[#ab3500] font-bold flex items-center gap-0.5" type="button">
              <span>Ordenar</span>
              <span className="material-symbols-outlined text-[16px]">swap_vert</span>
            </button>
          </div>

          {/* Dish Cards */}
          <div className="flex flex-col gap-4">
            {favoriteDishes.slice(0, 4).map((dish) => (
              <div
                key={dish.id}
                className="w-full rounded-2xl bg-white p-3.5 shadow-sm hover:shadow-md transition-all flex flex-col gap-3 border border-[#eceef2]"
              >
                <div className="relative w-full h-48 rounded-xl overflow-hidden bg-[#f2f3f8]">
                  <img
                    src={dish.imageUrl}
                    alt={dish.name}
                    className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    {dish.freeDelivery ? (
                      <span className="px-2.5 py-1 rounded-full bg-[#00a870] text-white text-[11px] font-bold shadow-sm flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">moped</span>
                        Envío Gratis
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-[#ff5e1e] text-white text-[11px] font-bold shadow-sm flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          local_fire_department
                        </span>
                        Más pedido
                      </span>
                    )}
                  </div>

                  {/* Active Favorite Heart */}
                  <button
                    onClick={() => onToggleFavorite(dish.id)}
                    className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#7d2dce] shadow-sm active:scale-90 transition-transform"
                    type="button"
                    title="Quitar de favoritos"
                  >
                    <span 
                      className="material-symbols-outlined text-[20px]" 
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      favorite
                    </span>
                  </button>

                  {/* Delivery ETA Pill */}
                  <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md flex items-center gap-1 text-[#191c1f] shadow-sm">
                    <span className="material-symbols-outlined text-[#ff5e1e] text-[14px]">bolt</span>
                    <span className="text-[11px] font-bold">{dish.eta}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-base font-bold text-[#191c1f] truncate">{dish.name}</h2>
                      <p className="text-xs text-[#5b4138] truncate">{dish.restaurant} • {dish.district}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-[#f2f3f8] px-2 py-0.5 rounded-full shrink-0">
                      <span className="material-symbols-outlined text-[#00a870] text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span className="text-xs font-bold text-[#006c47]">{dish.rating}</span>
                      <span className="text-[10px] text-[#5b4138]">({dish.reviewsCount}+)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
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
                      className="h-10 px-4 rounded-full bg-[#ff5e1e] hover:bg-[#ab3500] text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-[#ff5e1e]/30 active:scale-95 transition-all"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                      <span>Agregar</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Social Collaborative Feature Invitation */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#7d2dce] to-[#974ce9] p-5 text-white shadow-xl flex items-center justify-between gap-3">
            <div className="flex flex-col gap-1 max-w-[240px]">
              <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[#efdbff] text-[11px] font-bold w-fit">
                Social Mood
              </span>
              <h3 className="text-base sm:text-lg font-bold leading-snug">¿Pidiendo en grupo?</h3>
              <p className="text-xs text-[#efdbff]/90">Crea una lista colaborativa y elijan favoritos juntos.</p>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              className="shrink-0 h-10 px-4 rounded-full bg-white text-[#7d2dce] text-xs font-bold shadow-md active:scale-95 transition-transform flex items-center gap-1.5"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">group_add</span>
              <span>Invitar</span>
            </button>
          </div>

          {/* Carousel: Restaurantes que amas */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#191c1f]">Restaurantes que amas</h2>
                <p className="text-xs text-[#5b4138]">Tus locales preferidos con beneficios</p>
              </div>
              <button 
                onClick={() => setActiveTab('places')}
                className="text-xs text-[#ab3500] font-bold"
                type="button"
              >
                Ver todos
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {favoriteRestaurants.slice(0, 2).map((resto) => (
                <div
                  key={resto.id}
                  className="p-3.5 rounded-2xl bg-white shadow-sm flex items-center gap-3 border border-[#eceef2]"
                >
                  <div className="w-16 h-16 rounded-xl bg-[#f2f3f8] overflow-hidden shrink-0 relative">
                    <img src={resto.imageUrl} alt={resto.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#191c1f] truncate">{resto.name}</h3>
                      <button className="text-[#7d2dce]" type="button">
                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          favorite
                        </span>
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#5b4138]">
                      <span className="flex items-center text-[#006c47] font-bold">
                        <span className="material-symbols-outlined text-[14px] mr-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        {resto.rating}
                      </span>
                      <span>•</span>
                      <span className="truncate">{resto.district}</span>
                      <span>•</span>
                      <span>{resto.eta}</span>
                    </div>
                    {resto.badge && (
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <span className="px-2 py-0.5 rounded-full bg-[#7d2dce]/10 text-[#7d2dce] text-[10px] font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">loyalty</span>
                          {resto.badge}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Micro-banner tip */}
          <div className="rounded-2xl bg-[#f2f3f8] p-4 flex items-center gap-3 border border-[#eceef2]">
            <div className="w-10 h-10 rounded-full bg-[#ffdbd0] flex items-center justify-center text-[#ab3500] shrink-0">
              <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-[#191c1f]">¿Buscas algo diferente?</h4>
              <p className="text-xs text-[#5b4138]">Explora las cartas y pulsa el corazón para guardar platos al instante.</p>
            </div>
          </div>
        </div>
      ) : (
        /* Restaurantes Favoritos Tab */
        <div className="flex flex-col gap-3">
          {favoriteRestaurants.map((resto) => (
            <div
              key={resto.id}
              className="p-4 rounded-2xl bg-white shadow-sm flex items-center gap-4 border border-[#eceef2]"
            >
              <div className="w-20 h-20 rounded-xl bg-[#f2f3f8] overflow-hidden shrink-0">
                <img src={resto.imageUrl} alt={resto.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#191c1f] truncate">{resto.name}</h3>
                  <button className="text-[#7d2dce]" type="button">
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      favorite
                    </span>
                  </button>
                </div>
                <p className="text-xs text-[#5b4138] truncate">{resto.cuisine}</p>
                <div className="flex items-center gap-2 text-xs text-[#5b4138]">
                  <span className="flex items-center text-[#006c47] font-bold">
                    ★ {resto.rating}
                  </span>
                  <span>•</span>
                  <span>{resto.eta}</span>
                  <span>•</span>
                  <span>Envío {resto.deliveryFee}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Social Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-[#efdbff] text-[#7d2dce] flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[28px]">group_add</span>
            </div>
            <h3 className="text-lg font-bold text-[#191c1f]">¡Pide con tus amigos!</h3>
            <p className="text-xs text-[#5b4138] mt-1 mb-4">
              Comparte este enlace para que cada uno agregue sus platos preferidos a la misma canasta.
            </p>
            <div className="w-full bg-[#f2f3f8] p-2.5 rounded-full flex items-center justify-between text-xs text-[#191c1f] font-mono mb-4 px-3">
              <span className="truncate">foodnow.pe/grupo/fn-8921</span>
              <button 
                onClick={() => {
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className="text-[#ff5e1e] font-bold ml-2 shrink-0"
                type="button"
              >
                {copiedLink ? '¡COPIADO!' : 'COPIAR'}
              </button>
            </div>
            <button
              onClick={() => setShowInviteModal(false)}
              className="w-full h-11 rounded-full bg-[#ff5e1e] text-white font-bold text-xs"
              type="button"
            >
              Listo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
