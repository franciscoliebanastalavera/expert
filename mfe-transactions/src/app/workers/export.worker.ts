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

type ExcelJsModule = typeof import('exceljs');

const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

const SHEET_NAME = 'Transacciones';
const REPORT_TITLE = 'CapitalFlow — Transacciones';
const COLUMN_HEADERS = ['ID', 'Fecha', 'Tipo', 'Descripción', 'IBAN', 'Importe', 'Divisa', 'Estado', 'Categoría'];
const COLUMN_WIDTHS = [8, 14, 22, 36, 28, 16, 8, 14, 20];
const COLUMN_COUNT = COLUMN_HEADERS.length;
const IMPORTE_COLUMN_INDEX = 6;
const ESTADO_COLUMN_INDEX = 8;
const IMPORTE_COLUMN_LETTER = 'F';
const ESTADO_COLUMN_LETTER = 'H';

const TITLE_ROW = 1;
const SUBTITLE_ROW = 2;
const SPACER_ROW = 3;
const HEADER_ROW = 4;
const FIRST_DATA_ROW = 5;

const TITLE_HEIGHT = 30;
const SUBTITLE_HEIGHT = 18;
const SPACER_HEIGHT = 8;
const HEADER_HEIGHT = 26;

const FONT_NAME = 'Calibri';

const BRAND_PRIMARY_ARGB = 'FF2A85C4';
const HEADER_FG_ARGB = 'FFFFFFFF';
const TITLE_FG_ARGB = 'FF1E1E1E';
const SUBTITLE_FG_ARGB = 'FF6B7280';
const POSITIVE_ARGB = 'FF1F7A36';
const NEGATIVE_ARGB = 'FFC51321';

interface StatusStyle {
  readonly value: string;
  readonly bg: string;
  readonly fg: string;
}

const STATUS_STYLES: readonly StatusStyle[] = [
  { value: 'Completada', bg: 'FFD7F2DD', fg: 'FF1F7A36' },
  { value: 'Procesando', bg: 'FFFDE9C8', fg: 'FF8A5A00' },
  { value: 'Pendiente', bg: 'FFD3E6F7', fg: 'FF1F5A8A' },
  { value: 'Rechazada', bg: 'FFF7D3D3', fg: 'FF8A1F1F' },
];

const SUBTITLE_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
};

addEventListener('message', async ({ data }: MessageEvent<ExportRequest>) => {
  postPhase('preparing');
  try {
    const ExcelJS = await import('exceljs');
    postPhase('generating');
    const workbook = buildWorkbook(ExcelJS, data.rows);
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: XLSX_MIME });
    const success: ExportResponse = { success: true, phase: 'success', blob };
    postMessage(success);
  } catch (error) {
    const failure: ExportResponse = { success: false, phase: 'error', error: String(error) };
    postMessage(failure);
  }
});

function buildWorkbook(ExcelJS: ExcelJsModule, rows: readonly Transaction[]): import('exceljs').Workbook {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'CapitalFlow';
  workbook.created = new Date();
  workbook.title = REPORT_TITLE;

  const worksheet = workbook.addWorksheet(SHEET_NAME);

  COLUMN_WIDTHS.forEach((width, i) => {
    worksheet.getColumn(i + 1).width = width;
  });

  worksheet.getColumn(IMPORTE_COLUMN_INDEX).numFmt = '#,##0.00 "€"';
  worksheet.getColumn(IMPORTE_COLUMN_INDEX).alignment = { horizontal: 'right' };
  worksheet.getColumn(ESTADO_COLUMN_INDEX).alignment = { horizontal: 'center' };

  worksheet.mergeCells(TITLE_ROW, 1, TITLE_ROW, COLUMN_COUNT);
  const titleCell = worksheet.getCell(TITLE_ROW, 1);
  titleCell.value = REPORT_TITLE;
  titleCell.font = { name: FONT_NAME, size: 18, bold: true, color: { argb: TITLE_FG_ARGB } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'left' };
  worksheet.getRow(TITLE_ROW).height = TITLE_HEIGHT;

  worksheet.mergeCells(SUBTITLE_ROW, 1, SUBTITLE_ROW, COLUMN_COUNT);
  const subtitleCell = worksheet.getCell(SUBTITLE_ROW, 1);
  subtitleCell.value = formatSubtitle(rows.length);
  subtitleCell.font = { name: FONT_NAME, size: 10, italic: true, color: { argb: SUBTITLE_FG_ARGB } };
  subtitleCell.alignment = { vertical: 'middle', horizontal: 'left' };
  worksheet.getRow(SUBTITLE_ROW).height = SUBTITLE_HEIGHT;

  worksheet.getRow(SPACER_ROW).height = SPACER_HEIGHT;

  const headerRow = worksheet.getRow(HEADER_ROW);
  COLUMN_HEADERS.forEach((header, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = header;
    cell.font = { name: FONT_NAME, bold: true, color: { argb: HEADER_FG_ARGB } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BRAND_PRIMARY_ARGB } };
    cell.alignment = { horizontal: 'left', vertical: 'middle' };
  });
  headerRow.height = HEADER_HEIGHT;

  for (let i = 0; i < rows.length; i += 1) {
    const source = rows[i];
    const sheetRow = worksheet.getRow(FIRST_DATA_ROW + i);
    sheetRow.getCell(1).value = source.id;
    sheetRow.getCell(2).value = source.fecha;
    sheetRow.getCell(3).value = source.tipo;
    sheetRow.getCell(4).value = source.descripcion;
    sheetRow.getCell(5).value = source.iban;
    sheetRow.getCell(6).value = source.importe;
    sheetRow.getCell(7).value = source.divisa;
    sheetRow.getCell(8).value = source.estado;
    sheetRow.getCell(9).value = source.categoria;
  }

  if (rows.length > 0) {
    const lastDataRow = FIRST_DATA_ROW + rows.length - 1;
    applyImporteConditionalFormat(worksheet, lastDataRow);
    applyEstadoConditionalFormat(worksheet, lastDataRow);
    worksheet.autoFilter = {
      from: { row: HEADER_ROW, column: 1 },
      to: { row: HEADER_ROW + rows.length, column: COLUMN_COUNT },
    };
  }

  worksheet.views = [{ state: 'frozen', xSplit: 0, ySplit: HEADER_ROW }];

  return workbook;
}

function applyImporteConditionalFormat(
  worksheet: import('exceljs').Worksheet,
  lastDataRow: number,
): void {
  worksheet.addConditionalFormatting({
    ref: `${IMPORTE_COLUMN_LETTER}${FIRST_DATA_ROW}:${IMPORTE_COLUMN_LETTER}${lastDataRow}`,
    rules: [
      {
        type: 'cellIs',
        operator: 'lessThan',
        priority: 1,
        formulae: ['0'],
        style: {
          font: { name: FONT_NAME, bold: true, color: { argb: NEGATIVE_ARGB } },
        },
      },
      {
        type: 'cellIs',
        operator: 'greaterThan',
        priority: 2,
        formulae: ['0'],
        style: {
          font: { name: FONT_NAME, bold: true, color: { argb: POSITIVE_ARGB } },
        },
      },
    ],
  });
}

function applyEstadoConditionalFormat(
  worksheet: import('exceljs').Worksheet,
  lastDataRow: number,
): void {
  worksheet.addConditionalFormatting({
    ref: `${ESTADO_COLUMN_LETTER}${FIRST_DATA_ROW}:${ESTADO_COLUMN_LETTER}${lastDataRow}`,
    rules: STATUS_STYLES.map((status, index) => ({
      type: 'cellIs',
      operator: 'equal',
      priority: index + 1,
      formulae: [`"${status.value}"`],
      style: {
        font: { name: FONT_NAME, bold: true, color: { argb: status.fg } },
        fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: status.bg } },
      },
    })),
  });
}

function formatSubtitle(count: number): string {
  const date = new Date().toLocaleString('es-ES', SUBTITLE_DATE_OPTIONS);
  return `Exportado el ${date} · ${count} transacciones`;
}

function postPhase(phase: ExportPhaseMessage['phase']): void {
  const message: ExportResponse = { phase };
  postMessage(message);
}
