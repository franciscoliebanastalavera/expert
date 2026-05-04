export type VulnerabilityStatus = 'mitigated' | 'partial' | 'documented';
export type VulnerabilitySource = 'briefing' | 'additional-control';

export interface VulnerabilityRow {
  readonly id: string;
  readonly source: VulnerabilitySource;
  readonly titleKey: string;
  readonly descriptionKey: string;
  readonly mitigationKey: string;
  readonly status: VulnerabilityStatus;
  readonly demoRoute: string | null;
  readonly fileReferences: readonly string[];
}
