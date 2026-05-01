export enum AppRoute {
  Home = '',
  Analytics = 'analytics',
  AnalyticsMfe = 'analytics-mfe',
}

export enum AppRouteTitle {
  Home = 'CapitalFlow — Home',
  Analytics = 'CapitalFlow — Analytics',
  AnalyticsMfe = 'CapitalFlow — Analytics MFE',
}

export const ROUTE_WILDCARD = '**';
export const ROUTE_PATH_SEPARATOR = '/';

export function toRouteLink(path: AppRoute): string {
  return `${ROUTE_PATH_SEPARATOR}${path}`;
}
