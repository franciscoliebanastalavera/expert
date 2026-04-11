import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../models';

@Injectable({ providedIn: 'root' })
export class ExportService {
  exportToCSV(transactions: Transaction[]): Observable<void> {
    return new Observable<void>((subscriber) => {
      if (typeof Worker !== 'undefined') {
        const worker = new Worker(new URL('../../workers/export.worker', import.meta.url));
        worker.onmessage = ({ data }: MessageEvent<Blob>) => {
          this.downloadBlob(data, 'capitalflow-transacciones.csv');
          worker.terminate();
          subscriber.next();
          subscriber.complete();
        };
        worker.onerror = (err: ErrorEvent) => {
          worker.terminate();
          subscriber.error(err);
        };
        worker.postMessage(transactions);
      } else {
        this.exportSync(transactions);
        subscriber.next();
        subscriber.complete();
      }
    });
  }

  private exportSync(transactions: Transaction[]): void {
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
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    this.downloadBlob(blob, 'capitalflow-transacciones.csv');
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
