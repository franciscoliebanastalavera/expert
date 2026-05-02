import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { TranslateService, TranslateStore } from '@ngx-translate/core';
import { HomeComponent } from './home.component';
import { DashboardTabId, TransactionStatus } from '../core/models';
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

  it('starts with the Summary tab as active', () => {
    expect(component.tabActiva()).toBe(DashboardTabId.Summary);
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

  it('exposes 4 dashboard tabs', () => {
    expect(component.tabs.length).toBe(4);
    const buttons = fixture.debugElement.queryAll(By.css('.tab-btn'));
    expect(buttons.length).toBe(4);
  });

  it('switches the active tab when selectTab is called', () => {
    component.selectTab(DashboardTabId.Treasury);
    fixture.detectChanges();
    expect(component.tabActiva()).toBe(DashboardTabId.Treasury);
    component.selectTab(DashboardTabId.Compliance);
    expect(component.tabActiva()).toBe(DashboardTabId.Compliance);
  });

  it('renders the Summary tab content by default and swaps when tab changes', () => {
    let title = fixture.debugElement.query(By.css('.tab-content h2'));
    expect(title.nativeElement.textContent).toContain('HOME.OPERATIONS.TITLE');

    component.selectTab(DashboardTabId.Treasury);
    fixture.detectChanges();
    title = fixture.debugElement.query(By.css('.tab-content h2'));
    expect(title.nativeElement.textContent).toContain('HOME.TABS_CONTENT.TREASURY_TITLE');

    component.selectTab(DashboardTabId.Payments);
    fixture.detectChanges();
    title = fixture.debugElement.query(By.css('.tab-content h2'));
    expect(title.nativeElement.textContent).toContain('HOME.TABS_CONTENT.PAYMENTS_TITLE');

    component.selectTab(DashboardTabId.Compliance);
    fixture.detectChanges();
    title = fixture.debugElement.query(By.css('.tab-content h2'));
    expect(title.nativeElement.textContent).toContain('HOME.TABS_CONTENT.COMPLIANCE_TITLE');
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
