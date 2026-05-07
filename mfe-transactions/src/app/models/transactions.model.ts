import { CapTableColumn } from '@capitalflow/shared-ui';
import { TransactionCategory, TransactionStatus, TransactionType } from './transaction.model';

export interface TransactionsStats {
  total: number;
  income: number;
  expenses: number;
}

export interface TransactionsFilterValues {
  texto: string;
  importeMin: number | null;
  importeMax: number | null;
}

export interface TransactionsFilterValidation {
  searchMaxLength: number;
  maxAmount: number;
  safeTextPattern: RegExp;
}

export interface TransactionsMockConfig {
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

export interface TransactionsAmountFormat {
  locale: string;
  fractionDigits: number;
  currencySuffix: string;
}

export interface TransactionsTableConfig {
  itemSizePx: number;
  positiveSign: string;
  negativeSign: string;
  amountFormat: TransactionsAmountFormat;
}

export const TRANSACTIONS_EMPTY_STATS: TransactionsStats = {
  total: 0,
  income: 0,
  expenses: 0,
};

export const TRANSACTIONS_FILTER_DEFAULTS: TransactionsFilterValues = {
  texto: '',
  importeMin: null,
  importeMax: null,
};

export const TRANSACTIONS_FILTER_VALIDATION: TransactionsFilterValidation = {
  searchMaxLength: 80,
  maxAmount: 10_000_000,
  safeTextPattern: /^[\p{L}\p{N}\s\-_.,()\u20ac$]*$/u,
};

export const TRANSACTIONS_MOCK_CONFIG: TransactionsMockConfig = {
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

export const TRANSACTIONS_TABLE_CONFIG: TransactionsTableConfig = {
  itemSizePx: 48,
  positiveSign: '+',
  negativeSign: '-',
  amountFormat: {
    locale: 'es-ES',
    fractionDigits: 2,
    currencySuffix: ' \u20ac',
  },
};

export const TRANSACTIONS_STATS_AMOUNT_FORMAT: TransactionsAmountFormat = {
  locale: 'es-ES',
  fractionDigits: 2,
  currencySuffix: ' \u20ac',
};

export const TRANSACTIONS_GRID_COLUMNS: readonly Omit<CapTableColumn, 'label'>[] = [
  { key: 'id', cssClass: 'transactions-grid__cell--id' },
  { key: 'fecha', cssClass: 'transactions-grid__cell--fecha' },
  { key: 'tipo', cssClass: 'transactions-grid__cell--tipo' },
  { key: 'descripcion', cssClass: 'transactions-grid__cell--desc' },
  { key: 'iban', cssClass: 'transactions-grid__cell--iban' },
  { key: 'importe', cssClass: 'transactions-grid__cell--importe' },
  { key: 'estado', cssClass: 'transactions-grid__cell--estado' },
  { key: 'categoria', cssClass: 'transactions-grid__cell--cat' },
];

export const TRANSACTIONS_TRANSACTION_TYPES = Object.values(TransactionType);
export const TRANSACTIONS_TRANSACTION_STATUSES = Object.values(TransactionStatus);
export const TRANSACTIONS_TRANSACTION_CATEGORIES = Object.values(TransactionCategory);
