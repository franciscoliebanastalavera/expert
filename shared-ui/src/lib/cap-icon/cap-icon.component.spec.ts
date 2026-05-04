import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CAP_ICON_DEFAULT_SPRITE_PATH, CapIconComponent } from './cap-icon.component';

describe('CapIconComponent', () => {
  let fixture: ComponentFixture<CapIconComponent>;
  let instance: CapIconComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CapIconComponent);
    instance = fixture.componentInstance;
    fixture.componentRef.setInput('name', 'home');
    fixture.detectChanges();
  });

  it('creates the component with the svg root element', () => {
    expect(instance).toBeInstanceOf(CapIconComponent);
    const svg = fixture.debugElement.query(By.css('svg.cap-icon__svg'));
    expect(svg).not.toBeNull();
  });

  it('renders the default template containing a use element', () => {
    const use = fixture.debugElement.query(By.css('svg.cap-icon__svg use'));
    expect(use).not.toBeNull();
    expect(use.nativeElement.getAttribute('href')).toBe(`${CAP_ICON_DEFAULT_SPRITE_PATH}#home`);
  });

  it('updates the use href when the name input changes', () => {
    fixture.componentRef.setInput('name', 'settings');
    fixture.detectChanges();
    const use = fixture.debugElement.query(By.css('svg.cap-icon__svg use'));
    expect(use.nativeElement.getAttribute('href')).toBe(`${CAP_ICON_DEFAULT_SPRITE_PATH}#settings`);
  });

  it('uses the provided spritePath when set', () => {
    fixture.componentRef.setInput('spritePath', '/custom/sprite.svg');
    fixture.componentRef.setInput('name', 'star');
    fixture.detectChanges();
    expect(instance.href()).toBe('/custom/sprite.svg#star');
    const use = fixture.debugElement.query(By.css('svg.cap-icon__svg use'));
    expect(use.nativeElement.getAttribute('href')).toBe('/custom/sprite.svg#star');
  });
});
