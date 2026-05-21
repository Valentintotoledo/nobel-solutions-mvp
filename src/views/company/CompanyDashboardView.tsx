import { motion } from 'framer-motion';
import {
  Activity,
  Users,
  CheckCircle2,
  Star,
  ArrowUpRight,
  Building2,
  CalendarClock,
  MapPin,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn, formatDateTime, getInitials } from '@/lib/utils';
import {
  workOrders,
  workers,
  getCompany,
  WORK_TYPE_LABEL,
  ORDER_STATUS_LABEL,
} from '@/data/mockData';
import type { OrderStatus } from '@/data/mockData';

const COMPANY_ID = 'co_1';

const STATUS_BADGE: Record<OrderStatus, 'info' | 'warning' | 'success' | 'orange' | 'neutral' | 'danger'> = {
  new: 'info',
  assigning: 'warning',
  confirmed: 'success',
  in_progress: 'orange',
  completed: 'neutral',
  cancelled: 'danger',
};

export function CompanyDashboardView() {
  const company = getCompany(COMPANY_ID);
  const active = workOrders.filter(
    (o) => o.companyId === COMPANY_ID && o.status !== 'completed' && o.status !== 'cancelled'
  );
  const completed = workOrders.filter(
    (o) => o.companyId === COMPANY_ID && o.status === 'completed'
  );
  const totalWorkersToday = active.reduce(
    (acc, o) => acc + o.assignedWorkers.filter((w) => w.status === 'confirmed').length,
    0
  );

  const preferred = [...workers]
    .sort((a, b) => b.ratingAvg - a.ratingAvg || b.completedJobs - a.completedJobs)
    .slice(0, 4);

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="rounded-2xl border border-neutral-200/70 bg-gradient-to-br from-neutral-50 to-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold">
              Vista cliente
            </p>
            <h2 className="text-lg font-semibold text-neutral-900">{company?.name}</h2>
            <p className="text-xs text-muted-foreground">
              {company?.contactName} · {company?.contactEmail} · {company?.city}
            </p>
          </div>
          <Button>
            <ArrowUpRight className="h-3.5 w-3.5" />
            Publicar nueva orden
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <KpiCard
          icon={Activity}
          label="Órdenes activas"
          value={active.length}
          subtext="actualmente en curso"
        />
        <KpiCard
          icon={Users}
          label="Trabajadores hoy"
          value={totalWorkersToday}
          subtext="en sitio o confirmados"
        />
        <KpiCard
          icon={CheckCircle2}
          label="Completadas este mes"
          value={completed.length + 12}
          subtext={`${company?.completedOrders} totales históricas`}
        />
      </div>

      {/* Active orders */}
      <div className="rounded-2xl border border-neutral-200/70 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-200/70">
          <h2 className="text-base font-semibold text-neutral-900">Órdenes activas</h2>
          <p className="text-xs text-muted-foreground">Avance en tiempo real</p>
        </div>
        <div className="divide-y divide-neutral-200/60">
          {active.length === 0 && (
            <p className="p-6 text-sm text-muted-foreground text-center">
              No tenés órdenes activas. Publicá una nueva para arrancar.
            </p>
          )}
          {active.map((o, i) => {
            const confirmed = o.assignedWorkers.filter((w) => w.status === 'confirmed').length;
            const pct = (confirmed / o.workersNeeded) * 100;
            return (
              <motion.div
                key={o.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
                className="px-5 py-4 hover:bg-neutral-50/60 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                        {o.orderNumber}
                      </span>
                      <Badge variant={STATUS_BADGE[o.status]}>
                        {ORDER_STATUS_LABEL[o.status]}
                      </Badge>
                    </div>
                    <p className="text-sm font-semibold text-neutral-900 mt-1">
                      {WORK_TYPE_LABEL[o.workType]}
                    </p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {o.address}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarClock className="h-3 w-3" /> {formatDateTime(o.scheduledAt)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-neutral-900">
                      {confirmed}/{o.workersNeeded}
                    </p>
                    <p className="text-[10px] text-muted-foreground">confirmados</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full transition-all',
                        pct === 100 ? 'bg-emerald-500' : pct > 0 ? 'bg-amber-500' : 'bg-neutral-300'
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {Math.round(pct)}%
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Preferred subcontractors */}
      <div className="rounded-2xl border border-neutral-200/70 bg-white shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-neutral-900">
              Subcontratistas preferidos
            </h2>
            <p className="text-xs text-muted-foreground">
              Los más usados por tu empresa en los últimos 90 días
            </p>
          </div>
          <Badge variant="warning">
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
            Top picks
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {preferred.map((w) => (
            <div
              key={w.id}
              className="rounded-xl border border-neutral-200/60 bg-neutral-50/40 p-3 flex items-center gap-3"
            >
              <Avatar className="h-11 w-11">
                <AvatarFallback className="bg-neutral-900 text-white text-xs">
                  {getInitials(w.firstName, w.lastName)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-neutral-900 truncate">
                  {w.firstName} {w.lastName}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {w.specialties.slice(0, 2).join(' · ')}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                  <span className="text-[11px] font-medium text-neutral-700">
                    {w.ratingAvg.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-neutral-400 ml-1">
                    · {w.completedJobs} jobs
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  subtext,
}: {
  icon: typeof Activity;
  label: string;
  value: string | number;
  subtext: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200/70 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100">
          <Icon className="h-4 w-4 text-neutral-600" />
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold text-neutral-900 mt-1">{value}</p>
      <p className="text-[11px] text-neutral-400 mt-0.5">{subtext}</p>
    </div>
  );
}
