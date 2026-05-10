import { Payment, PaymentStatus, PaymentStatusKind } from './payments.types';
import { CapTableColumn } from '@capitalflow/shared-ui';

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  [PaymentStatus.Approved]: 'Aprobado',
  [PaymentStatus.Processing]: 'Procesando',
  [PaymentStatus.Pending]: 'Pendiente',
  [PaymentStatus.Rejected]: 'Rechazado',
};

export const PAYMENT_STATUS_KIND: Record<PaymentStatus, PaymentStatusKind> = {
  [PaymentStatus.Approved]: 'success',
  [PaymentStatus.Processing]: 'warning',
  [PaymentStatus.Pending]: 'info',
  [PaymentStatus.Rejected]: 'danger',
};

export const PAYMENTS_MOCK: readonly Payment[] = [
  { id: 'PMT-2026-0421', beneficiary: 'ACME Corp Ltd', amount: 250_000, status: PaymentStatus.Approved, date: '28/04/2026' },
  { id: 'PMT-2026-0420', beneficiary: 'Banco Santander S.A.', amount: 87_500, status: PaymentStatus.Processing, date: '27/04/2026' },
  { id: 'PMT-2026-0419', beneficiary: 'EDP Energías de Portugal', amount: 12_300, status: PaymentStatus.Pending, date: '26/04/2026' },
  { id: 'PMT-2026-0418', beneficiary: 'Deutsche Telekom AG', amount: 145_000, status: PaymentStatus.Approved, date: '25/04/2026' },
  { id: 'PMT-2026-0417', beneficiary: 'Acme Subsidiaries SL', amount: 9_800, status: PaymentStatus.Rejected, date: '25/04/2026' },
] as const;

export const PAYMENT_TABLE_COLUMNS: readonly CapTableColumn[] = [
  { key: 'id', label: 'ID', cssClass: 'payments-table__id' },
  { key: 'beneficiary', label: 'Beneficiario', cssClass: 'payments-table__beneficiary' },
  { key: 'amount', label: 'Importe', cssClass: 'payments-table__amount' },
  { key: 'status', label: 'Estado', cssClass: 'payments-table__status' },
  { key: 'date', label: 'Fecha', cssClass: 'payments-table__date' },
] as const;

export const KPI_VOLUME_VALUE = '1.245.300 €';
export const KPI_VOLUME_VARIATION = '+8.2%';
export const KPI_PENDING_VALUE = '12';
export const KPI_PENDING_VARIATION = '-3';
export const KPI_AVG_TIME_VALUE = '2.3';
export const KPI_AVG_TIME_VARIATION = '-0.5';

export const AMOUNT_LOCALE = 'es-ES';
export const AMOUNT_FRACTION_DIGITS = 2;
export const AMOUNT_CURRENCY_SUFFIX = ' €';

export const ICON_METRIC_PAYMENTS = 'metric-payments';
export const ICON_METRIC_ALERT = 'metric-alert';
export const ICON_METRIC_RECONCILIATION = 'metric-reconciliation';
