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
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  CapAlertComponent,
  CapButtonComponent,
  CapInputComponent,
  CapSpinnerComponent,
} from '@capitalflow/shared-ui';
import { Transaction } from '../core/models';
import { AnalyticsService } from './services/analytics.service';
import { ExportService } from '../core/services/export.service';
import { AnalyticsMetricsService } from './services/analytics-metrics.service';
import { AnalyticsStatsComponent } from './components/analytics-stats/analytics-stats.component';
import { AnalyticsTableComponent } from './components/analytics-table/analytics-table.component';
import {
  ANALYTICS_EMPTY_STATS,
  ANALYTICS_FILTER_DEFAULTS,
  ANALYTICS_FILTER_VALIDATION,
  AnalyticsFilterValues,
  AnalyticsStats,
} from './models/analytics.model';

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
    CapAlertComponent,
    CapSpinnerComponent,
    CapButtonComponent,
    CapInputComponent,
  ],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsComponent {
  private readonly analyticsService = inject(AnalyticsService);
  private readonly exportService = inject(ExportService);
  private readonly metricsService = inject(AnalyticsMetricsService);
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
          Validators.maxLength(ANALYTICS_FILTER_VALIDATION.searchMaxLength),
          Validators.pattern(ANALYTICS_FILTER_VALIDATION.safeTextPattern),
        ],
      }),
      importeMin: new FormControl<number | null>(null, [
        Validators.min(0),
        Validators.max(ANALYTICS_FILTER_VALIDATION.maxAmount),
      ]),
      importeMax: new FormControl<number | null>(null, [
        Validators.min(0),
        Validators.max(ANALYTICS_FILTER_VALIDATION.maxAmount),
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

  private readonly stats = computed<AnalyticsStats>(() =>
    this.transactions()
      ? this.analyticsService.calculateStats(this.transaccionesFiltradas())
      : ANALYTICS_EMPTY_STATS
  );

  readonly numTransacciones = computed<number>(() => this.stats().total);
  readonly totalIngresos = computed<number>(() => this.stats().income);
  readonly totalGastos = computed<number>(() => this.stats().expenses);
  readonly datasetTotal = computed<number>(() => this.transactions()?.length ?? 0);
  readonly exportPhase = this.exportService.exportPhase;

  readonly exportando = signal<boolean>(false);

  limpiarFiltros(): void {
    this.filterForm.reset(ANALYTICS_FILTER_DEFAULTS);
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
