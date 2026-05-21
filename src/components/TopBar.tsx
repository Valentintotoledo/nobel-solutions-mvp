import { Search, Bell, Sparkles } from 'lucide-react';

interface TopBarProps {
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
  onStartTour?: () => void;
}

export function TopBar({ title, subtitle, rightSlot, onStartTour }: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 h-14 flex items-center justify-between gap-4 border-b border-neutral-200/80 bg-white/80 backdrop-blur-sm px-6 md:px-10">
      <div className="min-w-0">
        <h1 className="text-sm font-semibold text-neutral-900 truncate">{title}</h1>
        {subtitle && (
          <p className="text-[11px] text-neutral-500 truncate">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden md:flex h-9 items-center gap-2 rounded-lg border border-neutral-200/80 bg-white px-3 w-72 shadow-sm">
          <Search className="h-3.5 w-3.5 text-neutral-400" />
          <input
            type="search"
            placeholder="Buscar órdenes, trabajadores, empresas…"
            className="flex-1 bg-transparent text-sm placeholder:text-neutral-400 focus:outline-none"
          />
          <kbd className="hidden lg:inline-flex h-5 items-center rounded border border-neutral-200/80 bg-neutral-50 px-1.5 text-[10px] font-mono text-neutral-400">
            ⌘K
          </kbd>
        </div>
        {onStartTour && (
          <button
            onClick={onStartTour}
            className="hidden sm:flex h-9 items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition-colors"
            title="Reiniciar tour guiado"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Tour
          </button>
        )}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200/80 bg-white text-neutral-600 hover:text-neutral-900 transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>
        <div className="hidden sm:flex items-center gap-2 ml-2 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-700">
            Live
          </span>
        </div>
        {rightSlot}
      </div>
    </header>
  );
}
