import { motion } from 'framer-motion';
import {
  Briefcase,
  Clock,
  DollarSign,
  Star,
  Building2,
  MapPin,
  CalendarClock,
  Phone,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn, formatCurrency, formatDateTime, formatDate, getInitials } from '@/lib/utils';
import {
  getWorker,
  getOrdersByWorker,
  getCompany,
  WORK_TYPE_LABEL,
} from '@/data/mockData';

// "Logged in" worker for the demo
const WORKER_ID = 'w_1';

export function WorkerDashboardView() {
  const worker = getWorker(WORKER_ID)!;
  const myOrders = getOrdersByWorker(WORKER_ID);
  const nextOrder = myOrders.find(
    (o) =>
      o.status === 'confirmed' ||
      o.status === 'assigning' ||
      o.status === 'in_progress'
  );
  const completedRecent = myOrders.filter((o) => o.status === 'completed').slice(0, 3);

  const monthlyPay = worker.hoursThisMonth * worker.hourlyRate;

  return (
    <div className="space-y-5">
      {/* Profile header */}
      <div className="rounded-2xl border border-neutral-200/70 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white p-5 shadow-lg">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 ring-2 ring-white/10">
            <AvatarFallback className="bg-white text-neutral-900 text-base font-semibold">
              {getInitials(worker.firstName, worker.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold">
              Bienvenido de vuelta
            </p>
            <h2 className="text-lg font-semibold">
              {worker.firstName} {worker.lastName}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Badge className="bg-white/10 text-white border-white/20">
                {worker.specialties[0]}
              </Badge>
              <span className="text-xs text-amber-300 flex items-center gap-0.5">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {worker.ratingAvg.toFixed(1)} promedio
              </span>
              <span className="text-xs text-neutral-400">· {worker.city}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi icon={Briefcase} label="Trabajos este mes" value={6} tone="default" />
        <Kpi icon={Clock} label="Horas trabajadas" value={`${worker.hoursThisMonth}h`} tone="default" />
        <Kpi icon={DollarSign} label="Pago estimado" value={formatCurrency(monthlyPay)} tone="emerald" />
        <Kpi icon={Star} label="Rating promedio" value={`${worker.ratingAvg.toFixed(1)}★`} tone="amber" />
      </div>

      {/* Next job */}
      {nextOrder && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white shadow-sm p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
            </span>
            <p className="text-[10px] uppercase tracking-widest text-amber-700 font-semibold">
              Próximo trabajo
            </p>
          </div>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-neutral-900">
                {WORK_TYPE_LABEL[nextOrder.workType]}
              </h3>
              <p className="text-sm text-neutral-600 flex items-center gap-1.5 mt-1">
                <Building2 className="h-3.5 w-3.5 text-neutral-400" />
                {getCompany(nextOrder.companyId)?.name}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                <InfoLine icon={MapPin} label="Dirección" value={nextOrder.address} />
                <InfoLine
                  icon={CalendarClock}
                  label="Horario"
                  value={formatDateTime(nextOrder.scheduledAt)}
                />
                <InfoLine
                  icon={Phone}
                  label="Contacto"
                  value={`${getCompany(nextOrder.companyId)?.contactName} · ${getCompany(nextOrder.companyId)?.phone}`}
                />
                <InfoLine
                  icon={DollarSign}
                  label="Pago estimado"
                  value={formatCurrency(nextOrder.estimatedHours * worker.hourlyRate)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full sm:w-auto">
              {nextOrder.status === 'in_progress' ? (
                <Badge variant="orange" className="self-end">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                  En sitio
                </Badge>
              ) : nextOrder.assignedWorkers.find((aw) => aw.workerId === WORKER_ID)?.status === 'confirmed' ? (
                <Badge variant="success">
                  <CheckCircle2 className="h-3 w-3" />
                  Confirmaste asistencia
                </Badge>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="success" size="lg" className="min-w-[160px]">
                    <CheckCircle2 className="h-4 w-4" />
                    Confirmar asistencia
                  </Button>
                  <Button variant="outline" size="lg">
                    <XCircle className="h-4 w-4" />
                    No puedo ir
                  </Button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Recent history */}
      <div className="rounded-2xl border border-neutral-200/70 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-200/70">
          <h2 className="text-base font-semibold text-neutral-900">
            Historial reciente
          </h2>
          <p className="text-xs text-muted-foreground">Últimas 3 semanas</p>
        </div>
        {completedRecent.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground text-center">
            Sin trabajos completados en el período.
          </p>
        ) : (
          <div className="divide-y divide-neutral-200/60">
            {completedRecent.map((o) => {
              const co = getCompany(o.companyId);
              return (
                <div key={o.id} className="px-5 py-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-neutral-900">
                      {WORK_TYPE_LABEL[o.workType]}
                    </p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Building2 className="h-2.5 w-2.5" />
                      {co?.name} · {formatDate(o.scheduledAt)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge variant="success">Completada</Badge>
                    <p className="text-xs text-neutral-500 mt-1">
                      +{formatCurrency(o.estimatedHours * worker.hourlyRate)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Briefcase;
  label: string;
  value: string | number;
  tone: 'default' | 'emerald' | 'amber';
}) {
  return (
    <div className="rounded-xl border border-neutral-200/70 bg-white p-4 shadow-sm">
      <Icon className="h-4 w-4 text-neutral-400 mb-2" />
      <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
        {label}
      </p>
      <p
        className={cn(
          'text-xl font-bold mt-1',
          tone === 'emerald' ? 'text-emerald-600' : tone === 'amber' ? 'text-amber-600' : 'text-neutral-900'
        )}
      >
        {value}
      </p>
    </div>
  );
}

function InfoLine({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="h-3.5 w-3.5 text-neutral-400 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
          {label}
        </p>
        <p className="text-sm text-neutral-900 leading-snug">{value}</p>
      </div>
    </div>
  );
}
