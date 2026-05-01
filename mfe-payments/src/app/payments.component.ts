import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapMetricCardComponent } from '@capitalflow/shared-ui/lib/cap-metric-card/cap-metric-card.component';
import { CapTableComponent } from '@capitalflow/shared-ui/lib/cap-table/cap-table.component';
import { CapCellTemplateDirective } from '@capitalflow/shared-ui/lib/cap-table/cap-cell-template.directive';
import { CapStatusBadgeComponent } from '@capitalflow/shared-ui/lib/cap-status-badge/cap-status-badge.component';
import { Payment, PaymentStatus } from './payments.types';
import {
  AMOUNT_CURRENCY_SUFFIX,
  AMOUNT_FRACTION_DIGITS,
  AMOUNT_LOCALE,
  ICON_METRIC_ALERT,
  ICON_METRIC_PAYMENTS,
  ICON_METRIC_RECONCILIATION,
  KPI_AVG_TIME_VALUE,
  KPI_AVG_TIME_VARIATION,
  KPI_PENDING_VALUE,
  KPI_PENDING_VARIATION,
  KPI_VOLUME_VALUE,
  KPI_VOLUME_VARIATION,
  PAYMENTS_MOCK,
  PAYMENT_STATUS_KIND,
  PAYMENT_STATUS_LABEL,
  PAYMENT_TABLE_COLUMNS,
} from './payments.constants';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [
    CommonModule,
    CapMetricCardComponent,
    CapTableComponent,
    CapCellTemplateDirective,
    CapStatusBadgeComponent,
  ],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class PaymentsComponent {
  readonly payments: readonly Payment[] = PAYMENTS_MOCK;
  readonly columns = PAYMENT_TABLE_COLUMNS;

  readonly volumeValue = KPI_VOLUME_VALUE;
  readonly volumeVariation = KPI_VOLUME_VARIATION;
  readonly pendingValue = KPI_PENDING_VALUE;
  readonly pendingVariation = KPI_PENDING_VARIATION;
  readonly avgTimeValue = KPI_AVG_TIME_VALUE;
  readonly avgTimeVariation = KPI_AVG_TIME_VARIATION;

  readonly iconVolume = ICON_METRIC_PAYMENTS;
  readonly iconPending = ICON_METRIC_ALERT;
  readonly iconAvgTime = ICON_METRIC_RECONCILIATION;

  readonly statusLabel = PAYMENT_STATUS_LABEL;
  readonly statusKind = PAYMENT_STATUS_KIND;

  formatAmount(value: number): string {
    return `${value.toLocaleString(AMOUNT_LOCALE, {
      minimumFractionDigits: AMOUNT_FRACTION_DIGITS,
      maximumFractionDigits: AMOUNT_FRACTION_DIGITS,
      useGrouping: true,
    })}${AMOUNT_CURRENCY_SUFFIX}`;
  }

  asStatus(value: unknown): PaymentStatus {
    return value as PaymentStatus;
  }
}
