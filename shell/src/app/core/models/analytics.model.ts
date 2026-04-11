export interface AnalyticsFilter {
  texto: string;
  fechaDesde: string;
  fechaHasta: string;
  importeMin: number | null;
  importeMax: number | null;
}

export interface GridColumn {
  key: string;
  label: string;
  width: number;
}
