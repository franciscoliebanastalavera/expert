export const MOCK_TRANSACTIONS_COUNT = 120_000;
export const MOCK_API_DELAY_MS = 300;

export const MOCK_DAYS_PER_MONTH = 28;
export const MOCK_MONTHS_RANGE = 4;
export const MOCK_YEAR = 2026;
export const DATE_PART_PAD_LENGTH = 2;
export const DATE_PAD_CHAR = '0';

export const MOCK_IBAN_DIGITS_COUNT = 20;
export const MOCK_IBAN_ACCOUNT_SLICE_END = 22;

export const MOCK_INCOME_PROBABILITY = 0.55;
export const MOCK_MAX_INCOME_AMOUNT = 150_000;
export const MOCK_MAX_EXPENSE_AMOUNT = 100_000;
export const MOCK_AMOUNT_DECIMAL_FACTOR = 100;

export const DEFAULT_CURRENCY = 'EUR';

export const MOCK_COUNTRIES = ['ES', 'DE', 'FR', 'IT', 'PT', 'NL', 'BE'] as const;
export type MockCountry = (typeof MOCK_COUNTRIES)[number];

export const MOCK_DESCRIPTIONS = [
  'Pago factura servicios profesionales',
  'Nómina empleados marzo 2026',
  'Cobro factura cliente Premium',
  'Domiciliación seguro empresarial',
  'Transferencia tesorería central',
  'Pago proveedor materias primas',
  'Ingreso por venta de activos',
  'Liquidación IVA trimestral',
  'Pago alquiler oficinas centrales',
  'Cobro intereses depósito a plazo',
] as const;
export type MockDescription = (typeof MOCK_DESCRIPTIONS)[number];

export const SEARCH_MAX_LENGTH = 80;
export const MAX_AMOUNT = 10_000_000;
export const SAFE_TEXT_PATTERN = /^[\p{L}\p{N}\s\-_.,()€$]*$/u;
