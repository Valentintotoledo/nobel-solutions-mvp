import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export function BootSplash({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const total = 2500;
    let raf = 0;
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(100, (elapsed / total) * 100);
      setProgress(p);
      if (elapsed < total) {
        raf = requestAnimationFrame(tick);
      } else {
        onDone();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-900 text-white mb-4 shadow-lg">
          <Building2 className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-semibold text-neutral-900 tracking-tight">
          Nobel Solutions
        </h1>
        <p className="mt-1 text-[11px] uppercase tracking-widest text-neutral-400 font-semibold">
          Contractor Dispatch · Austin TX
        </p>
        <div className="mt-8 h-1 w-48 overflow-hidden rounded-full bg-neutral-100">
          <motion.div
            className="h-full bg-neutral-900"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: 'linear' }}
          />
        </div>
        <p className="mt-3 text-[10px] text-neutral-400 font-mono">
          {Math.round(progress)}%
        </p>
      </motion.div>
    </div>
  );
}
