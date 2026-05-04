import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateService, TranslateStore } from '@ngx-translate/core';
import { TranslateServiceMock } from '../../testing/mocks';
import { DesignSystemComponent } from './design-system.component';

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

  it('links complex component coverage to Storybook', () => {
    const link = fixture.debugElement.query(By.css('.design-system__storybook a'));

    expect(link.nativeElement.getAttribute('href')).toBe('http://localhost:6007');
  });
});
