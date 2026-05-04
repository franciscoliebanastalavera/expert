import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SelectOption } from '../core/models/components.models';
import { CapSelectComponent } from './cap-select.component';

@Component({
  standalone: true,
  imports: [CapSelectComponent, ReactiveFormsModule],
  template: `
    <cap-select
      name="city"
      [label]="label"
      [options]="options"
      [size]="size"
      [disabled]="disabled"
      [allOption]="allOption"
      [formControl]="control"
      (selectChange)="onSelectChange($event)">
    </cap-select>
  `,
})
class HostComponent {
  @ViewChild(CapSelectComponent) child!: CapSelectComponent;
  control = new FormControl<SelectOption | null>(null);
  label = 'City';
  size: 'standard' | 'small' = 'standard';
  disabled = false;
  allOption = false;
  options: SelectOption[] = [
    { label: 'Madrid', value: 'mad', checked: false },
    { label: 'Barcelona', value: 'bcn', checked: false },
    { label: 'Sevilla', value: 'sev', checked: false },
  ];
  emitted: Array<SelectOption | null> = [];
  onSelectChange(option: SelectOption | null): void {
    this.emitted.push(option);
  }
}

describe('CapSelectComponent', () => {
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

  it('creates the component with the cap-select field wrapper', () => {
    expect(host.child).toBeInstanceOf(CapSelectComponent);
    const wrapper = fixture.debugElement.query(By.css('.cap-select__field'));
    expect(wrapper).not.toBeNull();
    expect(wrapper.nativeElement.classList.contains('cap-select__field-standard')).toBeTrue();
  });

  it('renders the input element by default with the label rendered', () => {
    const input = fixture.debugElement.query(By.css('input'));
    expect(input).not.toBeNull();
    const label = fixture.debugElement.query(By.css('.cap-select__label'));
    expect(label).not.toBeNull();
    expect(label.nativeElement.textContent.trim()).toBe('City');
  });

  it('does not render the dropdown by default', () => {
    expect(fixture.debugElement.query(By.css('.cap-select__dropdown'))).toBeNull();
  });

  it('renders the dropdown options when unfold is true', () => {
    host.child.handleUnfold();
    fixture.detectChanges();
    expect(host.child.unfold).toBeTrue();
    const optionLabels = fixture.debugElement.queryAll(By.css('.cap-select__dropdown .label'));
    expect(optionLabels.length).toBe(3);
    expect(optionLabels.map((d) => d.nativeElement.textContent.trim())).toEqual([
      'Barcelona',
      'Madrid',
      'Sevilla',
    ]);
  });

  it('emits selectChange and updates the value when selectOption is called', () => {
    host.child.handleUnfold();
    fixture.detectChanges();
    const option = host.child.options()[0];
    host.child.selectOption(new Event('change'), option);
    fixture.detectChanges();
    expect(host.emitted[host.emitted.length - 1]).toBe(option);
    expect(host.child.value).toBe(option);
    expect(option.checked).toBeTrue();
  });

  it('handleClear empties the value and emits null', () => {
    host.child.handleUnfold();
    fixture.detectChanges();
    const option = host.child.options()[0];
    host.child.selectOption(new Event('change'), option);
    fixture.detectChanges();
    host.child.handleClear();
    expect(host.child.value).toBeNull();
    expect(host.emitted[host.emitted.length - 1]).toBeNull();
  });

  it('applies the disabled wrapper class when disabled input is true', () => {
    host.disabled = true;
    fixture.detectChanges();
    const wrapper = fixture.debugElement.query(By.css('.cap-select__field'));
    expect(wrapper.nativeElement.classList.contains('cap-select__field-disabled')).toBeTrue();
  });

  it('writeValue updates the inner value and registerOnChange wires the change handler', () => {
    const newOption: SelectOption = host.child.options()[1];
    host.child.writeValue(newOption);
    expect(host.child.value).toBe(newOption);
    expect(newOption.checked).toBeTrue();

    let received: SelectOption | string | null | undefined;
    host.child.registerOnChange((value: SelectOption | string | null) => {
      received = value;
    });
    host.child.handleSelector(newOption);
    expect(received).toBe(newOption);
  });

  it('inserts the all option when allOption is true and there are multiple options', () => {
    host.allOption = true;
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    host.allOption = true;
    fixture.detectChanges();
    expect(host.child.options()[0].label).toBe('Todos');
  });

  it('clickOutside collapses the dropdown when there is no checked option', () => {
    host.child.handleUnfold();
    fixture.detectChanges();
    expect(host.child.unfold).toBeTrue();
    host.child.clickOutside();
    expect(host.child.unfold).toBeFalse();
  });
});
