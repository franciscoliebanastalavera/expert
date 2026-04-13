import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-analytics-stats',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './analytics-stats.component.html',
  styleUrls: ['./analytics-stats.component.scss'],
})
export class AnalyticsStatsComponent {
  @Input() total = 0;
  @Input() income = 0;
  @Input() expenses = 0;

  formatAmount(amount: number): string {
    return `€${Math.abs(amount).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}
