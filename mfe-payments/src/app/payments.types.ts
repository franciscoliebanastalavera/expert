export enum PaymentStatus {
  Approved = 'approved',
  Processing = 'processing',
  Pending = 'pending',
  Rejected = 'rejected',
}

export interface Payment {
  id: string;
  beneficiary: string;
  amount: number;
  status: PaymentStatus;
  date: string;
}

export type PaymentStatusKind = 'success' | 'warning' | 'info' | 'danger';
