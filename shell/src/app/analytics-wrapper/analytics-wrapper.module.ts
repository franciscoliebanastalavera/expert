import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AnalyticsWrapperComponent } from './analytics-wrapper.component';

// Módulo con carga diferida (lazy) para el micro-frontend de Analytics
const routes: Routes = [{ path: '', component: AnalyticsWrapperComponent }];

@NgModule({
  declarations: [AnalyticsWrapperComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class AnalyticsWrapperModule {}
