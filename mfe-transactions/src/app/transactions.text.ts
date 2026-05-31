import { ExportPhase } from './services/export.service';

export type TxLang = 'es' | 'en';

export interface TransactionsTextShape {
  TITLE: string;
  SUBTITLE_SUFFIX: string;
  SUBTITLE_LOADING: string;
  LOADING_LABEL: string;
  FILTERS: {
    SEARCH: string;
    SEARCH_PLACEHOLDER: string;
    AMOUNT_MIN: string;
    AMOUNT_MAX: string;
    CLEAR: string;
    EXPORT: string;
    EXPORTING: string;
  };
  ERRORS: {
    TEXT_INVALID: string;
    AMOUNT_NEGATIVE: string;
    AMOUNT_TOO_LARGE: string;
    AMOUNT_RANGE: string;
  };
  STATS: {
    TOTAL: string;
    INCOME: string;
    EXPENSES: string;
    DATASET_TOTAL: string;
    FILTERED_ROWS: string;
    DOM_ROWS: string;
    LAST_FILTER_MS: string;
  };
  GRID: {
    ID: string;
    DATE: string;
    TYPE: string;
    DESCRIPTION: string;
    IBAN: string;
    AMOUNT: string;
    STATUS: string;
    CATEGORY: string;
  };
}

export const TRANSACTIONS_I18N: Record<TxLang, TransactionsTextShape> = {
  es: {
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
  },
  en: {
    TITLE: 'Transactions',
    SUBTITLE_SUFFIX: 'transactions - Virtual Scroll CDK',
    SUBTITLE_LOADING: 'Loading...',
    LOADING_LABEL: 'Loading transactions...',
    FILTERS: {
      SEARCH: 'Search',
      SEARCH_PLACEHOLDER: 'Search by description, type, IBAN...',
      AMOUNT_MIN: 'Min amount',
      AMOUNT_MAX: 'Max amount',
      CLEAR: 'Clear',
      EXPORT: 'Export Excel',
      EXPORTING: 'Exporting...',
    },
    ERRORS: {
      TEXT_INVALID: 'Invalid characters',
      AMOUNT_NEGATIVE: 'Amount cannot be negative',
      AMOUNT_TOO_LARGE: 'Amount too large',
      AMOUNT_RANGE: 'Min cannot be greater than max',
    },
    STATS: {
      TOTAL: 'Total Records',
      INCOME: 'Total Income',
      EXPENSES: 'Total Expenses',
      DATASET_TOTAL: 'Dataset rows',
      FILTERED_ROWS: 'Filtered rows',
      DOM_ROWS: 'DOM rows',
      LAST_FILTER_MS: 'Last filter ms',
    },
    GRID: {
      ID: 'ID',
      DATE: 'Date',
      TYPE: 'Type',
      DESCRIPTION: 'Description',
      IBAN: 'IBAN',
      AMOUNT: 'Amount',
      STATUS: 'Status',
      CATEGORY: 'Category',
    },
  },
};

// Backward-compatible alias: the Spanish set is the default language.
export const TRANSACTIONS_TEXT = TRANSACTIONS_I18N.es;

export const TRANSACTIONS_EXPORT_PHASE_LABEL_I18N: Record<TxLang, Record<ExportPhase, string>> = {
  es: {
    idle: 'Exportación inactiva',
    preparing: 'Preparando exportación...',
    generating: 'Generando Excel...',
    downloading: 'Descargando archivo...',
    success: 'Exportación completada.',
    error: 'La exportación ha fallado.',
  },
  en: {
    idle: 'Export idle',
    preparing: 'Preparing export...',
    generating: 'Generating Excel...',
    downloading: 'Downloading file...',
    success: 'Export completed.',
    error: 'Export failed.',
  },
};

export const TRANSACTIONS_EXPORT_PHASE_LABEL = TRANSACTIONS_EXPORT_PHASE_LABEL_I18N.es;

export function detectTxLang(htmlLang: string | null | undefined): TxLang {
  return htmlLang?.toLowerCase() === 'en' ? 'en' : 'es';
}
