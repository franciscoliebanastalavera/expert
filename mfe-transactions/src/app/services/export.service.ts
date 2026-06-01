import { Injectable, signal } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { Transaction } from '../models';
import { TxLang } from '../i18n/lang.types';
import {
  CATEGORY_LABELS,
  EXPORT_HEADERS,
  STATUS_LABELS,
  TYPE_LABELS,
} from '../i18n/enum-labels.i18n';

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
const CSV_BOM = '﻿';
const CSV_SEPARATOR = ';';
const TOAST_SUCCESS_DISMISS_MS = 2500;
const TOAST_ERROR_DISMISS_MS = 4000;

@Injectable({ providedIn: 'root' })
export class ExportService {
  private readonly exportPhaseValue = signal<ExportPhase>('idle');

  readonly exportPhase = this.exportPhaseValue.asReadonly();

  exportToXLSX(transactions: Transaction[], lang: TxLang = 'es'): Observable<void> {
    return new Observable<void>((subscriber) => {
      this.exportPhaseValue.set('preparing');

      if (typeof Worker !== 'undefined') {
        const worker = new Worker(
          new URL('../workers/export.worker', import.meta.url),
          { type: 'module' },
        );

        worker.onmessage = ({ data }: MessageEvent<ExportResponse>) => {
          this.exportPhaseValue.set(data.phase);
          if ('success' in data && data.success) {
            this.exportPhaseValue.set('downloading');
            this.downloadBlob(data.blob, XLSX_FILENAME);
            this.exportPhaseValue.set('success');
            worker.terminate();
            subscriber.next();
            subscriber.complete();
            this.scheduleIdleReset(TOAST_SUCCESS_DISMISS_MS);
          } else if ('success' in data) {
            this.exportPhaseValue.set('error');
            worker.terminate();
            subscriber.error(new Error(data.error));
            this.scheduleIdleReset(TOAST_ERROR_DISMISS_MS);
          }
        };
        worker.onerror = (err: ErrorEvent) => {
          this.exportPhaseValue.set('error');
          worker.terminate();
          subscriber.error(err);
          this.scheduleIdleReset(TOAST_ERROR_DISMISS_MS);
        };
        worker.postMessage({ rows: transactions, lang });
      } else {
        this.exportSyncCSV(transactions, lang);
        subscriber.next();
        subscriber.complete();
        this.scheduleIdleReset(TOAST_SUCCESS_DISMISS_MS);
      }
    });
  }

  private exportSyncCSV(transactions: Transaction[], lang: TxLang): void {
    this.exportPhaseValue.set('generating');
    const csvRows = [EXPORT_HEADERS[lang].join(CSV_SEPARATOR)];

    for (const row of transactions) {
      csvRows.push([
        row.id,
        row.fecha,
        TYPE_LABELS[lang][row.tipo],
        `"${row.descripcion}"`,
        row.iban,
        row.importe.toFixed(2),
        row.divisa,
        STATUS_LABELS[lang][row.estado],
        CATEGORY_LABELS[lang][row.categoria],
      ].join(CSV_SEPARATOR));
    }

    const csvContent = csvRows.join('\n');
    const blob = new Blob([CSV_BOM + csvContent], { type: CSV_MIME });
    this.exportPhaseValue.set('downloading');
    this.downloadBlob(blob, CSV_FALLBACK_FILENAME);
    this.exportPhaseValue.set('success');
  }

  private scheduleIdleReset(delayMs: number): void {
    timer(delayMs).subscribe(() => this.exportPhaseValue.set('idle'));
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
