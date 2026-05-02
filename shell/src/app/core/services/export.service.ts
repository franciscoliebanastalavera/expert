import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../models';

const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const XLSX_FILENAME = 'capitalflow-transacciones.xlsx';
const CSV_FALLBACK_FILENAME = 'capitalflow-transacciones.csv';

interface ExportSuccess {
  success: true;
  blob: Blob;
}

interface ExportFailure {
  success: false;
  error: string;
}

type ExportResponse = ExportSuccess | ExportFailure;

@Injectable({ providedIn: 'root' })
export class ExportService {
  exportToXLSX(transactions: Transaction[]): Observable<void> {
    return new Observable<void>((subscriber) => {
      if (typeof Worker !== 'undefined') {
        const worker = new Worker(new URL('../../workers/export.worker', import.meta.url));
        worker.onmessage = ({ data }: MessageEvent<ExportResponse>) => {
          if (data.success) {
            this.downloadBlob(data.blob, XLSX_FILENAME);
            worker.terminate();
            subscriber.next();
            subscriber.complete();
          } else {
            worker.terminate();
            subscriber.error(new Error(data.error));
          }
        };
        worker.onerror = (err: ErrorEvent) => {
          worker.terminate();
          subscriber.error(err);
        };
        worker.postMessage({ rows: transactions });
      } else {
        // Sync fallback when Worker is not available: emit CSV (legacy graceful degradation).
        // Excel opens CSV natively; modern browsers always have Worker so this path is rare.
        this.exportSyncCSV(transactions);
        subscriber.next();
        subscriber.complete();
      }
    });
  }

  private exportSyncCSV(transactions: Transaction[]): void {
    const headers = ['ID', 'Fecha', 'Tipo', 'Descripción', 'IBAN', 'Importe', 'Divisa', 'Estado', 'Categoría'];
    const csvRows = [headers.join(';')];

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
      ].join(';'));
    }

    const csvContent = csvRows.join('\n');
    const blob = new Blob(['﻿' + csvContent], { type: 'text/csv;charset=utf-8;' });
    this.downloadBlob(blob, CSV_FALLBACK_FILENAME);
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
