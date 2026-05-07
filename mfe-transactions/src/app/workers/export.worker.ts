import { catchError, from, map, of, switchMap } from 'rxjs';
import type { Transaction } from '../models/transaction.model';

interface ExportRequest {
  rows: Transaction[];
}

interface ExportPhaseMessage {
  phase: 'preparing' | 'generating';
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

const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

const COLUMNS = [
  { header: 'ID', key: 'id', width: 8 },
  { header: 'Fecha', key: 'fecha', width: 12 },
  { header: 'Tipo', key: 'tipo', width: 18 },
  { header: 'Descripción', key: 'descripcion', width: 30 },
  { header: 'IBAN', key: 'iban', width: 26 },
  { header: 'Importe', key: 'importe', width: 12 },
  { header: 'Divisa', key: 'divisa', width: 8 },
  { header: 'Estado', key: 'estado', width: 12 },
  { header: 'Categoría', key: 'categoria', width: 16 },
];

addEventListener('message', ({ data }: MessageEvent<ExportRequest>) => {
  postPhase('preparing');
  from(import('exceljs'))
    .pipe(
      switchMap((ExcelJS) => {
        postPhase('generating');
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Transacciones');
        worksheet.columns = COLUMNS;
        worksheet.addRows(data.rows);
        return from(workbook.xlsx.writeBuffer());
      }),
      map((buffer): ExportResponse => {
        const blob = new Blob([buffer], { type: XLSX_MIME });
        return { success: true, phase: 'success', blob };
      }),
      catchError((error) =>
        of({ success: false, phase: 'error', error: String(error) } as ExportResponse),
      ),
    )
    .subscribe((response) => postMessage(response));
});

function postPhase(phase: ExportPhaseMessage['phase']): void {
  postMessage({ phase });
}
