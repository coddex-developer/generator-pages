'use client';

export type Language = 'pt' | 'en';

export interface FAQItem {
  question: string;
  answer: string;
}

export type TimerStyle = 'classic' | 'cards' | 'glass' | 'urgency';
export type CtaEffect = 'pulse' | 'shine' | 'float' | 'glow';
export type FooterStyle = 'minimal' | 'glass' | 'split' | 'brand';
export type PresellIcon =
  | 'home'
  | 'star'
  | 'shield'
  | 'cart'
  | 'phone'
  | 'mail'
  | 'check'
  | 'zap'
  | 'gift'
  | 'book'
  | 'users'
  | 'lock'
  | 'message'
  | 'play'
  | 'card'
  | 'globe'
  | 'award'
  | 'heart'
  | 'crown'
  | 'target'
  | 'trending'
  | 'rocket';

export interface HeaderMenuItem {
  id: string;
  label: string;
  url: string;
  icon: PresellIcon;
}

export interface Presell {
  id: string;
  titulo: string;
  subtitulo: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  ctaColor: string;
  ctaSupportText?: string;
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
  benefitsEnabled?: boolean;
  benefitsRaw?: string;
  trustEnabled?: boolean;
  trustItemsRaw?: string;
  guaranteeEnabled?: boolean;
  guaranteeTitle?: string;
  guaranteeText?: string;
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
  footerStyle?: FooterStyle;
  footerBrand?: string;
  footerLinksRaw?: string;
  footerIcon?: PresellIcon;
  ctaSize?: 'small' | 'medium' | 'large';
  ctaWidth?: number;
  ctaEffect?: CtaEffect;
  faqFontSize?: number;
  faqAnswerFontSize?: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  language?: Language;
}
