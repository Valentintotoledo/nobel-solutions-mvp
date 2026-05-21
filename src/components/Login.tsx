import { motion } from 'framer-motion';
import { Building2, ArrowRight, Info } from 'lucide-react';
import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';

interface LoginProps {
  onSuccess: () => void;
}

export function Login({ onSuccess }: LoginProps) {
  const [user, setUser] = useState('luis');
  const [pass, setPass] = useState('Nobel2026');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm"
      >
        <Card className="rounded-2xl shadow-lg border-neutral-200/80 p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-900 text-white mb-3 shadow">
              <Building2 className="h-6 w-6" />
            </div>
            <h1 className="text-lg font-semibold text-neutral-900">Nobel Solutions</h1>
            <p className="text-[11px] uppercase tracking-widest text-neutral-400 font-semibold mt-0.5">
              Contractor Dispatch
            </p>
          </div>

          <form onSubmit={submit} className="space-y-3">
            <div>
              <Label htmlFor="user" className="text-xs">Usuario</Label>
              <Input
                id="user"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="luis"
                className="mt-1.5"
                autoComplete="username"
              />
            </div>
            <div>
              <Label htmlFor="pass" className="text-xs">Contraseña</Label>
              <Input
                id="pass"
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full mt-1" disabled={loading}>
              {loading ? 'Verificando…' : 'Entrar'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <div className="mt-6 rounded-lg border border-neutral-200/70 bg-neutral-50/60 px-3 py-2 flex items-start gap-2">
            <Info className="h-3.5 w-3.5 text-neutral-400 mt-0.5 shrink-0" />
            <div className="text-[11px] text-neutral-500 leading-relaxed">
              Credenciales demo: <code className="font-mono text-neutral-700">luis</code> /{' '}
              <code className="font-mono text-neutral-700">Nobel2026</code>
            </div>
          </div>
        </Card>
        <p className="text-center text-[10px] text-neutral-400 mt-4 font-mono uppercase tracking-widest">
          Demo Preview · Insights Software
        </p>
      </motion.div>
    </div>
  );
}
