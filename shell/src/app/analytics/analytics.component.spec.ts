import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateService, TranslateStore } from '@ngx-translate/core';
import { Observable, of, throwError } from 'rxjs';
import { AnalyticsComponent } from './analytics.component';
import { AnalyticsService } from './analytics.service';
import { ExportService } from '../core/services/export.service';
import {
  Transaction,
  TransactionCategory,
  TransactionStatus,
  TransactionType,
} from '../core/models';
import { TranslateServiceMock } from '../../testing/mocks';

const sampleTransactions: Transaction[] = [
  {
    id: 1,
    fecha: '01/01/2026',
    tipo: TransactionType.SepaTranfer,
    descripcion: 'Income SEPA',
    iban: 'ES9121000418450200051332',
    importe: 1500,
    divisa: 'EUR',
    estado: TransactionStatus.Completed,
    categoria: TransactionCategory.Treasury,
  },
  {
    id: 2,
    fecha: '02/01/2026',
    tipo: TransactionType.Payroll,
    descripcion: 'Payroll March',
    iban: 'DE89370400440532013000',
    importe: -2000,
    divisa: 'EUR',
    estado: TransactionStatus.Pending,
    categoria: TransactionCategory.Payroll,
  },
  {
    id: 3,
    fecha: '03/01/2026',
    tipo: TransactionType.InvoiceCollection,
    descripcion: 'Invoice client',
    iban: 'FR7630006000011234567890189',
    importe: 500,
    divisa: 'EUR',
    estado: TransactionStatus.Completed,
    categoria: TransactionCategory.Clients,
  },
];

class AnalyticsServiceStub {
  getTransactions(): Observable<Transaction[]> {
    return of(sampleTransactions);
  }
  filterTransactions(
    transactions: Transaction[],
    search: string,
    minAmount: number | null,
    maxAmount: number | null
  ): Transaction[] {
    let result = [...transactions];
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter((t) => t.descripcion.toLowerCase().includes(term));
    }
    if (minAmount !== null) {
      result = result.filter((t) => Math.abs(t.importe) >= minAmount);
    }
    if (maxAmount !== null) {
      result = result.filter((t) => Math.abs(t.importe) <= maxAmount);
    }
    return result;
  }
  calculateStats(transactions: Transaction[]): {
    total: number;
    income: number;
    expenses: number;
  } {
    return {
      total: transactions.length,
      income: transactions
        .filter((t) => t.importe > 0)
        .reduce((sum, t) => sum + t.importe, 0),
      expenses: transactions
        .filter((t) => t.importe < 0)
        .reduce((sum, t) => sum + Math.abs(t.importe), 0),
    };
  }
}

class ExportServiceStub {
  exportToCSV = jasmine
    .createSpy('exportToCSV')
    .and.callFake((_rows: Transaction[]) => of(undefined));
}

describe('AnalyticsComponent', () => {
  let fixture: ComponentFixture<AnalyticsComponent>;
  let component: AnalyticsComponent;
  let exportService: ExportServiceStub;

  beforeEach(async () => {
    exportService = new ExportServiceStub();
    await TestBed.configureTestingModule({
      imports: [AnalyticsComponent],
      providers: [
        provideRouter([]),
        { provide: AnalyticsService, useClass: AnalyticsServiceStub },
        { provide: ExportService, useValue: exportService },
        { provide: TranslateService, useClass: TranslateServiceMock },
        { provide: TranslateStore, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('initialises filters as empty', () => {
    expect(component.filtroTexto()).toBe('');
    expect(component.filtroImporteMin()).toBeNull();
    expect(component.filtroImporteMax()).toBeNull();
    expect(component.exportando()).toBeFalse();
  });

  it('loads the transactions stream into the signal on construction', () => {
    expect(component.transactions()?.length).toBe(3);
    expect(component.transaccionesFiltradas().length).toBe(3);
  });

  it('exposes total/income/expense computed signals derived from filtered rows', () => {
    expect(component.numTransacciones()).toBe(3);
    expect(component.totalIngresos()).toBe(2000);
    expect(component.totalGastos()).toBe(2000);
  });

  it('updates the filtered list when the search filter changes', () => {
    component.filtroTexto.set('payroll');
    expect(component.transaccionesFiltradas().length).toBe(1);
    expect(component.transaccionesFiltradas()[0].id).toBe(2);
  });

  it('applies the minimum and maximum amount filters', () => {
    component.filtroImporteMin.set(1000);
    expect(component.transaccionesFiltradas().every((t) => Math.abs(t.importe) >= 1000)).toBeTrue();

    component.filtroImporteMin.set(null);
    component.filtroImporteMax.set(800);
    expect(component.transaccionesFiltradas().every((t) => Math.abs(t.importe) <= 800)).toBeTrue();
  });

  it('limpiarFiltros resets all three filter signals', () => {
    component.filtroTexto.set('payroll');
    component.filtroImporteMin.set(100);
    component.filtroImporteMax.set(900);

    component.limpiarFiltros();
    expect(component.filtroTexto()).toBe('');
    expect(component.filtroImporteMin()).toBeNull();
    expect(component.filtroImporteMax()).toBeNull();
  });

  it('exportarCSV calls the ExportService and toggles the exportando flag', () => {
    component.exportarCSV();
    expect(exportService.exportToCSV).toHaveBeenCalledTimes(1);
    expect(exportService.exportToCSV.calls.mostRecent().args[0].length).toBe(3);
    expect(component.exportando()).toBeFalse();
  });

  it('does not call ExportService when there are no rows to export', () => {
    component.filtroTexto.set('zzz-no-match');
    expect(component.transaccionesFiltradas().length).toBe(0);
    component.exportarCSV();
    expect(exportService.exportToCSV).not.toHaveBeenCalled();
    expect(component.exportando()).toBeFalse();
  });

  it('clears the exportando flag even when ExportService errors', () => {
    exportService.exportToCSV.and.callFake(() => throwError(() => new Error('boom')));
    component.exportarCSV();
    expect(component.exportando()).toBeFalse();
  });
});
