import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CapButtonComponent } from './cap-button.component';

describe('CapButtonComponent', () => {
  let fixture: ComponentFixture<CapButtonComponent>;
  let instance: CapButtonComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CapButtonComponent);
    instance = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component and renders the root button element with default classes', () => {
    expect(instance).toBeInstanceOf(CapButtonComponent);
    const button = fixture.debugElement.query(By.css('button.cap-button'));
    expect(button).not.toBeNull();
    expect(button.nativeElement.classList.contains('cap-button__primary')).toBeTrue();
    expect(button.nativeElement.classList.contains('cap-button__standard')).toBeTrue();
    expect(button.nativeElement.getAttribute('type')).toBe('button');
  });

  it('renders the default label "Button" when no label is set', () => {
    const label = fixture.debugElement.query(By.css('.cap-button__label-uppercase'));
    expect(label).not.toBeNull();
    expect(label.nativeElement.textContent.trim()).toBe('Button');
  });

  it('renders the label text when the label input changes', () => {
    fixture.componentRef.setInput('label', 'Save');
    fixture.detectChanges();
    const label = fixture.debugElement.query(By.css('.cap-button__label-uppercase'));
    expect(label.nativeElement.textContent.trim()).toBe('Save');
  });

  it('disables the underlying button when the disabled input is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button.cap-button'));
    expect((button.nativeElement as HTMLButtonElement).disabled).toBeTrue();
  });

  it('renders the loading template instead of the label when loading is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.componentRef.setInput('loadingText', 'Loading');
    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.css('.cap-button__spinner'));
    const loadingText = fixture.debugElement.query(By.css('.cap-button__loading-text'));
    expect(spinner).not.toBeNull();
    expect(loadingText).not.toBeNull();
    expect(loadingText.nativeElement.textContent.trim()).toBe('Loading');
    const button = fixture.debugElement.query(By.css('button.cap-button'));
    expect(button.nativeElement.getAttribute('aria-busy')).toBe('true');
  });

  it('emits capClick when the button is clicked and not disabled', () => {
    const spy = spyOn(instance.capClick, 'emit');
    const button = fixture.debugElement.query(By.css('button.cap-button'));
    button.nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('does not emit capClick when the button is disabled and is clicked through handler', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const spy = spyOn(instance.capClick, 'emit');
    instance.handleButton();
    expect(spy).not.toHaveBeenCalled();
  });

  it('renders an icon image when an icon and an icon variant are provided', () => {
    fixture.componentRef.setInput('icon', '/img/icon.svg');
    fixture.componentRef.setInput('variant', 'primary');
    fixture.detectChanges();
    const icon = fixture.debugElement.query(By.css('img.cap-button__icon'));
    expect(icon).not.toBeNull();
    expect(icon.nativeElement.getAttribute('src')).toBe('/img/icon.svg');
  });

  it('hides the label when the variant is icon-button', () => {
    fixture.componentRef.setInput('variant', 'icon-button');
    fixture.componentRef.setInput('icon', '/img/icon.svg');
    fixture.detectChanges();
    const label = fixture.debugElement.query(By.css('[class^="cap-button__label-"]'));
    expect(label).toBeNull();
  });

  it('adds the selected class when selected input is true', () => {
    fixture.componentRef.setInput('selected', true);
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button.cap-button'));
    expect(button.nativeElement.classList.contains('selected')).toBeTrue();
    expect(button.nativeElement.getAttribute('aria-pressed')).toBe('true');
  });

  it('uses the ariaLabel attribute when provided, falling back to label otherwise', () => {
    fixture.componentRef.setInput('ariaLabel', 'Custom Aria');
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button.cap-button'));
    expect(button.nativeElement.getAttribute('aria-label')).toBe('Custom Aria');

    fixture.componentRef.setInput('ariaLabel', undefined);
    fixture.componentRef.setInput('label', 'FromLabel');
    fixture.detectChanges();
    expect(button.nativeElement.getAttribute('aria-label')).toBe('FromLabel');
  });
});
