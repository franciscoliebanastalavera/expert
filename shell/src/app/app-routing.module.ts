import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Definición de rutas del Shell (HOST)
const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    // Ruta con carga diferida hacia la página de Analytics
    path: 'analytics',
    loadComponent: () =>
      import('./analytics/analytics.component').then((m) => m.AnalyticsComponent),
  },
  {
    // Ruta con carga diferida hacia el micro-frontend de Analytics (React)
    path: 'analytics-mfe',
    loadChildren: () =>
      import('./analytics-wrapper/analytics-wrapper.module').then(
        (m) => m.AnalyticsWrapperModule
      ),
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
