'use client';

import React from 'react';
import { Trash2, AlertTriangle, XIcon } from 'lucide-react';
import { Presell } from '../types/presell';

interface AllPresellsModalProps {
  presells: Presell[];
  activeId: string | null;
  loadPresell: (item: Presell) => void;
  handleDuplicatePresell: (item: Presell) => void;
  setShowAllPresells: (open: boolean) => void;
  isDraft: (item: Presell) => boolean;
  onDelete: (id: string) => void;
  onDeleteAll: () => void;
}

export function AllPresellsModal({
  presells,
  activeId,
  loadPresell,
  handleDuplicatePresell,
  setShowAllPresells,
  isDraft,
  onDelete,
  onDeleteAll
}: AllPresellsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between gap-3 p-5 border-b border-slate-800 shrink-0">
          <div>
            <h3 className="text-base font-black text-white">Todas as Presells</h3>
            <p className="text-[11px] text-slate-400">Escolha um projeto para continuar editando sem perder o fluxo atual.</p>
          </div>
          <div className="flex items-center gap-3">
            {presells.length > 0 && (
              <button
                onClick={() => {
                  onDeleteAll();
                  setShowAllPresells(false);
                }}
                className="text-xs cursor-pointer font-bold text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500/30 px-3 py-1.5 rounded-xl border border-red-500/20 transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Excluir Todas
              </button>
            )}
            <button
              onClick={() => setShowAllPresells(false)}
              className="text-slate-400 cursor-pointer hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full p-2 transition-all"
            >
              <XIcon />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-5 overflow-y-auto flex-1">
          {presells.map((item) => {
            const isActive = item.id === activeId;
            const statusLabel = isActive ? 'Editando agora' : 'Presell';
            const isItemDraft = isDraft(item);
            return (
              <div
                key={item.id}
                className={`rounded-3xl border p-4 bg-slate-950/80 transition flex flex-col justify-between ${
                  isActive
                    ? 'border-violet-500/70 shadow-lg'
                    : 'border-slate-800 hover:border-violet-500/50 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">{statusLabel}</p>
                      <h4 className="text-sm font-bold text-white truncate max-w-[200px]" title={item.titulo}>{item.titulo.replace(/\*\*|\*|\[|\]\{(.*?)\}/g, '') || 'Nova Presell'}</h4>
                      {isItemDraft && <span className="inline-block mt-2 text-[10px] uppercase tracking-wider font-black text-amber-100 bg-amber-600/20 border border-amber-500/30 px-2 py-1 rounded-full">Rascunho</span>}
                    </div>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap">{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('pt-BR') : 'Sem data'}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-4 truncate" title={item.ctaLink}>{item.ctaLink || 'Sem Link definido'}</p>
                </div>
                
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-800/50">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        loadPresell(item);
                        setShowAllPresells(false);
                      }}
                      className="text-xs cursor-pointer font-bold bg-violet-600 hover:bg-violet-500 text-white px-3 py-2 rounded-xl transition-all"
                    >
                      Abrir
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicatePresell(item);
                      }}
                      className="text-xs cursor-pointer font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl transition-all"
                    >
                      Duplicar
                    </button>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                    title="Excluir Presell"
                    className="p-2 cursor-pointer rounded-xl bg-slate-800/50 hover:bg-red-900/40 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
          
          {presells.length === 0 && (
            <div className="col-span-1 sm:col-span-2 flex flex-col items-center justify-center py-12 text-slate-500">
              <AlertTriangle className="w-8 h-8 mb-3 opacity-50" />
              <p className="text-sm">Nenhuma presell encontrada.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
