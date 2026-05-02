export enum AppRoute {
  Home = '',
  Analytics = 'analytics',
  AnalyticsMfe = 'analytics-mfe',
  PaymentsMfe = 'payments-mfe',
  AdminTemplates = 'admin/templates',
  AdminReports = 'admin/reports',
  AdminDocuments = 'admin/documents',
  SearchDemo = 'search-demo',
}

export enum AppRouteTitle {
  Home = 'CapitalFlow — Home',
  Analytics = 'CapitalFlow — Analytics',
  AnalyticsMfe = 'CapitalFlow — Analytics MFE',
  PaymentsMfe = 'CapitalFlow — Payments MFE',
  AdminTemplates = 'CapitalFlow — Admin · Report templates',
  AdminReports = 'CapitalFlow — Admin · PDF reports',
  AdminDocuments = 'CapitalFlow — Admin · Documents',
  SearchDemo = 'CapitalFlow — Search demo',
}

export const ROUTE_WILDCARD = '**';
export const ROUTE_PATH_SEPARATOR = '/';

export function toRouteLink(path: AppRoute): string {
  return `${ROUTE_PATH_SEPARATOR}${path}`;
}
