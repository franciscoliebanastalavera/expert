/**
 * A single security demo entry shown on the admin landing page.
 * Each demo isolates one of the 11 vulnerabilities from the security audit
 * and demonstrates its mitigation pattern.
 */
export interface SecurityDemo {
  readonly titleKey: string;
  readonly descriptionKey: string;
  readonly route: string;
  readonly ctaKey: string;
}
