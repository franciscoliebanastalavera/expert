import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-analytics-stats',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stats-bar">
      <div class="stat">
        <span class="stat-label">{{ 'ANALYTICS.STATS.TOTAL' | translate }}</span>
        <span class="stat-value">{{ total }}</span>
      </div>
      <div class="stat ingreso">
        <span class="stat-label">{{ 'ANALYTICS.STATS.INCOME' | translate }}</span>
        <span class="stat-value">{{ formatAmount(income) }}</span>
      </div>
      <div class="stat gasto">
        <span class="stat-label">{{ 'ANALYTICS.STATS.EXPENSES' | translate }}</span>
        <span class="stat-value">-{{ formatAmount(expenses) }}</span>
      </div>
    </div>
  `,
  styles: [`
    .stats-bar { display: flex; gap: 1.5rem; }
    .stat {
      background: var(--cap-bg-surface, #fff);
      border: 0.0625rem solid var(--cap-border, #cac8c2);
      border-radius: var(--cap-radius-md, 0.5rem);
      padding: 1rem 1.5rem;
      flex: 1;
    }
    .stat-label { display: block; font-size: 0.75rem; text-transform: uppercase; color: var(--cap-text-muted, #b2b2b2); margin-bottom: 0.25rem; }
    .stat-value { font-size: 1.3rem; font-weight: 700; font-variant-numeric: tabular-nums; }
    .ingreso .stat-value { color: #2e7d32; }
    .gasto .stat-value { color: #c62828; }
    @media (max-width: 768px) { .stats-bar { flex-wrap: wrap; } .stat { min-width: 10rem; flex: 1 1 100%; } }
    @media (max-width: 576px) { .stat { padding: 0.75rem 1rem; } .stat-value { font-size: 1.1rem; } }
  `],
})
export class AnalyticsStatsComponent {
  @Input() total = 0;
  @Input() income = 0;
  @Input() expenses = 0;

  formatAmount(amount: number): string {
    return `€${Math.abs(amount).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}
