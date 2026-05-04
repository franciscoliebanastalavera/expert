import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CapStatCardComponent } from '@capitalflow/shared-ui';
import {
  ANALYTICS_EMPTY_STATS,
  ANALYTICS_STATS_AMOUNT_FORMAT,
} from '../../models/analytics.model';
import { AnalyticsMetricsService } from '../../services/analytics-metrics.service';

@Component({
  selector: 'app-analytics-stats',
  standalone: true,
  imports: [CommonModule, TranslateModule, CapStatCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './analytics-stats.component.html',
  styleUrls: ['./analytics-stats.component.scss'],
})
export class AnalyticsStatsComponent {
  private readonly metricsService = inject(AnalyticsMetricsService);

  readonly datasetTotal = input<number>(ANALYTICS_EMPTY_STATS.total);
  readonly total = input<number>(ANALYTICS_EMPTY_STATS.total);
  readonly income = input<number>(ANALYTICS_EMPTY_STATS.income);
  readonly expenses = input<number>(ANALYTICS_EMPTY_STATS.expenses);
  readonly domNodeCount = this.metricsService.domNodeCount;
  readonly lastFilterMs = this.metricsService.lastFilterMs;

  formatAmount(amount: number): string {
    const formatted = Math.abs(amount).toLocaleString(ANALYTICS_STATS_AMOUNT_FORMAT.locale, {
      minimumFractionDigits: ANALYTICS_STATS_AMOUNT_FORMAT.fractionDigits,
      maximumFractionDigits: ANALYTICS_STATS_AMOUNT_FORMAT.fractionDigits,
    });
    return `${formatted}${ANALYTICS_STATS_AMOUNT_FORMAT.currencySuffix}`;
  }
}
