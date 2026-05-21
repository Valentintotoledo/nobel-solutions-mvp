import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BootSplash } from './components/BootSplash';
import { Login } from './components/Login';
import { Onboarding } from './components/Onboarding';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Tour } from './components/Tour';
import { AIAssistant } from './components/AIAssistant';
import { ADMIN_TOUR_STEPS } from './lib/tourSteps';
import type { Role, ViewKey } from './types';

import { AdminDashboardView } from './views/admin/AdminDashboardView';
import { AdminOrdersView } from './views/admin/AdminOrdersView';
import { AdminWorkersView } from './views/admin/AdminWorkersView';
import { AdminReportsView } from './views/admin/AdminReportsView';
import { CompanyDashboardView } from './views/company/CompanyDashboardView';
import { CompanyNewOrderView } from './views/company/CompanyNewOrderView';
import { CompanyOrdersView } from './views/company/CompanyOrdersView';
import { WorkerDashboardView } from './views/worker/WorkerDashboardView';
import { WorkerOrdersView } from './views/worker/WorkerOrdersView';
import { WorkerCheckinView } from './views/worker/WorkerCheckinView';

type Stage = 'boot' | 'login' | 'onboarding' | 'app';

const TOUR_STORAGE_KEY = 'nobel.tour.seen';

const DEFAULT_VIEW_BY_ROLE: Record<Role, ViewKey> = {
  admin: 'admin.orders',
  company: 'company.dashboard',
  worker: 'worker.dashboard',
};

const PAGE_META: Record<ViewKey, { title: string; subtitle?: string }> = {
  'admin.dashboard': {
    title: 'Dashboard',
    subtitle: 'Visión general de operaciones · Austin, TX',
  },
  'admin.orders': {
    title: 'Panel de Despacho',
    subtitle: 'Tus órdenes activas en tiempo real',
  },
  'admin.workers': {
    title: 'Subcontratistas',
    subtitle: 'Tu red de trabajadores disponibles',
  },
  'admin.reports': {
    title: 'Reportes & Pagos',
    subtitle: 'Nómina, facturación y exportación a QuickBooks',
  },
  'company.dashboard': {
    title: 'Dashboard',
    subtitle: 'Austin Workspace Solutions · vista cliente',
  },
  'company.new': {
    title: 'Publicar nueva orden',
    subtitle: 'Notificá a Nobel Solutions para arrancar el despacho',
  },
  'company.orders': {
    title: 'Mis órdenes',
    subtitle: 'Historial completo y trabajos activos',
  },
  'worker.dashboard': {
    title: 'Mi día',
    subtitle: 'Carlos Mendoza · Austin, TX',
  },
  'worker.orders': {
    title: 'Órdenes',
    subtitle: 'Asignaciones y trabajos disponibles cerca tuyo',
  },
  'worker.checkin': {
    title: 'Check-in / Out',
    subtitle: 'Registrá tu entrada y salida en sitio',
  },
};

function App() {
  const [stage, setStage] = useState<Stage>('boot');
  const [role, setRole] = useState<Role>('admin');
  const [view, setView] = useState<ViewKey>('admin.orders');
  const [tourOpen, setTourOpen] = useState(false);

  const meta = useMemo(() => PAGE_META[view], [view]);

  const handleSelectRole = (r: Role) => {
    setRole(r);
    setView(DEFAULT_VIEW_BY_ROLE[r]);
    setStage('app');
  };

  const handleSwitchRole = () => {
    setStage('onboarding');
  };

  // Auto-open tour the first time the user lands on the app (admin role)
  useEffect(() => {
    if (stage !== 'app' || role !== 'admin') return;
    if (tourOpen) return;
    const seen = typeof window !== 'undefined' && window.localStorage.getItem(TOUR_STORAGE_KEY);
    if (seen) return;
    const t = setTimeout(() => setTourOpen(true), 700);
    return () => clearTimeout(t);
  }, [stage, role, tourOpen]);

  const closeTour = () => {
    setTourOpen(false);
    try {
      window.localStorage.setItem(TOUR_STORAGE_KEY, '1');
    } catch {
      // ignore (e.g. private mode)
    }
  };

  const startTour = () => {
    // ensure user is in admin role for the tour
    if (role !== 'admin') {
      setRole('admin');
      setView('admin.orders');
    }
    setTourOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <AnimatePresence mode="wait">
        {stage === 'boot' && (
          <motion.div key="boot" exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <BootSplash onDone={() => setStage('login')} />
          </motion.div>
        )}

        {stage === 'login' && (
          <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Login onSuccess={() => setStage('onboarding')} />
          </motion.div>
        )}

        {stage === 'onboarding' && (
          <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Onboarding onSelect={handleSelectRole} />
          </motion.div>
        )}

        {stage === 'app' && (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="flex min-h-screen"
          >
            <Sidebar
              role={role}
              view={view}
              onNavigate={setView}
              onSwitchRole={handleSwitchRole}
            />
            <div className="flex-1 min-w-0 flex flex-col">
              <TopBar
                title={meta.title}
                subtitle={meta.subtitle}
                onStartTour={startTour}
              />
              <main className="flex-1 bg-neutral-50/40">
                <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-6 md:py-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={view}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ViewSwitch view={view} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </main>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Assistant floating chat */}
      {stage === 'app' && <AIAssistant />}

      {/* Guided tour overlay */}
      {stage === 'app' && (
        <Tour
          steps={ADMIN_TOUR_STEPS}
          open={tourOpen}
          onClose={closeTour}
          onNavigate={setView}
          currentView={view}
        />
      )}
    </div>
  );
}

function ViewSwitch({ view }: { view: ViewKey }) {
  switch (view) {
    case 'admin.dashboard':
      return <AdminDashboardView />;
    case 'admin.orders':
      return <AdminOrdersView />;
    case 'admin.workers':
      return <AdminWorkersView />;
    case 'admin.reports':
      return <AdminReportsView />;
    case 'company.dashboard':
      return <CompanyDashboardView />;
    case 'company.new':
      return <CompanyNewOrderView />;
    case 'company.orders':
      return <CompanyOrdersView />;
    case 'worker.dashboard':
      return <WorkerDashboardView />;
    case 'worker.orders':
      return <WorkerOrdersView />;
    case 'worker.checkin':
      return <WorkerCheckinView />;
    default:
      return null;
  }
}

export default App;
