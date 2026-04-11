/**
 * Componente datepicker reutilizable — adaptado de Nter-lib.
 * Selector: 'cap-datepicker'
 */
import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Inject,
  Injector,
  Input,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormControlDirective,
  FormControlName,
  FormGroupDirective,
  FormsModule,
  NG_VALUE_ACCESSOR,
  NgControl,
  NgModel,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'cap-datepicker',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './cap-datepicker.component.html',
  styleUrl: './cap-datepicker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CapDatepickerComponent),
      multi: true,
    },
    DatePipe,
  ],
})
export class CapDatepickerComponent {
  /**
   * Variable for set size
   * */
  @Input() size: 'small' | 'standard' = 'small';
  /**
   * Variable for label
   * */
  @Input() label: string;
  /**
   * Variable for options helper
   * */
  @Input() helper: string;
  /**
   *  Optional custom error messages for validators. Allowed key values are the same used in class Validators from @angular/forms or your own custom validators.
   *
   *  Example:
   *
   *  const control = new FormControl(1, [Validators.max(5), Validators.min(1)]);
   *  const errorMessages = { max: 'Max value is 5', min: 'Minimum value is 1' };
   */
  @Input() errorMessages: { [key: string]: string };
  /**
   * Control variable for set and emit today when not in use ngModel or FormControl
   * */
  @Input() today = false;
  /**
   * Event emitted when the day is selected
   * */
  @Output() date: EventEmitter<Date> = new EventEmitter();
  /**
   * Control variable for the calendar
   * */
  isDatePickerActive = false;
  /**
   * Control variable for the days wiew
   * */
  isDayActive = false;
  /**
   * Control variable for the years view
   * */
  isYearsActive = false;
  /**
   * Control variable for the months view
   * */
  isMonthActive = false;
  /**
   * Variable for date selected
   * */
  selectedDate: Date = new Date();
  /**
   * Variable to control the styles for the selected date
   */
  dateToStyle: Date = new Date();
  /**
   * Variable for date selected formated for show in input field
   * */
  selectedDateFormated: string;
  /**
   * Variable to control that the same date is not output multiple times when clicking outside the datepicker.
   * */
  previousSelectedDateFormated: string;
  /**
   * Variable for current year
   * */
  currentYear: number;
  /**
   * Variable for current month
   * */
  currentMonth: number;
  /**
   * Variable for set days of the month
   * */
  daysInMonth: number[] = [];
  /**
   * Months
   * */
  months: string[] = [
    'ENERO',
    'FEBRERO',
    'MARZO',
    'ABRIL',
    'MAYO',
    'JUNIO',
    'JULIO',
    'AGOSTO',
    'SEPTIEMBRE',
    'OCTUBRE',
    'NOVIEMBRE',
    'DICIEMBRE',
  ];
  /**
   * Abbreviated months
   * */
  abbreviatedMonths: string[] = [
    'EN',
    'FEB',
    'MAR',
    'ABR',
    'MAY',
    'JUN',
    'JUL',
    'AG',
    'SEPT',
    'OCT',
    'NOV',
    'DIC',
  ];
  /**
   * Days of the week
   * */
  daysWeek: string[] = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];
  /**
   * Years
   * */
  years: number[] = [];
  /**
   * Variable for set starting day of the week
   * */
  startingDay: number;
  /**
   * Variable to control whether the input is in focus
   * */
  isInputFocused = false;
  /**
   * Variable to control whether the input and calendar icon are hovered
   * */
  isInputHovered = false;
  /**
   * Variable for size
   * */
  height = '36px';
  /**
   * Variable for disabled
   * */
  disabled = false;
  /**
   * Invert horizontal calendar alignment.
   */
  @Input() invertHorizontal = false;

  destroy = new Subject<boolean>();
  control: FormControl;
  private innerValue: Date = null;

  onChange = (_: Date): void => {};
  onTouched = (): void => {};

  get value(): Date {
    return this.innerValue;
  }

  set value(value: Date) {
    if (this.innerValue !== value) {
      this.innerValue = value;
      this.onTouched();
    }
  }

  constructor(
    @Inject(Injector) private injector: Injector,
    private _datePipeService: DatePipe,
    private _el: ElementRef
  ) {
    this.calculateDaysInMonth();
  }

  ngOnInit(): void {
    this.setToday();
    this.setHeight();
    this.getYears(this.currentYear);
    this.setControl();
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.complete();
  }

  /** ControlValueAccessor METHODS - START */
  handleDate(value: Date): void {
    this.innerValue = value;
    this.onTouched();
    this.onChange(this.value);
    this.date.emit(this.value);
  }

  writeValue(value: Date): void {
    if (value !== this.innerValue) {
      this.innerValue = value;
      this.selectedDateFormated = this._datePipeService.transform(value, 'dd/MM/yyyy');
    }
    if (value === null) {
      this.innerValue = null;
      this.clearDate();
    }
  }

  registerOnChange(fn: (_: Date) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(state: boolean): void {
    this.disabled = state;
  }

  /**
   * Handler to set size of the calendar
   * */
  setHeight(): void {
    if (this.size === 'small') {
      this.height = '36px';
    } else if (this.size === 'standard') {
      this.height = '48px';
    }
  }

  /**
   * Handler to set and emit today when not in use ngModel or FormControl
   * */
  setToday() {
    if (this.today) {
      this.selectedDateFormated = this._datePipeService.transform(
        this.selectedDate,
        'dd/MM/yyyy'
      );
      this.handleDate(this.selectedDate);
    }
  }

  /**
   * Handler to open/close the calendar
   */
  showDatePicker(): void {
    if (this.isDatePickerActive) {
      if (!this.selectedDateFormated) {
        this.resetDatePicker();
        this.onTouched();
      } else {
        this.isDatePickerActive = false;
        this.isDayActive = false;
        this.isYearsActive = false;
        this.isMonthActive = false;
        this.writeDate();
      }
    } else {
      this.isDatePickerActive = true;
      this.isDayActive = true;
      this.writeDate();
    }
  }

  /**
   * Reset the calendar
   */
  resetDatePicker(): void {
    this.isDatePickerActive = false;
    this.isDayActive = false;
    this.isYearsActive = false;
    this.isMonthActive = false;
    this.selectedDate = new Date();
    this.dateToStyle = new Date();
    this.calculateDaysInMonth();
    this.getYears(this.currentYear);
  }

  /**
   * Clear the input, reset the calendar and emit null
   */
  clearDate(): void {
    this.selectedDateFormated = null;
    this.handleDate(null);
    this.resetDatePicker();
  }

  /**
   * Get years before and after date
   */
  getYears(currentYear: number): void {
    const previousYears = Array.from(
      { length: 8 },
      (_, index) => currentYear - 8 + index
    );
    const laterYears = Array.from({ length: 8 }, (_, index) => currentYear + index);

    this.years = previousYears.concat(laterYears);
  }

  /**
   * Calculate the days of the month
   */
  calculateDaysInMonth(): void {
    this.currentYear = this.selectedDate.getFullYear();
    this.currentMonth = this.selectedDate.getMonth();

    // Get the first day of the month and get the day of the week.
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1).getDay();
    // Adjust so that Monday is the first day of the week.
    this.startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    // Get the last day of the month to get the total number of days in the month.
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    // Creates an array with the number of days in the month plus the first day adjustment. If the index i is less than startingDay, the value is null. Otherwise, the corresponding day of the month is assigned.
    this.daysInMonth = Array.from({ length: daysInMonth + this.startingDay }, (_, i) =>
      i < this.startingDay ? null : i - this.startingDay + 1
    );
  }

  /**
   * Emmits selected date
   */
  selectDate(day: number): void {
    if (day) {
      this.selectedDate = new Date(this.currentYear, this.currentMonth, day);
      this.dateToStyle = new Date(this.currentYear, this.currentMonth, day);
      this.selectedDateFormated = this._datePipeService.transform(
        this.selectedDate,
        'dd/MM/yyyy'
      );
      this.isDatePickerActive = false;
      this.getYears(this.currentYear);
      this.handleDate(this.selectedDate);
    }
    this.control?.setValue(this.value);
  }

  /**
   * Manual date entry
   */
  writeDate(): void {
    if (this.selectedDateFormated) {
      this.selectedDateFormated = this.selectedDateFormated.replace(/\D/g, '');
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;

      switch (this.selectedDateFormated.length) {
        case 1:
        case 2:
          if (
            +this.selectedDateFormated >= 1 &&
            +this.selectedDateFormated <= new Date(currentYear, currentMonth, 0).getDate()
          ) {
            this.selectedDate = this.dateToStyle = new Date(
              currentYear,
              currentMonth - 1,
              +this.selectedDateFormated
            );
            this.selectedDateFormated = this._datePipeService.transform(
              this.selectedDate,
              'dd/MM/yyyy'
            );
            this.handleDate(this.selectedDate);
          } else {
            this.clearDate();
          }
          break;
        case 3:
        case 4: {
          const day = +this.selectedDateFormated.slice(0, 2);
          const month = +this.selectedDateFormated.slice(2);
          const lastDayOfMonth = new Date(currentYear, month, 0).getDate();

          if (day >= 1 && day <= lastDayOfMonth && month >= 1 && month <= 12) {
            this.selectedDate = this.dateToStyle = new Date(currentYear, month - 1, day);
            this.selectedDateFormated = this._datePipeService.transform(
              this.selectedDate,
              'dd/MM/yyyy'
            );
            this.calculateDaysInMonth();
            this.handleDate(this.selectedDate);
          } else {
            this.clearDate();
          }
          break;
        }
        case 6: {
          const dayFromDigits56 = +this.selectedDateFormated.slice(0, 2);
          const monthFromDigits56 = +this.selectedDateFormated.slice(2, 4);
          const yearDigits56 = +this.selectedDateFormated.slice(4);
          const adjustedYear =
            yearDigits56 >= 0 && yearDigits56 <= 68
              ? 2000 + yearDigits56
              : 1900 + yearDigits56;

          if (
            dayFromDigits56 >= 1 &&
            dayFromDigits56 <= 31 &&
            monthFromDigits56 >= 1 &&
            monthFromDigits56 <= 12
          ) {
            const lastDayOfMonth = new Date(adjustedYear, monthFromDigits56, 0).getDate();

            if (dayFromDigits56 <= lastDayOfMonth) {
              this.selectedDate = new Date(
                adjustedYear,
                monthFromDigits56 - 1,
                dayFromDigits56
              );
              this.dateToStyle = new Date(
                adjustedYear,
                monthFromDigits56 - 1,
                dayFromDigits56
              );
              this.selectedDateFormated = this._datePipeService.transform(
                this.selectedDate,
                'dd/MM/yyyy'
              );
              this.calculateDaysInMonth();
              this.getYears(this.currentYear);
              this.handleDate(this.selectedDate);
            } else this.clearDate();
          } else this.clearDate();
          break;
        }
        case 8: {
          const dayFromDigits78 = +this.selectedDateFormated.slice(0, 2);
          const monthFromDigits78 = +this.selectedDateFormated.slice(2, 4);
          const yearDigits78 = +this.selectedDateFormated.slice(4);

          if (yearDigits78 >= 0) {
            if (
              dayFromDigits78 >= 1 &&
              dayFromDigits78 <= 31 &&
              monthFromDigits78 >= 1 &&
              monthFromDigits78 <= 12
            ) {
              const lastDayOfMonth = new Date(
                yearDigits78,
                monthFromDigits78,
                0
              ).getDate();

              if (dayFromDigits78 <= lastDayOfMonth) {
                this.selectedDate = new Date(
                  yearDigits78,
                  monthFromDigits78 - 1,
                  dayFromDigits78
                );
                this.dateToStyle = new Date(
                  yearDigits78,
                  monthFromDigits78 - 1,
                  dayFromDigits78
                );
                this.selectedDateFormated = this._datePipeService.transform(
                  this.selectedDate,
                  'dd/MM/yyyy'
                );
                this.calculateDaysInMonth();
                this.getYears(this.currentYear);
                this.handleDate(this.selectedDate);
              }
            } else this.clearDate();
          } else this.clearDate();
          break;
        }
        default:
          this.clearDate();
          break;
      }
    }
  }

  /**
   * Change de current month in days view
   */
  changeMonth(offset: number): void {
    this.selectedDate.setMonth(this.selectedDate.getMonth() + offset);
    this.calculateDaysInMonth();
  }

  /**
   * Change current year
   */
  setYear(year: number): void {
    this.selectedDate.setFullYear(year);
    this.calculateDaysInMonth();
  }

  /**
   * Change the range of years
   */
  changeYears(offset: number): void {
    offset === 1
      ? (this.years = Array.from(
          { length: 16 },
          (_, index) => this.years[this.years.length - 1] + index + 1
        ))
      : (this.years = Array.from(
          { length: 16 },
          (_, index) => this.years[0] - 16 + index
        ));
  }

  /**
   * Change current year in month view
   */
  changeYear(offset: number): void {
    offset === 1
      ? this.selectedDate.setFullYear(this.selectedDate.getFullYear() + 1)
      : this.selectedDate.setFullYear(this.selectedDate.getFullYear() - 1);
    this.calculateDaysInMonth();
  }

  /**
   * Change the current month
   */
  setMonth(month: number): void {
    this.selectedDate.setMonth(month);
    this.calculateDaysInMonth();
  }

  /**
   * Closes the calendar when clicked out
   */
  @HostListener('document:mousedown', ['$event'])
  onClick(event: MouseEvent): void {
    const clickedInsideComponent = this._el.nativeElement.contains(event.target);

    if (!clickedInsideComponent) {
      if (this.isDatePickerActive) {
        this.showDatePicker();
      } else if (
        !this.isDatePickerActive &&
        this.selectedDateFormated &&
        this.selectedDateFormated !== this.previousSelectedDateFormated
      ) {
        this.writeDate();
        this.previousSelectedDateFormated = this.selectedDateFormated;
      } else if (!this.isDatePickerActive && this.selectedDateFormated === '') {
        this.clearDate();
      }
    }
  }

  /**
   * Prevent the calendar from closing by clicking on the drop-down menu
   */
  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }

  /**
   * Get styles of the selected day
   * @returns styles object
   */
  getStyleDay(day: number): { [key: string]: string } {
    return day === this.selectedDate.getDate() &&
      this.dateToStyle.getMonth() === this.selectedDate.getMonth() &&
      this.dateToStyle.getFullYear() === this.selectedDate.getFullYear()
      ? {
          color: '#641ee0',
          'background-color': '#f0e9fc',
          'border-radius': '15px',
          'font-weight': 'bold',
        }
      : {};
  }

  /**
   * Get styles of the selected year
   * @returns styles object
   */
  getStyleYear(year: number): { [key: string]: string } {
    return year === this.selectedDate.getFullYear()
      ? {
          color: '#641ee0',
          'background-color': '#f0e9fc',
          'border-radius': '12px',
          'font-weight': 'bold',
        }
      : {};
  }

  /**
   * Get styles of the selected month
   * @returns styles object
   */
  getStyleMonth(month: number): { [key: string]: string } {
    return month === this.selectedDate.getMonth()
      ? {
          color: '#641ee0',
          'background-color': '#f0e9fc',
          'border-radius': '12px',
          'font-weight': 'bold',
        }
      : {};
  }

  /**
   * Controls whether input is focused
   */
  setFocus(isFocused: boolean): void {
    this.isInputFocused = isFocused;
    if (!isFocused) {
      this.control?.setValue(this.value);
      this.onTouched();
    }
  }

  /**
   * Controls that the user can only type in numbers
   */
  onKeyPress(event: KeyboardEvent): void {
    // Allow numbers (ASCII codes between 48 and 57) and the slash "/"
    if ((event.charCode < 48 || event.charCode > 57) && event.charCode !== 47) {
      event.preventDefault();
    }
  }

  /**
   * Controls the hover of the input and icon calendar
   */
  onInputHover(isHovered: boolean) {
    this.isInputHovered = isHovered;
  }

  /**
   * We set the controls for the component and be able to use them.
   */
  setControl(): void {
    const injectedControl = this.injector.get(NgControl);
    switch (injectedControl.constructor) {
      case NgModel: {
        const { control, update } = injectedControl as NgModel;
        this.control = control;
        this.control.valueChanges
          .pipe(
            tap((value) => {
              update.emit(value);
            }),
            takeUntil(this.destroy)
          )
          .subscribe();
        break;
      }
      case FormControlName: {
        this.control = this.injector
          .get(FormGroupDirective)
          .getControl(injectedControl as FormControlName);
        break;
      }
      default: {
        this.control = (injectedControl as FormControlDirective).form as FormControl;
        break;
      }
    }
  }
}
