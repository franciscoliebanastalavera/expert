import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, RouterLink } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { AdminLandingComponent } from './admin-landing.component';
import {
  SECURITY_DEMOS,
  EXPECTED_DEMO_COUNT,
  ADMIN_DEMO_ROUTES,
  ADMIN_LANDING_I18N,
} from './admin-landing.constants';

describe('AdminLandingComponent', () => {
  let fixture: ComponentFixture<AdminLandingComponent>;
  let component: AdminLandingComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLandingComponent, TranslateModule.forRoot()],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('exposes the SECURITY_DEMOS list as readonly', () => {
    expect(component.demos).toBe(SECURITY_DEMOS);
    expect(component.demos.length).toBe(EXPECTED_DEMO_COUNT);
  });

  it('exposes the ADMIN_LANDING_I18N keys', () => {
    expect(component.i18n).toBe(ADMIN_LANDING_I18N);
    expect(component.i18n.TITLE).toBe('ADMIN.LANDING.TITLE');
    expect(component.i18n.LEAD).toBe('ADMIN.LANDING.LEAD');
    expect(component.i18n.OPEN).toBe('ADMIN.DEMOS.OPEN');
  });

  it('renders one card per security demo', () => {
    const cards = fixture.debugElement.queryAll(By.css('.admin-landing__card'));
    expect(cards.length).toBe(EXPECTED_DEMO_COUNT);
  });

  it('renders cards in the same order as SECURITY_DEMOS, each binding routerLink to the demo route', () => {
    const cards = fixture.debugElement.queryAll(By.css('.admin-landing__card'));
    cards.forEach((card, idx) => {
      const expectedDemo = SECURITY_DEMOS[idx];
      const linkDe = card.query(By.directive(RouterLink));
      expect(linkDe).withContext(`card ${idx} must contain a RouterLink directive`).not.toBeNull();
      const reflected = linkDe.nativeElement.getAttribute('ng-reflect-router-link');
      expect(reflected).toBe(expectedDemo.route);
    });
  });

  it('points each card to a documented admin demo route', () => {
    const allowedRoutes: string[] = Object.values(ADMIN_DEMO_ROUTES);
    component.demos.forEach((demo) => {
      expect(allowedRoutes).toContain(demo.route);
    });
  });

  it('uses the shared CTA i18n key on every card', () => {
    component.demos.forEach((demo) => {
      expect(demo.ctaKey).toBe(ADMIN_LANDING_I18N.OPEN);
    });
  });

  it('trackByRoute returns the route as the unique identifier', () => {
    const demo = SECURITY_DEMOS[0];
    expect(component.trackByRoute(0, demo)).toBe(demo.route);
  });

  it('renders the page title and lead from i18n keys', () => {
    const title = fixture.debugElement.query(By.css('h1'));
    const lead = fixture.debugElement.query(By.css('.admin-landing__lead'));
    expect(title.nativeElement.textContent.trim()).toBe(ADMIN_LANDING_I18N.TITLE);
    expect(lead.nativeElement.textContent.trim()).toBe(ADMIN_LANDING_I18N.LEAD);
  });
});
