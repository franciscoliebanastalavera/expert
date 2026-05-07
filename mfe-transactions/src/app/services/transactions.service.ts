import { Injectable } from '@angular/core';
import { defer, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Transaction } from '../models';
import {
  TRANSACTIONS_MOCK_CONFIG,
  TRANSACTIONS_TRANSACTION_CATEGORIES,
  TRANSACTIONS_TRANSACTION_STATUSES,
  TRANSACTIONS_TRANSACTION_TYPES,
  TransactionsStats,
} from '../models';

@Injectable({ providedIn: 'root' })
export class TransactionsService {
  private transactions: Transaction[] = [];

  getTransactions(): Observable<Transaction[]> {
    return defer(() => {
      if (this.transactions.length === 0) {
        this.transactions = this.generateMockTransactions();
      }
      return of(this.transactions);
    }).pipe(delay(TRANSACTIONS_MOCK_CONFIG.apiDelayMs));
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

  calculateStats(transactions: Transaction[]): TransactionsStats {
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

    for (let id = 1; id <= TRANSACTIONS_MOCK_CONFIG.transactionsCount; id++) {
      const day = this.randomDatePart(TRANSACTIONS_MOCK_CONFIG.daysPerMonth);
      const month = this.randomDatePart(TRANSACTIONS_MOCK_CONFIG.monthsRange);
      const country = this.randomItem(TRANSACTIONS_MOCK_CONFIG.countries);
      const accountDigits = Array.from({ length: TRANSACTIONS_MOCK_CONFIG.ibanDigitsCount }, () =>
        Math.floor(Math.random() * 10)
      ).join('');
      const isIncome = Math.random() < TRANSACTIONS_MOCK_CONFIG.incomeProbability;

      result.push({
        id,
        fecha: `${day}/${month}/${TRANSACTIONS_MOCK_CONFIG.year}`,
        tipo: this.randomItem(TRANSACTIONS_TRANSACTION_TYPES),
        descripcion: this.randomItem(TRANSACTIONS_MOCK_CONFIG.descriptions),
        iban: `${country}${accountDigits.slice(0, TRANSACTIONS_MOCK_CONFIG.ibanAccountSliceEnd)}`,
        importe: this.randomAmount(isIncome),
        divisa: TRANSACTIONS_MOCK_CONFIG.currency,
        estado: this.randomItem(TRANSACTIONS_TRANSACTION_STATUSES),
        categoria: this.randomItem(TRANSACTIONS_TRANSACTION_CATEGORIES),
      });
    }

    return result;
  }

  private randomDatePart(maxValue: number): string {
    return String(Math.floor(Math.random() * maxValue) + 1).padStart(
      TRANSACTIONS_MOCK_CONFIG.datePartPadLength,
      TRANSACTIONS_MOCK_CONFIG.datePadChar
    );
  }

  private randomAmount(isIncome: boolean): number {
    const maxAmount = isIncome
      ? TRANSACTIONS_MOCK_CONFIG.maxIncomeAmount
      : TRANSACTIONS_MOCK_CONFIG.maxExpenseAmount;
    const amount =
      Math.round(Math.random() * maxAmount * TRANSACTIONS_MOCK_CONFIG.amountDecimalFactor) /
      TRANSACTIONS_MOCK_CONFIG.amountDecimalFactor;
    return isIncome ? amount : -amount;
  }

  private randomItem<T>(items: readonly T[]): T {
    return items[Math.floor(Math.random() * items.length)];
  }
}
