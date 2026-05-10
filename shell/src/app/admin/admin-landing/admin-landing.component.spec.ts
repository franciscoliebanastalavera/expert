import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CapButtonComponent } from '@capitalflow/shared-ui';
import { AdminLandingComponent } from './admin-landing.component';
import {
  EXPECTED_VULNERABILITY_COUNT,
  VULNERABILITIES_MATRIX,
} from './admin-landing.constants';

describe('AdminLandingComponent', () => {
  let fixture: ComponentFixture<AdminLandingComponent>;
  let component: AdminLandingComponent;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLandingComponent, TranslateModule.forRoot()],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLandingComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('exposes the vulnerabilities matrix', () => {
    expect(component.vulnerabilities).toBe(VULNERABILITIES_MATRIX);
    expect(component.totalCount).toBe(EXPECTED_VULNERABILITY_COUNT);
  });

  it('renders 11 vulnerability rows', () => {
    const tableBody = fixture.debugElement.query(By.css('tbody'));
    const rows = tableBody.queryAll(By.css('tr'));

    expect(rows.length).toBe(EXPECTED_VULNERABILITY_COUNT);
  });

  it('renders 7 briefing rows and 4 additional control rows', () => {
    const tableBody = fixture.debugElement.query(By.css('tbody'));
    const briefingRows = tableBody.queryAll(
      By.css('.security-center__row--briefing'),
    );
    const additionalRows = tableBody.queryAll(
      By.css('.security-center__row--additional'),
    );

    expect(briefingRows.length).toBe(7);
    expect(additionalRows.length).toBe(4);
  });

  it('renders cap-button only on rows with a demo route', () => {
    const tableBody = fixture.debugElement.query(By.css('tbody'));
    const buttons = tableBody.queryAll(By.directive(CapButtonComponent));

    expect(buttons.length).toBe(5);
  });

  it('renders muted dashes for rows without a demo route', () => {
    const tableBody = fixture.debugElement.query(By.css('tbody'));
    const dashes = tableBody.queryAll(By.css('.muted'));

    expect(dashes.length).toBe(6);
  });

  it('navigates to the selected demo route', () => {
    const route = VULNERABILITIES_MATRIX.find((row) => row.demoRoute)?.demoRoute ?? null;
    const navSpy = spyOn(router, 'navigate');

    component.navigateToDemo(route);

    expect(navSpy).toHaveBeenCalledWith([route]);
  });

  it('does not navigate when no demo route is available', () => {
    const navSpy = spyOn(router, 'navigate');

    component.navigateToDemo(null);

    expect(navSpy).not.toHaveBeenCalled();
  });

  it('trackById returns the vulnerability id', () => {
    expect(component.trackById(0, VULNERABILITIES_MATRIX[0])).toBe('briefing-01');
  });
});
