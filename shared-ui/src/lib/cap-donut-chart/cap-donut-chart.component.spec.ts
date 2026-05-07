import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CapDonutChartComponent } from './cap-donut-chart.component';
import { CAP_DONUT_DEFAULT_PALETTE } from './cap-donut-chart.constants';
import { CapDonutSegment } from './cap-donut-chart.types';

const SAMPLE_SEGMENTS: readonly CapDonutSegment[] = [
  { id: 'housing', label: 'Vivienda', value: 1250, colorVar: 'var(--cap-primary)' },
  { id: 'food', label: 'Alimentación', value: 480 },
  { id: 'transport', label: 'Transporte', value: 320 },
];

describe('CapDonutChartComponent', () => {
  let fixture: ComponentFixture<CapDonutChartComponent>;
  let component: CapDonutChartComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapDonutChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CapDonutChartComponent);
    component = fixture.componentInstance;
  });

  it('shows the empty state when data is empty', () => {
    fixture.componentRef.setInput('data', []);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.cap-donut__empty'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('.cap-donut__svg'))).toBeNull();
  });

  it('renders one path per segment when data has values', () => {
    fixture.componentRef.setInput('data', SAMPLE_SEGMENTS);
    fixture.detectChanges();
    const paths = fixture.debugElement.queryAll(By.css('.cap-donut__segment'));
    expect(paths.length).toBe(SAMPLE_SEGMENTS.length);
  });

  it('computes the total value as the sum of segment values', () => {
    fixture.componentRef.setInput('data', SAMPLE_SEGMENTS);
    fixture.detectChanges();
    expect(component.totalValue()).toBe(1250 + 480 + 320);
  });

  it('produces percentages that sum to 1', () => {
    fixture.componentRef.setInput('data', SAMPLE_SEGMENTS);
    fixture.detectChanges();
    const sum = component.geometries().reduce((acc, g) => acc + g.percentage, 0);
    expect(sum).toBeCloseTo(1, 5);
  });

  it('uses colorVar when provided and falls back to the palette otherwise', () => {
    fixture.componentRef.setInput('data', SAMPLE_SEGMENTS);
    fixture.detectChanges();
    const geoms = component.geometries();
    expect(geoms[0].color).toBe('var(--cap-primary)');
    expect(geoms[1].color).toBe(CAP_DONUT_DEFAULT_PALETTE[1]);
    expect(geoms[2].color).toBe(CAP_DONUT_DEFAULT_PALETTE[2]);
  });

  it('renders the title heading when title is set', () => {
    fixture.componentRef.setInput('data', SAMPLE_SEGMENTS);
    fixture.componentRef.setInput('title', 'Gastos por categoría');
    fixture.detectChanges();
    const heading = fixture.debugElement.query(By.css('.cap-donut__title'));
    expect(heading).not.toBeNull();
    expect(heading.nativeElement.textContent.trim()).toBe('Gastos por categoría');
  });

  it('hides the title heading when title is empty', () => {
    fixture.componentRef.setInput('data', SAMPLE_SEGMENTS);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.cap-donut__title'))).toBeNull();
  });

  it('shows the centered total label when totalLabel is set and data has values', () => {
    fixture.componentRef.setInput('data', SAMPLE_SEGMENTS);
    fixture.componentRef.setInput('totalLabel', 'Total: 2.050 €');
    fixture.detectChanges();
    const center = fixture.debugElement.query(By.css('.cap-donut__center-text'));
    expect(center).not.toBeNull();
    expect(center.nativeElement.textContent.trim()).toBe('Total: 2.050 €');
  });

  it('renders a single full-ring segment without padding splits', () => {
    fixture.componentRef.setInput('data', [{ id: 'only', label: 'Único', value: 100 }]);
    fixture.detectChanges();
    const paths = fixture.debugElement.queryAll(By.css('.cap-donut__segment'));
    expect(paths.length).toBe(1);
    expect(component.geometries()[0].percentage).toBe(1);
  });

  it('declares a transform transition on segments to enable hover scale', () => {
    fixture.componentRef.setInput('data', SAMPLE_SEGMENTS);
    fixture.detectChanges();
    const path = fixture.debugElement.query(By.css('.cap-donut__segment')).nativeElement as SVGPathElement;
    const style = getComputedStyle(path);
    expect(style.transition).toMatch(/transform/);
  });
});
