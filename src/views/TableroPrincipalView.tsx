import React, { useState } from 'react';
import { Restaurant, OrderTracking, SimulationState } from '../types';
import { RestaurantCard } from '../components/RestaurantCard';
import { LoadingSkeleton } from '../components/states/LoadingSkeleton';
import { ErrorState } from '../components/states/ErrorState';
import { EmptyState } from '../components/states/EmptyState';

interface TableroPrincipalViewProps {
  restaurants: Restaurant[];
  upcomingDelivery: OrderTracking | null;
  simulationState: SimulationState;
  onResetSimulation: () => void;
  onOpenRestaurantDetail: (resto: Restaurant) => void;
  onOpenDeliveryDetail: () => void;
  onNavigateToMap: () => void;
  onNavigateToDelivery?: () => void;
  onNavigateToTareas?: () => void;
  onToggleFavorite: (id: string) => void;
  searchQuery: string;
  selectedRadius: number;
  onlyOpen: boolean;
  onClearFilters: () => void;
  userAddress?: string;
  onOpenLocationModal?: () => void;
}

export const TableroPrincipalView: React.FC<TableroPrincipalViewProps> = ({
  restaurants,
  upcomingDelivery,
  simulationState,
  onResetSimulation,
  onOpenRestaurantDetail,
  onOpenDeliveryDetail,
  onNavigateToMap,
  onNavigateToDelivery,
  onNavigateToTareas,
  onToggleFavorite,
  searchQuery,
  selectedRadius,
  onlyOpen,
  onClearFilters,
  userAddress = 'Av. José Larco 743, Miraflores',
  onOpenLocationModal
}) => {
  const [selectedStallType, setSelectedStallType] = useState<string>('todos');

  // Handle explicit simulation states requested by user
  if (simulationState === 'loading') {
    return (
      <div className="py-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold font-soria text-[#191c1f]">
            Cargando tablero y próximas entregas...
          </h1>
          <button
            onClick={onResetSimulation}
            className="text-xs font-bold text-stone-600 hover:text-black underline"
            type="button"
          >
            Volver a estado normal
          </button>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (simulationState === 'error') {
    return (
      <div className="py-6">
        <ErrorState onRetry={onResetSimulation} />
      </div>
    );
  }

  if (simulationState === 'empty') {
    return (
      <div className="py-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold font-soria text-[#191c1f]">
            Tablero Principal
          </h1>
          <button
            onClick={onResetSimulation}
            className="text-xs font-bold text-stone-600 hover:text-black underline"
            type="button"
          >
            Volver a estado normal
          </button>
        </div>
        <EmptyState
          type="deliveries"
          onAction={onResetSimulation}
          actionText="Restablecer tablero"
        />
      </div>
    );
  }

  // Filter restaurants based on search, radius, opening status, and stall type
  const filteredRestaurants = restaurants.filter((resto) => {
    const matchesSearch = 
      resto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resto.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resto.district.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRadius = resto.distanceKm <= selectedRadius;
    const matchesOpen = onlyOpen ? resto.isOpen : true;
    const matchesType = selectedStallType === 'todos' || resto.stallType === selectedStallType;

    return matchesSearch && matchesRadius && matchesOpen && matchesType;
  });

  const handleGoToDelivery = () => {
    if (onNavigateToDelivery) {
      onNavigateToDelivery();
    } else {
      onOpenDeliveryDetail();
    }
  };

  return (
    <div className="py-6 flex flex-col gap-8">
      {/* HERO PRINCIPAL ATRACTIVO PARA LOS CLIENTES CON TONOS NARANJA Y MARRÓN */}
      <section 
        aria-label="Bienvenida y promociones destacadas"
        className="relative rounded-3xl p-6 sm:p-8 md:p-10 bg-linear-to-br from-[#2c1810] via-[#3d261e] to-[#4e2d1f] text-white border border-orange-400/30 shadow-xl overflow-hidden"
      >
        {/* Decorative subtle ambient warm glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-[#ff5e1e]/20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-10 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col gap-6 max-w-3xl">
          {/* Top Pill / Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-orange-500/20 border border-orange-400/50 text-orange-200 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
              <span className="material-symbols-outlined text-[16px] text-amber-300">local_fire_department</span>
              <span>Huariques y Mercados del Perú</span>
            </span>

            {upcomingDelivery && (
              <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[#ff5e1e]"></span>
                <span>1 pedido en camino ({upcomingDelivery.etaMinutes} min)</span>
              </span>
            )}
          </div>

          {/* Eye-catching Headline */}
          <div className="flex flex-col gap-2">
            <h1 className="font-soria text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
              Comida Criolla, Marina y de Barrio Directo a tu Puerta
            </h1>
            <p className="text-sm sm:text-base text-amber-100/85 max-w-2xl leading-relaxed">
              Descubre las mejores recetas tradicionales de mercado, cevicherías emblemáticas y carretillas gourmet en Lima. Entrega rápida, empaques ecológicos y platos preparados al momento.
            </p>
          </div>

          {/* Action CTAs: Botones del principio ordenados con jerarquía */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* 1. Botón Delivery */}
            <button
              type="button"
              onClick={handleGoToDelivery}
              className="h-12 px-5 sm:px-6 rounded-full bg-linear-to-r from-[#ff5e1e] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] text-white text-xs sm:text-sm font-black flex items-center gap-2.5 shadow-lg shadow-orange-950/40 transition-all cursor-pointer active:scale-95 border border-amber-300/40"
              title="Presiona aquí para ver tus próximas entregas"
              aria-label="Abrir sección de delivery y próximas entregas"
            >
              <span className="material-symbols-outlined text-[22px] animate-pulse">two_wheeler</span>
              <span>Delivery</span>
              {upcomingDelivery && (
                <span className="px-2 py-0.5 rounded-full bg-[#2c1810] text-amber-300 text-[11px] font-mono font-bold ml-1">
                  ~{upcomingDelivery.etaMinutes}m
                </span>
              )}
            </button>

            {/* 2. Botón de Ubicación */}
            {onOpenLocationModal && (
              <button
                type="button"
                onClick={onOpenLocationModal}
                className="h-12 px-4 sm:px-5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold flex items-center gap-2 border border-white/25 backdrop-blur-xs transition-all cursor-pointer shadow-xs"
                title="Cambiar dirección de entrega"
              >
                <span className="material-symbols-outlined text-[20px] text-amber-300">pin_drop</span>
                <span className="truncate max-w-[150px] sm:max-w-[200px]">{userAddress}</span>
                <span className="text-[10px] text-amber-200 font-extrabold uppercase ml-1 px-1.5 py-0.5 rounded-md bg-white/10">Cambiar</span>
              </button>
            )}

            {/* 3. Botón Ver Locales en Mapa */}
            <button
              type="button"
              onClick={onNavigateToMap}
              className="h-12 px-4 sm:px-5 rounded-full bg-amber-400 hover:bg-amber-300 text-[#2c1810] text-xs sm:text-sm font-black flex items-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">explore</span>
              <span>Ver en Mapa</span>
            </button>

            {/* 4. Botón Planificador IA */}
            {onNavigateToTareas && (
              <button
                type="button"
                onClick={onNavigateToTareas}
                className="h-12 px-4 sm:px-5 rounded-full bg-white/10 hover:bg-white/20 text-amber-200 text-xs sm:text-sm font-bold flex items-center gap-2 border border-amber-400/30 backdrop-blur-xs transition-all cursor-pointer shadow-xs"
                title="Abrir Planificador Gastronómico y Nutrición IA"
              >
                <span className="material-symbols-outlined text-[20px] text-amber-300">psychology</span>
                <span>Planificador IA</span>
              </button>
            )}
          </div>

          {/* Highlights Mini Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/15 text-xs text-amber-100/90 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#ff5e1e]/30 text-amber-300 flex items-center justify-center font-bold">✓</span>
              <span>Delivery seguro en ~30 minutos</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#ff5e1e]/30 text-amber-300 flex items-center justify-center font-bold">✓</span>
              <span>100% Locales verificados</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#ff5e1e]/30 text-amber-300 flex items-center justify-center font-bold">✓</span>
              <span>Opciones con envío gratis</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECCIÓN PRINCIPAL: BUSCADOR DE LUGARES CERCANOS PARA COMER */}
      <section aria-labelledby="section-nearby-title" className="flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 id="section-nearby-title" className="text-xl sm:text-2xl font-bold font-soria text-[#191c1f]">
              Lugares Cercanos para Buscar Comida
            </h2>
            <p className="text-xs text-[#5b4138] mt-0.5">
              Huariques, carretillas gourmet y restaurantes tradicionales con opciones abiertas y promociones vigentes.
            </p>
          </div>

          {/* Quick link to map view */}
          <button
            onClick={onNavigateToMap}
            type="button"
            className="h-10 px-4 rounded-full bg-orange-50 hover:bg-orange-100 text-[#3d261e] border border-orange-300 text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-[#ff5e1e]">map</span>
            <span>Ver Todos en el Mapa</span>
          </button>
        </div>

        {/* Quick Filter Categories by Stall Type */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'todos', label: 'Todos los Puestos y Locales', icon: 'grid_view' },
            { id: 'Huco Tradicional', label: 'Huariques Criollos', icon: 'soup_kitchen' },
            { id: 'Cevichería Local', label: 'Cevicherías Frescas', icon: 'set_meal' },
            { id: 'Puesto Callejero', label: 'Carretillas & Brasas', icon: 'outdoor_grill' },
            { id: 'Restaurante Gourmet', label: 'Chifas & Gourmet', icon: 'restaurant' },
          ].map((type) => {
            const isSelected = selectedStallType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelectedStallType(type.id)}
                className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#3d261e] text-white shadow-xs border border-[#5b4138]'
                    : 'bg-[#fdfbf7] border border-orange-200 text-[#5b4138] hover:bg-orange-50 hover:text-[#3d261e]'
                }`}
              >
                <span className={`material-symbols-outlined text-[16px] ${isSelected ? 'text-amber-300' : 'text-[#ff5e1e]'}`}>
                  {type.icon}
                </span>
                <span>{type.label}</span>
              </button>
            );
          })}
        </div>

        {/* Grid of Restaurant Cards or Empty Search State */}
        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onOpenDetail={onOpenRestaurantDetail}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            type="search"
            title="No se encontraron puestos con esos filtros"
            description="Ningún local coincide con la búsqueda o el radio seleccionado. Prueba cambiando los filtros."
            actionText="Limpiar filtros y ver todos"
            onAction={onClearFilters}
          />
        )}
      </section>
    </div>
  );
};
