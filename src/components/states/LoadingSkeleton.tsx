import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-6 animate-pulse" aria-busy="true" aria-label="Cargando información de comida y entregas">
      {/* Skeleton Delivery Banner */}
      <div className="w-full bg-white rounded-3xl p-6 border border-[#eceef2] shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200"></div>
            <div className="flex flex-col gap-2">
              <div className="w-36 h-4 rounded bg-slate-200"></div>
              <div className="w-24 h-3 rounded bg-slate-200"></div>
            </div>
          </div>
          <div className="w-28 h-8 rounded-full bg-slate-200"></div>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-200"></div>
        <div className="flex items-center justify-between pt-2">
          <div className="w-48 h-4 rounded bg-slate-200"></div>
          <div className="w-32 h-10 rounded-full bg-slate-200"></div>
        </div>
      </div>

      {/* Skeleton Filter Chips */}
      <div className="flex items-center gap-2 overflow-hidden">
        <div className="w-28 h-9 rounded-full bg-slate-200"></div>
        <div className="w-36 h-9 rounded-full bg-slate-200"></div>
        <div className="w-32 h-9 rounded-full bg-slate-200"></div>
        <div className="w-24 h-9 rounded-full bg-slate-200"></div>
      </div>

      {/* Skeleton Restaurant Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div key={idx} className="bg-white rounded-2xl p-4 border border-[#eceef2] shadow-sm flex flex-col gap-3">
            <div className="w-full h-40 rounded-xl bg-slate-200"></div>
            <div className="flex items-center justify-between">
              <div className="w-40 h-5 rounded bg-slate-200"></div>
              <div className="w-16 h-5 rounded bg-slate-200"></div>
            </div>
            <div className="w-56 h-3 rounded bg-slate-200"></div>
            <div className="w-full h-12 rounded-xl bg-slate-100"></div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="w-20 h-4 rounded bg-slate-200"></div>
              <div className="w-28 h-9 rounded-full bg-slate-200"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
