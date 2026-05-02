/// <reference lib="webworker" />

import type { Transaction } from '../core/models';

interface ExportRequest {
  rows: Transaction[];
}

interface ExportSuccess {
  success: true;
  blob: Blob;
}

interface ExportFailure {
  success: false;
  error: string;
}

type ExportResponse = ExportSuccess | ExportFailure;

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

addEventListener('message', async ({ data }: MessageEvent<ExportRequest>) => {
  try {
    const ExcelJS = await import('exceljs');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Transacciones');
    worksheet.columns = COLUMNS;
    worksheet.addRows(data.rows);
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: XLSX_MIME });
    const response: ExportResponse = { success: true, blob };
    postMessage(response);
  } catch (error) {
    const response: ExportResponse = { success: false, error: String(error) };
    postMessage(response);
  }
});
