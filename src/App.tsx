import React, { useState } from 'react';
import { ScreenId, SimulationState, Restaurant, CartItem } from './types';
import { NEARBY_RESTAURANTS, CURRENT_UPCOMING_DELIVERY, MOCK_USER, INITIAL_DISHES } from './data/mockData';

import { HorizontalNavbar } from './components/HorizontalNavbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Toast } from './components/Toast';
import { CartDrawer } from './components/CartDrawer';

import { RestaurantDetailModal } from './components/modals/RestaurantDetailModal';
import { DeliveryDetailModal } from './components/modals/DeliveryDetailModal';
import { LocationEntryModal } from './components/modals/LocationEntryModal';

import { TableroPrincipalView } from './views/TableroPrincipalView';
import { PlanificadorTareasView } from './views/PlanificadorTareasView';
import { MapaCercanoView } from './views/MapaCercanoView';
import { ProgresoPedidosView } from './views/ProgresoPedidosView';
import { DashboardSesionView } from './views/DashboardSesionView';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('tablero');
  const [simulationState, setSimulationState] = useState<SimulationState>('normal');
  const [user, setUser] = useState(MOCK_USER);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(NEARBY_RESTAURANTS);
  const [upcomingDelivery, setUpcomingDelivery] = useState(CURRENT_UPCOMING_DELIVERY);

  // Address and location selection states
  const [userAddress, setUserAddress] = useState<string>(
    MOCK_USER.savedAddresses[0]?.address || 'Av. José Larco 743, Miraflores'
  );
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [mapFilterOpenOnly, setMapFilterOpenOnly] = useState<boolean>(true);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRadius, setSelectedRadius] = useState<number>(2);
  const [onlyOpen, setOnlyOpen] = useState<boolean>(false);

  // Modals
  const [detailRestaurant, setDetailRestaurant] = useState<Restaurant | null>(null);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cart items
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      dish: INITIAL_DISHES[0],
      quantity: 1
    }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleToggleFavorite = (id: string) => {
    setRestaurants(prev =>
      prev.map(r => {
        if (r.id === id) {
          const nextFav = !r.isFavorite;
          showToast(nextFav ? `❤️ Añadido a tus favoritos: ${r.name}` : `Removido de favoritos`);
          return { ...r, isFavorite: nextFav };
        }
        return r;
      })
    );
  };

  const handleAddToCart = (dishName: string) => {
    const matchedDish = INITIAL_DISHES.find(d => d.restaurant.includes(dishName) || d.name.includes(dishName)) || INITIAL_DISHES[0];
    setCartItems(prev => {
      const existing = prev.find(item => item.dish.id === matchedDish.id);
      if (existing) {
        return prev.map(item =>
          item.dish.id === matchedDish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { dish: matchedDish, quantity: 1 }];
    });
    showToast(`¡Añadido a tu canasta para entrega rápida!`);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (dishId: string, delta: number) => {
    setCartItems(prev =>
      prev
        .map(item => {
          if (item.dish.id === dishId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter((i): i is CartItem => i !== null)
    );
  };

  const handleAdvanceOrderStep = () => {
    if (!upcomingDelivery) return;
    const currentStep = upcomingDelivery.stepNumber;
    if (currentStep < 4) {
      const nextStep = currentStep + 1;
      const statusMap: Record<number, { status: 'confirmado' | 'cocina' | 'reparto' | 'entregado'; statusText: string; eta: number }> = {
        2: { status: 'cocina', statusText: 'Preparando en cocina', eta: 20 },
        3: { status: 'reparto', statusText: 'En camino con repartidor', eta: 12 },
        4: { status: 'entregado', statusText: 'Entregado en puerta', eta: 0 },
      };
      const info = statusMap[nextStep] || { status: 'entregado', statusText: 'Entregado en puerta', eta: 0 };
      
      const updatedTimeline = upcomingDelivery.timeline.map(s => ({
        ...s,
        completed: s.step < nextStep || s.step === nextStep,
        current: s.step === nextStep
      }));

      setUpcomingDelivery(prev => ({
        ...prev,
        stepNumber: nextStep,
        status: info.status,
        statusText: info.statusText,
        etaMinutes: info.eta,
        timeline: updatedTimeline
      }));

      showToast(`Estado de entrega avanzado a: ${info.statusText}`);
    } else {
      showToast('¡El pedido ya fue entregado exitosamente!');
    }
  };

  const handleConfirmLocation = (newAddress: string, district?: string) => {
    setUserAddress(newAddress);
    setIsLocationModalOpen(false);

    // Adapt distances if a specific district is targeted
    if (district) {
      setRestaurants(prev =>
        prev.map(r => {
          const isSameDistrict = r.district.toLowerCase() === district.toLowerCase();
          return {
            ...r,
            distanceKm: isSameDistrict ? Math.max(0.3, +(r.distanceKm * 0.7).toFixed(1)) : +(r.distanceKm + 1.2).toFixed(1)
          };
        })
      );
    }

    // Navigates directly to the map screen showing restaurants currently open!
    setMapFilterOpenOnly(true);
    setCurrentScreen('mapa');
    showToast(`📍 Ubicación fijada: ${newAddress}. Mostrando mapa con restaurantes abiertos.`);
  };

  const totalCartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="min-h-screen bg-[#f8f9fd] text-[#191c1f] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Feedback */}
      <Toast message={toastMessage} />

      {/* Modal de Ingreso de Ubicación */}
      <LocationEntryModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentAddress={userAddress}
        onConfirmLocation={handleConfirmLocation}
        savedAddresses={user.savedAddresses}
        openRestaurantsCount={restaurants.filter(r => r.isOpen).length}
        totalRestaurantsCount={restaurants.length}
      />

      {/* Detail Modals (High Priority Visible CTAs) */}
      <RestaurantDetailModal
        restaurant={detailRestaurant}
        onClose={() => setDetailRestaurant(null)}
        onSelectDish={(name) => handleAddToCart(name)}
      />

      <DeliveryDetailModal
        isOpen={isDeliveryModalOpen}
        order={simulationState === 'empty' ? null : upcomingDelivery}
        onClose={() => setIsDeliveryModalOpen(false)}
        onAdvanceOrderStep={handleAdvanceOrderStep}
        onNavigateToTracking={() => {
          setIsDeliveryModalOpen(false);
          setCurrentScreen('pedidos');
          showToast('Navegando al progreso completo de entregas');
        }}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setCurrentScreen('pedidos');
          showToast('¡Pedido enviado al puesto de comida con éxito!');
        }}
        onApplyCoupon={(code) => {
          showToast(`Cupón ${code} validado exitosamente`);
        }}
        discount={0}
      />

      {/* Top Horizontal Menu Bar (Barra de menú horizontal al inicio) */}
      <HorizontalNavbar
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        simulationState={simulationState}
        onChangeSimulationState={(st) => {
          setSimulationState(st);
          showToast(`Modo cambiado a: Estado ${st.toUpperCase()}`);
        }}
        user={user}
        activeDeliveryMinutes={upcomingDelivery?.etaMinutes}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
        selectedRadius={selectedRadius}
        onRadiusChange={(r) => setSelectedRadius(r)}
        onlyOpen={onlyOpen}
        onToggleOnlyOpen={() => setOnlyOpen(!onlyOpen)}
        userAddress={userAddress}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        {/* Dynamic View Display */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          {currentScreen === 'tablero' && (
            <TableroPrincipalView
              restaurants={restaurants}
              upcomingDelivery={simulationState === 'empty' ? null : upcomingDelivery}
              simulationState={simulationState}
              onResetSimulation={() => setSimulationState('normal')}
              onOpenRestaurantDetail={(resto) => setDetailRestaurant(resto)}
              onOpenDeliveryDetail={() => setIsDeliveryModalOpen(true)}
              onNavigateToMap={() => {
                setMapFilterOpenOnly(true);
                setCurrentScreen('mapa');
              }}
              onNavigateToDelivery={() => setCurrentScreen('pedidos')}
              onNavigateToTareas={() => setCurrentScreen('tareas')}
              onToggleFavorite={handleToggleFavorite}
              searchQuery={searchQuery}
              selectedRadius={selectedRadius}
              onlyOpen={onlyOpen}
              onClearFilters={() => {
                setSearchQuery('');
                setSelectedRadius(5);
                setOnlyOpen(false);
              }}
              userAddress={userAddress}
              onOpenLocationModal={() => setIsLocationModalOpen(true)}
            />
          )}

          {currentScreen === 'tareas' && (
            <PlanificadorTareasView
              currentUserId="user-mateo"
              userName={user.name}
              onShowToast={showToast}
              onAddToCart={(dishName) => handleAddToCart(dishName)}
            />
          )}

          {currentScreen === 'mapa' && (
            <MapaCercanoView
              restaurants={restaurants}
              onOpenDetail={(resto) => setDetailRestaurant(resto)}
              userAddress={userAddress}
              onOpenLocationModal={() => setIsLocationModalOpen(true)}
              initialFilterOpenOnly={mapFilterOpenOnly}
            />
          )}

          {currentScreen === 'pedidos' && (
            <ProgresoPedidosView
              currentOrder={simulationState === 'empty' ? null : upcomingDelivery}
              onOpenDetail={() => setIsDeliveryModalOpen(true)}
              onNavigateToTablero={() => setCurrentScreen('tablero')}
            />
          )}

          {currentScreen === 'login' && (
            <DashboardSesionView
              user={user}
              onLogin={(email) => {
                setUser(prev => ({ ...prev, isLoggedIn: true, email }));
                showToast(`Sesión iniciada con éxito`);
              }}
              onLogout={() => {
                setUser(prev => ({ ...prev, isLoggedIn: false }));
                showToast(`Sesión cerrada`);
              }}
              onNavigateToTablero={() => setCurrentScreen('tablero')}
              activeDeliveriesCount={upcomingDelivery ? 1 : 0}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation (Visible on mobile viewports) */}
      <MobileBottomNav
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        activeDeliveryMinutes={upcomingDelivery?.etaMinutes}
      />
    </div>
  );
}
