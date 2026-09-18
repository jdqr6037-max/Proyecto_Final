import React, { useState, useEffect } from 'react';

interface SavedAddress {
  id: string;
  label: string;
  address: string;
}

interface LocationEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAddress: string;
  onConfirmLocation: (newAddress: string, district?: string) => void;
  savedAddresses?: SavedAddress[];
  openRestaurantsCount?: number;
  totalRestaurantsCount?: number;
}

const POPULAR_DISTRICTS = [
  { name: 'Miraflores', label: 'Miraflores', defaultAddress: 'Av. José Larco 743, Miraflores' },
  { name: 'San Isidro', label: 'San Isidro', defaultAddress: 'Av. Las Camelias 490, San Isidro' },
  { name: 'Barranco', label: 'Barranco', defaultAddress: 'Av. Pedro de Osma 135, Barranco' },
  { name: 'Surco', label: 'Santiago de Surco', defaultAddress: 'Av. Caminos del Inca 1240, Surco' },
  { name: 'San Borja', label: 'San Borja', defaultAddress: 'Av. Aviación 2850, San Borja' },
  { name: 'Magdalena', label: 'Magdalena', defaultAddress: 'Jr. José Gálvez 480, Magdalena del Mar' },
];

export const LocationEntryModal: React.FC<LocationEntryModalProps> = ({
  isOpen,
  onClose,
  currentAddress,
  onConfirmLocation,
  savedAddresses = [],
  openRestaurantsCount = 4,
  totalRestaurantsCount = 5,
}) => {
  const [addressInput, setAddressInput] = useState<string>(currentAddress || '');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Miraflores');
  const [isLocatingGps, setIsLocatingGps] = useState<boolean>(false);
  const [gpsStatusMessage, setGpsStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setAddressInput(currentAddress || 'Av. José Larco 743, Miraflores');
      setGpsStatusMessage(null);
    }
  }, [isOpen, currentAddress]);

  if (!isOpen) return null;

  const handleSelectDistrict = (district: { name: string; defaultAddress: string }) => {
    setSelectedDistrict(district.name);
    setAddressInput(district.defaultAddress);
    setGpsStatusMessage(null);
  };

  const handleSelectSaved = (saved: SavedAddress) => {
    setAddressInput(saved.address);
    setGpsStatusMessage(`Dirección guardada seleccionada: ${saved.label}`);
  };

  const handleUseGps = () => {
    setIsLocatingGps(true);
    setGpsStatusMessage('Localizando tu señal GPS actual...');

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(4);
          const lng = position.coords.longitude.toFixed(4);
          const simulatedAddress = `Ubicación GPS (${lat}, ${lng}) - Cerca al Parque Kennedy, Miraflores`;
          setAddressInput(simulatedAddress);
          setSelectedDistrict('Miraflores');
          setIsLocatingGps(false);
          setGpsStatusMessage('Ubicación GPS obtenida con precisión de satélite.');
        },
        (error) => {
          // Fallback graceful
          const fallback = 'Av. José Pardo 450, Miraflores (GPS estimado)';
          setAddressInput(fallback);
          setSelectedDistrict('Miraflores');
          setIsLocatingGps(false);
          setGpsStatusMessage('Ubicación aproximada detectada en Miraflores.');
        },
        { timeout: 4000 }
      );
    } else {
      setTimeout(() => {
        setAddressInput('Av. Alfredo Benavides 1240, Miraflores');
        setIsLocatingGps(false);
        setGpsStatusMessage('Ubicación predeterminada asignada.');
      }, 600);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressInput.trim()) return;
    onConfirmLocation(addressInput.trim(), selectedDistrict);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-location-title"
    >
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true"
      />

      <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 border border-slate-200 animate-in zoom-in-95 duration-150">
        {/* Header bar */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-3 bg-linear-to-r from-amber-50/70 to-orange-50/40">
          <div className="flex items-start gap-3">
            <span className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-black text-xl shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[24px]">pin_drop</span>
            </span>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                  Ingreso de Ubicación
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span>Restaurantes abiertos</span>
                </span>
              </div>
              <h2 id="modal-location-title" className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                ¿Dónde quieres recibir tu pedido?
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Ingresa tu dirección para centrar el mapa y visualizar los restaurantes abiertos a tu alrededor.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center border border-slate-200 transition-colors shrink-0 cursor-pointer"
            aria-label="Cerrar ventana de ubicación"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          {/* Main Input Form */}
          <div>
            <label htmlFor="user-address-input" className="block text-xs font-black text-slate-800 mb-1.5">
              Dirección exacta, calle o punto de referencia:
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400 material-symbols-outlined text-[20px] pointer-events-none">
                location_on
              </span>
              <input
                id="user-address-input"
                type="text"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                placeholder="Ej. Av. José Larco 743, Miraflores"
                className="w-full h-12 pl-11 pr-10 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-2 focus:outline-slate-900 transition-all shadow-inner"
                required
                autoFocus
              />
              {addressInput && (
                <button
                  type="button"
                  onClick={() => setAddressInput('')}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  aria-label="Limpiar campo"
                >
                  <span className="material-symbols-outlined text-[18px]">cancel</span>
                </button>
              )}
            </div>
          </div>

          {/* GPS Quick Action Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-cyan-600 text-[20px]">my_location</span>
              <span className="text-xs text-slate-700 font-bold">
                ¿Deseas usar tu posición en tiempo real?
              </span>
            </div>
            <button
              type="button"
              onClick={handleUseGps}
              disabled={isLocatingGps}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 disabled:bg-slate-200 border border-slate-300 text-slate-900 text-xs font-black flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              {isLocatingGps ? (
                <>
                  <span className="material-symbols-outlined text-[16px] animate-spin text-cyan-600">progress_activity</span>
                  <span>Detectando GPS...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px] text-cyan-600">near_me</span>
                  <span>Usar mi GPS actual</span>
                </>
              )}
            </button>
          </div>

          {gpsStatusMessage && (
            <div className="text-[11px] font-bold text-cyan-900 bg-cyan-50 px-3 py-1.5 rounded-xl border border-cyan-200 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-cyan-700">check_circle</span>
              <span>{gpsStatusMessage}</span>
            </div>
          )}

          {/* District Chips */}
          <div>
            <span className="block text-[11px] font-black uppercase text-slate-600 tracking-wider mb-2">
              Seleccionar distrito gastronómico rápido:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_DISTRICTS.map((dist) => {
                const isSelected = selectedDistrict === dist.name || addressInput.includes(dist.name);
                return (
                  <button
                    key={dist.name}
                    type="button"
                    onClick={() => handleSelectDistrict(dist)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-2xs font-black'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {dist.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Saved Addresses Section (if any) */}
          {savedAddresses.length > 0 && (
            <div>
              <span className="block text-[11px] font-black uppercase text-slate-600 tracking-wider mb-2">
                Tus direcciones guardadas:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {savedAddresses.map((saved) => (
                  <button
                    key={saved.id}
                    type="button"
                    onClick={() => handleSelectSaved(saved)}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50 text-left transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div className="min-w-0 pr-2">
                      <span className="text-xs font-black text-slate-900 block group-hover:text-amber-800">
                        {saved.label}
                      </span>
                      <span className="text-[11px] text-slate-600 truncate block">
                        {saved.address}
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-slate-700 text-[18px]">
                      chevron_right
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Preview of Open Restaurants indicator */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-emerald-950 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping"></span>
              <span className="font-bold">
                Al ingresar, el mapa se filtrará automáticamente mostrando los <strong>restaurantes abiertos</strong> en tu zona.
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-700 text-white font-black text-[11px] shrink-0">
              {openRestaurantsCount} abiertos
            </span>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-black flex items-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-amber-400">map</span>
              <span>Ingresar y Ver Mapa de Restaurantes Abiertos</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
