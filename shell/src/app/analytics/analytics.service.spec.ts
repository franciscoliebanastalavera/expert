import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AnalyticsService } from './analytics.service';
import {
  MOCK_API_DELAY_MS,
  MOCK_TRANSACTIONS_COUNT,
} from './analytics.constants';
import {
  Transaction,
  TransactionCategory,
  TransactionStatus,
  TransactionType,
} from '../core/models';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalyticsService);
  });

  it(`should generate ${MOCK_TRANSACTIONS_COUNT} transactions`, fakeAsync(() => {
    let result: Transaction[] | undefined;
    service.getTransactions().subscribe((tx) => (result = tx));
    tick(MOCK_API_DELAY_MS);
    expect(result?.length).toBe(MOCK_TRANSACTIONS_COUNT);
  }));

  it('should return cached transactions on second call', fakeAsync(() => {
    let first: Transaction[] | undefined;
    let second: Transaction[] | undefined;
    service.getTransactions().subscribe((tx) => (first = tx));
    tick(MOCK_API_DELAY_MS);
    service.getTransactions().subscribe((tx) => (second = tx));
    tick(MOCK_API_DELAY_MS);
    expect(first).toBe(second);
  }));

  it('should filter by search text', fakeAsync(() => {
    let all: Transaction[] = [];
    service.getTransactions().subscribe((tx) => (all = tx));
    tick(MOCK_API_DELAY_MS);
    const filtered = service.filterTransactions(all, 'SEPA', null, null);
    expect(filtered.length).toBeGreaterThan(0);
    expect(
      filtered.every(
        (t) =>
          t.tipo.includes('SEPA') ||
          t.descripcion.toLowerCase().includes('sepa')
      )
    ).toBe(true);
  }));

  it('should filter by minimum amount', fakeAsync(() => {
    let all: Transaction[] = [];
    service.getTransactions().subscribe((tx) => (all = tx));
    tick(MOCK_API_DELAY_MS);
    const filtered = service.filterTransactions(all, '', 50000, null);
    expect(filtered.every((t) => Math.abs(t.importe) >= 50000)).toBe(true);
  }));

  it('should calculate stats correctly', () => {
    const transactions: Transaction[] = [
      {
        id: 1,
        fecha: '01/01/2026',
        tipo: TransactionType.SepaTranfer,
        descripcion: 'Test',
        iban: 'ES00',
        importe: 100,
        divisa: 'EUR',
        estado: TransactionStatus.Completed,
        categoria: TransactionCategory.Treasury,
      },
      {
        id: 2,
        fecha: '01/01/2026',
        tipo: TransactionType.SepaTranfer,
        descripcion: 'Test',
        iban: 'ES00',
        importe: -50,
        divisa: 'EUR',
        estado: TransactionStatus.Completed,
        categoria: TransactionCategory.Treasury,
      },
    ];
    const stats = service.calculateStats(transactions);
    expect(stats.total).toBe(2);
    expect(stats.income).toBe(100);
    expect(stats.expenses).toBe(50);
  });
});
