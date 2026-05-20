'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Upload, ArrowRight, Code, Download, Check, Copy, AlertCircle } from 'lucide-react';
import { PresellProvider, usePresell } from '../context/PresellContext';
import { TopBar } from './TopBar';
import { SidebarHistory } from './SidebarHistory';
import { EditorPanel } from './EditorPanel';
import { LivePreview } from './LivePreview';
import { AllPresellsModal } from './AllPresellsModal';
import { generateHTML } from '../lib/HtmlGenerator';

function AppContent() {
  const ctx = usePresell();

  // Modals & local state
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [markdownHelpOpen, setMarkdownHelpOpen] = useState(false);
  const [showAllPresells, setShowAllPresells] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [exportFileName, setExportFileName] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [importJsonText, setImportJsonText] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const generatedExportHTML = useMemo(() => generateHTML(ctx, ctx.activeId), [ctx]);

  const confirmDeleteAction = () => {
    if (deleteConfirmId) {
      ctx.handleDeletePresell(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedExportHTML);
    setCopiedId('code');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result as string;
        handleImportJsonAction(result);
      } catch (err) {
        ctx.showToast('❌ Erro ao ler arquivo.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleImportJsonAction = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      const isArray = Array.isArray(parsed);
      const importItem = isArray ? parsed[0] : parsed;

      const newId = 'id_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
      const newPresell = { ...importItem, id: newId, updatedAt: new Date().toISOString() };

      const nextList = [newPresell, ...ctx.presells];
      ctx.setPresells(nextList);
      localStorage.setItem('v3_presell_items', JSON.stringify(nextList));
      ctx.loadPresell(newPresell);

      setImportModalOpen(false);
      setImportJsonText('');
      ctx.showToast('✅ Projeto importado com sucesso!');
    } catch (error) {
      ctx.showToast('❌ JSON Inválido. Verifique a formatação.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-violet-500/30">
      <TopBar setImportModalOpen={setImportModalOpen} setExportModalOpen={setExportModalOpen} />

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative px-2 md:px-8">

        <section className="lg:col-span-5 flex flex-col gap-4 py-7 relative z-10">
          <SidebarHistory setShowAllPresells={setShowAllPresells} setDeleteConfirmId={setDeleteConfirmId} />
          <EditorPanel setMarkdownHelpOpen={setMarkdownHelpOpen} />
        </section>

        <section className="lg:col-span-7 relative z-10">
          <LivePreview previewDevice={previewDevice} setPreviewDevice={setPreviewDevice} />
        </section>
      </main>

      {/* Floating toast */}
      {ctx.toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-5 py-3 rounded-full shadow-2xl font-bold text-sm z-50 animate-bounce border border-slate-700 flex items-center gap-2">
          {ctx.toastMessage}
        </div>
      )}

      {/* ALL PRESELLS MODAL */}
      {showAllPresells && (
        <AllPresellsModal
          presells={ctx.presells}
          activeId={ctx.activeId}
          loadPresell={(item) => {
            ctx.loadPresell(item);
            setShowAllPresells(false);
          }}
          handleDuplicatePresell={ctx.handleDuplicatePresell}
          setShowAllPresells={setShowAllPresells}
          isDraft={ctx.isDraftCard}
          onDelete={(id) => setDeleteConfirmId(id)}
          onDeleteAll={ctx.handleDeleteAllPresells}
        />
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Excluir este Projeto?
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              Isso apagará permanentemente todos os dados e o histórico configurado desta presell no seu navegador.
            </p>
            <div className="flex gap-2.5 justify-end mt-5">
              <button onClick={() => setDeleteConfirmId(null)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-3 py-1.5 rounded-lg">Cancelar</button>
              <button onClick={confirmDeleteAction} className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg">Excluir de vez</button>
            </div>
          </div>
        </div>
      )}

      {/* IMPORT MODAL */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-black text-white mt-1.5 flex items-center gap-2">
                  <Upload className="w-5.5 h-5.5 text-violet-500" />
                  Importar Projeto Presell
                </h2>
              </div>
              <button onClick={() => setImportModalOpen(false)} className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full p-1.5">✕</button>
            </div>
            <div className="mt-4">
              <label className="block text-xs font-bold text-slate-300 mb-2">Enviar Arquivo .json</label>
              <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-800 hover:border-violet-500 hover:bg-slate-950/40 rounded-xl p-6 text-center cursor-pointer flex flex-col items-center gap-1.5">
                <Upload className="w-8 h-8 text-slate-500" />
                <span className="text-xs text-slate-300 font-bold">Clique para selecionar seu JSON</span>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".json" className="hidden" />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-xs font-bold text-slate-300 mb-1">Ou Cole o Texto JSON Diretamente</label>
              <textarea rows={4} value={importJsonText} onChange={(e) => setImportJsonText(e.target.value)} placeholder='{"titulo": "Exemplo"}' className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl p-3 text-[11px] text-slate-300 font-mono outline-none resize-none" />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setImportModalOpen(false)} className="bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-bold px-4 py-2 rounded-xl">Cancelar</button>
              <button onClick={() => handleImportJsonAction(importJsonText)} disabled={!importJsonText.trim()} className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 disabled:opacity-50">
                Processar & Importar <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXPORT MODAL */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full lg:max-w-6xl p-6 md:p-8 shadow-2xl relative">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
                  <Code className="w-6 h-6 text-violet-500" />
                  Escolha como quer exportar
                </h2>
                <p className="text-xs text-slate-400 mt-1">Defina o nome do arquivo HTML antes de baixar.</p>
              </div>
              <button onClick={() => setExportModalOpen(false)} className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full p-2">✕</button>
            </div>
            <div className="grid gap-4 sm:grid-cols-[1.2fr_1fr] items-start">
              <div>
                <label className="block text-[11px] text-slate-400 mb-2">Nome do arquivo HTML</label>
                <input type="text" value={exportFileName} onChange={(e) => setExportFileName(e.target.value)} placeholder="meu-presell" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-3 text-sm text-slate-100 outline-none focus:border-violet-500" />
                <div className="relative mt-4">
                  <div className="absolute top-3 right-3 z-10 flex gap-2">
                    <button onClick={handleCopyCode} className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold py-2 px-3.5 rounded-lg flex items-center gap-1.5 border border-slate-700">
                      {copiedId === 'code' ? <><Check className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400">Copiado!</span></> : <><Copy className="w-3.5 h-3.5" /><span>Copiar HTML</span></>}
                    </button>
                  </div>
                  <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 pt-12 overflow-x-auto text-xs text-slate-300 font-mono w-full max-w-[300px] lg:max-w-2xl mx-auto max-h-[220px] lg:max-h-[290px] scrollbar-thin">
                    <code>{generatedExportHTML}</code>
                  </pre>
                </div>
              </div>
              <div className="space-y-3 hidden lg:block">
                <div className="border border-slate-800 rounded-3xl overflow-hidden bg-slate-950">
                  <iframe title="Preview HTML exportado" srcDoc={generatedExportHTML} sandbox="allow-same-origin allow-scripts" className="w-full h-[360px] bg-white" />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-between gap-3 mt-6">
              <button onClick={() => {
                const dataToBackup = { ...ctx, presells: undefined };
                const element = document.createElement("a");
                const file = new Blob([JSON.stringify(dataToBackup, null, 2)], { type: 'application/json' });
                element.href = URL.createObjectURL(file);
                element.download = `config-${ctx.titulo ? ctx.titulo.substring(0, 15).toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'presell'}.json`;
                document.body.appendChild(element); element.click(); document.body.removeChild(element);
                ctx.showToast("📥 Backup JSON baixado!");
              }} className="bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold px-4 py-2.5 rounded-xl">
                Baixar JSON de Configuração
              </button>
              <div className="flex gap-2">
                <button onClick={() => setExportModalOpen(false)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-4 py-2.5 rounded-xl">Voltar</button>
                <button onClick={() => {
                  const element = document.createElement("a");
                  const file = new Blob([generatedExportHTML], { type: 'text/html' });
                  const targetName = exportFileName.trim() || (ctx.titulo ? ctx.titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 20) : 'presell');
                  element.href = URL.createObjectURL(file); element.download = `${targetName}.html`;
                  document.body.appendChild(element); element.click(); document.body.removeChild(element);
                  ctx.showToast("📥 Download do arquivo HTML iniciado!");
                }} className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5">
                  <Download className="w-4 h-4" /> Baixar .HTML
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export function PresellApp() {
  return (
    <PresellProvider>
      <AppContent />
    </PresellProvider>
  );
}
