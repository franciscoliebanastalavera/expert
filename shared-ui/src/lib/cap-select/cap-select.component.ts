import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  Inject,
  inject,
  Injector,
  Input,
  Output,
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
  @Input() options: SelectOption[];

  @Input() name: string;

  @Input() label: string;

  @Input() disabled = false;

  @Input() type: 'text' | 'number' = 'text';

  @Input() placeholder = '';

  @Input() helper: string;

  @Input() defaultValue: string;

  @Input() errorMessages: { [key: string]: string };

  @Input() @HostBinding('style.width') width = '300px';

  @Input() size: 'standard' | 'small' = 'standard';

  @Input() sizeAutoscroll: number;

  @Input() allOption = false;

  @Input() everAllOption = false;

  @Input() shortDropdown = false;

  @Input() gender: 'f' | 'm' = 'm';

  @Input() alphabetical = true;

  @Input() description = false;

  @Input() descriptionFilter = false;

  @Input() predictiveType: 'contains' | 'start' | 'none' = 'none';

  @Output() selectChange = new EventEmitter<SelectOption>();

  @Input() story = false;

  private innerValue: SelectOption | string | null = null;
  control: FormControl;

  private readonly destroyRef = inject(DestroyRef);

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

  onChange: (value: SelectOption | string | null) => void = () => {};
  onTouched: () => void = () => {};

  get value(): SelectOption | string | null {
    return this.innerValue;
  }

  set value(value: SelectOption | string | null) {
    if (this.innerValue !== value) {
      this.innerValue = value;
    }
  }

  handleSelector(value: SelectOption | string | null): void {
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

  registerOnChange(fn: (value: SelectOption) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(disabled: boolean): void {
    this.disabled = disabled;
  }

  controlInputValue(value: SelectOption | string | null): boolean {
    return typeof value === 'object' && !!value;
  }

  getValueLabel(): string {
    if (typeof this.value === 'object' && this.value !== null) {
      return this.value.label?.toString() ?? '';
    }
    return typeof this.value === 'string' ? this.value : '';
  }

  initOptions(): void {
    if (this.alphabetical) {
      this.options = this.options?.sort((a, b) => a.label.localeCompare(b.label));
    }

    this.displayDefaultValue();

    if (this.allOption && (this.options?.length > 1 || this.everAllOption))
      this.icludeAllOption();

    this.displayOptions = this.options;
  }

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

  uncheckAll(): void {
    this.options?.forEach((item) => (item.checked = false));
  }

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

  setCheckValue(label: string): void {
    if (label) {
      this.options.forEach((item) => {
        if (item.label === label) item.checked = true;
        else item.checked = false;
      });
      this.displayOptions = this.options;
    }
  }

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

  placeholderSelector(): string {
    return this.unfold && this.fieldOnFocus ? this.placeholder : '';
  }

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

  handleClear(): void {
    this.uncheckAll();
    this.displayOptions = this.options;
    this.handleSelector(null);
    this.selectChange.emit(null);
    this.control?.setValue(this.value);
  }

  handleUnfold(): void {
    this.unfold = !this.unfold;
    setTimeout(() => {
      if (this.unfold) this.autoScrollSelected();
    }, 10);
    this.unfold ? (this.fieldOnFocus = true) : (this.fieldOnFocus = false);
    if (!this.unfold) this.onTouched();
  }

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

  cleanAllOptionDuplicate(): void {
    const index = this.options?.findIndex(function (item) {
      return item.description === 'allOptions';
    });
    if (index !== -1) {
      this.options?.splice(index, 1);
    }
  }
}
