import { ExportPhase } from './services/export.service';

export const TRANSACTIONS_TEXT = {
  TITLE: 'Transacciones',
  SUBTITLE_SUFFIX: 'transacciones - Virtual Scroll CDK',
  SUBTITLE_LOADING: 'Cargando...',
  LOADING_LABEL: 'Cargando transacciones...',
  FILTERS: {
    SEARCH: 'Buscar',
    SEARCH_PLACEHOLDER: 'Buscar por descripción, tipo, IBAN...',
    AMOUNT_MIN: 'Importe mínimo',
    AMOUNT_MAX: 'Importe máximo',
    CLEAR: 'Limpiar',
    EXPORT: 'Exportar Excel',
    EXPORTING: 'Exportando...',
  },
  ERRORS: {
    TEXT_INVALID: 'Caracteres no permitidos',
    AMOUNT_NEGATIVE: 'El importe no puede ser negativo',
    AMOUNT_TOO_LARGE: 'Importe demasiado grande',
    AMOUNT_RANGE: 'El mínimo no puede ser mayor que el máximo',
  },
  STATS: {
    TOTAL: 'Total Registros',
    INCOME: 'Total Ingresos',
    EXPENSES: 'Total Gastos',
    DATASET_TOTAL: 'Filas del dataset',
    FILTERED_ROWS: 'Filas filtradas',
    DOM_ROWS: 'Filas DOM',
    LAST_FILTER_MS: 'Último filtro ms',
  },
  GRID: {
    ID: 'ID',
    DATE: 'Fecha',
    TYPE: 'Tipo',
    DESCRIPTION: 'Descripción',
    IBAN: 'IBAN',
    AMOUNT: 'Importe',
    STATUS: 'Estado',
    CATEGORY: 'Categoría',
  },
} as const;

export const TRANSACTIONS_EXPORT_PHASE_LABEL: Record<ExportPhase, string> = {
  idle: 'Exportación inactiva',
  preparing: 'Preparando exportación...',
  generating: 'Generando libro...',
  downloading: 'Descargando archivo...',
  success: 'Exportación completada.',
  error: 'La exportación ha fallado.',
};
