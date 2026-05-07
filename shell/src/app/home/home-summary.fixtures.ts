import { CapDonutSegment } from '@capitalflow/shared-ui/lib/cap-donut-chart/cap-donut-chart.types';
import { CapTrendSeries } from '@capitalflow/shared-ui/lib/cap-trend-chart/cap-trend-chart.types';

export const HOME_SUMMARY_KPI_VALUES = {
  BALANCE: '12.500 €',
  INCOME: '4.200 €',
  EXPENSES: '2.620 €',
  SAVINGS: '1.580 €',
} as const;

export const HOME_TREND_LABELS: readonly string[] = ['Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr'];

export const HOME_TREND_SERIES: readonly CapTrendSeries[] = [
  {
    id: 'income',
    label: 'HOME.SUMMARY.TREND.INCOME',
    data: [3800, 4100, 4250, 4180, 4350, 4200],
    colorVar: 'var(--cap-primary)',
    fill: true,
  },
  {
    id: 'expenses',
    label: 'HOME.SUMMARY.TREND.EXPENSES',
    data: [2900, 3050, 2820, 2750, 2680, 2620],
    colorVar: 'var(--cap-warning, #f59e0b)',
    fill: true,
  },
];

export const HOME_DONUT_SEGMENTS: readonly CapDonutSegment[] = [
  { id: 'housing', label: 'HOME.SUMMARY.CATEGORIES.HOUSING', value: 1250, colorVar: 'var(--cap-primary)' },
  { id: 'food', label: 'HOME.SUMMARY.CATEGORIES.FOOD', value: 480, colorVar: 'var(--cap-secondary, #2a85c4)' },
  { id: 'transport', label: 'HOME.SUMMARY.CATEGORIES.TRANSPORT', value: 320, colorVar: 'var(--cap-warning, #f59e0b)' },
  { id: 'entertainment', label: 'HOME.SUMMARY.CATEGORIES.ENTERTAINMENT', value: 180, colorVar: 'var(--cap-info, #3b82f6)' },
  { id: 'other', label: 'HOME.SUMMARY.CATEGORIES.OTHER', value: 90, colorVar: 'var(--cap-text-muted, #6b7280)' },
];

export interface HomeQuickAccessCard {
  readonly id: string;
  readonly titleKey: string;
  readonly descriptionKey: string;
  readonly route: string;
}

export const HOME_QUICK_ACCESS_CARDS: readonly HomeQuickAccessCard[] = [
  {
    id: 'transactions',
    titleKey: 'HOME.SUMMARY.QUICK_ACCESS.TRANSACTIONS_TITLE',
    descriptionKey: 'HOME.SUMMARY.QUICK_ACCESS.TRANSACTIONS_DESC',
    route: '/transactions',
  },
  {
    id: 'analytics',
    titleKey: 'HOME.SUMMARY.QUICK_ACCESS.ANALYTICS_TITLE',
    descriptionKey: 'HOME.SUMMARY.QUICK_ACCESS.ANALYTICS_DESC',
    route: '/analytics',
  },
  {
    id: 'payments',
    titleKey: 'HOME.SUMMARY.QUICK_ACCESS.PAYMENTS_TITLE',
    descriptionKey: 'HOME.SUMMARY.QUICK_ACCESS.PAYMENTS_DESC',
    route: '/payments',
  },
];
