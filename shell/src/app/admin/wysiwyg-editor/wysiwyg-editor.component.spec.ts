import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WysiwygEditorComponent } from './wysiwyg-editor.component';

describe('WysiwygEditorComponent', () => {
  let fixture: ComponentFixture<WysiwygEditorComponent>;
  let component: WysiwygEditorComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WysiwygEditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WysiwygEditorComponent);
    component = fixture.componentInstance;
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('exposes empty preview signals before save() runs', () => {
    expect(component.rawHtml()).toBe('');
    expect(component.hasInjectionAttempt()).toBeFalse();
  });
});
