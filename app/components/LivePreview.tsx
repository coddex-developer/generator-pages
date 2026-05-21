'use client';

import React, { useMemo } from 'react';
import { Eye, Smartphone, Monitor } from 'lucide-react';
import { usePresell } from '../context/PresellContext';
import { generateHTML } from '../lib/HtmlGenerator';

export function PreviewFrame({
  html,
  previewDevice,
  className = ''
}: {
  html: string;
  previewDevice: 'mobile' | 'desktop';
  className?: string;
}) {
  return (
    <div className={`bg-slate-950 border border-slate-900 rounded-3xl p-3 sm:p-4 flex justify-center items-start overflow-hidden min-h-[620px] shadow-inner relative ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />
      <div className={`transition-all duration-300 w-full flex justify-center ${previewDevice === 'mobile' ? 'max-w-[390px]' : 'max-w-full'}`}>
        <div
          className={`w-full bg-white overflow-hidden transition-all ${
            previewDevice === 'mobile'
              ? 'border-[10px] border-slate-800 rounded-[2.5rem] shadow-2xl aspect-[9/19] min-h-[660px]'
              : 'border border-slate-800 rounded-2xl shadow-xl min-h-[560px]'
          }`}
        >
          <iframe
            title={previewDevice === 'mobile' ? 'Preview mobile da presell' : 'Preview desktop da presell'}
            srcDoc={html}
            sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox"
            className="block w-full h-full min-h-[inherit] bg-white"
          />
        </div>
      </div>
    </div>
  );
}

export function LivePreview({
  previewDevice,
  setPreviewDevice
}: {
  previewDevice: 'mobile' | 'desktop';
  setPreviewDevice: (v: 'mobile' | 'desktop') => void;
}) {
  const ctx = usePresell();
  const html = useMemo(() => generateHTML(ctx, ctx.activeId), [ctx]);

  return (
    <section id="live-preview" className="hidden lg:block lg:col-span-6 xl:col-span-7 lg:sticky lg:top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
      <div className="bg-slate-900 border border-slate-850 rounded-2xl p-3 shadow-lg flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-pulse" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1">
            <Eye className="w-4 h-4 text-violet-400" />
            Live Preview
          </h3>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800/80">
          <button
            type="button"
            onClick={() => setPreviewDevice('mobile')}
            className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              previewDevice === 'mobile' ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>

          <button
            type="button"
            onClick={() => setPreviewDevice('desktop')}
            className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              previewDevice === 'desktop' ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
        </div>
      </div>

      <PreviewFrame html={html} previewDevice={previewDevice} />
    </section>
  );
}
