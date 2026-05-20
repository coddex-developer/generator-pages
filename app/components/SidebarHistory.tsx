'use client';

import React from 'react';
import { FolderHeart } from 'lucide-react';
import { usePresell } from '../context/PresellContext';
import { PresellCard } from './PresellCard';

export function SidebarHistory({ 
  setShowAllPresells,
  setDeleteConfirmId
}: { 
  setShowAllPresells: (v: boolean) => void,
  setDeleteConfirmId: (v: string) => void
}) {
  const { presells, activeId, loadPresell, handleDuplicatePresell, isDraftCard } = usePresell();

  return (
    <div className="bg-slate-900/80 border border-slate-850 rounded-2xl p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <FolderHeart className="w-4 h-4 text-pink-500" />
          Minhas Presells ({presells.length})
        </h2>
        <span className="text-[10px] text-slate-500 font-mono">Navegador</span>
      </div>

      {presells.length === 0 ? (
        <div className="text-center py-5 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
          Nenhum projeto salvo. Comece digitando abaixo!
        </div>
      ) : (
        <>
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
            {presells.slice(0, 4).map((item) => (
              <PresellCard
                key={item.id}
                item={item}
                isActive={item.id === activeId}
                isDraft={isDraftCard(item)}
                onSelect={() => loadPresell(item)}
                onDuplicate={(e) => {
                  e.stopPropagation();
                  handleDuplicatePresell(item);
                }}
                onDelete={(e) => {
                  e.stopPropagation();
                  setDeleteConfirmId(item.id);
                }}
              />
            ))}
          </div>

          {presells.length > 4 && (
            <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-slate-400">
              <span>Mostrando 4 de {presells.length} projetos</span>
              <button
                type="button"
                onClick={() => setShowAllPresells(true)}
                className="text-violet-400 hover:text-violet-300 font-bold"
              >
                Ver todas
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
