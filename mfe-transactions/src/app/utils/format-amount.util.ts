export interface FormatAmountOptions {
  locale: string;
  fractionDigits: number;
  currencySuffix?: string;
  useGrouping?: boolean;
  includeSign?: boolean;
  positiveSign?: string;
  negativeSign?: string;
  useAbs?: boolean;
}

export function formatAmount(value: number, options: FormatAmountOptions): string {
  const target = options.useAbs ? Math.abs(value) : value;
  const localeOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits: options.fractionDigits,
    maximumFractionDigits: options.fractionDigits,
  };
  if (options.useGrouping !== undefined) {
    localeOptions.useGrouping = options.useGrouping;
  }
  const formatted = target.toLocaleString(options.locale, localeOptions);
  const sign = options.includeSign
    ? value >= 0
      ? options.positiveSign ?? '+'
      : options.negativeSign ?? '-'
    : '';
  const suffix = options.currencySuffix ?? '';
  return `${sign}${formatted}${suffix}`;
}
