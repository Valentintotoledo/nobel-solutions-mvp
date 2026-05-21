import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from 'recharts';
import {
  CheckCircle2,
  Download,
  FileSpreadsheet,
  TrendingUp,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn, formatCurrencyExact, formatCurrency, getInitials } from '@/lib/utils';
import {
  workers,
  workOrders,
  companies,
  revenueByCompanyChart,
  getCompany,
  getWorker,
} from '@/data/mockData';

export function AdminReportsView() {
  const [toast, setToast] = useState<string | null>(null);

  // Payroll rows for this week (mock)
  const payroll = useMemo(() => {
    const inProgressOrCompleted = workOrders.filter(
      (o) => o.status === 'in_progress' || o.status === 'completed' || o.status === 'confirmed'
    );
    const rows: {
      id: string;
      worker: ReturnType<typeof getWorker>;
      company: ReturnType<typeof getCompany>;
      hours: number;
      rate: number;
      subtotal: number;
    }[] = [];
    inProgressOrCompleted.slice(0, 8).forEach((o, idx) => {
      o.assignedWorkers
        .filter((aw) => aw.status === 'confirmed')
        .slice(0, 2)
        .forEach((aw, j) => {
          const w = getWorker(aw.workerId);
          if (!w) return;
          const hours = o.estimatedHours + (idx % 2 === 0 ? -0.5 : 0.25);
          rows.push({
            id: `${o.id}-${aw.workerId}-${j}`,
            worker: w,
            company: getCompany(o.companyId),
            hours,
            rate: w.hourlyRate,
            subtotal: hours * w.hourlyRate,
          });
        });
    });
    return rows.slice(0, 12);
  }, []);

  const totalPayroll = payroll.reduce((acc, r) => acc + r.subtotal, 0);
  const totalHours = payroll.reduce((acc, r) => acc + r.hours, 0);

  const workerRanking = useMemo(() => {
    return [...workers]
      .sort((a, b) => b.hoursThisMonth - a.hoursThisMonth)
      .slice(0, 10);
  }, []);

  const maxHours = workerRanking[0]?.hoursThisMonth || 1;

  const handleExport = () => {
    setToast('Exportación a QuickBooks iniciada. Recibirás el resumen por email.');
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="space-y-5 relative">
      <Tabs defaultValue="payroll">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <TabsList>
            <TabsTrigger value="payroll">Horas & Pagos</TabsTrigger>
            <TabsTrigger value="company">Por Empresa</TabsTrigger>
            <TabsTrigger value="worker">Por Trabajador</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              Semana del 18 al 24 de mayo · 2026
            </Badge>
          </div>
        </div>

        {/* PAYROLL */}
        <TabsContent value="payroll">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
            <SummaryCard
              label="Total nómina semanal"
              value={formatCurrency(totalPayroll)}
              subtext="por aprobar y pagar"
              tone="emerald"
            />
            <SummaryCard
              label="Horas trabajadas"
              value={`${totalHours.toFixed(0)}h`}
              subtext={`${payroll.length} asignaciones`}
            />
            <SummaryCard
              label="Próxima exportación"
              value="Viernes"
              subtext="QuickBooks · automático"
              tone="amber"
            />
          </div>

          <div className="rounded-2xl border border-neutral-200/70 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200/70 gap-3 flex-wrap">
              <div>
                <h2 className="text-base font-semibold text-neutral-900">
                  Nómina semanal — Subcontratistas
                </h2>
                <p className="text-xs text-muted-foreground">
                  Horas, tarifas y subtotales listos para exportar
                </p>
              </div>
              <Button onClick={handleExport}>
                <FileSpreadsheet className="h-3.5 w-3.5" />
                Exportar a QuickBooks
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trabajador</TableHead>
                  <TableHead>Empresa cliente</TableHead>
                  <TableHead className="text-right">Horas</TableHead>
                  <TableHead className="text-right">Tarifa/h</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payroll.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-neutral-900 text-white text-[10px]">
                            {getInitials(r.worker!.firstName, r.worker!.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-neutral-900 leading-tight">
                            {r.worker!.firstName} {r.worker!.lastName}
                          </p>
                          <p className="text-[11px] text-neutral-500">
                            {r.worker!.specialties[0]}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-neutral-700">
                      {r.company?.name}
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium">
                      {r.hours.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right text-sm text-neutral-600">
                      ${r.rate}
                    </TableCell>
                    <TableCell className="text-right text-sm font-semibold text-neutral-900">
                      {formatCurrencyExact(r.subtotal)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="px-5 py-4 border-t border-neutral-200/70 bg-neutral-50/40 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Total de {payroll.length} asignaciones · {totalHours.toFixed(1)}h
              </p>
              <p className="text-lg font-bold text-neutral-900">
                {formatCurrencyExact(totalPayroll)}
              </p>
            </div>
          </div>
        </TabsContent>

        {/* COMPANY */}
        <TabsContent value="company">
          <div className="rounded-2xl border border-neutral-200/70 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-neutral-900">
                  Ingresos por empresa cliente
                </h2>
                <p className="text-xs text-muted-foreground">
                  Últimos 30 días — facturación bruta
                </p>
              </div>
              <Badge variant="success">
                <TrendingUp className="h-3 w-3" />
                Total: {formatCurrency(revenueByCompanyChart.reduce((a, b) => a + b.revenue, 0))}
              </Badge>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByCompanyChart} margin={{ left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                  <XAxis
                    dataKey="company"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#a3a3a3', fontSize: 11 }}
                    interval={0}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#a3a3a3', fontSize: 11 }}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                    contentStyle={{
                      borderRadius: 8,
                      border: '1px solid #e5e5e5',
                      fontSize: 12,
                    }}
                    formatter={(v) => formatCurrency(Number(v))}
                  />
                  <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
                    {revenueByCompanyChart.map((_, i) => (
                      <Cell
                        key={i}
                        fill={i % 2 === 0 ? '#171717' : '#404040'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-neutral-200/70 bg-white shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead className="text-right">Órdenes activas</TableHead>
                  <TableHead className="text-right">Completadas</TableHead>
                  <TableHead className="text-right">Ingresos 30d</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((c, i) => (
                  <TableRow key={c.id}>
                    <TableCell className="text-sm font-medium text-neutral-900">
                      {c.name}
                    </TableCell>
                    <TableCell className="text-sm text-neutral-600">
                      {c.contactName}
                    </TableCell>
                    <TableCell className="text-right text-sm">{c.activeOrders}</TableCell>
                    <TableCell className="text-right text-sm">{c.completedOrders}</TableCell>
                    <TableCell className="text-right text-sm font-semibold text-neutral-900">
                      {formatCurrency(revenueByCompanyChart[i]?.revenue || 0)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* WORKER */}
        <TabsContent value="worker">
          <div className="rounded-2xl border border-neutral-200/70 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-base font-semibold text-neutral-900">
                  Ranking por horas trabajadas
                </h2>
                <p className="text-xs text-muted-foreground">
                  Top 10 — este mes
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-3.5 w-3.5" />
                Descargar CSV
              </Button>
            </div>

            <div className="space-y-2.5">
              {workerRanking.map((w, i) => {
                const pct = (w.hoursThisMonth / maxHours) * 100;
                return (
                  <div key={w.id} className="flex items-center gap-3">
                    <span className="text-[11px] font-mono w-6 text-right text-neutral-400">
                      #{i + 1}
                    </span>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-neutral-900 text-white text-[10px]">
                        {getInitials(w.firstName, w.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-sm font-medium text-neutral-900 truncate">
                          {w.firstName} {w.lastName}
                        </p>
                        <span className="text-sm font-semibold text-neutral-900 tabular-nums shrink-0">
                          {w.hoursThisMonth}h
                        </span>
                      </div>
                      <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                        <motion.div
                          className={cn(
                            'h-full rounded-full',
                            i === 0
                              ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                              : 'bg-neutral-900'
                          )}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, delay: i * 0.04 }}
                        />
                      </div>
                    </div>
                    <span className="text-[11px] text-muted-foreground shrink-0 tabular-nums w-16 text-right">
                      {formatCurrency(w.hoursThisMonth * w.hourlyRate)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className="fixed bottom-6 right-6 z-50 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 shadow-lg flex items-center gap-3 max-w-sm"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <p className="text-sm text-emerald-900">{toast}</p>
        </motion.div>
      )}
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
  value: string;
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
