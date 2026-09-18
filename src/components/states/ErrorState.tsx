import React from 'react';

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'No se pudo conectar con el servicio de geolocalización de restaurantes en Miraflores.',
  onRetry
}) => {
  return (
    <div className="w-full max-w-xl mx-auto my-12 p-8 bg-white rounded-3xl border border-red-200 shadow-sm flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4 border border-red-200">
        <span className="material-symbols-outlined text-[32px]">warning</span>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold mb-2">
        <span className="w-2 h-2 rounded-full bg-red-600"></span>
        <span>Error de Conexión y Datos</span>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold font-soria text-[#191c1f] mb-2">
        Algo no salió como esperábamos
      </h2>

      <p className="text-sm text-[#5b4138] mb-6 max-w-md leading-relaxed">
        {message} Por favor, verifica tu conexión a internet o los permisos de ubicación para volver a rastrear los locales abiertos.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onRetry}
          className="h-11 px-6 rounded-full bg-[#111827] hover:bg-black text-white text-xs font-bold flex items-center gap-2 shadow-md transition-transform active:scale-95 cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          <span>Reintentar Conexión</span>
        </button>

        <button
          onClick={onRetry}
          className="h-11 px-5 rounded-full bg-white hover:bg-slate-50 text-[#191c1f] text-xs font-bold border border-slate-300 transition-colors"
          type="button"
        >
          <span>Cargar Puestos en Caché</span>
        </button>
      </div>
    </div>
  );
};
