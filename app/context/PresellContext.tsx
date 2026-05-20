'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Presell, FAQItem, Language } from '../types/presell';
import { translations } from './i18n';

export const defaultTemplate: Presell = {
  id: Math.floor(Math.random() * 10000),
  titulo: 'Como faturar até **[R$ 10.000]{#22c55e}** no mercado digital sem aparecer',
  subtitulo: 'Aprenda os **três passos práticos** que os maiores afiliados ocultos usam para vender todos os dias sem investir fortunas em tráfego.',
  imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
  ctaText: 'SIM! QUERO ACESSO IMEDIATO',
  ctaLink: 'https://checkout.exemplo.com/vendas',
  ctaColor: '#22c55e',
  themeColor: '#0b0f19',
  textColor: '#ffffff',
  borderRadius: 16,
  faq: [
    { question: 'Funciona para iniciantes absolutos?', answer: 'Sim! Todo o passo a passo foi desenhado do básico ao avançado para que qualquer pessoa consiga aplicar.' },
    { question: 'Preciso gastar muito para começar?', answer: 'Não. Você aprenderá táticas orgânicas e de baixíssimo investimento para estruturar seus primeiros ganhos.' }
  ],
  updatedAt: new Date().toISOString(),
  hasImageBorder: true,
  fontSizeTitulo: 28,
  fontSizeSubtitulo: 14,
  
  // Timer default
  timerEnabled: true,
  timerDuration: 15,
  timerText: 'Essa oportunidade expira em:',
  timerBgColor: '#020617',
  timerTextColor: '#ffffff',
  timerBorderRadius: 12,

  // Aviso default
  avisoEnabled: true,
  avisoTopo: 'ATENÇÃO: Este treinamento é gratuito por tempo limitado devido ao limite de banda!',
  avisoPulse: true,
  avisoBgColor: '#dc2626',
  avisoTextColor: '#ffffff',
  avisoWidth: 'full',
  avisoPosition: 'sticky',

  // Badge default
  badgeEnabled: true,
  badgeText: 'MÉTODO SECRETO EXCLUSIVO',
  badgePulse: false,
  badgeBgColor: '#1e1b4b',
  badgeTextColor: '#c084fc',

  imageWidth: 100,
  imageAlign: 'center',
  imagePosition: 'bottom',
  imageFit: 'cover',
  imageFullBleed: false,

  headerEnabled: true,
  headerBrand: 'FastPresell',
  headerMenuRaw: 'Sobre,Oferta,Contato',
  headerBgColor: '#020617',
  headerTextColor: '#ffffff',
  contentAlignment: 'center',

  footerEnabled: true,
  footerText: 'Todos os direitos reservados.',
  footerBgColor: '#020617',
  footerTextColor: '#94a3b8',
  footerPosition: 'center',
  
  // Novos campos opcionais
  ctaSize: 'large',
  ctaWidth: 100,
  faqFontSize: 11,
  faqAnswerFontSize: 10
};

interface PresellContextData {
  presells: Presell[];
  setPresells: (p: Presell[]) => void;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  
  // Editor State
  titulo: string; setTitulo: (v: string) => void;
  subtitulo: string; setSubtitulo: (v: string) => void;
  imageUrl: string; setImageUrl: (v: string) => void;
  ctaText: string; setCtaText: (v: string) => void;
  ctaLink: string; setCtaLink: (v: string) => void;
  ctaColor: string; setCtaColor: (v: string) => void;
  themeColor: string; setThemeColor: (v: string) => void;
  textColor: string; setTextColor: (v: string) => void;
  borderRadius: number; setBorderRadius: (v: number) => void;
  faqList: FAQItem[]; setFaqList: (v: FAQItem[]) => void;
  hasImageBorder: boolean; setHasImageBorder: (v: boolean) => void;
  fontSizeTitulo: number; setFontSizeTitulo: (v: number) => void;
  fontSizeSubtitulo: number; setFontSizeSubtitulo: (v: number) => void;
  
  // Timer State
  timerEnabled: boolean; setTimerEnabled: (v: boolean) => void;
  timerDuration: number; setTimerDuration: (v: number) => void;
  timerText: string; setTimerText: (v: string) => void;
  timerBgColor: string; setTimerBgColor: (v: string) => void;
  timerTextColor: string; setTimerTextColor: (v: string) => void;
  timerBorderRadius: number; setTimerBorderRadius: (v: number) => void;
  
  // Aviso State
  avisoEnabled: boolean; setAvisoEnabled: (v: boolean) => void;
  avisoTopo: string; setAvisoTopo: (v: string) => void;
  avisoPulse: boolean; setAvisoPulse: (v: boolean) => void;
  avisoBgColor: string; setAvisoBgColor: (v: string) => void;
  avisoTextColor: string; setAvisoTextColor: (v: string) => void;
  avisoWidth: 'full' | 'card'; setAvisoWidth: (v: 'full' | 'card') => void;
  avisoPosition: 'sticky' | 'top-card'; setAvisoPosition: (v: 'sticky' | 'top-card') => void;

  // Badge State
  badgeEnabled: boolean; setBadgeEnabled: (v: boolean) => void;
  badgeText: string; setBadgeText: (v: string) => void;
  badgePulse: boolean; setBadgePulse: (v: boolean) => void;
  badgeBgColor: string; setBadgeBgColor: (v: string) => void;
  badgeTextColor: string; setBadgeTextColor: (v: string) => void;

  // Image State
  imageWidth: number; setImageWidth: (v: number) => void;
  imageAlign: 'left' | 'center' | 'right'; setImageAlign: (v: 'left' | 'center' | 'right') => void;
  imagePosition: 'top' | 'middle' | 'bottom'; setImagePosition: (v: 'top' | 'middle' | 'bottom') => void;
  imageFit: 'cover' | 'contain' | 'fill' | 'scale-down'; setImageFit: (v: 'cover' | 'contain' | 'fill' | 'scale-down') => void;
  imageFullBleed: boolean; setImageFullBleed: (v: boolean) => void;

  // Header/Footer State
  headerEnabled: boolean; setHeaderEnabled: (v: boolean) => void;
  headerBrand: string; setHeaderBrand: (v: string) => void;
  headerMenuRaw: string; setHeaderMenuRaw: (v: string) => void;
  headerBgColor: string; setHeaderBgColor: (v: string) => void;
  headerTextColor: string; setHeaderTextColor: (v: string) => void;
  contentAlignment: 'left' | 'center' | 'right'; setContentAlignment: (v: 'left' | 'center' | 'right') => void;

  footerEnabled: boolean; setFooterEnabled: (v: boolean) => void;
  footerText: string; setFooterText: (v: string) => void;
  footerBgColor: string; setFooterBgColor: (v: string) => void;
  footerTextColor: string; setFooterTextColor: (v: string) => void;
  footerPosition: 'left' | 'center' | 'right'; setFooterPosition: (v: 'left' | 'center' | 'right') => void;
  
  // Novos Estados Solicitados
  ctaSize: 'small' | 'medium' | 'large'; setCtaSize: (v: 'small' | 'medium' | 'large') => void;
  ctaWidth: number; setCtaWidth: (v: number) => void;
  faqFontSize: number; setFaqFontSize: (v: number) => void;
  faqAnswerFontSize: number; setFaqAnswerFontSize: (v: number) => void;

  // SEO
  seoTitle: string; setSeoTitle: (v: string) => void;
  seoDescription: string; setSeoDescription: (v: string) => void;
  seoKeywords: string; setSeoKeywords: (v: string) => void;

  // Language & i18n
  lang: Language; setLang: (v: Language) => void;
  t: (key: keyof typeof translations['en']) => string;

  // App UI State
  toastMessage: string | null;
  showToast: (msg: string) => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (v: boolean) => void;
  
  // Actions
  loadPresell: (item: Presell) => void;
  handleNewClick: () => void;
  handleSavePresell: () => void;
  handleDeletePresell: (id: string) => void;
  handleDeleteAllPresells: () => void;
  handleDuplicatePresell: (item: Presell) => void;
  isDraftCard: (item: Presell) => boolean;
}

const PresellContext = createContext<PresellContextData | undefined>(undefined);

export function PresellProvider({ children }: { children: ReactNode }) {
  const [presells, setPresells] = useState<Presell[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Estados dos formulários
  const [titulo, setTitulo] = useState<string>('');
  const [subtitulo, setSubtitulo] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [ctaText, setCtaText] = useState<string>('');
  const [ctaLink, setCtaLink] = useState<string>('');
  const [ctaColor, setCtaColor] = useState<string>('#22c55e');
  const [themeColor, setThemeColor] = useState<string>('#0b0f19');
  const [textColor, setTextColor] = useState<string>('#ffffff');
  const [borderRadius, setBorderRadius] = useState<number>(16);
  const [faqList, setFaqList] = useState<FAQItem[]>([]);
  const [hasImageBorder, setHasImageBorder] = useState<boolean>(true);
  const [fontSizeTitulo, setFontSizeTitulo] = useState<number>(28);
  const [fontSizeSubtitulo, setFontSizeSubtitulo] = useState<number>(14);
  
  // Timer
  const [timerEnabled, setTimerEnabled] = useState<boolean>(true);
  const [timerDuration, setTimerDuration] = useState<number>(15);
  const [timerText, setTimerText] = useState<string>('A oferta expira em:');
  const [timerBgColor, setTimerBgColor] = useState<string>('#020617');
  const [timerTextColor, setTimerTextColor] = useState<string>('#ffffff');
  const [timerBorderRadius, setTimerBorderRadius] = useState<number>(12);

  // Aviso Superior
  const [avisoEnabled, setAvisoEnabled] = useState<boolean>(true);
  const [avisoTopo, setAvisoTopo] = useState<string>('');
  const [avisoPulse, setAvisoPulse] = useState<boolean>(true);
  const [avisoBgColor, setAvisoBgColor] = useState<string>('#dc2626');
  const [avisoTextColor, setAvisoTextColor] = useState<string>('#ffffff');
  const [avisoWidth, setAvisoWidth] = useState<'full' | 'card'>('full');
  const [avisoPosition, setAvisoPosition] = useState<'sticky' | 'top-card'>('sticky');

  // Badge
  const [badgeEnabled, setBadgeEnabled] = useState<boolean>(true);
  const [badgeText, setBadgeText] = useState<string>('');
  const [badgePulse, setBadgePulse] = useState<boolean>(false);
  const [badgeBgColor, setBadgeBgColor] = useState<string>('#1e1b4b');
  const [badgeTextColor, setBadgeTextColor] = useState<string>('#c084fc');

  // Image Posicionamento
  const [imageWidth, setImageWidth] = useState<number>(100);
  const [imageAlign, setImageAlign] = useState<'left' | 'center' | 'right'>('center');
  const [imagePosition, setImagePosition] = useState<'top' | 'middle' | 'bottom'>('bottom');
  const [imageFit, setImageFit] = useState<'cover' | 'contain' | 'fill' | 'scale-down'>('cover');
  const [imageFullBleed, setImageFullBleed] = useState<boolean>(false);

  // Header e Footer
  const [headerEnabled, setHeaderEnabled] = useState<boolean>(true);
  const [headerBrand, setHeaderBrand] = useState<string>('FastPresell');
  const [headerMenuRaw, setHeaderMenuRaw] = useState<string>('Sobre,Oferta,Contato');
  const [headerBgColor, setHeaderBgColor] = useState<string>('#020617');
  const [headerTextColor, setHeaderTextColor] = useState<string>('#ffffff');
  const [contentAlignment, setContentAlignment] = useState<'left' | 'center' | 'right'>('center');

  const [footerEnabled, setFooterEnabled] = useState<boolean>(true);
  const [footerText, setFooterText] = useState<string>('Todos os direitos reservados.');
  const [footerBgColor, setFooterBgColor] = useState<string>('#020617');
  const [footerTextColor, setFooterTextColor] = useState<string>('#94a3b8');
  const [footerPosition, setFooterPosition] = useState<'left' | 'center' | 'right'>('center');

  // Novas configurações do CTA e FAQ
  const [ctaSize, setCtaSize] = useState<'small' | 'medium' | 'large'>('large');
  const [ctaWidth, setCtaWidth] = useState<number>(100);
  const [faqFontSize, setFaqFontSize] = useState<number>(11);
  const [faqAnswerFontSize, setFaqAnswerFontSize] = useState<number>(10);

  // App UI
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadPresell = (item: Presell) => {
    setActiveId(item.id);
    setTitulo(item.titulo || '');
    setSubtitulo(item.subtitulo || '');
    setImageUrl(item.imageUrl || '');
    setCtaText(item.ctaText || '');
    setCtaLink(item.ctaLink || '');
    setCtaColor(item.ctaColor || '#22c55e');
    setThemeColor(item.themeColor || '#0b0f19');
    setTextColor(item.textColor || '#ffffff');
    setBorderRadius(item.borderRadius !== undefined ? item.borderRadius : 16);
    setFaqList(item.faq || []);
    setHasImageBorder(item.hasImageBorder !== false);
    setFontSizeTitulo(item.fontSizeTitulo || 28);
    setFontSizeSubtitulo(item.fontSizeSubtitulo || 14);

    setTimerEnabled(item.timerEnabled !== false);
    setTimerDuration(item.timerDuration || 15);
    setTimerText(item.timerText || 'A oferta expira em:');
    setTimerBgColor(item.timerBgColor || '#020617');
    setTimerTextColor(item.timerTextColor || '#ffffff');
    setTimerBorderRadius(item.timerBorderRadius !== undefined ? item.timerBorderRadius : 12);

    setAvisoEnabled(item.avisoEnabled !== false);
    setAvisoTopo(item.avisoTopo || '');
    setAvisoPulse(item.avisoPulse !== false);
    setAvisoBgColor(item.avisoBgColor || '#dc2626');
    setAvisoTextColor(item.avisoTextColor || '#ffffff');
    setAvisoWidth(item.avisoWidth || 'full');
    setAvisoPosition(item.avisoPosition || 'sticky');

    setBadgeEnabled(item.badgeEnabled !== false);
    setBadgeText(item.badgeText || '');
    setBadgePulse(item.badgePulse === true);
    setBadgeBgColor(item.badgeBgColor || '#1e1b4b');
    setBadgeTextColor(item.badgeTextColor || '#c084fc');
    
    setImageWidth(item.imageWidth !== undefined ? item.imageWidth : 100);
    setImageAlign(item.imageAlign || 'center');
    setImagePosition(item.imagePosition || 'bottom');
    setImageFit(item.imageFit || 'cover');
    setImageFullBleed(item.imageFullBleed === true);

    setHeaderEnabled(item.headerEnabled !== false);
    setHeaderBrand(item.headerBrand || 'FastPresell');
    setHeaderMenuRaw(item.headerMenuRaw || 'Sobre,Oferta,Contato');
    setHeaderBgColor(item.headerBgColor || '#020617');
    setHeaderTextColor(item.headerTextColor || '#ffffff');
    setContentAlignment(item.contentAlignment || 'center');
    setFooterEnabled(item.footerEnabled !== false);
    setFooterText(item.footerText || 'Todos os direitos reservados.');
    setFooterBgColor(item.footerBgColor || '#020617');
    setFooterTextColor(item.footerTextColor || '#94a3b8');
    setFooterPosition(item.footerPosition || 'center');
    
    setCtaSize(item.ctaSize || 'large');
    setCtaWidth(item.ctaWidth !== undefined ? item.ctaWidth : 100);
    setFaqFontSize(item.faqFontSize !== undefined ? item.faqFontSize : 11);
    setFaqAnswerFontSize(item.faqAnswerFontSize !== undefined ? item.faqAnswerFontSize : 10);

    setHasUnsavedChanges(false);
  };

  useEffect(() => {
    const saved = localStorage.getItem('v3_presell_items');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Presell[];
        setPresells(parsed);
        if (parsed.length > 0) {
          loadPresell(parsed[0]);
        } else {
          setPresells([defaultTemplate]);
          localStorage.setItem('v3_presell_items', JSON.stringify([defaultTemplate]));
          loadPresell(defaultTemplate);
        }
      } catch (err) {
        setPresells([defaultTemplate]);
        localStorage.setItem('v3_presell_items', JSON.stringify([defaultTemplate]));
        loadPresell(defaultTemplate);
      }
    } else {
      setPresells([defaultTemplate]);
      localStorage.setItem('v3_presell_items', JSON.stringify([defaultTemplate]));
      loadPresell(defaultTemplate);
    }
  }, []);

  const handleNewClick = () => {
    const newId = 'id_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
    const newPresell: Presell = {
      ...defaultTemplate,
      id: newId,
      titulo: '',
      subtitulo: '',
      imageUrl: '',
      ctaLink: '',
      ctaText: '',
      faq: [],
      updatedAt: new Date().toISOString()
    };
    const nextList = [newPresell, ...presells];
    setPresells(nextList);
    localStorage.setItem('v3_presell_items', JSON.stringify(nextList));
    if (!activeId) {
      loadPresell(newPresell);
    }
    setHasUnsavedChanges(false);
    showToast('Novo projeto criado. O projeto atual permanece selecionado.');
  };

  const handleSavePresell = () => {
    if (!titulo || !ctaLink) {
      alert('Por favor, preencha o Título Principal e o Link de Destino do CTA para salvar o seu projeto.');
      return;
    }

    const currentId = activeId || 'id_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
    const isNew = !presells.some(p => p.id === currentId);

    const presellData: Presell = {
      id: currentId,
      titulo,
      subtitulo,
      imageUrl,
      ctaText: ctaText || 'CLIQUE PARA ACESSAR',
      ctaLink,
      ctaColor,
      themeColor,
      textColor,
      borderRadius,
      faq: faqList,
      updatedAt: new Date().toISOString(),
      hasImageBorder,
      fontSizeTitulo,
      fontSizeSubtitulo,
      timerEnabled,
      timerDuration,
      timerText,
      timerBgColor,
      timerTextColor,
      timerBorderRadius,
      avisoEnabled,
      avisoTopo,
      avisoPulse,
      avisoBgColor,
      avisoTextColor,
      avisoWidth,
      avisoPosition,
      badgeEnabled,
      badgeText,
      badgePulse,
      badgeBgColor,
      badgeTextColor,
      imageWidth,
      imageAlign,
      imagePosition,
      imageFit,
      imageFullBleed,
      headerEnabled,
      headerBrand,
      headerMenuRaw,
      headerBgColor,
      headerTextColor,
      contentAlignment,
      footerEnabled,
      footerText,
      footerBgColor,
      footerTextColor,
      footerPosition,
      ctaSize,
      ctaWidth,
      faqFontSize,
      faqAnswerFontSize
    };

    let updatedList: Presell[];
    if (isNew) {
      updatedList = [presellData, ...presells];
      setActiveId(currentId);
    } else {
      updatedList = presells.map(p => p.id === currentId ? presellData : p);
    }

    setPresells(updatedList);
    localStorage.setItem('v3_presell_items', JSON.stringify(updatedList));
    setHasUnsavedChanges(false);
    showToast(isNew ? '✨ Presell criada com sucesso!' : '💾 Alterações gravadas!');
  };

  const handleDeletePresell = (id: string) => {
    const filtered = presells.filter(p => p.id !== id);
    setPresells(filtered);
    localStorage.setItem('v3_presell_items', JSON.stringify(filtered));
    
    if (activeId === id) {
      if (filtered.length > 0) {
        loadPresell(filtered[0]);
      } else {
        handleNewClick();
      }
    }
    showToast('🗑️ Presell excluída permanentemente!');
  };

  const handleDeleteAllPresells = () => {
    setPresells([]);
    localStorage.removeItem('v3_presell_items');
    handleNewClick();
    showToast('🗑️ Todos os projetos foram excluídos!');
  };

  const handleDuplicatePresell = (item: Presell) => {
    const duplicatedId = 'id_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
    const duplicatedItem: Presell = {
      ...item,
      id: duplicatedId,
      titulo: `${item.titulo} (Cópia)`,
      updatedAt: new Date().toISOString()
    };

    const updatedList = [duplicatedItem, ...presells];
    setPresells(updatedList);
    localStorage.setItem('v3_presell_items', JSON.stringify(updatedList));
    loadPresell(duplicatedItem);
    showToast('Presell duplicada!');
  };

  const isDraftCard = (item: Presell) => {
    const draftFromFields = !item.titulo?.trim() || !item.ctaLink?.trim();
    if (item.id === activeId) {
      return !titulo.trim() || !ctaLink.trim();
    }
    return draftFromFields;
  };

  return (
    <PresellContext.Provider value={{
      presells, setPresells,
      activeId, setActiveId,
      titulo, setTitulo,
      subtitulo, setSubtitulo,
      imageUrl, setImageUrl,
      ctaText, setCtaText,
      ctaLink, setCtaLink,
      ctaColor, setCtaColor,
      themeColor, setThemeColor,
      textColor, setTextColor,
      borderRadius, setBorderRadius,
      faqList, setFaqList,
      hasImageBorder, setHasImageBorder,
      fontSizeTitulo, setFontSizeTitulo,
      fontSizeSubtitulo, setFontSizeSubtitulo,
      timerEnabled, setTimerEnabled,
      timerDuration, setTimerDuration,
      timerText, setTimerText,
      timerBgColor, setTimerBgColor,
      timerTextColor, setTimerTextColor,
      timerBorderRadius, setTimerBorderRadius,
      avisoEnabled, setAvisoEnabled,
      avisoTopo, setAvisoTopo,
      avisoPulse, setAvisoPulse,
      avisoBgColor, setAvisoBgColor,
      avisoTextColor, setAvisoTextColor,
      avisoWidth, setAvisoWidth,
      avisoPosition, setAvisoPosition,
      badgeEnabled, setBadgeEnabled,
      badgeText, setBadgeText,
      badgePulse, setBadgePulse,
      badgeBgColor, setBadgeBgColor,
      badgeTextColor, setBadgeTextColor,
      imageWidth, setImageWidth,
      imageAlign, setImageAlign,
      imagePosition, setImagePosition,
      imageFit, setImageFit,
      imageFullBleed, setImageFullBleed,
      headerEnabled, setHeaderEnabled,
      headerBrand, setHeaderBrand,
      headerMenuRaw, setHeaderMenuRaw,
      headerBgColor, setHeaderBgColor,
      headerTextColor, setHeaderTextColor,
      contentAlignment, setContentAlignment,
      footerEnabled, setFooterEnabled,
      footerText, setFooterText,
      footerBgColor, setFooterBgColor,
      footerTextColor, setFooterTextColor,
      footerPosition, setFooterPosition,
      ctaSize, setCtaSize,
      ctaWidth, setCtaWidth,
      faqFontSize, setFaqFontSize,
      faqAnswerFontSize, setFaqAnswerFontSize,
      toastMessage, showToast,
      hasUnsavedChanges, setHasUnsavedChanges,
      loadPresell, handleNewClick, handleSavePresell, handleDeletePresell, handleDeleteAllPresells, handleDuplicatePresell, isDraftCard
    }}>
      {children}
    </PresellContext.Provider>
  );
}

export function usePresell() {
  const context = useContext(PresellContext);
  if (context === undefined) {
    throw new Error('usePresell must be used within a PresellProvider');
  }
  return context;
}
