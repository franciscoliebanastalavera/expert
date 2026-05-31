import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ViewEncapsulation,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import {
  CapCellTemplateDirective,
  CapMetricCardComponent,
  CapStatusBadgeComponent,
  CapTableColumn,
  CapTableComponent,
} from '@capitalflow/shared-ui';
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
  PAYMENT_TABLE_COLUMNS,
} from './payments.constants';
import { PAYMENTS_I18N, PaymentsLang, detectLang } from './payments.i18n';

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
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  // Language is driven by the shell, which updates <html lang> on toggle.
  // Same contract the analytics MFE already follows, so no shell change is needed.
  private readonly lang = signal<PaymentsLang>(detectLang(this.document.documentElement.lang));
  readonly t = computed(() => PAYMENTS_I18N[this.lang()]);

  readonly payments: readonly Payment[] = PAYMENTS_MOCK;
  readonly columns = computed<CapTableColumn[]>(() => {
    const labels = this.t().columns;
    return PAYMENT_TABLE_COLUMNS.map((column) => ({
      ...column,
      label: labels[column.key as keyof typeof labels] ?? column.label,
    }));
  });

  readonly volumeValue = KPI_VOLUME_VALUE;
  readonly volumeVariation = KPI_VOLUME_VARIATION;
  readonly pendingValue = KPI_PENDING_VALUE;
  readonly pendingVariation = KPI_PENDING_VARIATION;
  readonly avgTimeValue = KPI_AVG_TIME_VALUE;
  readonly avgTimeVariation = KPI_AVG_TIME_VARIATION;

  readonly iconVolume = ICON_METRIC_PAYMENTS;
  readonly iconPending = ICON_METRIC_ALERT;
  readonly iconAvgTime = ICON_METRIC_RECONCILIATION;

  readonly statusKind = PAYMENT_STATUS_KIND;

  constructor() {
    const observer = new MutationObserver(() => {
      this.lang.set(detectLang(this.document.documentElement.lang));
    });
    observer.observe(this.document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

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
