import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { TranslateService, TranslateStore } from '@ngx-translate/core';
import { HomeComponent } from './home.component';
import { HOME_QUICK_ACCESS_CARDS } from './home-summary.fixtures';
import { TranslateServiceMock } from '../../testing/mocks';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter([]),
        { provide: TranslateService, useClass: TranslateServiceMock },
        { provide: TranslateStore, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders the welcome hero with translation keys', () => {
    const title = fixture.debugElement.query(By.css('.home__title'));
    const subtitle = fixture.debugElement.query(By.css('.home__subtitle'));
    expect(title.nativeElement.textContent.trim()).toBe('HOME.SUMMARY.WELCOME_TITLE');
    expect(subtitle.nativeElement.textContent.trim()).toBe('HOME.SUMMARY.WELCOME_SUBTITLE');
  });

  it('renders 4 cap-stat-card kpis', () => {
    const cards = fixture.debugElement.queryAll(By.css('cap-stat-card'));
    expect(cards.length).toBe(4);
  });

  it('renders the trend chart and the donut chart', () => {
    expect(fixture.debugElement.query(By.css('cap-trend-chart'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('cap-donut-chart'))).not.toBeNull();
  });

  it('exposes 3 quick-access cards mapping to local routes', () => {
    expect(component.quickAccessCards.length).toBe(3);
    const cards = fixture.debugElement.queryAll(By.css('cap-info-card'));
    expect(cards.length).toBe(3);
    expect(component.quickAccessCards.map((c) => c.route)).toEqual([
      '/transactions',
      '/analytics',
      '/payments',
    ]);
  });

  it('navigates via Router when navigateTo is called', () => {
    const router = TestBed.inject(Router);
    const navSpy = spyOn(router, 'navigate').and.resolveTo(true);
    component.navigateTo('/transactions');
    expect(navSpy).toHaveBeenCalledWith(['/transactions']);
  });

  it('translates the trend series labels via the TranslateService stream', () => {
    const labels = component.trendSeries().map((s) => s.label);
    expect(labels).toEqual(['HOME.SUMMARY.TREND.INCOME', 'HOME.SUMMARY.TREND.EXPENSES']);
  });

  it('translates the donut segment labels via the TranslateService stream', () => {
    const labels = component.donutSegments().map((s) => s.label);
    expect(labels).toEqual([
      'HOME.SUMMARY.CATEGORIES.HOUSING',
      'HOME.SUMMARY.CATEGORIES.FOOD',
      'HOME.SUMMARY.CATEGORIES.TRANSPORT',
      'HOME.SUMMARY.CATEGORIES.ENTERTAINMENT',
      'HOME.SUMMARY.CATEGORIES.OTHER',
    ]);
  });

  it('preserves the donut segment colorVar when translating', () => {
    const colors = component.donutSegments().map((s) => s.colorVar);
    expect(colors[0]).toBe('var(--cap-primary)');
    expect(colors.every((c) => c !== undefined)).toBeTrue();
  });

  it('exposes hardcoded kpi values matching the fixtures', () => {
    expect(component.kpis.BALANCE).toBe('12.500 €');
    expect(component.kpis.INCOME).toBe('4.200 €');
    expect(component.kpis.EXPENSES).toBe('2.620 €');
    expect(component.kpis.SAVINGS).toBe('1.580 €');
  });

  it('triggers navigation when the cta of a quick-access card is clicked', () => {
    const router = TestBed.inject(Router);
    const navSpy = spyOn(router, 'navigate').and.resolveTo(true);
    const buttons = fixture.debugElement.queryAll(By.css('cap-info-card .cap-info-card__cta'));
    expect(buttons.length).toBe(HOME_QUICK_ACCESS_CARDS.length);
    buttons[0].triggerEventHandler('capClick', undefined);
    expect(navSpy).toHaveBeenCalledWith([HOME_QUICK_ACCESS_CARDS[0].route]);
  });
});
