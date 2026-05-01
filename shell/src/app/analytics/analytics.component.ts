import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Transaction } from '../core/models';
import { AnalyticsService } from './analytics.service';
import { ExportService } from '../core/services/export.service';
import { AnalyticsStatsComponent } from './analytics-stats.component';
import { AnalyticsTableComponent } from './analytics-table.component';
import { SpinnerComponent } from '../shared/spinner/spinner.component';

interface AnalyticsStats {
  total: number;
  income: number;
  expenses: number;
}

const EMPTY_FILTER_TEXT = '';
const EMPTY_AMOUNT_FILTER = null;
const EMPTY_STATS: AnalyticsStats = { total: 0, income: 0, expenses: 0 };

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    AnalyticsStatsComponent,
    AnalyticsTableComponent,
    SpinnerComponent,
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

  readonly filtroTexto = signal<string>(EMPTY_FILTER_TEXT);
  readonly filtroImporteMin = signal<number | null>(EMPTY_AMOUNT_FILTER);
  readonly filtroImporteMax = signal<number | null>(EMPTY_AMOUNT_FILTER);

  readonly transaccionesFiltradas = computed<Transaction[]>(() => {
    const data = this.transactions();
    if (!data) {
      return [];
    }
    return this.analyticsService.filterTransactions(
      data,
      this.filtroTexto(),
      this.filtroImporteMin(),
      this.filtroImporteMax()
    );
  });

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
    this.filtroTexto.set(EMPTY_FILTER_TEXT);
    this.filtroImporteMin.set(EMPTY_AMOUNT_FILTER);
    this.filtroImporteMax.set(EMPTY_AMOUNT_FILTER);
  }

  exportarCSV(): void {
    this.exportando.set(true);
    this.exportService
      .exportToCSV(this.transaccionesFiltradas())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.exportando.set(false),
        error: () => this.exportando.set(false),
      });
  }
}
