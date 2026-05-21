import { motion } from 'framer-motion';
import {
  Building2,
  ArrowRight,
  Sparkles,
  MessageSquareOff,
  Users,
  FileSpreadsheet,
  Bot,
} from 'lucide-react';
import { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';

interface LoginProps {
  onSuccess: () => void;
}

const FEATURES = [
  {
    icon: MessageSquareOff,
    title: 'Despacho sin caos de WhatsApp',
    body: 'Reemplazá los grupos por un panel con estado en tiempo real.',
  },
  {
    icon: Users,
    title: 'Cuadrillas asignadas en minutos',
    body: 'Disponibilidad, ratings y confirmaciones en un solo lugar.',
  },
  {
    icon: FileSpreadsheet,
    title: 'Cobros sin Excel a mano',
    body: 'Nómina semanal y exportación directa a QuickBooks en un click.',
  },
  {
    icon: Bot,
    title: 'Asistente IA 24/7',
    body: 'Preguntale lo que necesites en lenguaje natural y te responde con tus datos.',
  },
];

export function Login({ onSuccess }: LoginProps) {
  const [user, setUser] = useState('luis');
  const [pass, setPass] = useState('Nobel2026');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      if (user === 'luis' && pass === 'Nobel2026') {
        onSuccess();
      } else {
        setError('Credenciales incorrectas. Usá las del demo.');
        setLoading(false);
      }
    }, 600);
  };

  const autofill = () => {
    setUser('luis');
    setPass('Nobel2026');
    setError('');
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] bg-white">
      {/* LEFT — Marketing / value props */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-neutral-50 via-white to-amber-50/30 p-12 xl:p-16 relative overflow-hidden">
        {/* Brand chip */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2.5 rounded-2xl border border-neutral-200/80 bg-white px-3 py-2 shadow-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-white">
              <Building2 className="h-4 w-4" />
            </div>
            <div className="leading-tight pr-1">
              <p className="text-sm font-semibold text-neutral-900">
                Nobel Solutions
              </p>
              <div className="flex items-center gap-1">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
                </span>
                <p className="text-[9px] uppercase tracking-widest text-amber-600 font-bold">
                  Demo Preview
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Hero */}
        <div className="relative z-10 max-w-lg">
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="text-4xl xl:text-5xl font-bold text-neutral-900 leading-[1.05] tracking-tight"
          >
            Tu operación de subcontratistas,
            <span className="block text-amber-500 mt-2">sin caos en WhatsApp.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.16 }}
            className="text-base text-neutral-600 mt-5 leading-relaxed max-w-md"
          >
            Despachá cuadrillas, gestioná calificaciones, generá nómina y exportá a
            QuickBooks — todo en una plataforma diseñada para instaladores de muebles
            de oficina en Austin, TX.
          </motion.p>

          <div className="mt-10 space-y-4">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.24 + i * 0.06 }}
                  className="flex gap-3 items-start"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white border border-neutral-200/70 shadow-sm">
                    <Icon className="h-4 w-4 text-amber-600" />
                  </div>
                  <div className="pt-0.5">
                    <p className="text-sm font-semibold text-neutral-900 leading-tight">
                      {f.title}
                    </p>
                    <p className="text-[13px] text-neutral-600 leading-snug mt-0.5">
                      {f.body}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="relative z-10 flex items-center gap-3"
        >
          <div className="flex -space-x-2">
            {['LL', 'CM', 'SL', 'JH'].map((i, k) => (
              <div
                key={i}
                className="h-7 w-7 rounded-full bg-neutral-900 border-2 border-white flex items-center justify-center text-[10px] font-semibold text-white"
                style={{ zIndex: 4 - k }}
              >
                {i}
              </div>
            ))}
          </div>
          <p className="text-[11px] text-neutral-500">
            <span className="font-semibold text-neutral-700">15 subcontratistas activos</span> y 5
            empresas cliente ya en el sistema.
          </p>
        </motion.div>

        {/* Decorative blobs */}
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-amber-200/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-neutral-200/40 blur-3xl pointer-events-none" />
      </div>

      {/* RIGHT — Login form */}
      <div className="flex items-center justify-center px-4 sm:px-6 py-10 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm"
        >
          {/* Mobile brand header */}
          <div className="flex lg:hidden items-center gap-2.5 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white shadow">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-neutral-900">Nobel Solutions</p>
              <p className="text-[10px] uppercase tracking-widest text-amber-600 font-bold">
                Demo Preview
              </p>
            </div>
          </div>

          {/* Desktop demo badge */}
          <div className="hidden lg:inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 mb-5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
            </span>
            <span className="text-[10px] uppercase tracking-widest text-amber-700 font-bold">
              Demo Preview
            </span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900 tracking-tight">
            Iniciar sesión
          </h1>
          <p className="text-sm text-neutral-500 mt-1.5">
            Ingresá con tus credenciales para ver el panel.
          </p>

          <form onSubmit={submit} className="space-y-3 mt-7">
            <div>
              <Label htmlFor="user" className="text-xs">
                Usuario
              </Label>
              <Input
                id="user"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="luis"
                className="mt-1.5 h-11"
                autoComplete="username"
              />
            </div>
            <div>
              <Label htmlFor="pass" className="text-xs">
                Contraseña
              </Label>
              <Input
                id="pass"
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 h-11"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer select-none">
                <Checkbox checked={remember} onCheckedChange={setRemember} />
                Recordarme
              </label>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-sm text-neutral-700 hover:text-neutral-900 underline-offset-2 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full mt-3 h-12 text-base"
              disabled={loading}
            >
              {loading ? 'Verificando…' : 'Entrar al panel'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 mt-7 mb-4">
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold">
              Demo
            </span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>

          {/* Auto-fill card */}
          <button
            type="button"
            onClick={autofill}
            className="group w-full flex items-center justify-between gap-3 rounded-2xl border border-dashed border-amber-300 bg-amber-50/40 p-3 hover:border-amber-500 hover:bg-amber-50 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="text-left leading-tight min-w-0">
                <p className="text-sm font-semibold text-neutral-900">
                  Credenciales demo
                </p>
                <p className="text-[11px] text-neutral-500 font-mono truncate">
                  luis / Nobel2026
                </p>
              </div>
            </div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-amber-700 group-hover:text-amber-900 shrink-0">
              Auto-llenar
            </span>
          </button>

          <p className="text-center text-[11px] text-neutral-400 mt-7">
            ¿Querés tu propia versión?{' '}
            <a
              href="https://wa.me/5491139375146?text=Quiero%20mi%20versi%C3%B3n%20del%20panel%20Nobel%20Solutions"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-amber-700 hover:text-amber-900 underline-offset-2 hover:underline"
            >
              Hablemos por WhatsApp →
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
