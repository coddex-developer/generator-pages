'use client';

import React, { useRef } from 'react';
import { Award, Bold, BookOpen, CheckCircle2, ChevronDown, CreditCard, Crown, Gift, Globe2, HeartHandshake, Home, Italic, LockKeyhole, Mail, MessageCircle, Paintbrush, Phone, PlayCircle, Rocket, Search, Settings, ShieldCheck, ShoppingCart, SlidersHorizontal, Layout, Sparkles, FileText, HelpCircle, ImageIcon, Timer, Palette, Plus, Trash2, RotateCcw, SaveIcon, LinkIcon, Star, Strikethrough, Target, TrendingUp, Users, Zap } from 'lucide-react';
import { usePresell } from '../context/PresellContext';
import type { CtaEffect, FooterStyle, HeaderMenuItem, Presell, PresellIcon, TimerStyle } from '../types/presell';

type Alignment = Presell['contentAlignment'];
type ImageFit = Presell['imageFit'];
type ImagePosition = Presell['imagePosition'];
type ImageAlign = Presell['imageAlign'];
type NoticeWidth = Presell['avisoWidth'];
type NoticePosition = Presell['avisoPosition'];

const menuIconOptions: Array<{ value: PresellIcon; label: string; terms: string; Icon: React.ComponentType<{ className?: string }> }> = [
  { value: 'home', label: 'Casa', terms: 'inicio home principal', Icon: Home },
  { value: 'star', label: 'Destaque', terms: 'estrela premium favorito destaque', Icon: Star },
  { value: 'shield', label: 'Garantia', terms: 'seguranca garantia protecao', Icon: ShieldCheck },
  { value: 'cart', label: 'Compra', terms: 'carrinho checkout compra oferta', Icon: ShoppingCart },
  { value: 'phone', label: 'Telefone', terms: 'contato telefone suporte', Icon: Phone },
  { value: 'mail', label: 'Email', terms: 'email mensagem contato', Icon: Mail },
  { value: 'check', label: 'Check', terms: 'confirmado aprovado validado', Icon: CheckCircle2 },
  { value: 'zap', label: 'Rapido', terms: 'energia rapido urgencia raio', Icon: Zap },
  { value: 'gift', label: 'Bonus', terms: 'presente bonus brinde', Icon: Gift },
  { value: 'book', label: 'Conteudo', terms: 'livro aula conteudo guia', Icon: BookOpen },
  { value: 'users', label: 'Comunidade', terms: 'pessoas comunidade alunos', Icon: Users },
  { value: 'lock', label: 'Seguro', terms: 'cadeado seguro privacidade', Icon: LockKeyhole },
  { value: 'message', label: 'Mensagem', terms: 'chat whatsapp mensagem', Icon: MessageCircle },
  { value: 'play', label: 'Video', terms: 'play video vsl assistir', Icon: PlayCircle },
  { value: 'card', label: 'Pagamento', terms: 'cartao pagamento checkout', Icon: CreditCard },
  { value: 'globe', label: 'Global', terms: 'mundo global site', Icon: Globe2 },
  { value: 'award', label: 'Premio', terms: 'premio certificado autoridade', Icon: Award },
  { value: 'heart', label: 'Confianca', terms: 'coracao confianca cuidado', Icon: HeartHandshake },
  { value: 'crown', label: 'Premium', terms: 'coroa premium elite', Icon: Crown },
  { value: 'target', label: 'Objetivo', terms: 'alvo objetivo foco', Icon: Target },
  { value: 'trending', label: 'Crescimento', terms: 'crescimento grafico crescimento resultado', Icon: TrendingUp },
  { value: 'rocket', label: 'Lancamento', terms: 'lancamento foguete lancamento acelerar', Icon: Rocket }
];

const ctaEffects: Array<{ value: CtaEffect; label: string; description: string }> = [
  { value: 'shine', label: 'Brilho premium', description: 'Luz atravessando o botao.' },
  { value: 'pulse', label: 'Pulso', description: 'Urgencia sutil e constante.' },
  { value: 'float', label: 'Flutuante', description: 'Movimento vertical suave.' },
  { value: 'glow', label: 'Glow', description: 'Aura luminosa ao redor.' }
];

const footerStyles: Array<{ value: FooterStyle; label: string }> = [
  { value: 'glass', label: 'Glass premium' },
  { value: 'brand', label: 'Marca forte' },
  { value: 'split', label: 'Split profissional' },
  { value: 'minimal', label: 'Minimalista' }
];

const timerStyles: Array<{ value: TimerStyle; label: string }> = [
  { value: 'classic', label: 'Clássico' },
  { value: 'cards', label: 'Cards premium' },
  { value: 'glass', label: 'Glass' },
  { value: 'urgency', label: 'Urgência' }
];

const editorNavItems: Array<{ href: string; label: string; Icon: React.ComponentType<{ className?: string }> }> = [
  { href: '#editor-structure', label: 'Estrutura', Icon: Layout },
  { href: '#editor-theme', label: 'Tema', Icon: SlidersHorizontal },
  { href: '#editor-copy', label: 'Textos', Icon: FileText },
  { href: '#editor-media', label: 'Midia', Icon: ImageIcon },
  { href: '#editor-cta', label: 'CTA', Icon: Palette },
  { href: '#editor-conversion', label: 'Conversao', Icon: Sparkles },
  { href: '#editor-extras', label: 'Extras', Icon: Timer },
  { href: '#editor-seo', label: 'SEO', Icon: Rocket }
];

function MarkdownButtons({ onInsert }: { onInsert: (tag: string) => void }) {
  return (
    <div className="flex gap-1.5">
      <button type="button" onClick={() => onInsert('bold')} className="cursor-pointer bg-slate-950 hover:bg-slate-850 text-slate-300 p-1.5 rounded border border-slate-800" title="Negrito"><Bold className="w-3 h-3" /></button>
      <button type="button" onClick={() => onInsert('italic')} className="cursor-pointer bg-slate-950 hover:bg-slate-850 text-slate-300 p-1.5 rounded border border-slate-800" title="Itálico"><Italic className="w-3 h-3" /></button>
      <button type="button" onClick={() => onInsert('strike')} className="cursor-pointer bg-slate-950 hover:bg-slate-850 text-slate-300 p-1.5 rounded border border-slate-800" title="Taxado"><Strikethrough className="w-3 h-3" /></button>
      <button type="button" onClick={() => onInsert('link')} className="cursor-pointer bg-slate-950 hover:bg-slate-850 text-blue-400 p-1.5 rounded border border-slate-800" title="Link"><LinkIcon className="w-3 h-3" /></button>
      <button type="button" onClick={() => onInsert('color')} className="cursor-pointer bg-slate-950 hover:bg-slate-850 text-violet-400 p-1.5 rounded border border-slate-800" title="Cor"><Paintbrush className="w-3 h-3" /></button>
    </div>
  );
}

export function EditorPanel({
  setMarkdownHelpOpen,
  onRequestSave,
  onRequestReset
}: {
  setMarkdownHelpOpen: (v: boolean) => void;
  onRequestSave: () => void;
  onRequestReset: () => void;
}) {
  const ctx = usePresell();
  
  const tituloRef = useRef<HTMLTextAreaElement>(null);
  const subtituloRef = useRef<HTMLTextAreaElement>(null);
  const footerRef = useRef<HTMLTextAreaElement>(null);
  const seoDescRef = useRef<HTMLTextAreaElement>(null);
  const faqAnswerRef = useRef<HTMLTextAreaElement>(null);
  const ctaSupportRef = useRef<HTMLTextAreaElement>(null);
  const benefitsRef = useRef<HTMLTextAreaElement>(null);
  const trustItemsRef = useRef<HTMLTextAreaElement>(null);
  const guaranteeTextRef = useRef<HTMLTextAreaElement>(null);

  const [newQuestion, setNewQuestion] = React.useState('');
  const [newAnswer, setNewAnswer] = React.useState('');
  const [iconPickerFor, setIconPickerFor] = React.useState<string | null>(null);
  const [iconSearch, setIconSearch] = React.useState('');
  const [themePaletteOpen, setThemePaletteOpen] = React.useState(false);
  const [ctaPaletteOpen, setCtaPaletteOpen] = React.useState(false);
  const [noticePaletteOpen, setNoticePaletteOpen] = React.useState(false);
  const [timerPaletteOpen, setTimerPaletteOpen] = React.useState(false);

  const themePresets = [
    { name: 'Slate Noturno', value: '#0b0f19' },
    { name: 'Obsidiana Escura', value: '#020617' },
    { name: 'Roxo Galaxy', value: 'linear-gradient(135deg, #12072b 0%, #03000a 100%)' },
    { name: 'Esmeralda Negra', value: 'linear-gradient(135deg, #021a11 0%, #000403 100%)' },
    { name: 'Vinho Royal', value: 'linear-gradient(135deg, #210212 0%, #050003 100%)' },
    { name: 'Minimalista Claro', value: '#f8fafc', isLight: true },
    { name: 'Gelo Sofisticado', value: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)', isLight: true },
    { name: 'Champanhe Premium', value: 'linear-gradient(135deg, #fafaf9 0%, #f5f5f4 100%)', isLight: true },
    { name: 'Google Clean', value: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 55%, #dbeafe 100%)', isLight: true },
    { name: 'Ads Blue', value: 'linear-gradient(135deg, #07111f 0%, #0f3b68 100%)' },
    { name: 'Carbon Gold', value: 'linear-gradient(135deg, #0f0f0f 0%, #2a2113 100%)' },
    { name: 'Neon Mint', value: 'linear-gradient(135deg, #021b1a 0%, #063b33 100%)' },
    { name: 'Google Premium', value: 'linear-gradient(135deg, #f8fbff 0%, #eaf2ff 42%, #ffffff 100%)', isLight: true },
    { name: 'Apple Clean', value: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 45%, #e5e7eb 100%)', isLight: true },
    { name: 'Black Pearl', value: 'linear-gradient(135deg, #030712 0%, #111827 42%, #000000 100%)' },
    { name: 'Deep Indigo', value: 'linear-gradient(135deg, #09090b 0%, #1e1b4b 50%, #020617 100%)' },
    { name: 'Emerald Ads', value: 'linear-gradient(135deg, #001510 0%, #064e3b 55%, #020617 100%)' },
    { name: 'Ruby Offer', value: 'linear-gradient(135deg, #19040a 0%, #7f1d1d 55%, #020617 100%)' },
    { name: 'Ocean Trust', value: 'linear-gradient(135deg, #02111f 0%, #075985 60%, #020617 100%)' },
    { name: 'Platinum', value: 'linear-gradient(135deg, #f9fafb 0%, #e5e7eb 55%, #f8fafc 100%)', isLight: true },
  ];

  const ctaColorPresets = [
    { name: 'Verde Zap', value: '#22c55e' },
    { name: 'Vermelho VSL', value: '#ef4444' },
    { name: 'Azul Seguro', value: '#3b82f6' },
    { name: 'Laranja Quente', value: '#f97316' },
    { name: 'Roxo Premium', value: '#a855f7' },
    { name: 'Rosa Vibrante', value: '#ec4899' },
    { name: 'Azul Google', value: '#2563eb' },
    { name: 'Preto Luxo', value: '#111827' },
    { name: 'Dourado', value: '#d97706' },
    { name: 'Ciano Trust', value: '#06b6d4' },
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

    const before = value.substring(0, start);
    const after = value.substring(end, value.length);
    const selected = value.substring(start, end);

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

  const insertMarkdownFor = (
    tag: string,
    textarea: HTMLTextAreaElement | null,
    value: string,
    setter: (nextValue: string) => void
  ) => {
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = value.substring(0, start);
    const after = value.substring(end);
    const selected = value.substring(start, end);
    const inserted =
      tag === 'bold' ? `**${selected || 'texto'}**` :
      tag === 'italic' ? `*${selected || 'texto'}*` :
      tag === 'strike' ? `~~${selected || 'texto'}~~` :
      tag === 'link' ? `[${selected || 'texto do link'}](https://)` :
      `[${selected || 'texto'}]{#22c55e}`;
    setter(before + inserted + after);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + inserted.length, start + inserted.length);
    }, 50);
  };

  const handleAddFaqItem = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      ctx.showToast('Preencha a pergunta e resposta para adicionar.');
      return;
    }
    const updatedFaq = [...ctx.faqList, { question: newQuestion.trim(), answer: newAnswer.trim() }];
    ctx.setFaqList(updatedFaq);
    setNewQuestion('');
    setNewAnswer('');
    ctx.showToast('FAQ adicionado.');
  };

  const handleRemoveFaqItem = (index: number) => {
    const updatedFaq = ctx.faqList.filter((_, i) => i !== index);
    ctx.setFaqList(updatedFaq);
  };

  const updateHeaderMenuItem = (id: string, patch: Partial<HeaderMenuItem>) => {
    ctx.setHeaderMenuItems(ctx.headerMenuItems.map((item) => item.id === id ? { ...item, ...patch } : item));
  };

  const addHeaderMenuItem = () => {
    if (ctx.headerMenuItems.length >= 4) return;
    ctx.setHeaderMenuItems([
      ...ctx.headerMenuItems,
      { id: `menu_${Date.now()}`, label: '', url: '#offer', icon: 'star' }
    ]);
  };

  const filteredIconOptions = menuIconOptions.filter((item) => item.terms.includes(iconSearch.trim().toLowerCase()));
  const getIconOption = (icon: PresellIcon) => menuIconOptions.find((item) => item.value === icon) || menuIconOptions[1];
  const sectionClass = 'relative scroll-mt-28 space-y-4 rounded-[28px] border border-slate-800/90 bg-slate-950/55 p-4 shadow-inner shadow-black/10';
  const activeBlocksCount = [
    ctx.headerEnabled,
    ctx.footerEnabled,
    ctx.benefitsEnabled,
    ctx.trustEnabled,
    ctx.guaranteeEnabled,
    ctx.avisoEnabled,
    ctx.badgeEnabled,
    ctx.timerEnabled,
    ctx.faqList.length > 0
  ].filter(Boolean).length;
  const seoReady = Boolean(ctx.seoTitle.trim() && ctx.seoDescription.trim());

  const renderIconPicker = (
    pickerId: string,
    currentIcon: PresellIcon,
    onSelect: (icon: PresellIcon) => void
  ) => {
    const CurrentIcon = getIconOption(currentIcon).Icon;
    const isOpen = iconPickerFor === pickerId;

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setIconPickerFor(isOpen ? null : pickerId);
            setIconSearch('');
          }}
          className="cursor-pointer inline-flex w-full items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-[10px] font-black text-slate-300 hover:border-violet-500/50 hover:text-white"
        >
          <span className="inline-flex items-center gap-2">
            <CurrentIcon className="h-3.5 w-3.5 text-violet-400" />
            Icone
          </span>
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-[calc(100%+8px)] z-40 w-72 rounded-2xl border border-slate-800 bg-slate-950 p-3 shadow-2xl shadow-black/40">
            <div className="mb-2 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-2.5 py-2">
              <Search className="h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                value={iconSearch}
                onChange={(event) => setIconSearch(event.target.value)}
                placeholder="Buscar icone..."
                className="w-full bg-transparent text-xs text-slate-200 outline-none placeholder:text-slate-600"
              />
            </div>
            <div className="grid max-h-64 grid-cols-2 gap-1.5 overflow-y-auto pr-1">
              {filteredIconOptions.map(({ value, label, Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    onSelect(value);
                    setIconPickerFor(null);
                    setIconSearch('');
                  }}
                  className={`cursor-pointer flex items-center gap-2 rounded-xl border px-2 py-2 text-left text-[10px] font-bold ${
                    currentIcon === value
                      ? 'border-violet-500 bg-violet-600 text-white'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative isolate flex flex-col gap-4 overflow-visible rounded-[32px] border border-slate-800/90 bg-slate-900/95 p-3 shadow-2xl shadow-black/30 md:p-5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-36 rounded-[32px] bg-gradient-to-b from-violet-500/10 via-slate-950/20 to-transparent" />

      <div className="relative overflow-hidden rounded-[28px] border border-slate-800/80 bg-slate-950/80 p-4 shadow-xl shadow-black/20 backdrop-blur">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-violet-500/30 bg-violet-500/15 text-violet-300 shadow-lg shadow-violet-950/30">
              <Settings className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.22em] text-violet-200">
                  Editor premium
                </span>
                <span className="rounded-full border border-slate-800 bg-slate-900 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
                  {ctx.lang === 'pt' ? 'PT-BR' : 'EN'}
                </span>
              </div>
              <h2 className="text-lg font-black text-white md:text-xl">Configurar Presell</h2>
              <p className="mt-1 max-w-xl text-[11px] leading-relaxed text-slate-400">
                Controles organizados por estrutura, visual, textos, conversao e SEO para manter a edicao rapida e profissional.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 lg:justify-end">
            {ctx.activeId && (
              <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 font-mono text-[10px] font-bold text-slate-400">
                ID {ctx.activeId.slice(-6)}
              </span>
            )}
            <span className={`rounded-full border px-3 py-1.5 text-[10px] font-black ${seoReady ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-amber-500/30 bg-amber-500/10 text-amber-300'}`}>
              {seoReady ? 'SEO pronto' : 'SEO pendente'}
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">Blocos ativos</p>
            <p className="mt-1 text-lg font-black text-white">{activeBlocksCount}/9</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">Menu</p>
            <p className="mt-1 text-lg font-black text-white">{ctx.headerMenuItems.length}/4</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">FAQ</p>
            <p className="mt-1 text-lg font-black text-white">{ctx.faqList.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">CTA</p>
            <p className="mt-1 truncate text-sm font-black text-white">{ctx.ctaLink ? 'Link ativo' : 'Sem link'}</p>
          </div>
        </div>
      </div>

      <nav className="relative sticky top-2 z-30 -mx-1 overflow-x-auto rounded-2xl border border-slate-800/80 bg-slate-950/90 p-1.5 shadow-xl shadow-black/20 backdrop-blur">
        <div className="flex min-w-max items-center gap-1.5">
          {editorNavItems.map(({ href, label, Icon }) => (
            <a
              key={href}
              href={href}
              className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-transparent px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-slate-400 transition-all hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-white"
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </a>
          ))}
        </div>
      </nav>

      {/* 1. Header & Footer (Estrutura Externa) */}
      <div id="editor-structure" className={sectionClass}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-[10px] font-black text-violet-400 uppercase tracking-widest flex items-center gap-1.5">
            <Layout className="w-3.5 h-3.5 text-violet-400" />
            Header & Footer
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-bold">Header ativo:</span>
            <button
              type="button"
              onClick={() => ctx.setHeaderEnabled(!ctx.headerEnabled)}
              className={`relative inline-flex h-5 w-10 cursor-pointer items-center rounded-full transition-colors ${ctx.headerEnabled ? 'bg-violet-600' : 'bg-slate-800'}`}
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
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <label className="block text-xs font-bold text-slate-300">Itens do menu</label>
                  <button type="button" onClick={addHeaderMenuItem} disabled={ctx.headerMenuItems.length >= 4} className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-violet-500/30 bg-violet-600/15 px-2 py-1 text-[10px] font-black text-violet-300 disabled:cursor-not-allowed disabled:opacity-40">
                    <Plus className="w-3 h-3" /> Adicionar
                  </button>
                </div>
                <div className="grid gap-2">
                  {ctx.headerMenuItems.slice(0, 4).map((item, index) => (
                    <div key={item.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-2.5 space-y-2">
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto]">
                        <input type="text" value={item.label} onChange={(e) => updateHeaderMenuItem(item.id, { label: e.target.value })} placeholder={`Menu ${index + 1}`} className="min-w-0 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200 outline-none" />
                        <input type="text" value={item.url} onChange={(e) => updateHeaderMenuItem(item.id, { url: e.target.value })} placeholder="https:// ou #secao" className="min-w-0 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200 outline-none" />
                        <button type="button" onClick={() => ctx.setHeaderMenuItems(ctx.headerMenuItems.filter((entry) => entry.id !== item.id))} className="cursor-pointer rounded-xl bg-slate-950 p-2 text-slate-500 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {renderIconPicker(`header-${item.id}`, item.icon, (icon) => updateHeaderMenuItem(item.id, { icon }))}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
              <span className="text-xs font-bold text-slate-300">Footer ativo:</span>
              <button
                type="button"
                onClick={() => ctx.setFooterEnabled(!ctx.footerEnabled)}
                className={`relative inline-flex h-5 w-10 cursor-pointer items-center rounded-full transition-colors ${ctx.footerEnabled ? 'bg-violet-600' : 'bg-slate-800'}`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${ctx.footerEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>
            
            {ctx.footerEnabled && (
              <>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Estilo do Footer</label>
                    <select value={ctx.footerStyle} onChange={(e) => ctx.setFooterStyle(e.target.value as FooterStyle)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200 outline-none">
                      {footerStyles.map((style) => (
                        <option key={style.value} value={style.value}>{style.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Icone do Footer</label>
                    {renderIconPicker('footer-icon', ctx.footerIcon, ctx.setFooterIcon)}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Marca no Footer</label>
                  <input
                    type="text"
                    value={ctx.footerBrand}
                    onChange={(e) => ctx.setFooterBrand(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Texto do Footer</label>
                  <div className="mb-1">
                    <MarkdownButtons onInsert={(tag) => insertMarkdownFor(tag, footerRef.current, ctx.footerText, ctx.setFooterText)} />
                  </div>
                  <textarea
                    ref={footerRef}
                    rows={2}
                    value={ctx.footerText}
                    onChange={(e) => ctx.setFooterText(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-3 py-2 text-xs text-slate-200 outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Links do Footer (Markdown)</label>
                  <textarea
                    rows={2}
                    value={ctx.footerLinksRaw}
                    onChange={(e) => ctx.setFooterLinksRaw(e.target.value)}
                    placeholder="[Privacidade](#) | [Termos](#) | [Contato](#)"
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-3 py-2 text-xs text-slate-200 outline-none resize-none"
                  />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mt-2">
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

      <div className="h-px bg-gradient-to-r from-transparent via-slate-800/70 to-transparent" />

      {/* 2. Tema Geral (Cores) */}
      <div id="editor-theme" className={sectionClass}>
        <h3 className="text-[10px] font-black text-violet-400 uppercase tracking-widest flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-violet-400" />
          Fundo & Estilo Base
        </h3>

        <div>
          <button
            type="button"
            onClick={() => setThemePaletteOpen(!themePaletteOpen)}
            className="mb-2.5 flex w-full cursor-pointer items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs font-black text-slate-200 hover:border-violet-500/50"
          >
            <span className="inline-flex items-center gap-2">
              <Palette className="h-4 w-4 text-violet-400" />
              Ver temas disponiveis
            </span>
            <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${themePaletteOpen ? 'rotate-180' : ''}`} />
          </button>

          {themePaletteOpen && (
            <div className="grid grid-cols-1 gap-1.5 mb-2.5 rounded-2xl border border-slate-850 bg-slate-950 p-2 sm:grid-cols-2">
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
                      : 'bg-slate-900 border-slate-850 text-slate-400 hover:bg-slate-850'
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
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
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

            <div className="sm:w-1/3">
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
            {(['left', 'center', 'right'] as Alignment[]).map((align) => (
              <button
                key={align}
                type="button"
                onClick={() => ctx.setContentAlignment(align)}
                className={`text-[10px] cursor-pointer font-bold px-3 py-2 rounded-2xl border capitalize ${ctx.contentAlignment === align ? 'bg-violet-600 text-white border-violet-500' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'}`}
              >
                {align === 'left' ? 'Esquerda' : align === 'right' ? 'Direita' : 'Centro'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-slate-800/70 to-transparent" />

      {/* 3. Textos Principais e Markdown */}
      <div id="editor-copy" className={sectionClass}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-[10px] font-black text-violet-400 uppercase tracking-widest flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-violet-400" />
            Headline e Textos Principais
          </h3>
          <button
            type="button"
            onClick={() => setMarkdownHelpOpen(true)}
            className="flex cursor-pointer items-center gap-1 text-[10px] font-bold text-violet-400 hover:text-violet-300"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Guia de Markdown
          </button>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-bold text-slate-300">Título Principal <span className="text-red-500">*</span></label>
            <div className="flex gap-1.5">
              <button type="button" onClick={() => insertMarkdown('bold', 'titulo')} className="cursor-pointer bg-slate-950 hover:bg-slate-850 text-slate-300 px-1.5 py-0.5 rounded text-[10px] font-bold border border-slate-800" title="Negrito">B</button>
              <button type="button" onClick={() => insertMarkdown('italic', 'titulo')} className="cursor-pointer bg-slate-950 hover:bg-slate-850 text-slate-300 px-1.5 py-0.5 rounded text-[10px] italic border border-slate-800" title="Itálico">I</button>
              <button type="button" onClick={() => insertMarkdown('strike', 'titulo')} className="cursor-pointer bg-slate-950 hover:bg-slate-850 text-slate-300 px-1.5 py-0.5 rounded text-[10px] line-through border border-slate-800" title="Taxado">S</button>
              <button type="button" onClick={() => insertMarkdown('link', 'titulo')} className="cursor-pointer bg-slate-950 hover:bg-slate-850 text-blue-400 px-1.5 py-0.5 rounded text-[10px] font-bold border border-slate-800" title="Link"><LinkIcon className="w-3 h-3" /></button>
              <button type="button" onClick={() => insertMarkdown('color', 'titulo')} className="cursor-pointer bg-slate-950 hover:bg-slate-850 text-violet-400 px-1.5 py-0.5 rounded text-[10px] font-bold border border-slate-800" title="Colorir com Paleta"><Paintbrush className="w-3 h-3" /></button>
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
              <button type="button" onClick={() => insertMarkdown('bold', 'subtitulo')} className="cursor-pointer bg-slate-950 hover:bg-slate-850 text-slate-300 px-1.5 py-0.5 rounded text-[10px] font-bold border border-slate-800" title="Negrito">B</button>
              <button type="button" onClick={() => insertMarkdown('italic', 'subtitulo')} className="cursor-pointer bg-slate-950 hover:bg-slate-850 text-slate-300 px-1.5 py-0.5 rounded text-[10px] italic border border-slate-800" title="Itálico">I</button>
              <button type="button" onClick={() => insertMarkdown('strike', 'subtitulo')} className="cursor-pointer bg-slate-950 hover:bg-slate-850 text-slate-300 px-1.5 py-0.5 rounded text-[10px] line-through border border-slate-800" title="Taxado">S</button>
              <button type="button" onClick={() => insertMarkdown('link', 'subtitulo')} className="cursor-pointer bg-slate-950 hover:bg-slate-850 text-blue-400 px-1.5 py-0.5 rounded text-[10px] font-bold border border-slate-800" title="Link"><LinkIcon className="w-3 h-3" /></button>
              <button type="button" onClick={() => insertMarkdown('color', 'subtitulo')} className="cursor-pointer bg-slate-950 hover:bg-slate-850 text-violet-400 px-1.5 py-0.5 rounded text-[10px] font-bold border border-slate-800" title="Colorir Texto"><Paintbrush className="w-3 h-3" /></button>
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

        <div className="grid grid-cols-1 gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-850 sm:grid-cols-2">
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

      <div className="h-px bg-gradient-to-r from-transparent via-slate-800/70 to-transparent" />

      {/* 4. Mídia e Posicionamento Visual */}
      <div id="editor-media" className={sectionClass}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-[10px] font-black text-violet-400 uppercase tracking-widest flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-violet-400" />
            Mídia & Imagem do Produto
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-bold">Bordas / Glow:</span>
            <button
              type="button"
              onClick={() => ctx.setHasImageBorder(!ctx.hasImageBorder)}
              className={`relative inline-flex h-5 w-10 cursor-pointer items-center rounded-full transition-colors ${ctx.hasImageBorder ? 'bg-violet-600' : 'bg-slate-800'}`}
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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Estilo de Encaixe & Sangria</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-400">Sangria Total (Card Bleed):</span>
              <button
                type="button"
                onClick={() => ctx.setImageFullBleed(!ctx.imageFullBleed)}
                className={`relative inline-flex h-4.5 w-9 cursor-pointer items-center rounded-full transition-colors ${ctx.imageFullBleed ? 'bg-violet-600' : 'bg-slate-800'}`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${ctx.imageFullBleed ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          {(
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-300">Largura Máxima da Imagem</label>
                <span className="text-xs font-mono font-bold text-violet-400">{ctx.imageWidth}%</span>
              </div>
              <input type="range" min="30" max="100" value={ctx.imageWidth} onChange={(e) => ctx.setImageWidth(parseInt(e.target.value))} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500" />
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Encaixe Visual</label>
              <select value={ctx.imageFit} onChange={(e) => ctx.setImageFit(e.target.value as ImageFit)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 outline-none font-bold">
                <option value="cover">Preencher</option>
                <option value="contain">Conter tudo</option>
                <option value="fill">Esticar</option>
                <option value="scale-down">Reduzir sem cortar</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Posição Vertical</label>
              <select value={ctx.imagePosition} onChange={(e) => ctx.setImagePosition(e.target.value as ImagePosition)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 outline-none font-bold">
                <option value="top">No Topo</option>
                <option value="middle">No Meio</option>
                <option value="bottom">Na Base</option>
              </select>
            </div>
          </div>
          
          {(
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Alinhamento Horizontal da Imagem</label>
              <div className="grid grid-cols-3 gap-2">
                {(['left', 'center', 'right'] as ImageAlign[]).map((align) => (
                  <button
                    key={align}
                    type="button"
                    onClick={() => ctx.setImageAlign(align)}
                    className={`cursor-pointer text-[10px] font-bold px-3 py-2 rounded-2xl border capitalize ${ctx.imageAlign === align ? 'bg-violet-600 text-white border-violet-500' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'}`}
                  >
                    {align === 'left' ? 'Esquerda' : align === 'right' ? 'Direita' : 'Centro'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-slate-800/70 to-transparent" />

      {/* 5. CTA Principal */}
      <div id="editor-cta" className={sectionClass}>
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
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-bold text-slate-300">Texto de apoio abaixo do CTA</label>
            <MarkdownButtons onInsert={(tag) => insertMarkdownFor(tag, ctaSupportRef.current, ctx.ctaSupportText, ctx.setCtaSupportText)} />
          </div>
          <textarea
            ref={ctaSupportRef}
            rows={3}
            value={ctx.ctaSupportText}
            onChange={(e) => ctx.setCtaSupportText(e.target.value)}
            placeholder="Ex: Acesso seguro, imediato e sem cobrancas ocultas."
            className="w-full bg-slate-950 border border-slate-850 focus:border-violet-500 rounded-xl px-3 py-2.5 text-xs text-slate-200 transition-all outline-none resize-none leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Cor do CTA</label>
          <button type="button" onClick={() => setCtaPaletteOpen(!ctaPaletteOpen)} className="mb-2 flex w-full cursor-pointer items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-[10px] font-black text-slate-300 hover:text-white">
            <span className="inline-flex items-center gap-2"><Palette className="h-3.5 w-3.5 text-violet-400" /> Paleta de CTA</span>
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${ctaPaletteOpen ? 'rotate-180' : ''}`} />
          </button>
          {ctaPaletteOpen && (
            <div className="flex flex-wrap gap-1.5 mb-2 rounded-2xl border border-slate-850 bg-slate-950 p-2">
              {ctaColorPresets.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => ctx.setCtaColor(color.value)}
                  className="p-1.5 cursor-pointer rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 flex items-center gap-1.5"
                >
                  <span className="w-3 h-3 rounded-full block" style={{ backgroundColor: color.value }}></span>
                  <span className="text-[9px] font-bold text-slate-400">{color.name}</span>
                </button>
              ))}
            </div>
          )}
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
                  className={`cursor-pointer text-[10px] font-bold px-3 py-2 rounded-xl border capitalize ${ctx.ctaSize === size ? 'bg-violet-600 text-white border-violet-500' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'}`}
                >
                  {size === 'small' ? 'Pequeno' : size === 'medium' ? 'Médio' : 'Grande'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">Efeito do Botao</label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {ctaEffects.map((effect) => (
                <button
                  key={effect.value}
                  type="button"
                  title={effect.description}
                  onClick={() => ctx.setCtaEffect(effect.value)}
                  className={`cursor-pointer rounded-xl border px-3 py-2 text-left text-[10px] font-black ${ctx.ctaEffect === effect.value ? 'border-violet-500 bg-violet-600 text-white' : 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-850'}`}
                >
                  {effect.label}
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

      <div className="h-px bg-gradient-to-r from-transparent via-slate-800/70 to-transparent" />

      {/* 6. Blocos de conversao */}
      <div id="editor-conversion" className={sectionClass}>
        <h3 className="text-[10px] font-black text-violet-400 uppercase tracking-widest flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          Blocos de Conversao
        </h3>

        <div className="border border-slate-850 rounded-2xl p-4 space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="text-xs font-black text-slate-200">Beneficios rapidos</h4>
              <p className="text-[10px] text-slate-500">Um item por linha. Aceita Markdown.</p>
            </div>
            <button type="button" onClick={() => ctx.setBenefitsEnabled(!ctx.benefitsEnabled)} className={`relative inline-flex h-5 w-10 cursor-pointer items-center rounded-full transition-colors ${ctx.benefitsEnabled ? 'bg-violet-600' : 'bg-slate-800'}`}>
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${ctx.benefitsEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>
          {ctx.benefitsEnabled && (
            <div>
              <div className="mb-1">
                <MarkdownButtons onInsert={(tag) => insertMarkdownFor(tag, benefitsRef.current, ctx.benefitsRaw, ctx.setBenefitsRaw)} />
              </div>
              <textarea
                ref={benefitsRef}
                rows={5}
                value={ctx.benefitsRaw}
                onChange={(e) => ctx.setBenefitsRaw(e.target.value)}
                placeholder="Um beneficio por linha"
                className="w-full bg-slate-950 border border-slate-850 focus:border-violet-500 rounded-xl px-3 py-2.5 text-xs text-slate-200 outline-none resize-none leading-relaxed"
              />
            </div>
          )}
        </div>

        <div className="border border-slate-850 rounded-2xl p-4 space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="text-xs font-black text-slate-200 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-violet-400" /> Prova e seguranca</h4>
              <p className="text-[10px] text-slate-500">Selos curtos separados por virgula.</p>
            </div>
            <button type="button" onClick={() => ctx.setTrustEnabled(!ctx.trustEnabled)} className={`relative inline-flex h-5 w-10 cursor-pointer items-center rounded-full transition-colors ${ctx.trustEnabled ? 'bg-violet-600' : 'bg-slate-800'}`}>
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${ctx.trustEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>
          {ctx.trustEnabled && (
            <div>
              <div className="mb-1">
                <MarkdownButtons onInsert={(tag) => insertMarkdownFor(tag, trustItemsRef.current, ctx.trustItemsRaw, ctx.setTrustItemsRaw)} />
              </div>
              <textarea
                ref={trustItemsRef}
                rows={3}
                value={ctx.trustItemsRaw}
                onChange={(e) => ctx.setTrustItemsRaw(e.target.value)}
                placeholder="Ambiente seguro, Sem promessas irreais, Conteudo objetivo"
                className="w-full bg-slate-950 border border-slate-850 focus:border-violet-500 rounded-xl px-3 py-2.5 text-xs text-slate-200 outline-none resize-none leading-relaxed"
              />
            </div>
          )}
        </div>

        <div className="border border-slate-850 rounded-2xl p-4 space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="text-xs font-black text-slate-200">Garantia / decisao segura</h4>
              <p className="text-[10px] text-slate-500">Bom para reduzir friccao antes do clique final.</p>
            </div>
            <button type="button" onClick={() => ctx.setGuaranteeEnabled(!ctx.guaranteeEnabled)} className={`relative inline-flex h-5 w-10 cursor-pointer items-center rounded-full transition-colors ${ctx.guaranteeEnabled ? 'bg-violet-600' : 'bg-slate-800'}`}>
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${ctx.guaranteeEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>
          {ctx.guaranteeEnabled && (
            <div className="space-y-2">
              <input
                type="text"
                value={ctx.guaranteeTitle}
                onChange={(e) => ctx.setGuaranteeTitle(e.target.value)}
                placeholder="Decisao segura"
                className="w-full bg-slate-950 border border-slate-850 focus:border-violet-500 rounded-xl px-3 py-2.5 text-xs text-slate-200 outline-none"
              />
              <div>
                <div className="mb-1">
                  <MarkdownButtons onInsert={(tag) => insertMarkdownFor(tag, guaranteeTextRef.current, ctx.guaranteeText, ctx.setGuaranteeText)} />
                </div>
                <textarea
                  ref={guaranteeTextRef}
                  rows={4}
                  value={ctx.guaranteeText}
                  onChange={(e) => ctx.setGuaranteeText(e.target.value)}
                  placeholder="Explique como a pessoa pode avancar com seguranca."
                  className="w-full bg-slate-950 border border-slate-850 focus:border-violet-500 rounded-xl px-3 py-2.5 text-xs text-slate-200 outline-none resize-none leading-relaxed"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-slate-800/70 to-transparent" />

      {/* 6. Extras (Aviso, Timer, FAQ, Badge) */}
      <div id="editor-extras" className={sectionClass}>
        {/* Aviso */}
        <div className="border border-slate-850 rounded-2xl p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
            <h3 className="text-[10px] font-black text-violet-400 uppercase tracking-widest flex items-center gap-1.5">
              <Layout className="w-3.5 h-3.5 text-violet-400" /> Aviso Superior
            </h3>
            <button type="button" onClick={() => ctx.setAvisoEnabled(!ctx.avisoEnabled)} className={`relative inline-flex h-5 w-10 cursor-pointer items-center rounded-full transition-colors ${ctx.avisoEnabled ? 'bg-violet-600' : 'bg-slate-800'}`}>
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${ctx.avisoEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>
          {ctx.avisoEnabled && (
            <div className="space-y-3">
              <input type="text" value={ctx.avisoTopo} onChange={(e) => ctx.setAvisoTopo(e.target.value)} placeholder="ATENÇÃO: Vagas acabando!" className="w-full bg-slate-950 border border-slate-850 focus:border-violet-500 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none" />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <select value={ctx.avisoWidth} onChange={(e) => ctx.setAvisoWidth(e.target.value as NoticeWidth)} className="w-full bg-slate-950 border border-slate-850 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 outline-none">
                  <option value="full">Largura Total</option>
                  <option value="card">Mesma do Card</option>
                </select>
                <select value={ctx.avisoPosition} onChange={(e) => ctx.setAvisoPosition(e.target.value as NoticePosition)} className="w-full bg-slate-950 border border-slate-850 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 outline-none">
                  <option value="sticky">Fixo no Topo</option>
                  <option value="top-card">Topo do Card</option>
                </select>
              </div>
              <button type="button" onClick={() => setNoticePaletteOpen(!noticePaletteOpen)} className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-[10px] font-black text-slate-300 hover:text-white">
                <span className="inline-flex items-center gap-2"><Palette className="h-3.5 w-3.5 text-violet-400" /> Paleta do aviso</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${noticePaletteOpen ? 'rotate-180' : ''}`} />
              </button>
              {noticePaletteOpen && (
                <div className="flex flex-wrap gap-1.5 rounded-2xl border border-slate-850 bg-slate-950 p-2">
                  {avisoColorPresets.map((preset) => (
                    <button key={preset.name} type="button" onClick={() => { ctx.setAvisoBgColor(preset.bg); ctx.setAvisoTextColor(preset.text); }} className="flex cursor-pointer items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 p-1 text-[9px]">
                      <span className="w-2.5 h-2.5 rounded-full block border border-white/10" style={{ backgroundColor: preset.bg }}></span>
                      <span className="text-slate-400">{preset.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Badge */}
        <div className="border border-slate-850 rounded-2xl p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
            <h3 className="text-[10px] font-black text-violet-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" /> Selo (Badge)
            </h3>
            <button type="button" onClick={() => ctx.setBadgeEnabled(!ctx.badgeEnabled)} className={`relative inline-flex h-5 w-10 cursor-pointer items-center rounded-full transition-colors ${ctx.badgeEnabled ? 'bg-violet-600' : 'bg-slate-800'}`}>
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${ctx.badgeEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>
          {ctx.badgeEnabled && (
            <div className="space-y-3">
              <input type="text" value={ctx.badgeText} onChange={(e) => ctx.setBadgeText(e.target.value)} placeholder="MÉTODO NOVO" className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none" />
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-850 rounded-lg p-1"><input type="color" value={ctx.badgeBgColor} onChange={(e) => ctx.setBadgeBgColor(e.target.value)} className="w-5 h-5 cursor-pointer rounded border-none bg-transparent" /> <input type="text" value={ctx.badgeBgColor} onChange={(e) => ctx.setBadgeBgColor(e.target.value)} className="w-full bg-transparent text-[10px] font-mono outline-none" /></div>
                <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-850 rounded-lg p-1"><input type="color" value={ctx.badgeTextColor} onChange={(e) => ctx.setBadgeTextColor(e.target.value)} className="w-5 h-5 cursor-pointer rounded border-none bg-transparent" /> <input type="text" value={ctx.badgeTextColor} onChange={(e) => ctx.setBadgeTextColor(e.target.value)} className="w-full bg-transparent text-[10px] font-mono outline-none" /></div>
              </div>
            </div>
          )}
        </div>

        {/* Timer */}
        <div className="border border-slate-850 rounded-2xl p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
            <h3 className="text-[10px] font-black text-violet-400 uppercase tracking-widest flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5 text-violet-400" /> Timer Regressivo
            </h3>
            <button type="button" onClick={() => ctx.setTimerEnabled(!ctx.timerEnabled)} className={`relative inline-flex h-5 w-10 cursor-pointer items-center rounded-full transition-colors ${ctx.timerEnabled ? 'bg-violet-600' : 'bg-slate-800'}`}>
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${ctx.timerEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>
          {ctx.timerEnabled && (
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Modelo visual do timer</label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {timerStyles.map((style) => (
                    <button
                      key={style.value}
                      type="button"
                      onClick={() => ctx.setTimerStyle(style.value)}
                      className={`cursor-pointer rounded-xl border px-3 py-2 text-[10px] font-black ${ctx.timerStyle === style.value ? 'border-violet-500 bg-violet-600 text-white' : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'}`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-slate-400 mb-1">Texto do Timer</label>
                  <input type="text" value={ctx.timerText} onChange={(e) => ctx.setTimerText(e.target.value)} className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Duração (Min)</label>
                  <input type="number" min="1" max="180" value={ctx.timerDuration} onChange={(e) => ctx.setTimerDuration(Math.max(1, parseInt(e.target.value) || 15))} className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none font-mono" />
                </div>
              </div>
              <button type="button" onClick={() => setTimerPaletteOpen(!timerPaletteOpen)} className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-[10px] font-black text-slate-300 hover:text-white">
                <span className="inline-flex items-center gap-2"><Palette className="h-3.5 w-3.5 text-violet-400" /> Paleta do timer</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${timerPaletteOpen ? 'rotate-180' : ''}`} />
              </button>
              {timerPaletteOpen && (
                <div className="flex flex-wrap gap-1.5 rounded-2xl border border-slate-850 bg-slate-950 p-2">
                  {timerColorPresets.map((preset) => (
                    <button key={preset.name} type="button" onClick={() => { ctx.setTimerBgColor(preset.bg); ctx.setTimerTextColor(preset.text); }} className="flex cursor-pointer items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 p-1 text-[9px]">
                      <span className="w-2.5 h-2.5 rounded-md block border border-white/10" style={{ backgroundColor: preset.bg }}></span>
                      <span className="text-slate-400">{preset.name}</span>
                    </button>
                  ))}
                </div>
              )}
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
              <div className="mb-1">
                <MarkdownButtons onInsert={(tag) => insertMarkdownFor(tag, faqAnswerRef.current, newAnswer, setNewAnswer)} />
              </div>
              <textarea ref={faqAnswerRef} rows={6} value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} className="w-full bg-slate-900 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none resize-none leading-relaxed" />
            </div>
            <button type="button" onClick={handleAddFaqItem} className="bg-violet-600/20 cursor-pointer hover:bg-violet-600/40 text-violet-400 border border-violet-500/30 font-bold text-xs py-1.5 px-3 rounded-xl transition-all self-end flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Adicionar FAQ
            </button>
          </div>
          
          {ctx.faqList.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-850 mb-3 sm:grid-cols-2">
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

      <div className="h-px bg-gradient-to-r from-transparent via-slate-800/70 to-transparent" />

      <div id="editor-seo" className={sectionClass}>
        <h3 className="text-[10px] font-black text-violet-400 uppercase tracking-widest flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-violet-400" />
          SEO, idioma e Google Ads
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Idioma global</label>
            <select
              value={ctx.lang}
              onChange={(e) => ctx.setLang(e.target.value as 'pt' | 'en')}
              className="w-full bg-slate-950 border border-slate-850 focus:border-violet-500 rounded-xl px-3 py-2.5 text-xs text-slate-200 outline-none"
            >
              <option value="pt">Português</option>
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Titulo do HTML</label>
            <input
              type="text"
              value={ctx.seoTitle}
              onChange={(e) => ctx.setSeoTitle(e.target.value)}
              placeholder="Titulo que aparece na aba e no Google"
              className="w-full bg-slate-950 border border-slate-850 focus:border-violet-500 rounded-xl px-3 py-2.5 text-xs text-slate-200 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Meta description</label>
          <div className="mb-1">
            <MarkdownButtons onInsert={(tag) => insertMarkdownFor(tag, seoDescRef.current, ctx.seoDescription, ctx.setSeoDescription)} />
          </div>
          <textarea
            ref={seoDescRef}
            rows={3}
            value={ctx.seoDescription}
            onChange={(e) => ctx.setSeoDescription(e.target.value)}
            placeholder="Pode ser a mesma descricao da presell."
            className="w-full bg-slate-950 border border-slate-850 focus:border-violet-500 rounded-xl px-3 py-2.5 text-xs text-slate-200 outline-none resize-none leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Palavras-chave</label>
          <input
            type="text"
            value={ctx.seoKeywords}
            onChange={(e) => ctx.setSeoKeywords(e.target.value)}
            placeholder="afiliados, produto digital, oferta"
            className="w-full bg-slate-950 border border-slate-850 focus:border-violet-500 rounded-xl px-3 py-2.5 text-xs text-slate-200 outline-none"
          />
        </div>
      </div>

      <div className="sticky bottom-3 z-30 mt-1 flex gap-2 rounded-[24px] border border-slate-800 bg-slate-950/90 p-2 shadow-2xl shadow-black/30 backdrop-blur">
        <button type="button" onClick={onRequestSave} className="flex cursor-pointer justify-center items-center gap-3 grow rounded-2xl bg-violet-600 px-4 py-3 text-xs font-black text-white shadow-lg shadow-violet-600/20 transition-all hover:bg-violet-500 active:scale-[0.98] md:text-sm">
          <SaveIcon/> SALVAR PROJETO
        </button>
        <button
          type="button"
          onClick={onRequestReset}
          className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 px-3 py-3 text-slate-400 transition-all hover:bg-slate-850 hover:text-white"
        >
          <RotateCcw className="w-4.5 h-4.5" />
        </button>
      </div>

    </div>
  );
}
