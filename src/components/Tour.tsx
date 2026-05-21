import { useEffect, useLayoutEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ViewKey } from '@/types';

export type TourPlacement = 'top' | 'bottom' | 'left' | 'right' | 'center';

export type TourStep = {
  id: string;
  title: string;
  body: string;
  target?: string;
  view?: ViewKey;
  placement?: TourPlacement;
};

interface TourProps {
  steps: TourStep[];
  open: boolean;
  onClose: () => void;
  onNavigate: (view: ViewKey) => void;
  currentView: ViewKey;
}

const PAD = 10;
const TOOLTIP_W = 360;
const TOOLTIP_EST_H = 230;
const GAP = 16;

export function Tour({ steps, open, onClose, onNavigate, currentView }: TourProps) {
  const [idx, setIdx] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const step = steps[idx];

  useEffect(() => {
    if (open) setIdx(0);
  }, [open]);

  // Navigate to view required by the current step
  useEffect(() => {
    if (open && step?.view && step.view !== currentView) {
      onNavigate(step.view);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, open]);

  // Measure target element
  useLayoutEffect(() => {
    if (!open || !step) return;
    if (!step.target) {
      setRect(null);
      return;
    }
    let cancelled = false;

    const measure = () => {
      const el = document.querySelector(`[data-tour="${step.target}"]`);
      if (!el) {
        if (!cancelled) setRect(null);
        return;
      }
      const needsScroll =
        el.getBoundingClientRect().top < 0 ||
        el.getBoundingClientRect().bottom > window.innerHeight;
      if (needsScroll) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          if (!cancelled) setRect(el.getBoundingClientRect());
        }, 350);
      } else {
        if (!cancelled) setRect(el.getBoundingClientRect());
      }
    };

    // Wait longer if we navigated to a new view
    const delay = step.view && step.view !== currentView ? 380 : 60;
    const t = setTimeout(measure, delay);

    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);
    return () => {
      cancelled = true;
      clearTimeout(t);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
    };
  }, [idx, open, step?.target, step?.view, currentView]);

  // Keyboard nav
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight' || e.key === 'Enter') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, idx]);

  if (!open || !step) return null;

  const next = () => {
    if (idx < steps.length - 1) setIdx(idx + 1);
    else onClose();
  };
  const prev = () => {
    if (idx > 0) setIdx(idx - 1);
  };

  const padded = rect
    ? {
        top: rect.top - PAD,
        left: rect.left - PAD,
        width: rect.width + PAD * 2,
        height: rect.height + PAD * 2,
      }
    : null;

  const tooltipStyle = computeTooltipStyle(padded, step.placement);
  const isLast = idx === steps.length - 1;
  const isFirst = idx === 0;
  const isCentered = !padded || step.placement === 'center';

  return (
    <div className="fixed inset-0 z-[200]">
      {/* SVG mask backdrop — covers everything but the highlighted rect */}
      <svg
        className="absolute inset-0 h-full w-full pointer-events-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <mask id="tour-spotlight">
            <rect width="100%" height="100%" fill="white" />
            {padded && (
              <motion.rect
                initial={false}
                animate={{
                  x: padded.left,
                  y: padded.top,
                  width: padded.width,
                  height: padded.height,
                }}
                transition={{ type: 'spring', damping: 30, stiffness: 280 }}
                rx={14}
                ry={14}
                fill="black"
              />
            )}
          </mask>
        </defs>
        <motion.rect
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          width="100%"
          height="100%"
          fill="rgba(10,10,12,0.78)"
          mask="url(#tour-spotlight)"
        />
      </svg>

      {/* Glow ring around the spotlight */}
      {padded && (
        <motion.div
          initial={false}
          animate={{
            top: padded.top,
            left: padded.left,
            width: padded.width,
            height: padded.height,
          }}
          transition={{ type: 'spring', damping: 30, stiffness: 280 }}
          className="absolute rounded-2xl ring-2 ring-amber-400 pointer-events-none"
          style={{
            boxShadow:
              '0 0 0 1px rgba(251,191,36,0.4), 0 0 60px 6px rgba(251,191,36,0.18)',
          }}
        />
      )}

      {/* Tooltip card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className={cn(
            'absolute z-10 rounded-2xl bg-white shadow-2xl border border-neutral-200/80 p-5',
            isCentered && 'max-w-md w-[92vw]'
          )}
          style={tooltipStyle}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-[10px] uppercase tracking-widest text-amber-600 font-bold">
                Tour · Paso {idx + 1} de {steps.length}
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="Cerrar tour"
              className="text-neutral-400 hover:text-neutral-900 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <h3 className="text-base font-bold text-neutral-900 leading-snug tracking-tight">
            {step.title}
          </h3>
          <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
            {step.body}
          </p>

          {/* Progress dots */}
          <div className="flex gap-1 mt-4">
            {steps.map((_, i) => (
              <span
                key={i}
                className={cn(
                  'h-1 rounded-full transition-all',
                  i === idx
                    ? 'bg-amber-500 w-6'
                    : i < idx
                    ? 'bg-neutral-400 w-1.5'
                    : 'bg-neutral-200 w-1.5'
                )}
              />
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-200/70">
            <button
              onClick={onClose}
              className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              Saltar tour
            </button>
            <div className="flex gap-2">
              {!isFirst && (
                <button
                  onClick={prev}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Anterior
                </button>
              )}
              <button
                onClick={next}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
              >
                {isLast ? '¡Listo!' : 'Siguiente'}
                {!isLast && <ArrowRight className="h-3 w-3" />}
              </button>
            </div>
          </div>

          <p className="text-[10px] text-neutral-400 mt-3 text-center font-mono">
            ESC para cerrar · ← → para navegar
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function computeTooltipStyle(
  padded: { top: number; left: number; width: number; height: number } | null,
  placement?: TourPlacement
): React.CSSProperties {
  if (!padded || placement === 'center') {
    return {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    };
  }

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let p: TourPlacement | undefined = placement;
  if (!p) {
    if (padded.left + padded.width + TOOLTIP_W + GAP + 24 < vw) p = 'right';
    else if (padded.left - TOOLTIP_W - GAP - 24 > 0) p = 'left';
    else if (padded.top + padded.height + TOOLTIP_EST_H + GAP < vh) p = 'bottom';
    else p = 'top';
  }

  let top = 0;
  let left = 0;

  switch (p) {
    case 'right':
      left = padded.left + padded.width + GAP;
      top = Math.max(padded.top, 16);
      break;
    case 'left':
      left = padded.left - TOOLTIP_W - GAP;
      top = Math.max(padded.top, 16);
      break;
    case 'bottom':
      top = padded.top + padded.height + GAP;
      left = padded.left;
      break;
    case 'top':
      top = padded.top - TOOLTIP_EST_H - GAP;
      left = padded.left;
      break;
  }

  // Clamp inside viewport
  top = Math.max(16, Math.min(top, vh - TOOLTIP_EST_H - 16));
  left = Math.max(16, Math.min(left, vw - TOOLTIP_W - 16));

  return { top, left, width: TOOLTIP_W };
}
