'use client';

import React from 'react';
import { Clock, Layers, Trash2 } from 'lucide-react';
import { Presell } from '../types/presell';

interface PresellCardProps {
  item: Presell;
  isActive: boolean;
  isDraft: boolean;
  onSelect: () => void;
  onDuplicate: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function PresellCard({ item, isActive, isDraft, onSelect, onDuplicate, onDelete }: PresellCardProps) {
  const title = item.titulo.replace(/\*\*|\*|\[|\]\{(.*?)\}/g, '') || 'Nova Presell';
  const subtitle = item.ctaLink || 'Sem Link';

  return (
    <div
      onClick={onSelect}
      className={`flex-shrink-0 w-44 p-3 rounded-xl border transition-all cursor-pointer relative group ${
        isActive
          ? 'bg-slate-800/80 border-violet-500/50 shadow-md'
          : 'bg-slate-950/40 border-slate-850 hover:bg-slate-800/30'
      }`}
    >
      <div className="flex justify-between items-start gap-1 mb-1.5">
        <span className="text-[9px] font-semibold text-slate-500 flex items-center gap-0.5">
          <Clock className="w-3 h-3" />
          {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('pt-BR') : 'Sem data'}
        </span>

        <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
          <button
            title="Duplicar"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(e);
            }}
            className="p-1 rounded bg-slate-900 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <Layers className="w-3 h-3" />
          </button>
          <button
            title="Excluir"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(e);
            }}
            className="p-1 rounded bg-slate-900 hover:bg-red-950 text-slate-400 hover:text-red-450"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      <h3 className="text-xs font-bold text-slate-200 truncate group-hover:text-white">{title}</h3>
      <p className="text-[10px] text-slate-500 mt-0.5 truncate">{subtitle}</p>

      {isDraft && (
        <span className="absolute top-3 left-3 text-[9px] uppercase tracking-wider font-black text-amber-100 bg-amber-600/20 border border-amber-500/30 px-2 py-1 rounded-full">RASCUNHO</span>
      )}
    </div>
  );
}
