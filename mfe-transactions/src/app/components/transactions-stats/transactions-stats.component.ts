import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapStatCardComponent } from '@capitalflow/shared-ui';
import { formatAmount } from '../../utils/format-amount.util';
import {
  TRANSACTIONS_EMPTY_STATS,
  TRANSACTIONS_STATS_AMOUNT_FORMAT,
} from '../../models';
import { TransactionsMetricsService } from '../../services/transactions-metrics.service';
import { TRANSACTIONS_I18N } from '../../transactions.text';
import { LanguageStore } from '../../i18n/language.store';

@Component({
  selector: 'app-transactions-stats',
  standalone: true,
  imports: [CommonModule, CapStatCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './transactions-stats.component.html',
  styleUrls: ['./transactions-stats.component.scss'],
})
export class TransactionsStatsComponent {
  private readonly metricsService = inject(TransactionsMetricsService);
  private readonly langStore = inject(LanguageStore);

  readonly datasetTotal = input<number>(TRANSACTIONS_EMPTY_STATS.total);
  readonly total = input<number>(TRANSACTIONS_EMPTY_STATS.total);
  readonly income = input<number>(TRANSACTIONS_EMPTY_STATS.income);
  readonly expenses = input<number>(TRANSACTIONS_EMPTY_STATS.expenses);
  readonly domNodeCount = this.metricsService.domNodeCount;
  readonly lastFilterMs = this.metricsService.lastFilterMs;
  get text() {
    return TRANSACTIONS_I18N[this.langStore.lang()];
  }

  formatAmount(amount: number): string {
    return formatAmount(amount, {
      locale: TRANSACTIONS_STATS_AMOUNT_FORMAT.locale,
      fractionDigits: TRANSACTIONS_STATS_AMOUNT_FORMAT.fractionDigits,
      currencySuffix: TRANSACTIONS_STATS_AMOUNT_FORMAT.currencySuffix,
      useAbs: true,
    });
  }
}
