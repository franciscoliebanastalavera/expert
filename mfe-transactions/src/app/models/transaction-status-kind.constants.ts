import { CapStatusBadgeKind } from '@capitalflow/shared-ui';
import { TransactionStatus } from './transaction.model';

export const TRANSACTION_STATUS_KIND_MAP: Record<TransactionStatus, CapStatusBadgeKind> = {
  [TransactionStatus.Completed]: 'success',
  [TransactionStatus.Processing]: 'warning',
  [TransactionStatus.Pending]: 'info',
  [TransactionStatus.Rejected]: 'danger',
};
