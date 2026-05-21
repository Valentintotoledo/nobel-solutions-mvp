import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarClock,
  MapPin,
  Users,
  Search,
  FileText,
  Star,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
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
import { Separator } from '@/components/ui/separator';
import { formatCurrency, formatDateTime, getInitials } from '@/lib/utils';
import {
  workOrders,
  getWorker,
  WORK_TYPE_LABEL,
  ORDER_STATUS_LABEL,
} from '@/data/mockData';
import type { OrderStatus, WorkOrder } from '@/data/mockData';

const COMPANY_ID = 'co_1';

const STATUS_BADGE: Record<OrderStatus, 'info' | 'warning' | 'success' | 'orange' | 'neutral' | 'danger'> = {
  new: 'info',
  assigning: 'warning',
  confirmed: 'success',
  in_progress: 'orange',
  completed: 'neutral',
  cancelled: 'danger',
};

export function CompanyOrdersView() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selected, setSelected] = useState<WorkOrder | null>(null);

  const myOrders = useMemo(() => {
    return workOrders.filter((o) => o.companyId === COMPANY_ID);
  }, []);

  const filtered = useMemo(() => {
    return myOrders.filter((o) => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (
          !o.orderNumber.toLowerCase().includes(q) &&
          !o.address.toLowerCase().includes(q) &&
          !WORK_TYPE_LABEL[o.workType].toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [myOrders, search, statusFilter]);

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between bg-white border border-neutral-200/70 rounded-xl p-3 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
          <Input
            placeholder="Buscar por orden, dirección, tipo…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="h-9 rounded-lg border border-neutral-200/80 bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="all">Todos los estados</option>
          {(Object.keys(ORDER_STATUS_LABEL) as OrderStatus[]).map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABEL[s]}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="rounded-2xl border border-neutral-200/70 bg-white shadow-sm overflow-hidden"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Orden</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Cuadrilla</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Monto</TableHead>
              <TableHead className="text-right" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((o) => {
              const total = o.estimatedHours * o.ratePerHour * o.workersNeeded;
              const confirmed = o.assignedWorkers.filter((w) => w.status === 'confirmed').length;
              return (
                <TableRow key={o.id} className="cursor-pointer" onClick={() => setSelected(o)}>
                  <TableCell>
                    <p className="text-sm font-mono font-semibold text-neutral-900">
                      {o.orderNumber}
                    </p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-2.5 w-2.5" />
                      {o.address}
                    </p>
                  </TableCell>
                  <TableCell className="text-sm text-neutral-700">
                    {WORK_TYPE_LABEL[o.workType]}
                  </TableCell>
                  <TableCell className="text-sm text-neutral-600 whitespace-nowrap">
                    {formatDateTime(o.scheduledAt)}
                  </TableCell>
                  <TableCell className="text-sm">
                    <span className="font-medium text-neutral-900">{confirmed}</span>
                    <span className="text-neutral-400">/{o.workersNeeded}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_BADGE[o.status]}>
                      {ORDER_STATUS_LABEL[o.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-sm font-semibold text-neutral-900">
                    {formatCurrency(total)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost">
                      Detalle
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-sm text-muted-foreground">
                  Sin órdenes con esos filtros.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
          {selected && <OrderDetailSheet order={selected} />}
          <SheetFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>
              Cerrar
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function OrderDetailSheet({ order }: { order: WorkOrder }) {
  const total = order.estimatedHours * order.ratePerHour * order.workersNeeded;
  return (
    <>
      <SheetHeader>
        <SheetTitle>{order.orderNumber}</SheetTitle>
        <SheetDescription>{WORK_TYPE_LABEL[order.workType]}</SheetDescription>
      </SheetHeader>
      <div className="flex-1 overflow-y-auto scrollbar-thin p-6 space-y-5">
        {/* Summary chips */}
        <div className="grid grid-cols-2 gap-2">
          <Chip icon={CalendarClock} label="Programado" value={formatDateTime(order.scheduledAt)} />
          <Chip icon={Users} label="Cuadrilla" value={`${order.workersNeeded} trabajadores`} />
          <Chip icon={MapPin} label="Dirección" value={order.address} />
          <Chip icon={FileText} label="Monto" value={formatCurrency(total)} />
        </div>

        <Separator />

        {/* Workers */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-3">
            Trabajadores asignados
          </p>
          <div className="space-y-2">
            {order.assignedWorkers.map((aw) => {
              const w = getWorker(aw.workerId);
              if (!w) return null;
              return (
                <div
                  key={aw.workerId}
                  className="flex items-center gap-3 rounded-xl border border-neutral-200/60 bg-white p-3"
                >
                  <Avatar>
                    <AvatarFallback className="bg-neutral-900 text-white text-[11px]">
                      {getInitials(w.firstName, w.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900">
                      {w.firstName} {w.lastName}
                    </p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                      {w.ratingAvg.toFixed(1)} · {w.specialties[0]}
                    </p>
                  </div>
                  <Badge
                    variant={
                      aw.status === 'confirmed'
                        ? 'success'
                        : aw.status === 'pending'
                        ? 'warning'
                        : 'danger'
                    }
                  >
                    {aw.status === 'confirmed'
                      ? 'Confirmado'
                      : aw.status === 'pending'
                      ? 'Pendiente'
                      : 'Rechazado'}
                  </Badge>
                </div>
              );
            })}
            {order.assignedWorkers.length === 0 && (
              <p className="text-xs text-muted-foreground italic">
                Sin trabajadores asignados todavía. Nobel Solutions los está buscando.
              </p>
            )}
          </div>
        </div>

        <Separator />

        {/* Summary */}
        <div className="rounded-xl border border-neutral-200/60 bg-neutral-50/40 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-3">
            Resumen
          </p>
          <div className="space-y-1.5 text-sm">
            <Row label="Trabajadores requeridos" value={`${order.workersNeeded}`} />
            <Row label="Horas estimadas" value={`${order.estimatedHours}h c/u`} />
            <Row label="Tarifa hora" value={`$${order.ratePerHour}`} />
            <Separator className="my-2" />
            <Row label="Total estimado" value={formatCurrency(total)} bold />
          </div>
        </div>

        {order.notes && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-1.5">
              Notas
            </p>
            <p className="text-sm text-neutral-700 leading-relaxed">{order.notes}</p>
          </div>
        )}

        {order.status === 'completed' && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <p className="text-xs text-emerald-900">
              Orden completada. Podés calificar a los trabajadores arriba.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

function Chip({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
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

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={bold ? 'text-lg font-bold text-neutral-900' : 'text-neutral-900 font-medium'}>
        {value}
      </span>
    </div>
  );
}
