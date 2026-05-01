import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TranslateModule } from '@ngx-translate/core';
import { Transaction, TransactionStatus } from '../core/models';

const IBAN_GROUP_REGEX = /(.{4})/g;
const IBAN_GROUP_SEPARATOR = ' ';
const AMOUNT_LOCALE = 'es-ES';
const AMOUNT_FRACTION_DIGITS = 2;
const POSITIVE_AMOUNT_PREFIX = '+€';
const NEGATIVE_AMOUNT_PREFIX = '-€';

@Component({
  selector: 'app-analytics-table',
  standalone: true,
  imports: [CommonModule, ScrollingModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './analytics-table.component.html',
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsTableComponent {
  readonly transactions = input<Transaction[]>([]);
  readonly transactionStatus = TransactionStatus;

  trackById(_index: number, item: Transaction): number {
    return item.id;
  }

  formatIban(iban: string): string {
    return iban.replace(IBAN_GROUP_REGEX, `$1${IBAN_GROUP_SEPARATOR}`).trim();
  }

  formatAmount(importe: number): string {
    const formatted = Math.abs(importe).toLocaleString(AMOUNT_LOCALE, {
      minimumFractionDigits: AMOUNT_FRACTION_DIGITS,
      maximumFractionDigits: AMOUNT_FRACTION_DIGITS,
    });
    return importe >= 0 ? `${POSITIVE_AMOUNT_PREFIX}${formatted}` : `${NEGATIVE_AMOUNT_PREFIX}${formatted}`;
  }
}
