import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../models';

export type ExportPhase = 'idle' | 'preparing' | 'generating' | 'downloading' | 'success' | 'error';

type WorkerPhase = Exclude<ExportPhase, 'idle' | 'downloading'>;

interface ExportPhaseMessage {
  phase: WorkerPhase;
}

interface ExportSuccess {
  success: true;
  phase: 'success';
  blob: Blob;
}

interface ExportFailure {
  success: false;
  phase: 'error';
  error: string;
}

type ExportResponse = ExportPhaseMessage | ExportSuccess | ExportFailure;

const XLSX_FILENAME = 'capitalflow-transacciones.xlsx';
const CSV_FALLBACK_FILENAME = 'capitalflow-transacciones.csv';
const CSV_MIME = 'text/csv;charset=utf-8;';
const CSV_BOM = '\ufeff';
const CSV_SEPARATOR = ';';
const CSV_HEADERS = ['ID', 'Fecha', 'Tipo', 'Descripción', 'IBAN', 'Importe', 'Divisa', 'Estado', 'Categoría'];

@Injectable({ providedIn: 'root' })
export class ExportService {
  private readonly exportPhaseValue = signal<ExportPhase>('idle');

  readonly exportPhase = this.exportPhaseValue.asReadonly();

  exportToXLSX(transactions: Transaction[]): Observable<void> {
    return new Observable<void>((subscriber) => {
      // Single active export assumed; concurrent exports are intentionally not supported.
      this.exportPhaseValue.set('preparing');

      if (typeof Worker !== 'undefined') {
        const worker = new Worker(new URL('../../workers/export.worker', import.meta.url));
        worker.onmessage = ({ data }: MessageEvent<ExportResponse>) => {
          this.exportPhaseValue.set(data.phase);
          if ('success' in data && data.success) {
            this.exportPhaseValue.set('downloading');
            this.downloadBlob(data.blob, XLSX_FILENAME);
            this.exportPhaseValue.set('success');
            worker.terminate();
            subscriber.next();
            subscriber.complete();
          } else if ('success' in data) {
            this.exportPhaseValue.set('error');
            worker.terminate();
            subscriber.error(new Error(data.error));
          }
        };
        worker.onerror = (err: ErrorEvent) => {
          this.exportPhaseValue.set('error');
          worker.terminate();
          subscriber.error(err);
        };
        worker.postMessage({ rows: transactions });
      } else {
        this.exportSyncCSV(transactions);
        subscriber.next();
        subscriber.complete();
      }
    });
  }

  private exportSyncCSV(transactions: Transaction[]): void {
    this.exportPhaseValue.set('generating');
    const csvRows = [CSV_HEADERS.join(CSV_SEPARATOR)];

    for (const row of transactions) {
      csvRows.push([
        row.id,
        row.fecha,
        row.tipo,
        `"${row.descripcion}"`,
        row.iban,
        row.importe.toFixed(2),
        row.divisa,
        row.estado,
        row.categoria,
      ].join(CSV_SEPARATOR));
    }

    const csvContent = csvRows.join('\n');
    const blob = new Blob([CSV_BOM + csvContent], { type: CSV_MIME });
    this.exportPhaseValue.set('downloading');
    this.downloadBlob(blob, CSV_FALLBACK_FILENAME);
    this.exportPhaseValue.set('success');
  }

  private downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }
}
