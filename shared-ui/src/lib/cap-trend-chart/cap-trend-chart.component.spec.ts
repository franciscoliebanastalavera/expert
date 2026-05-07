import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CapTrendChartComponent, niceTicks } from './cap-trend-chart.component';
import { CAP_TREND_AXIS_TICK_COUNT } from './cap-trend-chart.constants';
import { CapTrendSeries } from './cap-trend-chart.types';

const LABELS = ['Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr'] as const;

const INCOME_SERIES: CapTrendSeries = {
  id: 'income',
  label: 'Ingresos',
  data: [3800, 4100, 4250, 4180, 4350, 4200],
  colorVar: 'var(--cap-primary)',
  fill: true,
};

const EXPENSES_SERIES: CapTrendSeries = {
  id: 'expenses',
  label: 'Gastos',
  data: [2900, 3050, 2820, 2750, 2680, 2620],
  colorVar: 'var(--cap-warning, #f59e0b)',
  fill: false,
};

describe('niceTicks', () => {
  it('returns [0] when min and max are 0', () => {
    expect(niceTicks(0, 0, CAP_TREND_AXIS_TICK_COUNT)).toEqual([0]);
  });

  it('produces clean increments rounded to magnitude multiples', () => {
    const ticks = niceTicks(0, 4350, CAP_TREND_AXIS_TICK_COUNT);
    expect(ticks[0]).toBe(0);
    expect(ticks[ticks.length - 1]).toBeGreaterThanOrEqual(4350);
    const step = ticks[1] - ticks[0];
    ticks.forEach((tick, i) => {
      if (i > 0) {
        expect(tick - ticks[i - 1]).toBeCloseTo(step, 5);
      }
    });
  });

  it('keeps ticks in ascending order', () => {
    const ticks = niceTicks(120, 1850, CAP_TREND_AXIS_TICK_COUNT);
    for (let i = 1; i < ticks.length; i += 1) {
      expect(ticks[i]).toBeGreaterThan(ticks[i - 1]);
    }
  });
});

describe('CapTrendChartComponent', () => {
  let fixture: ComponentFixture<CapTrendChartComponent>;
  let component: CapTrendChartComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapTrendChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CapTrendChartComponent);
    component = fixture.componentInstance;
  });

  it('shows the empty state when series is empty', () => {
    fixture.componentRef.setInput('labels', LABELS);
    fixture.componentRef.setInput('series', []);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.cap-trend__empty'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('.cap-trend__svg'))).toBeNull();
  });

  it('renders one line path per series', () => {
    fixture.componentRef.setInput('labels', LABELS);
    fixture.componentRef.setInput('series', [INCOME_SERIES, EXPENSES_SERIES]);
    fixture.detectChanges();
    const lines = fixture.debugElement.queryAll(By.css('.cap-trend__line'));
    expect(lines.length).toBe(2);
  });

  it('renders a fill path only when fill is true on the series', () => {
    fixture.componentRef.setInput('labels', LABELS);
    fixture.componentRef.setInput('series', [INCOME_SERIES, EXPENSES_SERIES]);
    fixture.detectChanges();
    const fills = fixture.debugElement.queryAll(By.css('.cap-trend__fill'));
    expect(fills.length).toBe(1);
  });

  it('produces a linePath with one M and N-1 L commands per series', () => {
    fixture.componentRef.setInput('labels', LABELS);
    fixture.componentRef.setInput('series', [INCOME_SERIES]);
    fixture.detectChanges();
    const geom = component.seriesGeometries()[0];
    const moves = geom.linePath.match(/M /g) ?? [];
    const lines = geom.linePath.match(/L /g) ?? [];
    expect(moves.length).toBe(1);
    expect(lines.length).toBe(INCOME_SERIES.data.length - 1);
  });

  it('renders the configured number of grid lines when showGrid is true', () => {
    fixture.componentRef.setInput('labels', LABELS);
    fixture.componentRef.setInput('series', [INCOME_SERIES]);
    fixture.detectChanges();
    const lines = fixture.debugElement.queryAll(By.css('.cap-trend__grid-line'));
    expect(lines.length).toBe(component.axis().ticks.length);
  });

  it('hides grid lines when showGrid is false', () => {
    fixture.componentRef.setInput('labels', LABELS);
    fixture.componentRef.setInput('series', [INCOME_SERIES]);
    fixture.componentRef.setInput('showGrid', false);
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('.cap-trend__grid-line')).length).toBe(0);
  });

  it('renders one X axis label per provided label', () => {
    fixture.componentRef.setInput('labels', LABELS);
    fixture.componentRef.setInput('series', [INCOME_SERIES]);
    fixture.detectChanges();
    const xLabels = fixture.debugElement.queryAll(By.css('.cap-trend__axis-x .cap-trend__axis-label'));
    expect(xLabels.length).toBe(LABELS.length);
  });

  it('uses two distinct colors when two series omit colorVar', () => {
    fixture.componentRef.setInput('labels', LABELS);
    fixture.componentRef.setInput('series', [
      { id: 'a', label: 'A', data: [1, 2, 3, 4, 5, 6] },
      { id: 'b', label: 'B', data: [6, 5, 4, 3, 2, 1] },
    ]);
    fixture.detectChanges();
    const geoms = component.seriesGeometries();
    expect(geoms[0].color).not.toBe(geoms[1].color);
  });

  it('respects an explicit colorVar on a series', () => {
    fixture.componentRef.setInput('labels', LABELS);
    fixture.componentRef.setInput('series', [INCOME_SERIES]);
    fixture.detectChanges();
    expect(component.seriesGeometries()[0].color).toBe('var(--cap-primary)');
  });
});
