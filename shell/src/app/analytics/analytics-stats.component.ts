import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CapStatCardComponent } from '@capitalflow/shared-ui';

const AMOUNT_LOCALE = 'es-ES';
const AMOUNT_FRACTION_DIGITS = 2;
const DEFAULT_AMOUNT = 0;
const DEFAULT_TOTAL = 0;

@Component({
  selector: 'app-analytics-stats',
  standalone: true,
  imports: [CommonModule, TranslateModule, CapStatCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './analytics-stats.component.html',
  styleUrls: ['./analytics-stats.component.scss'],
})
export class AnalyticsStatsComponent {
  readonly total = input<number>(DEFAULT_TOTAL);
  readonly income = input<number>(DEFAULT_AMOUNT);
  readonly expenses = input<number>(DEFAULT_AMOUNT);

  formatAmount(amount: number): string {
    const formatted = Math.abs(amount).toLocaleString(AMOUNT_LOCALE, {
      minimumFractionDigits: AMOUNT_FRACTION_DIGITS,
      maximumFractionDigits: AMOUNT_FRACTION_DIGITS,
    });
    return `€${formatted}`;
  }
}
