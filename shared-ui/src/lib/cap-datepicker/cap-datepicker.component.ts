import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  forwardRef,
  HostListener,
  Inject,
  inject,
  Injector,
  input,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { tap } from 'rxjs/operators';

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
  readonly size = input<'small' | 'standard'>('small');
  readonly label = input<string>('');
  readonly helper = input<string>('');
  readonly errorMessages = input<{ [key: string]: string }>({});
  readonly today = input(false);
  readonly invertHorizontal = input(false);

  readonly date = output<Date | null>();
  isDatePickerActive = false;
  isDayActive = false;
  isYearsActive = false;
  isMonthActive = false;
  selectedDate: Date = new Date();
  dateToStyle: Date = new Date();
  selectedDateFormated: string;
  previousSelectedDateFormated: string;
  currentYear: number;
  currentMonth: number;
  daysInMonth: number[] = [];
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
  daysWeek: string[] = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];
  years: number[] = [];
  startingDay: number;
  isInputFocused = false;
  isInputHovered = false;
  height = '36px';
  disabled = false;

  private readonly destroyRef = inject(DestroyRef);
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

  setHeight(): void {
    if (this.size() === 'small') {
      this.height = '36px';
    } else if (this.size() === 'standard') {
      this.height = '48px';
    }
  }

  setToday() {
    if (this.today()) {
      this.selectedDateFormated = this._datePipeService.transform(
        this.selectedDate,
        'dd/MM/yyyy'
      );
      this.handleDate(this.selectedDate);
    }
  }

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

  clearDate(): void {
    this.selectedDateFormated = null;
    this.handleDate(null);
    this.resetDatePicker();
  }

  getYears(currentYear: number): void {
    const previousYears = Array.from(
      { length: 8 },
      (_, index) => currentYear - 8 + index
    );
    const laterYears = Array.from({ length: 8 }, (_, index) => currentYear + index);

    this.years = previousYears.concat(laterYears);
  }

  calculateDaysInMonth(): void {
    this.currentYear = this.selectedDate.getFullYear();
    this.currentMonth = this.selectedDate.getMonth();

    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1).getDay();
    this.startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    this.daysInMonth = Array.from({ length: daysInMonth + this.startingDay }, (_, i) =>
      i < this.startingDay ? null : i - this.startingDay + 1
    );
  }

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

  changeMonth(offset: number): void {
    this.selectedDate.setMonth(this.selectedDate.getMonth() + offset);
    this.calculateDaysInMonth();
  }

  setYear(year: number): void {
    this.selectedDate.setFullYear(year);
    this.calculateDaysInMonth();
  }

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

  changeYear(offset: number): void {
    offset === 1
      ? this.selectedDate.setFullYear(this.selectedDate.getFullYear() + 1)
      : this.selectedDate.setFullYear(this.selectedDate.getFullYear() - 1);
    this.calculateDaysInMonth();
  }

  setMonth(month: number): void {
    this.selectedDate.setMonth(month);
    this.calculateDaysInMonth();
  }

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

  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }

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

  setFocus(isFocused: boolean): void {
    this.isInputFocused = isFocused;
    if (!isFocused) {
      this.control?.setValue(this.value);
      this.onTouched();
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if ((event.charCode < 48 || event.charCode > 57) && event.charCode !== 47) {
      event.preventDefault();
    }
  }

  onInputHover(isHovered: boolean) {
    this.isInputHovered = isHovered;
  }

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
            takeUntilDestroyed(this.destroyRef)
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
