import {
  afterRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  CapAlertComponent,
  CapButtonComponent,
  CapInputComponent,
  CapSpinnerComponent,
} from '@capitalflow/shared-ui';
import { Transaction } from './models';
import { TransactionsService } from './services/transactions.service';
import { ExportService } from './services/export.service';
import { TransactionsMetricsService } from './services/transactions-metrics.service';
import { TransactionsStatsComponent } from './components/transactions-stats/transactions-stats.component';
import { TransactionsTableComponent } from './components/transactions-table/transactions-table.component';
import {
  TRANSACTIONS_EMPTY_STATS,
  TRANSACTIONS_FILTER_DEFAULTS,
  TRANSACTIONS_FILTER_VALIDATION,
  TransactionsFilterValues,
  TransactionsStats,
} from './models';
import { TRANSACTIONS_EXPORT_PHASE_LABEL, TRANSACTIONS_TEXT } from './transactions.text';

function amountRangeValidator(control: AbstractControl): ValidationErrors | null {
  const min = control.get('importeMin')?.value;
  const max = control.get('importeMax')?.value;
  if (typeof min === 'number' && typeof max === 'number' && min > max) {
    return { amountRange: true };
  }
  return null;
}

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TransactionsStatsComponent,
    TransactionsTableComponent,
    CapAlertComponent,
    CapSpinnerComponent,
    CapButtonComponent,
    CapInputComponent,
  ],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsComponent {
  private readonly transactionsService = inject(TransactionsService);
  private readonly exportService = inject(ExportService);
  private readonly metricsService = inject(TransactionsMetricsService);
  private readonly destroyRef = inject(DestroyRef);

  readonly transactions = toSignal<Transaction[] | undefined>(
    this.transactionsService.getTransactions(),
    { initialValue: undefined }
  );

  readonly filterForm = new FormGroup(
    {
      texto: new FormControl<string>('', {
        nonNullable: true,
        validators: [
          Validators.maxLength(TRANSACTIONS_FILTER_VALIDATION.searchMaxLength),
          Validators.pattern(TRANSACTIONS_FILTER_VALIDATION.safeTextPattern),
        ],
      }),
      importeMin: new FormControl<number | null>(null, [
        Validators.min(0),
        Validators.max(TRANSACTIONS_FILTER_VALIDATION.maxAmount),
      ]),
      importeMax: new FormControl<number | null>(null, [
        Validators.min(0),
        Validators.max(TRANSACTIONS_FILTER_VALIDATION.maxAmount),
      ]),
    },
    { validators: [amountRangeValidator] }
  );

  private readonly filterValues = signal<TransactionsFilterValues>(this.filterForm.getRawValue());

  readonly transaccionesFiltradas = computed<Transaction[]>(() => {
    const data = this.transactions();
    if (!data) {
      return [];
    }
    if (this.filterForm.invalid) {
      return data;
    }
    const values = this.filterValues();
    return this.transactionsService.filterTransactions(
      data,
      values.texto,
      values.importeMin,
      values.importeMax
    );
  });

  constructor() {
    afterRender({ read: () => this.recordGridDomNodeCount() });

    this.filterForm.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        const start = performance.now();
        this.filterValues.set(this.filterForm.getRawValue());
        this.transaccionesFiltradas();
        this.metricsService.recordFilterTime(performance.now() - start);
      });
  }

  private readonly stats = computed<TransactionsStats>(() =>
    this.transactions()
      ? this.transactionsService.calculateStats(this.transaccionesFiltradas())
      : TRANSACTIONS_EMPTY_STATS
  );

  readonly numTransacciones = computed<number>(() => this.stats().total);
  readonly totalIngresos = computed<number>(() => this.stats().income);
  readonly totalGastos = computed<number>(() => this.stats().expenses);
  readonly datasetTotal = computed<number>(() => this.transactions()?.length ?? 0);
  readonly exportPhase = this.exportService.exportPhase;
  readonly text = TRANSACTIONS_TEXT;
  readonly exportPhaseLabel = TRANSACTIONS_EXPORT_PHASE_LABEL;

  readonly exportando = signal<boolean>(false);

  limpiarFiltros(): void {
    this.filterForm.reset(TRANSACTIONS_FILTER_DEFAULTS);
  }

  exportarExcel(): void {
    const rows = this.transaccionesFiltradas();
    if (rows.length === 0) {
      return;
    }
    this.exportando.set(true);
    this.exportService
      .exportToXLSX(rows)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.exportando.set(false),
        error: () => this.exportando.set(false),
      });
  }

  private recordGridDomNodeCount(): void {
    const count = document.querySelectorAll('.cap-data-grid__row').length;
    this.metricsService.recordDomNodeCount(count);
  }
}
