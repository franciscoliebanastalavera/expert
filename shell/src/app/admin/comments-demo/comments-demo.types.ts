export interface TransactionComment {
  readonly id: number;
  readonly author: string;
  readonly transactionRef: string;
  readonly createdAt: string;
  readonly text: string;
}
