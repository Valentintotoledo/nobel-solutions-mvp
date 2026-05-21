export type Role = 'admin' | 'company' | 'worker';

export type ViewKey =
  | 'admin.dashboard'
  | 'admin.orders'
  | 'admin.workers'
  | 'admin.reports'
  | 'company.dashboard'
  | 'company.new'
  | 'company.orders'
  | 'worker.dashboard'
  | 'worker.orders'
  | 'worker.checkin';
