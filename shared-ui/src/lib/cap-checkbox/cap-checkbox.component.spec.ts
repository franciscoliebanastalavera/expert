import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CapCheckboxComponent } from './cap-checkbox.component';

describe('CapCheckboxComponent', () => {
  let fixture: ComponentFixture<CapCheckboxComponent>;
  let instance: CapCheckboxComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapCheckboxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CapCheckboxComponent);
    instance = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component with the input rendered', () => {
    expect(instance).toBeInstanceOf(CapCheckboxComponent);
    const input = fixture.debugElement.query(By.css('input.cap-checkbox__input'));
    expect(input).not.toBeNull();
    expect((input.nativeElement as HTMLInputElement).type).toBe('checkbox');
  });

  it('does not render label or description by default', () => {
    const wrapper = fixture.debugElement.query(By.css('.cap-checkbox__text-wrapper'));
    expect(wrapper).toBeNull();
  });

  it('renders the label when label input is set', () => {
    instance.label = 'Accept terms';
    fixture.detectChanges();
    const text = fixture.debugElement.query(By.css('.cap-checkbox__text'));
    expect(text).not.toBeNull();
    expect(text.nativeElement.textContent.trim()).toBe('Accept terms');
  });

  it('renders description when set', () => {
    instance.label = 'Accept';
    instance.description = 'Read the terms first';
    fixture.detectChanges();
    const description = fixture.debugElement.query(By.css('.cap-checkbox__description'));
    expect(description).not.toBeNull();
    expect(description.nativeElement.textContent.trim()).toBe('Read the terms first');
  });

  it('applies the disabled class when disabled is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const label = fixture.debugElement.query(By.css('label.cap-checkbox__label'));
    expect(label.nativeElement.classList.contains('cap-checkbox__disabled')).toBeTrue();
  });

  it('applies the labelPosition class for left and right', () => {
    instance.labelPosition = 'left';
    fixture.detectChanges();
    let label = fixture.debugElement.query(By.css('label.cap-checkbox__label'));
    expect(label.nativeElement.classList.contains('cap-checkbox__label--left')).toBeTrue();

    instance.labelPosition = 'right';
    fixture.detectChanges();
    label = fixture.debugElement.query(By.css('label.cap-checkbox__label'));
    expect(label.nativeElement.classList.contains('cap-checkbox__label--right')).toBeTrue();
  });

  it('emits checkboxChange when the input toggles via the change handler', () => {
    const spy = spyOn(instance.checkboxChange, 'emit');
    const input = fixture.debugElement.query(By.css('input.cap-checkbox__input')).nativeElement as HTMLInputElement;
    input.checked = true;
    instance.toggleCheckbox({ target: input } as unknown as Event);
    expect(spy).toHaveBeenCalledWith(true);
    expect(instance.value).toBeTrue();
  });

  it('writeValue updates the inner value and registerOnChange wires the change handler', () => {
    instance.writeValue(true);
    expect(instance.value).toBeTrue();

    let received: boolean | undefined;
    instance.registerOnChange((value: boolean) => {
      received = value;
    });
    const input = fixture.debugElement.query(By.css('input.cap-checkbox__input')).nativeElement as HTMLInputElement;
    input.checked = false;
    instance.toggleCheckbox({ target: input } as unknown as Event);
    expect(received).toBeFalse();
  });

  it('setDisabledState updates the disabled property', () => {
    instance.setDisabledState(true);
    expect(instance.disabled).toBeTrue();
    instance.setDisabledState(false);
    expect(instance.disabled).toBeFalse();
  });
});
