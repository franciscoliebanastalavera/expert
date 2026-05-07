import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CAP_DONUT_DEFAULT_HEIGHT_PX,
  CAP_DONUT_DEFAULT_PALETTE,
  CAP_DONUT_FULL_CIRCLE_DEG,
  CAP_DONUT_FULL_PERCENT,
  CAP_DONUT_HALF_CIRCLE_DEG,
  CAP_DONUT_INNER_RADIUS_RATIO,
  CAP_DONUT_OUTER_RADIUS,
  CAP_DONUT_PADDING_ANGLE_DEG,
  CAP_DONUT_QUARTER_TURN_DEG,
  CAP_DONUT_VIEWBOX_SIZE,
} from './cap-donut-chart.constants';
import { CapDonutGeometry, CapDonutSegment } from './cap-donut-chart.types';

interface PolarPoint {
  readonly x: number;
  readonly y: number;
}

function polarToCartesian(angleDeg: number, radius: number, centre: number): PolarPoint {
  const radians = ((angleDeg - CAP_DONUT_QUARTER_TURN_DEG) * Math.PI) / CAP_DONUT_HALF_CIRCLE_DEG;
  return {
    x: centre + radius * Math.cos(radians),
    y: centre + radius * Math.sin(radians),
  };
}

function buildArcPath(
  startAngle: number,
  endAngle: number,
  outer: number,
  inner: number,
  centre: number,
): string {
  const span = endAngle - startAngle;
  const largeArc = span > CAP_DONUT_HALF_CIRCLE_DEG ? 1 : 0;
  const outerStart = polarToCartesian(startAngle, outer, centre);
  const outerEnd = polarToCartesian(endAngle, outer, centre);
  const innerStart = polarToCartesian(startAngle, inner, centre);
  const innerEnd = polarToCartesian(endAngle, inner, centre);
  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outer} ${outer} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${inner} ${inner} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ');
}

function buildFullRingPath(outer: number, inner: number, centre: number): string {
  const outerTop = polarToCartesian(0, outer, centre);
  const outerBottom = polarToCartesian(CAP_DONUT_HALF_CIRCLE_DEG, outer, centre);
  const innerTop = polarToCartesian(0, inner, centre);
  const innerBottom = polarToCartesian(CAP_DONUT_HALF_CIRCLE_DEG, inner, centre);
  return [
    `M ${outerTop.x} ${outerTop.y}`,
    `A ${outer} ${outer} 0 1 1 ${outerBottom.x} ${outerBottom.y}`,
    `A ${outer} ${outer} 0 1 1 ${outerTop.x} ${outerTop.y}`,
    `M ${innerTop.x} ${innerTop.y}`,
    `A ${inner} ${inner} 0 1 0 ${innerBottom.x} ${innerBottom.y}`,
    `A ${inner} ${inner} 0 1 0 ${innerTop.x} ${innerTop.y}`,
    'Z',
  ].join(' ');
}

@Component({
  selector: 'cap-donut-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cap-donut-chart.component.html',
  styleUrls: ['./cap-donut-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CapDonutChartComponent {
  readonly data = input.required<readonly CapDonutSegment[]>();
  readonly title = input<string>('');
  readonly totalLabel = input<string>('');
  readonly height = input<number>(CAP_DONUT_DEFAULT_HEIGHT_PX);

  readonly viewBoxSize = CAP_DONUT_VIEWBOX_SIZE;

  readonly totalValue = computed(() =>
    this.data().reduce((acc, segment) => acc + segment.value, 0),
  );

  readonly geometries = computed<readonly CapDonutGeometry[]>(() => {
    const segments = this.data();
    const total = this.totalValue();
    if (segments.length === 0 || total <= 0) {
      return [];
    }

    const centre = CAP_DONUT_VIEWBOX_SIZE / 2;
    const outer = CAP_DONUT_OUTER_RADIUS;
    const inner = outer * CAP_DONUT_INNER_RADIUS_RATIO;
    const padding = segments.length > 1 ? CAP_DONUT_PADDING_ANGLE_DEG : 0;

    let cursor = 0;
    return segments.map((segment, index) => {
      const percentage = segment.value / total;
      const span = percentage * CAP_DONUT_FULL_CIRCLE_DEG - padding;
      const startAngle = cursor;
      const endAngle = startAngle + Math.max(span, 0);
      cursor = endAngle + padding;
      const color = segment.colorVar ?? CAP_DONUT_DEFAULT_PALETTE[index % CAP_DONUT_DEFAULT_PALETTE.length];
      const path =
        percentage === CAP_DONUT_FULL_PERCENT && segments.length === 1
          ? buildFullRingPath(outer, inner, centre)
          : buildArcPath(startAngle, endAngle, outer, inner, centre);
      return {
        id: segment.id,
        label: segment.label,
        path,
        color,
        percentage,
      };
    });
  });
}
