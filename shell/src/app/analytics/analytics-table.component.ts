import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TranslateModule } from '@ngx-translate/core';
import { Transaction } from '../core/models';

@Component({
  selector: 'app-analytics-table',
  standalone: true,
  imports: [CommonModule, ScrollingModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './analytics-table.component.html',
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsTableComponent {
  @Input() transactions: Transaction[] = [];

  trackById(index: number, item: Transaction): number {
    return item.id;
  }

  formatIban(iban: string): string {
    return iban.replace(/(.{4})/g, '$1 ').trim();
  }

  formatAmount(importe: number): string {
    const formatted = Math.abs(importe).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return importe >= 0 ? `+€${formatted}` : `-€${formatted}`;
  }
}
