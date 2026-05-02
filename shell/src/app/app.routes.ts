import { Routes } from '@angular/router';
import { AppRoute, AppRouteTitle, ROUTE_WILDCARD } from './routes.constants';

export const routes: Routes = [
  {
    path: AppRoute.Home,
    title: AppRouteTitle.Home,
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: AppRoute.Analytics,
    title: AppRouteTitle.Analytics,
    loadComponent: () =>
      import('./analytics/analytics.component').then((m) => m.AnalyticsComponent),
  },
  {
    path: AppRoute.AnalyticsMfe,
    title: AppRouteTitle.AnalyticsMfe,
    loadComponent: () =>
      import('./analytics-wrapper/analytics-wrapper.component').then(
        (m) => m.AnalyticsWrapperComponent
      ),
  },
  {
    path: AppRoute.PaymentsMfe,
    title: AppRouteTitle.PaymentsMfe,
    loadComponent: () =>
      import('./payments-wrapper/payments-wrapper.component').then(
        (m) => m.PaymentsWrapperComponent
      ),
  },
  { path: ROUTE_WILDCARD, redirectTo: AppRoute.Home },
];
