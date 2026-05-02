import { TestBed } from '@angular/core/testing';
import {
  Transaction,
  TransactionCategory,
  TransactionStatus,
  TransactionType,
} from '../models';
import { ExportService } from './export.service';

class FakeWorker {
  static instances: FakeWorker[] = [];
  onmessage: ((event: MessageEvent<Blob>) => void) | null = null;
  onerror: ((err: ErrorEvent) => void) | null = null;
  postedMessages: unknown[] = [];
  terminated = false;

  constructor(public readonly url: URL | string) {
    FakeWorker.instances.push(this);
  }

  postMessage(data: unknown): void {
    this.postedMessages.push(data);
  }

  terminate(): void {
    this.terminated = true;
  }

  fireSuccess(blob: Blob): void {
    this.onmessage?.({ data: blob } as MessageEvent<Blob>);
  }

  fireError(err: ErrorEvent): void {
    this.onerror?.(err);
  }
}

const sampleTransactions: Transaction[] = [
  {
    id: 1,
    fecha: '01/01/2026',
    tipo: TransactionType.SepaTranfer,
    descripcion: 'Test SEPA',
    iban: 'ES9121000418450200051332',
    importe: 100.5,
    divisa: 'EUR',
    estado: TransactionStatus.Completed,
    categoria: TransactionCategory.Treasury,
  },
  {
    id: 2,
    fecha: '02/01/2026',
    tipo: TransactionType.Payroll,
    descripcion: 'Salary; with "quotes"',
    iban: 'ES7620770024003102575766',
    importe: -2000,
    divisa: 'EUR',
    estado: TransactionStatus.Pending,
    categoria: TransactionCategory.Payroll,
  },
];

describe('ExportService', () => {
  let service: ExportService;
  let originalWorker: typeof Worker;
  let originalCreateObjectURL: typeof URL.createObjectURL;
  let originalRevokeObjectURL: typeof URL.revokeObjectURL;
  let createObjectURLSpy: jasmine.Spy;
  let revokeObjectURLSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportService);

    FakeWorker.instances.length = 0;
    originalWorker = window.Worker;
    (window as { Worker: unknown }).Worker = FakeWorker as unknown as typeof Worker;

    originalCreateObjectURL = URL.createObjectURL;
    originalRevokeObjectURL = URL.revokeObjectURL;
    createObjectURLSpy = jasmine.createSpy('createObjectURL').and.returnValue('blob:mock');
    revokeObjectURLSpy = jasmine.createSpy('revokeObjectURL');
    URL.createObjectURL = createObjectURLSpy as unknown as typeof URL.createObjectURL;
    URL.revokeObjectURL = revokeObjectURLSpy as unknown as typeof URL.revokeObjectURL;
  });

  afterEach(() => {
    (window as { Worker: unknown }).Worker = originalWorker;
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
  });

  it('is provided in root', () => {
    expect(service).toBeInstanceOf(ExportService);
  });

  it('spawns a Worker, posts the transactions and resolves on worker message', (done) => {
    const observable = service.exportToCSV(sampleTransactions);
    observable.subscribe({
      next: () => {
        expect(FakeWorker.instances.length).toBe(1);
        const worker = FakeWorker.instances[0];
        expect(worker.postedMessages).toEqual([sampleTransactions]);
        expect(createObjectURLSpy).toHaveBeenCalledTimes(1);
        expect(revokeObjectURLSpy).toHaveBeenCalledTimes(1);
        expect(worker.terminated).toBeTrue();
        done();
      },
      error: () => done.fail('expected next, got error'),
    });

    const worker = FakeWorker.instances[0];
    worker.fireSuccess(new Blob(['fake csv'], { type: 'text/csv' }));
  });

  it('emits an error and terminates the worker when the worker reports an error', (done) => {
    const observable = service.exportToCSV(sampleTransactions);
    observable.subscribe({
      next: () => done.fail('expected error, got next'),
      error: (err) => {
        expect(err).toBeInstanceOf(ErrorEvent);
        expect(FakeWorker.instances[0].terminated).toBeTrue();
        done();
      },
    });

    const worker = FakeWorker.instances[0];
    worker.fireError(new ErrorEvent('error', { message: 'worker boom' }));
  });

  it('falls back to synchronous export when Worker is unavailable', (done) => {
    (window as { Worker: unknown }).Worker = undefined;

    service.exportToCSV(sampleTransactions).subscribe({
      next: () => {
        expect(FakeWorker.instances.length).toBe(0);
        expect(createObjectURLSpy).toHaveBeenCalledTimes(1);
        const blob = createObjectURLSpy.calls.mostRecent().args[0] as Blob;
        expect(blob.type).toContain('text/csv');
        done();
      },
      error: () => done.fail('sync fallback should not error'),
    });
  });

  it('triggers a download link click with the configured filename in fallback mode', () => {
    (window as { Worker: unknown }).Worker = undefined;
    const anchor = document.createElement('a');
    const clickSpy = spyOn(anchor, 'click');
    spyOn(document, 'createElement').and.returnValue(anchor);

    service.exportToCSV(sampleTransactions).subscribe();

    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(anchor.download).toBe('capitalflow-transacciones.csv');
    expect(anchor.href).toBe('blob:mock');
  });

  it('produces CSV content with header row plus one row per transaction in fallback mode', () => {
    (window as { Worker: unknown }).Worker = undefined;

    service.exportToCSV(sampleTransactions).subscribe();

    const blob = createObjectURLSpy.calls.mostRecent().args[0] as Blob;
    expect(blob).toBeInstanceOf(Blob);
    return blob.text().then((text) => {
      const lines = text.replace(/^﻿/, '').split('\n');
      expect(lines.length).toBe(1 + sampleTransactions.length);
      expect(lines[0]).toContain('ID');
      expect(lines[0]).toContain('Fecha');
      expect(lines[1]).toContain('1');
      expect(lines[1]).toContain('100.50');
      expect(lines[2]).toContain('-2000.00');
    });
  });
});
