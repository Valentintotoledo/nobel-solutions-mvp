import { motion } from 'framer-motion';
import { LayoutDashboard, Building2, HardHat, ArrowRight } from 'lucide-react';
import type { Role } from '@/types';

interface OnboardingProps {
  onSelect: (role: Role) => void;
}

const OPTIONS: { role: Role; title: string; subtitle: string; icon: typeof LayoutDashboard; recommended?: boolean }[] = [
  {
    role: 'admin',
    title: 'Panel Admin (Luis)',
    subtitle: 'Control total: despacho, métricas, reportes, calificaciones, QuickBooks.',
    icon: LayoutDashboard,
    recommended: true,
  },
  {
    role: 'company',
    title: 'Panel Empresa',
    subtitle: 'Vista del cliente que publica órdenes y sigue a sus subcontratistas.',
    icon: Building2,
  },
  {
    role: 'worker',
    title: 'Panel Subcontratista',
    subtitle: 'Vista del trabajador en sitio: órdenes, confirmaciones y check-in.',
    icon: HardHat,
  },
];

export function Onboarding({ onSelect }: OnboardingProps) {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <p className="text-[11px] uppercase tracking-widest text-neutral-400 font-semibold mb-1">
            Bienvenido, Luis
          </p>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            ¿Con qué panel querés empezar?
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            Tu plataforma tiene tres interfaces. Elegí cualquiera para explorarla — vas a poder cambiar en cualquier momento.
          </p>
        </div>

        <div className="space-y-3">
          {OPTIONS.map((opt, i) => {
            const Icon = opt.icon;
            return (
              <motion.button
                key={opt.role}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.05 * i }}
                onClick={() => onSelect(opt.role)}
                className="group w-full flex items-center gap-4 rounded-xl border border-neutral-200/70 bg-white p-5 text-left shadow-sm hover:border-neutral-300 hover:shadow-md transition-all"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-900 text-white shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-neutral-900">{opt.title}</h3>
                    {opt.recommended && (
                      <span className="text-[9px] uppercase tracking-widest font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-1.5 py-0.5">
                        Recomendado
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {opt.subtitle}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-neutral-300 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all" />
              </motion.button>
            );
          })}
        </div>

        <p className="text-center text-[10px] text-neutral-400 mt-8 font-mono uppercase tracking-widest">
          Demo Preview · Insights Software
        </p>
      </motion.div>
    </div>
  );
}
