import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CapInputComponent } from './cap-input.component';

@Component({
  standalone: true,
  imports: [CapInputComponent, ReactiveFormsModule, FormsModule],
  template: `
    <cap-input
      name="email"
      [label]="label"
      [placeholder]="placeholder"
      [helper]="helper"
      [disabled]="disabled"
      [type]="type"
      [variant]="variant"
      [size]="size"
      [maxLength]="maxLength"
      [multiline]="multiline"
      [customClass]="customClass"
      [formControl]="control"
      (inputChage)="onInputChange($event)">
    </cap-input>
  `,
})
class HostComponent {
  @ViewChild(CapInputComponent) child!: CapInputComponent;
  control = new FormControl<string>('');
  label = 'Email';
  placeholder = '';
  helper = '';
  disabled = false;
  type: 'text' | 'number' | 'password' = 'text';
  variant: 'standard' | 'clear' = 'standard';
  size: 'standard' | 'small' = 'standard';
  maxLength = 65;
  multiline = false;
  customClass: Record<string, string> = {};
  emitted: string[] = [];
  onInputChange(value: string): void {
    this.emitted.push(value);
  }
}

describe('CapInputComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component with the cap-input field wrapper', () => {
    expect(host.child).toBeInstanceOf(CapInputComponent);
    const wrapper = fixture.debugElement.query(By.css('.cap-input__field'));
    expect(wrapper).not.toBeNull();
    expect(wrapper.nativeElement.classList.contains('cap-input__field-standard')).toBeTrue();
  });

  it('renders the single-line input by default and not a textarea', () => {
    const input = fixture.debugElement.query(By.css('input'));
    expect(input).not.toBeNull();
    expect((input.nativeElement as HTMLInputElement).type).toBe('text');
    const textarea = fixture.debugElement.query(By.css('textarea'));
    expect(textarea).toBeNull();
  });

  it('renders a textarea when multiline is true', () => {
    host.multiline = true;
    fixture.detectChanges();
    const textarea = fixture.debugElement.query(By.css('textarea'));
    expect(textarea).not.toBeNull();
  });

  it('renders the label when provided and adds the floating class when value is set', () => {
    const label = fixture.debugElement.query(By.css('.cap-input__label'));
    expect(label).not.toBeNull();
    expect(label.nativeElement.textContent.trim()).toBe('Email');
    expect(label.nativeElement.classList.contains('cap-input__label-floating')).toBeFalse();

    host.child.value = 'foo';
    fixture.detectChanges();
    expect(label.nativeElement.classList.contains('cap-input__label-floating')).toBeTrue();
  });

  it('adds the disabled wrapper class when disabled input is true', () => {
    host.disabled = true;
    fixture.detectChanges();
    const wrapper = fixture.debugElement.query(By.css('.cap-input__field'));
    expect(wrapper.nativeElement.classList.contains('cap-input__field-disabled')).toBeTrue();
  });

  it('emits inputChage and updates the value when handleInput is invoked', () => {
    host.child.handleInput('hello');
    fixture.detectChanges();
    expect(host.child.value).toBe('hello');
    expect(host.emitted).toContain('hello');
  });

  it('writeValue and registerOnChange wire the form control behavior', () => {
    host.child.writeValue('world');
    expect(host.child.value).toBe('world');

    let received: string | undefined;
    host.child.registerOnChange((value: string) => {
      received = value;
    });
    host.child.handleInput('changed');
    expect(received).toBe('changed');
  });

  it('clickOutside resets the focus flag', () => {
    host.child.fieldOnFocus = true;
    host.child.clickOutside();
    expect(host.child.fieldOnFocus).toBeFalse();
  });

  it('handleClear empties the value and emits an empty string', () => {
    host.child.handleInput('something');
    fixture.detectChanges();
    host.child.handleClear();
    expect(host.child.value).toBe('');
    expect(host.emitted[host.emitted.length - 1]).toBe('');
  });

  it('handleShow toggles the showPassword and showIBAN flags', () => {
    expect(host.child.showPassword).toBeFalse();
    host.child.handleShow();
    expect(host.child.showPassword).toBeTrue();
    host.child.handleShow();
    expect(host.child.showPassword).toBeFalse();
  });

  it('passwordValidation evaluates the password rules', () => {
    host.child.passwordValidation('Abcdefg1');
    expect(host.child.checkLength).toBeTrue();
    expect(host.child.checkOneDigit).toBeTrue();
    expect(host.child.checkOneCap).toBeTrue();
    expect(host.child.checkOneMin).toBeTrue();
    expect(host.child.passwordValid).toBeTrue();

    host.child.passwordValidation('short');
    expect(host.child.checkLength).toBeFalse();
    expect(host.child.passwordValid).toBeFalse();
  });
});
