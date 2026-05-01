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
import { Transaction, TransactionStatus } from '../core/models';

const IBAN_GROUP_REGEX = /(.{4})/g;
const IBAN_GROUP_SEPARATOR = ' ';
const AMOUNT_LOCALE = 'es-ES';
const AMOUNT_FRACTION_DIGITS = 2;
const POSITIVE_AMOUNT_PREFIX = '+€';
const NEGATIVE_AMOUNT_PREFIX = '-€';
const ROW_ITEM_SIZE_PX = 48;

const STATUS_KIND_MAP: Record<TransactionStatus, CapStatusBadgeKind> = {
  [TransactionStatus.Completed]: 'success',
  [TransactionStatus.Processing]: 'warning',
  [TransactionStatus.Pending]: 'info',
  [TransactionStatus.Rejected]: 'danger',
};

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
  readonly itemSize = ROW_ITEM_SIZE_PX;

  readonly columns = toSignal(
    combineLatest([
      this.translate.stream('ANALYTICS.GRID.ID'),
      this.translate.stream('ANALYTICS.GRID.DATE'),
      this.translate.stream('ANALYTICS.GRID.TYPE'),
      this.translate.stream('ANALYTICS.GRID.DESCRIPTION'),
      this.translate.stream('ANALYTICS.GRID.IBAN'),
      this.translate.stream('ANALYTICS.GRID.AMOUNT'),
      this.translate.stream('ANALYTICS.GRID.STATUS'),
      this.translate.stream('ANALYTICS.GRID.CATEGORY'),
    ]).pipe(
      map(([id, fecha, tipo, descripcion, iban, importe, estado, categoria]): CapTableColumn[] => [
        { key: 'id', label: id as string, cssClass: 'analytics-grid__cell--id' },
        { key: 'fecha', label: fecha as string, cssClass: 'analytics-grid__cell--fecha' },
        { key: 'tipo', label: tipo as string, cssClass: 'analytics-grid__cell--tipo' },
        { key: 'descripcion', label: descripcion as string, cssClass: 'analytics-grid__cell--desc' },
        { key: 'iban', label: iban as string, cssClass: 'analytics-grid__cell--iban' },
        { key: 'importe', label: importe as string, cssClass: 'analytics-grid__cell--importe' },
        { key: 'estado', label: estado as string, cssClass: 'analytics-grid__cell--estado' },
        { key: 'categoria', label: categoria as string, cssClass: 'analytics-grid__cell--cat' },
      ])
    ),
    { initialValue: [] as CapTableColumn[] }
  );

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

  statusKind(status: TransactionStatus): CapStatusBadgeKind {
    return STATUS_KIND_MAP[status];
  }
}
