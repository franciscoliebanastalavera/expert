import { Payment, PaymentStatus } from '../app/payments.types';

export const PAYMENT_FIXTURES: readonly Payment[] = [
  { id: 'PMT-TEST-0001', beneficiary: 'Test Beneficiary 1', amount: 100, status: PaymentStatus.Approved, date: '01/01/2026' },
  { id: 'PMT-TEST-0002', beneficiary: 'Test Beneficiary 2', amount: 1234.56, status: PaymentStatus.Pending, date: '02/01/2026' },
];
