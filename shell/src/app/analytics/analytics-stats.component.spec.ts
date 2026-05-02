import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateService, TranslateStore } from '@ngx-translate/core';
import { AnalyticsStatsComponent } from './analytics-stats.component';
import { TranslateServiceMock } from '../../testing/mocks';

describe('AnalyticsStatsComponent', () => {
  let fixture: ComponentFixture<AnalyticsStatsComponent>;
  let component: AnalyticsStatsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsStatsComponent],
      providers: [
        { provide: TranslateService, useClass: TranslateServiceMock },
        { provide: TranslateStore, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalyticsStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('uses default 0 values for all inputs when none are provided', () => {
    expect(component.total()).toBe(0);
    expect(component.income()).toBe(0);
    expect(component.expenses()).toBe(0);
  });

  it('renders three stat cards in the stats bar', () => {
    const cards = fixture.debugElement.queryAll(By.css('cap-stat-card'));
    expect(cards.length).toBe(3);
  });

  it('reflects the total input on the first stat card value attribute', () => {
    fixture.componentRef.setInput('total', 42);
    fixture.detectChanges();
    const cards = fixture.debugElement.queryAll(By.css('cap-stat-card'));
    expect(cards[0].nativeElement.getAttribute('ng-reflect-value')).toBe('42');
  });

  it('formats a positive amount with two decimals and the euro suffix', () => {
    expect(component.formatAmount(1234.5)).toBe('1234,50 €');
  });

  it('uses the absolute value when formatting a negative amount', () => {
    expect(component.formatAmount(-987.6)).toBe('987,60 €');
  });

  it('formats zero as 0,00 €', () => {
    expect(component.formatAmount(0)).toBe('0,00 €');
  });

  it('reflects income input as the formatted positive card value', () => {
    fixture.componentRef.setInput('income', 250.5);
    fixture.detectChanges();
    const cards = fixture.debugElement.queryAll(By.css('cap-stat-card'));
    expect(cards[1].nativeElement.getAttribute('ng-reflect-value')).toBe('250,50 €');
  });

  it('reflects expenses input as the negative-prefixed card value', () => {
    fixture.componentRef.setInput('expenses', 100);
    fixture.detectChanges();
    const cards = fixture.debugElement.queryAll(By.css('cap-stat-card'));
    expect(cards[2].nativeElement.getAttribute('ng-reflect-value')).toBe('-100,00 €');
  });
});
