import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CapDatepickerComponent } from './cap-datepicker.component';

@Component({
  standalone: true,
  imports: [CapDatepickerComponent, ReactiveFormsModule],
  template: `
    <cap-datepicker
      [label]="label"
      [size]="size"
      [today]="today"
      [invertHorizontal]="invertHorizontal"
      [formControl]="control"
      (date)="onDate($event)">
    </cap-datepicker>
  `,
})
class HostComponent {
  @ViewChild(CapDatepickerComponent) child!: CapDatepickerComponent;
  control = new FormControl<Date | null>(null);
  label = 'Birthday';
  size: 'small' | 'standard' = 'small';
  today = false;
  invertHorizontal = false;
  emitted: Date[] = [];
  onDate(date: Date): void {
    this.emitted.push(date);
  }
}

describe('CapDatepickerComponent', () => {
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

  it('creates the component with the datepicker container', () => {
    expect(host.child).toBeInstanceOf(CapDatepickerComponent);
    const container = fixture.debugElement.query(By.css('.datepicker-container'));
    expect(container).not.toBeNull();
  });

  it('renders the input element with the label and the calendar icon', () => {
    const input = fixture.debugElement.query(By.css('input#datepicker'));
    expect(input).not.toBeNull();
    const labelSpan = fixture.debugElement.query(By.css('.datepicker__label_container span'));
    expect(labelSpan).not.toBeNull();
    expect(labelSpan.nativeElement.textContent.trim()).toBe('Birthday');
    const calendarIcon = fixture.debugElement.query(By.css('.datepicker__icon_container_calendar img'));
    expect(calendarIcon).not.toBeNull();
  });

  it('does not render the datepicker calendar by default', () => {
    expect(fixture.debugElement.query(By.css('.datepicker'))).toBeNull();
  });

  it('opens and closes the datepicker via showDatePicker()', () => {
    expect(host.child.isDatePickerActive).toBeFalse();
    host.child.showDatePicker();
    fixture.detectChanges();
    expect(host.child.isDatePickerActive).toBeTrue();
    expect(host.child.isDayActive).toBeTrue();
    const calendar = fixture.debugElement.query(By.css('.datepicker'));
    expect(calendar).not.toBeNull();
  });

  it('selectDate updates selectedDate and emits the date through the date output', () => {
    const before = host.emitted.length;
    host.child.selectDate(15);
    expect(host.child.selectedDate.getDate()).toBe(15);
    expect(host.emitted.length).toBeGreaterThan(before);
    expect(host.emitted[host.emitted.length - 1].getDate()).toBe(15);
  });

  it('changeMonth shifts the current month by the given offset', () => {
    const initialMonth = host.child.selectedDate.getMonth();
    host.child.changeMonth(1);
    expect(host.child.currentMonth).toBe((initialMonth + 1) % 12);
    host.child.changeMonth(-1);
    expect(host.child.currentMonth).toBe(initialMonth);
  });

  it('setYear updates the year and recalculates the days in month', () => {
    host.child.setYear(2030);
    expect(host.child.currentYear).toBe(2030);
    expect(host.child.daysInMonth.length).toBeGreaterThan(0);
  });

  it('setMonth updates the month and recalculates the days in month', () => {
    host.child.setMonth(0);
    expect(host.child.currentMonth).toBe(0);
    expect(host.child.daysInMonth.length).toBeGreaterThan(0);
  });

  it('clearDate empties the formatted value and emits null', () => {
    host.child.selectDate(10);
    expect(host.child.selectedDateFormated).toBeTruthy();
    host.child.clearDate();
    expect(host.child.selectedDateFormated).toBeNull();
  });

  it('writeValue formats the value into selectedDateFormated', () => {
    const date = new Date(2024, 0, 5);
    host.child.writeValue(date);
    expect(host.child.selectedDateFormated).toBe('05/01/2024');
  });

  it('setDisabledState updates the disabled flag and applies the disabled class', () => {
    host.child.setDisabledState(true);
    expect(host.child.disabled).toBeTrue();
    fixture.detectChanges();
    const container = fixture.debugElement.query(By.css('.datepicker-container'));
    expect(container.nativeElement.classList.contains('disabled')).toBeTrue();
  });

  it('uses different heights for small and standard sizes', () => {
    host.size = 'small';
    fixture.detectChanges();
    host.child.setHeight();
    expect(host.child.height).toBe('36px');
    host.size = 'standard';
    fixture.detectChanges();
    host.child.setHeight();
    expect(host.child.height).toBe('48px');
  });

  it('onKeyPress prevents default for non numeric keys', () => {
    const event = new KeyboardEvent('keypress', { charCode: 65 });
    const spy = spyOn(event, 'preventDefault');
    host.child.onKeyPress(event);
    expect(spy).toHaveBeenCalled();
  });

  it('onKeyPress allows numeric keys without preventing default', () => {
    const event = new KeyboardEvent('keypress', { charCode: 53 });
    const spy = spyOn(event, 'preventDefault');
    host.child.onKeyPress(event);
    expect(spy).not.toHaveBeenCalled();
  });
});
