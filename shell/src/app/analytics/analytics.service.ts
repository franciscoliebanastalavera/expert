import { Injectable } from '@angular/core';
import { defer, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  Transaction,
  TransactionCategory,
  TransactionStatus,
  TransactionType,
} from '../core/models';
import {
  DATE_PAD_CHAR,
  DATE_PART_PAD_LENGTH,
  DEFAULT_CURRENCY,
  LAZY_GENERATION_THRESHOLD_MS,
  MOCK_AMOUNT_DECIMAL_FACTOR,
  MOCK_API_DELAY_MS,
  MOCK_COUNTRIES,
  MOCK_DAYS_PER_MONTH,
  MOCK_DESCRIPTIONS,
  MOCK_IBAN_ACCOUNT_SLICE_END,
  MOCK_IBAN_DIGITS_COUNT,
  MOCK_INCOME_PROBABILITY,
  MOCK_MAX_EXPENSE_AMOUNT,
  MOCK_MAX_INCOME_AMOUNT,
  MOCK_MONTHS_RANGE,
  MOCK_TRANSACTIONS_COUNT,
  MOCK_YEAR,
} from './analytics.constants';

const TRANSACTION_TYPES = Object.values(TransactionType);
const TRANSACTION_STATUSES = Object.values(TransactionStatus);
const TRANSACTION_CATEGORIES = Object.values(TransactionCategory);

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private transactions: Transaction[] = [];

  getTransactions(): Observable<Transaction[]> {
    return defer(() => {
      if (this.transactions.length === 0) {
        this.transactions = this.generateMockTransactions();
      }
      return of(this.transactions);
    }).pipe(delay(MOCK_API_DELAY_MS));
  }

  filterTransactions(
    transactions: Transaction[],
    search: string,
    minAmount: number | null,
    maxAmount: number | null
  ): Transaction[] {
    let result = [...transactions];

    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.descripcion.toLowerCase().includes(term) ||
          t.tipo.toLowerCase().includes(term) ||
          t.iban.toLowerCase().includes(term) ||
          t.categoria.toLowerCase().includes(term)
      );
    }

    if (minAmount !== null) {
      result = result.filter((t) => Math.abs(t.importe) >= minAmount);
    }

    if (maxAmount !== null) {
      result = result.filter((t) => Math.abs(t.importe) <= maxAmount);
    }

    return result;
  }

  calculateStats(transactions: Transaction[]): { total: number; income: number; expenses: number } {
    return {
      total: transactions.length,
      income: transactions.filter((t) => t.importe > 0).reduce((sum, t) => sum + t.importe, 0),
      expenses: transactions.filter((t) => t.importe < 0).reduce((sum, t) => sum + Math.abs(t.importe), 0),
    };
  }

  private generateMockTransactions(): Transaction[] {
    const start = performance.now();
    const result: Transaction[] = [];

    for (let i = 1; i <= MOCK_TRANSACTIONS_COUNT; i++) {
      const dia = String(Math.floor(Math.random() * MOCK_DAYS_PER_MONTH) + 1)
        .padStart(DATE_PART_PAD_LENGTH, DATE_PAD_CHAR);
      const mes = String(Math.floor(Math.random() * MOCK_MONTHS_RANGE) + 1)
        .padStart(DATE_PART_PAD_LENGTH, DATE_PAD_CHAR);
      const pais = MOCK_COUNTRIES[Math.floor(Math.random() * MOCK_COUNTRIES.length)];
      const numCuenta = Array.from({ length: MOCK_IBAN_DIGITS_COUNT }, () =>
        Math.floor(Math.random() * 10)
      ).join('');
      const esIngreso = Math.random() < MOCK_INCOME_PROBABILITY;

      result.push({
        id: i,
        fecha: `${dia}/${mes}/${MOCK_YEAR}`,
        tipo: TRANSACTION_TYPES[Math.floor(Math.random() * TRANSACTION_TYPES.length)],
        descripcion: MOCK_DESCRIPTIONS[Math.floor(Math.random() * MOCK_DESCRIPTIONS.length)],
        iban: `${pais}${numCuenta.slice(0, MOCK_IBAN_ACCOUNT_SLICE_END)}`,
        importe: esIngreso
          ? Math.round(Math.random() * MOCK_MAX_INCOME_AMOUNT * MOCK_AMOUNT_DECIMAL_FACTOR) / MOCK_AMOUNT_DECIMAL_FACTOR
          : -Math.round(Math.random() * MOCK_MAX_EXPENSE_AMOUNT * MOCK_AMOUNT_DECIMAL_FACTOR) / MOCK_AMOUNT_DECIMAL_FACTOR,
        divisa: DEFAULT_CURRENCY,
        estado: TRANSACTION_STATUSES[Math.floor(Math.random() * TRANSACTION_STATUSES.length)],
        categoria: TRANSACTION_CATEGORIES[Math.floor(Math.random() * TRANSACTION_CATEGORIES.length)],
      });
    }

    const elapsed = performance.now() - start;
    if (elapsed > LAZY_GENERATION_THRESHOLD_MS) {
      console.warn(
        `[AnalyticsService] Mock generation took ${elapsed.toFixed(0)}ms ` +
        `(threshold: ${LAZY_GENERATION_THRESHOLD_MS}ms). ` +
        `For production this would move to Web Worker / streamed pagination.`
      );
    }

    return result;
  }
}
