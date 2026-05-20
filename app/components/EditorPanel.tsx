'use client';

import React, { useRef } from 'react';
import { Settings, SlidersHorizontal, Layout, Sparkles, FileText, HelpCircle, ImageIcon, Timer, Palette, Plus, Trash2, RotateCcw, SaveIcon, LinkIcon } from 'lucide-react';
import { usePresell } from '../context/PresellContext';

export function EditorPanel({ setMarkdownHelpOpen }: { setMarkdownHelpOpen: (v: boolean) => void }) {
  const ctx = usePresell();
  
  const tituloRef = useRef<HTMLTextAreaElement>(null);
  const subtituloRef = useRef<HTMLTextAreaElement>(null);

  const [newQuestion, setNewQuestion] = React.useState('');
  const [newAnswer, setNewAnswer] = React.useState('');

  const themePresets = [
    { name: 'Slate Noturno', value: '#0b0f19' },
    { name: 'Obsidiana Escura', value: '#020617' },
    { name: 'Roxo Galaxy', value: 'linear-gradient(135deg, #12072b 0%, #03000a 100%)' },
    { name: 'Esmeralda Negra', value: 'linear-gradient(135deg, #021a11 0%, #000403 100%)' },
    { name: 'Vinho Royal', value: 'linear-gradient(135deg, #210212 0%, #050003 100%)' },
    { name: 'Minimalista Claro', value: '#f8fafc', isLight: true },
    { name: 'Gelo Sofisticado', value: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)', isLight: true },
    { name: 'Champanhe Premium', value: 'linear-gradient(135deg, #fafaf9 0%, #f5f5f4 100%)', isLight: true },
  ];

  const ctaColorPresets = [
    { name: 'Verde Zap', value: '#22c55e' },
    { name: 'Vermelho VSL', value: '#ef4444' },
    { name: 'Azul Seguro', value: '#3b82f6' },
    { name: 'Laranja Quente', value: '#f97316' },
    { name: 'Roxo Premium', value: '#a855f7' },
    { name: 'Rosa Vibrante', value: '#ec4899' },
  ];

  const avisoColorPresets = [
    { name: 'Alerta Vermelho', bg: '#dc2626', text: '#ffffff' },
    { name: 'Atenção Amarelo', bg: '#f59e0b', text: '#000000' },
    { name: 'Sucesso Verde', bg: '#10b981', text: '#ffffff' },
    { name: 'Informativo Azul', bg: '#3b82f6', text: '#ffffff' },
    { name: 'Dark Sóbrio', bg: '#1e293b', text: '#f8fafc' },
    { name: 'Clean White', bg: '#ffffff', text: '#0f172a' }
  ];

  const timerColorPresets = [
    { name: 'Preto Gloss', bg: '#020617', text: '#ffffff' },
    { name: 'Escuro Minimalista', bg: '#1e293b', text: '#ffffff' },
    { name: 'Vermelho Intenso', bg: '#7f1d1d', text: '#fca5a5' },
    { name: 'Verde Dark', bg: '#064e3b', text: '#a7f3d0' },
    { name: 'Branco Puro', bg: '#ffffff', text: '#1e293b' },
    { name: 'Laranja Elétrico', bg: '#ffedd5', text: '#ea580c' }
  ];

  const insertMarkdown = (tag: string, target: 'titulo' | 'subtitulo') => {
    const textarea = target === 'titulo' ? tituloRef.current : subtituloRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;

    let before = value.substring(0, start);
    let after = value.substring(end, value.length);
    let selected = value.substring(start, end);

    let inserted = '';
    if (tag === 'bold') inserted = `**${selected || 'texto'}**`;
    else if (tag === 'italic') inserted = `*${selected || 'texto'}*`;
    else if (tag === 'strike') inserted = `~~${selected || 'texto'}~~`;
    else if (tag === 'link') inserted = `[${selected || 'texto do link'}](https://)`;
    else if (tag === 'color') inserted = `[${selected || 'texto'}]{#22c55e}`;
    else if (tag === 'warning') inserted = `[${selected || 'importante'}]{#ef4444}`;

    const newValue = before + inserted + after;
    if (target === 'titulo') ctx.setTitulo(newValue);
    else ctx.setSubtitulo(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + inserted.length, start + inserted.length);
    }, 50);
  };

  const handleAddFaqItem = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      ctx.showToast('⚠️ Preencha a pergunta e resposta para adicionar!');
      return;
    }
    const updatedFaq = [...ctx.faqList, { question: newQuestion.trim(), answer: newAnswer.trim() }];
    ctx.setFaqList(updatedFaq);
    setNewQuestion('');
    setNewAnswer('');
    ctx.showToast('❓ FAQ adicionado!');
  };

  const handleRemoveFaqItem = (index: number) => {
    const updatedFaq = ctx.faqList.filter((_, i) => i !== index);
    ctx.setFaqList(updatedFaq);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-850 rounded-3xl p-5 md:p-6 shadow-xl flex flex-col gap-5 relative overflow-hidden">

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Settings className="w-4.5 h-4.5 text-violet-500" />
            Configurar Presell
          </h2>
          <p className="text-[11px] text-slate-400">Personalização milimétrica do seu funil</p>
        </div>

        {ctx.activeId && (
          <span className="bg-slate-950 text-slate-500 text-[10px] font-mono px-2 py-1 rounded-md border border-slate-800">
            ID: {ctx.activeId.slice(-6)}
          </span>
        )}
      </div>

      <hr className="border-slate-850" />

      {/* 1. Header & Footer (Estrutura Externa) */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-[10px] font-black text-violet-400 uppercase tracking-widest flex items-center gap-1.5">
            <Layout className="w-3.5 h-3.5 text-violet-400" />
            Header & Footer
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-bold">Header ativo:</span>
            <button
              type="button"
              onClick={() => ctx.setHeaderEnabled(!ctx.headerEnabled)}
              className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${ctx.headerEnabled ? 'bg-violet-600' : 'bg-slate-800'}`}
            >
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${ctx.headerEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-3">
          {ctx.headerEnabled && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Marca no Header</label>
                <input
                  type="text"
                  value={ctx.headerBrand}
                  onChange={(e) => ctx.setHeaderBrand(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Itens do menu (vírgula)</label>
                <textarea
                  rows={2}
                  value={ctx.headerMenuRaw}
                  onChange={(e) => ctx.setHeaderMenuRaw(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-3 py-2 text-xs text-slate-200 outline-none resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Fundo Header</label>
                  <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-2">
                    <input type="color" value={ctx.headerBgColor} onChange={(e) => ctx.setHeaderBgColor(e.target.value)} className="w-8 h-8 rounded-lg border-none p-0" />
                    <input type="text" value={ctx.headerBgColor} onChange={(e) => ctx.setHeaderBgColor(e.target.value)} className="w-full bg-transparent text-[10px] font-mono outline-none text-slate-200" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Texto Header</label>
                  <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-2">
                    <input type="color" value={ctx.headerTextColor} onChange={(e) => ctx.setHeaderTextColor(e.target.value)} className="w-8 h-8 rounded-lg border-none p-0" />
                    <input type="text" value={ctx.headerTextColor} onChange={(e) => ctx.setHeaderTextColor(e.target.value)} className="w-full bg-transparent text-[10px] font-mono outline-none text-slate-200" />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="pt-3 border-t border-slate-800 mt-2">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-slate-300">Footer ativo:</span>
              <button
                type="button"
                onClick={() => ctx.setFooterEnabled(!ctx.footerEnabled)}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${ctx.footerEnabled ? 'bg-violet-600' : 'bg-slate-800'}`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${ctx.footerEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>
            
            {ctx.footerEnabled && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Texto do Footer</label>
                  <textarea
                    rows={2}
                    value={ctx.footerText}
                    onChange={(e) => ctx.setFooterText(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-3 py-2 text-xs text-slate-200 outline-none resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Fundo Footer</label>
                    <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-2">
                      <input type="color" value={ctx.footerBgColor} onChange={(e) => ctx.setFooterBgColor(e.target.value)} className="w-8 h-8 rounded-lg border-none p-0" />
                      <input type="text" value={ctx.footerBgColor} onChange={(e) => ctx.setFooterBgColor(e.target.value)} className="w-full bg-transparent text-[10px] font-mono outline-none text-slate-200" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Texto Footer</label>
                    <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-2">
                      <input type="color" value={ctx.footerTextColor} onChange={(e) => ctx.setFooterTextColor(e.target.value)} className="w-8 h-8 rounded-lg border-none p-0" />
                      <input type="text" value={ctx.footerTextColor} onChange={(e) => ctx.setFooterTextColor(e.target.value)} className="w-full bg-transparent text-[10px] font-mono outline-none text-slate-200" />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <hr className="border-slate-850" />

      {/* 2. Tema Geral (Cores) */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-violet-400 uppercase tracking-widest flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-violet-400" />
          Fundo & Estilo Base
        </h3>

        <div>
          <div className="grid grid-cols-2 gap-1.5 mb-2.5">
            {themePresets.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => {
                  ctx.setThemeColor(preset.value);
                  ctx.setTextColor(preset.isLight ? '#0f172a' : '#ffffff');
                }}
                className={`p-2 cursor-pointer rounded-xl border text-[10px] flex items-center gap-2 transition-all ${
                  ctx.themeColor === preset.value 
                    ? 'bg-slate-800 border-violet-500 text-white font-extrabold shadow' 
                    : 'bg-slate-950 border-slate-850 text-slate-400 hover:bg-slate-850'
                }`}
              >
                <span 
                  className="w-4 h-4 rounded-lg block border border-white/10 flex-shrink-0" 
                  style={{ background: preset.value.includes('gradient') ? preset.value : undefined, backgroundColor: !preset.value.includes('gradient') ? preset.value : undefined }}
                />
                <span className="truncate">{preset.name}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-[10px] text-slate-400 mb-1">Fundo Customizado</label>
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-800 flex-shrink-0">
                  <input 
                    type="color" 
                    value={ctx.themeColor.startsWith('#') ? ctx.themeColor : '#0b0f19'}
                    onChange={(e) => ctx.setThemeColor(e.target.value)}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 cursor-pointer"
                  />
                </div>
                <input 
                  type="text" 
                  value={ctx.themeColor}
                  onChange={(e) => ctx.setThemeColor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 focus:border-violet-500 rounded-xl px-2.5 py-1 text-xs text-slate-200 outline-none font-mono"
                />
              </div>
            </div>

            <div className="w-1/3">
              <label className="block text-[10px] text-slate-400 mb-1">Cor dos Textos</label>
              <select
                value={ctx.textColor}
                onChange={(e) => ctx.setTextColor(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 focus:border-violet-500 rounded-xl px-2 py-1.5 text-xs text-slate-200 outline-none"
              >
                <option value="#ffffff">Claro (Branco)</option>
                <option value="#0f172a">Escuro (Chumbo)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 mt-1">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
              Arredondamento do Card Principal
            </span>
            <span className="text-xs font-bold text-violet-400 font-mono">{ctx.borderRadius}px</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="24" 
            value={ctx.borderRadius} 
            onChange={(e) => ctx.setBorderRadius(parseInt(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
          />
        </div>
        
        {/* Alinhamento Geral */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Alinhamento do Conteúdo</label>
          <div className="grid grid-cols-3 gap-2">
            {['left', 'center', 'right'].map((align) => (
              <button
                key={align}
                type="button"
                onClick={() => ctx.setContentAlignment(align as any)}
                className={`text-[10px] cursor-pointer font-bold px-3 py-2 rounded-2xl border capitalize ${ctx.contentAlignment === align ? 'bg-violet-600 text-white border-violet-500' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'}`}
              >
                {align === 'left' ? 'Esquerda' : align === 'right' ? 'Direita' : 'Centro'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <hr className="border-slate-850" />

      {/* 3. Textos Principais e Markdown */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-[10px] font-black text-violet-400 uppercase tracking-widest flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-violet-400" />
            Headline e Textos Principais
          </h3>
          <button
            type="button"
            onClick={() => setMarkdownHelpOpen(true)}
            className="text-[10px] font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Guia de Markdown
          </button>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-bold text-slate-300">Título Principal <span className="text-red-500">*</span></label>
            <div className="flex gap-1.5">
              <button type="button" onClick={() => insertMarkdown('bold', 'titulo')} className="bg-slate-950 hover:bg-slate-850 text-slate-300 px-1.5 py-0.5 rounded text-[10px] font-bold border border-slate-800" title="Negrito">B</button>
              <button type="button" onClick={() => insertMarkdown('italic', 'titulo')} className="bg-slate-950 hover:bg-slate-850 text-slate-300 px-1.5 py-0.5 rounded text-[10px] italic border border-slate-800" title="Itálico">I</button>
              <button type="button" onClick={() => insertMarkdown('strike', 'titulo')} className="bg-slate-950 hover:bg-slate-850 text-slate-300 px-1.5 py-0.5 rounded text-[10px] line-through border border-slate-800" title="Taxado">S</button>
              <button type="button" onClick={() => insertMarkdown('link', 'titulo')} className="bg-slate-950 hover:bg-slate-850 text-blue-400 px-1.5 py-0.5 rounded text-[10px] font-bold border border-slate-800" title="Link">🔗</button>
              <button type="button" onClick={() => insertMarkdown('color', 'titulo')} className="bg-slate-950 hover:bg-slate-850 text-violet-400 px-1.5 py-0.5 rounded text-[10px] font-bold border border-slate-800" title="Colorir com Paleta">🎨</button>
            </div>
          </div>
          <textarea 
            ref={tituloRef}
            rows={4}
            value={ctx.titulo}
            onChange={(e) => ctx.setTitulo(e.target.value)}
            className="w-full bg-slate-950 border border-slate-850 hover:border-slate-700 focus:border-violet-500 rounded-xl px-3 py-2 text-xs text-slate-200 transition-all outline-none resize-none font-bold"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-bold text-slate-300">Subtítulo / Descrição</label>
            <div className="flex gap-1.5">
              <button type="button" onClick={() => insertMarkdown('bold', 'subtitulo')} className="bg-slate-950 hover:bg-slate-850 text-slate-300 px-1.5 py-0.5 rounded text-[10px] font-bold border border-slate-800" title="Negrito">B</button>
              <button type="button" onClick={() => insertMarkdown('italic', 'subtitulo')} className="bg-slate-950 hover:bg-slate-850 text-slate-300 px-1.5 py-0.5 rounded text-[10px] italic border border-slate-800" title="Itálico">I</button>
              <button type="button" onClick={() => insertMarkdown('strike', 'subtitulo')} className="bg-slate-950 hover:bg-slate-850 text-slate-300 px-1.5 py-0.5 rounded text-[10px] line-through border border-slate-800" title="Taxado">S</button>
              <button type="button" onClick={() => insertMarkdown('link', 'subtitulo')} className="bg-slate-950 hover:bg-slate-850 text-blue-400 px-1.5 py-0.5 rounded text-[10px] font-bold border border-slate-800" title="Link">🔗</button>
              <button type="button" onClick={() => insertMarkdown('color', 'subtitulo')} className="bg-slate-950 hover:bg-slate-850 text-violet-400 px-1.5 py-0.5 rounded text-[10px] font-bold border border-slate-800" title="Colorir Texto">🎨</button>
            </div>
          </div>
          <textarea 
            ref={subtituloRef}
            rows={7}
            value={ctx.subtitulo}
            onChange={(e) => ctx.setSubtitulo(e.target.value)}
            className="w-full bg-slate-950 border border-slate-850 hover:border-slate-700 focus:border-violet-500 rounded-xl px-3 py-2 text-xs text-slate-200 transition-all outline-none resize-none leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-850">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold text-slate-300">Tam. Título</span>
              <span className="text-xs text-violet-400 font-mono font-bold">{ctx.fontSizeTitulo}px</span>
            </div>
            <input type="range" min="20" max="48" value={ctx.fontSizeTitulo} onChange={(e) => ctx.setFontSizeTitulo(parseInt(e.target.value))} className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold text-slate-300">Tam. Subtítulo</span>
              <span className="text-xs text-violet-400 font-mono font-bold">{ctx.fontSizeSubtitulo}px</span>
            </div>
            <input type="range" min="12" max="24" value={ctx.fontSizeSubtitulo} onChange={(e) => ctx.setFontSizeSubtitulo(parseInt(e.target.value))} className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500" />
          </div>
        </div>
      </div>

      <hr className="border-slate-850" />

      {/* 4. Mídia e Posicionamento Visual */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-[10px] font-black text-violet-400 uppercase tracking-widest flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-violet-400" />
            Mídia & Imagem do Produto
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-bold">Bordas / Glow:</span>
            <button
              type="button"
              onClick={() => ctx.setHasImageBorder(!ctx.hasImageBorder)}
              className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${ctx.hasImageBorder ? 'bg-violet-600' : 'bg-slate-800'}`}
            >
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${ctx.hasImageBorder ? 'translate-x-5.5' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">URL da Imagem</label>
          <input 
            type="url" 
            value={ctx.imageUrl}
            onChange={(e) => ctx.setImageUrl(e.target.value)}
            className="w-full bg-slate-950 border border-slate-850 focus:border-violet-500 rounded-xl px-3 py-2 text-xs text-slate-200 transition-all outline-none font-mono text-[11px]"
          />
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Estilo de Encaixe & Sangria</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-400">Sangria Total (Card Bleed):</span>
              <button
                type="button"
                onClick={() => ctx.setImageFullBleed(!ctx.imageFullBleed)}
                className={`relative inline-flex h-4.5 w-9 items-center rounded-full transition-colors ${ctx.imageFullBleed ? 'bg-violet-600' : 'bg-slate-800'}`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${ctx.imageFullBleed ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          {!ctx.imageFullBleed && (
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-300">Largura Máxima da Imagem</label>
                <span className="text-xs font-mono font-bold text-violet-400">{ctx.imageWidth}%</span>
              </div>
              <input type="range" min="30" max="100" value={ctx.imageWidth} onChange={(e) => ctx.setImageWidth(parseInt(e.target.value))} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Encaixe Visual</label>
              <select value={ctx.imageFit} onChange={(e) => ctx.setImageFit(e.target.value as any)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 outline-none font-bold">
                <option value="cover">Preencher</option>
                <option value="contain">Conter tudo</option>
                <option value="fill">Esticar</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Posição Vertical</label>
              <select value={ctx.imagePosition} onChange={(e) => ctx.setImagePosition(e.target.value as any)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 outline-none font-bold">
                <option value="top">No Topo</option>
                <option value="middle">No Meio</option>
                <option value="bottom">Na Base</option>
              </select>
            </div>
          </div>
          
          {!ctx.imageFullBleed && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Alinhamento Horizontal da Imagem</label>
              <div className="grid grid-cols-3 gap-2">
                {['left', 'center', 'right'].map((align) => (
                  <button
                    key={align}
                    type="button"
                    onClick={() => ctx.setImageAlign(align as any)}
                    className={`text-[10px] font-bold px-3 py-2 rounded-2xl border capitalize ${ctx.imageAlign === align ? 'bg-violet-600 text-white border-violet-500' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'}`}
                  >
                    {align === 'left' ? 'Esquerda' : align === 'right' ? 'Direita' : 'Centro'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <hr className="border-slate-850" />

      {/* 5. CTA Principal */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-violet-400 uppercase tracking-widest flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-violet-400" />
          Chamada para Ação (CTA)
        </h3>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Texto do Botão</label>
          <input 
            type="text" 
            value={ctx.ctaText}
            onChange={(e) => ctx.setCtaText(e.target.value)}
            className="w-full bg-slate-950 border border-slate-850 focus:border-violet-500 rounded-xl px-3 py-2.5 text-xs text-slate-200 transition-all outline-none font-black tracking-wider uppercase"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-2 text-violet-400 font-bold text-xs"><LinkIcon width={15}/>Link de destino</label>
          <input 
            type="url" 
            value={ctx.ctaLink}
            onChange={(e) => ctx.setCtaLink(e.target.value)}
            className="w-full bg-slate-950 border border-slate-850 focus:border-violet-500 rounded-xl px-3 py-2 text-xs text-slate-200 transition-all outline-none font-mono text-[11px]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Cor do CTA</label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {ctaColorPresets.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => ctx.setCtaColor(color.value)}
                className="p-1.5 cursor-pointer rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-900 flex items-center gap-1.5"
              >
                <span className="w-3 h-3 rounded-full block" style={{ backgroundColor: color.value }}></span>
                <span className="text-[9px] font-bold text-slate-400">{color.name}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-slate-800 flex-shrink-0">
              <input type="color" value={ctx.ctaColor} onChange={(e) => ctx.setCtaColor(e.target.value)} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 cursor-pointer" />
            </div>
            <input type="text" value={ctx.ctaColor} onChange={(e) => ctx.setCtaColor(e.target.value)} className="flex-grow bg-slate-950 border border-slate-850 focus:border-violet-500 rounded-xl px-3 py-2 text-xs text-slate-200 transition-all outline-none font-mono uppercase" />
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">Tamanho do Botão</label>
            <div className="grid grid-cols-3 gap-2">
              {(['small', 'medium', 'large'] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => ctx.setCtaSize(size)}
                  className={`text-[10px] font-bold px-3 py-2 rounded-xl border capitalize ${ctx.ctaSize === size ? 'bg-violet-600 text-white border-violet-500' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'}`}
                >
                  {size === 'small' ? 'Pequeno' : size === 'medium' ? 'Médio' : 'Grande'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-300">Largura do Botão</label>
              <span className="text-xs font-mono font-bold text-violet-400">{ctx.ctaWidth}%</span>
            </div>
            <input 
              type="range" 
              min="20" 
              max="100" 
              value={ctx.ctaWidth} 
              onChange={(e) => ctx.setCtaWidth(parseInt(e.target.value))} 
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500" 
            />
          </div>
        </div>
      </div>

      <hr className="border-slate-850" />

      {/* 6. Extras (Aviso, Timer, FAQ, Badge) */}
      <div className="space-y-4">
        {/* Aviso */}
        <div className="border border-slate-850 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[10px] font-black text-violet-400 uppercase tracking-widest flex items-center gap-1.5">
              <Layout className="w-3.5 h-3.5 text-violet-400" /> Aviso Superior
            </h3>
            <button type="button" onClick={() => ctx.setAvisoEnabled(!ctx.avisoEnabled)} className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${ctx.avisoEnabled ? 'bg-violet-600' : 'bg-slate-800'}`}>
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${ctx.avisoEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>
          {ctx.avisoEnabled && (
            <div className="space-y-3">
              <input type="text" value={ctx.avisoTopo} onChange={(e) => ctx.setAvisoTopo(e.target.value)} placeholder="ATENÇÃO: Vagas acabando!" className="w-full bg-slate-950 border border-slate-850 focus:border-violet-500 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none" />
              <div className="grid grid-cols-2 gap-3">
                <select value={ctx.avisoWidth} onChange={(e) => ctx.setAvisoWidth(e.target.value as any)} className="w-full bg-slate-950 border border-slate-850 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 outline-none">
                  <option value="full">Largura Total</option>
                  <option value="card">Mesma do Card</option>
                </select>
                <select value={ctx.avisoPosition} onChange={(e) => ctx.setAvisoPosition(e.target.value as any)} className="w-full bg-slate-950 border border-slate-850 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 outline-none">
                  <option value="sticky">Fixo no Topo</option>
                  <option value="top-card">Topo do Card</option>
                </select>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {avisoColorPresets.map((preset) => (
                  <button key={preset.name} type="button" onClick={() => { ctx.setAvisoBgColor(preset.bg); ctx.setAvisoTextColor(preset.text); }} className="p-1 rounded-lg border border-slate-800 bg-slate-900 text-[9px] flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full block border border-white/10" style={{ backgroundColor: preset.bg }}></span>
                    <span className="text-slate-400">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Badge */}
        <div className="border border-slate-850 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[10px] font-black text-violet-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" /> Selo (Badge)
            </h3>
            <button type="button" onClick={() => ctx.setBadgeEnabled(!ctx.badgeEnabled)} className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${ctx.badgeEnabled ? 'bg-violet-600' : 'bg-slate-800'}`}>
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${ctx.badgeEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>
          {ctx.badgeEnabled && (
            <div className="space-y-3">
              <input type="text" value={ctx.badgeText} onChange={(e) => ctx.setBadgeText(e.target.value)} placeholder="MÉTODO NOVO" className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none" />
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-850 rounded-lg p-1"><input type="color" value={ctx.badgeBgColor} onChange={(e) => ctx.setBadgeBgColor(e.target.value)} className="w-5 h-5 rounded border-none bg-transparent" /> <input type="text" value={ctx.badgeBgColor} onChange={(e) => ctx.setBadgeBgColor(e.target.value)} className="w-full bg-transparent text-[10px] font-mono outline-none" /></div>
                <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-850 rounded-lg p-1"><input type="color" value={ctx.badgeTextColor} onChange={(e) => ctx.setBadgeTextColor(e.target.value)} className="w-5 h-5 rounded border-none bg-transparent" /> <input type="text" value={ctx.badgeTextColor} onChange={(e) => ctx.setBadgeTextColor(e.target.value)} className="w-full bg-transparent text-[10px] font-mono outline-none" /></div>
              </div>
            </div>
          )}
        </div>

        {/* Timer */}
        <div className="border border-slate-850 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[10px] font-black text-violet-400 uppercase tracking-widest flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5 text-violet-400" /> Timer Regressivo
            </h3>
            <button type="button" onClick={() => ctx.setTimerEnabled(!ctx.timerEnabled)} className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${ctx.timerEnabled ? 'bg-violet-600' : 'bg-slate-800'}`}>
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${ctx.timerEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>
          {ctx.timerEnabled && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-[10px] text-slate-400 mb-1">Texto do Timer</label>
                  <input type="text" value={ctx.timerText} onChange={(e) => ctx.setTimerText(e.target.value)} className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Duração (Min)</label>
                  <input type="number" min="1" max="180" value={ctx.timerDuration} onChange={(e) => ctx.setTimerDuration(Math.max(1, parseInt(e.target.value) || 15))} className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none font-mono" />
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {timerColorPresets.map((preset) => (
                  <button key={preset.name} type="button" onClick={() => { ctx.setTimerBgColor(preset.bg); ctx.setTimerTextColor(preset.text); }} className="p-1 rounded-lg border border-slate-800 bg-slate-900 text-[9px] flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-md block border border-white/10" style={{ backgroundColor: preset.bg }}></span>
                    <span className="text-slate-400">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FAQ */}
        <div className="border border-slate-850 rounded-2xl p-4">
          <h3 className="text-[10px] font-black text-violet-400 uppercase tracking-widest flex items-center gap-1.5 mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-violet-400" /> Perguntas Frequentes
          </h3>
          <div className="bg-slate-950 border border-slate-850 p-3.5 rounded-2xl flex flex-col gap-3 mb-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1">Pergunta</label>
              <input type="text" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} className="w-full bg-slate-900 border border-slate-850 rounded-lg px-2.5 py-3.5 text-xs text-slate-200 outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1">Resposta (Aceita Markdown)</label>
              <textarea rows={6} value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} className="w-full bg-slate-900 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none resize-none leading-relaxed" />
            </div>
            <button type="button" onClick={handleAddFaqItem} className="bg-violet-600/20 cursor-pointer hover:bg-violet-600/40 text-violet-400 border border-violet-500/30 font-bold text-xs py-1.5 px-3 rounded-xl transition-all self-end flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Adicionar FAQ
            </button>
          </div>
          
          {ctx.faqList.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-850 mb-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-slate-300">Tam. Pergunta</span>
                    <span className="text-xs text-violet-400 font-mono font-bold">{ctx.faqFontSize}px</span>
                  </div>
                  <input type="range" min="10" max="24" value={ctx.faqFontSize} onChange={(e) => ctx.setFaqFontSize(parseInt(e.target.value))} className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-violet-500" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-slate-300">Tam. Resposta</span>
                    <span className="text-xs text-violet-400 font-mono font-bold">{ctx.faqAnswerFontSize}px</span>
                  </div>
                  <input type="range" min="10" max="24" value={ctx.faqAnswerFontSize} onChange={(e) => ctx.setFaqAnswerFontSize(parseInt(e.target.value))} className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-violet-500" />
                </div>
              </div>
              
              <div className="space-y-2 max-h-[160px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-850 pr-1">
                {ctx.faqList.map((item, index) => (
                  <div key={index} className="bg-slate-950/50 border border-slate-850 rounded-xl p-2.5 flex items-start justify-between gap-2.5">
                    <div className="flex-grow min-w-0">
                      <h4 className="text-xs font-extrabold text-slate-200 truncate">{item.question}</h4>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">{item.answer}</p>
                    </div>
                    <button type="button" onClick={() => handleRemoveFaqItem(index)} className="p-1 cursor-pointer rounded hover:bg-red-950/45 text-slate-500 hover:text-red-400 transition-colors flex-shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-2 pt-4 border-t border-slate-850 flex gap-2">
        <button type="button" onClick={ctx.handleSavePresell} className="flex cursor-pointer justify-center items-center gap-4 grow bg-violet-600 hover:bg-violet-500 text-white font-black text-xs md:text-sm py-3 px-4 rounded-xl transition-all shadow-lg shadow-violet-600/20 active:scale-[0.98]">
          <SaveIcon/> SALVAR PROJETO
        </button>
        <button
          type="button"
          onClick={() => {
            if (confirm("Deseja voltar para os estilos básicos do tema?")) {
              ctx.setThemeColor('#0b0f19');
              ctx.setTextColor('#ffffff');
              ctx.setCtaColor('#22c55e');
              ctx.setBorderRadius(16);
              ctx.setHasImageBorder(true);
              ctx.setFontSizeTitulo(28);
              ctx.setFontSizeSubtitulo(14);
              ctx.setCtaSize('large');
              ctx.setCtaWidth(100);
              ctx.showToast('Estilos básicos restaurados.');
            }
          }}
          className="bg-slate-950 cursor-pointer hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800 rounded-xl px-3 py-3 transition-all"
        >
          <RotateCcw className="w-4.5 h-4.5" />
        </button>
      </div>

    </div>
  );
}
