import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CapSwitchComponent } from './cap-switch.component';

describe('CapSwitchComponent', () => {
  let fixture: ComponentFixture<CapSwitchComponent>;
  let instance: CapSwitchComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapSwitchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CapSwitchComponent);
    instance = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component with the input element rendered', () => {
    expect(instance).toBeInstanceOf(CapSwitchComponent);
    const input = fixture.debugElement.query(By.css('input.cap-switch__input'));
    expect(input).not.toBeNull();
    expect((input.nativeElement as HTMLInputElement).type).toBe('checkbox');
  });

  it('does not render a label by default and renders the control label', () => {
    expect(fixture.debugElement.query(By.css('label.cap-switch__label'))).toBeNull();
    expect(fixture.debugElement.query(By.css('label.cap-switch__control'))).not.toBeNull();
  });

  it('renders the label when label input is set', () => {
    fixture.componentRef.setInput('label', 'Enable feature');
    fixture.detectChanges();
    const label = fixture.debugElement.query(By.css('label.cap-switch__label'));
    expect(label).not.toBeNull();
    expect(label.nativeElement.textContent.trim()).toBe('Enable feature');
  });

  it('reflects checked input on the underlying input element', () => {
    fixture.componentRef.setInput('checked', true);
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input.cap-switch__input'));
    expect((input.nativeElement as HTMLInputElement).checked).toBeTrue();
  });

  it('reflects disabled input on the underlying element and on the label', () => {
    fixture.componentRef.setInput('label', 'Foo');
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input.cap-switch__input'));
    expect((input.nativeElement as HTMLInputElement).disabled).toBeTrue();
    const label = fixture.debugElement.query(By.css('label.cap-switch__label'));
    expect(label.nativeElement.classList.contains('cap-switch__disabled')).toBeTrue();
  });

  it('emits switchChange with the new checked state when the input changes', () => {
    const spy = spyOn(instance.switchChange, 'emit');
    instance.handleChange(true);
    expect(spy).toHaveBeenCalledWith(true);
    expect(instance.checked).toBeTrue();

    instance.handleChange(false);
    expect(spy).toHaveBeenCalledWith(false);
    expect(instance.checked).toBeFalse();
  });

  it('writeValue updates checked, registerOnChange wires the change handler', () => {
    instance.writeValue(true);
    expect(instance.checked).toBeTrue();

    let received: boolean | undefined;
    instance.registerOnChange((value: boolean) => {
      received = value;
    });
    instance.handleChange(false);
    expect(received).toBeFalse();
  });
});
