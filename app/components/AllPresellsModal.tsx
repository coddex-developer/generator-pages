'use client';

import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Copy,
  ExternalLink,
  FileText,
  LinkIcon,
  Search,
  SlidersHorizontal,
  Trash2,
  XIcon
} from 'lucide-react';
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

type Filter = 'all' | 'ready' | 'draft';
type Sort = 'updated' | 'title' | 'completion';

const cleanMarkdown = (value: string) =>
  String(value || '')
    .replace(/\[([^\]]+)\]\{[^}]+\}/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_~`>#-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const getDomain = (value: string) => {
  if (!value) return 'Sem link definido';
  try {
    return new URL(value).hostname.replace(/^www\./, '');
  } catch {
    return value.replace(/^https?:\/\//, '').split('/')[0] || 'Link parcial';
  }
};

const getCompletion = (item: Presell) => {
  const checks = [
    item.titulo?.trim(),
    item.subtitulo?.trim(),
    item.imageUrl?.trim(),
    item.ctaText?.trim(),
    item.ctaLink?.trim(),
    item.faq?.length > 0,
    item.seoTitle?.trim(),
    item.seoDescription?.trim()
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
};

const getUpdatedTime = (item: Presell) => item.updatedAt ? new Date(item.updatedAt).getTime() : 0;

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
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('updated');

  const readyCount = presells.filter((item) => !isDraft(item)).length;
  const draftCount = presells.length - readyCount;
  const averageCompletion = presells.length
    ? Math.round(presells.reduce((sum, item) => sum + getCompletion(item), 0) / presells.length)
    : 0;

  const filteredPresells = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return [...presells]
      .filter((item) => {
        const draft = isDraft(item);
        if (filter === 'ready' && draft) return false;
        if (filter === 'draft' && !draft) return false;
        if (!normalizedQuery) return true;

        return [
          cleanMarkdown(item.titulo),
          cleanMarkdown(item.subtitulo),
          item.ctaLink || '',
          item.seoTitle || '',
          item.seoDescription || ''
        ].some((value) => value.toLowerCase().includes(normalizedQuery));
      })
      .sort((a, b) => {
        if (sort === 'title') return cleanMarkdown(a.titulo).localeCompare(cleanMarkdown(b.titulo), 'pt-BR');
        if (sort === 'completion') return getCompletion(b) - getCompletion(a);
        return getUpdatedTime(b) - getUpdatedTime(a);
      });
  }, [filter, isDraft, presells, query, sort]);

  const filters: Array<{ value: Filter; label: string; count: number }> = [
    { value: 'all', label: 'Todos', count: presells.length },
    { value: 'ready', label: 'Prontos', count: readyCount },
    { value: 'draft', label: 'Rascunhos', count: draftCount }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-2 backdrop-blur-md sm:p-4">
      <div className="flex max-h-[94vh] w-full max-w-7xl flex-col overflow-hidden rounded-[30px] border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="relative overflow-hidden border-b border-slate-800 px-1 md:px-4 py1 md:py-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_0%,rgba(139,92,246,0.25),transparent_34%),radial-gradient(circle_at_88%_10%,rgba(14,165,233,0.18),transparent_28%)] pointer-events-none" />
          <div className="relative flex flex-col-reverse gap-1 sm:gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-violet-300">Central de projetos</p>
              <h3 className="mt-1 flex items-center gap-2 text-xl font-black text-white sm:text-2xl">
                <FileText className="h-6 w-6 text-violet-400" />
                Minhas Presells
              </h3>
              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-400">Gerencie, encontre, duplique e abra seus projetos com uma visao completa de status, link, data e nivel de configuracao.</p>
            </div>

            <div className="flex mt-3 px-2 pt-2 pb-4 justify-between items-center gap-2">
              {presells.length > 0 && (
                <button
                  onClick={() => {
                    onDeleteAll();
                    setShowAllPresells(false);
                  }}
                  className="flex cursor-pointer items-center gap-1.5 rounded-2xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-black text-red-300 transition-all hover:bg-red-500/25 hover:text-white"
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir todas
                </button>
              )}
              <button
                onClick={() => setShowAllPresells(false)}
                className="cursor-pointer rounded-full bg-slate-800 p-2 text-slate-400 transition-all hover:bg-slate-700 hover:text-white"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="relative mt-1 hidden lg:grid grid-cols-2 gap-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/65 px-4 py-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Total salvo</p>
              <p className="mt-1 text-2xl font-black text-white">{presells.length}</p>
            </div>
            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-300/80">Prontos</p>
              <p className="mt-1 text-2xl font-black text-white">{readyCount}</p>
            </div>
            <div className="rounded-3xl border border-amber-500/20 bg-amber-500/10 px-4 py-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-amber-300/80">Rascunhos</p>
              <p className="mt-1 text-2xl font-black text-white">{draftCount}</p>
            </div>
            <div className="rounded-3xl border border-violet-500/20 bg-violet-500/10 px-4 py-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-violet-300/80">Media completa</p>
              <p className="mt-1 text-2xl font-black text-white">{averageCompletion}%</p>
            </div>
          </div>
        </div>

        <div className="border-b border-slate-800 bg-slate-950/35 p-1">
          <div className="grid gap-1 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-center">
            <div className="hidden md:flex min-w-0 items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950 px-3 py-3">
              <Search className="h-4 w-4 shrink-0 text-slate-500" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por titulo, descricao, SEO ou link"
                className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-600"
              />
            </div>

            <div className="flex overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 p-1">
              {filters.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFilter(option.value)}
                  className={`cursor-pointer whitespace-nowrap rounded-xl px-3 py-2 text-xs font-black transition-all ${
                    filter === option.value ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {option.label} <span className="opacity-70">{option.count}</span>
                </button>
              ))}
            </div>

            <label className="hidden lg:flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950 px-3 py-3 text-xs font-black text-slate-400">
              <SlidersHorizontal className="h-4 w-4 text-slate-500" />
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as Sort)}
                className="cursor-pointer bg-transparent text-slate-200 outline-none"
              >
                <option value="updated">Mais recentes</option>
                <option value="title">Titulo A-Z</option>
                <option value="completion">Mais completas</option>
              </select>
            </label>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
          {filteredPresells.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredPresells.map((item) => {
                const isActive = item.id === activeId;
                const itemDraft = isDraft(item);
                const title = cleanMarkdown(item.titulo) || 'Nova Presell';
                const description = cleanMarkdown(item.subtitulo) || 'Sem descricao cadastrada';
                const domain = getDomain(item.ctaLink);
                const completion = getCompletion(item);
                const updatedAt = item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('pt-BR') : 'Sem data';

                return (
                  <article
                    key={item.id}
                    className={`group relative overflow-hidden rounded-3xl border bg-slate-950/75 p-4 transition-all hover:-translate-y-0.5 ${
                      isActive
                        ? 'border-violet-400/70 shadow-xl shadow-violet-950/20'
                        : 'border-slate-800 hover:border-violet-500/40 hover:bg-slate-900'
                    }`}
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 via-indigo-400 to-cyan-400 opacity-80" />

                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl border ${isActive ? 'border-violet-400/40 bg-violet-500/15 text-violet-200' : 'border-slate-800 bg-slate-900 text-slate-400'}`}>
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className={`rounded-full border px-2 py-1 text-[9px] font-black uppercase tracking-wider ${itemDraft ? 'border-amber-500/30 bg-amber-500/10 text-amber-200' : 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300'}`}>
                              {itemDraft ? 'Rascunho' : 'Pronta'}
                            </span>
                            {isActive && <span className="rounded-full border border-violet-500/30 bg-violet-500/15 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-violet-200">Editando</span>}
                          </div>
                          <h4 className="mt-2 line-clamp-2 text-sm font-black leading-snug text-white" title={title}>{title}</h4>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-lg font-black text-white">{completion}%</p>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Completo</p>
                      </div>
                    </div>

                    <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-400">{description}</p>

                    <div className="mt-4 grid gap-2 rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-[11px] font-bold text-slate-400">
                      <span className="flex min-w-0 items-center gap-2">
                        <LinkIcon className="h-3.5 w-3.5 shrink-0 text-violet-400" />
                        <span className="truncate">{domain}</span>
                      </span>
                      <span className="flex items-center gap-2">
                        <CalendarClock className="h-3.5 w-3.5 text-slate-500" />
                        Atualizado em {updatedAt}
                      </span>
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        {item.faq?.length || 0} FAQ(s) | {item.headerMenuItems?.length || 0} item(ns) de menu
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            loadPresell(item);
                            setShowAllPresells(false);
                          }}
                          className="flex cursor-pointer items-center gap-1.5 rounded-2xl bg-violet-600 px-3 py-2 text-xs font-black text-white transition-all hover:bg-violet-500"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Abrir
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicatePresell(item);
                          }}
                          className="flex cursor-pointer items-center gap-1.5 rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-black text-slate-200 transition-all hover:border-violet-500/40 hover:text-white"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          Duplicar
                        </button>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(String(item.id));
                        }}
                        title="Excluir Presell"
                        className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 p-2.5 text-slate-400 transition-colors hover:border-red-500/40 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-950/60 px-5 text-center text-slate-500">
              {presells.length === 0 ? (
                <>
                  <AlertTriangle className="mb-3 h-9 w-9 opacity-60" />
                  <p className="text-sm font-black text-slate-300">Nenhuma presell encontrada.</p>
                  <p className="mt-1 max-w-sm text-xs leading-relaxed">Quando voce criar e salvar um projeto, ele aparece aqui com status e atalhos.</p>
                </>
              ) : (
                <>
                  <Search className="mb-3 h-9 w-9 opacity-60" />
                  <p className="text-sm font-black text-slate-300">Nenhum resultado para esta busca.</p>
                  <p className="mt-1 max-w-sm text-xs leading-relaxed">Tente outro termo, troque o filtro ou volte para Todos.</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
