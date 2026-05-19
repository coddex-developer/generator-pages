'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  ExternalLink, 
  Smartphone, 
  Monitor, 
  Download, 
  Check, 
  Flame, 
  Layers, 
  FolderHeart,
  Palette,
  Eye,
  Settings,
  AlertCircle,
  Code,
  FileText,
  Clock,
  Zap,
  RotateCcw,
  Sliders,
  Sparkles,
  HelpCircle,
  Upload,
  ArrowRight,
  X,
  Type,
  Image as ImageIcon,
  Timer,
  BookOpen,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Layout,
  SlidersHorizontal,
  MousePointerClick
} from 'lucide-react';


export interface FAQItem {
  question: string;
  answer: string;
}

export interface Presell {
  id: string;
  titulo: string;
  subtitulo: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  ctaColor: string;
  themeColor: string; 
  textColor: string;  
  borderRadius: number;
  faq: FAQItem[];
  updatedAt: string;
  hasImageBorder: boolean;
  fontSizeTitulo: number;     
  fontSizeSubtitulo: number;  
  
  // Timer de Escassez
  timerEnabled: boolean;
  timerDuration: number;      
  timerText: string;          
  timerBgColor: string;
  timerTextColor: string;
  timerBorderRadius: number;

  // Aviso Superior (Urgência)
  avisoEnabled: boolean;
  avisoTopo: string;
  avisoPulse: boolean;
  avisoBgColor: string;
  avisoTextColor: string;
  avisoWidth: 'full' | 'card'; 
  avisoPosition: 'sticky' | 'top-card'; 

  // Badge de Destaque Superior
  badgeEnabled: boolean;
  badgeText: string;
  badgePulse: boolean;
  badgeBgColor: string;
  badgeTextColor: string;
  
  // Controles de Imagem Avançados
  imageWidth: number;         
  imageAlign: 'left' | 'center' | 'right';
  imagePosition: 'top' | 'middle' | 'bottom'; 
  imageFit: 'cover' | 'contain' | 'fill' | 'scale-down';
  imageFullBleed: boolean; // Se a imagem encosta nas bordas laterais do card
}

interface ColorPreset {
  name: string;
  value: string; 
  isLight?: boolean;
}

export default function App() {
  const [presells, setPresells] = useState<Presell[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Estados dos formulários (Presell ativa)
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
  const [newQuestion, setNewQuestion] = useState<string>('');
  const [newAnswer, setNewAnswer] = useState<string>('');

  // Estados de Personalização (Bordas, Tamanho de Fonte, Timer)
  const [hasImageBorder, setHasImageBorder] = useState<boolean>(true);
  const [fontSizeTitulo, setFontSizeTitulo] = useState<number>(28);
  const [fontSizeSubtitulo, setFontSizeSubtitulo] = useState<number>(14);
  
  // Estados do Timer
  const [timerEnabled, setTimerEnabled] = useState<boolean>(true);
  const [timerDuration, setTimerDuration] = useState<number>(15);
  const [timerText, setTimerText] = useState<string>('A oferta expira em:');
  const [timerBgColor, setTimerBgColor] = useState<string>('#020617');
  const [timerTextColor, setTimerTextColor] = useState<string>('#ffffff');
  const [timerBorderRadius, setTimerBorderRadius] = useState<number>(12);

  // Estados do Aviso Superior
  const [avisoEnabled, setAvisoEnabled] = useState<boolean>(true);
  const [avisoTopo, setAvisoTopo] = useState<string>('');
  const [avisoPulse, setAvisoPulse] = useState<boolean>(true);
  const [avisoBgColor, setAvisoBgColor] = useState<string>('#dc2626');
  const [avisoTextColor, setAvisoTextColor] = useState<string>('#ffffff');
  const [avisoWidth, setAvisoWidth] = useState<'full' | 'card'>('full');
  const [avisoPosition, setAvisoPosition] = useState<'sticky' | 'top-card'>('sticky');

  // Estados do Badge
  const [badgeEnabled, setBadgeEnabled] = useState<boolean>(true);
  const [badgeText, setBadgeText] = useState<string>('');
  const [badgePulse, setBadgePulse] = useState<boolean>(false);
  const [badgeBgColor, setBadgeBgColor] = useState<string>('#1e1b4b');
  const [badgeTextColor, setBadgeTextColor] = useState<string>('#c084fc');

  // Estados de Tamanho, Encaixe e Posicionamento de Imagem
  const [imageWidth, setImageWidth] = useState<number>(100);
  const [imageAlign, setImageAlign] = useState<'left' | 'center' | 'right'>('center');
  const [imagePosition, setImagePosition] = useState<'top' | 'middle' | 'bottom'>('bottom');
  const [imageFit, setImageFit] = useState<'cover' | 'contain' | 'fill' | 'scale-down'>('cover');
  const [imageFullBleed, setImageFullBleed] = useState<boolean>(false);

  // Controle de interface gráfica
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile'); 
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [importModalOpen, setImportModalOpen] = useState<boolean>(false);
  const [markdownHelpOpen, setMarkdownHelpOpen] = useState<boolean>(false);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [importJsonText, setImportJsonText] = useState<string>('');
  
  // Custom Confirmation Modal
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [customAlert, setCustomAlert] = useState<{title: string; message: string} | null>(null);

  // Referências para manipulação de cursor no Markdown
  const tituloRef = useRef<HTMLTextAreaElement>(null);
  const subtituloRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ctaColorPresets: ColorPreset[] = [
    { name: 'Verde Zap', value: '#22c55e' },
    { name: 'Vermelho VSL', value: '#ef4444' },
    { name: 'Azul Seguro', value: '#3b82f6' },
    { name: 'Laranja Quente', value: '#f97316' },
    { name: 'Roxo Premium', value: '#a855f7' },
    { name: 'Rosa Vibrante', value: '#ec4899' },
  ];

  const themePresets: ColorPreset[] = [
    { name: 'Slate Noturno', value: '#0b0f19' },
    { name: 'Obsidiana Escura', value: '#020617' },
    { name: 'Roxo Galaxy', value: 'linear-gradient(135deg, #12072b 0%, #03000a 100%)' },
    { name: 'Esmeralda Negra', value: 'linear-gradient(135deg, #021a11 0%, #000403 100%)' },
    { name: 'Vinho Royal', value: 'linear-gradient(135deg, #210212 0%, #050003 100%)' },
    { name: 'Minimalista Claro', value: '#f8fafc', isLight: true },
    { name: 'Gelo Sofisticado', value: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)', isLight: true },
    { name: 'Champanhe Premium', value: 'linear-gradient(135deg, #fafaf9 0%, #f5f5f4 100%)', isLight: true },
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

  const defaultTemplate: Presell = {
    id: 'demo-default',
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
    imageFullBleed: false
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
          handleLoadDefaultTemplate();
        }
      } catch (err) {
        handleLoadDefaultTemplate();
      }
    } else {
      handleLoadDefaultTemplate();
    }
  }, []);

  const handleLoadDefaultTemplate = () => {
    setPresells([defaultTemplate]);
    localStorage.setItem('v3_presell_items', JSON.stringify([defaultTemplate]));
    loadPresell(defaultTemplate);
  };

  useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

  const parseMarkdown = (text: string): string => {
    if (!text) return '';
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    
    html = html.replace(/\[(.*?)\]\{(.*?)\}/g, '<span style="color: $2" class="font-extrabold">$1</span>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-inherit">$1</strong>');
    html = html.replace(/\*(.*?)\*(?!\*)/g, '<em class="opacity-90">$1</em>');
    html = html.replace(/\n/g, '<br />');
    
    return html;
  };

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

    // Carregando propriedades do Timer
    setTimerEnabled(item.timerEnabled !== false);
    setTimerDuration(item.timerDuration || 15);
    setTimerText(item.timerText || 'A oferta expira em:');
    setTimerBgColor(item.timerBgColor || '#020617');
    setTimerTextColor(item.timerTextColor || '#ffffff');
    setTimerBorderRadius(item.timerBorderRadius !== undefined ? item.timerBorderRadius : 12);

    // Carregando propriedades do Aviso Superior
    setAvisoEnabled(item.avisoEnabled !== false);
    setAvisoTopo(item.avisoTopo || '');
    setAvisoPulse(item.avisoPulse !== false);
    setAvisoBgColor(item.avisoBgColor || '#dc2626');
    setAvisoTextColor(item.avisoTextColor || '#ffffff');
    setAvisoWidth(item.avisoWidth || 'full');
    setAvisoPosition(item.avisoPosition || 'sticky');

    // Carregando propriedades do Badge
    setBadgeEnabled(item.badgeEnabled !== false);
    setBadgeText(item.badgeText || '');
    setBadgePulse(item.badgePulse === true);
    setBadgeBgColor(item.badgeBgColor || '#1e1b4b');
    setBadgeTextColor(item.badgeTextColor || '#c084fc');
    
    // Configurações de mídia
    setImageWidth(item.imageWidth !== undefined ? item.imageWidth : 100);
    setImageAlign(item.imageAlign || 'center');
    setImagePosition(item.imagePosition || 'bottom');
    setImageFit(item.imageFit || 'cover');
    setImageFullBleed(item.imageFullBleed === true);
  };

  const handleNewClick = () => {
    const newId = 'id_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
    setActiveId(newId);
    setTitulo('');
    setSubtitulo('');
    setImageUrl('');
    setCtaText('');
    setCtaLink('');
    setCtaColor('#22c55e');
    setThemeColor('#0b0f19');
    setTextColor('#ffffff');
    setBorderRadius(16);
    setFaqList([]);
    setHasImageBorder(true);
    setFontSizeTitulo(28);
    setFontSizeSubtitulo(14);
    
    // Resetando Timer
    setTimerEnabled(false);
    setTimerDuration(15);
    setTimerText('A oferta expira em:');
    setTimerBgColor('#020617');
    setTimerTextColor('#ffffff');
    setTimerBorderRadius(12);

    // Resetando Aviso
    setAvisoEnabled(false);
    setAvisoTopo('');
    setAvisoPulse(true);
    setAvisoBgColor('#dc2626');
    setAvisoTextColor('#ffffff');
    setAvisoWidth('full');
    setAvisoPosition('sticky');

    // Resetando Badge
    setBadgeEnabled(false);
    setBadgeText('');
    setBadgePulse(false);
    setBadgeBgColor('#1e1b4b');
    setBadgeTextColor('#c084fc');

    setImageWidth(100);
    setImageAlign('center');
    setImagePosition('bottom');
    setImageFit('cover');
    setImageFullBleed(false);
    showToast('Novo projeto limpo pronto para personalização!');
  };

  const handleSavePresell = () => {
    if (!titulo || !ctaLink) {
      setCustomAlert({
        title: '⚠️ Campos Obrigatórios',
        message: 'Por favor, preencha o Título Principal e o Link de Destino do CTA para salvar o seu projeto.'
      });
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
      
      // Timer
      timerEnabled,
      timerDuration,
      timerText,
      timerBgColor,
      timerTextColor,
      timerBorderRadius,

      // Aviso
      avisoEnabled,
      avisoTopo,
      avisoPulse,
      avisoBgColor,
      avisoTextColor,
      avisoWidth,
      avisoPosition,

      // Badge
      badgeEnabled,
      badgeText,
      badgePulse,
      badgeBgColor,
      badgeTextColor,

      imageWidth,
      imageAlign,
      imagePosition,
      imageFit,
      imageFullBleed
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
    showToast(isNew ? '✨ Presell criada com sucesso!' : '💾 Alterações gravadas!');
  };

  const confirmDeleteAction = () => {
    if (!deleteConfirmId) return;
    const filtered = presells.filter(p => p.id !== deleteConfirmId);
    setPresells(filtered);
    localStorage.setItem('v3_presell_items', JSON.stringify(filtered));
    
    if (activeId === deleteConfirmId) {
      if (filtered.length > 0) {
        loadPresell(filtered[0]);
      } else {
        handleNewClick();
      }
    }
    
    setDeleteConfirmId(null);
    showToast('🗑️ Presell excluída permanentemente!');
  };

  const handleDuplicatePresell = (item: Presell, e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleAddFaqItem = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      showToast('⚠️ Preencha a pergunta e resposta para adicionar!');
      return;
    }
    const updatedFaq = [...faqList, { question: newQuestion.trim(), answer: newAnswer.trim() }];
    setFaqList(updatedFaq);
    setNewQuestion('');
    setNewAnswer('');
    showToast('❓ FAQ adicionado!');
  };

  const handleRemoveFaqItem = (index: number) => {
    const updatedFaq = faqList.filter((_, i) => i !== index);
    setFaqList(updatedFaq);
  };

  const handleImportJsonAction = (inputStr: string) => {
    try {
      const parsed = JSON.parse(inputStr);
      
      if (parsed && typeof parsed === 'object' && 'titulo' in parsed && 'ctaLink' in parsed) {
        const validatedItem: Presell = {
          id: parsed.id || 'id_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now(),
          titulo: String(parsed.titulo || ''),
          subtitulo: String(parsed.subtitulo || ''),
          imageUrl: String(parsed.imageUrl || ''),
          ctaText: String(parsed.ctaText || 'CLIQUE PARA ACESSAR'),
          ctaLink: String(parsed.ctaLink || ''),
          ctaColor: String(parsed.ctaColor || '#22c55e'),
          themeColor: String(parsed.themeColor || '#0b0f19'),
          textColor: String(parsed.textColor || '#ffffff'),
          borderRadius: typeof parsed.borderRadius === 'number' ? parsed.borderRadius : 16,
          faq: Array.isArray(parsed.faq) ? parsed.faq : [],
          updatedAt: new Date().toISOString(),
          hasImageBorder: parsed.hasImageBorder !== false,
          fontSizeTitulo: typeof parsed.fontSizeTitulo === 'number' ? parsed.fontSizeTitulo : 28,
          fontSizeSubtitulo: typeof parsed.fontSizeSubtitulo === 'number' ? parsed.fontSizeSubtitulo : 14,
          
          // Timer
          timerEnabled: parsed.timerEnabled === true,
          timerDuration: typeof parsed.timerDuration === 'number' ? parsed.timerDuration : 15,
          timerText: String(parsed.timerText || 'A oferta expira em:'),
          timerBgColor: String(parsed.timerBgColor || '#020617'),
          timerTextColor: String(parsed.timerTextColor || '#ffffff'),
          timerBorderRadius: typeof parsed.timerBorderRadius === 'number' ? parsed.timerBorderRadius : 12,

          // Aviso
          avisoEnabled: parsed.avisoEnabled !== false,
          avisoTopo: String(parsed.avisoTopo || ''),
          avisoPulse: parsed.avisoPulse !== false,
          avisoBgColor: String(parsed.avisoBgColor || '#dc2626'),
          avisoTextColor: String(parsed.avisoTextColor || '#ffffff'),
          avisoWidth: parsed.avisoWidth || 'full',
          avisoPosition: parsed.avisoPosition || 'sticky',

          // Badge
          badgeEnabled: parsed.badgeEnabled !== false,
          badgeText: String(parsed.badgeText || ''),
          badgePulse: parsed.badgePulse === true,
          badgeBgColor: String(parsed.badgeBgColor || '#1e1b4b'),
          badgeTextColor: String(parsed.badgeTextColor || '#c084fc'),

          imageWidth: typeof parsed.imageWidth === 'number' ? parsed.imageWidth : 100,
          imageAlign: parsed.imageAlign || 'center',
          imagePosition: parsed.imagePosition || 'bottom',
          imageFit: parsed.imageFit || 'cover',
          imageFullBleed: parsed.imageFullBleed === true
        };

        const listWithoutDuplicated = presells.filter(p => p.id !== validatedItem.id);
        const updatedList = [validatedItem, ...listWithoutDuplicated];
        setPresells(updatedList);
        localStorage.setItem('v3_presell_items', JSON.stringify(updatedList));
        loadPresell(validatedItem);
        setImportJsonText('');
        setImportModalOpen(false);
        showToast('📥 Projeto importado e ativado!');
      } else {
        setCustomAlert({
          title: '❌ Arquivo Incompatível',
          message: 'O JSON inserido não possui os atributos estruturais obrigatórios de uma página do RapidPresell.'
        });
      }
    } catch (e) {
      setCustomAlert({
        title: '❌ Erro de Leitura',
        message: 'Falha ao processar o texto JSON. Certifique-se de que a formatação do arquivo de backup está correta.'
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = e.target.files?.[0];
    if (file) {
      fileReader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          handleImportJsonAction(result);
        }
      };
      fileReader.readAsText(file);
    }
  };

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
    else if (tag === 'color') inserted = `[${selected || 'texto'}]{#22c55e}`;
    else if (tag === 'warning') inserted = `[${selected || 'importante'}]{#ef4444}`;

    const newValue = before + inserted + after;
    if (target === 'titulo') setTitulo(newValue);
    else setSubtitulo(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + inserted.length, start + inserted.length);
    }, 50);
  };

  const generateHTML = (): string => {
    const safeTitle = titulo.replace(/"/g, '&quot;');
    const isThemeGradient = themeColor.includes('linear-gradient') || themeColor.includes('radial-gradient');
    const alignClassValue = imageAlign === 'left' ? 'justify-start text-left' : imageAlign === 'right' ? 'justify-end text-right' : 'justify-center text-center';
    
    // Estilos de borda da imagem
    const imageStyle = hasImageBorder 
      ? `border: 2px solid rgba(255,255,255,0.15); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5), 0 0 15px ${ctaColor}20;` 
      : 'border: none; box-shadow: none;';

    // Se houver "card bleed", estica a imagem compensando o padding do container
    const isBleed = imageFullBleed;
    const bleedClasses = isBleed ? `mx-[-1.5rem] md:mx-[-2rem] w-[calc(100%+3rem)] md:w-[calc(100%+4rem)] rounded-none` : `w-full`;
    const bleedBorderRadiusStyle = isBleed ? 'border-radius: 0px;' : `border-radius: ${Math.max(4, borderRadius - 4)}px;`;

    const imageElementHTML = imageUrl ? `
    <div class="flex w-full ${alignClassValue.split(' ')[0]} mb-6">
        <div class="relative overflow-hidden aspect-video transition-all duration-300 ${bleedClasses}"
             style="width: ${isBleed ? 'auto' : imageWidth + '%'}; ${bleedBorderRadiusStyle} ${imageStyle}">
            <img 
                src="${imageUrl}" 
                alt="Imagem de Oferta" 
                class="w-full h-full"
                style="object-fit: ${imageFit};"
                loading="lazy"
            />
        </div>
    </div>` : '';

    const renderAvisoHTML = () => {
      if (!avisoEnabled || !avisoTopo) return '';
      const layoutClass = avisoWidth === 'full' ? 'w-full' : 'max-w-xl mx-auto rounded-xl mt-4';
      const positionClass = avisoPosition === 'sticky' && avisoWidth === 'full' ? 'sticky top-0 z-50' : 'relative';
      const pulseClass = avisoPulse ? 'animate-pulse' : '';
      
      return `<div class="${positionClass} ${layoutClass} ${pulseClass} text-center text-xs md:text-sm font-semibold py-2.5 px-4 shadow-md" style="background-color: ${avisoBgColor}; color: ${avisoTextColor};">
        ${avisoTopo}
      </div>`;
    };

    const renderBadgeHTML = () => {
      if (!badgeEnabled || !badgeText) return '';
      const pulseClass = badgePulse ? 'animate-pulse' : '';
      return `<div class="flex justify-center mb-5 ${pulseClass}">
          <span class="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-full border border-opacity-20 uppercase tracking-wider" style="background-color: ${badgeBgColor}; color: ${badgeTextColor}; border-color: ${badgeTextColor}40;">
              <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${badgeTextColor};"></span>
              ${badgeText}
          </span>
      </div>`;
    };

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${safeTitle}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background: ${isThemeGradient ? themeColor : 'none'};
            background-color: ${isThemeGradient ? 'transparent' : themeColor};
            color: ${textColor};
        }
        .pulse-btn {
            animation: pulse-animation 2.2s infinite;
        }
        @keyframes pulse-animation {
            0% { transform: scale(1); box-shadow: 0 0 0 0px ${ctaColor}80; }
            70% { transform: scale(1.03); box-shadow: 0 0 0 12px ${ctaColor}00; }
            100% { transform: scale(1); box-shadow: 0 0 0 0px ${ctaColor}00; }
        }
    </style>
</head>
<body class="min-h-screen flex flex-col justify-between selection:bg-violet-600 selection:text-white">

    <!-- Aviso Superior de Urgência (Fora do container principal caso posicionado no topo) -->
    ${avisoPosition === 'sticky' ? renderAvisoHTML() : ''}

    <!-- Container do Card -->
    <main class="flex-grow flex items-center justify-center px-4 py-8 md:py-16">
        <div class="max-w-xl w-full bg-slate-900/40 border border-slate-800/80 p-6 md:p-8 shadow-2xl backdrop-blur-md overflow-hidden" 
             style="border-radius: ${borderRadius}px; color: ${textColor};">
            
            <!-- Aviso Superior Posicionado no Card -->
            ${avisoPosition === 'top-card' ? `<div class="mb-5">${renderAvisoHTML()}</div>` : ''}

            <!-- Badge de Destaque -->
            ${renderBadgeHTML()}

            <!-- Imagem no Topo -->
            ${imagePosition === 'top' ? imageElementHTML : ''}

            <!-- Headline Principal -->
            <h1 class="font-extrabold text-center leading-tight mb-4 tracking-tight"
                style="font-size: ${fontSizeTitulo}px; color: ${textColor === '#ffffff' ? '#ffffff' : '#0f172a'};">
                ${parseMarkdown(titulo)}
            </h1>

            <!-- Imagem no Meio -->
            ${imagePosition === 'middle' ? imageElementHTML : ''}

            <!-- Subtítulo -->
            ${subtitulo ? `
            <p class="text-center leading-relaxed mb-6 opacity-90"
               style="font-size: ${fontSizeSubtitulo}px;">
                ${parseMarkdown(subtitulo)}
            </p>` : ''}

            <!-- Imagem na Base -->
            ${imagePosition === 'bottom' ? imageElementHTML : ''}

            <!-- Timer de Escassez Customizado -->
            ${timerEnabled ? `
            <div class="border border-slate-800/50 p-4 mb-6 text-center" style="background-color: ${timerBgColor}; color: ${timerTextColor}; border-radius: ${timerBorderRadius}px;">
                <p class="text-[11px] uppercase tracking-wider opacity-60 mb-2 font-bold">${timerText}</p>
                <div class="flex items-center justify-center gap-3">
                    <div class="flex flex-col">
                        <span id="t-min" class="text-2xl font-black">00</span>
                        <span class="text-[9px] opacity-40 uppercase">Minutos</span>
                    </div>
                    <span class="text-2xl font-bold opacity-40">:</span>
                    <div class="flex flex-col">
                        <span id="t-sec" class="text-2xl font-black">00</span>
                        <span class="text-[9px] opacity-40 uppercase">Segundos</span>
                    </div>
                </div>
            </div>` : ''}

            <!-- Botão de CTA Pulsante -->
            <div class="space-y-4">
                <a 
                    href="${ctaLink}" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="pulse-btn block w-full py-4 px-6 font-extrabold text-center text-white transition-all duration-300 transform hover:scale-[1.03] text-base md:text-lg uppercase tracking-wider"
                    style="background-color: ${ctaColor}; border-radius: ${Math.max(4, borderRadius - 4)}px; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);"
                >
                    ${ctaText || 'CLIQUE PARA CONTINUAR'}
                </a>

                <!-- Termos e Direitos de Privacidade -->
                <div class="flex justify-center gap-4 text-[10px] md:text-xs text-slate-500 mt-6">
                    <a href="#" class="hover:underline">Políticas de Privacidade</a>
                    <span>•</span>
                    <a href="#" class="hover:underline">Termos de Uso</a>
                </div>
            </div>

            <!-- Seção de FAQ Acoplada -->
            ${faqList && faqList.length > 0 ? `
            <div class="mt-8 pt-8 border-t border-slate-800/80">
                <h3 class="text-base md:text-lg font-black text-center mb-4 uppercase tracking-wider">Perguntas Frequentes</h3>
                <div class="space-y-3">
                    ${faqList.map((item) => `
                    <details class="group bg-slate-950/45 border border-slate-800/80 p-4 rounded-xl transition-all duration-300 [&_summary::-webkit-details-marker]:hidden">
                        <summary class="flex items-center justify-between cursor-pointer focus:outline-none list-none">
                            <h4 class="text-sm font-extrabold pr-4 text-inherit">${item.question}</h4>
                            <span class="transition-transform duration-300 group-open:rotate-180 text-violet-400">
                                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                                </svg>
                            </span>
                        </summary>
                        <p class="text-xs md:text-sm opacity-80 mt-3 leading-relaxed border-t border-slate-800/40 pt-3">
                            ${item.answer.replace(/\n/g, '<br />')}
                        </p>
                    </details>
                    `).join('')}
                </div>
            </div>` : ''}

        </div>
    </main>

    <!-- Rodapé -->
    <footer class="text-center py-4 text-[11px] text-slate-600 border-t border-slate-950 bg-slate-950/40">
        <p>&copy; ${new Date().getFullYear()} - Todos os direitos reservados.</p>
        <p class="mt-1">Este site não possui vínculo comercial com o Google ou Facebook.</p>
    </footer>

    <!-- Timer Script (Cookie/Local Persistente) -->
    ${timerEnabled ? `
    <script>
        (function() {
            const STORAGE_KEY = 'presell_t_end_' + '${activeId || 'p'}';
            const durationMs = ${timerDuration} * 60 * 1000;
            let targetTime = localStorage.getItem(STORAGE_KEY);
            
            if (!targetTime) {
                targetTime = Date.now() + durationMs;
                localStorage.setItem(STORAGE_KEY, targetTime);
            } else {
                targetTime = parseInt(targetTime);
                if (Date.now() > targetTime) {
                    targetTime = Date.now() + durationMs;
                    localStorage.setItem(STORAGE_KEY, targetTime);
                }
            }

            function updateTimer() {
                const diff = targetTime - Date.now();
                if (diff <= 0) {
                    document.getElementById('t-min').innerText = '00';
                    document.getElementById('t-sec').innerText = '00';
                    return;
                }
                const min = Math.floor(diff / 1000 / 60);
                const sec = Math.floor((diff / 1000) % 60);
                
                document.getElementById('t-min').innerText = String(min).padStart(2, '0');
                document.getElementById('t-sec').innerText = String(sec).padStart(2, '0');
            }

            updateTimer();
            setInterval(updateTimer, 1000);
        })();
    </script>` : ''}

</body>
</html>`;
  };

  const handleCopyCode = () => {
    const htmlCode = generateHTML();
    const textArea = document.createElement("textarea");
    textArea.value = htmlCode;
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopiedId('code');
      setTimeout(() => setCopiedId(null), 2500);
      showToast('📋 Código HTML copiado com sucesso!');
    } catch (err) {
      console.error('Falha ao copiar código', err);
    }
    document.body.removeChild(textArea);
  };

  const [timeLeft, setTimeLeft] = useState<number>(timerDuration * 60);
  useEffect(() => {
    if (!timerEnabled) return;
    
    // Timer inteligente no navegador que usa localStorage para simular a persistência
    const STORAGE_KEY = `presell_t_end_${activeId || 'preview'}`;
    let targetTime = localStorage.getItem(STORAGE_KEY);
    
    if (!targetTime) {
      const futureTime = Date.now() + timerDuration * 60 * 1000;
      localStorage.setItem(STORAGE_KEY, String(futureTime));
      targetTime = String(futureTime);
    }

    const interval = setInterval(() => {
      const diff = parseInt(targetTime!) - Date.now();
      if (diff <= 0) {
        // Reinicia caso finalize
        const futureTime = Date.now() + timerDuration * 60 * 1000;
        localStorage.setItem(STORAGE_KEY, String(futureTime));
        setTimeLeft(timerDuration * 60);
      } else {
        setTimeLeft(Math.floor(diff / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timerEnabled, timerDuration, activeId]);

  const formatPreviewTime = () => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    return {
      min: String(m >= 0 ? m : 0).padStart(2, '0'),
      sec: String(s >= 0 ? s : 0).padStart(2, '0')
    };
  };

  const formatTime = formatPreviewTime();
  const isThemeGradient = themeColor.includes('linear-gradient') || themeColor.includes('radial-gradient');

  // Helper para renderizar a imagem com tamanho, encaixe e posicionamento flexível
  const renderImage = () => {
    if (!imageUrl || imageError) {
      return (
        <div className="w-full aspect-video bg-slate-900/40 border border-dashed border-slate-800 rounded-xl mb-6 flex flex-col items-center justify-center p-4">
          <AlertCircle className="w-7 h-7 text-amber-500/60 mb-1.5" />
          <span className="text-[11px] text-slate-400 text-center font-bold">
            {imageError ? 'URL da Imagem está quebrada' : 'Nenhuma imagem configurada'}
          </span>
          <span className="text-[9px] text-slate-600 mt-0.5 text-center">Adicione um link de imagem direta</span>
        </div>
      );
    }

    const alignmentClasses = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end'
    };

    // Estilo adaptado para "card bleed" (imagem que toma a largura inteira do card eliminando as margens)
    const containerClasses = imageFullBleed 
      ? 'mx-[-1.25rem] md:mx-[-2rem] w-[calc(100%+2.5rem)] md:w-[calc(100%+4rem)] rounded-none'
      : '';

    const customBorderRadius = imageFullBleed ? '0px' : `${Math.max(4, borderRadius - 4)}px`;

    return (
      <div className={`flex w-full mb-6 ${alignmentClasses[imageAlign]} ${containerClasses}`}>
        <div 
          className="relative overflow-hidden aspect-video transition-all duration-300"
          style={{ 
            width: imageFullBleed ? '100%' : `${imageWidth}%`,
            borderRadius: customBorderRadius,
            border: hasImageBorder && !imageFullBleed ? '2px solid rgba(255,255,255,0.15)' : 'none',
            boxShadow: hasImageBorder && !imageFullBleed ? `0 10px 20px rgba(0,0,0,0.5), 0 0 15px ${ctaColor}15` : 'none'
          }}
        >
          <img 
            src={imageUrl} 
            alt="Pré-visualização" 
            className="w-full h-full"
            style={{ objectFit: imageFit }}
            onError={() => setImageError(true)}
          />
        </div>
      </div>
    );
  };

  const renderAvisoPreview = () => {
    if (!avisoEnabled || !avisoTopo) return null;
    return (
      <div 
        className={`text-center text-[10px] md:text-xs font-bold py-1.5 px-3 shadow-md tracking-wide z-10 
          ${avisoPulse ? 'animate-pulse' : ''}
          ${avisoWidth === 'card' ? 'mx-4 mt-2 rounded-xl' : 'w-full'}
        `}
        style={{ backgroundColor: avisoBgColor, color: avisoTextColor }}
      >
        {avisoTopo}
      </div>
    );
  };

  const renderBadgePreview = () => {
    if (!badgeEnabled || !badgeText) return null;
    return (
      <div className={`mb-4 flex justify-center ${badgePulse ? 'animate-pulse' : ''}`}>
        <span 
          className="inline-flex items-center gap-1 text-[10px] font-black px-3.5 py-1 rounded-full border uppercase tracking-widest"
          style={{ backgroundColor: badgeBgColor, color: badgeTextColor, borderColor: `${badgeTextColor}30` }}
        >
          {badgeText}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-violet-600 selection:text-white relative">
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes custom-pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0px ${ctaColor}80; }
          70% { transform: scale(1.03); box-shadow: 0 0 0 10px rgba(0,0,0,0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0px rgba(0,0,0,0); }
        }
        .next-preview-pulse {
          animation: custom-pulse 2.2s infinite;
        }
        details > summary {
          list-style: none;
        }
        details > summary::-webkit-details-marker {
          display: none;
        }
      `}} />

      {/* ALERTA TOAST */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-800/80 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-slide-up">
          <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400" />
          <span className="text-sm font-semibold text-white">{toastMessage}</span>
        </div>
      )}

      {/* HEADER DE NAVEGAÇÃO */}
      <header className="border-b border-slate-850 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-tr from-violet-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-violet-500/15">
              <Flame className="w-5.5 h-5.5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white tracking-tight text-base">RapidPresell v4.0</span>
                <span className="bg-violet-500/10 text-violet-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-violet-500/20">Hyper Design</span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Foco de Escassez, Design de Timer Elevado & Customização de Componentes</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setImportModalOpen(true)}
              className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 border border-slate-700/80"
              title="Importar projeto externo JSON"
            >
              <Upload className="w-4 h-4" />
              <span>Importar</span>
            </button>

            <button 
              onClick={handleNewClick}
              className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 border border-slate-700/80"
              title="Iniciar nova configuração em branco"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Criar Novo</span>
            </button>
            
            <button
              onClick={() => {
                handleSavePresell();
                setExportModalOpen(true);
              }}
              disabled={!titulo || !ctaLink}
              className={`text-xs font-extrabold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-md ${
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

      {/* CONTEÚDO PRINCIPAL - SPLIT SCREEN */}
      <main className="flex-grow max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 items-start">
        
        {/* COLUNA ESQUERDA: EDITOR E HISTÓRICO - Rola de forma independente */}
        <section className="lg:col-span-6 xl:col-span-5 flex flex-col gap-6 overflow-y-auto pr-0 lg:pr-2">
          
          {/* PAINEL CRUD: HISTÓRICO LOCAL */}
          <div className="bg-slate-900/80 border border-slate-850 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FolderHeart className="w-4 h-4 text-pink-500" />
                Minhas Presells ({presells.length})
              </h2>
              <span className="text-[10px] text-slate-500 font-mono">Navegador</span>
            </div>

            {presells.length === 0 ? (
              <div className="text-center py-5 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                Nenhum projeto salvo. Comece digitando abaixo!
              </div>
            ) : (
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
                {presells.map((item) => {
                  const isActive = item.id === activeId;
                  return (
                    <div 
                      key={item.id}
                      onClick={() => loadPresell(item)}
                      className={`flex-shrink-0 w-44 p-3 rounded-xl border transition-all cursor-pointer relative group ${
                        isActive 
                        ? 'bg-slate-800/80 border-violet-500/50 shadow-md' 
                        : 'bg-slate-950/40 border-slate-850 hover:bg-slate-800/30'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-1 mb-1.5">
                        <span className="text-[9px] font-semibold text-slate-500 flex items-center gap-0.5">
                          <Clock className="w-3 h-3" />
                          {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('pt-BR') : 'Sem data'}
                        </span>
                        
                        <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                          <button 
                            title="Duplicar"
                            onClick={(e) => handleDuplicatePresell(item, e)}
                            className="p-1 rounded bg-slate-900 hover:bg-slate-700 text-slate-400 hover:text-white"
                          >
                            <Layers className="w-3 h-3" />
                          </button>
                          <button 
                            title="Excluir"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmId(item.id);
                            }}
                            className="p-1 rounded bg-slate-900 hover:bg-red-950 text-slate-400 hover:text-red-450"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-xs font-bold text-slate-200 truncate group-hover:text-white">
                        {item.titulo.replace(/\*\*|\*|\[|\]\{(.*?)\}/g, '') || 'Nova Presell'}
                      </h3>
                      <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                        {item.ctaLink || 'Sem Link'}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* FORMULÁRIO CONFIGURADOR COM DESIGN PREMIUM */}
          <div className="bg-slate-900/90 border border-slate-850 rounded-3xl p-5 md:p-6 shadow-xl flex flex-col gap-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-violet-600 to-indigo-600"></div>

            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Settings className="w-4.5 h-4.5 text-violet-500" />
                  Configurar Presell
                </h2>
                <p className="text-[11px] text-slate-400">Personalização milimétrica do seu funil</p>
              </div>

              {activeId && (
                <span className="bg-slate-950 text-slate-500 text-[10px] font-mono px-2 py-1 rounded-md border border-slate-800">
                  ID: {activeId.slice(-6)}
                </span>
              )}
            </div>

            <hr className="border-slate-850" />

            {/* SEÇÃO 1: APARÊNCIA GERAL & PRESETS DE TEMA */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-violet-400 uppercase tracking-widest flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-violet-400" />
                Tema Geral do Card & Fundo
              </h3>

              {/* Tema de Cores do Fundo */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Selecione o Estilo de Fundo do Site</label>
                <div className="grid grid-cols-2 gap-1.5 mb-2.5">
                  {themePresets.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setThemeColor(preset.value);
                        setTextColor(preset.isLight ? '#0f172a' : '#ffffff');
                      }}
                      className={`p-2 rounded-xl border text-[10px] flex items-center gap-2 transition-all ${
                        themeColor === preset.value 
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
                    <label className="block text-[10px] text-slate-400 mb-1">Fundo Customizado (Hex ou Gradient)</label>
                    <div className="flex items-center gap-2">
                      <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-800 flex-shrink-0">
                        <input 
                          type="color" 
                          value={themeColor.startsWith('#') ? themeColor : '#0b0f19'}
                          onChange={(e) => setThemeColor(e.target.value)}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 cursor-pointer"
                        />
                      </div>
                      <input 
                        type="text" 
                        value={themeColor}
                        onChange={(e) => setThemeColor(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 focus:border-violet-500 rounded-xl px-2.5 py-1 text-xs text-slate-200 outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="w-1/3">
                    <label className="block text-[10px] text-slate-400 mb-1">Cor Base dos Textos</label>
                    <select
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 focus:border-violet-500 rounded-xl px-2 py-1.5 text-xs text-slate-200 outline-none"
                    >
                      <option value="#ffffff">Claro (Branco)</option>
                      <option value="#0f172a">Escuro (Chumbo)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Arredondamento do Card */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 mt-1">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                    Arredondamento das Bordas do Card
                  </span>
                  <span className="text-xs font-bold text-violet-400 font-mono">{borderRadius}px</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="24" 
                  value={borderRadius} 
                  onChange={(e) => setBorderRadius(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
                />
              </div>
            </div>

            <hr className="border-slate-850" />

            {/* SEÇÃO 2: NOVO AVISO SUPERIOR ULTRA EDITÁVEL */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-black text-violet-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Layout className="w-3.5 h-3.5 text-violet-400" />
                  Aviso Superior (Urgência)
                </h3>

                {/* Botão liga/desliga o Aviso */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-bold">Mostrar Aviso:</span>
                  <button
                    type="button"
                    onClick={() => setAvisoEnabled(!avisoEnabled)}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                      avisoEnabled ? 'bg-violet-600' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        avisoEnabled ? 'translate-x-5.5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {avisoEnabled && (
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-4">
                  {/* Texto do Aviso */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Texto do Alerta de Urgência</label>
                    <input 
                      type="text" 
                      value={avisoTopo}
                      onChange={(e) => setAvisoTopo(e.target.value)}
                      placeholder="Ex: ATENÇÃO: Últimas vagas com desconto!"
                      className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-violet-500 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
                    />
                  </div>

                  {/* Estilo e Animação */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Largura</label>
                      <select
                        value={avisoWidth}
                        onChange={(e) => setAvisoWidth(e.target.value as 'full' | 'card')}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 outline-none font-bold"
                      >
                        <option value="full">Largura do Site (100%)</option>
                        <option value="card">Mesma Largura do Card</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Posição</label>
                      <select
                        value={avisoPosition}
                        onChange={(e) => setAvisoPosition(e.target.value as 'sticky' | 'top-card')}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 outline-none font-bold"
                      >
                        <option value="sticky">Topo da Tela (Fixo)</option>
                        <option value="top-card">Topo do Card (Interno)</option>
                      </select>
                    </div>
                  </div>

                  {/* Customizar Cor e Pulsação */}
                  <div className="space-y-3 pt-2 border-t border-slate-900">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400">Presets de Cores Rápidas:</span>
                      
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-400">Animação Pulsante:</span>
                        <button
                          type="button"
                          onClick={() => setAvisoPulse(!avisoPulse)}
                          className={`relative inline-flex h-4.5 w-9 items-center rounded-full transition-colors ${
                            avisoPulse ? 'bg-violet-600' : 'bg-slate-850'
                          }`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                              avisoPulse ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {avisoColorPresets.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            setAvisoBgColor(preset.bg);
                            setAvisoTextColor(preset.text);
                          }}
                          className="p-1 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-850 text-[9px] flex items-center gap-1"
                        >
                          <span className="w-2.5 h-2.5 rounded-full block border border-white/10" style={{ backgroundColor: preset.bg }}></span>
                          <span className="text-[8px] text-slate-400">{preset.name}</span>
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] text-slate-500 mb-0.5">Cor de Fundo do Alerta</label>
                        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1">
                          <input type="color" value={avisoBgColor} onChange={(e) => setAvisoBgColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer border-none bg-transparent" />
                          <input type="text" value={avisoBgColor} onChange={(e) => setAvisoBgColor(e.target.value)} className="w-full bg-transparent text-[10px] font-mono outline-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] text-slate-500 mb-0.5">Cor da Letra do Alerta</label>
                        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1">
                          <input type="color" value={avisoTextColor} onChange={(e) => setAvisoTextColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer border-none bg-transparent" />
                          <input type="text" value={avisoTextColor} onChange={(e) => setAvisoTextColor(e.target.value)} className="w-full bg-transparent text-[10px] font-mono outline-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <hr className="border-slate-850" />

            {/* SEÇÃO 3: BADGE DE DESTAQUE SUPERIOR EDITÁVEL */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-black text-violet-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  Selo de Destaque Superior (Badge)
                </h3>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-bold">Mostrar Selo:</span>
                  <button
                    type="button"
                    onClick={() => setBadgeEnabled(!badgeEnabled)}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                      badgeEnabled ? 'bg-violet-600' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        badgeEnabled ? 'translate-x-5.5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {badgeEnabled && (
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-4">
                  <div className="grid grid-cols-3 gap-3 items-end">
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-slate-300 mb-1">Texto do Selinho</label>
                      <input 
                        type="text" 
                        value={badgeText}
                        onChange={(e) => setBadgeText(e.target.value)}
                        placeholder="Ex: MÉTODO INÉDITO 2026"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
                      />
                    </div>

                    <div className="flex flex-col items-center justify-center bg-slate-900/50 border border-slate-850 p-1.5 rounded-xl">
                      <span className="text-[9px] text-slate-400 mb-1">Pulsar Selo:</span>
                      <button
                        type="button"
                        onClick={() => setBadgePulse(!badgePulse)}
                        className={`relative inline-flex h-4.5 w-9 items-center rounded-full transition-colors ${
                          badgePulse ? 'bg-violet-600' : 'bg-slate-800'
                        }`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                            badgePulse ? 'translate-x-5' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-900">
                    <div>
                      <label className="block text-[9px] text-slate-500 mb-0.5">Fundo do Selo</label>
                      <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1">
                        <input type="color" value={badgeBgColor} onChange={(e) => setBadgeBgColor(e.target.value)} className="w-5 h-5 rounded cursor-pointer border-none bg-transparent" />
                        <input type="text" value={badgeBgColor} onChange={(e) => setBadgeBgColor(e.target.value)} className="w-full bg-transparent text-[10px] font-mono outline-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] text-slate-500 mb-0.5">Letra do Selo</label>
                      <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1">
                        <input type="color" value={badgeTextColor} onChange={(e) => setBadgeTextColor(e.target.value)} className="w-5 h-5 rounded cursor-pointer border-none bg-transparent" />
                        <input type="text" value={badgeTextColor} onChange={(e) => setBadgeTextColor(e.target.value)} className="w-full bg-transparent text-[10px] font-mono outline-none" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <hr className="border-slate-850" />

            {/* SEÇÃO 4: TEXTOS COM SUPORTE A MARKDOWN */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-black text-violet-400 uppercase tracking-widest flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-violet-400" />
                  Textos da Página & Markdown
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

              {/* Título Principal */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-300">Título Principal <span className="text-red-500">*</span></label>
                  
                  {/* Atalhos Markdown Título */}
                  <div className="flex gap-1.5">
                    <button 
                      type="button" 
                      onClick={() => insertMarkdown('bold', 'titulo')}
                      className="bg-slate-950 hover:bg-slate-850 text-slate-300 px-1.5 py-0.5 rounded text-[10px] font-bold border border-slate-800"
                      title="Negrito"
                    >
                      B
                    </button>
                    <button 
                      type="button" 
                      onClick={() => insertMarkdown('italic', 'titulo')}
                      className="bg-slate-950 hover:bg-slate-850 text-slate-300 px-1.5 py-0.5 rounded text-[10px] italic border border-slate-800"
                      title="Itálico"
                    >
                      I
                    </button>
                    <button 
                      type="button" 
                      onClick={() => insertMarkdown('color', 'titulo')}
                      className="bg-slate-950 hover:bg-slate-850 text-violet-400 px-1.5 py-0.5 rounded text-[10px] font-bold border border-slate-800"
                      title="Colorir com Paleta"
                    >
                      🎨
                    </button>
                  </div>
                </div>
                <textarea 
                  ref={tituloRef}
                  rows={2}
                  maxLength={250}
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex: Ganhe [descontos exclusivos]{#22c55e} hoje!"
                  className="w-full bg-slate-950 border border-slate-850 hover:border-slate-700 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl px-3 py-2 text-xs text-slate-200 transition-all outline-none resize-none font-bold"
                />
              </div>

              {/* Subtítulo Markdown */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                    Subtítulo / Descrição
                  </label>
                  
                  {/* Atalhos Markdown Subtítulo */}
                  <div className="flex gap-1.5">
                    <button 
                      type="button" 
                      onClick={() => insertMarkdown('bold', 'subtitulo')}
                      className="bg-slate-950 hover:bg-slate-850 text-slate-300 px-1.5 py-0.5 rounded text-[10px] font-bold border border-slate-800"
                      title="Negrito"
                    >
                      B
                    </button>
                    <button 
                      type="button" 
                      onClick={() => insertMarkdown('italic', 'subtitulo')}
                      className="bg-slate-950 hover:bg-slate-850 text-slate-300 px-1.5 py-0.5 rounded text-[10px] italic border border-slate-800"
                      title="Itálico"
                    >
                      I
                    </button>
                    <button 
                      type="button" 
                      onClick={() => insertMarkdown('color', 'subtitulo')}
                      className="bg-slate-950 hover:bg-slate-850 text-violet-400 px-1.5 py-0.5 rounded text-[10px] font-bold border border-slate-800"
                      title="Colorir Texto"
                    >
                      🎨
                    </button>
                  </div>
                </div>
                <textarea 
                  ref={subtituloRef}
                  rows={3}
                  value={subtitulo}
                  onChange={(e) => setSubtitulo(e.target.value)}
                  placeholder="Explique o que ele vai ganhar ao acessar o link..."
                  className="w-full bg-slate-950 border border-slate-850 hover:border-slate-700 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl px-3 py-2 text-xs text-slate-200 transition-all outline-none resize-none leading-relaxed"
                />
              </div>

              {/* ESCALA DE FONTES */}
              <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-850">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-slate-300">Tam. Título</span>
                    <span className="text-xs text-violet-400 font-mono font-bold">{fontSizeTitulo}px</span>
                  </div>
                  <input 
                    type="range" 
                    min="20" 
                    max="48" 
                    value={fontSizeTitulo} 
                    onChange={(e) => setFontSizeTitulo(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-violet-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-slate-300">Tam. Subtítulo</span>
                    <span className="text-xs text-violet-400 font-mono font-bold">{fontSizeSubtitulo}px</span>
                  </div>
                  <input 
                    type="range" 
                    min="12" 
                    max="24" 
                    value={fontSizeSubtitulo} 
                    onChange={(e) => setFontSizeSubtitulo(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-violet-500"
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-850" />

            {/* SEÇÃO 5: MÍDIA, ENCAIXE & SANGRIA DO CARD */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-black text-violet-400 uppercase tracking-widest flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-violet-400" />
                  Mídia & Imagem do Produto
                </h3>
                
                {/* Toggle Switch para Bordas */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-bold">Bordas / Glow:</span>
                  <button
                    type="button"
                    onClick={() => setHasImageBorder(!hasImageBorder)}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                      hasImageBorder ? 'bg-violet-600' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        hasImageBorder ? 'translate-x-5.5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">URL da Imagem</label>
                <input 
                  type="url" 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Ex: https://images.unsplash.com/..."
                  className="w-full bg-slate-950 border border-slate-850 hover:border-slate-700 focus:border-violet-500 rounded-xl px-3 py-2 text-xs text-slate-200 transition-all outline-none font-mono text-[11px]"
                />
              </div>

              {/* CONTROLES DE POSICIONAMENTO E TAMANHO DA IMAGEM */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Estilo de Encaixe & Sangria</span>
                  
                  {/* Opção Bleed Card (Imagem nas pontas laterais) */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400">Sangria Total (Card Bleed):</span>
                    <button
                      type="button"
                      onClick={() => setImageFullBleed(!imageFullBleed)}
                      className={`relative inline-flex h-4.5 w-9 items-center rounded-full transition-colors ${
                        imageFullBleed ? 'bg-violet-600' : 'bg-slate-800'
                      }`}
                      title="Força a imagem a preencher toda a largura do card, removendo o espaçamento interno do layout"
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          imageFullBleed ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* 1. Tamanho (Largura) Slider (Se não for full bleed) */}
                {!imageFullBleed && (
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold text-slate-300">Largura Máxima da Imagem</label>
                      <span className="text-xs font-mono font-bold text-violet-400">{imageWidth}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="30" 
                      max="100" 
                      value={imageWidth} 
                      onChange={(e) => setImageWidth(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  {/* 2. Modos de Object-Fit (Cover, Contain, etc.) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Encaixe Visual (Object Fit)</label>
                    <select
                      value={imageFit}
                      onChange={(e) => setImageFit(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 outline-none font-bold"
                    >
                      <option value="cover">Preencher (Cover)</option>
                      <option value="contain">Conter tudo (Contain)</option>
                      <option value="fill">Esticar (Fill)</option>
                      <option value="scale-down">Diminuir Se Necessário</option>
                    </select>
                  </div>

                  {/* 3. Posicionamento Vertical */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Posição Vertical</label>
                    <select
                      value={imagePosition}
                      onChange={(e) => setImagePosition(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 outline-none font-bold"
                    >
                      <option value="top">No Topo (Acima do Título)</option>
                      <option value="middle">No Meio (Entre Headline e Sub)</option>
                      <option value="bottom">Na Base (Abaixo de Tudo)</option>
                    </select>
                  </div>
                </div>

                {/* Alinhamento Horizontal */}
                {!imageFullBleed && (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Alinhamento Horizontal</label>
                    <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-800">
                      <button
                        type="button"
                        onClick={() => setImageAlign('left')}
                        className={`flex-1 flex justify-center py-1.5 rounded-lg transition-all ${imageAlign === 'left' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                        <AlignLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageAlign('center')}
                        className={`flex-1 flex justify-center py-1.5 rounded-lg transition-all ${imageAlign === 'center' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                        <AlignCenter className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageAlign('right')}
                        className={`flex-1 flex justify-center py-1.5 rounded-lg transition-all ${imageAlign === 'right' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                        <AlignRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <hr className="border-slate-850" />

            {/* SEÇÃO 6: TIMER DE ESCASSEZ TOTALMENTE EDITÁVEL */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-black text-violet-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Timer className="w-3.5 h-3.5 text-violet-400" />
                  Timer Regressivo Personalizável
                </h3>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-bold">Ativar Timer:</span>
                  <button
                    type="button"
                    onClick={() => setTimerEnabled(!timerEnabled)}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                      timerEnabled ? 'bg-violet-600' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        timerEnabled ? 'translate-x-5.5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {timerEnabled && (
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-4">
                  {/* Tempo e Título */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">Texto do Timer</label>
                      <input 
                        type="text" 
                        value={timerText}
                        onChange={(e) => setTimerText(e.target.value)}
                        placeholder="Ex: A oferta expira em:"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 outline-none font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">Duração (Min)</label>
                      <input 
                        type="number" 
                        min="1"
                        max="180"
                        value={timerDuration}
                        onChange={(e) => setTimerDuration(Math.max(1, parseInt(e.target.value) || 15))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Arredondamento do Timer */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-slate-400">Arredondamento do Bloco</span>
                      <span className="text-xs text-violet-400 font-mono font-bold">{timerBorderRadius}px</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="24" 
                      value={timerBorderRadius} 
                      onChange={(e) => setTimerBorderRadius(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
                    />
                  </div>

                  {/* Cores e Fundo do Timer */}
                  <div className="space-y-3 pt-2 border-t border-slate-900">
                    <span className="text-[10px] font-bold text-slate-400 block">Presets Rápidos de Estilo do Timer:</span>
                    
                    <div className="flex flex-wrap gap-1.5">
                      {timerColorPresets.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            setTimerBgColor(preset.bg);
                            setTimerTextColor(preset.text);
                          }}
                          className="p-1 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-850 text-[9px] flex items-center gap-1"
                        >
                          <span className="w-2.5 h-2.5 rounded-md block border border-white/10" style={{ backgroundColor: preset.bg }}></span>
                          <span className="text-[8px] text-slate-400">{preset.name}</span>
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] text-slate-500 mb-0.5">Cor de Fundo do Timer</label>
                        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1">
                          <input type="color" value={timerBgColor} onChange={(e) => setTimerBgColor(e.target.value)} className="w-5 h-5 rounded cursor-pointer border-none bg-transparent" />
                          <input type="text" value={timerBgColor} onChange={(e) => setTimerBgColor(e.target.value)} className="w-full bg-transparent text-[10px] font-mono outline-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] text-slate-500 mb-0.5">Cor das Letras/Números</label>
                        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1">
                          <input type="color" value={timerTextColor} onChange={(e) => setTimerTextColor(e.target.value)} className="w-5 h-5 rounded cursor-pointer border-none bg-transparent" />
                          <input type="text" value={timerTextColor} onChange={(e) => setTimerTextColor(e.target.value)} className="w-full bg-transparent text-[10px] font-mono outline-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <hr className="border-slate-850" />

            {/* SEÇÃO 7: CONFIGURAÇÃO DO BOTÃO DE CTA */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-violet-400 uppercase tracking-widest flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-violet-400" />
                Chamada para Ação (CTA)
              </h3>

              {/* Texto do Botão */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Texto do Botão de Ação</label>
                <input 
                  type="text" 
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="Ex: SIM! QUERO ESSA OPORTUNIDADE"
                  className="w-full bg-slate-950 border border-slate-850 hover:border-slate-700 focus:border-violet-500 rounded-xl px-3 py-2.5 text-xs text-slate-200 transition-all outline-none font-black tracking-wider uppercase"
                />
              </div>

              {/* Link de Destino */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Link de Destino do CTA <span className="text-red-500">*</span></label>
                <input 
                  type="url" 
                  value={ctaLink}
                  onChange={(e) => setCtaLink(e.target.value)}
                  placeholder="Ex: https://checkout.exemplo.com..."
                  className="w-full bg-slate-950 border border-slate-850 hover:border-slate-700 focus:border-violet-500 rounded-xl px-3 py-2 text-xs text-slate-200 transition-all outline-none font-mono text-[11px]"
                />
              </div>

              {/* Seletor Customizado de Cores do CTA */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Cor do CTA</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {ctaColorPresets.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setCtaColor(color.value)}
                      className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-900 flex items-center gap-1.5 transition-all"
                    >
                      <span className="w-3 h-3 rounded-full block" style={{ backgroundColor: color.value }}></span>
                      <span className="text-[9px] font-bold text-slate-400">{color.name}</span>
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-slate-800 flex-shrink-0">
                    <input 
                      type="color" 
                      value={ctaColor}
                      onChange={(e) => setCtaColor(e.target.value)}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 cursor-pointer"
                    />
                  </div>
                  <input 
                    type="text" 
                    value={ctaColor}
                    onChange={(e) => setCtaColor(e.target.value)}
                    className="flex-grow bg-slate-950 border border-slate-850 hover:border-slate-700 focus:border-violet-500 rounded-xl px-3 py-2 text-xs text-slate-200 transition-all outline-none font-mono uppercase"
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-850" />

            {/* SEÇÃO 8: PERGUNTAS FREQUENTES (FAQ) */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-violet-400 uppercase tracking-widest flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-violet-400" />
                Perguntas Frequentes (FAQ opcional)
              </h3>

              {/* Formulário para Adicionar FAQ */}
              <div className="bg-slate-950 border border-slate-850 p-3.5 rounded-2xl flex flex-col gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">Pergunta</label>
                  <input 
                    type="text" 
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Ex: Como vou receber o cronograma?"
                    className="w-full bg-slate-900 border border-slate-850 focus:border-violet-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">Resposta</label>
                  <textarea 
                    rows={2}
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    placeholder="Ex: O acesso é liberado instantaneamente..."
                    className="w-full bg-slate-900 border border-slate-850 focus:border-violet-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none resize-none leading-relaxed"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddFaqItem}
                  className="bg-violet-600/20 hover:bg-violet-600/40 text-violet-400 border border-violet-500/30 font-bold text-xs py-1.5 px-3 rounded-xl transition-all self-end flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Adicionar FAQ
                </button>
              </div>

              {/* Lista dos FAQs Adicionados atualmente */}
              {faqList.length > 0 ? (
                <div className="space-y-2 max-h-[160px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-850 pr-1">
                  {faqList.map((item, index) => (
                    <div key={index} className="bg-slate-950/50 border border-slate-850 rounded-xl p-2.5 flex items-start justify-between gap-2.5">
                      <div className="flex-grow min-w-0">
                        <h4 className="text-xs font-extrabold text-slate-200 truncate">{item.question}</h4>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">{item.answer}</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleRemoveFaqItem(index)}
                        className="p-1 rounded hover:bg-red-950/45 text-slate-500 hover:text-red-400 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-slate-500 italic">Nenhuma pergunta frequente adicionada a este projeto.</p>
              )}
            </div>

            {/* BOTÕES DE CONTROLE CRUD */}
            <div className="mt-2 pt-4 border-t border-slate-850 flex gap-2">
              <button
                type="button"
                onClick={handleSavePresell}
                className="flex-grow py-3 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/20"
              >
                <Check className="w-4 h-4" />
                <span>Salvar Projeto</span>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setThemeColor('#0b0f19');
                  setTextColor('#ffffff');
                  setBorderRadius(16);
                  setHasImageBorder(true);
                  setFontSizeTitulo(28);
                  setFontSizeSubtitulo(14);
                  
                  // Resetando Aviso
                  setAvisoEnabled(true);
                  setAvisoTopo('ATENÇÃO: Este treinamento é gratuito por tempo limitado!');
                  setAvisoPulse(true);
                  setAvisoBgColor('#dc2626');
                  setAvisoTextColor('#ffffff');
                  setAvisoWidth('full');
                  setAvisoPosition('sticky');

                  // Resetando Timer
                  setTimerEnabled(true);
                  setTimerDuration(15);
                  setTimerBgColor('#020617');
                  setTimerTextColor('#ffffff');
                  setTimerBorderRadius(12);

                  // Resetando Mídia
                  setImageWidth(100);
                  setImageAlign('center');
                  setImagePosition('bottom');
                  setImageFit('cover');
                  setImageFullBleed(false);
                  
                  showToast('Estilos básicos restaurados.');
                }}
                className="bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800 rounded-xl px-3 py-3 transition-all"
                title="Resetar Estilos"
              >
                <RotateCcw className="w-4.5 h-4.5" />
              </button>
            </div>

          </div>
        </section>

        {/* COLUNA DIREITA: PREVIEW DINÂMICO FIXADO EM TELAS DE COMPUTADOR (7/12) */}
        <section className="hidden lg:block lg:col-span-6 xl:col-span-7 lg:sticky lg:top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
          
          {/* BARRA DE ALTERNAÇÃO DE PREVIEW */}
          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-3 shadow-lg flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-pulse"></span>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1">
                <Eye className="w-4 h-4 text-violet-400" />
                Live Preview Dinâmico
              </h3>
            </div>

            {/* Alternador Responsivo */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800/80">
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                  previewDevice === 'mobile' 
                  ? 'bg-violet-600 text-white shadow' 
                  : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
              
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                  previewDevice === 'desktop' 
                  ? 'bg-violet-600 text-white shadow' 
                  : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
            </div>
          </div>

          {/* SIMULADOR DE TELA DO DISPOSITIVO */}
          <div className="bg-slate-950 border border-slate-900 rounded-3xl p-4 flex justify-center items-start overflow-hidden min-h-[620px] shadow-inner relative">
            
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none"></div>

            {/* Container Responsivo simulado */}
            <div className={`transition-all duration-300 w-full flex justify-center ${
              previewDevice === 'mobile' ? 'max-w-[385px]' : 'max-w-full'
            }`}>
              
              <div 
                className={`w-full transition-all relative flex flex-col justify-between ${
                  previewDevice === 'mobile' 
                  ? 'border-[10px] border-slate-800 rounded-[3rem] shadow-2xl min-h-[660px] overflow-y-auto aspect-[9/19]' 
                  : 'border border-slate-900 rounded-2xl shadow-xl min-h-[480px]'
                }`}
                style={{ background: isThemeGradient ? themeColor : undefined, backgroundColor: !isThemeGradient ? themeColor : undefined }}
              >
                
                {/* Detalhe da Notch do celular */}
                {previewDevice === 'mobile' && (
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-slate-850 rounded-full z-50 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-slate-900 absolute right-4"></span>
                    <span className="w-10 h-0.5 bg-slate-950 rounded-full"></span>
                  </div>
                )}

                {/* --- RENDERIZAÇÃO REAL DA PRESELL SIMULADA --- */}
                <div className={`text-slate-100 flex flex-col justify-between h-full ${
                  previewDevice === 'mobile' ? 'pt-8' : ''
                }`} style={{ color: textColor }}>
                  
                  {/* Aviso de Urgência (Fixo/Topo) */}
                  {avisoPosition === 'sticky' && renderAvisoPreview()}

                  {/* Miolo do Card */}
                  <div className="flex-1 flex flex-col items-center justify-center p-5 md:p-8 max-w-lg mx-auto w-full">
                    
                    {/* Aviso Posicionado Internamente no Card */}
                    {avisoPosition === 'top-card' && (
                      <div className="w-full mb-4">
                        {renderAvisoPreview()}
                      </div>
                    )}

                    {/* Badge Destaque */}
                    {renderBadgePreview()}

                    {/* Imagem Posição: Topo (Acima de Headline) */}
                    {imagePosition === 'top' && renderImage()}

                    {/* Headline */}
                    <h1 
                      className="font-black text-center leading-snug tracking-tight mb-3"
                      style={{ 
                        fontSize: `${fontSizeTitulo}px`,
                        color: textColor === '#ffffff' ? '#ffffff' : '#0f172a'
                      }}
                      dangerouslySetInnerHTML={{ __html: parseMarkdown(titulo) || '<span class="text-slate-600 block">[Preencha o Título Principal]</span>' }}
                    />

                    {/* Imagem Posição: Meio (Abaixo da Headline / Acima da Descrição) */}
                    {imagePosition === 'middle' && renderImage()}

                    {/* Descrição em Markdown Convertido */}
                    {subtitulo && (
                      <p 
                        className="text-center opacity-90 leading-relaxed mb-5"
                        style={{ fontSize: `${fontSizeSubtitulo}px` }}
                        dangerouslySetInnerHTML={{ __html: parseMarkdown(subtitulo) }}
                      />
                    )}

                    {/* Imagem Posição: Base (Abaixo da Descrição) */}
                    {imagePosition === 'bottom' && renderImage()}

                    {/* Renderizador de Timer Customizado */}
                    {timerEnabled && (
                      <div 
                        className="w-full p-4 mb-6 text-center border border-slate-800/40 shadow-md"
                        style={{ backgroundColor: timerBgColor, color: timerTextColor, borderRadius: `${timerBorderRadius}px` }}
                      >
                        <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mb-2">{timerText}</p>
                        <div className="flex justify-center gap-3 items-center">
                          <div className="flex flex-col">
                            <span className="text-2xl font-black">{formatTime.min}</span>
                            <span className="text-[9px] opacity-40 uppercase font-bold">Minutos</span>
                          </div>
                          <span className="text-xl font-bold opacity-40">:</span>
                          <div className="flex flex-col">
                            <span className="text-2xl font-black">{formatTime.sec}</span>
                            <span className="text-[9px] opacity-40 uppercase font-bold">Segundos</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Botão de Chamada para Ação (CTA) com Teste Funcional */}
                    <div className="w-full">
                      <a 
                        href={ctaLink || '#'} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="next-preview-pulse block w-full text-center text-white py-3.5 px-5 rounded-xl text-xs md:text-sm font-black uppercase tracking-wider transition-all transform active:scale-95 shadow-lg relative group/btn"
                        style={{ 
                          backgroundColor: ctaColor || '#22c55e',
                          borderRadius: `${Math.max(4, borderRadius - 4)}px`,
                          boxShadow: `0 4px 14px 0 ${ctaColor}35`,
                          textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                        }}
                      >
                        <span className="flex items-center justify-center gap-1.5">
                          {ctaText || 'QUERO MEU ACESSO AGORA'}
                          <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover/btn:opacity-100 transition-opacity" />
                        </span>
                      </a>

                      <p className="text-[9px] text-center text-slate-500 mt-2.5 font-mono flex items-center justify-center gap-1">
                        <MousePointerClick className="w-3 h-3 text-violet-400" />
                        <span>Este botão funciona! Abre seu link em nova aba.</span>
                      </p>
                    </div>

                    {/* Renderizador de FAQ no Live Preview */}
                    {faqList.length > 0 && (
                      <div className="w-full mt-6 pt-6 border-t border-slate-800/60">
                        <h4 className="text-xs font-black uppercase text-center tracking-wider mb-3">Dúvidas Frequentes</h4>
                        <div className="space-y-2">
                          {faqList.map((item, index) => (
                            <details key={index} className="group bg-slate-950/50 border border-slate-850 p-3 rounded-lg transition-all">
                              <summary className="flex items-center justify-between cursor-pointer focus:outline-none text-[11px] font-extrabold text-white">
                                <span>{item.question}</span>
                                <span className="transition-transform duration-200 group-open:rotate-180 text-violet-400">▼</span>
                              </summary>
                              <p className="text-[10px] text-slate-300 mt-2 leading-relaxed border-t border-slate-800/40 pt-2 whitespace-pre-wrap">
                                {item.answer}
                              </p>
                            </details>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Termos Fictícios */}
                    <div className="flex justify-center gap-3 text-[9px] text-slate-600 mt-6">
                      <span className="hover:underline cursor-pointer">Privacidade</span>
                      <span>•</span>
                      <span className="hover:underline cursor-pointer">Termos</span>
                    </div>

                  </div>

                  {/* Rodapé institucional */}
                  <div className="border-t border-slate-900/60 py-3 text-center text-[9px] text-slate-600 bg-slate-950/50">
                    <p>&copy; {new Date().getFullYear()} • Direitos Reservados</p>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </section>

      </main>

      {/* FLOATING ACTION BUTTON (FAB) PARA MOBILE */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setMobilePreviewOpen(true)}
          className="bg-violet-600 hover:bg-violet-500 text-white p-4 rounded-full shadow-2xl flex items-center justify-center border border-violet-500/30 scale-110 active:scale-95 transition-all"
        >
          <Eye className="w-6 h-6" />
        </button>
      </div>

      {/* MODAL: GUIA DO EDITOR (MARKDOWN) */}
      {markdownHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5.5 h-5.5 text-violet-500" />
                <h3 className="text-lg font-black text-white">Guia de Markdown e Estilos</h3>
              </div>
              <button 
                onClick={() => setMarkdownHelpOpen(false)}
                className="text-slate-400 hover:text-white bg-slate-850 rounded-full p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <h4 className="text-xs font-bold text-violet-400 mb-1">**Negrito**</h4>
                <p className="text-xs text-slate-300">Escreva entre duas estrelas de cada lado para dar ênfase máxima.</p>
                <code className="text-[10px] text-slate-500 font-mono mt-1 block">**Este texto ficará em negrito**</code>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <h4 className="text-xs font-bold text-violet-400 mb-1">*Itálico*</h4>
                <p className="text-xs text-slate-300">Escreva entre uma estrela de cada lado para estilizar elegantemente.</p>
                <code className="text-[10px] text-slate-500 font-mono mt-1 block">*Este texto ficará inclinado*</code>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <h4 className="text-xs font-bold text-violet-400 mb-1">🎨 Cores Personalizadas Dinâmicas</h4>
                <p className="text-xs text-slate-300">Adicione qualquer cor hexadecimal em palavras específicas colocando-as entre colchetes seguidos por chave e a cor desejada.</p>
                <code className="text-[10px] text-slate-500 font-mono mt-1 block">[Texto Colorido]{`{#22c55e}`}</code>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setMarkdownHelpOpen(false)}
                className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EXCLUSÃO CONFIRMAÇÃO SEGURO */}
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
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-3 py-1.5 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteAction}
                className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg"
              >
                Excluir de vez
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CUSTOM ALERT MODAL */}
      {customAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-850 rounded-2xl w-full max-w-sm p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              {customAlert.title}
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {customAlert.message}
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setCustomAlert(null)}
                className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold px-4 py-1.5 rounded-lg"
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: MOBILE PREVIEW FULLSCREEN */}
      {mobilePreviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
          <div className="bg-slate-900 p-4 border-b border-slate-850 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-violet-500" />
              Visualizador Mobile Completo
            </h3>
            <button
              onClick={() => setMobilePreviewOpen(false)}
              className="text-slate-400 hover:text-white bg-slate-800 rounded-lg p-2 text-xs font-bold"
            >
              Fechar Preview
            </button>
          </div>

          <div className="flex-1 overflow-y-auto" style={{ background: isThemeGradient ? themeColor : undefined, backgroundColor: !isThemeGradient ? themeColor : undefined }}>
            <div className={`text-slate-100 flex flex-col justify-between h-full`} style={{ color: textColor }}>
              
              {/* Aviso de Urgência */}
              {avisoPosition === 'sticky' && renderAvisoPreview()}

              <div className="flex-1 flex flex-col items-center justify-center p-5 max-w-lg mx-auto w-full">
                
                {/* Aviso Superior Posicionado no Card */}
                {avisoPosition === 'top-card' && (
                  <div className="w-full mb-4">
                    {renderAvisoPreview()}
                  </div>
                )}

                {/* Badge Destaque */}
                {renderBadgePreview()}

                {imagePosition === 'top' && renderImage()}

                <h1 
                  className="font-black text-center leading-snug tracking-tight mb-3"
                  style={{ 
                    fontSize: `${fontSizeTitulo}px`,
                    color: textColor === '#ffffff' ? '#ffffff' : '#0f172a'
                  }}
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(titulo) || '[Preencha o Título]' }}
                />

                {imagePosition === 'middle' && renderImage()}

                {subtitulo && (
                  <p 
                    className="text-center opacity-90 leading-relaxed mb-5"
                    style={{ fontSize: `${fontSizeSubtitulo}px` }}
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(subtitulo) }}
                  />
                )}

                {imagePosition === 'bottom' && renderImage()}

                {timerEnabled && (
                  <div 
                    className="w-full p-4 mb-6 text-center border border-slate-800/40 shadow-md"
                    style={{ backgroundColor: timerBgColor, color: timerTextColor, borderRadius: `${timerBorderRadius}px` }}
                  >
                    <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mb-1">{timerText}</p>
                    <div className="flex justify-center gap-2 items-center">
                      <span className="text-xl font-black">{formatTime.min}</span>
                      <span className="text-sm opacity-40">:</span>
                      <span className="text-xl font-black">{formatTime.sec}</span>
                    </div>
                  </div>
                )}

                <div className="w-full">
                  <a 
                    href={ctaLink || '#'} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="next-preview-pulse block w-full text-center text-white py-3.5 px-5 rounded-xl text-xs md:text-sm font-black uppercase tracking-wider shadow-lg"
                    style={{ 
                      backgroundColor: ctaColor || '#22c55e',
                      borderRadius: `${Math.max(4, borderRadius - 4)}px`,
                    }}
                  >
                    {ctaText || 'QUERO MEU ACESSO'}
                  </a>
                </div>

                {faqList.length > 0 && (
                  <div className="w-full mt-6 pt-6 border-t border-slate-800/60">
                    <h4 className="text-xs font-black uppercase text-center tracking-wider mb-3">Dúvidas Frequentes</h4>
                    <div className="space-y-2">
                      {faqList.map((item, index) => (
                        <details key={index} className="group bg-slate-950/50 border border-slate-850 p-3 rounded-lg transition-all">
                          <summary className="flex items-center justify-between cursor-pointer focus:outline-none text-[11px] font-extrabold text-white">
                            <span>{item.question}</span>
                            <span className="transition-transform duration-200 group-open:rotate-180 text-violet-400">▼</span>
                          </summary>
                          <p className="text-[10px] text-slate-300 mt-2 leading-relaxed border-t border-slate-800/40 pt-2 whitespace-pre-wrap">
                            {item.answer}
                          </p>
                        </details>
                      ))}
                    </div>
                  </div>
                )}

              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL DE IMPORTAÇÃO */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="bg-violet-500/10 text-violet-400 text-[10px] font-extrabold px-3 py-1 rounded-full border border-violet-500/20 uppercase tracking-widest">
                  Importação de Configuração
                </span>
                <h2 className="text-lg font-black text-white mt-1.5 flex items-center gap-2">
                  <Upload className="w-5.5 h-5.5 text-violet-500" />
                  Importar Projeto Presell
                </h2>
              </div>
              <button
                onClick={() => setImportModalOpen(false)}
                className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full p-1.5 transition-all"
              >
                ✕
              </button>
            </div>

            {/* SELETOR DE ARQUIVO */}
            <div className="mt-4">
              <label className="block text-xs font-bold text-slate-300 mb-2">Enviar Arquivo .json</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-800 hover:border-violet-500 hover:bg-slate-950/40 rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center gap-1.5"
              >
                <Upload className="w-8 h-8 text-slate-500" />
                <span className="text-xs text-slate-300 font-bold">Clique para selecionar seu JSON</span>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept=".json" 
                  className="hidden" 
                />
              </div>
            </div>

            {/* ÁREA DE TEXTO ALTERNATIVA */}
            <div className="mt-4">
              <label className="block text-xs font-bold text-slate-300 mb-1">Ou Cole o Texto JSON Diretamente</label>
              <textarea
                rows={4}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder='{"titulo": "Exemplo", "ctaLink": "https://..."}'
                className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl p-3 text-[11px] text-slate-300 font-mono outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setImportModalOpen(false)}
                className="bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-bold px-4 py-2 rounded-xl transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleImportJsonAction(importJsonText)}
                disabled={!importJsonText.trim()}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  !importJsonText.trim()
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-violet-600 hover:bg-violet-500 text-white'
                }`}
              >
                <span>Processar & Importar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL DE EXPORTAÇÃO */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 md:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="bg-violet-500/10 text-violet-400 text-[10px] font-extrabold px-3 py-1 rounded-full border border-violet-500/20 uppercase tracking-wider">
                  EXPORTAR PROJETO
                </span>
                <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
                  <Code className="w-6 h-6 text-violet-500" />
                  Escolha como quer exportar
                </h2>
              </div>
              <button
                onClick={() => setExportModalOpen(false)}
                className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full p-2 transition-all"
              >
                ✕
              </button>
            </div>

            <div className="relative mt-4">
              <div className="absolute top-3 right-3 z-10 flex gap-2">
                <button
                  onClick={handleCopyCode}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold py-2 px-3.5 rounded-lg flex items-center gap-1.5 transition-all border border-slate-700"
                >
                  {copiedId === 'code' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar HTML</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 pt-12 overflow-x-auto text-xs text-slate-300 font-mono max-h-[220px] scrollbar-thin scrollbar-thumb-slate-800">
                <code>{generateHTML()}</code>
              </pre>
            </div>

            <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 mt-4 flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 text-amber-500/80 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Como hospedar no seu domínio?</h4>
                <p className="text-xs text-slate-400 mt-1">
                  1. Copie o HTML acima e salve como <code className="text-slate-200 font-mono">index.html</code> no seu computador.<br />
                  2. Envie o arquivo para o seu provedor de hospedagem ou pasta desejada do seu site.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap justify-between gap-3 mt-6">
              <button
                onClick={() => {
                  const dataToBackup = {
                    id: activeId,
                    titulo,
                    subtitulo,
                    imageUrl,
                    ctaText,
                    ctaLink,
                    ctaColor,
                    themeColor,
                    textColor,
                    borderRadius,
                    faq: faqList,
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
                    imageFullBleed
                  };
                  const element = document.createElement("a");
                  const file = new Blob([JSON.stringify(dataToBackup, null, 2)], {type: 'application/json'});
                  element.href = URL.createObjectURL(file);
                  element.download = `config-${titulo ? titulo.substring(0, 15).toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'presell'}.json`;
                  document.body.appendChild(element);
                  element.click();
                  document.body.removeChild(element);
                  showToast("📥 Backup JSON baixado!");
                }}
                className="bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
              >
                Baixar JSON de Configuração
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setExportModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
                >
                  Voltar ao Editor
                </button>
                
                <button
                  onClick={() => {
                    const element = document.createElement("a");
                    const file = new Blob([generateHTML()], {type: 'text/html'});
                    element.href = URL.createObjectURL(file);
                    element.download = `${titulo ? titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 20) : 'presell'}.html`;
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                    showToast("📥 Download do arquivo HTML iniciado!");
                  }}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  Baixar .HTML
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}