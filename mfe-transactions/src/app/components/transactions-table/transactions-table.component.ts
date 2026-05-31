import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CapCellTemplateDirective,
  CapDataGridComponent,
  CapStatusBadgeComponent,
  CapStatusBadgeKind,
  CapTableColumn,
  IbanPipe,
} from '@capitalflow/shared-ui';
import {
  Transaction,
  TransactionStatus,
  TRANSACTION_STATUS_KIND_MAP,
} from '../../models';
import { formatAmount } from '../../utils/format-amount.util';
import {
  TRANSACTIONS_GRID_COLUMNS,
  TRANSACTIONS_TABLE_CONFIG,
} from '../../models';
import { TRANSACTIONS_I18N } from '../../transactions.text';
import { LanguageStore } from '../../i18n/language.store';

@Component({
  selector: 'app-transactions-table',
  standalone: true,
  imports: [
    CommonModule,
    CapDataGridComponent,
    CapCellTemplateDirective,
    CapStatusBadgeComponent,
    IbanPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './transactions-table.component.html',
  styleUrls: ['./transactions-table.component.scss'],
})
export class TransactionsTableComponent {
  private readonly langStore = inject(LanguageStore);

  readonly transactions = input<Transaction[]>([]);
  readonly itemSize = TRANSACTIONS_TABLE_CONFIG.itemSizePx;
  readonly viewportHeight = 'min(37.5rem, calc(100dvh - 20rem))';

  readonly columns = computed<CapTableColumn[]>(() => {
    const grid = TRANSACTIONS_I18N[this.langStore.lang()].GRID;
    const labels = [
      grid.ID,
      grid.DATE,
      grid.TYPE,
      grid.DESCRIPTION,
      grid.IBAN,
      grid.AMOUNT,
      grid.STATUS,
      grid.CATEGORY,
    ];
    return TRANSACTIONS_GRID_COLUMNS.map((column, index) => ({
      ...column,
      label: labels[index],
    }));
  });

  formatAmount(importe: number): string {
    return formatAmount(importe, {
      locale: TRANSACTIONS_TABLE_CONFIG.amountFormat.locale,
      fractionDigits: TRANSACTIONS_TABLE_CONFIG.amountFormat.fractionDigits,
      currencySuffix: TRANSACTIONS_TABLE_CONFIG.amountFormat.currencySuffix,
      useAbs: true,
      includeSign: true,
      positiveSign: TRANSACTIONS_TABLE_CONFIG.positiveSign,
      negativeSign: TRANSACTIONS_TABLE_CONFIG.negativeSign,
    });
  }

  statusKind(status: TransactionStatus): CapStatusBadgeKind {
    return TRANSACTION_STATUS_KIND_MAP[status];
  }
}
