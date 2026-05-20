export const parseMarkdown = (text: string): string => {
  if (!text) return '';
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  
  html = html.replace(/\[(.*?)\]\{(.*?)\}/g, '<span style="color: $2" class="font-extrabold">$1</span>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-inherit">$1</strong>');
  html = html.replace(/\*(.*?)\*(?!\*)/g, '<em class="opacity-90">$1</em>');
  html = html.replace(/~~(.*?)~~/g, '<del class="opacity-80">$1</del>');
  html = html.replace(/~(.*?)~/g, '<del class="opacity-80">$1</del>');
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline underline-offset-2">$1</a>');
  html = html.replace(/\n/g, '<br />');
  
  return html;
};

export const generateHTML = (state: any, activeId: string | null): string => {
  const {
    titulo, subtitulo, imageUrl, ctaText, ctaLink, ctaColor, themeColor, textColor, borderRadius,
    faqList, hasImageBorder, fontSizeTitulo, fontSizeSubtitulo,
    timerEnabled, timerDuration, timerText, timerBgColor, timerTextColor, timerBorderRadius,
    avisoEnabled, avisoTopo, avisoPulse, avisoBgColor, avisoTextColor, avisoWidth, avisoPosition,
    badgeEnabled, badgeText, badgePulse, badgeBgColor, badgeTextColor,
    imageWidth, imageAlign, imagePosition, imageFit, imageFullBleed,
    headerEnabled, headerBrand, headerMenuRaw, headerBgColor, headerTextColor, contentAlignment,
    footerEnabled, footerText, footerBgColor, footerTextColor, footerPosition,
    ctaSize, ctaWidth, faqFontSize, faqAnswerFontSize
  } = state;

  const safeTitle = titulo.replace(/"/g, '&quot;');
  const isThemeGradient = themeColor.includes('linear-gradient') || themeColor.includes('radial-gradient');
  const cardAlignClass = imageAlign === 'left' ? 'justify-start text-left' : imageAlign === 'right' ? 'justify-end text-right' : 'justify-center text-center';
  const contentAlignClass = contentAlignment === 'left' ? 'text-left' : contentAlignment === 'right' ? 'text-right' : 'text-center';
  const contentItemsClass = contentAlignment === 'left' ? 'items-start' : contentAlignment === 'right' ? 'items-end' : 'items-center';
  const contentJustifyClass = contentAlignment === 'left' ? 'justify-start' : contentAlignment === 'right' ? 'justify-end' : 'justify-center';

  const escapeHtml = (value: string) =>
    String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const safeCtaText = escapeHtml(ctaText || 'QUERO MEU ACESSO AGORA');
  const safeCtaLink = escapeHtml(ctaLink || '#');
  const safeHeaderBrand = escapeHtml(headerBrand || 'FastPresell');
  const safeFooterText = escapeHtml(footerText || `© ${new Date().getFullYear()} Todos os direitos reservados.`);
  const headerItems = headerMenuRaw ? headerMenuRaw.split(',').map((item: string) => item.trim()).filter(Boolean) : [];

  const cardImageHtml = imageUrl ? `
    <div class="flex w-full mb-6 ${cardAlignClass.split(' ')[0]} ${imageFullBleed ? 'mx-[-1.25rem] md:mx-[-2rem] w-[calc(100%+2.5rem)] md:w-[calc(100%+4rem)] rounded-none' : ''}">
      <div class="relative overflow-hidden aspect-video transition-all duration-300"
           style="width: ${imageFullBleed ? '100%' : `${imageWidth}%`}; border-radius: ${imageFullBleed ? '0px' : `${Math.max(4, borderRadius - 4)}px`}; border: ${hasImageBorder && !imageFullBleed ? '2px solid rgba(255,255,255,0.15)' : 'none'}; box-shadow: ${hasImageBorder && !imageFullBleed ? `0 10px 20px rgba(0,0,0,0.5), 0 0 15px ${ctaColor}15` : 'none'};">
        <img src="${escapeHtml(imageUrl)}" alt="Imagem de Oferta" class="w-full h-full" style="object-fit: ${imageFit};" loading="lazy" />
      </div>
    </div>` : '';

  const renderAvisoHTML = () => {
    if (!avisoEnabled || !avisoTopo) return '';
    const layoutClass = avisoWidth === 'full' ? 'w-full' : 'mx-4 mt-2 rounded-xl';
    const pulseClass = avisoPulse ? 'animate-pulse' : '';
    return `<div class="text-center text-sm md:text-xs lg:text:md font-bold py-1.5 lg:py-2 px-3 shadow-md tracking-wide z-10 ${pulseClass} ${layoutClass}" style="background-color: ${avisoBgColor}; color: ${avisoTextColor};">
      ${escapeHtml(avisoTopo)}
    </div>`;
  };

  const renderBadgeHTML = () => {
    if (!badgeEnabled || !badgeText) return '';
    const pulseClass = badgePulse ? 'animate-pulse' : '';
    return `<div class="mb-4 flex justify-center ${pulseClass}">
      <span class="inline-flex items-center gap-1 text-[10px] font-black px-3.5 py-1 rounded-full border uppercase tracking-widest" style="background-color: ${badgeBgColor}; color: ${badgeTextColor}; border-color: ${badgeTextColor}30;">
        ${escapeHtml(badgeText)}
      </span>
    </div>`;
  };

  const faqHtml = faqList && faqList.length > 0 ? `
    <div class="w-full mt-6 pt-6 border-t border-slate-800/60">
      <h4 class="text-xs font-black uppercase ${contentAlignClass} tracking-wider mb-3">Dúvidas Frequentes</h4>
      <div class="space-y-2">
        ${faqList.map((item: any) => `
          <details class="group bg-slate-950/50 border border-slate-850 p-3 rounded-lg transition-all">
            <summary class="flex items-center justify-between cursor-pointer focus:outline-none font-extrabold text-white" style="font-size: ${faqFontSize}px;">
              <span>${escapeHtml(item.question)}</span>
            </summary>
            <p class="text-slate-300 mt-2 leading-relaxed border-t border-slate-800/40 pt-2 whitespace-pre-wrap" style="font-size: ${faqAnswerFontSize}px;">
              ${parseMarkdown(item.answer)}
            </p>
          </details>
        `).join('')}
      </div>
    </div>` : '';

  const headerLinksHtml = headerItems.length > 0 ? headerItems.map((item: string) => `
      <a href="#" class="text-[12px] font-semibold transition hover:text-white">${escapeHtml(item)}</a>
    `).join('') : '';

  const headerHtml = headerEnabled ? `
    <header class="sticky top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/10" style="background: ${headerBgColor}; color: ${headerTextColor};">
      <div class="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
        <span class="font-black uppercase tracking-[0.24em] text-xs">${safeHeaderBrand}</span>
        <nav class="hidden md:flex items-center gap-4">
          ${headerLinksHtml}
        </nav>
        <button type="button" onclick="togglePresellMenu()" class="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-2xl border border-white/10 text-white/90">
          ☰
        </button>
      </div>
      <div id="presell-nav-menu" class="hidden md:hidden px-4 pb-4 pt-2 border-t border-white/10 flex flex-col gap-2">
        ${headerLinksHtml}
      </div>
    </header>
  ` : '';

  const footerHtml = footerEnabled ? `
    <footer class="w-full mt-6 border-t border-slate-800/80">
      <div class="w-full py-4 text-sm" style="background-color: ${footerBgColor}; color: ${footerTextColor}; text-align: ${footerPosition};">
        ${safeFooterText}
      </div>
    </footer>
  ` : '';

  const ctaPaddingY = ctaSize === 'small' ? 'py-2' : ctaSize === 'large' ? 'py-4' : 'py-3';
  const ctaTextSize = ctaSize === 'small' ? 'text-xs' : ctaSize === 'large' ? 'text-base md:text-lg' : 'text-sm md:text-base';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${safeTitle}</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
<style>
  body {
    margin: 0;
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: ${isThemeGradient ? themeColor : 'none'};
    background-color: ${isThemeGradient ? 'transparent' : themeColor};
    color: ${textColor};
    scroll-behavior: smooth;
  }
  .pulse-btn {
    animation: pulse-animation 2.2s infinite;
  }
  @keyframes pulse-animation {
    0% { transform: scale(1); box-shadow: 0 0 0 0px ${ctaColor}80; }
    70% { transform: scale(1.03); box-shadow: 0 0 0 12px ${ctaColor}00; }
    100% { transform: scale(1); box-shadow: 0 0 0 0px ${ctaColor}00; }
  }
  details summary::-webkit-details-marker { display:none; }
  details summary::marker { display:none; }
  details summary::after {
    content: '▼';
    transition: transform .2s ease;
    display: inline-block;
    margin-left: 0.75rem;
  }
  details[open] summary::after { transform: rotate(180deg); }
</style>
</head>
<body class="min-h-screen flex flex-col justify-between selection:bg-violet-600 selection:text-white">
${headerHtml}
${avisoPosition === 'sticky' ? renderAvisoHTML() : ''}
<main class="grow flex flex-col items-center justify-center">
  <div class="w-full lg:max-w-3xl p-6 md:p-8 overflow-hidden" style="border-radius: ${borderRadius}px; color: ${textColor};">
    ${avisoPosition === 'top-card' ? `<div class="mb-5">${renderAvisoHTML()}</div>` : ''}
    ${renderBadgeHTML()}
    ${imagePosition === 'top' ? cardImageHtml : ''}
    <h1 class="font-black leading-snug tracking-tight mb-3 ${contentAlignClass}" style="font-size: ${fontSizeTitulo}px; color: ${textColor === '#ffffff' ? '#ffffff' : '#0f172a'};">
      ${parseMarkdown(titulo)}
    </h1>
    ${imagePosition === 'middle' ? cardImageHtml : ''}
    ${subtitulo ? `<p class="opacity-90 leading-relaxed mb-5 ${contentAlignClass}" style="font-size: ${fontSizeSubtitulo}px;">${parseMarkdown(subtitulo)}</p>` : ''}
    ${imagePosition === 'bottom' ? cardImageHtml : ''}
    ${timerEnabled ? `
      <div class="w-full p-4 mb-6 text-center border border-slate-800/40 shadow-md" style="background-color: ${timerBgColor}; color: ${timerTextColor}; border-radius: ${timerBorderRadius}px;">
        <p class="text-[10px] font-bold opacity-70 uppercase tracking-widest mb-2">${escapeHtml(timerText)}</p>
        <div class="flex justify-center gap-3 items-center">
          <div class="flex flex-col">
            <span id="t-min" class="text-2xl font-black">00</span>
            <span class="text-[9px] opacity-40 uppercase font-bold">Minutes</span>
          </div>
          <span class="text-xl font-bold opacity-40">:</span>
          <div class="flex flex-col">
            <span id="t-sec" class="text-2xl font-black">00</span>
            <span class="text-[9px] opacity-40 uppercase font-bold">Seconds</span>
          </div>
        </div>
      </div>
    ` : ''}
    <div class="w-full flex ${contentJustifyClass} mb-6">
      <a href="${safeCtaLink}" target="_blank" rel="noopener noreferrer" class="pulse-btn block max-w-full text-center text-white px-5 rounded-xl font-black uppercase tracking-wider transition-all transform active:scale-95 shadow-lg ${ctaPaddingY} ${ctaTextSize}" style="background-color: ${ctaColor}; border-radius: ${Math.max(4, borderRadius - 4)}px; box-shadow: 0 4px 14px 0 ${ctaColor}35; text-shadow: 1px 1px 2px rgba(0,0,0,0.3); width: ${ctaWidth}%;">
        ${safeCtaText}
      </a>
    </div>
    ${faqHtml}
  </div>
  ${footerHtml}
</main>
${timerEnabled ? `
  <script>
    function togglePresellMenu() {
      const menu = document.getElementById('presell-nav-menu');
      if (!menu) return;
      menu.classList.toggle('hidden');
    }
    (function() {
      const STORAGE_KEY = 'presell_t_end_' + '${activeId || 'p'}';
      const durationMs = ${timerDuration} * 60 * 1000;
      let targetTime = localStorage.getItem(STORAGE_KEY);
      if (!targetTime) {
        targetTime = Date.now() + durationMs;
        localStorage.setItem(STORAGE_KEY, targetTime);
      } else {
        targetTime = parseInt(targetTime, 10);
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
