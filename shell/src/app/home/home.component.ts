import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { combineLatest, map } from 'rxjs';
import { CapInfoCardComponent, CapStatCardComponent } from '@capitalflow/shared-ui';
import { CapDonutChartComponent } from '@capitalflow/shared-ui/lib/cap-donut-chart/cap-donut-chart.component';
import { CapDonutSegment } from '@capitalflow/shared-ui/lib/cap-donut-chart/cap-donut-chart.types';
import { CapTrendChartComponent } from '@capitalflow/shared-ui/lib/cap-trend-chart/cap-trend-chart.component';
import { CapTrendSeries } from '@capitalflow/shared-ui/lib/cap-trend-chart/cap-trend-chart.types';
import {
  HOME_DONUT_SEGMENTS,
  HOME_QUICK_ACCESS_CARDS,
  HOME_SUMMARY_KPI_VALUES,
  HOME_TREND_LABELS,
  HOME_TREND_SERIES,
} from './home-summary.fixtures';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    CapInfoCardComponent,
    CapStatCardComponent,
    CapDonutChartComponent,
    CapTrendChartComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  readonly kpis = HOME_SUMMARY_KPI_VALUES;
  readonly trendLabels = HOME_TREND_LABELS;
  readonly quickAccessCards = HOME_QUICK_ACCESS_CARDS;
  readonly chartHeightPx = 380;

  private readonly trendSeriesLabels = toSignal(
    combineLatest(HOME_TREND_SERIES.map((s) => this.translate.stream(s.label))).pipe(
      map((labels) => labels as readonly string[]),
    ),
    { initialValue: HOME_TREND_SERIES.map((s) => s.label) as readonly string[] },
  );

  readonly trendSeries = computed<readonly CapTrendSeries[]>(() => {
    const labels = this.trendSeriesLabels();
    return HOME_TREND_SERIES.map((series, index) => ({
      ...series,
      label: labels[index] ?? series.label,
    }));
  });

  private readonly donutSegmentLabels = toSignal(
    combineLatest(HOME_DONUT_SEGMENTS.map((s) => this.translate.stream(s.label))).pipe(
      map((labels) => labels as readonly string[]),
    ),
    { initialValue: HOME_DONUT_SEGMENTS.map((s) => s.label) as readonly string[] },
  );

  readonly donutSegments = computed<readonly CapDonutSegment[]>(() => {
    const labels = this.donutSegmentLabels();
    return HOME_DONUT_SEGMENTS.map((segment, index) => ({
      ...segment,
      label: labels[index] ?? segment.label,
    }));
  });

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
