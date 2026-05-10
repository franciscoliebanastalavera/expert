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
    path: AppRoute.Transactions,
    title: AppRouteTitle.Transactions,
    loadComponent: () =>
      import('./transactions-wrapper/transactions-wrapper.component').then(
        (m) => m.TransactionsWrapperComponent
      ),
  },
  {
    path: AppRoute.Analytics,
    title: AppRouteTitle.Analytics,
    loadComponent: () =>
      import('./analytics-wrapper/analytics-wrapper.component').then(
        (m) => m.AnalyticsWrapperComponent
      ),
  },
  {
    path: AppRoute.Payments,
    title: AppRouteTitle.Payments,
    loadComponent: () =>
      import('./payments-wrapper/payments-wrapper.component').then(
        (m) => m.PaymentsWrapperComponent
      ),
  },
  {
    path: AppRoute.Admin,
    title: AppRouteTitle.Admin,
    loadComponent: () =>
      import('./admin/admin-landing/admin-landing.component').then(
        (m) => m.AdminLandingComponent
      ),
  },
  {
    path: AppRoute.DesignSystem,
    title: AppRouteTitle.DesignSystem,
    loadComponent: () =>
      import('./design-system/design-system.component').then(
        (m) => m.DesignSystemComponent
      ),
  },
  {
    path: AppRoute.AdminTemplates,
    title: AppRouteTitle.AdminTemplates,
    loadComponent: () =>
      import('./admin/wysiwyg-editor/wysiwyg-editor.component').then(
        (m) => m.WysiwygEditorComponent
      ),
  },
  {
    path: AppRoute.AdminReports,
    title: AppRouteTitle.AdminReports,
    loadComponent: () =>
      import('./admin/pdf-viewer/pdf-viewer.component').then(
        (m) => m.PdfViewerComponent
      ),
  },
  {
    path: AppRoute.AdminDocuments,
    title: AppRouteTitle.AdminDocuments,
    loadComponent: () =>
      import('./admin/document-uploads/document-uploads.component').then(
        (m) => m.DocumentUploadsComponent
      ),
  },
  {
    path: AppRoute.AdminComments,
    title: AppRouteTitle.AdminComments,
    loadComponent: () =>
      import('./admin/comments-demo/comments-demo.component').then(
        (m) => m.CommentsDemoComponent
      ),
  },
  {
    path: AppRoute.SearchDemo,
    title: AppRouteTitle.SearchDemo,
    loadComponent: () =>
      import('./search-demo/search-demo.component').then(
        (m) => m.SearchDemoComponent
      ),
  },
  { path: ROUTE_WILDCARD, redirectTo: AppRoute.Home },
];
