// =============================================================================
// Mock Data — Nobel Solutions Dispatch Platform
// Austin, TX — datos realistas para previsualización navegable
// =============================================================================

export type WorkerStatus = 'available' | 'busy' | 'inactive';
export type OrderStatus =
  | 'new'
  | 'assigning'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';
export type WorkType =
  | 'cubicle_install'
  | 'furniture_assembly'
  | 'av_install'
  | 'general_assembly'
  | 'office_setup';
export type RatingCategory =
  | 'punctuality'
  | 'attitude'
  | 'aptitude'
  | 'uniform'
  | 'behavior';

export type ConfirmationStatus = 'confirmed' | 'pending' | 'rejected';

export const WORK_TYPE_LABEL: Record<WorkType, string> = {
  cubicle_install: 'Instalación de cubículos',
  furniture_assembly: 'Armado de muebles',
  av_install: 'Instalación A/V',
  general_assembly: 'Montaje general',
  office_setup: 'Setup completo de oficina',
};

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  new: 'Nueva',
  assigning: 'Asignando',
  confirmed: 'Confirmada',
  in_progress: 'En progreso',
  completed: 'Completada',
  cancelled: 'Cancelada',
};

export const RATING_CATEGORY_LABEL: Record<RatingCategory, string> = {
  punctuality: 'Puntualidad',
  attitude: 'Actitud',
  aptitude: 'Aptitud',
  uniform: 'Uniformidad',
  behavior: 'Comportamiento',
};

export type Worker = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  specialties: string[];
  status: WorkerStatus;
  ratingAvg: number;
  ratings: Record<RatingCategory, number>;
  completedJobs: number;
  hoursThisMonth: number;
  hourlyRate: number;
  city: 'Austin, TX';
  joinedAt: string;
};

export type Company = {
  id: string;
  name: string;
  contactName: string;
  contactEmail: string;
  phone: string;
  address: string;
  city: string;
  activeOrders: number;
  completedOrders: number;
};

export type AssignedWorker = {
  workerId: string;
  status: ConfirmationStatus;
  assignedAt: string;
  confirmedAt: string | null;
};

export type WorkOrder = {
  id: string;
  orderNumber: string;
  companyId: string;
  workType: WorkType;
  address: string;
  city: string;
  scheduledAt: string;
  workersNeeded: number;
  assignedWorkers: AssignedWorker[];
  status: OrderStatus;
  notes: string;
  requiresEnglish: boolean;
  requiresId: boolean;
  requiresOwnTools: boolean;
  requiresCertification: boolean;
  estimatedHours: number;
  ratePerHour: number;
  createdAt: string;
};

export type CheckIn = {
  id: string;
  workerId: string;
  orderId: string;
  checkInAt: string;
  checkOutAt: string | null;
  hoursWorked: number | null;
};

export type WorkerRating = {
  id: string;
  workerId: string;
  orderId: string;
  companyId: string;
  ratings: Record<RatingCategory, number>;
  comment: string;
  createdAt: string;
};

// =============================================================================
// COMPANIES (5)
// =============================================================================

export const companies: Company[] = [
  {
    id: 'co_1',
    name: 'Austin Workspace Solutions',
    contactName: 'Michael Torres',
    contactEmail: 'michael@austinworkspace.com',
    phone: '+1 (512) 555-0142',
    address: '500 W 2nd St',
    city: 'Downtown Austin, TX',
    activeOrders: 3,
    completedOrders: 28,
  },
  {
    id: 'co_2',
    name: 'Capital City Office Interiors',
    contactName: 'Jennifer Walsh',
    contactEmail: 'jwalsh@capitalcityoffice.com',
    phone: '+1 (512) 555-0188',
    address: '1100 S Lamar Blvd',
    city: 'South Austin, TX',
    activeOrders: 2,
    completedOrders: 41,
  },
  {
    id: 'co_3',
    name: 'Texas Corporate Furnishings',
    contactName: 'David Ramirez',
    contactEmail: 'd.ramirez@txcorpfurnish.com',
    phone: '+1 (512) 555-0233',
    address: '11801 Domain Blvd',
    city: 'The Domain, Austin TX',
    activeOrders: 4,
    completedOrders: 53,
  },
  {
    id: 'co_4',
    name: 'Lone Star Office Design',
    contactName: 'Sarah Mitchell',
    contactEmail: 'sarah@lonestaroffice.com',
    phone: '+1 (512) 555-0319',
    address: '1335 E Whitestone Blvd',
    city: 'Cedar Park, TX',
    activeOrders: 1,
    completedOrders: 19,
  },
  {
    id: 'co_5',
    name: 'ATX Business Environments',
    contactName: 'Robert Chen',
    contactEmail: 'rchen@atxbusiness.com',
    phone: '+1 (512) 555-0467',
    address: '2100 N Mays St',
    city: 'Round Rock, TX',
    activeOrders: 2,
    completedOrders: 34,
  },
];

// =============================================================================
// WORKERS (15) — nombres hispanos de Austin TX
// =============================================================================

const SPECIALTIES_POOL = [
  'Instalación',
  'Armado',
  'Eléctrica',
  'A/V',
  'Carpintería',
  'Plomería',
  'Pintura',
  'Logística',
];

export const workers: Worker[] = [
  {
    id: 'w_1',
    firstName: 'Carlos',
    lastName: 'Mendoza',
    phone: '+1 (512) 555-1101',
    email: 'cmendoza@nobel.work',
    specialties: ['Instalación', 'Armado', 'A/V'],
    status: 'busy',
    ratingAvg: 4.9,
    ratings: { punctuality: 5, attitude: 4.9, aptitude: 4.9, uniform: 4.8, behavior: 5 },
    completedJobs: 87,
    hoursThisMonth: 72,
    hourlyRate: 24,
    city: 'Austin, TX',
    joinedAt: '2024-03-15T10:00:00Z',
  },
  {
    id: 'w_2',
    firstName: 'José',
    lastName: 'Hernández',
    phone: '+1 (512) 555-1102',
    email: 'jhernandez@nobel.work',
    specialties: ['Eléctrica', 'A/V'],
    status: 'available',
    ratingAvg: 4.8,
    ratings: { punctuality: 4.9, attitude: 4.7, aptitude: 5, uniform: 4.6, behavior: 4.8 },
    completedJobs: 64,
    hoursThisMonth: 58,
    hourlyRate: 26,
    city: 'Austin, TX',
    joinedAt: '2024-05-02T10:00:00Z',
  },
  {
    id: 'w_3',
    firstName: 'Miguel',
    lastName: 'Reyes',
    phone: '+1 (512) 555-1103',
    email: 'mreyes@nobel.work',
    specialties: ['Instalación', 'Carpintería'],
    status: 'available',
    ratingAvg: 4.7,
    ratings: { punctuality: 4.8, attitude: 4.7, aptitude: 4.7, uniform: 4.5, behavior: 4.8 },
    completedJobs: 52,
    hoursThisMonth: 48,
    hourlyRate: 22,
    city: 'Austin, TX',
    joinedAt: '2024-06-19T10:00:00Z',
  },
  {
    id: 'w_4',
    firstName: 'Antonio',
    lastName: 'García',
    phone: '+1 (512) 555-1104',
    email: 'agarcia@nobel.work',
    specialties: ['Armado', 'Logística'],
    status: 'busy',
    ratingAvg: 4.6,
    ratings: { punctuality: 4.5, attitude: 4.6, aptitude: 4.7, uniform: 4.7, behavior: 4.5 },
    completedJobs: 41,
    hoursThisMonth: 64,
    hourlyRate: 21,
    city: 'Austin, TX',
    joinedAt: '2024-07-11T10:00:00Z',
  },
  {
    id: 'w_5',
    firstName: 'Pedro',
    lastName: 'Castillo',
    phone: '+1 (512) 555-1105',
    email: 'pcastillo@nobel.work',
    specialties: ['Instalación', 'Plomería'],
    status: 'available',
    ratingAvg: 4.5,
    ratings: { punctuality: 4.4, attitude: 4.6, aptitude: 4.5, uniform: 4.5, behavior: 4.6 },
    completedJobs: 38,
    hoursThisMonth: 32,
    hourlyRate: 22,
    city: 'Austin, TX',
    joinedAt: '2024-08-22T10:00:00Z',
  },
  {
    id: 'w_6',
    firstName: 'Luis',
    lastName: 'Morales',
    phone: '+1 (512) 555-1106',
    email: 'lmorales@nobel.work',
    specialties: ['A/V', 'Eléctrica'],
    status: 'available',
    ratingAvg: 4.9,
    ratings: { punctuality: 5, attitude: 4.8, aptitude: 5, uniform: 4.8, behavior: 5 },
    completedJobs: 71,
    hoursThisMonth: 80,
    hourlyRate: 28,
    city: 'Austin, TX',
    joinedAt: '2024-02-08T10:00:00Z',
  },
  {
    id: 'w_7',
    firstName: 'Roberto',
    lastName: 'Vega',
    phone: '+1 (512) 555-1107',
    email: 'rvega@nobel.work',
    specialties: ['Carpintería', 'Pintura'],
    status: 'inactive',
    ratingAvg: 4.2,
    ratings: { punctuality: 4, attitude: 4.3, aptitude: 4.4, uniform: 4.2, behavior: 4.1 },
    completedJobs: 19,
    hoursThisMonth: 20,
    hourlyRate: 20,
    city: 'Austin, TX',
    joinedAt: '2024-09-30T10:00:00Z',
  },
  {
    id: 'w_8',
    firstName: 'Eduardo',
    lastName: 'Flores',
    phone: '+1 (512) 555-1108',
    email: 'eflores@nobel.work',
    specialties: ['Instalación', 'Armado'],
    status: 'available',
    ratingAvg: 4.7,
    ratings: { punctuality: 4.8, attitude: 4.6, aptitude: 4.7, uniform: 4.7, behavior: 4.7 },
    completedJobs: 55,
    hoursThisMonth: 56,
    hourlyRate: 23,
    city: 'Austin, TX',
    joinedAt: '2024-04-14T10:00:00Z',
  },
  {
    id: 'w_9',
    firstName: 'Andrés',
    lastName: 'Torres',
    phone: '+1 (512) 555-1109',
    email: 'atorres@nobel.work',
    specialties: ['Logística', 'Instalación'],
    status: 'busy',
    ratingAvg: 4.4,
    ratings: { punctuality: 4.5, attitude: 4.4, aptitude: 4.3, uniform: 4.4, behavior: 4.5 },
    completedJobs: 33,
    hoursThisMonth: 60,
    hourlyRate: 21,
    city: 'Austin, TX',
    joinedAt: '2024-10-05T10:00:00Z',
  },
  {
    id: 'w_10',
    firstName: 'Fernando',
    lastName: 'Díaz',
    phone: '+1 (512) 555-1110',
    email: 'fdiaz@nobel.work',
    specialties: ['Eléctrica', 'Plomería'],
    status: 'available',
    ratingAvg: 4.8,
    ratings: { punctuality: 4.9, attitude: 4.7, aptitude: 4.9, uniform: 4.7, behavior: 4.8 },
    completedJobs: 62,
    hoursThisMonth: 44,
    hourlyRate: 27,
    city: 'Austin, TX',
    joinedAt: '2024-03-28T10:00:00Z',
  },
  {
    id: 'w_11',
    firstName: 'Marco',
    lastName: 'Ruiz',
    phone: '+1 (512) 555-1111',
    email: 'mruiz@nobel.work',
    specialties: ['Carpintería', 'Armado'],
    status: 'available',
    ratingAvg: 4.6,
    ratings: { punctuality: 4.5, attitude: 4.7, aptitude: 4.6, uniform: 4.6, behavior: 4.6 },
    completedJobs: 44,
    hoursThisMonth: 38,
    hourlyRate: 22,
    city: 'Austin, TX',
    joinedAt: '2024-06-01T10:00:00Z',
  },
  {
    id: 'w_12',
    firstName: 'Diego',
    lastName: 'Ortega',
    phone: '+1 (512) 555-1112',
    email: 'dortega@nobel.work',
    specialties: ['Instalación', 'Pintura'],
    status: 'available',
    ratingAvg: 4.3,
    ratings: { punctuality: 4.2, attitude: 4.4, aptitude: 4.3, uniform: 4.3, behavior: 4.3 },
    completedJobs: 27,
    hoursThisMonth: 28,
    hourlyRate: 20,
    city: 'Austin, TX',
    joinedAt: '2024-11-12T10:00:00Z',
  },
  {
    id: 'w_13',
    firstName: 'Sebastián',
    lastName: 'López',
    phone: '+1 (512) 555-1113',
    email: 'slopez@nobel.work',
    specialties: ['A/V', 'Eléctrica', 'Instalación'],
    status: 'available',
    ratingAvg: 5,
    ratings: { punctuality: 5, attitude: 5, aptitude: 5, uniform: 5, behavior: 5 },
    completedJobs: 92,
    hoursThisMonth: 76,
    hourlyRate: 30,
    city: 'Austin, TX',
    joinedAt: '2024-01-20T10:00:00Z',
  },
  {
    id: 'w_14',
    firstName: 'Pablo',
    lastName: 'Jiménez',
    phone: '+1 (512) 555-1114',
    email: 'pjimenez@nobel.work',
    specialties: ['Armado', 'Logística'],
    status: 'inactive',
    ratingAvg: 3.9,
    ratings: { punctuality: 3.7, attitude: 4, aptitude: 4, uniform: 3.9, behavior: 3.9 },
    completedJobs: 12,
    hoursThisMonth: 22,
    hourlyRate: 19,
    city: 'Austin, TX',
    joinedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'w_15',
    firstName: 'Alejandro',
    lastName: 'Vargas',
    phone: '+1 (512) 555-1115',
    email: 'avargas@nobel.work',
    specialties: ['Instalación', 'Carpintería', 'Armado'],
    status: 'available',
    ratingAvg: 4.7,
    ratings: { punctuality: 4.8, attitude: 4.6, aptitude: 4.8, uniform: 4.7, behavior: 4.6 },
    completedJobs: 49,
    hoursThisMonth: 52,
    hourlyRate: 24,
    city: 'Austin, TX',
    joinedAt: '2024-05-25T10:00:00Z',
  },
];

// helper for ISO date
const today = new Date('2026-05-21T08:00:00');
function iso(daysOffset: number, hours = 8, minutes = 0) {
  const d = new Date(today);
  d.setDate(d.getDate() + daysOffset);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
}

// =============================================================================
// WORK ORDERS (12)
// =============================================================================

export const workOrders: WorkOrder[] = [
  // --- NEW (3) ---
  {
    id: 'o_1',
    orderNumber: 'NS-2026-0142',
    companyId: 'co_1',
    workType: 'cubicle_install',
    address: '500 W 2nd St, Floor 14',
    city: 'Downtown Austin, TX',
    scheduledAt: iso(2, 8),
    workersNeeded: 6,
    assignedWorkers: [],
    status: 'new',
    notes: 'Instalación de 24 estaciones de cubículos modelo Herman Miller. Acceso por carga lateral.',
    requiresEnglish: true,
    requiresId: true,
    requiresOwnTools: true,
    requiresCertification: false,
    estimatedHours: 8,
    ratePerHour: 24,
    createdAt: iso(-1, 14, 23),
  },
  {
    id: 'o_2',
    orderNumber: 'NS-2026-0143',
    companyId: 'co_3',
    workType: 'av_install',
    address: '11801 Domain Blvd, Suite 250',
    city: 'The Domain, Austin TX',
    scheduledAt: iso(3, 9),
    workersNeeded: 3,
    assignedWorkers: [],
    status: 'new',
    notes: 'Montaje de pantallas LED para sala de conferencias ejecutiva. Cliente: empresa tech.',
    requiresEnglish: true,
    requiresId: true,
    requiresOwnTools: true,
    requiresCertification: true,
    estimatedHours: 6,
    ratePerHour: 28,
    createdAt: iso(0, 9, 12),
  },
  {
    id: 'o_3',
    orderNumber: 'NS-2026-0144',
    companyId: 'co_2',
    workType: 'furniture_assembly',
    address: '1100 S Lamar Blvd, Building B',
    city: 'South Austin, TX',
    scheduledAt: iso(4, 8),
    workersNeeded: 4,
    assignedWorkers: [],
    status: 'new',
    notes: 'Armado de 48 escritorios elevables y 48 sillas ergonómicas. Material en sitio.',
    requiresEnglish: false,
    requiresId: true,
    requiresOwnTools: false,
    requiresCertification: false,
    estimatedHours: 7,
    ratePerHour: 22,
    createdAt: iso(0, 11, 5),
  },

  // --- ASSIGNING (2) ---
  {
    id: 'o_4',
    orderNumber: 'NS-2026-0145',
    companyId: 'co_5',
    workType: 'office_setup',
    address: '2100 N Mays St, Floor 3',
    city: 'Round Rock, TX',
    scheduledAt: iso(1, 8),
    workersNeeded: 5,
    assignedWorkers: [
      { workerId: 'w_2', status: 'confirmed', assignedAt: iso(-1, 16), confirmedAt: iso(-1, 17, 23) },
      { workerId: 'w_3', status: 'confirmed', assignedAt: iso(-1, 16), confirmedAt: iso(-1, 18, 10) },
      { workerId: 'w_5', status: 'pending', assignedAt: iso(0, 9), confirmedAt: null },
      { workerId: 'w_8', status: 'pending', assignedAt: iso(0, 9), confirmedAt: null },
    ],
    status: 'assigning',
    notes: 'Setup completo: cubículos, escritorios, sillas, A/V de sala chica. Cliente recurrente.',
    requiresEnglish: true,
    requiresId: true,
    requiresOwnTools: true,
    requiresCertification: false,
    estimatedHours: 9,
    ratePerHour: 25,
    createdAt: iso(-2, 10),
  },
  {
    id: 'o_5',
    orderNumber: 'NS-2026-0146',
    companyId: 'co_4',
    workType: 'cubicle_install',
    address: '1335 E Whitestone Blvd',
    city: 'Cedar Park, TX',
    scheduledAt: iso(2, 7, 30),
    workersNeeded: 4,
    assignedWorkers: [
      { workerId: 'w_6', status: 'confirmed', assignedAt: iso(-1, 13), confirmedAt: iso(-1, 14) },
      { workerId: 'w_10', status: 'pending', assignedAt: iso(0, 8), confirmedAt: null },
      { workerId: 'w_12', status: 'rejected', assignedAt: iso(-1, 13), confirmedAt: null },
    ],
    status: 'assigning',
    notes: 'Reemplazo de cubículos antiguos por nuevos de 6x6. 18 estaciones.',
    requiresEnglish: false,
    requiresId: true,
    requiresOwnTools: false,
    requiresCertification: false,
    estimatedHours: 8,
    ratePerHour: 23,
    createdAt: iso(-2, 14),
  },

  // --- CONFIRMED (3) ---
  {
    id: 'o_6',
    orderNumber: 'NS-2026-0147',
    companyId: 'co_1',
    workType: 'general_assembly',
    address: '500 W 2nd St, Mezzanine',
    city: 'Downtown Austin, TX',
    scheduledAt: iso(1, 7),
    workersNeeded: 3,
    assignedWorkers: [
      { workerId: 'w_11', status: 'confirmed', assignedAt: iso(-2, 10), confirmedAt: iso(-2, 11) },
      { workerId: 'w_13', status: 'confirmed', assignedAt: iso(-2, 10), confirmedAt: iso(-2, 10, 45) },
      { workerId: 'w_15', status: 'confirmed', assignedAt: iso(-2, 10), confirmedAt: iso(-2, 12) },
    ],
    status: 'confirmed',
    notes: 'Recepción ejecutiva: mostradores, sillas de espera, lámparas. Estética premium.',
    requiresEnglish: true,
    requiresId: true,
    requiresOwnTools: true,
    requiresCertification: false,
    estimatedHours: 6,
    ratePerHour: 26,
    createdAt: iso(-3, 9),
  },
  {
    id: 'o_7',
    orderNumber: 'NS-2026-0148',
    companyId: 'co_3',
    workType: 'office_setup',
    address: '11801 Domain Blvd, Suite 410',
    city: 'The Domain, Austin TX',
    scheduledAt: iso(2, 8),
    workersNeeded: 5,
    assignedWorkers: [
      { workerId: 'w_2', status: 'confirmed', assignedAt: iso(-1, 9), confirmedAt: iso(-1, 9, 30) },
      { workerId: 'w_6', status: 'confirmed', assignedAt: iso(-1, 9), confirmedAt: iso(-1, 10) },
      { workerId: 'w_8', status: 'confirmed', assignedAt: iso(-1, 9), confirmedAt: iso(-1, 11) },
      { workerId: 'w_10', status: 'confirmed', assignedAt: iso(-1, 9), confirmedAt: iso(-1, 11, 20) },
      { workerId: 'w_15', status: 'confirmed', assignedAt: iso(-1, 9), confirmedAt: iso(-1, 12) },
    ],
    status: 'confirmed',
    notes: 'Nuevo piso de oficinas para startup tech. 32 estaciones + sala de juntas.',
    requiresEnglish: true,
    requiresId: true,
    requiresOwnTools: true,
    requiresCertification: false,
    estimatedHours: 10,
    ratePerHour: 25,
    createdAt: iso(-2, 14),
  },
  {
    id: 'o_8',
    orderNumber: 'NS-2026-0149',
    companyId: 'co_2',
    workType: 'furniture_assembly',
    address: '1100 S Lamar Blvd, Floor 2',
    city: 'South Austin, TX',
    scheduledAt: iso(3, 8),
    workersNeeded: 2,
    assignedWorkers: [
      { workerId: 'w_3', status: 'confirmed', assignedAt: iso(-1, 12), confirmedAt: iso(-1, 13) },
      { workerId: 'w_11', status: 'confirmed', assignedAt: iso(-1, 12), confirmedAt: iso(-1, 13, 30) },
    ],
    status: 'confirmed',
    notes: 'Armado de 16 escritorios bench, herraje en sitio.',
    requiresEnglish: false,
    requiresId: true,
    requiresOwnTools: false,
    requiresCertification: false,
    estimatedHours: 5,
    ratePerHour: 22,
    createdAt: iso(-2, 11),
  },

  // --- IN PROGRESS (2) ---
  {
    id: 'o_9',
    orderNumber: 'NS-2026-0150',
    companyId: 'co_5',
    workType: 'cubicle_install',
    address: '2100 N Mays St, Floor 1',
    city: 'Round Rock, TX',
    scheduledAt: iso(0, 7, 30),
    workersNeeded: 4,
    assignedWorkers: [
      { workerId: 'w_1', status: 'confirmed', assignedAt: iso(-2, 8), confirmedAt: iso(-2, 9) },
      { workerId: 'w_4', status: 'confirmed', assignedAt: iso(-2, 8), confirmedAt: iso(-2, 10) },
      { workerId: 'w_9', status: 'confirmed', assignedAt: iso(-2, 8), confirmedAt: iso(-2, 11) },
      { workerId: 'w_13', status: 'confirmed', assignedAt: iso(-2, 8), confirmedAt: iso(-2, 12) },
    ],
    status: 'in_progress',
    notes: '22 cubículos modelo open-space. Trabajadores ya en sitio desde las 7:45.',
    requiresEnglish: false,
    requiresId: true,
    requiresOwnTools: true,
    requiresCertification: false,
    estimatedHours: 9,
    ratePerHour: 24,
    createdAt: iso(-4, 10),
  },
  {
    id: 'o_10',
    orderNumber: 'NS-2026-0151',
    companyId: 'co_4',
    workType: 'general_assembly',
    address: '1335 E Whitestone Blvd, Suite 200',
    city: 'Cedar Park, TX',
    scheduledAt: iso(0, 8),
    workersNeeded: 3,
    assignedWorkers: [
      { workerId: 'w_4', status: 'confirmed', assignedAt: iso(-2, 9), confirmedAt: iso(-2, 10) },
      { workerId: 'w_9', status: 'confirmed', assignedAt: iso(-2, 9), confirmedAt: iso(-2, 10, 30) },
      { workerId: 'w_15', status: 'confirmed', assignedAt: iso(-2, 9), confirmedAt: iso(-2, 11) },
    ],
    status: 'in_progress',
    notes: 'Reorganización de mobiliario, mudanza interna de oficinas.',
    requiresEnglish: false,
    requiresId: true,
    requiresOwnTools: false,
    requiresCertification: false,
    estimatedHours: 6,
    ratePerHour: 22,
    createdAt: iso(-3, 16),
  },

  // --- COMPLETED (2) ---
  {
    id: 'o_11',
    orderNumber: 'NS-2026-0140',
    companyId: 'co_1',
    workType: 'av_install',
    address: '500 W 2nd St, Auditorio',
    city: 'Downtown Austin, TX',
    scheduledAt: iso(-2, 8),
    workersNeeded: 3,
    assignedWorkers: [
      { workerId: 'w_2', status: 'confirmed', assignedAt: iso(-4, 9), confirmedAt: iso(-4, 10) },
      { workerId: 'w_6', status: 'confirmed', assignedAt: iso(-4, 9), confirmedAt: iso(-4, 10) },
      { workerId: 'w_13', status: 'confirmed', assignedAt: iso(-4, 9), confirmedAt: iso(-4, 10) },
    ],
    status: 'completed',
    notes: 'Instalación A/V auditorio principal. Entregado en tiempo.',
    requiresEnglish: true,
    requiresId: true,
    requiresOwnTools: true,
    requiresCertification: true,
    estimatedHours: 7,
    ratePerHour: 28,
    createdAt: iso(-6, 10),
  },
  {
    id: 'o_12',
    orderNumber: 'NS-2026-0141',
    companyId: 'co_3',
    workType: 'cubicle_install',
    address: '11801 Domain Blvd, Suite 100',
    city: 'The Domain, Austin TX',
    scheduledAt: iso(-3, 7),
    workersNeeded: 5,
    assignedWorkers: [
      { workerId: 'w_1', status: 'confirmed', assignedAt: iso(-5, 10), confirmedAt: iso(-5, 11) },
      { workerId: 'w_3', status: 'confirmed', assignedAt: iso(-5, 10), confirmedAt: iso(-5, 11) },
      { workerId: 'w_8', status: 'confirmed', assignedAt: iso(-5, 10), confirmedAt: iso(-5, 11) },
      { workerId: 'w_11', status: 'confirmed', assignedAt: iso(-5, 10), confirmedAt: iso(-5, 11) },
      { workerId: 'w_15', status: 'confirmed', assignedAt: iso(-5, 10), confirmedAt: iso(-5, 11) },
    ],
    status: 'completed',
    notes: '28 estaciones cubículos. Entregado en 8h, sin incidentes.',
    requiresEnglish: false,
    requiresId: true,
    requiresOwnTools: true,
    requiresCertification: false,
    estimatedHours: 8,
    ratePerHour: 24,
    createdAt: iso(-7, 9),
  },
];

// =============================================================================
// CHECK-INS
// =============================================================================

export const checkIns: CheckIn[] = [
  // active: today, order o_9, worker w_1 (Carlos)
  {
    id: 'ci_1',
    workerId: 'w_1',
    orderId: 'o_9',
    checkInAt: iso(0, 7, 45),
    checkOutAt: null,
    hoursWorked: null,
  },
  // active: today, order o_10, worker w_4
  {
    id: 'ci_2',
    workerId: 'w_4',
    orderId: 'o_10',
    checkInAt: iso(0, 8, 5),
    checkOutAt: null,
    hoursWorked: null,
  },
  // historical
  {
    id: 'ci_3',
    workerId: 'w_2',
    orderId: 'o_11',
    checkInAt: iso(-2, 7, 55),
    checkOutAt: iso(-2, 15, 30),
    hoursWorked: 7.58,
  },
  {
    id: 'ci_4',
    workerId: 'w_1',
    orderId: 'o_12',
    checkInAt: iso(-3, 6, 50),
    checkOutAt: iso(-3, 15, 12),
    hoursWorked: 8.37,
  },
];

// =============================================================================
// RATINGS
// =============================================================================

export const workerRatings: WorkerRating[] = [
  {
    id: 'r_1',
    workerId: 'w_1',
    orderId: 'o_12',
    companyId: 'co_3',
    ratings: { punctuality: 5, attitude: 5, aptitude: 5, uniform: 5, behavior: 5 },
    comment: 'Impecable. Llegó antes que el resto, lideró la cuadrilla y dejó todo perfecto.',
    createdAt: iso(-3, 16),
  },
  {
    id: 'r_2',
    workerId: 'w_2',
    orderId: 'o_11',
    companyId: 'co_1',
    ratings: { punctuality: 5, attitude: 5, aptitude: 5, uniform: 4, behavior: 5 },
    comment: 'Excelente conocimiento de A/V. Resolvió un problema de conexión sin demoras.',
    createdAt: iso(-2, 16),
  },
  {
    id: 'r_3',
    workerId: 'w_6',
    orderId: 'o_11',
    companyId: 'co_1',
    ratings: { punctuality: 5, attitude: 5, aptitude: 5, uniform: 5, behavior: 5 },
    comment: 'Profesional senior, recomiendo siempre que se pueda.',
    createdAt: iso(-2, 16),
  },
  {
    id: 'r_4',
    workerId: 'w_13',
    orderId: 'o_11',
    companyId: 'co_1',
    ratings: { punctuality: 5, attitude: 5, aptitude: 5, uniform: 5, behavior: 5 },
    comment: 'Top. Sebastián siempre cumple, ya es referencia interna.',
    createdAt: iso(-2, 16),
  },
];

// =============================================================================
// HELPERS
// =============================================================================

export function getCompany(id: string) {
  return companies.find((c) => c.id === id);
}

export function getWorker(id: string) {
  return workers.find((w) => w.id === id);
}

export function getOrder(id: string) {
  return workOrders.find((o) => o.id === id);
}

export function getOrdersByCompany(companyId: string) {
  return workOrders.filter((o) => o.companyId === companyId);
}

export function getOrdersByWorker(workerId: string) {
  return workOrders.filter((o) =>
    o.assignedWorkers.some((aw) => aw.workerId === workerId)
  );
}

export function getActiveCheckInForWorker(workerId: string) {
  return checkIns.find(
    (ci) => ci.workerId === workerId && ci.checkOutAt === null
  );
}

export function getRatingsForWorker(workerId: string) {
  return workerRatings.filter((r) => r.workerId === workerId);
}

// =============================================================================
// CHART DATA
// =============================================================================

export const weeklyOrdersChart = [
  { week: 'S-7', orders: 7 },
  { week: 'S-6', orders: 9 },
  { week: 'S-5', orders: 11 },
  { week: 'S-4', orders: 10 },
  { week: 'S-3', orders: 13 },
  { week: 'S-2', orders: 12 },
  { week: 'S-1', orders: 16 },
  { week: 'Hoy', orders: 19 },
];

export const revenueByCompanyChart = [
  { company: 'Austin Workspace', revenue: 18450 },
  { company: 'Capital City', revenue: 14200 },
  { company: 'Texas Corporate', revenue: 22380 },
  { company: 'Lone Star', revenue: 9120 },
  { company: 'ATX Business', revenue: 16700 },
];

// =============================================================================
// DASHBOARD METRICS (admin)
// =============================================================================

export const adminMetrics = {
  activeOrdersThisWeek: 12,
  availableWorkersToday: 10,
  billableHoursThisMonth: 847,
  estimatedRevenueThisMonth: 24380,
  deltaOrders: { value: 18, direction: 'up' as const },
  deltaWorkers: { value: 3, direction: 'up' as const },
  deltaHours: { value: 12, direction: 'up' as const },
  deltaRevenue: { value: 22, direction: 'up' as const },
};
