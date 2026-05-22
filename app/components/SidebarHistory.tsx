'use client';

import React, { useMemo, useState } from 'react';
import { AlertCircle, Archive, CheckCircle2, FolderHeart, Search, Sparkles } from 'lucide-react';
import { usePresell } from '../context/PresellContext';
import { PresellCard } from './PresellCard';

type Filter = 'all' | 'ready' | 'draft';

const cleanText = (value: string) =>
  String(value || '')
    .replace(/\[([^\]]+)\]\{[^}]+\}/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_~`>#-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

export function SidebarHistory({
  setShowAllPresells,
  setDeleteConfirmId
}: {
  setShowAllPresells: (v: boolean) => void,
  setDeleteConfirmId: (v: string) => void
}) {
  const { presells, activeId, loadPresell, handleDuplicatePresell, isDraftCard } = usePresell();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const readyCount = presells.filter((item) => !isDraftCard(item)).length;
  const draftCount = presells.length - readyCount;

  const filteredPresells = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return presells
      .filter((item) => {
        const draft = isDraftCard(item);
        if (filter === 'ready' && draft) return false;
        if (filter === 'draft' && !draft) return false;
        if (!normalizedQuery) return true;

        return [
          cleanText(item.titulo),
          cleanText(item.subtitulo),
          item.ctaLink || '',
          item.seoTitle || ''
        ].some((value) => value.toLowerCase().includes(normalizedQuery));
      })
      .slice(0, 6);
  }, [filter, isDraftCard, presells, query]);

  const filterOptions: Array<{ value: Filter; label: string; count: number }> = [
    { value: 'all', label: 'Todos', count: presells.length },
    { value: 'ready', label: 'Prontos', count: readyCount },
    { value: 'draft', label: 'Rascunhos', count: draftCount }
  ];

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 p-4 shadow-2xl shadow-black/20">
      <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_20%_0%,rgba(139,92,246,0.24),transparent_38%),radial-gradient(circle_at_78%_0%,rgba(14,165,233,0.18),transparent_32%)] pointer-events-none" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-violet-200">
              <Sparkles className="h-3 w-3" />
              Workspace
            </div>
            <h2 className="flex items-center gap-2 text-base font-black text-white">
              <FolderHeart className="h-5 w-5 text-pink-400" />
              Minhas Presells
            </h2>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-400">Organize, encontre e continue seus projetos salvos neste navegador.</p>
          </div>

          <button
            type="button"
            onClick={() => setShowAllPresells(true)}
            className="cursor-pointer shrink-0 rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-[10px] font-black text-slate-300 hover:border-violet-500/50 hover:text-white"
          >
            Ver tudo
          </button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/75 p-2.5">
            <Archive className="mb-1 h-3.5 w-3.5 text-slate-500" />
            <p className="text-lg font-black text-white">{presells.length}</p>
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Total</p>
          </div>
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-2.5">
            <CheckCircle2 className="mb-1 h-3.5 w-3.5 text-emerald-300" />
            <p className="text-lg font-black text-white">{readyCount}</p>
            <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-300/80">Prontas</p>
          </div>
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-2.5">
            <AlertCircle className="mb-1 h-3.5 w-3.5 text-amber-300" />
            <p className="text-lg font-black text-white">{draftCount}</p>
            <p className="text-[9px] font-bold uppercase tracking-wider text-amber-300/80">Rascunhos</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950 px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por titulo, link ou SEO"
              className="w-full bg-transparent text-xs text-slate-200 outline-none placeholder:text-slate-600"
            />
          </div>

          <div className="flex rounded-2xl border border-slate-800 bg-slate-950 p-1">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFilter(option.value)}
                className={`cursor-pointer rounded-xl px-2.5 py-1.5 text-[10px] font-black transition-all ${
                  filter === option.value ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {option.label} <span className="opacity-70">{option.count}</span>
              </button>
            ))}
          </div>
        </div>

        {presells.length === 0 ? (
          <div className="mt-4 rounded-3xl border border-dashed border-slate-800 bg-slate-950/60 px-4 py-7 text-center">
            <FolderHeart className="mx-auto mb-3 h-8 w-8 text-slate-600" />
            <p className="text-sm font-black text-slate-300">Nenhum projeto salvo ainda</p>
            <p className="mt-1 text-xs text-slate-500">Crie sua primeira presell e ela aparece aqui com preview, status e atalhos.</p>
          </div>
        ) : filteredPresells.length === 0 ? (
          <div className="mt-4 rounded-3xl border border-slate-800 bg-slate-950/60 px-4 py-6 text-center">
            <Search className="mx-auto mb-3 h-7 w-7 text-slate-600" />
            <p className="text-sm font-black text-slate-300">Nada encontrado</p>
            <p className="mt-1 text-xs text-slate-500">Tente limpar a busca ou trocar o filtro.</p>
          </div>
        ) : (
          <>
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
              {filteredPresells.map((item) => (
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

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
              <span>
                Mostrando {filteredPresells.length} de {presells.length} projetos
              </span>
              <button
                type="button"
                onClick={() => setShowAllPresells(true)}
                className="cursor-pointer rounded-full border border-violet-500/25 bg-violet-500/10 px-3 py-1.5 font-black text-violet-300 hover:bg-violet-500/20 hover:text-white"
              >
                Abrir central completa
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
