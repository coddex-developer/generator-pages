'use client';

import React from 'react';
import { CalendarClock, Copy, ExternalLink, FileText, LinkIcon, Trash2 } from 'lucide-react';
import { Presell } from '../types/presell';

interface PresellCardProps {
  item: Presell;
  isActive: boolean;
  isDraft: boolean;
  onSelect: () => void;
  onDuplicate: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const cleanMarkdown = (value: string) =>
  String(value || '')
    .replace(/\[([^\]]+)\]\{[^}]+\}/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_~`>#-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const getDomain = (value: string) => {
  if (!value) return 'Sem link';
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

export function PresellCard({ item, isActive, isDraft, onSelect, onDuplicate, onDelete }: PresellCardProps) {
  const title = cleanMarkdown(item.titulo) || 'Nova Presell';
  const description = cleanMarkdown(item.subtitulo) || 'Sem descricao cadastrada';
  const domain = getDomain(item.ctaLink);
  const completion = getCompletion(item);
  const updatedAt = item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('pt-BR') : 'Sem data';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect();
        }
      }}
      className={`group relative flex min-h-[172px] w-[238px] shrink-0 cursor-pointer flex-col overflow-hidden rounded-3xl border p-3.5 text-left transition-all ${
        isActive
          ? 'border-violet-400/70 bg-violet-950/25 shadow-lg shadow-violet-950/25'
          : 'border-slate-800 bg-slate-950/70 hover:-translate-y-0.5 hover:border-violet-500/45 hover:bg-slate-900/90'
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 via-indigo-400 to-cyan-400 opacity-80" />
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-2xl border ${isActive ? 'border-violet-400/40 bg-violet-500/15 text-violet-200' : 'border-slate-800 bg-slate-900 text-slate-400'}`}>
            <FileText className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">{isActive ? 'Editando agora' : 'Projeto'}</p>
            <h3 className="mt-0.5 line-clamp-2 text-xs font-black leading-snug text-slate-100">{title}</h3>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:transition-opacity lg:group-hover:opacity-100">
          <span className="rounded-full border border-slate-800 bg-slate-900 px-2 py-1 text-[9px] font-black text-slate-400">{completion}%</span>
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-[11px] leading-relaxed text-slate-400">{description}</p>

      <div className="mt-3 grid gap-2 text-[10px] font-bold text-slate-500">
        <span className="flex min-w-0 items-center gap-1.5">
          <LinkIcon className="h-3.5 w-3.5 shrink-0 text-violet-400" />
          <span className="truncate">{domain}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <CalendarClock className="h-3.5 w-3.5 text-slate-500" />
          Atualizado em {updatedAt}
        </span>
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-800/70 pt-3">
        <span className={`rounded-full border px-2 py-1 text-[9px] font-black uppercase tracking-wider ${isDraft ? 'border-amber-500/30 bg-amber-500/10 text-amber-200' : 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300'}`}>
          {isDraft ? 'Rascunho' : 'Pronta'}
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Duplicar"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(e);
            }}
            className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:border-violet-500/40 hover:text-white"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            title="Abrir"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:border-violet-500/40 hover:text-white"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            title="Excluir"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(e);
            }}
            className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:border-red-500/40 hover:text-red-300"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
