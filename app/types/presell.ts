'use client';

export type Language = 'pt' | 'en';

export interface FAQItem {
  question: string;
  answer: string;
}

export type TimerStyle = 'classic' | 'cards' | 'glass' | 'urgency';

export interface HeaderMenuItem {
  id: string;
  label: string;
  url: string;
  icon: 'home' | 'star' | 'shield' | 'cart' | 'phone' | 'mail';
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
  timerEnabled: boolean;
  timerDuration: number;
  timerText: string;
  timerBgColor: string;
  timerTextColor: string;
  timerBorderRadius: number;
  timerStyle?: TimerStyle;
  avisoEnabled: boolean;
  avisoTopo: string;
  avisoPulse: boolean;
  avisoBgColor: string;
  avisoTextColor: string;
  avisoWidth: 'full' | 'card';
  avisoPosition: 'sticky' | 'top-card';
  badgeEnabled: boolean;
  badgeText: string;
  badgePulse: boolean;
  badgeBgColor: string;
  badgeTextColor: string;
  imageWidth: number;
  imageAlign: 'left' | 'center' | 'right';
  imagePosition: 'top' | 'middle' | 'bottom';
  imageFit: 'cover' | 'contain' | 'fill' | 'scale-down';
  imageFullBleed: boolean;
  headerEnabled: boolean;
  headerBrand: string;
  headerMenuRaw: string;
  headerMenuItems?: HeaderMenuItem[];
  headerBgColor: string;
  headerTextColor: string;
  contentAlignment: 'left' | 'center' | 'right';
  footerEnabled: boolean;
  footerText: string;
  footerBgColor: string;
  footerTextColor: string;
  footerPosition: 'left' | 'center' | 'right';
  ctaSize?: 'small' | 'medium' | 'large';
  ctaWidth?: number;
  faqFontSize?: number;
  faqAnswerFontSize?: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  language?: Language;
}
