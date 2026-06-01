import {
  TransactionCategory,
  TransactionStatus,
  TransactionType,
} from '../models/transaction.model';
import { TxLang } from './lang.types';

// Display labels for the enum data columns, keyed by the (Spanish) enum value.
// The Spanish set equals the enum values; the English set provides the translation.
// Status colours stay keyed by the original enum value, so they survive localisation.

export const STATUS_LABELS: Record<TxLang, Record<TransactionStatus, string>> = {
  es: {
    [TransactionStatus.Completed]: 'Completada',
    [TransactionStatus.Processing]: 'Procesando',
    [TransactionStatus.Pending]: 'Pendiente',
    [TransactionStatus.Rejected]: 'Rechazada',
  },
  en: {
    [TransactionStatus.Completed]: 'Completed',
    [TransactionStatus.Processing]: 'Processing',
    [TransactionStatus.Pending]: 'Pending',
    [TransactionStatus.Rejected]: 'Rejected',
  },
};

export const TYPE_LABELS: Record<TxLang, Record<TransactionType, string>> = {
  es: {
    [TransactionType.SepaTranfer]: 'Transferencia SEPA',
    [TransactionType.Payroll]: 'Pago Nómina',
    [TransactionType.InvoiceCollection]: 'Cobro Factura',
    [TransactionType.DirectDebit]: 'Domiciliación',
    [TransactionType.InternationalTransfer]: 'Transferencia Internacional',
    [TransactionType.SupplierPayment]: 'Pago Proveedor',
    [TransactionType.ClientIncome]: 'Ingreso Cliente',
  },
  en: {
    [TransactionType.SepaTranfer]: 'SEPA Transfer',
    [TransactionType.Payroll]: 'Payroll Payment',
    [TransactionType.InvoiceCollection]: 'Invoice Collection',
    [TransactionType.DirectDebit]: 'Direct Debit',
    [TransactionType.InternationalTransfer]: 'International Transfer',
    [TransactionType.SupplierPayment]: 'Supplier Payment',
    [TransactionType.ClientIncome]: 'Client Income',
  },
};

export const CATEGORY_LABELS: Record<TxLang, Record<TransactionCategory, string>> = {
  es: {
    [TransactionCategory.Treasury]: 'Tesorería',
    [TransactionCategory.Payroll]: 'Nóminas',
    [TransactionCategory.Suppliers]: 'Proveedores',
    [TransactionCategory.Clients]: 'Clientes',
    [TransactionCategory.Taxes]: 'Impuestos',
    [TransactionCategory.Insurance]: 'Seguros',
    [TransactionCategory.Services]: 'Servicios',
  },
  en: {
    [TransactionCategory.Treasury]: 'Treasury',
    [TransactionCategory.Payroll]: 'Payroll',
    [TransactionCategory.Suppliers]: 'Suppliers',
    [TransactionCategory.Clients]: 'Clients',
    [TransactionCategory.Taxes]: 'Taxes',
    [TransactionCategory.Insurance]: 'Insurance',
    [TransactionCategory.Services]: 'Services',
  },
};

// Excel / CSV export chrome.
export const EXPORT_HEADERS: Record<TxLang, readonly string[]> = {
  es: ['ID', 'Fecha', 'Tipo', 'Descripción', 'IBAN', 'Importe', 'Divisa', 'Estado', 'Categoría'],
  en: ['ID', 'Date', 'Type', 'Description', 'IBAN', 'Amount', 'Currency', 'Status', 'Category'],
};

export const EXPORT_TITLE: Record<TxLang, string> = {
  es: 'CapitalFlow — Transacciones',
  en: 'CapitalFlow — Transactions',
};

export const EXPORT_SHEET_NAME: Record<TxLang, string> = {
  es: 'Transacciones',
  en: 'Transactions',
};

export const EXPORT_SUBTITLE: Record<TxLang, { prefix: string; suffix: string; locale: string }> = {
  es: { prefix: 'Exportado el', suffix: 'transacciones', locale: 'es-ES' },
  en: { prefix: 'Exported on', suffix: 'transactions', locale: 'en-GB' },
};
