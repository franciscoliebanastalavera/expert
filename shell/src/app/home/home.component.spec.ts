import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { TranslateService, TranslateStore } from '@ngx-translate/core';
import { HomeComponent } from './home.component';
import { TransactionStatus } from '../core/models';
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

  it('exposes 4 metric cards with the configured routes', () => {
    expect(component.metricas.length).toBe(4);
    const cards = fixture.debugElement.queryAll(By.css('cap-metric-card'));
    expect(cards.length).toBe(4);
    expect(component.metricas.map((m) => m.ruta)).toEqual([
      '/analytics',
      '/payments-mfe',
      '/analytics',
      '/analytics',
    ]);
  });

  it('renders 4 cap-tab items inside cap-tabs with the card variant', () => {
    const tabs = fixture.debugElement.queryAll(By.css('.cap-tabs li'));
    expect(tabs.length).toBe(4);
    const cardWrapper = fixture.debugElement.query(By.css('.cap-tabs--card'));
    expect(cardWrapper).not.toBeNull();
  });

  it('marks the first tab as active by default', () => {
    const activeLabel = fixture.debugElement.query(By.css('.cap-tabs__tabLabel-active'));
    expect(activeLabel.nativeElement.textContent.trim()).toBe('HOME.TABS.SUMMARY');
  });

  it('switches the active tab when another tab is clicked', () => {
    const items = fixture.debugElement.queryAll(By.css('.cap-tabs li'));
    items[2].nativeElement.click();
    fixture.detectChanges();
    const activeLabels = fixture.debugElement.queryAll(By.css('.cap-tabs__tabLabel-active'));
    expect(activeLabels.length).toBe(1);
    expect(activeLabels[0].nativeElement.textContent.trim()).toBe('HOME.TABS.PAYMENTS');
  });

  it('navigates via Router.navigate when navigateTo is called', () => {
    const router = TestBed.inject(Router);
    const navSpy = spyOn(router, 'navigate').and.resolveTo(true);
    component.navigateTo('/analytics');
    expect(navSpy).toHaveBeenCalledWith(['/analytics']);
  });

  it('maps transaction statuses to the correct badge kinds', () => {
    expect(component.statusKind(TransactionStatus.Completed)).toBe('success');
    expect(component.statusKind(TransactionStatus.Processing)).toBe('warning');
    expect(component.statusKind(TransactionStatus.Pending)).toBe('info');
    expect(component.statusKind(TransactionStatus.Rejected)).toBe('danger');
  });

  it('builds the table columns from the translate streams', () => {
    const cols = component.tableColumns();
    expect(cols.length).toBe(5);
    expect(cols.map((c) => c.key)).toEqual(['tipo', 'importe', 'fecha', 'estado', 'iban']);
  });

  it('exposes 5 mock latest operations', () => {
    expect(component.ultimasOperaciones.length).toBe(5);
    expect(component.ultimasOperaciones[0].iban).toBe('ES9121000418450200051332');
  });
});
