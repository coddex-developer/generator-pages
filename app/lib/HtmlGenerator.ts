import { marked } from 'marked';
import type { FAQItem, HeaderMenuItem, Language, TimerStyle } from '../types/presell';

type Align = 'left' | 'center' | 'right';
type ImageFit = 'cover' | 'contain' | 'fill' | 'scale-down';

export interface HtmlGeneratorState {
  titulo: string;
  subtitulo: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  ctaColor: string;
  themeColor: string;
  textColor: string;
  borderRadius: number;
  faqList: FAQItem[];
  hasImageBorder: boolean;
  fontSizeTitulo: number;
  fontSizeSubtitulo: number;
  timerEnabled: boolean;
  timerDuration: number;
  timerText: string;
  timerBgColor: string;
  timerTextColor: string;
  timerBorderRadius: number;
  timerStyle: TimerStyle;
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
  imageAlign: Align;
  imagePosition: 'top' | 'middle' | 'bottom';
  imageFit: ImageFit;
  imageFullBleed: boolean;
  headerEnabled: boolean;
  headerBrand: string;
  headerMenuRaw: string;
  headerMenuItems: HeaderMenuItem[];
  headerBgColor: string;
  headerTextColor: string;
  contentAlignment: Align;
  footerEnabled: boolean;
  footerText: string;
  footerBgColor: string;
  footerTextColor: string;
  footerPosition: Align;
  ctaSize: 'small' | 'medium' | 'large';
  ctaWidth: number;
  faqFontSize: number;
  faqAnswerFontSize: number;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  lang: Language;
}

marked.setOptions({ gfm: true, breaks: true });

const escapeHtml = (value: string) =>
  String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

const sanitizeColor = (value: string) => {
  const color = value.trim();
  if (/^#[0-9a-f]{3,8}$/i.test(color)) return color;
  if (/^(rgb|rgba|hsl|hsla)\([\d\s,%.+-]+\)$/i.test(color)) return color;
  return '#22c55e';
};

export const parseMarkdown = (text: string): string => {
  if (!text) return '';

  const colorTokens: string[] = [];
  const withTokens = text.replace(/\[([^\]]+)\]\{([^}]+)\}/g, (_, content: string, color: string) => {
    const token = `@@COLOR_${colorTokens.length}@@`;
    colorTokens.push(`<span class="md-color" style="color:${sanitizeColor(color)}">${escapeHtml(content)}</span>`);
    return token;
  });

  const escaped = escapeHtml(withTokens);
  const parsed = marked.parse(escaped, { async: false }) as string;

  return colorTokens.reduce((html, replacement, index) => html.replace(`@@COLOR_${index}@@`, replacement), parsed);
};

export const parseInlineMarkdown = (text: string): string => {
  if (!text) return '';
  const html = parseMarkdown(text).trim();
  return html.replace(/^<p>/, '').replace(/<\/p>$/, '');
};

const hasMarkdownMenuSyntax = (value: string) => /(\[[^\]]+\]\([^)]+\)|^\s*[-*]\s+|^\s*\d+\.\s+)/m.test(value);

export const renderMenuMarkdown = (value: string): string => {
  if (!value.trim()) return '';
  if (!hasMarkdownMenuSyntax(value) && value.includes(',')) {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => `<a href="#offer">${escapeHtml(item)}</a>`)
      .join('');
  }

  return parseMarkdown(value);
};

const menuIconSvg = (icon: HeaderMenuItem['icon']) => {
  const common = 'width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  const paths: Record<HeaderMenuItem['icon'], string> = {
    home: '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
    star: '<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-5"/>',
    cart: '<circle cx="9" cy="20" r="1"/><circle cx="17" cy="20" r="1"/><path d="M3 4h2l2.5 11h9.8l2-7H7"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.5 2.1L8 9.5a16 16 0 0 0 6.5 6.5l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.6.5 2.5.6a2 2 0 0 1 1.7 2Z"/>',
    mail: '<path d="M4 4h16v16H4z"/><path d="m22 6-10 7L2 6"/>'
  };
  return `<svg ${common}>${paths[icon]}</svg>`;
};

const renderStructuredMenu = (items: HeaderMenuItem[]) =>
  items
    .slice(0, 4)
    .filter((item) => item.label.trim())
    .map((item) => `<a href="${escapeHtml(item.url || '#offer')}">${menuIconSvg(item.icon || 'star')}<span>${escapeHtml(item.label)}</span></a>`)
    .join('');

export const generateHTML = (state: HtmlGeneratorState, activeId: string | null): string => {
  const {
    titulo, subtitulo, imageUrl, ctaText, ctaLink, ctaColor, themeColor, textColor, borderRadius,
    faqList, hasImageBorder, fontSizeTitulo, fontSizeSubtitulo,
    timerEnabled, timerDuration, timerText, timerBgColor, timerTextColor, timerBorderRadius, timerStyle,
    avisoEnabled, avisoTopo, avisoPulse, avisoBgColor, avisoTextColor, avisoWidth, avisoPosition,
    badgeEnabled, badgeText, badgePulse, badgeBgColor, badgeTextColor,
    imageWidth, imageAlign, imagePosition, imageFit, imageFullBleed,
    headerEnabled, headerBrand, headerMenuRaw, headerMenuItems, headerBgColor, headerTextColor, contentAlignment,
    footerEnabled, footerText, footerBgColor, footerTextColor, footerPosition,
    ctaSize, ctaWidth, faqFontSize, faqAnswerFontSize,
    seoTitle, seoDescription, seoKeywords, lang
  } = state;

  const titleText = stripHtml(parseMarkdown(seoTitle || titulo || 'Presell'));
  const descriptionText = stripHtml(parseMarkdown(seoDescription || subtitulo || titulo || 'Oferta exclusiva por tempo limitado.'));
  const safeKeywords = escapeHtml(seoKeywords || '');
  const safeCtaText = escapeHtml(ctaText || (lang === 'pt' ? 'QUERO MEU ACESSO AGORA' : 'GET INSTANT ACCESS'));
  const safeCtaLink = escapeHtml(ctaLink || '#');
  const safeHeaderBrand = escapeHtml(headerBrand || 'RapidPresell');
  const safeFooterText = escapeHtml(footerText || `${new Date().getFullYear()} - Todos os direitos reservados.`);
  const safeImageUrl = escapeHtml(imageUrl || '');
  const isThemeGradient = themeColor.includes('linear-gradient') || themeColor.includes('radial-gradient');
  const contentAlignClass = contentAlignment === 'left' ? 'text-left' : contentAlignment === 'right' ? 'text-right' : 'text-center';
  const contentJustifyClass = contentAlignment === 'left' ? 'justify-start' : contentAlignment === 'right' ? 'justify-end' : 'justify-center';
  const imageJustifyClass = imageAlign === 'left' ? 'justify-start' : imageAlign === 'right' ? 'justify-end' : 'justify-center';
  const headerLinksHtml = headerMenuItems?.length ? renderStructuredMenu(headerMenuItems) : renderMenuMarkdown(headerMenuRaw || '');
  const faviconTag = safeImageUrl ? `<link rel="icon" href="${safeImageUrl}" />` : '';

  const cardImageHtml = safeImageUrl ? `
    <div class="offer-image ${imageJustifyClass} ${imageFullBleed ? 'full-bleed' : ''}">
      <div class="offer-image-frame" style="width:${imageWidth}%;border-radius:${imageFullBleed ? '0px' : `${Math.max(4, borderRadius - 4)}px`};border:${hasImageBorder && !imageFullBleed ? '1px solid rgba(255,255,255,0.18)' : 'none'};box-shadow:${hasImageBorder && !imageFullBleed ? `0 18px 44px rgba(0,0,0,.34), 0 0 24px ${ctaColor}18` : 'none'};">
        <img src="${safeImageUrl}" alt="${escapeHtml(titleText)}" style="object-fit:${imageFit};" fetchpriority="high" />
      </div>
    </div>` : '';

  const renderAvisoHTML = () => {
    if (!avisoEnabled || !avisoTopo) return '';
    const layoutClass = avisoWidth === 'full' ? 'notice-full' : 'notice-card';
    const pulseClass = avisoPulse ? 'pulse-soft' : '';
    return `<div class="top-notice ${layoutClass} ${pulseClass}" style="background-color:${avisoBgColor};color:${avisoTextColor};">${escapeHtml(avisoTopo)}</div>`;
  };

  const renderBadgeHTML = () => {
    if (!badgeEnabled || !badgeText) return '';
    return `<div class="badge-wrap ${badgePulse ? 'pulse-soft' : ''}"><span style="background-color:${badgeBgColor};color:${badgeTextColor};border-color:${badgeTextColor}33;">${escapeHtml(badgeText)}</span></div>`;
  };

  const faqHtml = faqList.length > 0 ? `
    <section class="faq-section">
      <h2 class="${contentAlignClass}">${lang === 'pt' ? 'Duvidas frequentes' : 'Frequently asked questions'}</h2>
      <div class="faq-list">
        ${faqList.map((item) => `
          <details>
            <summary style="font-size:${faqFontSize}px;"><span>${escapeHtml(item.question)}</span></summary>
            <div class="markdown-body faq-answer" style="font-size:${faqAnswerFontSize}px;">${parseMarkdown(item.answer)}</div>
          </details>
        `).join('')}
      </div>
    </section>` : '';

  const ctaPaddingClass = ctaSize === 'small' ? 'cta-small' : ctaSize === 'large' ? 'cta-large' : 'cta-medium';

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${escapeHtml(titleText)}</title>
  <meta name="description" content="${escapeHtml(descriptionText)}" />
  ${safeKeywords ? `<meta name="keywords" content="${safeKeywords}" />` : ''}
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <meta name="theme-color" content="${isThemeGradient ? ctaColor : themeColor}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeHtml(titleText)}" />
  <meta property="og:description" content="${escapeHtml(descriptionText)}" />
  ${safeImageUrl ? `<meta property="og:image" content="${safeImageUrl}" />` : ''}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(titleText)}" />
  <meta name="twitter:description" content="${escapeHtml(descriptionText)}" />
  ${safeImageUrl ? `<meta name="twitter:image" content="${safeImageUrl}" />` : ''}
  ${faviconTag}
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      min-height: 100vh;
      margin: 0;
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      background: ${isThemeGradient ? themeColor : themeColor};
      color: ${textColor};
      overflow-x: hidden;
    }
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      pointer-events: none;
      background: radial-gradient(circle at 50% 0%, rgba(255,255,255,.12), transparent 34%), linear-gradient(180deg, rgba(255,255,255,.04), transparent 44%);
    }
    .site-header { position: sticky; top: 0; z-index: 50; border-bottom: 1px solid rgba(255,255,255,.1); backdrop-filter: blur(18px); background: ${headerBgColor}; color: ${headerTextColor}; }
    .header-inner { max-width: 1120px; margin: 0 auto; padding: 14px clamp(16px, 4vw, 28px); display: flex; align-items: center; justify-content: space-between; gap: 16px; }
    .brand { font-size: 12px; font-weight: 900; letter-spacing: .2em; text-transform: uppercase; }
    a, button, summary { cursor: pointer; }
    .nav-links, .mobile-menu div { display: flex; align-items: center; gap: 18px; }
    .nav-links :where(p, ul, ol), .mobile-menu :where(p, ul, ol) { display: contents; margin: 0; padding: 0; list-style: none; }
    .nav-links li, .mobile-menu li { display: contents; }
    .nav-links a { color: inherit; text-decoration: none; opacity: .82; font-size: 13px; font-weight: 800; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
    .menu-button { display: none; width: 42px; height: 42px; border: 1px solid rgba(255,255,255,.14); border-radius: 14px; background: rgba(255,255,255,.06); color: inherit; place-items: center; cursor: pointer; }
    .menu-button span { display: block; width: 18px; height: 2px; border-radius: 999px; background: currentColor; transition: transform .22s ease, opacity .22s ease; }
    .menu-button span + span { margin-top: 5px; }
    .menu-button.is-open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .menu-button.is-open span:nth-child(2) { opacity: 0; }
    .menu-button.is-open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
    .mobile-menu { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .28s ease; border-top: 1px solid rgba(255,255,255,.08); }
    .mobile-menu.is-open { grid-template-rows: 1fr; }
    .mobile-menu > div { overflow: hidden; display: grid; gap: 8px; padding: 0 clamp(16px, 4vw, 28px); }
    .mobile-menu.is-open > div { padding-bottom: 16px; padding-top: 8px; }
    .mobile-menu a { color: inherit; text-decoration: none; font-weight: 800; padding: 10px 0; display: inline-flex; align-items: center; gap: 8px; }
    .top-notice { width: 100%; text-align: center; font-size: clamp(12px, 2.8vw, 14px); font-weight: 900; padding: 10px 14px; letter-spacing: .02em; }
    .notice-card { max-width: 760px; margin: 12px auto 0; border-radius: 14px; }
    .offer-main { position: relative; flex: 1; display: flex; align-items: center; justify-content: center; padding: clamp(22px, 6vw, 64px) clamp(14px, 4vw, 28px); }
    .offer-card { width: min(100%, 780px); display: flex; flex-direction: column; ${contentAlignment === 'left' ? 'align-items:flex-start;' : contentAlignment === 'right' ? 'align-items:flex-end;' : 'align-items:center;'} color: ${textColor}; }
    .badge-wrap { display: flex; justify-content: center; width: 100%; margin-bottom: 18px; }
    .badge-wrap span { display: inline-flex; border: 1px solid; border-radius: 999px; padding: 7px 13px; font-size: 11px; font-weight: 900; letter-spacing: .12em; text-transform: uppercase; }
    .offer-image { display: flex; width: 100%; margin: 0 0 24px; }
    .offer-image-frame { position: relative; overflow: hidden; aspect-ratio: 16 / 9; max-width: 100%; background: rgba(255,255,255,.05); }
    .offer-image-frame img { width: 100%; height: 100%; display: block; }
    .offer-image.full-bleed { width: min(100vw, 860px); margin-left: 50%; transform: translateX(-50%); justify-content: center; }
    h1 { max-width: 760px; margin: 0 0 14px; font-size: clamp(${Math.max(26, fontSizeTitulo - 6)}px, 7vw, ${Math.max(fontSizeTitulo, 34)}px); line-height: 1.08; font-weight: 900; text-wrap: balance; }
    .subtitle { max-width: 680px; margin: 0 0 24px; font-size: clamp(${Math.max(14, fontSizeSubtitulo)}px, 3.8vw, ${Math.max(16, fontSizeSubtitulo + 4)}px); line-height: 1.7; opacity: .9; }
    .markdown-body :where(p, ul, ol, blockquote, pre, table) { margin: 0 0 .9em; }
    .markdown-body ul, .markdown-body ol { padding-left: 1.3em; }
    .markdown-body a { color: ${ctaColor}; font-weight: 800; }
    .markdown-body code { padding: .15em .35em; border-radius: 6px; background: rgba(0,0,0,.22); }
    .markdown-body pre { overflow: auto; padding: 12px; border-radius: 12px; background: rgba(0,0,0,.28); }
    .timer-box { width: 100%; max-width: 560px; margin: 0 0 24px; padding: 16px; text-align: center; border: 1px solid rgba(255,255,255,.12); box-shadow: 0 18px 44px rgba(0,0,0,.18); }
    .timer-cards .timer-digits > div { min-width: 82px; border-radius: 16px; padding: 12px; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.14); }
    .timer-glass { backdrop-filter: blur(18px); background: linear-gradient(135deg, rgba(255,255,255,.18), rgba(255,255,255,.06)) !important; }
    .timer-urgency { border: 1px solid rgba(248,113,113,.45); box-shadow: 0 20px 48px rgba(239,68,68,.18); }
    .timer-urgency .timer-digits strong { color: #fecaca; }
    .timer-label { margin: 0 0 8px; font-size: 11px; font-weight: 900; opacity: .75; text-transform: uppercase; letter-spacing: .12em; }
    .timer-digits { display: flex; justify-content: center; gap: 14px; align-items: center; }
    .timer-digits strong { display: block; font-size: 28px; line-height: 1; }
    .timer-digits small { display: block; margin-top: 4px; font-size: 9px; opacity: .52; font-weight: 800; text-transform: uppercase; }
    .cta-row { width: 100%; display: flex; margin: 0 0 28px; }
    .cta-button { width: ${ctaWidth}%; max-width: 100%; display: inline-flex; align-items: center; justify-content: center; text-align: center; color: white; text-decoration: none; padding-left: 18px; padding-right: 18px; border-radius: ${Math.max(6, borderRadius - 4)}px; font-weight: 900; text-transform: uppercase; letter-spacing: .04em; background: ${ctaColor}; box-shadow: 0 16px 32px ${ctaColor}38, inset 0 1px 0 rgba(255,255,255,.22); text-shadow: 0 1px 2px rgba(0,0,0,.28); }
    .cta-small { min-height: 42px; font-size: 13px; }
    .cta-medium { min-height: 52px; font-size: 15px; }
    .cta-large { min-height: 62px; font-size: clamp(15px, 4vw, 19px); }
    .pulse-btn { animation: pulse-button 2.4s infinite; }
    .pulse-soft { animation: pulse-soft 2.5s infinite; }
    .faq-section { width: 100%; max-width: 680px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,.14); }
    .faq-section h2 { margin: 0 0 14px; font-size: 13px; font-weight: 900; text-transform: uppercase; letter-spacing: .12em; }
    .faq-list { display: grid; gap: 10px; }
    details { border: 1px solid rgba(255,255,255,.12); border-radius: 14px; background: rgba(0,0,0,.18); overflow: hidden; }
    summary { list-style: none; cursor: pointer; display: flex; justify-content: space-between; gap: 16px; padding: 14px; font-weight: 900; }
    summary::-webkit-details-marker { display: none; }
    summary::after { content: '⌄'; transition: transform .2s ease; }
    details[open] summary::after { transform: rotate(180deg); }
    .faq-answer { padding: 0 14px 14px; line-height: 1.65; opacity: .86; }
    footer { width: 100%; }
    footer div { padding: 18px clamp(16px, 4vw, 28px); font-size: 12px; }
    @keyframes pulse-button { 0% { transform: scale(1); box-shadow: 0 16px 32px ${ctaColor}38, 0 0 0 0 ${ctaColor}72; } 70% { transform: scale(1.025); box-shadow: 0 16px 32px ${ctaColor}38, 0 0 0 14px ${ctaColor}00; } 100% { transform: scale(1); box-shadow: 0 16px 32px ${ctaColor}38, 0 0 0 0 ${ctaColor}00; } }
    @keyframes pulse-soft { 50% { filter: brightness(1.15); transform: translateY(-1px); } }
    @media (max-width: 720px) {
      .nav-links { display: none; }
      .menu-button { display: grid; }
      .offer-main { align-items: flex-start; padding-top: 28px; }
      .offer-card { width: 100%; }
      .cta-button { width: 100% !important; }
      .offer-image-frame { max-width: 100%; }
      .offer-image.full-bleed { width: calc(100vw - 20px); }
      .timer-box { padding: 14px 12px; }
    }
  </style>
</head>
<body class="min-h-screen flex flex-col">
  ${headerEnabled ? `<header class="site-header">
    <div class="header-inner">
      <a href="#offer" class="brand" style="color:inherit;text-decoration:none;">${safeHeaderBrand}</a>
      <nav class="nav-links">${headerLinksHtml}</nav>
      <button type="button" class="menu-button" id="menu-button" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
    </div>
    <nav class="mobile-menu" id="mobile-menu"><div>${headerLinksHtml}</div></nav>
  </header>` : ''}
  ${avisoPosition === 'sticky' ? renderAvisoHTML() : ''}
  <main id="offer" class="offer-main">
    <article class="offer-card">
      ${avisoPosition === 'top-card' ? renderAvisoHTML() : ''}
      ${renderBadgeHTML()}
      ${imagePosition === 'top' ? cardImageHtml : ''}
      <h1 class="${contentAlignClass}">${parseInlineMarkdown(titulo)}</h1>
      ${imagePosition === 'middle' ? cardImageHtml : ''}
      ${subtitulo ? `<div class="subtitle markdown-body ${contentAlignClass}">${parseMarkdown(subtitulo)}</div>` : ''}
      ${imagePosition === 'bottom' ? cardImageHtml : ''}
      ${timerEnabled ? `<section class="timer-box timer-${timerStyle}" style="background-color:${timerBgColor};color:${timerTextColor};border-radius:${timerBorderRadius}px;">
        <p class="timer-label">${escapeHtml(timerText)}</p>
        <div class="timer-digits"><div><strong id="t-min">00</strong><small>${lang === 'pt' ? 'Minutos' : 'Minutes'}</small></div><span>:</span><div><strong id="t-sec">00</strong><small>${lang === 'pt' ? 'Segundos' : 'Seconds'}</small></div></div>
      </section>` : ''}
      <div class="cta-row ${contentJustifyClass}">
        <a href="${safeCtaLink}" target="_blank" rel="noopener noreferrer nofollow sponsored" class="cta-button pulse-btn ${ctaPaddingClass}" aria-label="${safeCtaText}">${safeCtaText}</a>
      </div>
      ${faqHtml}
    </article>
  </main>
  ${footerEnabled ? `<footer><div style="background-color:${footerBgColor};color:${footerTextColor};text-align:${footerPosition};">${safeFooterText}</div></footer>` : ''}
  <script>
    (function() {
      var button = document.getElementById('menu-button');
      var menu = document.getElementById('mobile-menu');
      if (button && menu) {
        button.addEventListener('click', function() {
          var isOpen = menu.classList.toggle('is-open');
          button.classList.toggle('is-open', isOpen);
          button.setAttribute('aria-expanded', String(isOpen));
        });
      }
      ${timerEnabled ? `
      var storageKey = 'presell_t_end_${activeId || 'page'}';
      var durationMs = ${timerDuration} * 60 * 1000;
      var targetTime = Number(localStorage.getItem(storageKey));
      if (!targetTime || Date.now() > targetTime) {
        targetTime = Date.now() + durationMs;
        localStorage.setItem(storageKey, String(targetTime));
      }
      function updateTimer() {
        var diff = Math.max(0, targetTime - Date.now());
        var minEl = document.getElementById('t-min');
        var secEl = document.getElementById('t-sec');
        if (!minEl || !secEl) return;
        minEl.textContent = String(Math.floor(diff / 60000)).padStart(2, '0');
        secEl.textContent = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
      }
      updateTimer();
      setInterval(updateTimer, 1000);` : ''}
    })();
  </script>
</body>
</html>`;
};
