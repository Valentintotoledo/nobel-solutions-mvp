import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  Play,
  Square,
  FileText,
  DollarSign,
  CalendarClock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { cn, formatCurrencyExact, formatDateTime, formatTime } from '@/lib/utils';
import {
  getWorker,
  getOrder,
  getCompany,
  workOrders,
  WORK_TYPE_LABEL,
} from '@/data/mockData';

const WORKER_ID = 'w_1';

type Session = {
  orderId: string;
  startedAt: number;
};

export function WorkerCheckinView() {
  const worker = getWorker(WORKER_ID)!;

  // pre-set: worker w_1 has active check-in on order o_9, started ~7:45 today
  const initialOrder =
    workOrders.find(
      (o) =>
        o.status === 'in_progress' &&
        o.assignedWorkers.some((aw) => aw.workerId === WORKER_ID)
    ) ?? workOrders.find((o) =>
      o.assignedWorkers.some((aw) => aw.workerId === WORKER_ID && aw.status === 'confirmed')
    );

  const [session, setSession] = useState<Session | null>(
    initialOrder
      ? { orderId: initialOrder.id, startedAt: Date.now() - 1000 * 60 * 60 * 4 - 1000 * 60 * 12 }
      : null
  );
  const [completedSummary, setCompletedSummary] = useState<null | {
    orderId: string;
    hours: number;
    pay: number;
  }>(null);
  const [now, setNow] = useState(Date.now());
  const [note, setNote] = useState('');

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const order = session ? getOrder(session.orderId) : initialOrder ?? null;
  const company = order ? getCompany(order.companyId) : null;

  const elapsedMs = session ? now - session.startedAt : 0;
  const elapsedH = elapsedMs / 1000 / 60 / 60;
  const hours = Math.floor(elapsedH);
  const minutes = Math.floor((elapsedH - hours) * 60);
  const seconds = Math.floor(((elapsedH - hours) * 60 - minutes) * 60);
  const livePay = elapsedH * worker.hourlyRate;

  const handleCheckIn = () => {
    if (!order) return;
    setSession({ orderId: order.id, startedAt: Date.now() });
    setCompletedSummary(null);
  };

  const handleCheckOut = () => {
    if (!session) return;
    setCompletedSummary({
      orderId: session.orderId,
      hours: elapsedH,
      pay: livePay,
    });
    setSession(null);
  };

  if (completedSummary) {
    const o = getOrder(completedSummary.orderId);
    const co = o ? getCompany(o.companyId) : null;
    return (
      <div className="max-w-md mx-auto pt-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-emerald-200 bg-white shadow-sm overflow-hidden"
        >
          <div className="bg-emerald-50 px-6 py-5 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mb-3">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900">Check-out registrado</h2>
            <p className="text-sm text-emerald-900 mt-1">
              Buen trabajo en {co?.name}
            </p>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <SummaryBox
                icon={Clock}
                label="Horas trabajadas"
                value={`${Math.floor(completedSummary.hours)}h ${Math.round(
                  (completedSummary.hours - Math.floor(completedSummary.hours)) * 60
                )}min`}
              />
              <SummaryBox
                icon={DollarSign}
                label="Estimado de pago"
                value={formatCurrencyExact(completedSummary.pay)}
                tone="emerald"
              />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-2 flex items-center gap-1.5">
                <FileText className="h-3 w-3" /> Agregar nota (opcional)
              </p>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Ej: Llegamos antes de hora, trabajo limpio, sin incidentes."
              />
            </div>

            <Button
              size="xl"
              className="w-full"
              onClick={() => {
                setCompletedSummary(null);
                setNote('');
              }}
            >
              Cerrar y volver
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-10 text-center max-w-md mx-auto">
        <Clock className="h-8 w-8 text-neutral-300 mx-auto mb-3" />
        <p className="text-sm font-medium text-neutral-700">
          No tenés trabajos para hacer check-in hoy.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Cuando te asignen una nueva orden, vas a verla acá.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {session ? (
          <motion.div
            key="active"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl border-2 border-orange-200 bg-gradient-to-b from-orange-50 to-white shadow-lg overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-orange-200/70 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
              </span>
              <p className="text-[10px] uppercase tracking-widest text-orange-700 font-semibold">
                En sitio · activo
              </p>
              <span className="ml-auto text-[10px] text-neutral-500">
                Desde {formatTime(new Date(session.startedAt).toISOString())}
              </span>
            </div>

            <div className="p-6 text-center">
              <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-2">
                Tiempo en sitio
              </p>
              <div className="flex items-baseline justify-center gap-1 font-mono">
                <TimeDigit value={hours} label="hr" />
                <span className="text-3xl text-neutral-300">:</span>
                <TimeDigit value={minutes} label="min" />
                <span className="text-3xl text-neutral-300">:</span>
                <TimeDigit value={seconds} label="seg" />
              </div>

              <div className="mt-5 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
                <p className="text-[10px] uppercase tracking-widest text-emerald-700 font-semibold">
                  Pago acumulado
                </p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">
                  {formatCurrencyExact(livePay)}
                </p>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  a ${worker.hourlyRate}/hora
                </p>
              </div>

              <div className="mt-5 text-left space-y-2">
                <InfoLine icon={Building2} label="Empresa" value={company?.name ?? '—'} />
                <InfoLine icon={MapPin} label="Dirección" value={order.address} />
                <InfoLine
                  icon={FileText}
                  label="Trabajo"
                  value={WORK_TYPE_LABEL[order.workType]}
                />
              </div>
            </div>

            <div className="p-5 pt-0">
              <Button
                onClick={handleCheckOut}
                variant="destructive"
                size="xl"
                className="w-full"
              >
                <Square className="h-5 w-5 fill-white" />
                CHECK OUT
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white shadow-lg overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-emerald-200/70 flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <p className="text-[10px] uppercase tracking-widest text-emerald-700 font-semibold">
                Trabajo de hoy · listo para arrancar
              </p>
            </div>

            <div className="p-6">
              <Badge variant="success" className="mb-3">
                <CalendarClock className="h-2.5 w-2.5" /> {formatDateTime(order.scheduledAt)}
              </Badge>
              <h2 className="text-2xl font-bold text-neutral-900 leading-tight tracking-tight">
                {WORK_TYPE_LABEL[order.workType]}
              </h2>

              <div className="mt-4 space-y-2">
                <InfoLine icon={Building2} label="Empresa" value={company?.name ?? '—'} />
                <InfoLine icon={MapPin} label="Dirección" value={order.address} />
                <InfoLine
                  icon={DollarSign}
                  label="Pago estimado"
                  value={`${formatCurrencyExact(order.estimatedHours * worker.hourlyRate)} (${order.estimatedHours}h × $${worker.hourlyRate})`}
                />
              </div>
            </div>

            <div className="p-5 pt-0">
              <Button onClick={handleCheckIn} variant="success" size="xl" className="w-full">
                <Play className="h-5 w-5 fill-white" />
                CHECK IN
              </Button>
              <p className="text-[10px] text-center text-muted-foreground mt-2">
                Se registrará la hora exacta de inicio
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TimeDigit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-5xl font-bold text-neutral-900 tabular-nums">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-semibold mt-0.5">
        {label}
      </span>
    </div>
  );
}

function InfoLine({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl bg-white border border-neutral-200/60 px-3 py-2.5">
      <Icon className="h-4 w-4 text-neutral-400 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
          {label}
        </p>
        <p className="text-sm text-neutral-900 leading-snug">{value}</p>
      </div>
    </div>
  );
}

function SummaryBox({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  tone?: 'emerald';
}) {
  return (
    <div className="rounded-xl border border-neutral-200/60 bg-white p-3">
      <Icon className="h-4 w-4 text-neutral-400 mb-1" />
      <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
        {label}
      </p>
      <p
        className={cn(
          'text-base font-bold mt-1',
          tone === 'emerald' ? 'text-emerald-600' : 'text-neutral-900'
        )}
      >
        {value}
      </p>
    </div>
  );
}
