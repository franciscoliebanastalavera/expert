export interface RemoteMfeConfig {
  remoteEntryPath: string;
  remoteName: string;
  exposedModule: string;
  remoteType: 'script';
  elementTag: string;
  portOffset: number;
  minLoadingDelayMs: number;
  fadeOutDelayMs: number;
  errorMessage: string;
  loadingLabelKey: string;
  retryLabelKey: string;
}

export interface RemoteMfeLoadSuccess {
  readonly success: true;
  readonly customElementTag: string;
  readonly attemptedUrl: string;
}

export interface RemoteMfeLoadFailure {
  readonly success: false;
  readonly error: string;
  readonly attemptedUrl: string;
}

export type RemoteMfeLoadResult = RemoteMfeLoadSuccess | RemoteMfeLoadFailure;

export const REMOTE_MFE_PORTS = {
  https: 443,
  http: 80,
  httpsProtocol: 'https:',
} as const;

export const REMOTE_MFE_TIMEOUT_MS = 15_000;

export const ANALYTICS_REMOTE_MFE_CONFIG: RemoteMfeConfig = {
  remoteEntryPath: '/remoteEntry.js',
  remoteName: 'mfeAnalytics',
  exposedModule: './AnalyticsWeb',
  remoteType: 'script',
  elementTag: 'mfe-analytics',
  portOffset: 1,
  minLoadingDelayMs: 600,
  fadeOutDelayMs: 300,
  errorMessage: 'No se pudo cargar el modulo de Analytics. Verifique que el MFE este en ejecucion.',
  loadingLabelKey: 'MFE.LOADING',
  retryLabelKey: 'MFE.RETRY',
};

export const PAYMENTS_REMOTE_MFE_CONFIG: RemoteMfeConfig = {
  remoteEntryPath: '/remoteEntry.js',
  remoteName: 'mfePayments',
  exposedModule: './PaymentsWeb',
  remoteType: 'script',
  elementTag: 'mfe-payments',
  portOffset: 2,
  minLoadingDelayMs: 600,
  fadeOutDelayMs: 300,
  errorMessage: 'No se pudo cargar el modulo de Payments. Verifique que el MFE este en ejecucion.',
  loadingLabelKey: 'MFE_PAYMENTS.LOADING',
  retryLabelKey: 'MFE_PAYMENTS.RETRY',
};

export const TRANSACTIONS_REMOTE_MFE_CONFIG: RemoteMfeConfig = {
  remoteEntryPath: '/remoteEntry.js',
  remoteName: 'mfeTransactions',
  exposedModule: './TransactionsWeb',
  remoteType: 'script',
  elementTag: 'mfe-transactions',
  portOffset: 3,
  minLoadingDelayMs: 600,
  fadeOutDelayMs: 300,
  errorMessage: 'No se pudo cargar el modulo de Transacciones. Verifique que el MFE este en ejecucion.',
  loadingLabelKey: 'MFE_TRANSACTIONS.LOADING',
  retryLabelKey: 'MFE_TRANSACTIONS.RETRY',
};
