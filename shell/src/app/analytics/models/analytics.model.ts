import { CapTableColumn } from '@capitalflow/shared-ui';
import { TransactionCategory, TransactionStatus, TransactionType } from '../../core/models';

export interface AnalyticsStats {
  total: number;
  income: number;
  expenses: number;
}

export interface AnalyticsFilterValues {
  texto: string;
  importeMin: number | null;
  importeMax: number | null;
}

export interface AnalyticsFilterValidation {
  searchMaxLength: number;
  maxAmount: number;
  safeTextPattern: RegExp;
}

export interface AnalyticsMockConfig {
  transactionsCount: number;
  apiDelayMs: number;
  daysPerMonth: number;
  monthsRange: number;
  year: number;
  datePartPadLength: number;
  datePadChar: string;
  ibanDigitsCount: number;
  ibanAccountSliceEnd: number;
  incomeProbability: number;
  maxIncomeAmount: number;
  maxExpenseAmount: number;
  amountDecimalFactor: number;
  currency: string;
  countries: readonly string[];
  descriptions: readonly string[];
}

export interface AnalyticsAmountFormat {
  locale: string;
  fractionDigits: number;
  currencySuffix: string;
}

export interface AnalyticsTableConfig {
  itemSizePx: number;
  positiveSign: string;
  negativeSign: string;
  amountFormat: AnalyticsAmountFormat;
}

export const ANALYTICS_EMPTY_STATS: AnalyticsStats = {
  total: 0,
  income: 0,
  expenses: 0,
};

export const ANALYTICS_FILTER_DEFAULTS: AnalyticsFilterValues = {
  texto: '',
  importeMin: null,
  importeMax: null,
};

export const ANALYTICS_FILTER_VALIDATION: AnalyticsFilterValidation = {
  searchMaxLength: 80,
  maxAmount: 10_000_000,
  safeTextPattern: /^[\p{L}\p{N}\s\-_.,()\u20ac$]*$/u,
};

export const ANALYTICS_MOCK_CONFIG: AnalyticsMockConfig = {
  transactionsCount: 120_000,
  apiDelayMs: 300,
  daysPerMonth: 28,
  monthsRange: 4,
  year: 2026,
  datePartPadLength: 2,
  datePadChar: '0',
  ibanDigitsCount: 20,
  ibanAccountSliceEnd: 22,
  incomeProbability: 0.55,
  maxIncomeAmount: 150_000,
  maxExpenseAmount: 100_000,
  amountDecimalFactor: 100,
  currency: 'EUR',
  countries: ['ES', 'DE', 'FR', 'IT', 'PT', 'NL', 'BE'],
  descriptions: [
    'Pago factura servicios profesionales',
    'Nomina empleados marzo 2026',
    'Cobro factura cliente Premium',
    'Domiciliacion seguro empresarial',
    'Transferencia tesoreria central',
    'Pago proveedor materias primas',
    'Ingreso por venta de activos',
    'Liquidacion IVA trimestral',
    'Pago alquiler oficinas centrales',
    'Cobro intereses deposito a plazo',
  ],
};

export const ANALYTICS_TABLE_CONFIG: AnalyticsTableConfig = {
  itemSizePx: 48,
  positiveSign: '+',
  negativeSign: '-',
  amountFormat: {
    locale: 'es-ES',
    fractionDigits: 2,
    currencySuffix: ' \u20ac',
  },
};

export const ANALYTICS_STATS_AMOUNT_FORMAT: AnalyticsAmountFormat = {
  locale: 'es-ES',
  fractionDigits: 2,
  currencySuffix: ' \u20ac',
};

export const ANALYTICS_GRID_COLUMNS: readonly Omit<CapTableColumn, 'label'>[] = [
  { key: 'id', cssClass: 'analytics-grid__cell--id' },
  { key: 'fecha', cssClass: 'analytics-grid__cell--fecha' },
  { key: 'tipo', cssClass: 'analytics-grid__cell--tipo' },
  { key: 'descripcion', cssClass: 'analytics-grid__cell--desc' },
  { key: 'iban', cssClass: 'analytics-grid__cell--iban' },
  { key: 'importe', cssClass: 'analytics-grid__cell--importe' },
  { key: 'estado', cssClass: 'analytics-grid__cell--estado' },
  { key: 'categoria', cssClass: 'analytics-grid__cell--cat' },
];

export const ANALYTICS_GRID_TRANSLATION_KEYS = [
  'ANALYTICS.GRID.ID',
  'ANALYTICS.GRID.DATE',
  'ANALYTICS.GRID.TYPE',
  'ANALYTICS.GRID.DESCRIPTION',
  'ANALYTICS.GRID.IBAN',
  'ANALYTICS.GRID.AMOUNT',
  'ANALYTICS.GRID.STATUS',
  'ANALYTICS.GRID.CATEGORY',
] as const;

export const ANALYTICS_TRANSACTION_TYPES = Object.values(TransactionType);
export const ANALYTICS_TRANSACTION_STATUSES = Object.values(TransactionStatus);
export const ANALYTICS_TRANSACTION_CATEGORIES = Object.values(TransactionCategory);
