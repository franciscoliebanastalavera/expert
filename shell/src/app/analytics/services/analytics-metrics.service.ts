import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AnalyticsMetricsService {
  private readonly domNodeCountValue = signal(0);
  private readonly lastFilterMsValue = signal(0);

  readonly domNodeCount = this.domNodeCountValue.asReadonly();
  readonly lastFilterMs = this.lastFilterMsValue.asReadonly();

  recordFilterTime(ms: number): void {
    this.lastFilterMsValue.set(ms);
  }

  recordDomNodeCount(count: number): void {
    this.domNodeCountValue.set(count);
  }
}
