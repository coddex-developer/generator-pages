'use client';

import React from 'react';
import { Flame, Upload, Plus, Download, EyeIcon } from 'lucide-react';
import { usePresell } from '../context/PresellContext';

export function TopBar({ setImportModalOpen, setExportModalOpen }: { setImportModalOpen: (v: boolean) => void, setExportModalOpen: (v: boolean) => void }) {
  const { titulo, ctaLink, handleNewClick, handleSavePresell } = usePresell();

  return (
    <header className="border-b border-slate-850 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-2.5">
          <div className="bg-gradient-to-tr from-violet-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-violet-500/15">
            <Flame className="w-5.5 h-5.5 text-white" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-extrabold text-white tracking-tight text-base">RapidPresell</span>
              <span className="bg-violet-500/10 text-violet-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-violet-500/20">v4.3.2</span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Foco de Escassez, Design de Timer Elevado & Customização de Componentes</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setImportModalOpen(true)}
            className="bg-slate-800/80 cursor-pointer hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 border border-slate-700/80"
            title="Importar projeto externo JSON"
          >
            <Upload className="w-4 h-4" />
            <span>Importar</span>
          </button>

          <button 
            onClick={handleNewClick}
            className="bg-slate-800/80 cursor-pointer hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 border border-slate-700/80"
            title="Iniciar nova configuração em branco"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Criar Novo</span>
          </button>

          <button 
            onClick={()=>{alert("Em breve")}}
            className="bg-slate-800/80 lg:hidden cursor-pointer hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 border border-slate-700/80"
            title="Live preview"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => {
              handleSavePresell();
              setExportModalOpen(true);
            }}
            disabled={!titulo || !ctaLink}
            className={`text-xs cursor-pointer font-extrabold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-md ${
              (!titulo || !ctaLink) 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
              : 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-600/10'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
        </div>

      </div>
    </header>
  );
}
