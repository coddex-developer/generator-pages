'use client';

import React, { useState } from 'react';
import { Download, EyeIcon, Flame, Languages, Menu, Plus, Upload, X } from 'lucide-react';
import { usePresell } from '../context/PresellContext';

interface TopBarProps {
  setImportModalOpen: (v: boolean) => void;
  onRequestExport: () => void;
  onRequestNew: () => void;
  onOpenPreviewModal: () => void;
}

export function TopBar({ setImportModalOpen, onRequestExport, onRequestNew, onOpenPreviewModal }: TopBarProps) {
  const { titulo, ctaLink, lang, setLang } = usePresell();
  const [menuOpen, setMenuOpen] = useState(false);
  const canExport = Boolean(titulo && ctaLink);

  const actions = (
    <>
      <button
        type="button"
        onClick={() => {
          setImportModalOpen(true);
          setMenuOpen(false);
        }}
        className="cursor-pointer bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 border border-slate-700/80"
        title="Importar projeto externo JSON"
      >
        <Upload className="w-4 h-4" />
        <span>Importar</span>
      </button>

      <button
        type="button"
        onClick={() => {
          onRequestNew();
          setMenuOpen(false);
        }}
        className="cursor-pointer bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 border border-slate-700/80"
        title="Iniciar nova configuracao"
      >
        <Plus className="w-4 h-4" />
        <span>Criar Novo</span>
      </button>

      <label className="bg-slate-800/80 border border-slate-700/80 text-slate-200 text-xs font-bold px-2 py-2 rounded-xl flex items-center gap-1.5">
        <Languages className="w-4 h-4 text-slate-400" />
        <select
          value={lang}
          onChange={(event) => setLang(event.target.value as 'pt' | 'en')}
          className="cursor-pointer bg-transparent outline-none"
          aria-label="Idioma do sistema"
        >
          <option value="pt">PT</option>
          <option value="en">EN</option>
        </select>
      </label>

      <button
        type="button"
        onClick={() => {
          onOpenPreviewModal();
          setMenuOpen(false);
        }}
        className="cursor-pointer bg-slate-800/80 lg:hidden hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 border border-slate-700/80"
        title="Abrir preview"
      >
        <EyeIcon className="w-4 h-4" />
        <span>Preview</span>
      </button>

      <button
        type="button"
        onClick={() => {
          onRequestExport();
          setMenuOpen(false);
        }}
        disabled={!canExport}
        className={`text-xs font-extrabold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-md ${
          !canExport
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
            : 'cursor-pointer bg-violet-600 hover:bg-violet-500 text-white shadow-violet-600/10'
        }`}
      >
        <Download className="w-4 h-4" />
        <span>Exportar</span>
      </button>
    </>
  );

  return (
    <header className="border-b border-slate-850 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-40 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="bg-gradient-to-tr from-violet-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-violet-500/15 shrink-0">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-extrabold text-white tracking-tight text-base">RapidPresell</span>
              <span className="bg-violet-500/10 text-violet-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-violet-500/20">v5.0.0</span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Editor premium, preview fiel e HTML responsivo para Google Ads</p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 flex-wrap">{actions}</div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="lg:hidden cursor-pointer inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700 transition"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <div className={`lg:hidden grid transition-[grid-template-rows,opacity] duration-300 ${menuOpen ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 grid gap-2">
            {actions}
          </div>
        </div>
      </div>
    </header>
  );
}
