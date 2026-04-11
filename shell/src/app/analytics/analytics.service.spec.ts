import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalyticsService);
  });

  it('should generate 1000 transactions', () => {
    const transactions = service.getTransactions();
    expect(transactions.length).toBe(1000);
  });

  it('should return cached transactions on second call', () => {
    const first = service.getTransactions();
    const second = service.getTransactions();
    expect(first).toBe(second);
  });

  it('should filter by search text', () => {
    const all = service.getTransactions();
    const filtered = service.filterTransactions(all, 'SEPA', null, null);
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every(t => t.tipo.includes('SEPA') || t.descripcion.toLowerCase().includes('sepa'))).toBe(true);
  });

  it('should filter by minimum amount', () => {
    const all = service.getTransactions();
    const filtered = service.filterTransactions(all, '', 50000, null);
    expect(filtered.every(t => Math.abs(t.importe) >= 50000)).toBe(true);
  });

  it('should calculate stats correctly', () => {
    const transactions = [
      { id: 1, fecha: '01/01/2026', tipo: 'Test', descripcion: 'Test', iban: 'ES00', importe: 100, divisa: 'EUR', estado: 'Completada', categoria: 'Test' },
      { id: 2, fecha: '01/01/2026', tipo: 'Test', descripcion: 'Test', iban: 'ES00', importe: -50, divisa: 'EUR', estado: 'Completada', categoria: 'Test' },
    ];
    const stats = service.calculateStats(transactions);
    expect(stats.total).toBe(2);
    expect(stats.income).toBe(100);
    expect(stats.expenses).toBe(50);
  });
});
