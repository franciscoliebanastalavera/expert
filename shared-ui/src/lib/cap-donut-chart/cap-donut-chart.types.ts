export interface CapDonutSegment {
  readonly id: string;
  readonly label: string;
  readonly value: number;
  readonly colorVar?: string;
}

export interface CapDonutGeometry {
  readonly id: string;
  readonly label: string;
  readonly path: string;
  readonly color: string;
  readonly percentage: number;
}
