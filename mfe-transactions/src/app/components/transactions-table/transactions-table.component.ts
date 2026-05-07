import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
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
import { TRANSACTIONS_TEXT } from '../../transactions.text';

const COLUMN_LABELS: readonly string[] = [
  TRANSACTIONS_TEXT.GRID.ID,
  TRANSACTIONS_TEXT.GRID.DATE,
  TRANSACTIONS_TEXT.GRID.TYPE,
  TRANSACTIONS_TEXT.GRID.DESCRIPTION,
  TRANSACTIONS_TEXT.GRID.IBAN,
  TRANSACTIONS_TEXT.GRID.AMOUNT,
  TRANSACTIONS_TEXT.GRID.STATUS,
  TRANSACTIONS_TEXT.GRID.CATEGORY,
];

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
  readonly transactions = input<Transaction[]>([]);
  readonly itemSize = TRANSACTIONS_TABLE_CONFIG.itemSizePx;

  readonly columns = computed<CapTableColumn[]>(() =>
    TRANSACTIONS_GRID_COLUMNS.map((column, index) => ({
      ...column,
      label: COLUMN_LABELS[index],
    })),
  );

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
