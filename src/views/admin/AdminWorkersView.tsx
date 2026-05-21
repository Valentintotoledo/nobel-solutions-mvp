import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Star,
  Phone,
  Mail,
  Calendar,
  Award,
  TrendingUp,
  MessageSquare,
  Building2,
  Eye,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import {
  cn,
  formatDate,
  formatCurrency,
  getInitials,
} from '@/lib/utils';
import {
  workers,
  workerRatings,
  workOrders,
  getCompany,
  WORK_TYPE_LABEL,
  RATING_CATEGORY_LABEL,
} from '@/data/mockData';
import type { Worker, WorkerStatus, RatingCategory } from '@/data/mockData';

const STATUS_LABEL: Record<WorkerStatus, string> = {
  available: 'Disponible',
  busy: 'Ocupado',
  inactive: 'Sin actividad',
};

const STATUS_BADGE: Record<WorkerStatus, 'success' | 'warning' | 'neutral'> = {
  available: 'success',
  busy: 'warning',
  inactive: 'neutral',
};

const ALL_SPECIALTIES = Array.from(
  new Set(workers.flatMap((w) => w.specialties))
).sort();

export function AdminWorkersView() {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState<string>('all');
  const [status, setStatus] = useState<WorkerStatus | 'all'>('all');
  const [selected, setSelected] = useState<Worker | null>(null);

  const filtered = useMemo(() => {
    return workers.filter((w) => {
      if (status !== 'all' && w.status !== status) return false;
      if (specialty !== 'all' && !w.specialties.includes(specialty)) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (
          !`${w.firstName} ${w.lastName}`.toLowerCase().includes(q) &&
          !w.email.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [search, specialty, status]);

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <SummaryCard
          label="Total subcontratistas"
          value={workers.length}
          subtext="en tu red"
        />
        <SummaryCard
          label="Disponibles hoy"
          value={workers.filter((w) => w.status === 'available').length}
          subtext="listos para asignar"
          tone="emerald"
        />
        <SummaryCard
          label="Rating promedio"
          value={
            (
              workers.reduce((acc, w) => acc + w.ratingAvg, 0) / workers.length
            ).toFixed(1) + '★'
          }
          subtext="entre toda tu cuadrilla"
          tone="amber"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between bg-white border border-neutral-200/70 rounded-xl p-3 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
          <Input
            placeholder="Buscar por nombre o email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="h-9 rounded-lg border border-neutral-200/80 bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="all">Todas las especialidades</option>
            {ALL_SPECIALTIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="h-9 rounded-lg border border-neutral-200/80 bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="all">Todos los estados</option>
            <option value="available">Disponibles</option>
            <option value="busy">Ocupados</option>
            <option value="inactive">Sin actividad</option>
          </select>
        </div>
      </div>

      {/* Workers table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="rounded-2xl border border-neutral-200/70 bg-white shadow-sm overflow-hidden"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trabajador</TableHead>
              <TableHead>Especialidades</TableHead>
              <TableHead>Disponibilidad</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="text-right">Trabajos</TableHead>
              <TableHead className="text-right">Horas/mes</TableHead>
              <TableHead className="text-right">Tarifa</TableHead>
              <TableHead className="text-right" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((w) => (
              <TableRow key={w.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-neutral-900 text-white text-[11px]">
                        {getInitials(w.firstName, w.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-neutral-900 leading-tight">
                        {w.firstName} {w.lastName}
                      </p>
                      <p className="text-[11px] text-neutral-500">{w.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {w.specialties.slice(0, 3).map((s) => (
                      <Badge key={s} variant="secondary">
                        {s}
                      </Badge>
                    ))}
                    {w.specialties.length > 3 && (
                      <Badge variant="outline">+{w.specialties.length - 3}</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_BADGE[w.status]}>
                    <span
                      className={cn(
                        'h-1.5 w-1.5 rounded-full',
                        w.status === 'available'
                          ? 'bg-emerald-500'
                          : w.status === 'busy'
                          ? 'bg-amber-500'
                          : 'bg-neutral-400'
                      )}
                    />
                    {STATUS_LABEL[w.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Stars value={w.ratingAvg} />
                </TableCell>
                <TableCell className="text-right text-sm text-neutral-700">
                  {w.completedJobs}
                </TableCell>
                <TableCell className="text-right text-sm font-medium text-neutral-900">
                  {w.hoursThisMonth}h
                </TableCell>
                <TableCell className="text-right text-sm text-neutral-700">
                  ${w.hourlyRate}
                  <span className="text-[10px] text-neutral-400">/h</span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelected(w)}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Perfil
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-sm text-muted-foreground">
                  Sin trabajadores con esos filtros.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
          {selected && <WorkerProfile worker={selected} />}
          <SheetFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>
              Cerrar
            </Button>
            <Button>Asignar a una orden</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  subtext,
  tone,
}: {
  label: string;
  value: string | number;
  subtext: string;
  tone?: 'emerald' | 'amber';
}) {
  return (
    <div className="rounded-xl border border-neutral-200/70 bg-white p-4 shadow-sm">
      <p className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">
        {label}
      </p>
      <p
        className={cn(
          'text-2xl font-bold mt-1.5',
          tone === 'emerald'
            ? 'text-emerald-600'
            : tone === 'amber'
            ? 'text-amber-600'
            : 'text-neutral-900'
        )}
      >
        {value}
      </p>
      <p className="text-[11px] text-muted-foreground mt-0.5">{subtext}</p>
    </div>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              'h-3 w-3',
              i < Math.round(value)
                ? 'fill-amber-400 text-amber-400'
                : 'text-neutral-200'
            )}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-neutral-700 ml-0.5">
        {value.toFixed(1)}
      </span>
    </div>
  );
}

function WorkerProfile({ worker }: { worker: Worker }) {
  const ratings = workerRatings.filter((r) => r.workerId === worker.id);
  const jobsCount = workOrders.filter((o) =>
    o.assignedWorkers.some((aw) => aw.workerId === worker.id)
  ).length;
  const monthlyPay = worker.hoursThisMonth * worker.hourlyRate;

  return (
    <>
      <SheetHeader>
        <SheetTitle>Perfil del subcontratista</SheetTitle>
        <SheetDescription>Detalle completo y calificaciones</SheetDescription>
      </SheetHeader>
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="p-6">
          {/* Hero */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-neutral-900 text-white text-base">
                {getInitials(worker.firstName, worker.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-neutral-900">
                {worker.firstName} {worker.lastName}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={STATUS_BADGE[worker.status]}>
                  {STATUS_LABEL[worker.status]}
                </Badge>
                <Stars value={worker.ratingAvg} />
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Desde {formatDate(worker.joinedAt)} · {worker.city}
              </p>
            </div>
          </div>

          {/* Contact + numbers */}
          <div className="grid grid-cols-2 gap-2 mt-5">
            <InfoChip icon={Phone} label="Teléfono" value={worker.phone} />
            <InfoChip icon={Mail} label="Email" value={worker.email} />
            <InfoChip icon={Calendar} label="Trabajos" value={`${worker.completedJobs} totales`} />
            <InfoChip icon={TrendingUp} label="Pago mes" value={formatCurrency(monthlyPay)} />
          </div>

          {/* Specialties */}
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-2">
              Especialidades
            </p>
            <div className="flex flex-wrap gap-1.5">
              {worker.specialties.map((s) => (
                <Badge key={s} variant="secondary">
                  {s}
                </Badge>
              ))}
            </div>
          </div>

          <Separator className="my-5" />

          {/* Rating breakdown */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                Calificación desglosada
              </p>
              <Badge variant="warning">
                <Award className="h-3 w-3" /> {worker.ratingAvg.toFixed(1)} promedio
              </Badge>
            </div>
            <div className="space-y-2">
              {(Object.keys(RATING_CATEGORY_LABEL) as RatingCategory[]).map((cat) => (
                <RatingBar
                  key={cat}
                  label={RATING_CATEGORY_LABEL[cat]}
                  value={worker.ratings[cat]}
                />
              ))}
            </div>
          </div>

          <Separator className="my-5" />

          {/* Job history (count) */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-2">
              Historial reciente
            </p>
            <div className="space-y-2">
              {workOrders
                .filter((o) => o.assignedWorkers.some((aw) => aw.workerId === worker.id))
                .slice(0, 3)
                .map((o) => {
                  const co = getCompany(o.companyId);
                  return (
                    <div
                      key={o.id}
                      className="flex items-center justify-between rounded-xl border border-neutral-200/60 bg-neutral-50/40 px-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">
                          {WORK_TYPE_LABEL[o.workType]}
                        </p>
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1 truncate">
                          <Building2 className="h-2.5 w-2.5" />
                          {co?.name}
                        </p>
                      </div>
                      <span className="text-[11px] text-neutral-400 ml-2 shrink-0 font-mono">
                        {o.orderNumber}
                      </span>
                    </div>
                  );
                })}
              {jobsCount === 0 && (
                <p className="text-xs text-muted-foreground italic">
                  Sin trabajos asignados todavía.
                </p>
              )}
            </div>
          </div>

          <Separator className="my-5" />

          {/* Reviews */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-2">
              Reseñas de empresas
            </p>
            <div className="space-y-3">
              {ratings.length === 0 && (
                <p className="text-xs text-muted-foreground italic">
                  Aún no recibió reseñas escritas.
                </p>
              )}
              {ratings.slice(0, 3).map((r) => {
                const co = getCompany(r.companyId);
                return (
                  <div
                    key={r.id}
                    className="rounded-xl border border-neutral-200/60 bg-white p-3"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="h-3 w-3 text-neutral-400" />
                        <span className="text-xs font-medium text-neutral-900">
                          {co?.name}
                        </span>
                      </div>
                      <Stars
                        value={
                          (Object.values(r.ratings) as number[]).reduce(
                            (a, b) => a + b,
                            0
                          ) / 5
                        }
                      />
                    </div>
                    <p className="text-sm text-neutral-700 leading-relaxed flex items-start gap-1.5">
                      <MessageSquare className="h-3 w-3 text-neutral-300 mt-1 shrink-0" />
                      {r.comment}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function InfoChip({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-neutral-200/60 bg-neutral-50/40 px-3 py-2">
      <div className="flex items-center gap-1.5">
        <Icon className="h-3 w-3 text-neutral-400" />
        <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
          {label}
        </span>
      </div>
      <p className="text-xs font-medium text-neutral-900 mt-0.5 truncate">{value}</p>
    </div>
  );
}

function RatingBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-neutral-600 w-24 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </div>
      <span className="text-xs font-mono font-medium text-neutral-700 w-8 text-right">
        {value.toFixed(1)}
      </span>
    </div>
  );
}
