import { PaymentStatus } from './payments.types';

export type PaymentsLang = 'es' | 'en';

export interface PaymentsColumnLabels {
  id: string;
  beneficiary: string;
  amount: string;
  status: string;
  date: string;
}

export interface PaymentsStrings {
  title: string;
  subtitle: string;
  kpiVolumeTitle: string;
  kpiVolumeDesc: string;
  kpiPendingTitle: string;
  kpiPendingDesc: string;
  kpiAvgTitle: string;
  kpiAvgDesc: string;
  footer: string;
  status: Record<PaymentStatus, string>;
  columns: PaymentsColumnLabels;
}

// Subtitle is a fixed technical tagline (kept identical across languages on purpose).
const SUBTITLE = 'International Payments · MFE Angular 17';

export const PAYMENTS_I18N: Record<PaymentsLang, PaymentsStrings> = {
  es: {
    title: 'Pagos Internacionales',
    subtitle: SUBTITLE,
    kpiVolumeTitle: 'Volumen Pagado',
    kpiVolumeDesc: 'Acumulado del trimestre actual',
    kpiPendingTitle: 'Pagos Pendientes',
    kpiPendingDesc: 'Operaciones en espera de aprobación',
    kpiAvgTitle: 'Tiempo Medio',
    kpiAvgDesc: 'Días promedio de procesamiento',
    footer:
      'En fase 2 conexión con servicio Payments backend (REST + WebSocket para estado en tiempo real).',
    status: {
      [PaymentStatus.Approved]: 'Aprobado',
      [PaymentStatus.Processing]: 'Procesando',
      [PaymentStatus.Pending]: 'Pendiente',
      [PaymentStatus.Rejected]: 'Rechazado',
    },
    columns: { id: 'ID', beneficiary: 'Beneficiario', amount: 'Importe', status: 'Estado', date: 'Fecha' },
  },
  en: {
    title: 'International Payments',
    subtitle: SUBTITLE,
    kpiVolumeTitle: 'Paid Volume',
    kpiVolumeDesc: 'Current quarter cumulative',
    kpiPendingTitle: 'Pending Payments',
    kpiPendingDesc: 'Operations awaiting approval',
    kpiAvgTitle: 'Average Time',
    kpiAvgDesc: 'Average processing days',
    footer:
      'Phase 2 will connect to the Payments backend service (REST + WebSocket for real-time status).',
    status: {
      [PaymentStatus.Approved]: 'Approved',
      [PaymentStatus.Processing]: 'Processing',
      [PaymentStatus.Pending]: 'Pending',
      [PaymentStatus.Rejected]: 'Rejected',
    },
    columns: { id: 'ID', beneficiary: 'Beneficiary', amount: 'Amount', status: 'Status', date: 'Date' },
  },
};

export function detectLang(htmlLang: string | null | undefined): PaymentsLang {
  return htmlLang?.toLowerCase() === 'en' ? 'en' : 'es';
}
