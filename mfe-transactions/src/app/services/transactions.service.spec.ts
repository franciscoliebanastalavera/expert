import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TransactionsService } from './transactions.service';
import { TRANSACTIONS_MOCK_CONFIG } from '../models';
import {
  Transaction,
  TransactionCategory,
  TransactionStatus,
  TransactionType,
} from '../models';

describe('TransactionsService', () => {
  let service: TransactionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionsService);
  });

  it(`should generate ${TRANSACTIONS_MOCK_CONFIG.transactionsCount} transactions`, fakeAsync(() => {
    let result: Transaction[] | undefined;
    service.getTransactions().subscribe((tx) => (result = tx));
    tick(TRANSACTIONS_MOCK_CONFIG.apiDelayMs);
    expect(result?.length).toBe(TRANSACTIONS_MOCK_CONFIG.transactionsCount);
  }));

  it('should return cached transactions on second call', fakeAsync(() => {
    let first: Transaction[] | undefined;
    let second: Transaction[] | undefined;
    service.getTransactions().subscribe((tx) => (first = tx));
    tick(TRANSACTIONS_MOCK_CONFIG.apiDelayMs);
    service.getTransactions().subscribe((tx) => (second = tx));
    tick(TRANSACTIONS_MOCK_CONFIG.apiDelayMs);
    expect(first).toBe(second);
  }));

  it('should filter by search text', fakeAsync(() => {
    let all: Transaction[] = [];
    service.getTransactions().subscribe((tx) => (all = tx));
    tick(TRANSACTIONS_MOCK_CONFIG.apiDelayMs);
    const filtered = service.filterTransactions(all, 'SEPA', null, null);
    expect(filtered.length).toBeGreaterThan(0);
    expect(
      filtered.every(
        (transaction) =>
          transaction.tipo.includes('SEPA') ||
          transaction.descripcion.toLowerCase().includes('sepa')
      )
    ).toBe(true);
  }));

  it('should filter by minimum amount', fakeAsync(() => {
    let all: Transaction[] = [];
    service.getTransactions().subscribe((tx) => (all = tx));
    tick(TRANSACTIONS_MOCK_CONFIG.apiDelayMs);
    const filtered = service.filterTransactions(all, '', 50000, null);
    expect(filtered.every((transaction) => Math.abs(transaction.importe) >= 50000)).toBe(true);
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
