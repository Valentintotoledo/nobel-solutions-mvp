import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Send,
  X,
  Bot,
  Loader2,
  ArrowDown,
} from 'lucide-react';
import { cn, formatCurrency, formatTime } from '@/lib/utils';
import {
  workers,
  workOrders,
  companies,
  getCompany,
  ORDER_STATUS_LABEL,
  WORK_TYPE_LABEL,
  adminMetrics,
} from '@/data/mockData';

type Message = {
  id: string;
  role: 'user' | 'ai';
  text: string;
  ts: number;
};

const uid = () => Math.random().toString(36).slice(2, 10);

const SUGGESTIONS = [
  '¿Cuántos trabajadores tengo disponibles ahora?',
  '¿Qué órdenes urgentes tengo hoy?',
  'Asigná la mejor cuadrilla para mi próxima orden',
  'Resumen de la semana',
  '¿Quién es mi top performer?',
];

const INITIAL_MESSAGE: Message = {
  id: uid(),
  role: 'ai',
  text: '¡Hola Luis! Soy tu asistente IA y conozco toda tu operación. Puedo ayudarte a asignar cuadrillas, ver métricas, resolver dudas y exportar reportes — todo en lenguaje natural. ¿En qué arrancamos?',
  ts: Date.now(),
};

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [thinking, setThinking] = useState(false);
  const [streamingText, setStreamingText] = useState<string | null>(null);
  const [hasNew, setHasNew] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setHasNew(false);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [open]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, streamingText, thinking]);

  const send = (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    setInput('');
    setMessages((m) => [...m, { id: uid(), role: 'user', text: clean, ts: Date.now() }]);
    setThinking(true);

    setTimeout(() => {
      setThinking(false);
      streamResponse(generateResponse(clean));
    }, 600 + Math.random() * 500);
  };

  const streamResponse = (full: string) => {
    setStreamingText('');
    let i = 0;
    const interval = setInterval(() => {
      i += Math.max(1, Math.floor(full.length / 120));
      const next = full.slice(0, Math.min(i, full.length));
      setStreamingText(next);
      if (i >= full.length) {
        clearInterval(interval);
        setStreamingText(null);
        setMessages((m) => [
          ...m,
          { id: uid(), role: 'ai', text: full, ts: Date.now() },
        ]);
      }
    }, 16);
  };

  return (
    <>
      {/* Floating launcher */}
      <div
        data-tour="ai-assistant"
        className="fixed bottom-6 right-6 z-40"
      >
        <AnimatePresence>
          {!open && (
            <motion.button
              key="launcher"
              initial={{ opacity: 0, scale: 0.6, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 8 }}
              transition={{ type: 'spring', damping: 18, stiffness: 240 }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setOpen(true)}
              className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-neutral-900 to-neutral-800 text-white shadow-xl ring-1 ring-amber-500/30 hover:ring-amber-400/60 transition-shadow"
              aria-label="Abrir asistente IA"
            >
              <span className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl group-hover:bg-amber-500/30 transition-colors" />
              <Sparkles className="relative h-5 w-5 text-amber-400" />
              {hasNew && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500 ring-2 ring-white" />
                </span>
              )}
              <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-neutral-900 text-white text-xs px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                Asistente IA
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
            className="fixed bottom-6 right-6 z-40 w-[calc(100vw-3rem)] max-w-[400px] h-[calc(100vh-7rem)] max-h-[640px] rounded-3xl bg-white border border-neutral-200/80 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 text-white px-5 py-4 border-b border-neutral-800">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg">
                      <Bot className="h-4 w-4 text-neutral-900" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-neutral-900" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Asistente Nobel</p>
                    <p className="text-[10px] text-amber-300/80 uppercase tracking-widest font-semibold flex items-center gap-1">
                      <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
                      IA conectada · siempre disponible
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white transition-colors"
                  aria-label="Cerrar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4 space-y-3 bg-gradient-to-b from-neutral-50/40 to-white"
            >
              {messages.map((m) => (
                <Bubble key={m.id} message={m} />
              ))}

              {thinking && <TypingBubble />}

              {streamingText !== null && (
                <Bubble
                  message={{
                    id: 'streaming',
                    role: 'ai',
                    text: streamingText,
                    ts: Date.now(),
                  }}
                  streaming
                />
              )}
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && !thinking && streamingText === null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="px-4 pb-3"
              >
                <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold mb-2">
                  Probá preguntando
                </p>
                <div className="flex flex-col gap-1.5">
                  {SUGGESTIONS.slice(0, 4).map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-left text-xs rounded-xl border border-neutral-200/70 bg-white hover:bg-neutral-50 hover:border-neutral-300 px-3 py-2 transition-colors text-neutral-700"
                    >
                      <ArrowDown className="inline h-2.5 w-2.5 -rotate-45 text-amber-500 mr-1" />
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Input */}
            <div className="border-t border-neutral-200/70 bg-white px-3 py-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex items-center gap-2 rounded-2xl border border-neutral-200/80 bg-white px-3 py-1.5 shadow-sm focus-within:border-neutral-400 transition-colors"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  type="text"
                  placeholder="Preguntá lo que necesites…"
                  disabled={thinking || streamingText !== null}
                  className="flex-1 bg-transparent text-sm placeholder:text-neutral-400 focus:outline-none disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || thinking || streamingText !== null}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full transition-all',
                    input.trim() && !thinking && streamingText === null
                      ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                      : 'bg-neutral-100 text-neutral-300'
                  )}
                  aria-label="Enviar"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
              <p className="text-[10px] text-neutral-400 text-center mt-2 font-mono">
                Demo · respuestas generadas con datos mock
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Bubble({
  message,
  streaming,
}: {
  message: Message;
  streaming?: boolean;
}) {
  const isUser = message.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={cn('flex gap-2', isUser ? 'justify-end' : 'justify-start')}
    >
      {!isUser && (
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 shrink-0">
          <Bot className="h-3.5 w-3.5 text-neutral-900" />
        </div>
      )}
      <div
        className={cn(
          'rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed max-w-[80%] whitespace-pre-wrap',
          isUser
            ? 'bg-neutral-900 text-white rounded-tr-md'
            : 'bg-neutral-100 text-neutral-800 rounded-tl-md'
        )}
      >
        {message.text}
        {streaming && (
          <span className="inline-block w-1 h-3 bg-neutral-700 ml-0.5 animate-pulse align-middle" />
        )}
      </div>
    </motion.div>
  );
}

function TypingBubble() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex gap-2 justify-start"
    >
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 shrink-0">
        <Loader2 className="h-3.5 w-3.5 text-neutral-900 animate-spin" />
      </div>
      <div className="rounded-2xl rounded-tl-md bg-neutral-100 px-4 py-3 flex items-center gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '120ms' }} />
        <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '240ms' }} />
      </div>
    </motion.div>
  );
}

// =============================================================================
// Mock response engine — contextualized to the actual mock data
// =============================================================================

function generateResponse(query: string): string {
  const q = query.toLowerCase();

  // Available workers
  if (/disponible|libre|listo|quien puede/i.test(q)) {
    const avail = workers.filter((w) => w.status === 'available');
    const top = avail.slice(0, 5);
    return [
      `Tenés ${avail.length} subcontratistas disponibles ahora mismo en Austin. Los mejores 5 por rating:`,
      '',
      ...top.map(
        (w) =>
          `· ${w.firstName} ${w.lastName} — ${w.specialties[0]} · ★${w.ratingAvg.toFixed(1)} · $${w.hourlyRate}/h`
      ),
      '',
      '¿Querés que arme una cuadrilla para alguna orden específica?',
    ].join('\n');
  }

  // Urgent orders / today
  if (/urgente|hoy|próxim|proxim|esta semana|qué orden|que orden/i.test(q)) {
    const active = workOrders
      .filter((o) => ['new', 'assigning', 'confirmed', 'in_progress'].includes(o.status))
      .slice(0, 4);
    return [
      `Tenés ${active.length} órdenes activas. Te ordeno por urgencia:`,
      '',
      ...active.map(
        (o) =>
          `· ${o.orderNumber} — ${getCompany(o.companyId)?.name}\n  ${WORK_TYPE_LABEL[o.workType]} · ${ORDER_STATUS_LABEL[o.status]} · arranca ${formatTime(o.scheduledAt)}`
      ),
      '',
      `Atención: ${active.filter((o) => o.status === 'new').length} están sin cuadrilla asignada todavía. ¿Te ayudo a asignarlas?`,
    ].join('\n');
  }

  // Auto-assign smart
  if (/asign|cuadrilla|mejor.*cuadrilla|recomend/i.test(q)) {
    const order = workOrders.find((o) => o.status === 'new');
    const co = order ? getCompany(order.companyId) : null;
    return [
      `Listo. Para ${order?.orderNumber ?? 'la próxima orden'} de ${co?.name ?? 'tu cliente'}, basándome en disponibilidad, ratings y especialidades requeridas, te recomiendo esta cuadrilla:`,
      '',
      '· Carlos Mendoza — líder de cuadrilla · ★4.9',
      '· Sebastián López — A/V especialista · ★5.0',
      '· Eduardo Flores — instalación · ★4.7',
      '· José Hernández — eléctrica · ★4.8',
      '',
      'Costo total estimado: $1,140 (8h × 4 trabajadores × $35.6/h promedio).',
      '',
      '¿Confirmo la asignación y les envío WhatsApp ahora?',
    ].join('\n');
  }

  // Weekly summary
  if (/resumen|semana|métric|metric|panorama|cómo va|como va/i.test(q)) {
    return [
      'Tu semana al toque:',
      '',
      `· ${adminMetrics.activeOrdersThisWeek} órdenes activas`,
      `· ${formatCurrency(adminMetrics.estimatedRevenueThisMonth)} facturación estimada este mes`,
      `· ${adminMetrics.billableHoursThisMonth}h trabajadas`,
      `· ${adminMetrics.availableWorkersToday} trabajadores disponibles hoy`,
      '',
      `Estás +${adminMetrics.deltaRevenue.value}% vs la semana pasada. Mejor cliente esta semana: Texas Corporate Furnishings con 4 órdenes activas.`,
      '',
      '¿Genero el reporte completo para exportar a QuickBooks?',
    ].join('\n');
  }

  // Top performer
  if (/top|mejor trabajador|destacad|estrella|performance/i.test(q)) {
    const top = [...workers].sort((a, b) => b.ratingAvg - a.ratingAvg || b.hoursThisMonth - a.hoursThisMonth)[0];
    return [
      `Tu top performer es ${top.firstName} ${top.lastName} 🏆`,
      '',
      `· Rating: ★${top.ratingAvg.toFixed(1)}/5`,
      `· Trabajos completados: ${top.completedJobs}`,
      `· Horas este mes: ${top.hoursThisMonth}h`,
      `· Especialidades: ${top.specialties.join(', ')}`,
      `· Tarifa: $${top.hourlyRate}/h`,
      '',
      'Las empresas lo piden con nombre y apellido. ¿Querés priorizarlo para asignaciones?',
    ].join('\n');
  }

  // Payroll
  if (/nómin|nomin|pago|cobrar|quickbooks|export|factur/i.test(q)) {
    return [
      `Esta semana van a pagar ${formatCurrency(4820)} entre 12 asignaciones confirmadas. Desglose:`,
      '',
      '· Mano de obra subcontratistas: $4,820',
      '· Tu margen estimado: $2,180 (45%)',
      `· Listo para exportar a QuickBooks → te genero el archivo en 1 click.`,
      '',
      '¿Lo hago ahora?',
    ].join('\n');
  }

  // Greetings
  if (/hola|hey|buen|qué tal|que tal|saludo/i.test(q)) {
    const newOrders = workOrders.filter((o) => o.status === 'new').length;
    return `¡Hola Luis! Todo en orden. Tenés ${newOrders} órdenes nuevas esperando cuadrilla y una en progreso ahora mismo en Round Rock. ¿Empezamos por las asignaciones pendientes?`;
  }

  // Specific company query
  for (const co of companies) {
    if (q.includes(co.name.toLowerCase().split(' ')[0])) {
      const orders = workOrders.filter((o) => o.companyId === co.id);
      return [
        `${co.name} — contacto: ${co.contactName} (${co.phone}).`,
        '',
        `· Órdenes activas: ${co.activeOrders}`,
        `· Completadas históricas: ${co.completedOrders}`,
        `· Próxima orden: ${orders[0]?.orderNumber ?? '—'} · ${orders[0] ? formatTime(orders[0].scheduledAt) : ''}`,
        '',
        '¿Querés ver el detalle de alguna orden o calificar el último trabajo?',
      ].join('\n');
    }
  }

  // Fallback
  return [
    'Como tu asistente IA puedo ayudarte con:',
    '',
    '· Ver órdenes activas y su estado',
    '· Recomendar y asignar cuadrillas automáticamente',
    '· Mostrar disponibilidad y ratings de tus trabajadores',
    '· Resumir métricas de la semana o el mes',
    '· Generar nóminas y exportar a QuickBooks',
    '· Avisarte de problemas antes que escalen',
    '',
    'Probá preguntando algo como "¿qué órdenes tengo hoy?" o "asigná la mejor cuadrilla".',
  ].join('\n');
}
