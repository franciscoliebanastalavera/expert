import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CAP_TREND_AXIS_LABEL_OFFSET_X,
  CAP_TREND_AXIS_LABEL_OFFSET_Y,
  CAP_TREND_AXIS_TICK_COUNT,
  CAP_TREND_DEFAULT_HEIGHT_PX,
  CAP_TREND_DEFAULT_PALETTE,
  CAP_TREND_FILL_OPACITY_BOTTOM,
  CAP_TREND_FILL_OPACITY_TOP,
  CAP_TREND_NICE_FRACTION_HIGH,
  CAP_TREND_NICE_FRACTION_LOW,
  CAP_TREND_NICE_FRACTION_MID,
  CAP_TREND_PADDING_BOTTOM,
  CAP_TREND_PADDING_LEFT,
  CAP_TREND_PADDING_RIGHT,
  CAP_TREND_PADDING_TOP,
  CAP_TREND_VIEWBOX_HEIGHT,
  CAP_TREND_VIEWBOX_WIDTH,
} from './cap-trend-chart.constants';
import { CapTrendAxis, CapTrendSeries, CapTrendSeriesGeometry } from './cap-trend-chart.types';

const NICE_FRACTION_RESULT_LOW = 1;
const NICE_FRACTION_RESULT_MID = 2;
const NICE_FRACTION_RESULT_HIGH = 5;
const NICE_FRACTION_RESULT_MAX = 10;
const SAFE_TICK_COUNT = 4;
const LOG_BASE_TEN = 10;
const RANGE_FALLBACK = 1;

export function niceTicks(min: number, max: number, tickCount: number): readonly number[] {
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return [0];
  }
  if (min === max) {
    return [min];
  }
  const range = Math.max(max - min, RANGE_FALLBACK);
  const safeCount = Math.max(tickCount - 1, SAFE_TICK_COUNT - 1);
  const roughStep = range / safeCount;
  const magnitude = Math.pow(LOG_BASE_TEN, Math.floor(Math.log(roughStep) / Math.log(LOG_BASE_TEN)));
  const normalised = roughStep / magnitude;
  let niceFraction: number;
  if (normalised <= CAP_TREND_NICE_FRACTION_LOW) {
    niceFraction = NICE_FRACTION_RESULT_LOW;
  } else if (normalised <= CAP_TREND_NICE_FRACTION_MID) {
    niceFraction = NICE_FRACTION_RESULT_MID;
  } else if (normalised <= CAP_TREND_NICE_FRACTION_HIGH) {
    niceFraction = NICE_FRACTION_RESULT_HIGH;
  } else {
    niceFraction = NICE_FRACTION_RESULT_MAX;
  }
  const step = niceFraction * magnitude;
  const niceMin = Math.floor(min / step) * step;
  const niceMax = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let value = niceMin; value <= niceMax + step / 2; value += step) {
    ticks.push(Number(value.toFixed(10)));
  }
  return ticks;
}

@Component({
  selector: 'cap-trend-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cap-trend-chart.component.html',
  styleUrls: ['./cap-trend-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CapTrendChartComponent {
  readonly title = input<string>('');
  readonly labels = input.required<readonly string[]>();
  readonly series = input.required<readonly CapTrendSeries[]>();
  readonly height = input<number>(CAP_TREND_DEFAULT_HEIGHT_PX);
  readonly showGrid = input<boolean>(true);

  readonly viewBoxWidth = CAP_TREND_VIEWBOX_WIDTH;
  readonly viewBoxHeight = CAP_TREND_VIEWBOX_HEIGHT;
  readonly paddingLeft = CAP_TREND_PADDING_LEFT;
  readonly paddingRight = CAP_TREND_PADDING_RIGHT;
  readonly paddingTop = CAP_TREND_PADDING_TOP;
  readonly paddingBottom = CAP_TREND_PADDING_BOTTOM;
  readonly axisLabelOffsetX = CAP_TREND_AXIS_LABEL_OFFSET_X;
  readonly axisLabelOffsetY = CAP_TREND_AXIS_LABEL_OFFSET_Y;
  readonly fillOpacityTop = CAP_TREND_FILL_OPACITY_TOP;
  readonly fillOpacityBottom = CAP_TREND_FILL_OPACITY_BOTTOM;

  readonly axis = computed<CapTrendAxis>(() => {
    const allValues = this.series().flatMap((s) => [...s.data]);
    if (allValues.length === 0) {
      return { ticks: [0], min: 0, max: 0 };
    }
    const rawMin = Math.min(0, ...allValues);
    const rawMax = Math.max(...allValues);
    const ticks = niceTicks(rawMin, rawMax, CAP_TREND_AXIS_TICK_COUNT);
    return {
      ticks,
      min: ticks[0],
      max: ticks[ticks.length - 1],
    };
  });

  readonly seriesGeometries = computed<readonly CapTrendSeriesGeometry[]>(() => {
    const series = this.series();
    const labels = this.labels();
    if (series.length === 0 || labels.length === 0) {
      return [];
    }
    return series.map((s, index) => {
      const color = s.colorVar ?? CAP_TREND_DEFAULT_PALETTE[index % CAP_TREND_DEFAULT_PALETTE.length];
      const points = s.data.map((value, i) => ({
        x: this.getXForIndex(i),
        y: this.getYForValue(value),
      }));
      const linePath = points
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
        .join(' ');
      const baselineY = this.getYForValue(this.axis().min);
      const fillPath = [
        `M ${points[0].x} ${baselineY}`,
        ...points.map((p) => `L ${p.x} ${p.y}`),
        `L ${points[points.length - 1].x} ${baselineY}`,
        'Z',
      ].join(' ');
      return {
        id: s.id,
        label: s.label,
        color,
        linePath,
        fillPath,
        fillEnabled: !!s.fill,
      };
    });
  });

  readonly gridLines = computed<readonly number[]>(() =>
    this.showGrid() ? this.axis().ticks.map((tick) => this.getYForValue(tick)) : [],
  );

  getXForIndex(index: number): number {
    const labels = this.labels();
    if (labels.length <= 1) {
      return this.paddingLeft;
    }
    const usableWidth = this.viewBoxWidth - this.paddingLeft - this.paddingRight;
    return this.paddingLeft + (index * usableWidth) / (labels.length - 1);
  }

  getYForValue(value: number): number {
    const { min, max } = this.axis();
    if (max === min) {
      return this.viewBoxHeight - this.paddingBottom;
    }
    const usableHeight = this.viewBoxHeight - this.paddingTop - this.paddingBottom;
    const ratio = (value - min) / (max - min);
    return this.viewBoxHeight - this.paddingBottom - ratio * usableHeight;
  }
}
