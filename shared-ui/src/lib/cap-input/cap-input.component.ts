import { CommonModule } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  forwardRef,
  Inject,
  inject,
  Injector,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormControlDirective,
  FormControlName,
  FormGroupDirective,
  FormsModule,
  NG_VALUE_ACCESSOR,
  NgControl,
  NgModel,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

import { tap } from 'rxjs/operators';
import { ClickOutsideDirective } from '../core/directives/click-outside.directive';
import { IbanPipe } from '../core/pipes/iban.pipe';
import { AlignVariant } from '../core/types/components.types';
import { CapButtonComponent } from '../cap-button/cap-button.component';
import { CapTooltipComponent } from '../cap-tooltip/cap-tooltip.component';
import { DynamicCssService } from '../services/dynamic-css.service';

@Component({
  selector: 'cap-input',
  standalone: true,
  imports: [
    CommonModule,
    CapButtonComponent,
    CapTooltipComponent,
    ClickOutsideDirective,
    FormsModule,
    IbanPipe,
    ReactiveFormsModule,
  ],
  templateUrl: './cap-input.component.html',
  styleUrl: './cap-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.width]': 'width()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CapInputComponent),
      multi: true,
    },
  ],
})
export class CapInputComponent {
  readonly name = input<string>('');
  readonly label = input<string>('');
  readonly defaultValue = input<string>('');
  readonly disabled = input(false);
  readonly placeholder = input('');
  readonly helper = input<string>('');
  readonly tooltipPermanent = input(false);
  readonly tooltipTitle = input<string>('');
  readonly tooltipText = input<string>('');
  readonly tooltipAlign = input<AlignVariant>('center');
  readonly tooltipVertical = input<boolean>(false);
  readonly tooltipModal = input(true);
  readonly maxLength = input(65);
  readonly multiline = input(false);
  readonly prefix = input<string>('');
  readonly suffix = input<string>('');
  readonly errorMessages = model<{ [key: string]: string }>({});
  readonly width = input('300px');
  readonly size = input<'standard' | 'small' | 'medium'>('standard');
  readonly variant = input<'standard' | 'clear' | 'minimal'>('standard');
  readonly fontFamily = input<'default' | 'monospace'>('default');
  readonly type = input<'text' | 'number' | 'password'>('text');
  readonly customBehaviour = input<'IBAN' | 'password' | undefined>(undefined);
  readonly customClass = input<Record<string, string>>({});

  readonly inputChage = output<string>();

  readonly textarea = viewChild<ElementRef>('textarea');
  readonly fieldContainer = viewChild.required<ElementRef>('fieldContainer');

  private readonly innerValueSignal = signal<string>('');

  componentId!: string;

  private readonly destroyRef = inject(DestroyRef);
  control!: FormControl;
  showPassword = false;
  showIBAN = false;
  fieldOnFocus = false;
  touched = true;

  checkLength = false;
  oneDigit = new RegExp(/^((?=.*\d))/);
  checkOneDigit = false;
  oneMin = new RegExp(/^((?=.*[a-z]))/);
  checkOneMin = false;
  oneCap = new RegExp(/^((?=.*[A-Z]))/);
  checkOneCap = false;
  passwordValid = true;

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  constructor(
    @Inject(Injector) private injector: Injector,
    private dynamicCssService: DynamicCssService
  ) {}

  get value(): string {
    return this.innerValueSignal();
  }

  set value(value: string) {
    if (this.innerValueSignal() !== value) {
      this.innerValueSignal.set(value);
      this.onTouched();
    }
  }

  ngOnInit(): void {
    if (this.variant() !== 'minimal') {
      this.componentId = this.dynamicCssService.generateComponentId();
    }
    this.setControl();
    if (this.control && this.customBehaviour() === 'IBAN') {
      this.control.setValidators(this.IBANValidator());
      this.errorMessages.update((current) => ({
        iban: 'El IBAN introducido no es válido: ES00 0000 0000 00 0000000000',
        ...current,
      }));
    }
  }

  ngAfterViewInit(): void {
    afterNextRender(
      () => {
        const defaultValue = this.defaultValue();
        if (defaultValue) {
          this.writeValue(defaultValue);
          this.onChange(defaultValue);
        }
      },
      { injector: this.injector },
    );

    if (this.variant() !== 'minimal') {
      this.createDyamicClasses();
    }
  }

  private createDyamicClasses() {
    const customClass = this.customClass();
    if (Object.keys(customClass).length > 0) {
      this.dynamicCssService.createMultipleDynamicClasses(
        [
          {
            className: 'cap-input__label-custom',
            cssContent: customClass.hasOwnProperty('label')
              ? customClass['label']
              : '',
          },
          {
            className: 'cap-input__field-custom',
            cssContent: customClass.hasOwnProperty('input')
              ? customClass['input']
              : '',
          },
        ],
        this.componentId
      );
    }
  }

  ngAfterViewChecked(): void {
    if (this.variant() === 'minimal') {
      return;
    }
    const textarea = this.textarea();
    const fieldContainer = this.fieldContainer();
    if (textarea) {
      if (!this.value) {
        fieldContainer.nativeElement.style.height = null;
        textarea.nativeElement.style.height = null;
      } else {
        fieldContainer.nativeElement.style.height = 'auto';
        textarea.nativeElement.style.height = 'auto';
        fieldContainer.nativeElement.style.height = `${textarea.nativeElement.scrollHeight}px`;
        textarea.nativeElement.style.height = `${textarea.nativeElement.scrollHeight}px`;
      }
    } else {
      fieldContainer.nativeElement.style.height = null;
    }
  }

  handleInput(value: string): void {
    this.innerValueSignal.set(value);
    this.onTouched();
    this.onChange(this.value);
    this.inputChage.emit(this.value);
  }

  handleFocus(): void {
    this.fieldOnFocus = true;
    this.showIBAN = true;
    if (this.customBehaviour() === 'password') this.control.setErrors(null);
  }

  handleBlur(event: FocusEvent): void {
    if (!event.relatedTarget) {
      this.fieldOnFocus = false;
      this.control?.setValue(this.value);
      this.onTouched();
    }
    if (this.showIBAN) {
      this.showIBAN = false;
    }
    if (this.customBehaviour() === 'password' && !this.passwordValid && this.value !== '') {
      this.control.setErrors({ noValid: 'noValid' });
    }
  }

  writeValue(value: string): void {
    const next = value ?? '';
    if (this.innerValueSignal() !== next) {
      this.innerValueSignal.set(next);
      this.fieldOnFocus = false;
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
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

  clickOutside(): void {
    this.fieldOnFocus = false;
  }

  handleShow(): void {
    this.showPassword = !this.showPassword;
    this.showIBAN = this.customBehaviour() === 'IBAN' ? !this.showIBAN : false;
  }

  handleClear(): void {
    this.fieldOnFocus = false;
    this.control?.setValue(this.value);

    this.handleInput('');

    if (this.customBehaviour() === 'password') {
      this.checkLength = false;
      this.checkOneCap = false;
      this.checkOneDigit = false;
      this.checkOneMin = false;
    }
  }

  handleKeyUp(value: string): void {
    if (this.customBehaviour() === 'password') this.passwordValidation(value);
  }

  passwordValidation(value: string): void {
    this.checkLength = value.length < 8 ? false : true;
    this.checkOneDigit = this.oneDigit.test(value);
    this.checkOneCap = this.oneCap.test(value);
    this.checkOneMin = this.oneMin.test(value);

    const passwordChecker: boolean[] = [
      this.checkLength,
      this.checkOneCap,
      this.checkOneDigit,
      this.checkOneMin,
    ];

    this.passwordValid = passwordChecker.every((element) => element);
  }

  IBANValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = this.checkIBAN(control.value);
      return forbidden ? { iban: { value: control.value } } : null;
    };
  }

  checkIBAN(IBAN: string): boolean {
    const IBANregex = /([ES]{2})\s*(\d{2})\s*(\d{4})\s*(\d{4})\s*(\d{2})\s*(\d{10})/g;
    if (!IBANregex.test(IBAN) || IBAN.replace(/ /g, '').length !== 24) {
      return true;
    }

    const parsedIBAN = IBAN.toUpperCase().replace(/ /g, '');

    const firstLetter = parsedIBAN.substring(0, 1);
    const secondLetter = parsedIBAN.substring(1, 2);
    const firstNumberCode = this.getnumIBAN(firstLetter);
    const secondNumberCode = this.getnumIBAN(secondLetter);

    let auxIBAN = `${String(firstNumberCode)}${String(
      secondNumberCode
    )}${parsedIBAN.substring(2)}`;
    auxIBAN = `${auxIBAN.substring(6)}${auxIBAN.substring(0, 6)}`;

    return this.mod97(auxIBAN) !== 1;
  }

  mod97(iban: string): number {
    const parts = Math.ceil(iban.length / 7);
    let remainer = 0;
    for (let i = 1; i <= parts; i++) {
      remainer = parseFloat(remainer + iban.substring((i - 1) * 7, (i - 1) * 7 + 7)) % 97;
    }
    return remainer;
  }

  getnumIBAN(letter: string): number {
    const ls_letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return ls_letters.search(letter) + 10;
  }
}
