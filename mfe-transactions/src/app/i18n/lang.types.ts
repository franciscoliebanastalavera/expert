// Framework-free language primitives. Safe to import from the export Web Worker
// (no Angular in the import graph).
export type TxLang = 'es' | 'en';

export function detectTxLang(htmlLang: string | null | undefined): TxLang {
  return htmlLang?.toLowerCase() === 'en' ? 'en' : 'es';
}
