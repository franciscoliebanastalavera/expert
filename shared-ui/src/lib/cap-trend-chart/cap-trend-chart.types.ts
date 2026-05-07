export interface CapTrendSeries {
  readonly id: string;
  readonly label: string;
  readonly data: readonly number[];
  readonly colorVar?: string;
  readonly fill?: boolean;
}

export interface CapTrendSeriesGeometry {
  readonly id: string;
  readonly label: string;
  readonly color: string;
  readonly linePath: string;
  readonly fillPath: string;
  readonly fillEnabled: boolean;
}

export interface CapTrendAxis {
  readonly ticks: readonly number[];
  readonly min: number;
  readonly max: number;
}
