import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  MapPin,
  CalendarClock,
  DollarSign,
  CheckCircle2,
  HandMetal,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import {
  workOrders,
  getCompany,
  getOrdersByWorker,
  getWorker,
  WORK_TYPE_LABEL,
  ORDER_STATUS_LABEL,
} from '@/data/mockData';
import type { OrderStatus, WorkOrder } from '@/data/mockData';

const WORKER_ID = 'w_1';

const STATUS_BADGE: Record<OrderStatus, 'info' | 'warning' | 'success' | 'orange' | 'neutral' | 'danger'> = {
  new: 'info',
  assigning: 'warning',
  confirmed: 'success',
  in_progress: 'orange',
  completed: 'neutral',
  cancelled: 'danger',
};

export function WorkerOrdersView() {
  const worker = getWorker(WORKER_ID)!;
  const mine = getOrdersByWorker(WORKER_ID);
  const available = workOrders.filter(
    (o) =>
      o.status === 'new' &&
      o.assignedWorkers.length < o.workersNeeded &&
      !o.assignedWorkers.some((aw) => aw.workerId === WORKER_ID)
  );

  return (
    <div>
      <Tabs defaultValue="mine">
        <TabsList>
          <TabsTrigger value="mine">Mis órdenes ({mine.length})</TabsTrigger>
          <TabsTrigger value="available">Disponibles ({available.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="mine">
          <div className="space-y-3">
            {mine.map((o) => (
              <OrderCard key={o.id} order={o} mine workerHourlyRate={worker.hourlyRate} />
            ))}
            {mine.length === 0 && (
              <div className="rounded-xl border border-dashed border-neutral-200 bg-white p-10 text-center text-sm text-muted-foreground">
                Aún no tenés órdenes asignadas.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="available">
          <div className="space-y-3">
            {available.map((o) => (
              <OrderCard key={o.id} order={o} workerHourlyRate={worker.hourlyRate} />
            ))}
            {available.length === 0 && (
              <div className="rounded-xl border border-dashed border-neutral-200 bg-white p-10 text-center text-sm text-muted-foreground">
                Sin trabajos disponibles cerca tuyo ahora mismo.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OrderCard({
  order,
  mine,
  workerHourlyRate,
}: {
  order: WorkOrder;
  mine?: boolean;
  workerHourlyRate: number;
}) {
  const [interested, setInterested] = useState(false);
  const co = getCompany(order.companyId);
  const myStatus = order.assignedWorkers.find((aw) => aw.workerId === WORKER_ID)?.status;
  const pay = order.estimatedHours * workerHourlyRate;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-neutral-200/70 bg-white shadow-sm p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest font-mono text-neutral-400">
              {order.orderNumber}
            </span>
            <Badge variant={STATUS_BADGE[order.status]}>
              {ORDER_STATUS_LABEL[order.status]}
            </Badge>
            {myStatus === 'confirmed' && (
              <Badge variant="success">
                <CheckCircle2 className="h-2.5 w-2.5" /> Confirmado
              </Badge>
            )}
            {myStatus === 'pending' && (
              <Badge variant="warning">Pendiente tu respuesta</Badge>
            )}
          </div>
          <h3 className="text-base font-semibold text-neutral-900 mt-1">
            {WORK_TYPE_LABEL[order.workType]}
          </h3>
          <p className="text-sm text-neutral-600 flex items-center gap-1.5 mt-1">
            <Building2 className="h-3 w-3 text-neutral-400" /> {co?.name}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold">
            Pago estimado
          </p>
          <p className="text-lg font-bold text-emerald-600">{formatCurrency(pay)}</p>
          <p className="text-[10px] text-muted-foreground">{order.estimatedHours}h · ${workerHourlyRate}/h</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
        <InfoChip icon={MapPin} label="Dirección" value={order.address} />
        <InfoChip icon={CalendarClock} label="Programado" value={formatDateTime(order.scheduledAt)} />
        <InfoChip icon={Users} label="Cuadrilla" value={`${order.assignedWorkers.length}/${order.workersNeeded}`} />
      </div>

      <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
        <p className="text-[11px] text-muted-foreground">
          {order.notes.slice(0, 90)}{order.notes.length > 90 ? '…' : ''}
        </p>
        <div className="flex gap-2">
          {mine && myStatus === 'pending' && (
            <>
              <Button size="sm" variant="outline">
                No puedo ir
              </Button>
              <Button size="sm" variant="success">
                <CheckCircle2 className="h-3.5 w-3.5" /> Confirmar
              </Button>
            </>
          )}
          {!mine && (
            <Button
              size="sm"
              variant={interested ? 'outline' : 'default'}
              onClick={() => setInterested(true)}
              disabled={interested}
            >
              <HandMetal className="h-3.5 w-3.5" />
              {interested ? 'Interés enviado' : 'Expresar interés'}
            </Button>
          )}
          {mine && myStatus === 'confirmed' && (
            <Button size="sm" variant="outline">
              Ver detalles
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function InfoChip({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
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
