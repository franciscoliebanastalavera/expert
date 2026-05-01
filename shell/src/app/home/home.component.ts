import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { combineLatest, map } from 'rxjs';
import {
  CapButtonComponent,
  CapCellTemplateDirective,
  CapMetricCardComponent,
  CapStatusBadgeComponent,
  CapStatusBadgeKind,
  CapTableColumn,
  CapTableComponent,
} from '@capitalflow/shared-ui';
import {
  DashboardMetric,
  DashboardOperation,
  DashboardTab,
  DashboardTabId,
  TransactionStatus,
} from '../core/models';
import { IconName } from '../shared/icon/icon.constants';

const DEFAULT_TAB: DashboardTabId = DashboardTabId.Summary;

const STATUS_KIND_MAP: Record<TransactionStatus, CapStatusBadgeKind> = {
  [TransactionStatus.Completed]: 'success',
  [TransactionStatus.Processing]: 'warning',
  [TransactionStatus.Pending]: 'info',
  [TransactionStatus.Rejected]: 'danger',
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    CapButtonComponent,
    CapMetricCardComponent,
    CapTableComponent,
    CapCellTemplateDirective,
    CapStatusBadgeComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  readonly tabActiva = signal<DashboardTabId>(DEFAULT_TAB);
  readonly dashboardTabId = DashboardTabId;

  readonly metricas: DashboardMetric[] = [
    {
      titulo: 'HOME.METRICS.TREASURY.TITLE',
      valor: '€2.450.000',
      variacion: '+12.5%',
      icono: IconName.MetricTreasury,
      positivo: true,
      descripcion: 'HOME.METRICS.TREASURY.DESC',
      ruta: '/analytics',
    },
    {
      titulo: 'HOME.METRICS.PAYMENTS.TITLE',
      valor: '€380.000',
      variacion: '-8.3%',
      icono: IconName.MetricPayments,
      positivo: true,
      descripcion: 'HOME.METRICS.PAYMENTS.DESC',
      ruta: '/analytics',
    },
    {
      titulo: 'HOME.METRICS.RECONCILIATION.TITLE',
      valor: '94.2%',
      variacion: '+3.1%',
      icono: IconName.MetricReconciliation,
      positivo: true,
      descripcion: 'HOME.METRICS.RECONCILIATION.DESC',
      ruta: '/analytics',
    },
    {
      titulo: 'HOME.METRICS.ALERTS.TITLE',
      valor: '3',
      variacion: '+2',
      icono: IconName.MetricAlert,
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

  readonly tableColumns = toSignal(
    combineLatest([
      this.translate.stream('HOME.OPERATIONS.COL_TYPE'),
      this.translate.stream('HOME.OPERATIONS.COL_AMOUNT'),
      this.translate.stream('HOME.OPERATIONS.COL_DATE'),
      this.translate.stream('HOME.OPERATIONS.COL_STATUS'),
      this.translate.stream('HOME.OPERATIONS.COL_IBAN'),
    ]).pipe(
      map(([tipo, importe, fecha, estado, iban]): CapTableColumn[] => [
        { key: 'tipo', label: tipo as string },
        { key: 'importe', label: importe as string, cssClass: 'home-table__importe' },
        { key: 'fecha', label: fecha as string },
        { key: 'estado', label: estado as string },
        { key: 'iban', label: iban as string, cssClass: 'home-table__iban' },
      ])
    ),
    { initialValue: [] as CapTableColumn[] }
  );

  selectTab(id: DashboardTabId): void {
    this.tabActiva.set(id);
  }

  navigateTo(ruta: string): void {
    this.router.navigate([ruta]);
  }

  statusKind(status: TransactionStatus): CapStatusBadgeKind {
    return STATUS_KIND_MAP[status];
  }
}
