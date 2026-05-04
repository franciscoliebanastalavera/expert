import { Injectable } from '@angular/core';
import { defer, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Transaction } from '../../core/models';
import {
  ANALYTICS_MOCK_CONFIG,
  ANALYTICS_TRANSACTION_CATEGORIES,
  ANALYTICS_TRANSACTION_STATUSES,
  ANALYTICS_TRANSACTION_TYPES,
  AnalyticsStats,
} from '../models/analytics.model';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private transactions: Transaction[] = [];

  getTransactions(): Observable<Transaction[]> {
    return defer(() => {
      if (this.transactions.length === 0) {
        this.transactions = this.generateMockTransactions();
      }
      return of(this.transactions);
    }).pipe(delay(ANALYTICS_MOCK_CONFIG.apiDelayMs));
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
        (transaction) =>
          transaction.descripcion.toLowerCase().includes(term) ||
          transaction.tipo.toLowerCase().includes(term) ||
          transaction.iban.toLowerCase().includes(term) ||
          transaction.categoria.toLowerCase().includes(term)
      );
    }

    if (minAmount !== null) {
      result = result.filter((transaction) => Math.abs(transaction.importe) >= minAmount);
    }

    if (maxAmount !== null) {
      result = result.filter((transaction) => Math.abs(transaction.importe) <= maxAmount);
    }

    return result;
  }

  calculateStats(transactions: Transaction[]): AnalyticsStats {
    return {
      total: transactions.length,
      income: transactions
        .filter((transaction) => transaction.importe > 0)
        .reduce((sum, transaction) => sum + transaction.importe, 0),
      expenses: transactions
        .filter((transaction) => transaction.importe < 0)
        .reduce((sum, transaction) => sum + Math.abs(transaction.importe), 0),
    };
  }

  private generateMockTransactions(): Transaction[] {
    const result: Transaction[] = [];

    for (let id = 1; id <= ANALYTICS_MOCK_CONFIG.transactionsCount; id++) {
      const day = this.randomDatePart(ANALYTICS_MOCK_CONFIG.daysPerMonth);
      const month = this.randomDatePart(ANALYTICS_MOCK_CONFIG.monthsRange);
      const country = this.randomItem(ANALYTICS_MOCK_CONFIG.countries);
      const accountDigits = Array.from({ length: ANALYTICS_MOCK_CONFIG.ibanDigitsCount }, () =>
        Math.floor(Math.random() * 10)
      ).join('');
      const isIncome = Math.random() < ANALYTICS_MOCK_CONFIG.incomeProbability;

      result.push({
        id,
        fecha: `${day}/${month}/${ANALYTICS_MOCK_CONFIG.year}`,
        tipo: this.randomItem(ANALYTICS_TRANSACTION_TYPES),
        descripcion: this.randomItem(ANALYTICS_MOCK_CONFIG.descriptions),
        iban: `${country}${accountDigits.slice(0, ANALYTICS_MOCK_CONFIG.ibanAccountSliceEnd)}`,
        importe: this.randomAmount(isIncome),
        divisa: ANALYTICS_MOCK_CONFIG.currency,
        estado: this.randomItem(ANALYTICS_TRANSACTION_STATUSES),
        categoria: this.randomItem(ANALYTICS_TRANSACTION_CATEGORIES),
      });
    }

    return result;
  }

  private randomDatePart(maxValue: number): string {
    return String(Math.floor(Math.random() * maxValue) + 1).padStart(
      ANALYTICS_MOCK_CONFIG.datePartPadLength,
      ANALYTICS_MOCK_CONFIG.datePadChar
    );
  }

  private randomAmount(isIncome: boolean): number {
    const maxAmount = isIncome
      ? ANALYTICS_MOCK_CONFIG.maxIncomeAmount
      : ANALYTICS_MOCK_CONFIG.maxExpenseAmount;
    const amount =
      Math.round(Math.random() * maxAmount * ANALYTICS_MOCK_CONFIG.amountDecimalFactor) /
      ANALYTICS_MOCK_CONFIG.amountDecimalFactor;
    return isIncome ? amount : -amount;
  }

  private randomItem<T>(items: readonly T[]): T {
    return items[Math.floor(Math.random() * items.length)];
  }
}
