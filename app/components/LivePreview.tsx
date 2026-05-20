'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Smartphone, Monitor, ExternalLink } from 'lucide-react';
import { usePresell } from '../context/PresellContext';
import { parseMarkdown } from '../lib/HtmlGenerator';

export function LivePreview({ 
  previewDevice, 
  setPreviewDevice 
}: { 
  previewDevice: 'mobile' | 'desktop', 
  setPreviewDevice: (v: 'mobile' | 'desktop') => void 
}) {
  const ctx = usePresell();
  
  // Timer State for preview
  const [timeLeft, setTimeLeft] = useState(ctx.timerDuration * 60);

  useEffect(() => {
    setTimeLeft(ctx.timerDuration * 60);
  }, [ctx.timerDuration]);

  useEffect(() => {
    if (!ctx.timerEnabled || timeLeft <= 0) return;
    const timerId = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(timerId);
  }, [ctx.timerEnabled, timeLeft]);

  const formatTime = {
    min: String(Math.floor(timeLeft / 60)).padStart(2, '0'),
    sec: String(timeLeft % 60).padStart(2, '0')
  };

  const isThemeGradient = ctx.themeColor.includes('linear-gradient') || ctx.themeColor.includes('radial-gradient');

  const renderAvisoPreview = () => {
    if (!ctx.avisoEnabled || !ctx.avisoTopo) return null;
    return (
      <div 
        className={`text-center text-sm md:text-xs lg:text-sm font-bold py-1.5 lg:py-2 px-3 shadow-md tracking-wide z-10 ${ctx.avisoPulse ? 'animate-pulse' : ''} ${ctx.avisoWidth === 'full' ? 'w-full' : 'mx-4 mt-2 rounded-xl'}`}
        style={{ backgroundColor: ctx.avisoBgColor, color: ctx.avisoTextColor }}
      >
        {ctx.avisoTopo}
      </div>
    );
  };

  const renderBadgePreview = () => {
    if (!ctx.badgeEnabled || !ctx.badgeText) return null;
    return (
      <div className={`mb-4 flex justify-center ${ctx.badgePulse ? 'animate-pulse' : ''}`}>
        <span 
          className="inline-flex items-center gap-1 text-[10px] font-black px-3.5 py-1 rounded-full border uppercase tracking-widest"
          style={{ backgroundColor: ctx.badgeBgColor, color: ctx.badgeTextColor, borderColor: `${ctx.badgeTextColor}30` }}
        >
          {ctx.badgeText}
        </span>
      </div>
    );
  };

  const renderImage = () => {
    if (!ctx.imageUrl) return null;
    const cardAlignClass = ctx.imageAlign === 'left' ? 'justify-start text-left' : ctx.imageAlign === 'right' ? 'justify-end text-right' : 'justify-center text-center';
    
    return (
      <div className={`flex w-full mb-6 ${cardAlignClass} ${ctx.imageFullBleed ? 'mx-[-1.25rem] md:mx-[-2rem] w-[calc(100%+2.5rem)] md:w-[calc(100%+4rem)]' : ''}`}>
        <div 
          className="relative overflow-hidden aspect-video transition-all duration-300"
          style={{ 
            width: ctx.imageFullBleed ? '100%' : `${ctx.imageWidth}%`,
            borderRadius: ctx.imageFullBleed ? '0px' : `${Math.max(4, ctx.borderRadius - 4)}px`,
            border: ctx.hasImageBorder && !ctx.imageFullBleed ? '2px solid rgba(255,255,255,0.15)' : 'none',
            boxShadow: ctx.hasImageBorder && !ctx.imageFullBleed ? `0 10px 20px rgba(0,0,0,0.5), 0 0 15px ${ctx.ctaColor}15` : 'none'
          }}
        >
          <img 
            src={ctx.imageUrl} 
            alt="Preview Visual" 
            className="w-full h-full"
            style={{ objectFit: ctx.imageFit }}
          />
        </div>
      </div>
    );
  };

  const renderPreviewHeader = () => {
    if (!ctx.headerEnabled) return null;
    const links = ctx.headerMenuRaw.split(',').map(s => s.trim()).filter(Boolean);
    return (
      <header className="w-full py-3 px-4 flex items-center justify-between border-b border-white/10" style={{ backgroundColor: ctx.headerBgColor, color: ctx.headerTextColor }}>
        <span className="font-black uppercase tracking-[0.2em] text-[10px]">{ctx.headerBrand}</span>
        {previewDevice === 'desktop' ? (
          <nav className="flex items-center gap-3">
            {links.map((link, i) => <span key={i} className="text-[10px] opacity-80 font-bold">{link}</span>)}
          </nav>
        ) : (
          <div className="w-6 h-6 flex flex-col justify-center items-center gap-1">
            <span className="w-4 h-0.5 bg-current rounded-full"></span>
            <span className="w-4 h-0.5 bg-current rounded-full"></span>
            <span className="w-4 h-0.5 bg-current rounded-full"></span>
          </div>
        )}
      </header>
    );
  };

  const contentAlignClass = ctx.contentAlignment === 'left' ? 'text-left' : ctx.contentAlignment === 'right' ? 'text-right' : 'text-center';
  const contentJustifyClass = ctx.contentAlignment === 'left' ? 'justify-start' : ctx.contentAlignment === 'right' ? 'justify-end' : 'justify-center';

  // Apply new cta Size classes
  const ctaPaddingY = ctx.ctaSize === 'small' ? 'py-2' : ctx.ctaSize === 'large' ? 'py-4' : 'py-3';
  const ctaTextSize = ctx.ctaSize === 'small' ? 'text-xs' : ctx.ctaSize === 'large' ? 'text-base md:text-lg' : 'text-sm md:text-base';

  return (
    <section className=" lg:block lg:col-span-6 xl:col-span-7 lg:sticky lg:top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
      
      {/* BARRA DE ALTERNAÇÃO DE PREVIEW */}
      <div className="bg-slate-900 border border-slate-850 rounded-2xl p-3 shadow-lg flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-pulse"></span>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1">
            <Eye className="w-4 h-4 text-violet-400" />
            Live Preview
          </h3>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800/80">
          <button
            type="button"
            onClick={() => setPreviewDevice('mobile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              previewDevice === 'mobile' ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
          
          <button
            type="button"
            onClick={() => setPreviewDevice('desktop')}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              previewDevice === 'desktop' ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
        </div>
      </div>

      {/* SIMULADOR DE TELA DO DISPOSITIVO */}
      <div className="bg-slate-950 border border-slate-900 rounded-3xl p-4 flex justify-center items-start overflow-hidden min-h-[620px] shadow-inner relative">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none"></div>

        <div className={`transition-all duration-300 w-full flex justify-center ${
          previewDevice === 'mobile' ? 'max-w-[385px]' : 'max-w-full'
        }`}>
          <div 
            className={`w-full transition-all relative flex flex-col justify-between ${
              previewDevice === 'mobile' 
              ? 'border-[10px] border-slate-800 rounded-[3rem] shadow-2xl min-h-[660px] overflow-y-auto aspect-[9/19]' 
              : 'border border-slate-900 rounded-2xl shadow-xl min-h-[480px]'
            }`}
            style={{ background: isThemeGradient ? ctx.themeColor : undefined, backgroundColor: !isThemeGradient ? ctx.themeColor : undefined }}
          >
            {previewDevice === 'mobile' && (
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-slate-850 rounded-full z-50 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-slate-900 absolute right-4"></span>
                <span className="w-10 h-0.5 bg-slate-950 rounded-full"></span>
              </div>
            )}

            <div className={`text-slate-100 flex flex-col justify-between h-full ${
              previewDevice === 'mobile' ? 'pt-8' : ''
            }`} style={{ color: ctx.textColor }}>
              
              {renderPreviewHeader()}
              {ctx.avisoPosition === 'sticky' && renderAvisoPreview()}

              <div className={`flex-1 flex flex-col ${ctx.contentAlignment === 'left' ? 'items-start' : ctx.contentAlignment === 'right' ? 'items-end' : 'items-center'} justify-center p-5 md:p-8 max-w-lg mx-auto w-full`}>
                
                {ctx.avisoPosition === 'top-card' && (
                  <div className="w-full mb-4">
                    {renderAvisoPreview()}
                  </div>
                )}

                {renderBadgePreview()}

                {ctx.imagePosition === 'top' && renderImage()}

                <h1 
                  className={`font-black leading-snug tracking-tight mb-3 ${contentAlignClass}`}
                  style={{ 
                    fontSize: `${ctx.fontSizeTitulo}px`,
                    color: ctx.textColor === '#ffffff' ? '#ffffff' : '#0f172a'
                  }}
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(ctx.titulo) || '<span class="text-slate-600 block">[Preencha o Título Principal]</span>' }}
                />

                {ctx.imagePosition === 'middle' && renderImage()}

                {ctx.subtitulo && (
                  <p 
                    className={`opacity-90 leading-relaxed mb-5 ${contentAlignClass}`}
                    style={{ fontSize: `${ctx.fontSizeSubtitulo}px` }}
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(ctx.subtitulo) }}
                  />
                )}

                {ctx.imagePosition === 'bottom' && renderImage()}

                {ctx.timerEnabled && (
                  <div 
                    className="w-full p-4 mb-6 text-center border border-slate-800/40 shadow-md"
                    style={{ backgroundColor: ctx.timerBgColor, color: ctx.timerTextColor, borderRadius: `${ctx.timerBorderRadius}px` }}
                  >
                    <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mb-2">{ctx.timerText}</p>
                    <div className="flex justify-center gap-3 items-center">
                      <div className="flex flex-col">
                        <span className="text-2xl font-black">{formatTime.min}</span>
                        <span className="text-[9px] opacity-40 uppercase font-bold">Minutes</span>
                      </div>
                      <span className="text-xl font-bold opacity-40">:</span>
                      <div className="flex flex-col">
                        <span className="text-2xl font-black">{formatTime.sec}</span>
                        <span className="text-[9px] opacity-40 uppercase font-bold">Seconds</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className={`w-full flex ${contentJustifyClass}`}>
                  <a 
                    href={ctx.ctaLink || '#'} 
                    onClick={e => e.preventDefault()}
                    className={`block text-center text-white rounded-xl font-black uppercase tracking-wider transition-all transform shadow-lg relative ${ctaPaddingY} ${ctaTextSize}`}
                    style={{ 
                      backgroundColor: ctx.ctaColor || '#22c55e',
                      borderRadius: `${Math.max(4, ctx.borderRadius - 4)}px`,
                      boxShadow: `0 4px 14px 0 ${ctx.ctaColor}35`,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                      width: `${ctx.ctaWidth}%`
                    }}
                  >
                    <span className="flex items-center justify-center gap-1.5">
                      {ctx.ctaText || 'QUERO MEU ACESSO AGORA'}
                      <ExternalLink className="w-3.5 h-3.5 opacity-60 transition-opacity" />
                    </span>
                  </a>
                </div>

                {ctx.faqList.length > 0 && (
                  <div className="w-full mt-6 pt-6 border-t border-slate-800/60">
                    <h4 className="text-xs font-black uppercase text-center tracking-wider mb-3">Frequently Asked Questions</h4>
                    <div className="space-y-2">
                      {ctx.faqList.map((item, index) => (
                        <details key={index} className="group bg-slate-950/50 border border-slate-850 p-3 rounded-lg transition-all">
                          <summary className="flex items-center justify-between cursor-pointer focus:outline-none font-extrabold text-white" style={{ fontSize: `${ctx.faqFontSize}px` }}>
                            <span>{item.question}</span>
                            <span className="transition-transform duration-200 group-open:rotate-180 text-violet-400">▼</span>
                          </summary>
                          <p className="text-slate-300 mt-2 leading-relaxed border-t border-slate-800/40 pt-2 whitespace-pre-wrap" style={{ fontSize: `${ctx.faqAnswerFontSize}px` }} dangerouslySetInnerHTML={{ __html: parseMarkdown(item.answer) }} />
                        </details>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {ctx.footerEnabled && (
                <div className="border-t border-slate-900/60 py-3 text-[9px] bg-slate-950/50" style={{ backgroundColor: ctx.footerBgColor, color: ctx.footerTextColor, textAlign: ctx.footerPosition }}>
                  <p>{ctx.footerText || `© ${new Date().getFullYear()} • Direitos Reservados`}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
