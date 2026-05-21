import type { TourStep } from '@/components/Tour';

export const ADMIN_TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Bienvenido, Luis',
    body:
      'Te muestro tu plataforma en menos de 60 segundos. Vas a ver dónde encontrar todo y cómo se conecta. Podés saltar el tour cuando quieras o repetirlo desde el botón ✨ Tour de la barra superior.',
    placement: 'center',
  },
  {
    id: 'sidebar',
    title: 'Tu navegación principal',
    body:
      'Las 4 secciones de tu panel: Dashboard (visión general), Despacho (operación diaria), Subcontratistas (tu red) y Reportes (pagos y facturación). Toda tu operación, un click cada una.',
    target: 'sidebar-nav',
    placement: 'right',
  },
  {
    id: 'switch-role',
    title: 'Cambiá entre los 3 paneles',
    body:
      'Tu plataforma tiene 3 vistas distintas: la tuya (admin), la que ven tus empresas cliente al publicar órdenes, y la que ven los trabajadores en el sitio. Cambiá de panel desde acá cuando quieras.',
    target: 'switch-role',
    placement: 'right',
  },
  {
    id: 'dispatch',
    title: 'Panel de Despacho · tu corazón operativo',
    body:
      'El reemplazo total de los grupos de WhatsApp. Cada orden con su estado, los trabajadores asignados, el timeline de la cuadrilla y las acciones — todo en tiempo real, sin perder mensajes.',
    target: 'dispatch-list',
    view: 'admin.orders',
    placement: 'right',
  },
  {
    id: 'workers',
    title: 'Tu red de subcontratistas',
    body:
      'Toda tu cuadrilla con disponibilidad, especialidades y calificación. Click en "Perfil" abre el detalle con ratings desglosados (puntualidad, actitud, aptitud, uniformidad, comportamiento) y reseñas de empresas.',
    target: 'workers-table',
    view: 'admin.workers',
    placement: 'top',
  },
  {
    id: 'reports',
    title: 'Nómina y exportación a QuickBooks',
    body:
      'Horas trabajadas por semana, ingresos por empresa cliente, ranking de subcontratistas. Un botón exporta todo a QuickBooks — se terminó el Excel a mano.',
    target: 'reports-tabs',
    view: 'admin.reports',
    placement: 'bottom',
  },
  {
    id: 'cta',
    title: '¿Te gustó lo que ves?',
    body:
      'Este botón abre WhatsApp directo con nosotros. Cuando quieras avanzar y arrancar el desarrollo real, mandanos un mensaje y vamos.',
    target: 'whatsapp-cta',
    placement: 'right',
  },
  {
    id: 'done',
    title: '¡Listo! Explorá libremente.',
    body:
      'Eso fue todo. La app es 100% navegable, tocá cualquier cosa, abrí cualquier orden, mirá los perfiles. Si querés repetir el tour, dale al botón ✨ Tour en la barra superior.',
    placement: 'center',
  },
];
