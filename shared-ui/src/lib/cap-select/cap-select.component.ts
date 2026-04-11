/**
 * Componente selector desplegable reutilizable — adaptado de Nter-lib.
 * Selector: 'cap-select'
 */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  HostBinding,
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
import { DirectivesModule } from '../core/directives/directives.module';
import { SelectOption } from '../core/models/components.models';
import { CapButtonComponent } from '../cap-button/cap-button.component';

@Component({
  selector: 'cap-select',
  standalone: true,
  imports: [
    CommonModule,
    CapButtonComponent,
    DirectivesModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './cap-select.component.html',
  styleUrl: './cap-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CapSelectComponent),
      multi: true,
    },
  ],
})
export class CapSelectComponent {
  /**
   * Selector options
   *
   * @required
   */
  @Input() options: SelectOption[];

  /**
   * Name of the HTML select
   *
   * @required
   */
  @Input() name: string;

  /**
   * Optional select label
   */
  @Input() label: string;

  /**
   * Select status
   */
  @Input() disabled = false;

  /**
   * Input type
   */
  @Input() type: 'text' | 'number' = 'text';

  /**
   * Optional select placeholder
   */
  @Input() placeholder = '';

  /**
   * Optional select helper text
   */
  @Input() helper: string;

  /**
   * Optional select default value
   */
  @Input() defaultValue: string;

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
   * Optional slect width (300px by default). You can set any valid CSS value
   */
  @Input() @HostBinding('style.width') width = '300px';

  /**
   * Select size
   */
  @Input() size: 'standard' | 'small' = 'standard';

  /**
   * Select size autoscroll
   */
  @Input() sizeAutoscroll: number;

  /**
   * Options all option in select
   */
  @Input() allOption = false;

  /**
   * Options all option in select
   */
  @Input() everAllOption = false;

  /**
   * Options all option in select
   */
  @Input() shortDropdown = false;

  /**
   * Selector field gender
   */
  @Input() gender: 'f' | 'm' = 'm';

  /**
   * Sort all options alphabetically
   */
  @Input() alphabetical = true;

  /**
   * Options description
   */
  @Input() description = false;

  /**
   * Include options description on autocomplete filter
   */
  @Input() descriptionFilter = false;

  /**
   * Select autocomplete type 'starts with...' or 'includes...'
   */
  @Input() predictiveType: 'contains' | 'start' | 'none' = 'none';

  /**
   * Output object when selector value is changed
   */
  @Output() selectChange = new EventEmitter<SelectOption>();

  /**
   * Input only necessary for the complete visualization of the selector in the storybook.
   */
  @Input() story = false;

  private innerValue: SelectOption = null;
  control: FormControl;

  destroy = new Subject<boolean>();

  fieldOnFocus = false;
  touched = false;
  backupOptions: SelectOption[];
  displayOptions: SelectOption[];
  dropdownSize = 7;
  unfold = false;

  constructor(@Inject(Injector) private injector: Injector) {}

  ngOnInit(): void {
    this.setControl();
    this.cleanAllOptionDuplicate();
    this.backupOptions = this.options;

    if (this.shortDropdown) this.dropdownSize = 4;

    this.initOptions();
  }

  ngAfterViewChecked(): void {
    if (!this.unfold && this.backupOptions !== this.options) {
      this.initOptions();
      this.backupOptions = this.options;
    }
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.complete();
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  get value(): SelectOption {
    return this.innerValue;
  }

  set value(value: SelectOption) {
    if (this.innerValue !== value) {
      this.innerValue = value;
    }
  }

  handleSelector(value: any): void {
    this.innerValue = value;
    this.onChange(this.value);
  }

  handleFocus(): void {
    this.fieldOnFocus = true;
    this.unfold = true;
    setTimeout(() => {
      this.autoScrollSelected();
    }, 10);
  }

  handleBlur(event: FocusEvent): void {
    if (!event.relatedTarget) {
      this.fieldOnFocus = false;
      this.control?.setValue(this.value);
    }
    this.onTouched();
  }

  writeValue(value: SelectOption): void {
    if (value !== this.innerValue) {
      if (!value) {
        this.uncheckAll();
      } else {
        this.setCheckValue(value.label);
      }
      this.innerValue = value;
      this.fieldOnFocus = false;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(disabled: boolean): void {
    this.disabled = disabled;
  }

  controlInputValue(value: SelectOption | string): boolean {
    if (typeof value === 'object' && !!value) {
      return true;
    }
    return false;
  }

  /**
   * Function that initializes the selector with the options provided by the input,
   * sets the @default, @allOptions and sorts @alphabetically if necessary.
   * Used when detecting option changes and loading the component.
   */
  initOptions(): void {
    if (this.alphabetical) {
      this.options = this.options?.sort((a, b) => a.label.localeCompare(b.label));
    }

    this.displayDefaultValue();

    if (this.allOption && (this.options?.length > 1 || this.everAllOption))
      this.icludeAllOption();

    this.displayOptions = this.options;
  }

  /**
   * Control the selection action.
   * @param _event
   * @param option
   */
  selectOption(_event: Event, option: SelectOption): void {
    if (option.checked) {
      this.uncheckAll();
      this.handleSelector(null);
      this.selectChange.emit(null);
    } else {
      this.options.forEach((item) => {
        if (item.value === option.value) item.checked = true;
        else item.checked = false;
      });
      this.handleSelector(option);
      this.selectChange.emit(option);
      this.fieldOnFocus = false;
      this.unfold = false;
      this.displayOptions = this.options;
    }
  }

  /** Method to uncheck all objects in options. */
  uncheckAll(): void {
    this.options?.forEach((item) => (item.checked = false));
  }

  /** Method to set default option if exist in options array. */
  displayDefaultValue() {
    setTimeout(() => {
      const even = (element) => element.label === this.defaultValue;
      const someSelected = this.options?.some(even);
      if (someSelected) {
        const defaultOption = this.options.find(even);
        defaultOption.checked = true;
        this.handleSelector(defaultOption);
        this.selectChange.emit(defaultOption);
        this.onChange(defaultOption);
      }
    }, 0);
  }

  /** Method to mark the selection in the list when we perform a .setValue() in reactive forms */
  setCheckValue(label: string): void {
    if (label) {
      this.options.forEach((item) => {
        if (item.label === label) item.checked = true;
        else item.checked = false;
      });
      this.displayOptions = this.options;
    }
  }

  /**
   * Function for filtering the selector options, being able to filter by content or beginning in addition to adding the description,
   * all controlled by the corresponding inputs.
   * @param event
   */
  filterOptions(event: KeyboardEvent, shearch: string): void {
    this.unfold = true;
    const args = shearch.toLowerCase();
    if (event && this.predictiveType !== 'none' && !!this.value) {
      switch (this.predictiveType) {
        case 'contains':
          this.descriptionFilter
            ? (this.displayOptions = this.options.filter((item: SelectOption) => {
                return (
                  item.label.toLowerCase().includes(args) ||
                  item.description.toLowerCase().includes(args)
                );
              }))
            : (this.displayOptions = this.options.filter((item: SelectOption) => {
                return item.label.toLowerCase().includes(args);
              }));
          break;
        case 'start':
          this.descriptionFilter
            ? (this.displayOptions = this.options.filter((item: SelectOption) => {
                return (
                  item.label.toLowerCase().startsWith(args) ||
                  item.description.toLowerCase().startsWith(args)
                );
              }))
            : (this.displayOptions = this.options.filter((item: SelectOption) => {
                return item.label.toLowerCase().startsWith(args);
              }));
          break;
      }
    }
    if (this.value === null) {
      this.displayOptions = this.options;
    }
  }

  /** If we have the input of all the options we include the object when starting the component */
  icludeAllOption(): void {
    const todas: SelectOption = {
      label: 'Todas',
      value: 'todas',
      description: 'allOptions',
      checked: false,
    };

    const todos: SelectOption = {
      label: 'Todos',
      value: 'todos',
      description: 'allOptions',
      checked: false,
    };
    switch (this.gender) {
      case 'f':
        this.options.unshift(todas);
        break;
      case 'm':
        this.options.unshift(todos);
        break;
    }
  }

  /** Controls the display of the placeholder depending on the display of the options */
  placeholderSelector(): string {
    return this.unfold && this.fieldOnFocus ? this.placeholder : '';
  }

  /** If the policy detects a click outside the selector */
  clickOutside() {
    this.unfold = false;
    let selected: SelectOption;

    this.options?.forEach((item) => {
      if (item.checked) selected = item;
    });

    if (selected) {
      this.handleSelector(selected);
      this.displayOptions = this.options;
    } else {
      this.handleSelector(null);
      this.displayOptions = this.options;
    }
    if (!this.value) this.fieldOnFocus = false;
  }

  /** Input Buttons Metods */

  /** Selector cleaning button */
  handleClear(): void {
    this.uncheckAll();
    this.displayOptions = this.options;
    this.handleSelector(null);
    this.selectChange.emit(null);
    this.control?.setValue(this.value);
  }

  /** Expand or collect selector options */
  handleUnfold(): void {
    this.unfold = !this.unfold;
    setTimeout(() => {
      if (this.unfold) this.autoScrollSelected();
    }, 10);
    this.unfold ? (this.fieldOnFocus = true) : (this.fieldOnFocus = false);
    if (!this.unfold) this.onTouched();
  }

  /**
   * Function which centers the scroll of our selector to the selected option.
   */
  autoScrollSelected(): void {
    const dropdown = document.getElementById('dropdown');
    const index = this.options.findIndex(function (item) {
      return item.checked;
    });
    const distance = this.sizeAutoscroll
      ? this.sizeAutoscroll
      : !this.description
        ? 380
        : 500;

    if (index !== -1 && index >= 3) {
      const selected = document.getElementById('checked');
      const position = selected.getBoundingClientRect().top;
      dropdown.scrollTo({
        top: position - distance,
        behavior: 'smooth',
      });
    }
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

  /**
   * Function only for correct duplicates of All option.
   */
  cleanAllOptionDuplicate(): void {
    const index = this.options?.findIndex(function (item) {
      return item.description === 'allOptions';
    });
    if (index !== -1) {
      this.options?.splice(index, 1);
    }
  }
}
