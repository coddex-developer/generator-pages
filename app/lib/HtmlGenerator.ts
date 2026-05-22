import { marked } from 'marked';
import type { CtaEffect, FAQItem, FooterStyle, HeaderMenuItem, Language, PresellIcon, TimerStyle } from '../types/presell';

type Align = 'left' | 'center' | 'right';
type ImageFit = 'cover' | 'contain' | 'fill' | 'scale-down';

export interface HtmlGeneratorState {
  titulo: string;
  subtitulo: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  ctaColor: string;
  ctaSupportText: string;
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
  benefitsEnabled: boolean;
  benefitsRaw: string;
  trustEnabled: boolean;
  trustItemsRaw: string;
  guaranteeEnabled: boolean;
  guaranteeTitle: string;
  guaranteeText: string;
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
  footerStyle: FooterStyle;
  footerBrand: string;
  footerLinksRaw: string;
  footerIcon: PresellIcon;
  ctaSize: 'small' | 'medium' | 'large';
  ctaWidth: number;
  ctaEffect: CtaEffect;
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

const menuIconSvg = (icon: PresellIcon) => {
  const common = 'width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  const paths: Record<PresellIcon, string> = {
    home: '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
    star: '<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-5"/>',
    cart: '<circle cx="9" cy="20" r="1"/><circle cx="17" cy="20" r="1"/><path d="M3 4h2l2.5 11h9.8l2-7H7"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.5 2.1L8 9.5a16 16 0 0 0 6.5 6.5l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.6.5 2.5.6a2 2 0 0 1 1.7 2Z"/>',
    mail: '<path d="M4 4h16v16H4z"/><path d="m22 6-10 7L2 6"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    zap: '<path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z"/>',
    gift: '<path d="M20 12v10H4V12"/><path d="M2 7h20v5H2z"/><path d="M12 22V7"/><path d="M12 7H7.5A2.5 2.5 0 1 1 10 4.5c0 2.5 2 2.5 2 2.5Z"/><path d="M12 7h4.5A2.5 2.5 0 1 0 14 4.5c0 2.5-2 2.5-2 2.5Z"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5Z"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    message: '<path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/>',
    play: '<path d="m8 5 11 7-11 7Z"/>',
    card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M7 15h4"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 0 20"/><path d="M12 2a15.3 15.3 0 0 0 0 20"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.5 13 17 22l-5-3-5 3 1.5-9"/>',
    heart: '<path d="M19.5 12.6 12 20l-7.5-7.4A5 5 0 1 1 12 6a5 5 0 1 1 7.5 6.6Z"/>',
    crown: '<path d="m2 6 4 12h12l4-12-6 5-4-7-4 7-6-5Z"/><path d="M6 22h12"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    trending: '<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>',
    rocket: '<path d="M4.5 16.5c-1 1-1.5 3-1.5 4.5 1.5 0 3.5-.5 4.5-1.5"/><path d="M9 15 4 20"/><path d="M15 9l-6 6"/><path d="M14 4.5C16.5 2 20 2 22 2c0 2 0 5.5-2.5 8L13 16.5 7.5 11 14 4.5Z"/>'
  };
  return `<svg ${common}>${paths[icon] || paths.star}</svg>`;
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
    ctaSupportText,
    faqList, hasImageBorder, fontSizeTitulo, fontSizeSubtitulo,
    timerEnabled, timerDuration, timerText, timerBgColor, timerTextColor, timerBorderRadius, timerStyle,
    avisoEnabled, avisoTopo, avisoPulse, avisoBgColor, avisoTextColor, avisoWidth, avisoPosition,
    badgeEnabled, badgeText, badgePulse, badgeBgColor, badgeTextColor,
    benefitsEnabled, benefitsRaw, trustEnabled, trustItemsRaw, guaranteeEnabled, guaranteeTitle, guaranteeText,
    imageWidth, imageAlign, imagePosition, imageFit, imageFullBleed,
    headerEnabled, headerBrand, headerMenuRaw, headerMenuItems, headerBgColor, headerTextColor, contentAlignment,
    footerEnabled, footerText, footerBgColor, footerTextColor, footerPosition, footerStyle, footerBrand, footerLinksRaw, footerIcon,
    ctaSize, ctaWidth, ctaEffect, faqFontSize, faqAnswerFontSize,
    seoTitle, seoDescription, seoKeywords, lang
  } = state;

  const titleText = stripHtml(parseMarkdown(seoTitle || titulo || 'Presell'));
  const descriptionText = stripHtml(parseMarkdown(seoDescription || subtitulo || titulo || 'Oferta exclusiva por tempo limitado.'));
  const safeKeywords = escapeHtml(seoKeywords || '');
  const safeCtaText = escapeHtml(ctaText || (lang === 'pt' ? 'QUERO MEU ACESSO AGORA' : 'GET INSTANT ACCESS'));
  const safeCtaLink = escapeHtml(ctaLink || '#');
  const safeHeaderBrand = escapeHtml(headerBrand || 'RapidPresell');
  const safeFooterBrand = escapeHtml(footerBrand || headerBrand || 'RapidPresell');
  const footerHtml = parseInlineMarkdown(footerText || `${new Date().getFullYear()} - Todos os direitos reservados.`);
  const footerLinksHtml = footerLinksRaw ? renderMenuMarkdown(footerLinksRaw) : '';
  const safeImageUrl = escapeHtml(imageUrl || '');
  const isThemeGradient = themeColor.includes('linear-gradient') || themeColor.includes('radial-gradient');
  const contentAlignClass = contentAlignment === 'left' ? 'text-left' : contentAlignment === 'right' ? 'text-right' : 'text-center';
  const contentJustifyClass = contentAlignment === 'left' ? 'justify-start' : contentAlignment === 'right' ? 'justify-end' : 'justify-center';
  const imageJustifyClass = imageAlign === 'left' ? 'justify-start' : imageAlign === 'right' ? 'justify-end' : 'justify-center';
  const headerLinksHtml = headerMenuItems?.length ? renderStructuredMenu(headerMenuItems) : renderMenuMarkdown(headerMenuRaw || '');
  const faviconTag = safeImageUrl ? `<link rel="icon" href="${safeImageUrl}" />` : '';
  const benefitItems = String(benefitsRaw || '')
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 6);
  const trustItems = String(trustItemsRaw || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 5);

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

  const benefitsHtml = benefitsEnabled && benefitItems.length > 0 ? `
    <section class="benefit-grid ${contentAlignClass}" aria-label="${lang === 'pt' ? 'Beneficios principais' : 'Main benefits'}">
      ${benefitItems.map((item) => `
        <div class="benefit-item">
          <span class="benefit-icon" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="m20 6-11 11-5-5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
          <span>${parseInlineMarkdown(item)}</span>
        </div>
      `).join('')}
    </section>` : '';

  const trustHtml = trustEnabled && trustItems.length > 0 ? `
    <div class="trust-strip" aria-label="${lang === 'pt' ? 'Indicadores de confianca' : 'Trust indicators'}">
      ${trustItems.map((item) => `<span><svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="m9 12 2 2 4-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>${parseInlineMarkdown(item)}</span>`).join('')}
    </div>` : '';

  const guaranteeHtml = guaranteeEnabled && (guaranteeTitle || guaranteeText) ? `
    <section class="guarantee-box ${contentAlignClass}">
      <div class="guarantee-icon" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="m9 12 2 2 4-5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <div>
        ${guaranteeTitle ? `<h3>${parseInlineMarkdown(guaranteeTitle)}</h3>` : ''}
        ${guaranteeText ? `<div class="markdown-body">${parseMarkdown(guaranteeText)}</div>` : ''}
      </div>
    </section>` : '';

  const ctaSupportHtml = ctaSupportText ? `<div class="cta-support markdown-body ${contentAlignClass}">${parseMarkdown(ctaSupportText)}</div>` : '';

  const faqHtml = faqList.length > 0 ? `
    <section class="faq-section" aria-label="${lang === 'pt' ? 'Perguntas frequentes' : 'Frequently asked questions'}">
      <div class="faq-heading ${contentAlignClass}">
        <span>${lang === 'pt' ? 'Perguntas frequentes' : 'Frequently asked questions'}</span>
        <h2>${lang === 'pt' ? 'Tudo claro antes de avancar' : 'Everything clear before moving forward'}</h2>
      </div>
      <div class="faq-list">
        ${faqList.map((item, index) => `
          <details class="faq-item">
            <summary style="font-size:${faqFontSize}px;">
              <span class="faq-index">${String(index + 1).padStart(2, '0')}</span>
              <span class="faq-question">${escapeHtml(item.question)}</span>
              <span class="faq-toggle" aria-hidden="true"></span>
            </summary>
            <div class="markdown-body faq-answer" style="font-size:${faqAnswerFontSize}px;">${parseMarkdown(item.answer)}</div>
          </details>
        `).join('')}
      </div>
    </section>` : '';

  const ctaPaddingClass = ctaSize === 'small' ? 'cta-small' : ctaSize === 'large' ? 'cta-large' : 'cta-medium';
  const ctaEffectClass = `cta-effect-${ctaEffect || 'shine'}`;
  const footerStyleClass = `footer-${footerStyle || 'glass'}`;

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
    .site-header { position: sticky; top: 0; z-index: 50; border-bottom: 1px solid rgba(255,255,255,.12); backdrop-filter: blur(22px) saturate(150%); background: color-mix(in srgb, ${headerBgColor} 86%, transparent); color: ${headerTextColor}; box-shadow: 0 16px 42px rgba(0,0,0,.18); }
    .site-header::before { content: ''; position: absolute; inset: 0; pointer-events: none; background: linear-gradient(90deg, transparent, rgba(255,255,255,.1), transparent); opacity: .35; }
    .header-inner { position: relative; max-width: 1120px; margin: 0 auto; padding: 14px clamp(16px, 4vw, 28px); display: flex; align-items: center; justify-content: space-between; gap: 16px; }
    .brand { font-size: 12px; font-weight: 900; letter-spacing: .16em; text-transform: uppercase; display: inline-flex; align-items: center; gap: 9px; }
    .brand-mark { width: 30px; height: 30px; display: inline-grid; place-items: center; border-radius: 12px; color: ${ctaColor}; background: ${ctaColor}18; border: 1px solid ${ctaColor}35; box-shadow: 0 10px 28px ${ctaColor}18; }
    a, button, summary { cursor: pointer; }
    .nav-links, .mobile-menu div { display: flex; align-items: center; gap: 18px; }
    .nav-links :where(p, ul, ol), .mobile-menu :where(p, ul, ol) { display: contents; margin: 0; padding: 0; list-style: none; }
    .nav-links li, .mobile-menu li { display: contents; }
    .nav-links { padding: 5px; border: 1px solid rgba(255,255,255,.11); border-radius: 999px; background: rgba(255,255,255,.055); box-shadow: inset 0 1px 0 rgba(255,255,255,.08); }
    .nav-links a { position: relative; color: inherit; text-decoration: none; opacity: .86; font-size: 12px; font-weight: 900; display: inline-flex; align-items: center; gap: 7px; white-space: nowrap; padding: 9px 12px; border-radius: 999px; transition: opacity .2s ease, background .2s ease, transform .2s ease, box-shadow .2s ease; }
    .nav-links a:hover { opacity: 1; transform: translateY(-1px); background: rgba(255,255,255,.1); box-shadow: 0 10px 24px rgba(0,0,0,.14); }
    .nav-links a svg, .mobile-menu a svg { color: ${ctaColor}; }
    .menu-button { display: none; width: 42px; height: 42px; border: 1px solid rgba(255,255,255,.14); border-radius: 15px; background: rgba(255,255,255,.08); color: inherit; place-items: center; cursor: pointer; box-shadow: inset 0 1px 0 rgba(255,255,255,.1); }
    .menu-button span { display: block; width: 18px; height: 2px; border-radius: 999px; background: currentColor; transition: transform .22s ease, opacity .22s ease; }
    .menu-button span + span { margin-top: 5px; }
    .menu-button.is-open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .menu-button.is-open span:nth-child(2) { opacity: 0; }
    .menu-button.is-open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
    .mobile-menu { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .28s ease; border-top: 1px solid rgba(255,255,255,.08); background: linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.035)); }
    .mobile-menu.is-open { grid-template-rows: 1fr; }
    .mobile-menu > div { overflow: hidden; display: grid; gap: 8px; padding: 0 clamp(16px, 4vw, 28px); }
    .mobile-menu.is-open > div { padding-bottom: 16px; padding-top: 8px; }
    .mobile-menu a { color: inherit; text-decoration: none; font-weight: 900; padding: 12px 13px; border-radius: 16px; display: inline-flex; align-items: center; gap: 9px; background: rgba(255,255,255,.055); border: 1px solid rgba(255,255,255,.08); }
    .top-notice { width: 100%; text-align: center; font-size: clamp(12px, 2.8vw, 14px); font-weight: 900; padding: 10px 14px; letter-spacing: .02em; }
    .notice-card { max-width: 760px; margin: 12px auto 0; border-radius: 14px; }
    .offer-main { position: relative; flex: 1; display: flex; align-items: center; justify-content: center; padding: clamp(30px, 6vw, 72px) clamp(14px, 4vw, 28px); }
    .offer-card { --flow-gap: clamp(18px, 3.2vw, 28px); --flow-tight: clamp(10px, 1.8vw, 16px); --flow-large: clamp(26px, 4vw, 40px); width: min(100%, 780px); display: flex; flex-direction: column; ${contentAlignment === 'left' ? 'align-items:flex-start;' : contentAlignment === 'right' ? 'align-items:flex-end;' : 'align-items:center;'} color: ${textColor}; border-radius: ${borderRadius}px; }
    .badge-wrap { display: flex; justify-content: center; width: 100%; margin-bottom: 18px; }
    .badge-wrap span { display: inline-flex; border: 1px solid; border-radius: 999px; padding: 7px 13px; font-size: 11px; font-weight: 900; letter-spacing: .12em; text-transform: uppercase; }
    .offer-image { display: flex; width: 100%; margin: 0 0 24px; }
    .offer-image-frame { position: relative; overflow: hidden; aspect-ratio: 16 / 9; max-width: 100%; background: rgba(255,255,255,.05); }
    .offer-image-frame img { width: 100%; height: 100%; display: block; }
    .offer-image.full-bleed { width: min(100vw, 860px); max-width: none; position: relative; left: 50%; transform: translateX(-50%); }
    h1 { max-width: 760px; margin: 0 0 14px; font-size: min(${fontSizeTitulo}px, 11vw); line-height: 1.08; font-weight: 900; text-wrap: balance; }
    .subtitle { max-width: 680px; margin: 0 0 24px; font-size: min(${fontSizeSubtitulo}px, 5.2vw); line-height: 1.7; opacity: .9; }
    .markdown-body :where(p, ul, ol, blockquote, pre, table) { margin: 0 0 .9em; }
    .markdown-body ul, .markdown-body ol { padding-left: 1.3em; }
    .markdown-body a { color: ${ctaColor}; font-weight: 800; }
    .markdown-body code { padding: .15em .35em; border-radius: 6px; background: rgba(0,0,0,.22); }
    .markdown-body pre { overflow: auto; padding: 12px; border-radius: 12px; background: rgba(0,0,0,.28); }
    .benefit-grid { width: 100%; max-width: 680px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin: 0 0 18px; }
    .benefit-item { min-width: 0; display: flex; align-items: flex-start; gap: 9px; padding: 12px; border: 1px solid rgba(255,255,255,.12); border-radius: 16px; background: linear-gradient(180deg, rgba(255,255,255,.095), rgba(255,255,255,.035)); box-shadow: inset 0 1px 0 rgba(255,255,255,.08); font-size: clamp(11px, 2.4vw, 13px); font-weight: 800; line-height: 1.35; }
    .benefit-item p { margin: 0; }
    .benefit-icon { flex: 0 0 auto; width: 24px; height: 24px; border-radius: 999px; display: inline-grid; place-items: center; color: ${ctaColor}; background: ${ctaColor}18; border: 1px solid ${ctaColor}30; }
    .trust-strip { width: 100%; max-width: 680px; display: flex; justify-content: ${contentAlignment === 'left' ? 'flex-start' : contentAlignment === 'right' ? 'flex-end' : 'center'}; flex-wrap: wrap; gap: 8px; margin: 0 0 22px; }
    .trust-strip span { display: inline-flex; align-items: center; gap: 5px; padding: 7px 10px; border-radius: 999px; border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.07); color: currentColor; opacity: .86; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: .05em; }
    .timer-box { width: 100%; max-width: 560px; margin: 0 0 24px; padding: 16px; text-align: center; border: 1px solid rgba(255,255,255,.12); box-shadow: 0 18px 44px rgba(0,0,0,.18); }
    .timer-cards .timer-digits > div { min-width: 82px; border-radius: 16px; padding: 12px; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.14); }
    .timer-glass { backdrop-filter: blur(18px); background: linear-gradient(135deg, rgba(255,255,255,.18), rgba(255,255,255,.06)) !important; }
    .timer-urgency { border: 1px solid rgba(248,113,113,.45); box-shadow: 0 20px 48px rgba(239,68,68,.18); }
    .timer-urgency .timer-digits strong { color: #fecaca; }
    .timer-label { margin: 0 0 8px; font-size: 11px; font-weight: 900; opacity: .75; text-transform: uppercase; letter-spacing: .12em; }
    .timer-digits { display: flex; justify-content: center; gap: 14px; align-items: center; }
    .timer-digits strong { display: block; font-size: 28px; line-height: 1; }
    .timer-digits small { display: block; margin-top: 4px; font-size: 9px; opacity: .52; font-weight: 800; text-transform: uppercase; }
    .cta-row { width: 100%; display: flex; margin: 0 0 12px; }
    .cta-button { position: relative; overflow: hidden; width: ${ctaWidth}%; max-width: 100%; display: inline-flex; align-items: center; justify-content: center; text-align: center; color: white; text-decoration: none; padding-left: 18px; padding-right: 18px; border-radius: ${Math.max(6, borderRadius - 4)}px; font-weight: 900; text-transform: uppercase; letter-spacing: .04em; background: linear-gradient(135deg, ${ctaColor}, color-mix(in srgb, ${ctaColor} 76%, #ffffff)); box-shadow: 0 16px 32px ${ctaColor}38, inset 0 1px 0 rgba(255,255,255,.22); text-shadow: 0 1px 2px rgba(0,0,0,.28); transition: transform .2s ease, box-shadow .2s ease, filter .2s ease; }
    .cta-button::after { content: ''; position: absolute; inset: -40% auto -40% -45%; width: 38%; transform: skewX(-18deg); background: linear-gradient(90deg, transparent, rgba(255,255,255,.58), transparent); opacity: 0; pointer-events: none; }
    .cta-button:hover { transform: translateY(-2px); filter: brightness(1.05); box-shadow: 0 22px 42px ${ctaColor}48, inset 0 1px 0 rgba(255,255,255,.24); }
    .cta-small { min-height: 42px; font-size: 13px; }
    .cta-medium { min-height: 52px; font-size: 15px; }
    .cta-large { min-height: 62px; font-size: min(19px, 4.8vw); }
    .cta-support { width: 100%; max-width: 600px; margin: 0 0 22px; font-size: clamp(11px, 2.6vw, 13px); line-height: 1.55; opacity: .78; }
    .cta-support p { margin-bottom: 0; }
    .guarantee-box { width: 100%; max-width: 680px; display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 12px; align-items: start; margin: 0 0 24px; padding: 14px; border-radius: 18px; border: 1px solid rgba(255,255,255,.12); background: linear-gradient(135deg, rgba(255,255,255,.1), rgba(255,255,255,.035)); }
    .guarantee-icon { width: 34px; height: 34px; border-radius: 13px; display: grid; place-items: center; color: ${ctaColor}; background: ${ctaColor}18; border: 1px solid ${ctaColor}30; }
    .guarantee-box h3 { margin: 0 0 4px; font-size: 14px; font-weight: 900; }
    .guarantee-box .markdown-body { font-size: 12px; line-height: 1.6; opacity: .78; }
    .guarantee-box .markdown-body p:last-child { margin-bottom: 0; }
    .cta-effect-pulse { animation: pulse-button 2.4s infinite; }
    .cta-effect-shine::after { animation: shine-button 2.8s infinite; opacity: 1; }
    .cta-effect-float { animation: float-button 3s ease-in-out infinite; }
    .cta-effect-glow { animation: glow-button 2.8s ease-in-out infinite; }
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
    .faq-section { max-width: 720px; margin-top: 4px; padding: clamp(16px, 4vw, 22px); border: 1px solid rgba(255,255,255,.12); border-radius: 24px; background: linear-gradient(180deg, rgba(255,255,255,.09), rgba(255,255,255,.035)); box-shadow: 0 24px 70px rgba(0,0,0,.2), inset 0 1px 0 rgba(255,255,255,.08); }
    .faq-heading { margin-bottom: 14px; }
    .faq-heading span { display: block; margin-bottom: 5px; color: ${ctaColor}; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: .16em; }
    .faq-heading h2 { margin: 0; font-size: clamp(18px, 4.2vw, 24px); font-weight: 900; line-height: 1.15; text-wrap: balance; text-transform: none; letter-spacing: 0; }
    .faq-list { display: grid; gap: 10px; }
    .faq-item { border: 1px solid rgba(255,255,255,.12); border-radius: 18px; background: rgba(0,0,0,.16); overflow: hidden; transition: border-color .2s ease, background .2s ease, transform .2s ease; }
    .faq-item[open] { border-color: ${ctaColor}55; background: rgba(255,255,255,.075); }
    .faq-item summary { list-style: none; cursor: pointer; display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 12px; padding: 15px; font-weight: 900; }
    .faq-item summary::after { content: none; }
    .faq-item summary::-webkit-details-marker { display: none; }
    .faq-index { width: 30px; height: 30px; display: inline-grid; place-items: center; border-radius: 11px; color: ${ctaColor}; background: ${ctaColor}18; border: 1px solid ${ctaColor}2e; font-size: 10px; font-weight: 900; }
    .faq-question { min-width: 0; overflow-wrap: anywhere; line-height: 1.35; }
    .faq-toggle { position: relative; width: 26px; height: 26px; border-radius: 999px; border: 1px solid rgba(255,255,255,.14); background: rgba(255,255,255,.07); transition: transform .2s ease, border-color .2s ease; }
    .faq-toggle::before, .faq-toggle::after { content: ''; position: absolute; left: 50%; top: 50%; width: 11px; height: 2px; border-radius: 99px; background: currentColor; transform: translate(-50%, -50%); }
    .faq-toggle::after { transform: translate(-50%, -50%) rotate(90deg); }
    .faq-item[open] .faq-toggle { transform: rotate(45deg); border-color: ${ctaColor}66; color: ${ctaColor}; }
    .faq-item .faq-answer { padding: 0 15px 16px 57px; line-height: 1.68; opacity: .86; }
    .site-footer { width: 100%; padding: 18px clamp(14px, 4vw, 28px); color: ${footerTextColor}; background: ${footerBgColor}; border-top: 1px solid rgba(255,255,255,.1); }
    .footer-inner { width: min(100%, 1120px); margin: 0 auto; display: grid; gap: 14px; align-items: center; padding: 0; font-size: 12px; }
    .footer-split .footer-inner, .footer-brand .footer-inner { grid-template-columns: minmax(0, 1fr) auto; }
    .footer-glass .footer-inner, .footer-brand .footer-inner { border: 1px solid rgba(255,255,255,.11); border-radius: 22px; padding: 16px; background: rgba(255,255,255,.06); box-shadow: inset 0 1px 0 rgba(255,255,255,.08); backdrop-filter: blur(16px); }
    .footer-brand-row { display: flex; align-items: center; gap: 10px; min-width: 0; }
    .footer-icon { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 14px; color: ${ctaColor}; background: ${ctaColor}18; border: 1px solid ${ctaColor}35; flex: 0 0 auto; }
    .footer-brand-name { display: block; color: ${footerTextColor}; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: .14em; }
    .footer-copy { opacity: .78; line-height: 1.65; }
    .footer-links { display: flex; flex-wrap: wrap; gap: 8px; justify-content: ${footerPosition === 'left' ? 'flex-start' : footerPosition === 'right' ? 'flex-end' : 'center'}; }
    .footer-links :where(p, ul, ol) { display: contents; margin: 0; padding: 0; list-style: none; }
    .footer-links li { display: contents; }
    .footer-links a { color: inherit; text-decoration: none; font-size: 11px; font-weight: 900; opacity: .75; padding: 7px 10px; border-radius: 999px; border: 1px solid rgba(255,255,255,.1); background: rgba(255,255,255,.045); transition: opacity .2s ease, background .2s ease, transform .2s ease; }
    .footer-links a:hover { opacity: 1; transform: translateY(-1px); background: rgba(255,255,255,.09); }
    .offer-card > :is(.top-notice, .badge-wrap, .offer-image, h1, .subtitle, .benefit-grid, .trust-strip, .timer-box, .cta-row, .cta-support, .guarantee-box, .faq-section) { margin-block: 0; }
    .offer-card > * + * { margin-top: var(--flow-gap); }
    .offer-card > :is(.top-notice, .badge-wrap) + :is(.badge-wrap, .offer-image, h1), .offer-card > h1 + .subtitle, .offer-card > .cta-row + .cta-support { margin-top: var(--flow-tight); }
    .offer-card > .faq-section { margin-top: var(--flow-large); }
    @keyframes pulse-button { 0% { transform: scale(1); box-shadow: 0 16px 32px ${ctaColor}38, 0 0 0 0 ${ctaColor}72; } 70% { transform: scale(1.025); box-shadow: 0 16px 32px ${ctaColor}38, 0 0 0 14px ${ctaColor}00; } 100% { transform: scale(1); box-shadow: 0 16px 32px ${ctaColor}38, 0 0 0 0 ${ctaColor}00; } }
    @keyframes shine-button { 0% { left: -45%; opacity: 0; } 18% { opacity: 1; } 42% { left: 120%; opacity: 0; } 100% { left: 120%; opacity: 0; } }
    @keyframes float-button { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
    @keyframes glow-button { 0%, 100% { box-shadow: 0 16px 32px ${ctaColor}38, 0 0 0 0 ${ctaColor}44; } 50% { box-shadow: 0 18px 40px ${ctaColor}55, 0 0 30px ${ctaColor}65; } }
    @keyframes pulse-soft { 50% { filter: brightness(1.15); transform: translateY(-1px); } }
    @media (max-width: 720px) {
      .nav-links { display: none; }
      .menu-button { display: grid; }
      .offer-main { align-items: flex-start; padding-top: 30px; padding-bottom: 38px; }
      .offer-card { width: 100%; --flow-gap: clamp(16px, 5vw, 24px); --flow-tight: clamp(9px, 3vw, 14px); --flow-large: clamp(24px, 7vw, 34px); }
      .offer-image-frame { max-width: 100%; }
      .offer-image.full-bleed { width: calc(100vw - 20px); }
      .benefit-grid { grid-template-columns: 1fr; }
      .trust-strip { justify-content: ${contentAlignment === 'left' ? 'flex-start' : contentAlignment === 'right' ? 'flex-end' : 'center'}; }
      .faq-section { border-radius: 20px; padding: 14px; }
      .faq-item summary { gap: 9px; padding: 13px; }
      .faq-index { width: 26px; height: 26px; border-radius: 9px; }
      .faq-item .faq-answer { padding: 0 13px 14px 48px; }
      .timer-box { padding: 14px 12px; }
      .footer-split .footer-inner, .footer-brand .footer-inner { grid-template-columns: 1fr; }
      .footer-links { justify-content: center; }
    }
  </style>
</head>
<body class="min-h-screen flex flex-col">
  ${headerEnabled ? `<header class="site-header">
    <div class="header-inner">
      <a href="#offer" class="brand" style="color:inherit;text-decoration:none;"><span class="brand-mark">${menuIconSvg('rocket')}</span><span>${safeHeaderBrand}</span></a>
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
      ${benefitsHtml}
      ${trustHtml}
      ${timerEnabled ? `<section class="timer-box timer-${timerStyle}" style="background-color:${timerBgColor};color:${timerTextColor};border-radius:${timerBorderRadius}px;">
        <p class="timer-label">${escapeHtml(timerText)}</p>
        <div class="timer-digits"><div><strong id="t-min">00</strong><small>${lang === 'pt' ? 'Minutos' : 'Minutes'}</small></div><span>:</span><div><strong id="t-sec">00</strong><small>${lang === 'pt' ? 'Segundos' : 'Seconds'}</small></div></div>
      </section>` : ''}
      <div class="cta-row ${contentJustifyClass}">
        <a href="${safeCtaLink}" target="_blank" rel="noopener noreferrer nofollow sponsored" class="cta-button ${ctaEffectClass} ${ctaPaddingClass}" aria-label="${safeCtaText}">${safeCtaText}</a>
      </div>
      ${ctaSupportHtml}
      ${guaranteeHtml}
      ${faqHtml}
    </article>
  </main>
  ${footerEnabled ? `<footer class="site-footer ${footerStyleClass}">
    <div class="footer-inner" style="text-align:${footerPosition};">
      <div class="footer-brand-row">
        <span class="footer-icon" aria-hidden="true">${menuIconSvg(footerIcon || 'shield')}</span>
        <div>
          <span class="footer-brand-name">${safeFooterBrand}</span>
          <div class="footer-copy markdown-body">${footerHtml}</div>
        </div>
      </div>
      ${footerLinksHtml ? `<nav class="footer-links">${footerLinksHtml}</nav>` : ''}
    </div>
  </footer>` : ''}
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
