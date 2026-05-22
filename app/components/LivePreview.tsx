'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Eye, Monitor, Smartphone, Tablet, Zap } from 'lucide-react';
import { usePresell } from '../context/PresellContext';
import { generateHTML } from '../lib/HtmlGenerator';

export const previewPresets = [
  { id: 'iphone-se', label: 'iPhone SE', shortLabel: 'SE', width: 375, height: 667, device: 'mobile' },
  { id: 'iphone-14', label: 'iPhone 14', shortLabel: '14', width: 390, height: 844, device: 'mobile' },
  { id: 'pixel-7', label: 'Pixel 7', shortLabel: 'Pixel', width: 412, height: 915, device: 'mobile' },
  { id: 'ipad-mini', label: 'iPad Mini', shortLabel: 'iPad', width: 768, height: 1024, device: 'tablet' },
  { id: 'desktop-1366', label: 'Desktop', shortLabel: '1366', width: 1366, height: 768, device: 'desktop' },
  { id: 'wide-1440', label: 'Wide', shortLabel: '1440', width: 1440, height: 900, device: 'desktop' }
] as const;

export type PreviewPresetId = typeof previewPresets[number]['id'];
type PreviewPreset = typeof previewPresets[number];

const getPreset = (id?: PreviewPresetId, fallbackDevice?: 'mobile' | 'desktop'): PreviewPreset => {
  if (id) {
    return previewPresets.find((preset) => preset.id === id) || previewPresets[1];
  }
  return fallbackDevice === 'desktop' ? previewPresets[4] : previewPresets[1];
};

function useDebouncedHtml(html: string, delayMs: number) {
  const [stableHtml, setStableHtml] = useState(html);

  useEffect(() => {
    if (html === stableHtml) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setStableHtml(html);
    }, delayMs);

    return () => window.clearTimeout(timeoutId);
  }, [delayMs, html, stableHtml]);

  return { stableHtml, isPending: stableHtml !== html };
}

const presetIcon = (device: PreviewPreset['device']) => {
  if (device === 'desktop') return Monitor;
  if (device === 'tablet') return Tablet;
  return Smartphone;
};

export function PreviewPresetControl({
  selectedPreset,
  onChange,
  devices,
  compact = false
}: {
  selectedPreset: PreviewPresetId;
  onChange: (preset: PreviewPresetId) => void;
  devices?: PreviewPreset['device'][];
  compact?: boolean;
}) {
  const visiblePresets = devices?.length
    ? previewPresets.filter((preset) => devices.includes(preset.device))
    : previewPresets;

  return (
    <div className="flex w-full flex-wrap items-center gap-1 rounded-2xl border border-slate-800 bg-slate-950 p-1 sm:w-auto">
      {visiblePresets.map((preset) => {
        const Icon = presetIcon(preset.device);
        const isActive = selectedPreset === preset.id;

        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onChange(preset.id)}
            title={`${preset.label} - ${preset.width}x${preset.height}`}
            className={`cursor-pointer inline-flex min-w-0 items-center justify-center gap-1.5 rounded-xl px-2.5 py-2 text-[10px] font-black transition-all ${
              isActive
                ? 'bg-violet-600 text-white shadow shadow-violet-950/30'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
            }`}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span>{compact ? preset.shortLabel : preset.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function PreviewFrame({
  html,
  presetId,
  previewDevice,
  className = '',
  debounceMs = 420,
  fitHeight = '66vh'
}: {
  html: string;
  presetId?: PreviewPresetId;
  previewDevice?: 'mobile' | 'desktop';
  className?: string;
  debounceMs?: number;
  fitHeight?: string;
}) {
  const preset = getPreset(presetId, previewDevice);
  const { stableHtml, isPending } = useDebouncedHtml(html, debounceMs);
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const isDesktop = preset.device === 'desktop';
  const frameBorder = isDesktop
    ? 'rounded-2xl border border-slate-800 shadow-xl'
    : preset.device === 'tablet'
      ? 'rounded-[2rem] border-[8px] border-slate-800 shadow-2xl'
      : 'rounded-[2.35rem] border-[10px] border-slate-800 shadow-2xl';

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const updateScale = () => {
      const rect = stage.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nextScale = Math.min(1, rect.width / preset.width, rect.height / preset.height);
      setScale(Math.max(0.18, Number(nextScale.toFixed(3))));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(stage);
    window.addEventListener('resize', updateScale);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, [preset.height, preset.width]);

  const outerStyle = { height: fitHeight } as React.CSSProperties;
  const scaledViewportStyle = {
    width: preset.width * scale,
    height: preset.height * scale
  } as React.CSSProperties;
  const frameStyle = {
    width: preset.width,
    height: preset.height,
    transform: `scale(${scale})`,
    transformOrigin: 'top left'
  } as React.CSSProperties;

  return (
    <div className={`relative flex min-h-0 items-center justify-center overflow-hidden rounded-3xl border border-slate-900 bg-slate-950 p-3 shadow-inner sm:p-4 ${className}`} style={outerStyle}>
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />
      <div className="pointer-events-none absolute left-3 top-3 z-20 flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-950/85 px-2.5 py-1 text-[10px] font-black text-slate-300 backdrop-blur">
        <Zap className={`h-3 w-3 ${isPending ? 'text-amber-300' : 'text-emerald-300'}`} />
        {isPending ? 'Atualizando' : `${preset.width}x${preset.height}`}
      </div>
      <div ref={stageRef} className="relative z-10 flex h-full min-h-0 w-full items-center justify-center overflow-hidden">
        <div className="relative shrink-0" style={scaledViewportStyle}>
        <div
          className={`relative overflow-hidden bg-white transition-[transform,box-shadow] duration-300 ${frameBorder}`}
          style={frameStyle}
        >
          {!isDesktop && (
            <div className="pointer-events-none absolute left-1/2 top-2 z-20 h-1.5 w-16 -translate-x-1/2 rounded-full bg-slate-700/80" />
          )}
          <iframe
            title={`Preview ${preset.label} da presell`}
            srcDoc={stableHtml}
            sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox"
            className="block h-full w-full bg-white"
          />
        </div>
        </div>
      </div>
    </div>
  );
}

export function LivePreview({
  previewPreset,
  setPreviewPreset
}: {
  previewPreset: PreviewPresetId;
  setPreviewPreset: (v: PreviewPresetId) => void;
}) {
  const ctx = usePresell();
  const html = useMemo(() => generateHTML(ctx, ctx.activeId), [ctx]);

  return (
    <section id="live-preview" className="hidden lg:block lg:col-span-6 xl:col-span-7 lg:sticky lg:top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
      <div className="mb-4 rounded-3xl border border-slate-850 bg-slate-900 p-3 shadow-lg">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <div>
              <h3 className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-slate-300">
                <Eye className="h-4 w-4 text-violet-400" />
                Live Preview
              </h3>
              <p className="text-[10px] font-bold text-slate-500">Atualizacao suave com medidas reais.</p>
            </div>
          </div>

          <PreviewPresetControl selectedPreset={previewPreset} onChange={setPreviewPreset} compact />
        </div>
      </div>

      <PreviewFrame html={html} presetId={previewPreset} fitHeight="calc(100vh - 220px)" />
    </section>
  );
}
