import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateService, TranslateStore } from '@ngx-translate/core';
import { AnalyticsTableComponent } from './analytics-table.component';
import {
  Transaction,
  TransactionCategory,
  TransactionStatus,
  TransactionType,
} from '../../../core/models';
import { TranslateServiceMock } from '../../../../testing/mocks';

const sampleTransactions: Transaction[] = [
  {
    id: 1,
    fecha: '01/01/2026',
    tipo: TransactionType.SepaTranfer,
    descripcion: 'Income SEPA',
    iban: 'ES9121000418450200051332',
    importe: 1500.25,
    divisa: 'EUR',
    estado: TransactionStatus.Completed,
    categoria: TransactionCategory.Treasury,
  },
  {
    id: 2,
    fecha: '02/01/2026',
    tipo: TransactionType.Payroll,
    descripcion: 'Payroll',
    iban: 'DE89370400440532013000',
    importe: -2000,
    divisa: 'EUR',
    estado: TransactionStatus.Pending,
    categoria: TransactionCategory.Payroll,
  },
];

describe('AnalyticsTableComponent', () => {
  let fixture: ComponentFixture<AnalyticsTableComponent>;
  let component: AnalyticsTableComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsTableComponent],
      providers: [
        { provide: TranslateService, useClass: TranslateServiceMock },
        { provide: TranslateStore, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalyticsTableComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('transactions', sampleTransactions);
    fixture.detectChanges();
  });

  it('renders the cap-data-grid with the provided transactions', () => {
    const grid = fixture.debugElement.query(By.css('cap-data-grid'));
    expect(grid).not.toBeNull();
    expect(component.transactions().length).toBe(2);
  });

  it('builds 8 columns from the translate streams', () => {
    const cols = component.columns();
    expect(cols.length).toBe(8);
    expect(cols.map((c) => c.key)).toEqual([
      'id',
      'fecha',
      'tipo',
      'descripcion',
      'iban',
      'importe',
      'estado',
      'categoria',
    ]);
  });

  it('formats a positive amount with the + sign and currency suffix', () => {
    expect(component.formatAmount(1234.5)).toBe('+1234,50 \u20ac');
  });

  it('formats a negative amount with the - sign and absolute value', () => {
    expect(component.formatAmount(-987.6)).toBe('-987,60 \u20ac');
  });

  it('formats zero with the positive sign as +0,00 EUR', () => {
    expect(component.formatAmount(0)).toBe('+0,00 \u20ac');
  });

  it('maps each TransactionStatus to the matching badge kind', () => {
    expect(component.statusKind(TransactionStatus.Completed)).toBe('success');
    expect(component.statusKind(TransactionStatus.Processing)).toBe('warning');
    expect(component.statusKind(TransactionStatus.Pending)).toBe('info');
    expect(component.statusKind(TransactionStatus.Rejected)).toBe('danger');
  });

  it('exposes the configured row item size', () => {
    expect(component.itemSize).toBe(48);
  });

  it('falls back to an empty array when the transactions input is not set', () => {
    const freshFixture = TestBed.createComponent(AnalyticsTableComponent);
    freshFixture.detectChanges();
    expect(freshFixture.componentInstance.transactions()).toEqual([]);
  });
});
