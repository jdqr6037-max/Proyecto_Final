import React from 'react';
import { APP_LOGO } from '../data/mockData';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white mt-12 border-t border-[#eceef2] shadow-[0_-1px_10px_rgba(0,0,0,0.02)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-10 pb-8">
        {/* App Download Banner */}
        <div className="bg-gradient-to-r from-[#7d2dce] to-[#974ce9] rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 mb-10 shadow-lg">
          <div className="flex flex-col gap-1.5 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold">Lleva Food Now a donde vayas</h3>
            <p className="text-sm text-white/90 max-w-xl">
              Pide en segundos, sigue a tu repartidor en vivo y disfruta beneficios exclusivos en la app para Lima.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button 
              type="button"
              className="flex items-center gap-2 bg-white text-[#191c1f] px-5 py-2.5 rounded-full text-xs font-bold hover:bg-[#f2f3f8] transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">install_mobile</span>
              <span>App Store</span>
            </button>
            <button 
              type="button"
              className="flex items-center gap-2 bg-white text-[#191c1f] px-5 py-2.5 rounded-full text-xs font-bold hover:bg-[#f2f3f8] transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">shop</span>
              <span>Google Play</span>
            </button>
          </div>
        </div>

        {/* Directory links */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-10 border-b border-[#eceef2]">
          <div className="col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <img src={APP_LOGO} alt="Food Now" className="h-7 w-auto object-contain" />
              <span className="text-xl font-black text-[#191c1f]">
                Food<span className="text-[#ff5e1e]">Now</span>
              </span>
            </div>
            <p className="text-xs text-[#5b4138] max-w-sm leading-relaxed">
              La plataforma gastronómica de delivery líder para saborear lo mejor de Lima con velocidad relámpago, seguimiento en vivo y atención 24/7.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="w-8 h-8 rounded-full bg-[#f2f3f8] flex items-center justify-center text-[#5b4138] hover:bg-[#ff5e1e] hover:text-white transition-colors cursor-pointer text-xs font-bold">
                IG
              </span>
              <span className="w-8 h-8 rounded-full bg-[#f2f3f8] flex items-center justify-center text-[#5b4138] hover:bg-[#ff5e1e] hover:text-white transition-colors cursor-pointer text-xs font-bold">
                FB
              </span>
              <span className="w-8 h-8 rounded-full bg-[#f2f3f8] flex items-center justify-center text-[#5b4138] hover:bg-[#ff5e1e] hover:text-white transition-colors cursor-pointer text-xs font-bold">
                WA
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 text-xs">
            <span className="text-sm font-bold text-[#191c1f]">Explorar</span>
            <a href="#" className="text-[#5b4138] hover:text-[#191c1f] transition-colors">Restaurantes Lima</a>
            <a href="#" className="text-[#5b4138] hover:text-[#191c1f] transition-colors">Promos del Día</a>
            <a href="#" className="text-[#5b4138] hover:text-[#191c1f] transition-colors">Tradición Criolla</a>
            <a href="#" className="text-[#5b4138] hover:text-[#191c1f] transition-colors">Cevicherías & Mar</a>
            <a href="#" className="text-[#5b4138] hover:text-[#191c1f] transition-colors">Pollerías de Leña</a>
          </div>

          <div className="flex flex-col gap-2.5 text-xs">
            <span className="text-sm font-bold text-[#191c1f]">Aliados</span>
            <a href="#" className="text-[#5b4138] hover:text-[#191c1f] transition-colors">Registra tu Restaurante</a>
            <a href="#" className="text-[#5b4138] hover:text-[#191c1f] transition-colors">Conviértete en Repartidor</a>
            <a href="#" className="text-[#5b4138] hover:text-[#191c1f] transition-colors">Food Now Empresas</a>
            <a href="#" className="text-[#5b4138] hover:text-[#191c1f] transition-colors">FoodPrime Club</a>
          </div>

          <div className="flex flex-col gap-2.5 text-xs">
            <span className="text-sm font-bold text-[#191c1f]">Ayuda & Legal</span>
            <a href="#" className="text-[#5b4138] hover:text-[#191c1f] transition-colors">Centro de Ayuda 24/7</a>
            <a href="#" className="text-[#5b4138] hover:text-[#191c1f] transition-colors">Seguimiento en Vivo</a>
            <a href="#" className="text-[#5b4138] hover:text-[#191c1f] transition-colors">Términos de Servicio</a>
            <a href="#" className="text-[#5b4138] hover:text-[#191c1f] transition-colors">Privacidad y Cookies</a>
            <a href="#" className="text-[#5b4138] hover:text-[#191c1f] transition-colors">Libro de Reclamaciones</a>
          </div>
        </div>

        {/* Bottom copyright & payment icons */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 text-xs text-[#5b4138]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="uppercase font-bold text-[11px]">Pagos seguros:</span>
            <span className="px-2 py-0.5 rounded bg-[#f2f3f8] text-[11px] font-bold text-[#191c1f]">VISA</span>
            <span className="px-2 py-0.5 rounded bg-[#f2f3f8] text-[11px] font-bold text-[#191c1f]">MASTERCARD</span>
            <span className="px-2 py-0.5 rounded bg-[#f2f3f8] text-[11px] font-bold text-[#7d2dce]">YAPE</span>
            <span className="px-2 py-0.5 rounded bg-[#f2f3f8] text-[11px] font-bold text-[#00a870]">PLIN</span>
            <span className="px-2 py-0.5 rounded bg-[#f2f3f8] text-[11px] font-bold text-[#ff5e1e]">FOOD CASH</span>
          </div>
          <div className="text-center md:text-right text-[11px]">
            © 2026 Food Now Technologies S.A.C. Todos los derechos reservados en Perú.
          </div>
        </div>
      </div>
    </footer>
  );
};
