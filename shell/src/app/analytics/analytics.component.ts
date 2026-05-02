import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
// Note: filterValues uses signal+subscribe instead of toSignal(valueChanges) to keep
// the strict AnalyticsFilterValues type — FormGroup.valueChanges emits Partial<T>.
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CapButtonComponent, CapSpinnerComponent } from '@capitalflow/shared-ui';
import { Transaction } from '../core/models';
import { AnalyticsService } from './analytics.service';
import { ExportService } from '../core/services/export.service';
import { AnalyticsStatsComponent } from './analytics-stats.component';
import { AnalyticsTableComponent } from './analytics-table.component';
import { MAX_AMOUNT, SAFE_TEXT_PATTERN, SEARCH_MAX_LENGTH } from './analytics.constants';

interface AnalyticsStats {
  total: number;
  income: number;
  expenses: number;
}

interface AnalyticsFilterValues {
  texto: string;
  importeMin: number | null;
  importeMax: number | null;
}

const EMPTY_STATS: AnalyticsStats = { total: 0, income: 0, expenses: 0 };
const DEFAULT_FILTERS: AnalyticsFilterValues = {
  texto: '',
  importeMin: null,
  importeMax: null,
};

function amountRangeValidator(control: AbstractControl): ValidationErrors | null {
  const min = control.get('importeMin')?.value;
  const max = control.get('importeMax')?.value;
  if (typeof min === 'number' && typeof max === 'number' && min > max) {
    return { amountRange: true };
  }
  return null;
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    AnalyticsStatsComponent,
    AnalyticsTableComponent,
    CapSpinnerComponent,
    CapButtonComponent,
  ],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsComponent {
  private readonly analyticsService = inject(AnalyticsService);
  private readonly exportService = inject(ExportService);
  private readonly destroyRef = inject(DestroyRef);

  readonly transactions = toSignal<Transaction[] | undefined>(
    this.analyticsService.getTransactions(),
    { initialValue: undefined }
  );

  readonly filterForm = new FormGroup(
    {
      texto: new FormControl<string>('', {
        nonNullable: true,
        validators: [
          Validators.maxLength(SEARCH_MAX_LENGTH),
          Validators.pattern(SAFE_TEXT_PATTERN),
        ],
      }),
      importeMin: new FormControl<number | null>(null, [
        Validators.min(0),
        Validators.max(MAX_AMOUNT),
      ]),
      importeMax: new FormControl<number | null>(null, [
        Validators.min(0),
        Validators.max(MAX_AMOUNT),
      ]),
    },
    { validators: [amountRangeValidator] }
  );

  private readonly filterValues = signal<AnalyticsFilterValues>(this.filterForm.getRawValue());

  readonly transaccionesFiltradas = computed<Transaction[]>(() => {
    const data = this.transactions();
    if (!data) {
      return [];
    }
    if (this.filterForm.invalid) {
      return data;
    }
    const values = this.filterValues();
    return this.analyticsService.filterTransactions(
      data,
      values.texto,
      values.importeMin,
      values.importeMax
    );
  });

  constructor() {
    this.filterForm.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.filterValues.set(this.filterForm.getRawValue()));
  }

  private readonly stats = computed<AnalyticsStats>(() =>
    this.transactions()
      ? this.analyticsService.calculateStats(this.transaccionesFiltradas())
      : EMPTY_STATS
  );

  readonly numTransacciones = computed<number>(() => this.stats().total);
  readonly totalIngresos = computed<number>(() => this.stats().income);
  readonly totalGastos = computed<number>(() => this.stats().expenses);

  readonly exportando = signal<boolean>(false);

  limpiarFiltros(): void {
    this.filterForm.reset(DEFAULT_FILTERS);
  }

  exportarCSV(): void {
    const rows = this.transaccionesFiltradas();
    if (rows.length === 0) {
      return;
    }
    this.exportando.set(true);
    this.exportService
      .exportToCSV(rows)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.exportando.set(false),
        error: () => this.exportando.set(false),
      });
  }
}
