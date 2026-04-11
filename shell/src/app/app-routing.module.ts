import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

// Definición de rutas del Shell (HOST)
const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    // Ruta con carga diferida hacia el micro-frontend de Analytics
    path: 'analytics',
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
