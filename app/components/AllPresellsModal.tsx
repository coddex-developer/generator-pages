'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Presell } from '../types/presell';

interface AllPresellsModalProps {
  presells: Presell[];
  activeId: string | null;
  loadPresell: (item: Presell) => void;
  handleDuplicatePresell: (item: Presell, e: React.MouseEvent<HTMLButtonElement>) => void;
  setShowAllPresells: (open: boolean) => void;
  isDraft: (item: Presell) => boolean;
}

export function AllPresellsModal({
  presells,
  activeId,
  loadPresell,
  handleDuplicatePresell,
  setShowAllPresells,
  isDraft
}: AllPresellsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between gap-3 p-5 border-b border-slate-800">
          <div>
            <h3 className="text-base font-black text-white">Todas as Presells</h3>
            <p className="text-[11px] text-slate-400">Escolha um projeto para continuar editando sem perder o fluxo atual.</p>
          </div>
          <button
            onClick={() => setShowAllPresells(false)}
            className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full p-2 transition-all"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-5 max-h-[70vh] overflow-y-auto">
          {presells.map((item) => {
            const isActive = item.id === activeId;
            const statusLabel = isActive ? 'Editando agora' : 'Presell';
            const isItemDraft = isDraft(item);
            return (
              <div
                key={item.id}
                className={`rounded-3xl border p-4 bg-slate-950/80 transition ${
                  isActive
                    ? 'border-violet-500/70 shadow-lg'
                    : 'border-slate-800 hover:border-violet-500/50 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">{statusLabel}</p>
                    <h4 className="text-sm font-bold text-white truncate">{item.titulo.replace(/\*\*|\*|\[|\]\{(.*?)\}/g, '') || 'Nova Presell'}</h4>
                    {isItemDraft && <span className="inline-block mt-2 text-[10px] uppercase tracking-wider font-black text-amber-100 bg-amber-600/20 border border-amber-500/30 px-2 py-1 rounded-full">Rascunho</span>}
                  </div>
                  <span className="text-[10px] text-slate-500">{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('pt-BR') : 'Sem data'}</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-4 truncate">{item.ctaLink || 'Sem Link definido'}</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      loadPresell(item);
                      setShowAllPresells(false);
                    }}
                    className="text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white px-3 py-2 rounded-xl transition-all"
                  >
                    Abrir
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicatePresell(item, e);
                    }}
                    className="text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl transition-all"
                  >
                    Duplicar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
