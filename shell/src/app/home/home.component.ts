import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  DashboardMetric,
  DashboardOperation,
  DashboardTab,
  DashboardTabId,
  TransactionStatus,
} from '../core/models';

const DEFAULT_TAB: DashboardTabId = DashboardTabId.Summary;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  readonly tabActiva = signal<DashboardTabId>(DEFAULT_TAB);
  readonly dashboardTabId = DashboardTabId;
  readonly transactionStatus = TransactionStatus;

  readonly metricas: DashboardMetric[] = [
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

  readonly tabs: DashboardTab[] = [
    { id: DashboardTabId.Summary, label: 'HOME.TABS.SUMMARY' },
    { id: DashboardTabId.Treasury, label: 'HOME.TABS.TREASURY' },
    { id: DashboardTabId.Payments, label: 'HOME.TABS.PAYMENTS' },
    { id: DashboardTabId.Compliance, label: 'HOME.TABS.COMPLIANCE' },
  ];

  readonly ultimasOperaciones: DashboardOperation[] = [
    { tipo: 'Transferencia SEPA', importe: '€45.200', fecha: '11/04/2026', estado: TransactionStatus.Completed, iban: 'ES9121000418450200051332' },
    { tipo: 'Pago Nóminas', importe: '€128.500', fecha: '10/04/2026', estado: TransactionStatus.Processing, iban: 'ES7620770024003102575766' },
    { tipo: 'Cobro Factura', importe: '€15.800', fecha: '10/04/2026', estado: TransactionStatus.Completed, iban: 'ES0049001822162211067891' },
    { tipo: 'Transferencia Internacional', importe: '€92.000', fecha: '09/04/2026', estado: TransactionStatus.Pending, iban: 'DE89370400440532013000' },
    { tipo: 'Domiciliación', importe: '€3.200', fecha: '09/04/2026', estado: TransactionStatus.Completed, iban: 'FR7630006000011234567890189' },
  ];

  selectTab(id: DashboardTabId): void {
    this.tabActiva.set(id);
  }
}
