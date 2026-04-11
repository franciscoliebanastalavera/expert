import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardMetric, DashboardTab, DashboardOperation } from '../core/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  tabActiva = 'resumen';

  metricas: DashboardMetric[] = [
    {
      titulo: 'HOME.METRICS.TREASURY.TITLE',
      valor: '€2.450.000',
      variacion: '+12.5%',
      icono: '🏦',
      positivo: true,
      descripcion: 'HOME.METRICS.TREASURY.DESC',
      ruta: '/analytics',
    },
    {
      titulo: 'HOME.METRICS.PAYMENTS.TITLE',
      valor: '€380.000',
      variacion: '-8.3%',
      icono: '💳',
      positivo: true,
      descripcion: 'HOME.METRICS.PAYMENTS.DESC',
      ruta: '/analytics',
    },
    {
      titulo: 'HOME.METRICS.RECONCILIATION.TITLE',
      valor: '94.2%',
      variacion: '+3.1%',
      icono: '✅',
      positivo: true,
      descripcion: 'HOME.METRICS.RECONCILIATION.DESC',
      ruta: '/analytics',
    },
    {
      titulo: 'HOME.METRICS.ALERTS.TITLE',
      valor: '3',
      variacion: '+2',
      icono: '⚠️',
      positivo: false,
      descripcion: 'HOME.METRICS.ALERTS.DESC',
      ruta: '/analytics',
    },
  ];

  tabs: DashboardTab[] = [
    { id: 'resumen', label: 'HOME.TABS.SUMMARY' },
    { id: 'tesoreria', label: 'HOME.TABS.TREASURY' },
    { id: 'pagos', label: 'HOME.TABS.PAYMENTS' },
    { id: 'compliance', label: 'HOME.TABS.COMPLIANCE' },
  ];

  ultimasOperaciones: DashboardOperation[] = [
    { tipo: 'Transferencia SEPA', importe: '€45.200', fecha: '11/04/2026', estado: 'Completada', iban: 'ES9121000418450200051332' },
    { tipo: 'Pago Nóminas', importe: '€128.500', fecha: '10/04/2026', estado: 'Procesando', iban: 'ES7620770024003102575766' },
    { tipo: 'Cobro Factura', importe: '€15.800', fecha: '10/04/2026', estado: 'Completada', iban: 'ES0049001822162211067891' },
    { tipo: 'Transferencia Internacional', importe: '€92.000', fecha: '09/04/2026', estado: 'Pendiente', iban: 'DE89370400440532013000' },
    { tipo: 'Domiciliación', importe: '€3.200', fecha: '09/04/2026', estado: 'Completada', iban: 'FR7630006000011234567890189' },
  ];
}
