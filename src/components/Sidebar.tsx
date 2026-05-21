import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  BarChart3,
  Building2,
  PlusCircle,
  FileText,
  HardHat,
  CheckSquare,
  Repeat,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DemoPreviewCTA } from './DemoPreviewCTA';
import type { Role, ViewKey } from '@/types';

type NavItem = {
  key: ViewKey;
  label: string;
  icon: typeof LayoutDashboard;
};

const ADMIN_NAV: NavItem[] = [
  { key: 'admin.dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'admin.orders', label: 'Panel de Despacho', icon: ClipboardList },
  { key: 'admin.workers', label: 'Subcontratistas', icon: Users },
  { key: 'admin.reports', label: 'Reportes & Pagos', icon: BarChart3 },
];

const COMPANY_NAV: NavItem[] = [
  { key: 'company.dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'company.new', label: 'Nueva orden', icon: PlusCircle },
  { key: 'company.orders', label: 'Mis órdenes', icon: FileText },
];

const WORKER_NAV: NavItem[] = [
  { key: 'worker.dashboard', label: 'Mi día', icon: HardHat },
  { key: 'worker.orders', label: 'Órdenes', icon: ClipboardList },
  { key: 'worker.checkin', label: 'Check-in / Out', icon: CheckSquare },
];

const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  admin: ADMIN_NAV,
  company: COMPANY_NAV,
  worker: WORKER_NAV,
};

const ROLE_LABELS: Record<Role, string> = {
  admin: 'Panel Admin (Luis)',
  company: 'Panel Empresa',
  worker: 'Panel Subcontratista',
};

interface SidebarProps {
  role: Role;
  view: ViewKey;
  onNavigate: (key: ViewKey) => void;
  onSwitchRole: () => void;
}

export function Sidebar({ role, view, onNavigate, onSwitchRole }: SidebarProps) {
  const items = NAV_BY_ROLE[role];

  return (
    <aside className="hidden md:flex w-[240px] shrink-0 flex-col border-r border-neutral-200/80 bg-white h-screen sticky top-0">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 h-14 border-b border-neutral-200/80">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white">
          <Building2 className="h-3.5 w-3.5" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-neutral-900">Nobel Solutions</span>
          <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">
            Austin · TX
          </span>
        </div>
      </div>

      {/* Role indicator */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center gap-1.5 mb-1">
          <Sparkles className="h-3 w-3 text-amber-500" />
          <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold">
            {ROLE_LABELS[role]}
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav data-tour="sidebar-nav" className="flex-1 px-3 overflow-y-auto scrollbar-thin">
        <ul className="space-y-0.5">
          {items.map((it) => {
            const Icon = it.icon;
            const active = view === it.key;
            return (
              <li key={it.key}>
                <button
                  onClick={() => onNavigate(it.key)}
                  className={cn(
                    'relative w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-left',
                    active
                      ? 'text-neutral-950'
                      : 'text-[#6B7280] hover:text-neutral-900'
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 bg-[#F5F5F7] rounded-lg"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <Icon className="relative h-4 w-4" />
                  <span className="relative">{it.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 px-3">
          <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold">
            Sistema
          </p>
        </div>
        <ul className="space-y-0.5 mt-2">
          <li>
            <button
              onClick={onSwitchRole}
              data-tour="switch-role"
              className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-[#6B7280] hover:text-neutral-900 transition-colors"
            >
              <Repeat className="h-4 w-4" />
              Cambiar panel
            </button>
          </li>
        </ul>
      </nav>

      {/* Demo CTA */}
      <DemoPreviewCTA />

      {/* User block */}
      <div className="px-5 py-3 border-t border-neutral-200/80 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-white text-xs font-semibold">
          LL
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-xs font-semibold text-neutral-900">Luis Larez</span>
          <span className="text-[10px] text-neutral-500">Owner · Nobel Solutions</span>
        </div>
      </div>
    </aside>
  );
}
