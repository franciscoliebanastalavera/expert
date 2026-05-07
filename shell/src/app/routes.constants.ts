export enum AppRoute {
  Home = '',
  Transactions = 'transactions',
  Analytics = 'analytics',
  Payments = 'payments',
  Admin = 'admin',
  DesignSystem = 'design-system',
  AdminTemplates = 'admin/templates',
  AdminReports = 'admin/reports',
  AdminDocuments = 'admin/documents',
  SearchDemo = 'search-demo',
}

export enum AppRouteTitle {
  Home = 'CapitalFlow - Home',
  Transactions = 'CapitalFlow - Transactions',
  Analytics = 'CapitalFlow - Analytics',
  Payments = 'CapitalFlow - Payments',
  Admin = 'CapitalFlow - Security demos',
  DesignSystem = 'CapitalFlow - Design System',
  AdminTemplates = 'CapitalFlow - Admin - Report templates',
  AdminReports = 'CapitalFlow - Admin - PDF reports',
  AdminDocuments = 'CapitalFlow - Admin - Documents',
  SearchDemo = 'CapitalFlow - Search demo',
}

export const ROUTE_WILDCARD = '**';
export const ROUTE_PATH_SEPARATOR = '/';

export function toRouteLink(path: AppRoute): string {
  return `${ROUTE_PATH_SEPARATOR}${path}`;
}
