import React, { useState } from 'react';
import { APP_LOGO } from '../data/mockData';

interface LoginViewProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onCancel }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('mateo.rossi@email.com');
  const [password, setPassword] = useState('••••••••');
  const [name, setName] = useState('Mateo Rossi');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess();
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4 pb-24">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-[#eceef2] grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Brand Showcase Bento */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#191c1f] via-[#241a16] to-[#ab3500] p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#ff5e1e]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#7d2dce]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex items-center gap-2.5">
              <img src={APP_LOGO} alt="Food Now" className="h-9 w-auto brightness-200" />
              <span className="text-2xl font-black tracking-tight">
                Food<span className="text-[#ff5e1e]">Now</span>
              </span>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <span className="px-3 py-1 rounded-full bg-[#ff5e1e]/20 text-[#ff5e1e] text-xs font-bold w-fit border border-[#ff5e1e]/30">
                Gastronomía Peruana Express
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight">
                Tus antojos favoritos, entregados en minutos.
              </h1>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                Accede a la mejor gastronomía de Lima con promociones exclusivas, beneficios FoodPrime y seguimiento en tiempo real.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="flex flex-col gap-3.5 pt-2">
              <div className="flex items-start gap-3 bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                <div className="w-9 h-9 rounded-xl bg-[#ff5e1e] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">restaurant</span>
                </div>
                <div>
                  <h2 className="text-xs font-bold">Tradición y Frescura Marina</h2>
                  <p className="text-[11px] text-white/70">Ceviches y platos criollos preparados al momento con ingredientes selectos.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                <div className="w-9 h-9 rounded-xl bg-[#7d2dce] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">near_me</span>
                </div>
                <div>
                  <h2 className="text-xs font-bold">Seguimiento Satelital en Tiempo Real</h2>
                  <p className="text-[11px] text-white/70">Visualiza a tu repartidor en el mapa 3D desde la cocina hasta tu puerta.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                <div className="w-9 h-9 rounded-xl bg-[#00a870] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                </div>
                <div>
                  <h2 className="text-xs font-bold">Club FoodPrime Sin Costo de Envío</h2>
                  <p className="text-[11px] text-white/70">Disfruta envíos a S/ 0 en los mejores restaurantes de Miraflores y San Isidro.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 text-[11px] text-white/60 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00a870]"></span>
            <span>+150k pedidos entregados con éxito en Lima • ⭐ 4.9 de satisfacción</span>
          </div>
        </div>

        {/* Right Column: Interactive Auth Form */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between bg-white">
          <div className="flex items-center justify-end">
            <button 
              onClick={onCancel}
              className="text-xs text-[#5b4138] hover:text-[#191c1f] font-semibold flex items-center gap-1"
              type="button"
            >
              <span>Continuar como invitado</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          <div className="max-w-md w-full mx-auto py-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-[#191c1f]">
                {isRegister ? 'Crear una cuenta' : '¡Bienvenido de nuevo!'}
              </h2>
              <p className="text-xs text-[#5b4138] mt-1">
                {isRegister 
                  ? 'Regístrate y recibe S/ 15 de regalo en tu primer pedido' 
                  : 'Ingresa para gestionar tus pedidos y favoritos'}
              </p>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                type="button"
                onClick={onLoginSuccess}
                className="h-11 rounded-full border border-[#eceef2] hover:bg-[#f2f3f8] flex items-center justify-center gap-2 text-xs font-bold text-[#191c1f] transition-all"
              >
                <span className="font-bold text-[#7d2dce]">G</span> Google
              </button>
              <button
                type="button"
                onClick={onLoginSuccess}
                className="h-11 rounded-full border border-[#eceef2] hover:bg-[#f2f3f8] flex items-center justify-center gap-2 text-xs font-bold text-[#191c1f] transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">apple</span> Apple
              </button>
            </div>

            <div className="relative flex items-center justify-center mb-5">
              <div className="border-t border-[#eceef2] w-full"></div>
              <span className="bg-white px-3 text-[11px] text-[#5b4138] uppercase font-bold absolute">
                o con tu correo
              </span>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              {isRegister && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#191c1f]">Nombre completo</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Mateo Rossi"
                    className="h-11 px-4 rounded-xl bg-[#f2f3f8] text-xs outline-none focus:ring-2 focus:ring-[#ff5e1e]"
                  />
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#191c1f]">Correo electrónico</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="h-11 px-4 rounded-xl bg-[#f2f3f8] text-xs outline-none focus:ring-2 focus:ring-[#ff5e1e]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#191c1f]">Contraseña</label>
                  {!isRegister && (
                    <a href="#" className="text-[11px] text-[#ff5e1e] font-bold hover:underline">
                      ¿Olvidaste tu contraseña?
                    </a>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu clave secreta"
                  className="h-11 px-4 rounded-xl bg-[#f2f3f8] text-xs outline-none focus:ring-2 focus:ring-[#ff5e1e]"
                />
              </div>

              <button
                type="submit"
                className="mt-2 h-12 rounded-full bg-[#ff5e1e] hover:bg-[#ab3500] text-white text-xs font-bold shadow-lg shadow-[#ff5e1e]/30 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>{isRegister ? 'Registrarme y recibir bono' : 'Iniciar Sesión'}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </form>

            <div className="text-center mt-5">
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-xs text-[#5b4138] hover:text-[#191c1f]"
              >
                {isRegister ? (
                  <>¿Ya tienes una cuenta? <span className="text-[#ff5e1e] font-bold">Inicia sesión</span></>
                ) : (
                  <>¿No tienes cuenta? <span className="text-[#ff5e1e] font-bold">Regístrate gratis</span></>
                )}
              </button>
            </div>
          </div>

          <div className="text-center text-[10px] text-[#5b4138]">
            Al continuar aceptas nuestras Políticas de Privacidad y Términos de Servicio.
          </div>
        </div>
      </div>
    </div>
  );
};
