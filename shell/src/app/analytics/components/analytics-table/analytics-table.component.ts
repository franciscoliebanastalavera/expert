import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { combineLatest, map } from 'rxjs';
import {
  CapCellTemplateDirective,
  CapDataGridComponent,
  CapStatusBadgeComponent,
  CapStatusBadgeKind,
  CapTableColumn,
} from '@capitalflow/shared-ui';
import { Transaction, TransactionStatus } from '../../../core/models';
import {
  ANALYTICS_GRID_COLUMNS,
  ANALYTICS_GRID_TRANSLATION_KEYS,
  ANALYTICS_STATUS_KIND_MAP,
  ANALYTICS_TABLE_CONFIG,
} from '../../models/analytics.model';

@Component({
  selector: 'app-analytics-table',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    CapDataGridComponent,
    CapCellTemplateDirective,
    CapStatusBadgeComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './analytics-table.component.html',
  styleUrls: ['./analytics-table.component.scss'],
})
export class AnalyticsTableComponent {
  private readonly translate = inject(TranslateService);

  readonly transactions = input<Transaction[]>([]);
  readonly itemSize = ANALYTICS_TABLE_CONFIG.itemSizePx;

  readonly columns = toSignal(
    combineLatest(ANALYTICS_GRID_TRANSLATION_KEYS.map((key) => this.translate.stream(key))).pipe(
      map((labels): CapTableColumn[] =>
        ANALYTICS_GRID_COLUMNS.map((column, index) => ({
          ...column,
          label: labels[index] as string,
        }))
      )
    ),
    { initialValue: [] as CapTableColumn[] }
  );

  formatIban(iban: string): string {
    return iban
      .replace(
        ANALYTICS_TABLE_CONFIG.ibanGroupRegex,
        `$1${ANALYTICS_TABLE_CONFIG.ibanGroupSeparator}`
      )
      .trim();
  }

  formatAmount(importe: number): string {
    const formatted = Math.abs(importe).toLocaleString(ANALYTICS_TABLE_CONFIG.amountFormat.locale, {
      minimumFractionDigits: ANALYTICS_TABLE_CONFIG.amountFormat.fractionDigits,
      maximumFractionDigits: ANALYTICS_TABLE_CONFIG.amountFormat.fractionDigits,
    });
    const sign =
      importe >= 0 ? ANALYTICS_TABLE_CONFIG.positiveSign : ANALYTICS_TABLE_CONFIG.negativeSign;
    return `${sign}${formatted}${ANALYTICS_TABLE_CONFIG.amountFormat.currencySuffix}`;
  }

  statusKind(status: TransactionStatus): CapStatusBadgeKind {
    return ANALYTICS_STATUS_KIND_MAP[status];
  }
}
