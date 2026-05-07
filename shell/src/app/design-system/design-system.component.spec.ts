import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateService, TranslateStore } from '@ngx-translate/core';
import { TranslateServiceMock } from '../../testing/mocks';
import { DesignSystemComponent, buildStorybookUrl } from './design-system.component';

describe('DesignSystemComponent', () => {
  let fixture: ComponentFixture<DesignSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignSystemComponent],
      providers: [
        { provide: TranslateService, useClass: TranslateServiceMock },
        { provide: TranslateStore, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DesignSystemComponent);
    fixture.detectChanges();
  });

  it('renders the design system reference sections', () => {
    const panels = fixture.debugElement.queryAll(By.css('.design-system__panel'));
    expect(panels.length).toBe(6);
  });

  it('binds the Storybook link to the computed storybookUrl', () => {
    const link = fixture.debugElement.query(By.css('.design-system__storybook a'));
    expect(link.nativeElement.getAttribute('href')).toBe(fixture.componentInstance.storybookUrl);
  });
});

describe('buildStorybookUrl', () => {
  it('returns port 6006 when the shell runs on local dev port 4200', () => {
    expect(buildStorybookUrl({ protocol: 'http:', hostname: 'localhost', port: '4200' })).toBe(
      'http://localhost:6006',
    );
  });

  it('returns port 6007 when the shell runs on Docker port 8081', () => {
    expect(buildStorybookUrl({ protocol: 'http:', hostname: 'localhost', port: '8081' })).toBe(
      'http://localhost:6007',
    );
  });

  it('falls back to port 6007 for any unrecognised shell port', () => {
    expect(buildStorybookUrl({ protocol: 'http:', hostname: 'localhost', port: '9999' })).toBe(
      'http://localhost:6007',
    );
  });

  it('preserves the hostname provided by the location object', () => {
    expect(buildStorybookUrl({ protocol: 'https:', hostname: 'capitalflow.internal', port: '4200' })).toBe(
      'https://capitalflow.internal:6006',
    );
  });
});
