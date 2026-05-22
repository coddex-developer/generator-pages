'use client';

import React, { useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Check,
  Code,
  Copy,
  Download,
  Eye,
  FileCode2,
  FileDown,
  Monitor,
  PackageCheck,
  Save,
  ShieldAlert,
  Upload,
  X
} from 'lucide-react';
import { PresellProvider, usePresell } from '../context/PresellContext';
import { TopBar } from './TopBar';
import { SidebarHistory } from './SidebarHistory';
import { EditorPanel } from './EditorPanel';
import { LivePreview, PreviewFrame, PreviewPresetControl, type PreviewPresetId } from './LivePreview';
import { AllPresellsModal } from './AllPresellsModal';
import { generateHTML } from '../lib/HtmlGenerator';

type ConfirmAction = {
  title: string;
  description: string;
  confirmLabel: string;
  variant?: 'default' | 'danger';
  onConfirm: () => void;
};

function AppContent() {
  const ctx = usePresell();

  const [importModalOpen, setImportModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [markdownHelpOpen, setMarkdownHelpOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [showAllPresells, setShowAllPresells] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);

  const [previewPreset, setPreviewPreset] = useState<PreviewPresetId>('iphone-14');
  const [mobilePreviewPreset, setMobilePreviewPreset] = useState<PreviewPresetId>('iphone-14');
  const [exportPreviewPreset, setExportPreviewPreset] = useState<PreviewPresetId>('desktop-1366');
  const [exportView, setExportView] = useState<'preview' | 'code'>('preview');
  const [exportFileName, setExportFileName] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [importJsonText, setImportJsonText] = useState('');
  const showLegacyExportModal = false;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const generatedExportHTML = useMemo(() => generateHTML(ctx, ctx.activeId), [ctx]);

  const requestConfirm = (action: ConfirmAction) => setConfirmAction(action);

  const resetBaseStyles = () => {
    ctx.setThemeColor('#0b0f19');
    ctx.setTextColor('#ffffff');
    ctx.setCtaColor('#22c55e');
    ctx.setBorderRadius(16);
    ctx.setHasImageBorder(true);
    ctx.setFontSizeTitulo(28);
    ctx.setFontSizeSubtitulo(14);
    ctx.setCtaSize('large');
    ctx.setCtaWidth(100);
    ctx.showToast('Estilos base restaurados.');
  };

  const requestSave = () => {
    requestConfirm({
      title: 'Salvar alterações?',
      description: 'As configurações atuais serão gravadas no projeto ativo do navegador.',
      confirmLabel: 'Salvar agora',
      onConfirm: ctx.handleSavePresell
    });
  };

  const requestExport = () => {
    if (!ctx.titulo || !ctx.ctaLink) {
      ctx.showToast('Preencha o titulo e o link do CTA antes de exportar.');
      return;
    }

    ctx.handleSavePresell();
    setExportView('preview');
    setExportModalOpen(true);
  };

  const confirmDeleteAction = () => {
    if (deleteConfirmId) {
      ctx.handleDeletePresell(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const handleCopyCode = () => {
    requestConfirm({
      title: 'Copiar HTML final?',
      description: 'O código HTML completo será enviado para a área de transferência.',
      confirmLabel: 'Copiar HTML',
      onConfirm: () => {
        navigator.clipboard.writeText(generatedExportHTML);
        setCopiedId('code');
        setTimeout(() => setCopiedId(null), 2000);
      }
    });
  };

  const handleImportJsonAction = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      const importItem = Array.isArray(parsed) ? parsed[0] : parsed;
      const newId = 'id_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
      const newPresell = { ...importItem, id: newId, updatedAt: new Date().toISOString() };
      const nextList = [newPresell, ...ctx.presells];

      ctx.setPresells(nextList);
      localStorage.setItem('v3_presell_items', JSON.stringify(nextList));
      ctx.loadPresell(newPresell);
      setImportModalOpen(false);
      setImportJsonText('');
      ctx.showToast('Projeto importado com sucesso.');
    } catch {
      ctx.showToast('JSON invalido. Verifique a formatacao.');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      try {
        const result = loadEvent.target?.result as string;
        requestConfirm({
          title: 'Importar projeto?',
          description: 'O arquivo JSON será adicionado como um novo projeto e aberto para edição.',
          confirmLabel: 'Importar agora',
          onConfirm: () => handleImportJsonAction(result)
        });
      } catch {
        ctx.showToast('Erro ao ler arquivo.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-violet-500/30">
      <TopBar
        setImportModalOpen={setImportModalOpen}
        onOpenPreviewModal={() => setPreviewModalOpen(true)}
        onRequestExport={requestExport}
        onRequestNew={() => requestConfirm({
          title: 'Criar novo projeto?',
          description: 'Um novo rascunho será criado. Salve o projeto atual antes se quiser preservar alterações recentes.',
          confirmLabel: 'Criar novo',
          onConfirm: ctx.handleNewClick
        })}
      />

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative px-2 md:px-8">
        <section className="lg:col-span-5 flex flex-col gap-4 py-7 relative z-10">
          <SidebarHistory setShowAllPresells={setShowAllPresells} setDeleteConfirmId={setDeleteConfirmId} />
          <EditorPanel
            setMarkdownHelpOpen={setMarkdownHelpOpen}
            onRequestSave={requestSave}
            onRequestReset={() => requestConfirm({
              title: 'Restaurar estilos base?',
              description: 'Cores, tamanhos, bordas e aparência principal voltarão ao padrão do tema.',
              confirmLabel: 'Restaurar estilos',
              onConfirm: resetBaseStyles
            })}
          />
        </section>

        <section className="lg:col-span-7 relative z-10">
          <LivePreview previewPreset={previewPreset} setPreviewPreset={setPreviewPreset} />
        </section>
      </main>

      {markdownHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between gap-4 p-5 border-b border-slate-800">
              <div>
                <h2 className="text-lg font-black text-white">Markdown completo</h2>
                <p className="text-xs text-slate-400">Use no titulo, descricao, menu e respostas do FAQ.</p>
              </div>
              <button onClick={() => setMarkdownHelpOpen(false)} className="cursor-pointer text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full p-2">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 grid gap-3 text-xs text-slate-300">
              <pre className="bg-slate-950 border border-slate-800 rounded-xl p-3 overflow-x-auto whitespace-pre-wrap">{`# Titulo grande
## Secao
**negrito**, *italico*, ~~taxado~~
[texto colorido]{#22c55e}
[link](https://exemplo.com)
- [Sobre](#sobre)
- [Checkout](https://exemplo.com)
> destaque
\`codigo\``}</pre>
              <p className="leading-relaxed text-slate-400">O HTML final usa Markdown GFM via marked, incluindo listas, links, citacoes, tabelas simples e blocos de codigo.</p>
            </div>
          </div>
        </div>
      )}

      {previewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-2 backdrop-blur-md lg:hidden">
          <div className="flex h-[calc(100dvh-16px)] w-full max-w-lg flex-col overflow-hidden rounded-[28px] border border-slate-800 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between gap-3 border-b border-slate-800 p-4">
              <div>
                <h2 className="text-sm font-black text-white">Preview mobile</h2>
                <p className="text-[11px] text-slate-400">Renderização fiel do HTML final.</p>
              </div>
              <button onClick={() => setPreviewModalOpen(false)} className="cursor-pointer text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full p-2">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="border-b border-slate-800 p-3">
              <PreviewPresetControl
                selectedPreset={mobilePreviewPreset}
                onChange={setMobilePreviewPreset}
                devices={['mobile', 'tablet']}
                compact
              />
            </div>
            <div className="min-h-0 flex-1 p-2">
              <PreviewFrame
                html={generatedExportHTML}
                presetId={mobilePreviewPreset}
                className="h-full min-h-0 rounded-3xl border-slate-800 p-2"
                fitHeight="calc(100dvh - 170px)"
              />
            </div>
          </div>
        </div>
      )}

      {ctx.toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-5 py-3 rounded-full shadow-2xl font-bold text-sm z-50 border border-slate-700 flex items-center gap-2">
          {ctx.toastMessage}
        </div>
      )}

      {showAllPresells && (
        <AllPresellsModal
          presells={ctx.presells}
          activeId={ctx.activeId}
          loadPresell={(item) => {
            ctx.loadPresell(item);
            setShowAllPresells(false);
          }}
          handleDuplicatePresell={(item) => requestConfirm({
            title: 'Duplicar presell?',
            description: 'Uma cópia independente será criada e aberta para edição.',
            confirmLabel: 'Duplicar',
            onConfirm: () => ctx.handleDuplicatePresell(item)
          })}
          setShowAllPresells={setShowAllPresells}
          isDraft={ctx.isDraftCard}
          onDelete={(id) => setDeleteConfirmId(id)}
          onDeleteAll={() => requestConfirm({
            title: 'Excluir todos os projetos?',
            description: 'Todos os projetos salvos neste navegador serão apagados permanentemente.',
            confirmLabel: 'Excluir todos',
            variant: 'danger',
            onConfirm: ctx.handleDeleteAllPresells
          })}
        />
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Excluir este projeto?
            </h3>
            <p className="text-xs text-slate-400 mt-2">Isso apagará permanentemente todos os dados desta presell no seu navegador.</p>
            <div className="flex gap-2.5 justify-end mt-5">
              <button onClick={() => setDeleteConfirmId(null)} className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-3 py-1.5 rounded-lg">Cancelar</button>
              <button onClick={confirmDeleteAction} className="cursor-pointer bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg">Excluir de vez</button>
            </div>
          </div>
        </div>
      )}

      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h2 className="text-lg font-black text-white mt-1.5 flex items-center gap-2">
                <Upload className="w-5 h-5 text-violet-500" />
                Importar projeto Presell
              </h2>
              <button onClick={() => setImportModalOpen(false)} className="cursor-pointer text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full p-2">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4">
              <label className="block text-xs font-bold text-slate-300 mb-2">Enviar arquivo .json</label>
              <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-800 hover:border-violet-500 hover:bg-slate-950/40 rounded-xl p-6 text-center cursor-pointer flex flex-col items-center gap-1.5">
                <Upload className="w-8 h-8 text-slate-500" />
                <span className="text-xs text-slate-300 font-bold">Clique para selecionar seu JSON</span>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".json" className="hidden" />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-xs font-bold text-slate-300 mb-1">Ou cole o texto JSON diretamente</label>
              <textarea rows={4} value={importJsonText} onChange={(e) => setImportJsonText(e.target.value)} placeholder='{"titulo": "Exemplo"}' className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl p-3 text-[11px] text-slate-300 font-mono outline-none resize-none" />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setImportModalOpen(false)} className="cursor-pointer bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-bold px-4 py-2 rounded-xl">Cancelar</button>
              <button
                onClick={() => requestConfirm({
                  title: 'Importar projeto?',
                  description: 'O JSON será adicionado como um novo projeto e aberto para edição.',
                  confirmLabel: 'Importar agora',
                  onConfirm: () => handleImportJsonAction(importJsonText)
                })}
                disabled={!importJsonText.trim()}
                className="cursor-pointer bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Processar e importar <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {exportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-7xl max-h-[94vh] overflow-hidden rounded-[28px] border border-slate-800 bg-slate-900 shadow-2xl flex flex-col">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 bg-slate-900/95 px-4 py-4 sm:px-6">
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-400">HTML final</p>
                <h2 className="mt-1 flex items-center gap-2 text-lg sm:text-xl font-black text-white">
                  <Code className="w-5 h-5 text-violet-500" />
                  Exportar projeto
                </h2>
                <p className="mt-1 text-xs text-slate-400">Preview, codigo, backup e download no mesmo fluxo responsivo.</p>
              </div>
              <button onClick={() => setExportModalOpen(false)} className="cursor-pointer shrink-0 rounded-full bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[340px_minmax(0,1fr)] lg:overflow-hidden">
              <aside className="space-y-4 border-b border-slate-800 bg-slate-950/35 p-4 sm:p-5 lg:border-b-0 lg:border-r lg:overflow-y-auto">
                <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-emerald-400/15 p-2 text-emerald-300">
                      <PackageCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white">Pronto para publicar</h3>
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-400">Inclui meta tags, favicon da imagem de referencia, responsividade e todos os blocos ativos.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-bold text-slate-400">Nome do arquivo HTML</label>
                  <input
                    type="text"
                    value={exportFileName}
                    onChange={(e) => setExportFileName(e.target.value)}
                    placeholder="meu-presell"
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-3.5 py-3 text-sm text-slate-100 outline-none focus:border-violet-500"
                  />
                </div>

                <div className="grid gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-xs font-black text-slate-200 hover:bg-slate-700 hover:text-white"
                  >
                    {copiedId === 'code' ? <><Check className="w-4 h-4 text-emerald-400" /><span className="text-emerald-400">HTML copiado</span></> : <><Copy className="w-4 h-4" /><span>Copiar HTML</span></>}
                  </button>

                  <button onClick={() => requestConfirm({
                    title: 'Baixar backup JSON?',
                    description: 'Sera gerado um arquivo com a configuracao atual do projeto.',
                    confirmLabel: 'Baixar JSON',
                    onConfirm: () => {
                      const dataToBackup = { ...ctx, presells: undefined };
                      const element = document.createElement('a');
                      const file = new Blob([JSON.stringify(dataToBackup, null, 2)], { type: 'application/json' });
                      element.href = URL.createObjectURL(file);
                      element.download = `config-${ctx.titulo ? ctx.titulo.substring(0, 15).toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'presell'}.json`;
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                      ctx.showToast('Backup JSON baixado.');
                    }
                  })} className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs font-black text-slate-300 hover:bg-slate-800 hover:text-white">
                    <FileDown className="w-4 h-4" /> Baixar JSON
                  </button>

                  <button onClick={() => requestConfirm({
                    title: 'Baixar HTML final?',
                    description: 'O arquivo sera gerado com as meta tags, responsividade e configuracoes atuais.',
                    confirmLabel: 'Baixar HTML',
                    onConfirm: () => {
                      const element = document.createElement('a');
                      const file = new Blob([generatedExportHTML], { type: 'text/html' });
                      const targetName = exportFileName.trim() || (ctx.titulo ? ctx.titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 20) : 'presell');
                      element.href = URL.createObjectURL(file);
                      element.download = `${targetName}.html`;
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                      ctx.showToast('Download do arquivo HTML iniciado.');
                    }
                  })} className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-xs font-black text-white shadow-lg shadow-violet-950/35 hover:from-violet-500 hover:to-indigo-500">
                    <Download className="w-4 h-4" /> Baixar .HTML
                  </button>
                </div>

                <button onClick={() => setExportModalOpen(false)} className="cursor-pointer w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-xs font-black text-slate-400 hover:bg-slate-800 hover:text-white">
                  Voltar ao editor
                </button>
              </aside>

              <section className="flex min-h-0 flex-col gap-3 p-3 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-300">
                    <Monitor className="w-4 h-4 text-violet-400" />
                    Visualizacao fiel do export
                  </div>
                  {exportView === 'preview' && (
                    <PreviewPresetControl
                      selectedPreset={exportPreviewPreset}
                      onChange={setExportPreviewPreset}
                      compact
                    />
                  )}
                  <div className="grid grid-cols-2 rounded-2xl border border-slate-800 bg-slate-950 p-1">
                    <button
                      type="button"
                      onClick={() => setExportView('preview')}
                      className={`cursor-pointer inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-black transition-colors ${exportView === 'preview' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      <Eye className="w-3.5 h-3.5" /> Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => setExportView('code')}
                      className={`cursor-pointer inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-black transition-colors ${exportView === 'code' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      <FileCode2 className="w-3.5 h-3.5" /> Codigo
                    </button>
                  </div>
                </div>

                <div className="min-h-[460px] flex-1 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 p-2 lg:min-h-0">
                  {exportView === 'preview' ? (
                    <PreviewFrame
                      html={generatedExportHTML}
                      presetId={exportPreviewPreset}
                      className="h-full min-h-[440px] rounded-2xl border-0 bg-slate-950 p-0 lg:min-h-0"
                      fitHeight="calc(100dvh - 230px)"
                    />
                  ) : (
                    <pre className="h-full max-h-[66vh] overflow-auto rounded-2xl bg-slate-950 p-4 text-xs leading-relaxed text-slate-300 font-mono scrollbar-thin">
                      <code>{generatedExportHTML}</code>
                    </pre>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {showLegacyExportModal && exportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full lg:max-w-6xl p-6 md:p-8 shadow-2xl relative max-h-[94vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
                  <Code className="w-6 h-6 text-violet-500" />
                  Exportar projeto
                </h2>
                <p className="text-xs text-slate-400 mt-1">O preview abaixo usa o mesmo HTML que será baixado.</p>
              </div>
              <button onClick={() => setExportModalOpen(false)} className="cursor-pointer text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full p-2">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr] items-start">
              <div>
                <label className="block text-[11px] text-slate-400 mb-2">Nome do arquivo HTML</label>
                <input type="text" value={exportFileName} onChange={(e) => setExportFileName(e.target.value)} placeholder="meu-presell" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-3 text-sm text-slate-100 outline-none focus:border-violet-500" />
                <div className="relative mt-4">
                  <div className="absolute top-3 right-3 z-10 flex gap-2">
                    <button onClick={handleCopyCode} className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold py-2 px-3.5 rounded-lg flex items-center gap-1.5 border border-slate-700">
                      {copiedId === 'code' ? <><Check className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400">Copiado</span></> : <><Copy className="w-3.5 h-3.5" /><span>Copiar HTML</span></>}
                    </button>
                  </div>
                  <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 pt-12 overflow-x-auto text-xs text-slate-300 font-mono w-full max-h-[280px] scrollbar-thin">
                    <code>{generatedExportHTML}</code>
                  </pre>
                </div>
              </div>
              <div className="space-y-3">
                <PreviewFrame html={generatedExportHTML} previewDevice="desktop" className="min-h-[420px] p-2" />
              </div>
            </div>
            <div className="flex flex-wrap justify-between gap-3 mt-6">
              <button onClick={() => requestConfirm({
                title: 'Baixar backup JSON?',
                description: 'Será gerado um arquivo com a configuração atual do projeto.',
                confirmLabel: 'Baixar JSON',
                onConfirm: () => {
                  const dataToBackup = { ...ctx, presells: undefined };
                  const element = document.createElement('a');
                  const file = new Blob([JSON.stringify(dataToBackup, null, 2)], { type: 'application/json' });
                  element.href = URL.createObjectURL(file);
                  element.download = `config-${ctx.titulo ? ctx.titulo.substring(0, 15).toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'presell'}.json`;
                  document.body.appendChild(element);
                  element.click();
                  document.body.removeChild(element);
                  ctx.showToast('Backup JSON baixado.');
                }
              })} className="cursor-pointer bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5">
                <FileDown className="w-4 h-4" /> Baixar JSON de configuração
              </button>
              <div className="flex gap-2">
                <button onClick={() => setExportModalOpen(false)} className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-4 py-2.5 rounded-xl">Voltar</button>
                <button onClick={() => requestConfirm({
                  title: 'Baixar HTML final?',
                  description: 'O arquivo será gerado com as meta tags, responsividade e configurações atuais.',
                  confirmLabel: 'Baixar HTML',
                  onConfirm: () => {
                    const element = document.createElement('a');
                    const file = new Blob([generatedExportHTML], { type: 'text/html' });
                    const targetName = exportFileName.trim() || (ctx.titulo ? ctx.titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 20) : 'presell');
                    element.href = URL.createObjectURL(file);
                    element.download = `${targetName}.html`;
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                    ctx.showToast('Download do arquivo HTML iniciado.');
                  }
                })} className="cursor-pointer bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5">
                  <Download className="w-4 h-4" /> Baixar .HTML
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmAction && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className={`rounded-2xl p-2 ${confirmAction.variant === 'danger' ? 'bg-red-500/10 text-red-400' : 'bg-violet-500/10 text-violet-400'}`}>
                {confirmAction.variant === 'danger' ? <ShieldAlert className="w-5 h-5" /> : <Save className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-sm font-black text-white">{confirmAction.title}</h3>
                <p className="text-xs leading-relaxed text-slate-400 mt-1">{confirmAction.description}</p>
              </div>
            </div>
            <div className="flex justify-end gap-2.5 mt-5">
              <button onClick={() => setConfirmAction(null)} className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-4 py-2 rounded-xl">Cancelar</button>
              <button
                onClick={() => {
                  const action = confirmAction.onConfirm;
                  setConfirmAction(null);
                  action();
                }}
                className={`cursor-pointer text-white text-xs font-black px-4 py-2 rounded-xl ${confirmAction.variant === 'danger' ? 'bg-red-600 hover:bg-red-500' : 'bg-violet-600 hover:bg-violet-500'}`}
              >
                {confirmAction.confirmLabel}
              </button>
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
