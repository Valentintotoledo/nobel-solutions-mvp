import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function DemoPreviewCTA() {
  return (
    <div className="mx-3 mb-3">
      <div data-tour="whatsapp-cta" className="rounded-xl bg-neutral-900 p-3 text-white shadow-lg ring-1 ring-neutral-800">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-400" />
          </span>
          <span className="rounded-full border border-amber-500/30 bg-amber-500/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-amber-400">
            Demo Preview
          </span>
        </div>
        <p className="text-[13px] font-semibold leading-tight text-white">
          ¿Te gustó lo que ves?
        </p>
        <p className="mt-0.5 text-[11px] leading-tight text-neutral-400">
          Hablemos y arrancamos.
        </p>
        <motion.a
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          href="https://wa.me/5491139375146?text=Me%20encant%C3%B3%20el%20desarrollo%2C%20quiero%20que%20avancemos!"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex w-full items-center justify-between gap-1 rounded-lg bg-white px-2.5 py-1.5 text-[12px] font-semibold text-neutral-900 transition-colors hover:bg-amber-400"
        >
          Quiero arrancar
          <ArrowRight className="h-3 w-3" />
        </motion.a>
        <p className="mt-2 text-[10px] text-neutral-500 text-center">
          Insights Software
        </p>
      </div>
    </div>
  );
}
