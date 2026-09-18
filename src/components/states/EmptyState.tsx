import React from 'react';

interface EmptyStateProps {
  type?: 'deliveries' | 'search' | 'favorites';
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'deliveries',
  title,
  description,
  actionText,
  onAction
}) => {
  const configs = {
    deliveries: {
      icon: 'moped',
      defaultTitle: 'No tienes entregas activas en este momento',
      defaultDesc: 'Cuando realices un pedido de comida, podrás seguir al repartidor en vivo desde este tablero.',
      defaultBtn: 'Buscar comida cercana',
    },
    search: {
      icon: 'search_off',
      defaultTitle: 'No encontramos puestos de comida con esos filtros',
      defaultDesc: 'Intenta cambiar los términos de búsqueda o ampliar el radio de distancia.',
      defaultBtn: 'Restablecer todos los filtros',
    },
    favorites: {
      icon: 'favorite_border',
      defaultTitle: 'Aún no has guardado locales favoritos',
      defaultDesc: 'Explora la lista y marca con un corazón los huariques y restaurantes que más te gusten.',
      defaultBtn: 'Explorar restaurantes',
    }
  };

  const current = configs[type];

  return (
    <div className="w-full max-w-lg mx-auto my-8 p-8 bg-white rounded-3xl border border-[#eceef2] shadow-sm flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-[32px]">{current.icon}</span>
      </div>

      <h2 className="text-xl font-bold font-soria text-[#191c1f] mb-2">
        {title || current.defaultTitle}
      </h2>

      <p className="text-sm text-[#5b4138] mb-6 max-w-sm leading-relaxed">
        {description || current.defaultDesc}
      </p>

      {onAction && (
        <button
          onClick={onAction}
          className="h-11 px-6 rounded-full bg-[#111827] hover:bg-black text-white text-xs font-bold flex items-center gap-2 shadow-md transition-transform active:scale-95 cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
          <span>{actionText || current.defaultBtn}</span>
        </button>
      )}
    </div>
  );
};
