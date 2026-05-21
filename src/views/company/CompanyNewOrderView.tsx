import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  MapPin,
  CalendarClock,
  Users,
  FileText,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { WORK_TYPE_LABEL } from '@/data/mockData';
import type { WorkType } from '@/data/mockData';

export function CompanyNewOrderView() {
  const [workType, setWorkType] = useState<WorkType>('cubicle_install');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('2026-05-25');
  const [time, setTime] = useState('08:00');
  const [workers, setWorkers] = useState(4);
  const [reqEnglish, setReqEnglish] = useState(false);
  const [reqId, setReqId] = useState(true);
  const [reqTools, setReqTools] = useState(false);
  const [reqCert, setReqCert] = useState(false);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState<{ number: string } | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const number = `NS-2026-0${Math.floor(Math.random() * 900) + 100}`;
    setSubmitted({ number });
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto mt-10"
      >
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mb-4">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold text-neutral-900">
            ¡Orden publicada con éxito!
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
            Nobel Solutions fue notificado y está armando la cuadrilla. Recibirás
            updates en tiempo real a medida que confirmen los trabajadores.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white border border-neutral-200/70 px-4 py-2.5 shadow-sm">
            <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold">
              N° de orden
            </span>
            <span className="text-base font-bold font-mono text-neutral-900">
              {submitted.number}
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button variant="outline" onClick={() => setSubmitted(null)}>
              Publicar otra
            </Button>
            <Button>
              Ver mis órdenes
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-2xl border border-neutral-200/70 bg-white shadow-sm">
        <div className="px-6 py-5 border-b border-neutral-200/70">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
              Despacho automático
            </p>
          </div>
          <h2 className="text-lg font-semibold text-neutral-900 mt-1">
            Publicar nueva orden
          </h2>
          <p className="text-xs text-muted-foreground">
            Llenando este formulario, Nobel Solutions arranca a buscar la cuadrilla en minutos.
          </p>
        </div>

        <form onSubmit={submit} className="p-6 space-y-5">
          {/* Work type */}
          <div>
            <Label className="flex items-center gap-1.5 mb-1.5">
              <FileText className="h-3.5 w-3.5 text-neutral-400" />
              Tipo de trabajo
            </Label>
            <Select value={workType} onValueChange={(v) => setWorkType(v as WorkType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(WORK_TYPE_LABEL) as WorkType[]).map((k) => (
                  <SelectItem key={k} value={k}>
                    {WORK_TYPE_LABEL[k]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Address */}
          <div>
            <Label htmlFor="addr" className="flex items-center gap-1.5 mb-1.5">
              <MapPin className="h-3.5 w-3.5 text-neutral-400" />
              Dirección en Austin TX
            </Label>
            <Input
              id="addr"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="500 W 2nd St, Floor 14"
              required
            />
          </div>

          {/* Date / Time / Workers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Label htmlFor="date" className="flex items-center gap-1.5 mb-1.5">
                <CalendarClock className="h-3.5 w-3.5 text-neutral-400" />
                Fecha
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="time" className="mb-1.5">
                Hora
              </Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="workers" className="flex items-center gap-1.5 mb-1.5">
                <Users className="h-3.5 w-3.5 text-neutral-400" />
                Trabajadores
              </Label>
              <Input
                id="workers"
                type="number"
                min={1}
                max={20}
                value={workers}
                onChange={(e) => setWorkers(parseInt(e.target.value, 10) || 1)}
              />
            </div>
          </div>

          {/* Requirements */}
          <div>
            <p className="text-sm font-medium text-neutral-700 mb-2">Requisitos</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <RequirementRow
                label="Habla inglés"
                desc="El trabajador podrá comunicarse con tu staff."
                checked={reqEnglish}
                onChange={setReqEnglish}
              />
              <RequirementRow
                label="ID requerido"
                desc="Verificación de identidad obligatoria en sitio."
                checked={reqId}
                onChange={setReqId}
              />
              <RequirementRow
                label="Herramientas propias"
                desc="Trabajadores con herramientas básicas."
                checked={reqTools}
                onChange={setReqTools}
              />
              <RequirementRow
                label="Certificación"
                desc="Trabajos eléctricos/A/V certificados."
                checked={reqCert}
                onChange={setReqCert}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes" className="mb-1.5">Notas adicionales</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Acceso por carga lateral, contacto en sitio Michael Torres ext. 142…"
              rows={4}
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between pt-3 border-t border-neutral-200/70">
            <Badge variant="success">
              <CheckCircle2 className="h-3 w-3" />
              Cotización transparente sin sorpresas
            </Badge>
            <Button type="submit" size="lg">
              Publicar orden
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function RequirementRow({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-2.5 rounded-xl border border-neutral-200/60 bg-neutral-50/40 px-3 py-2.5 cursor-pointer hover:border-neutral-300 transition-colors">
      <Checkbox checked={checked} onCheckedChange={onChange} className="mt-0.5" />
      <div>
        <p className="text-sm font-medium text-neutral-900">{label}</p>
        <p className="text-[11px] text-muted-foreground">{desc}</p>
      </div>
    </label>
  );
}
