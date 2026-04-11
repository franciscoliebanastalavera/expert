import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Transaction } from '../core/models';
import { AnalyticsService } from './analytics.service';
import { ExportService } from '../core/services/export.service';
import { AnalyticsStatsComponent } from './analytics-stats.component';
import { AnalyticsTableComponent } from './analytics-table.component';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule, AnalyticsStatsComponent, AnalyticsTableComponent],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsComponent implements OnInit {
  private readonly analyticsService = inject(AnalyticsService);
  private readonly exportService = inject(ExportService);

  private allTransactions: Transaction[] = [];
  transaccionesFiltradas: Transaction[] = [];

  filtroTexto = '';
  filtroImporteMin: number | null = null;
  filtroImporteMax: number | null = null;

  totalIngresos = 0;
  totalGastos = 0;
  numTransacciones = 0;
  exportando = false;

  ngOnInit(): void {
    this.allTransactions = this.analyticsService.getTransactions();
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.transaccionesFiltradas = this.analyticsService.filterTransactions(
      this.allTransactions,
      this.filtroTexto,
      this.filtroImporteMin,
      this.filtroImporteMax
    );
    const stats = this.analyticsService.calculateStats(this.transaccionesFiltradas);
    this.numTransacciones = stats.total;
    this.totalIngresos = stats.income;
    this.totalGastos = stats.expenses;
  }

  limpiarFiltros(): void {
    this.filtroTexto = '';
    this.filtroImporteMin = null;
    this.filtroImporteMax = null;
    this.aplicarFiltros();
  }

  exportarCSV(): void {
    this.exportando = true;
    this.exportService.exportToCSV(this.transaccionesFiltradas).subscribe({
      next: () => { this.exportando = false; },
      error: () => { this.exportando = false; },
    });
  }

  formatearImporte(importe: number): string {
    const formatted = Math.abs(importe).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return importe >= 0 ? `+€${formatted}` : `-€${formatted}`;
  }
}
