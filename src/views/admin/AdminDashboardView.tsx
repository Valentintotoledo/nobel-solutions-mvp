import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Clock,
  DollarSign,
  Star,
  TrendingUp,
  Users,
  Sparkles,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn, formatCurrency, formatDateTime, getInitials } from '@/lib/utils';
import {
  adminMetrics,
  weeklyOrdersChart,
  workOrders,
  workers,
  getCompany,
  WORK_TYPE_LABEL,
  ORDER_STATUS_LABEL,
} from '@/data/mockData';
import type { OrderStatus } from '@/data/mockData';

const STATUS_BADGE_VARIANT: Record<OrderStatus, 'info' | 'warning' | 'success' | 'orange' | 'neutral' | 'danger'> = {
  new: 'info',
  assigning: 'warning',
  confirmed: 'success',
  in_progress: 'orange',
  completed: 'neutral',
  cancelled: 'danger',
};

export function AdminDashboardView() {
  const recent = [...workOrders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const topWorkers = [...workers]
    .sort((a, b) => b.hoursThisMonth - a.hoursThisMonth || b.ratingAvg - a.ratingAvg)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* KPI strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Órdenes activas"
          subtext="esta semana"
          value={adminMetrics.activeOrdersThisWeek}
          delta={adminMetrics.deltaOrders}
          icon={Activity}
        />
        <KpiCard
          label="Subcontratistas disponibles"
          subtext="hoy"
          value={adminMetrics.availableWorkersToday}
          delta={adminMetrics.deltaWorkers}
          icon={Users}
        />
        <KpiCard
          label="Horas facturadas"
          subtext="este mes"
          value={`${adminMetrics.billableHoursThisMonth}h`}
          delta={adminMetrics.deltaHours}
          icon={Clock}
        />
        <KpiCard
          label="Ingresos estimados"
          subtext="este mes"
          value={formatCurrency(adminMetrics.estimatedRevenueThisMonth)}
          delta={adminMetrics.deltaRevenue}
          icon={DollarSign}
        />
      </div>

      {/* Chart + Top workers */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-5">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl border border-neutral-200/70 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-base font-semibold text-neutral-900">
                Órdenes completadas
              </h2>
              <p className="text-xs text-muted-foreground">
                Últimas 8 semanas — tendencia creciente
              </p>
            </div>
            <Badge variant="success">
              <TrendingUp className="h-3 w-3" />
              +24% vs trimestre anterior
            </Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyOrdersChart}>
                <defs>
                  <linearGradient id="ordersFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#171717" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="#171717" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                <XAxis
                  dataKey="week"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#a3a3a3', fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#a3a3a3', fontSize: 11 }}
                  width={32}
                />
                <Tooltip
                  cursor={{ stroke: '#171717', strokeWidth: 1, strokeDasharray: '3 3' }}
                  contentStyle={{
                    borderRadius: 8,
                    border: '1px solid #e5e5e5',
                    fontSize: 12,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#171717"
                  strokeWidth={2}
                  fill="url(#ordersFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="rounded-2xl border border-neutral-200/70 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <h2 className="text-base font-semibold text-neutral-900">
              Trabajadores top esta semana
            </h2>
          </div>
          <div className="space-y-3">
            {topWorkers.map((w, i) => (
              <div
                key={w.id}
                className="flex items-center gap-3 rounded-xl border border-neutral-200/60 bg-neutral-50/40 px-3 py-2.5"
              >
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-neutral-900 text-white text-xs">
                      {getInitials(w.firstName, w.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  {i === 0 && (
                    <span className="absolute -top-1 -right-1 text-[11px]">🏆</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">
                    {w.firstName} {w.lastName}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-neutral-500">
                      {w.hoursThisMonth}h trabajadas
                    </span>
                    <span className="text-[11px] text-amber-600 flex items-center gap-0.5">
                      <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
                      {w.ratingAvg.toFixed(1)}
                    </span>
                  </div>
                </div>
                <Badge variant="outline" className="font-mono text-[10px]">
                  #{i + 1}
                </Badge>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="w-full mt-3 text-xs">
            Ver todos los subcontratistas
          </Button>
        </motion.div>
      </div>

      {/* Recent orders */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.08 }}
        className="rounded-2xl border border-neutral-200/70 bg-white shadow-sm overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200/70">
          <div>
            <h2 className="text-base font-semibold text-neutral-900">Órdenes recientes</h2>
            <p className="text-xs text-muted-foreground">
              Últimas 6 órdenes creadas en tu plataforma
            </p>
          </div>
          <Button variant="outline" size="sm">
            Ver todas
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empresa</TableHead>
              <TableHead>Tipo de trabajo</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Cuadrilla</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Monto est.</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recent.map((o) => {
              const co = getCompany(o.companyId);
              const total = o.estimatedHours * o.ratePerHour * o.workersNeeded;
              const confirmed = o.assignedWorkers.filter((w) => w.status === 'confirmed').length;
              return (
                <TableRow key={o.id} className="cursor-pointer">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-md bg-neutral-100 flex items-center justify-center">
                        <Building2 className="h-3.5 w-3.5 text-neutral-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900 leading-tight">
                          {co?.name}
                        </p>
                        <p className="text-[11px] text-neutral-500">{o.orderNumber}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-neutral-700">
                    {WORK_TYPE_LABEL[o.workType]}
                  </TableCell>
                  <TableCell className="text-sm text-neutral-600 whitespace-nowrap">
                    {formatDateTime(o.scheduledAt)}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium text-neutral-900">
                      {confirmed}
                    </span>
                    <span className="text-sm text-neutral-400">/{o.workersNeeded}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_BADGE_VARIANT[o.status]}>
                      {ORDER_STATUS_LABEL[o.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-sm font-semibold text-neutral-900">
                    {formatCurrency(total)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
}

function KpiCard({
  label,
  subtext,
  value,
  delta,
  icon: Icon,
}: {
  label: string;
  subtext: string;
  value: string | number;
  delta: { value: number; direction: 'up' | 'down' };
  icon: typeof Activity;
}) {
  const up = delta.direction === 'up';
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-neutral-200/70 bg-white p-5 shadow-sm"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-neutral-100">
          <Icon className="h-4 w-4 text-neutral-600" />
        </div>
        <div
          className={cn(
            'flex items-center gap-0.5 text-[11px] font-semibold',
            up ? 'text-emerald-600' : 'text-red-600'
          )}
        >
          {up ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : (
            <ArrowDownRight className="h-3 w-3" />
          )}
          {delta.value}%
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold text-neutral-900 mt-1">{value}</p>
      <p className="text-[11px] text-neutral-400 mt-0.5">{subtext}</p>
    </motion.div>
  );
}
