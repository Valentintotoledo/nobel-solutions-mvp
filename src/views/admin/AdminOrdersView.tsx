import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Building2,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  CircleDashed,
  XCircle,
  Plus,
  AlertCircle,
  ShieldCheck,
  Languages,
  Wrench,
  FileText,
  Filter,
  ArrowUpRight,
  Activity,
  CalendarClock,
  ChevronRight,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { cn, formatDateTime, formatTime, formatCurrency, getInitials } from '@/lib/utils';
import {
  workOrders as initialOrders,
  workers,
  companies,
  getCompany,
  getWorker,
  WORK_TYPE_LABEL,
  ORDER_STATUS_LABEL,
} from '@/data/mockData';
import type { WorkOrder, OrderStatus, ConfirmationStatus, AssignedWorker } from '@/data/mockData';

const STATUS_FILTERS: { key: OrderStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'new', label: 'Nuevas' },
  { key: 'assigning', label: 'Asignando' },
  { key: 'confirmed', label: 'Confirmadas' },
  { key: 'in_progress', label: 'En progreso' },
  { key: 'completed', label: 'Completadas' },
];

const STATUS_STYLES: Record<OrderStatus, { dot: string; badge: 'info' | 'warning' | 'success' | 'orange' | 'neutral' | 'danger'; ring: string }> = {
  new: { dot: 'bg-blue-500', badge: 'info', ring: 'ring-blue-100' },
  assigning: { dot: 'bg-amber-500', badge: 'warning', ring: 'ring-amber-100' },
  confirmed: { dot: 'bg-emerald-500', badge: 'success', ring: 'ring-emerald-100' },
  in_progress: { dot: 'bg-orange-500', badge: 'orange', ring: 'ring-orange-100' },
  completed: { dot: 'bg-neutral-400', badge: 'neutral', ring: 'ring-neutral-100' },
  cancelled: { dot: 'bg-red-500', badge: 'danger', ring: 'ring-red-100' },
};

const CONFIRMATION_LABEL: Record<ConfirmationStatus, string> = {
  confirmed: 'Confirmado',
  pending: 'Pendiente',
  rejected: 'Rechazado',
};

export function AdminOrdersView() {
  const [orders, setOrders] = useState<WorkOrder[]>(initialOrders);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string>(
    initialOrders.find((o) => o.status === 'assigning')?.id ?? initialOrders[0].id
  );
  const [assignOpen, setAssignOpen] = useState(false);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (filter !== 'all' && o.status !== filter) return false;
      if (companyFilter !== 'all' && o.companyId !== companyFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const company = getCompany(o.companyId)?.name.toLowerCase() ?? '';
        if (
          !o.orderNumber.toLowerCase().includes(q) &&
          !company.includes(q) &&
          !o.address.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [orders, filter, companyFilter, search]);

  const counts = useMemo(() => {
    const by = (status: OrderStatus) => orders.filter((o) => o.status === status).length;
    return {
      new: by('new'),
      assigning: by('assigning'),
      confirmed: by('confirmed'),
      in_progress: by('in_progress'),
    };
  }, [orders]);

  const selected = filtered.find((o) => o.id === selectedId) ?? filtered[0];

  const handleAssign = (workerId: string) => {
    if (!selected) return;
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== selected.id) return o;
        if (o.assignedWorkers.some((w) => w.workerId === workerId)) return o;
        const newAW: AssignedWorker = {
          workerId,
          status: 'pending',
          assignedAt: new Date().toISOString(),
          confirmedAt: null,
        };
        const nextAssigned = [...o.assignedWorkers, newAW];
        const allConfirmed =
          nextAssigned.length >= o.workersNeeded &&
          nextAssigned.every((w) => w.status === 'confirmed');
        return {
          ...o,
          assignedWorkers: nextAssigned,
          status: o.status === 'new' ? 'assigning' : allConfirmed ? 'confirmed' : o.status,
        };
      })
    );
  };

  return (
    <div className="space-y-5">
      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiPill label="Nuevas" value={counts.new} dot="bg-blue-500" tone="text-blue-700" />
        <KpiPill label="Asignando" value={counts.assigning} dot="bg-amber-500" tone="text-amber-700" />
        <KpiPill label="Confirmadas" value={counts.confirmed} dot="bg-emerald-500" tone="text-emerald-700" />
        <KpiPill label="En progreso" value={counts.in_progress} dot="bg-orange-500" tone="text-orange-700" />
      </div>

      {/* Filters bar */}
      <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-1.5 bg-white border border-neutral-200/70 rounded-xl p-1 shadow-sm">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s.key}
              onClick={() => setFilter(s.key)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors',
                filter === s.key
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
            <Input
              placeholder="Buscar por orden, empresa, dirección…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 w-72"
            />
          </div>
          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="h-9 rounded-lg border border-neutral-200/80 bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="all">Todas las empresas</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <Button variant="outline" size="sm">
            <Filter className="h-3.5 w-3.5" />
            Más filtros
          </Button>
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-5">
        {/* LEFT — Orders list */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
              Órdenes ({filtered.length})
            </h2>
            <Button size="sm" variant="ghost" className="text-xs">
              <Plus className="h-3 w-3" /> Nueva
            </Button>
          </div>
          <div className="space-y-2 max-h-[calc(100vh-260px)] overflow-y-auto scrollbar-thin pr-1">
            {filtered.map((o) => (
              <OrderCard
                key={o.id}
                order={o}
                selected={o.id === selected?.id}
                onClick={() => setSelectedId(o.id)}
              />
            ))}
            {filtered.length === 0 && (
              <div className="rounded-xl border border-dashed border-neutral-200 bg-white p-10 text-center text-sm text-muted-foreground">
                Sin órdenes con esos filtros.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — Order detail */}
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
            >
              <OrderDetail
                order={selected}
                onAssign={() => setAssignOpen(true)}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Assign Sheet */}
      <Sheet open={assignOpen} onOpenChange={setAssignOpen}>
        <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
          <SheetHeader>
            <SheetTitle>Asignar trabajador</SheetTitle>
            <SheetDescription>
              Orden {selected?.orderNumber} · {selected ? WORK_TYPE_LABEL[selected.workType] : ''}
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-5 space-y-2 scrollbar-thin">
            {workers
              .filter((w) => w.status !== 'inactive')
              .filter(
                (w) =>
                  !selected?.assignedWorkers.some((aw) => aw.workerId === w.id)
              )
              .map((w) => (
                <div
                  key={w.id}
                  className="flex items-center gap-3 rounded-xl border border-neutral-200/70 bg-white p-3 hover:border-neutral-300 transition-colors"
                >
                  <Avatar>
                    <AvatarFallback className="bg-neutral-900 text-white text-[11px]">
                      {getInitials(w.firstName, w.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">
                      {w.firstName} {w.lastName}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Badge
                        variant={w.status === 'available' ? 'success' : 'warning'}
                        className="text-[10px] py-0"
                      >
                        {w.status === 'available' ? 'Disponible' : 'Ocupado'}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground">
                        ★ {w.ratingAvg.toFixed(1)} · ${w.hourlyRate}/h
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 truncate">
                      {w.specialties.join(' · ')}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      handleAssign(w.id);
                      setAssignOpen(false);
                    }}
                  >
                    Asignar
                  </Button>
                </div>
              ))}
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setAssignOpen(false)}>
              Cerrar
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function KpiPill({
  label,
  value,
  dot,
  tone,
}: {
  label: string;
  value: number;
  dot: string;
  tone: string;
}) {
  return (
    <div className="rounded-xl border border-neutral-200/70 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-1.5">
        <span className={cn('h-1.5 w-1.5 rounded-full', dot)} />
        <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
          {label}
        </span>
      </div>
      <div className="mt-1.5 flex items-baseline gap-2">
        <span className={cn('text-2xl font-bold', tone)}>{value}</span>
        <span className="text-xs text-muted-foreground">activas</span>
      </div>
    </div>
  );
}

function OrderCard({
  order,
  selected,
  onClick,
}: {
  order: WorkOrder;
  selected: boolean;
  onClick: () => void;
}) {
  const company = getCompany(order.companyId);
  const style = STATUS_STYLES[order.status];
  const confirmedCount = order.assignedWorkers.filter((w) => w.status === 'confirmed').length;
  const pct = order.workersNeeded === 0 ? 0 : (confirmedCount / order.workersNeeded) * 100;

  return (
    <motion.button
      whileHover={{ x: 1 }}
      onClick={onClick}
      className={cn(
        'group w-full text-left rounded-xl border bg-white p-4 transition-all relative',
        selected
          ? 'border-neutral-900 shadow-md ring-2 ring-neutral-100'
          : 'border-neutral-200/70 hover:border-neutral-300 shadow-sm'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className={cn('h-1.5 w-1.5 rounded-full', style.dot)} />
            <span className="text-[10px] uppercase tracking-widest font-mono text-neutral-400">
              {order.orderNumber}
            </span>
          </div>
          <p className="mt-1 text-sm font-semibold text-neutral-900 truncate">
            {company?.name}
          </p>
          <p className="text-[12px] text-neutral-500 truncate">
            {WORK_TYPE_LABEL[order.workType]}
          </p>
        </div>
        <Badge variant={style.badge} className="shrink-0">
          {ORDER_STATUS_LABEL[order.status]}
        </Badge>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-neutral-600">
        <div className="flex items-center gap-1.5">
          <CalendarClock className="h-3 w-3 text-neutral-400" />
          {formatDateTime(order.scheduledAt)}
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="h-3 w-3 text-neutral-400" />
          {confirmedCount}/{order.workersNeeded} confirmados
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <div className="flex-1 h-1 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full transition-all',
              pct === 100 ? 'bg-emerald-500' : pct > 0 ? 'bg-amber-500' : 'bg-neutral-300'
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-[10px] font-mono text-neutral-400">{Math.round(pct)}%</span>
      </div>

      <p className="mt-2 text-[11px] text-neutral-500 truncate flex items-center gap-1">
        <MapPin className="h-3 w-3" /> {order.address}
      </p>
    </motion.button>
  );
}

function OrderDetail({
  order,
  onAssign,
}: {
  order: WorkOrder;
  onAssign: () => void;
}) {
  const company = getCompany(order.companyId);
  const style = STATUS_STYLES[order.status];
  const confirmedCount = order.assignedWorkers.filter((w) => w.status === 'confirmed').length;
  const total = formatCurrency(order.estimatedHours * order.ratePerHour * order.workersNeeded);

  return (
    <div className="rounded-2xl border border-neutral-200/70 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-neutral-200/70">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className={cn('h-2 w-2 rounded-full ring-4', style.dot, style.ring)} />
              <span className="text-[10px] uppercase tracking-widest font-mono text-neutral-500">
                {order.orderNumber}
              </span>
              <Badge variant={style.badge}>{ORDER_STATUS_LABEL[order.status]}</Badge>
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mt-2 tracking-tight">
              {WORK_TYPE_LABEL[order.workType]}
            </h2>
            <div className="mt-1.5 flex items-center gap-2 text-sm text-neutral-600">
              <Building2 className="h-3.5 w-3.5 text-neutral-400" />
              {company?.name}
              <span className="text-neutral-300">·</span>
              <span className="text-neutral-500">{company?.contactName}</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold">
              Estimado
            </p>
            <p className="text-xl font-bold text-neutral-900">{total}</p>
            <p className="text-[11px] text-neutral-500">
              {order.workersNeeded} × {order.estimatedHours}h × ${order.ratePerHour}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
          <DetailField icon={MapPin} label="Dirección">
            <p className="text-sm text-neutral-900 leading-snug">{order.address}</p>
            <p className="text-xs text-neutral-500">{order.city}</p>
          </DetailField>
          <DetailField icon={CalendarClock} label="Programado">
            <p className="text-sm text-neutral-900">{formatDateTime(order.scheduledAt)}</p>
            <p className="text-xs text-neutral-500">
              Creado {formatDateTime(order.createdAt)}
            </p>
          </DetailField>
          <DetailField icon={Users} label="Cuadrilla">
            <p className="text-sm text-neutral-900">
              {confirmedCount} / {order.workersNeeded} confirmados
            </p>
            <p className="text-xs text-neutral-500">
              {order.assignedWorkers.length - confirmedCount} pendientes
            </p>
          </DetailField>
        </div>

        {(order.requiresEnglish || order.requiresId || order.requiresOwnTools || order.requiresCertification) && (
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold mr-1">
              Requisitos:
            </span>
            {order.requiresEnglish && (
              <Badge variant="outline">
                <Languages className="h-3 w-3" /> Habla inglés
              </Badge>
            )}
            {order.requiresId && (
              <Badge variant="outline">
                <ShieldCheck className="h-3 w-3" /> ID requerido
              </Badge>
            )}
            {order.requiresOwnTools && (
              <Badge variant="outline">
                <Wrench className="h-3 w-3" /> Herramientas propias
              </Badge>
            )}
            {order.requiresCertification && (
              <Badge variant="outline">
                <FileText className="h-3 w-3" /> Certificación
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="px-6 py-5 border-b border-neutral-200/70 bg-neutral-50/40">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-3">
          Timeline de la orden
        </h3>
        <Timeline status={order.status} />
      </div>

      {/* Workers */}
      <div className="px-6 py-5 border-b border-neutral-200/70">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
            Trabajadores asignados ({order.assignedWorkers.length}/{order.workersNeeded})
          </h3>
          <Button size="sm" variant="outline" onClick={onAssign}>
            <Plus className="h-3.5 w-3.5" /> Asignar trabajador
          </Button>
        </div>

        {order.assignedWorkers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50/60 px-4 py-8 text-center">
            <AlertCircle className="h-5 w-5 text-amber-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-neutral-700">
              Sin trabajadores asignados todavía
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Asigná {order.workersNeeded} trabajadores para activar la cuadrilla.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {order.assignedWorkers.map((aw) => (
              <WorkerRow key={aw.workerId} aw={aw} />
            ))}
          </div>
        )}
      </div>

      {/* Notes */}
      <div className="px-6 py-5 border-b border-neutral-200/70">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-2">
          Notas
        </h3>
        <p className="text-sm text-neutral-700 leading-relaxed">{order.notes}</p>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 flex items-center justify-between bg-neutral-50/40">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Activity className="h-3 w-3" />
          Última actualización hace pocos minutos
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            Reasignar
          </Button>
          <Button variant="outline" size="sm">
            Ver reporte
          </Button>
          {order.status === 'in_progress' && (
            <Button size="sm" variant="success">
              <CheckCircle2 className="h-3.5 w-3.5" /> Marcar completada
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailField({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-neutral-50/60 border border-neutral-200/60 p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="h-3 w-3 text-neutral-400" />
        <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

function WorkerRow({ aw }: { aw: AssignedWorker }) {
  const w = getWorker(aw.workerId);
  if (!w) return null;

  const icon =
    aw.status === 'confirmed' ? (
      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
    ) : aw.status === 'pending' ? (
      <CircleDashed className="h-3.5 w-3.5 text-amber-600" />
    ) : (
      <XCircle className="h-3.5 w-3.5 text-red-600" />
    );

  const badge =
    aw.status === 'confirmed' ? 'success' : aw.status === 'pending' ? 'warning' : 'danger';

  return (
    <div className="flex items-center gap-3 rounded-xl border border-neutral-200/60 bg-white px-3 py-2.5 hover:border-neutral-300 transition-colors">
      <Avatar>
        <AvatarFallback className="bg-neutral-900 text-white text-[11px]">
          {getInitials(w.firstName, w.lastName)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-900 truncate">
          {w.firstName} {w.lastName}
        </p>
        <p className="text-[11px] text-neutral-500 truncate">
          ★ {w.ratingAvg.toFixed(1)} · {w.specialties.slice(0, 2).join(' · ')}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={badge}>
          {icon}
          {CONFIRMATION_LABEL[aw.status]}
        </Badge>
        {aw.confirmedAt && (
          <span className="text-[10px] text-neutral-400 hidden md:block">
            <Clock className="h-2.5 w-2.5 inline mr-1" />
            {formatTime(aw.confirmedAt)}
          </span>
        )}
      </div>
    </div>
  );
}

function Timeline({ status }: { status: OrderStatus }) {
  const steps: { key: OrderStatus | 'created'; label: string }[] = [
    { key: 'created', label: 'Creada' },
    { key: 'assigning', label: 'Asignada' },
    { key: 'confirmed', label: 'Confirmada' },
    { key: 'in_progress', label: 'En sitio' },
    { key: 'completed', label: 'Completada' },
  ];

  const order: Record<string, number> = {
    created: 0,
    assigning: 1,
    confirmed: 2,
    in_progress: 3,
    completed: 4,
  };
  const currentIdx = status === 'new' ? 0 : order[status] ?? 0;

  return (
    <div className="flex items-center gap-1">
      {steps.map((s, i) => {
        const active = i <= currentIdx;
        const current = i === currentIdx;
        return (
          <div key={s.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-semibold transition-colors',
                  active ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-400',
                  current && 'ring-4 ring-neutral-100'
                )}
              >
                {i + 1}
              </div>
              <span
                className={cn(
                  'text-[11px] font-medium hidden sm:inline',
                  active ? 'text-neutral-900' : 'text-neutral-400'
                )}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 mx-2 h-px bg-neutral-200 relative">
                <div
                  className={cn(
                    'absolute inset-y-0 left-0 bg-neutral-900 transition-all',
                    i < currentIdx ? 'w-full' : 'w-0'
                  )}
                  style={{ height: '1px' }}
                />
                <ChevronRight className="absolute -right-2 -top-1.5 h-3 w-3 text-neutral-300" />
              </div>
            )}
          </div>
        );
      })}
      <ArrowUpRight className="hidden" />
    </div>
  );
}
