// Componente Input — adaptado de Nter-lib
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  Inject,
  Injector,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
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

import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { DirectivesModule } from '../core/directives/directives.module';
import { PipesModule } from '../core/pipes/pipes.module';
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
    DirectivesModule,
    FormsModule,
    PipesModule,
    ReactiveFormsModule,
  ],
  templateUrl: './cap-input.component.html',
  styleUrl: './cap-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CapInputComponent),
      multi: true,
    },
  ],
})
export class CapInputComponent {
  /**
   * Nombre del input HTML
   *
   * @required
   */
  @Input() name: string;

  /**
   * Etiqueta opcional del input
   */
  @Input() label: string;

  /**
   * Valor por defecto opcional del input
   */
  @Input() defaultValue: string;

  /**
   * Estado del input
   */
  @Input() disabled = false;

  /**
   * Placeholder opcional del input
   */
  @Input() placeholder = '';

  /**
   * Texto de ayuda opcional
   */
  @Input() helper: string;

  /**
   * Configuracion opcional del tooltip, si es true se muestra siempre, pero solo si no tiene valor.
   */
  @Input() tooltipPermanent = false;

  /**
   * Titulo opcional del tooltip
   */
  @Input() tooltipTitle: string;

  /**
   * Texto opcional del tooltip
   */
  @Input() tooltipText: string;

  /**
   * Alineacion opcional del tooltip
   */
  @Input() tooltipAlign: AlignVariant;

  /**
   * Orientacion vertical opcional del tooltip
   */
  @Input() tooltipVertical: boolean;

  /**
   * Vista modal opcional del tooltip
   */
  @Input() tooltipModal = true;

  /**
   * Limite de longitud opcional del input (65 por defecto por seguridad)
   */
  @Input() maxLength = 65;

  /**
   * Propiedad opcional para mostrar el input en dos lineas si el valor es muy largo
   */
  @Input() multiline = false;

  /**
   * Prefijo visual no editable opcional
   */
  @Input() prefix: string;

  /**
   * Sufijo visual no editable opcional
   */
  @Input() suffix: string;

  /**
   * Mensajes de error personalizados opcionales para validadores.
   * Las claves permitidas son las mismas que se usan en la clase Validators de @angular/forms
   * o validadores personalizados propios.
   *
   * Ejemplo:
   *
   * const control = new FormControl(1, [Validators.max(5), Validators.min(1)]);
   * const errorMessages = { max: 'El valor maximo es 5', min: 'El valor minimo es 1' };
   */
  @Input() errorMessages: { [key: string]: string };

  /**
   * Ancho opcional del input (300px por defecto). Se puede establecer cualquier valor CSS valido
   */
  @Input() @HostBinding('style.width') width = '300px';

  /**
   * Tamano del input
   */
  @Input() size: 'standard' | 'small' = 'standard';

  /**
   * Variante de comportamiento personalizada opcional
   */
  @Input() variant: 'standard' | 'clear' = 'standard';

  /**
   * Tipo del input
   */
  @Input() type: 'text' | 'number' | 'password' = 'text';

  /**
   * Comportamiento personalizado opcional
   */
  @Input() customBehaviour: 'IBAN' | 'password';

  /**
   * Clase personalizada opcional para la etiqueta o el input/textarea
   */
  @Input() customClass: Record<string, string>;

  /**
   * Evento emitido cuando el valor del input cambia
   */
  @Output() inputChage = new EventEmitter<unknown>();

  @ViewChild('textarea') textarea: ElementRef;
  @ViewChild('fieldContainer') fieldContainer: ElementRef;

  private innerValue = '';

  componentId!: string;

  destroy = new Subject<boolean>();
  control: FormControl;
  showPassword = false;
  showIBAN = false;
  fieldOnFocus = false;
  touched = true;

  /** Variables para la validacion del campo tipo password cuando la validacion esta activa */
  checkLength = false;
  oneDigit = new RegExp(/^((?=.*\d))/);
  checkOneDigit = false;
  oneMin = new RegExp(/^((?=.*[a-z]))/);
  checkOneMin = false;
  oneCap = new RegExp(/^((?=.*[A-Z]))/);
  checkOneCap = false;
  passwordValid = true;

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(
    @Inject(Injector) private injector: Injector,
    private dynamicCssService: DynamicCssService
  ) {}

  get value(): string {
    return this.innerValue;
  }

  set value(value: string) {
    if (this.innerValue !== value) {
      this.innerValue = value;
      this.onTouched();
    }
  }

  /** Establecemos los controles e inyectamos el control para la validacion del IBAN. */
  ngOnInit(): void {
    this.componentId = this.dynamicCssService.generateComponentId();
    this.setControl();
    if (this.control && this.customBehaviour === 'IBAN') {
      this.control.setValidators(this.IBANValidator());
      this.errorMessages = {
        iban: 'El IBAN introducido no es válido: ES00 0000 0000 00 0000000000',
        ...this.errorMessages,
      };
    }
  }

  /** Establecer el valor por defecto si existe */
  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.defaultValue) {
        this.writeValue(this.defaultValue);
        this.onChange(this.defaultValue);
      }
    }, 0);

    this.createDyamicClasses();
  }

  private createDyamicClasses() {
    if (Object.keys(this.customClass).length > 0) {
      this.dynamicCssService.createMultipleDynamicClasses(
        [
          {
            className: 'cap-input__label-custom',
            cssContent: this.customClass.hasOwnProperty('label')
              ? this.customClass['label']
              : '',
          },
          {
            className: 'cap-input__field-custom',
            cssContent: this.customClass.hasOwnProperty('input')
              ? this.customClass['input']
              : '',
          },
        ],
        this.componentId
      );
    }
  }

  /** Modificamos los estilos de la funcion multiline en funcion del valor introducido. */
  ngAfterViewChecked(): void {
    if (this.textarea) {
      if (!this.value) {
        this.fieldContainer.nativeElement.style.height = null;
        this.textarea.nativeElement.style.height = null;
      } else {
        this.fieldContainer.nativeElement.style.height = 'auto';
        this.textarea.nativeElement.style.height = 'auto';
        this.fieldContainer.nativeElement.style.height = `${this.textarea.nativeElement.scrollHeight}px`;
        this.textarea.nativeElement.style.height = `${this.textarea.nativeElement.scrollHeight}px`;
      }
    } else {
      this.fieldContainer.nativeElement.style.height = null;
    }
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.complete();
  }

  /** Metodos ControlValueAccessor - INICIO */

  handleInput(value: string): void {
    this.innerValue = value;
    this.onTouched();
    this.onChange(this.value);
    this.inputChage.emit(this.value);
  }

  handleFocus(): void {
    this.fieldOnFocus = true;
    this.showIBAN = true;
    if (this.customBehaviour === 'password') this.control.setErrors(null);
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
    if (this.customBehaviour === 'password' && !this.passwordValid && this.value !== '') {
      this.control.setErrors({ noValid: 'noValid' });
    }
  }

  writeValue(value: string): void {
    if (value !== this.innerValue) {
      this.innerValue = value;
      this.fieldOnFocus = false;
    }
    if (value === null) {
      this.innerValue = '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /** Metodos ControlValueAccessor - FIN */

  /** Establecemos los controles dependiendo del tipo de integracion de nuestro componente */
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

  clickOutside(): void {
    this.fieldOnFocus = false;
  }

  /** Metodos de los botones del input */

  handleShow(): void {
    this.showPassword = !this.showPassword;
    this.showIBAN = this.customBehaviour === 'IBAN' ? !this.showIBAN : false;
  }

  handleClear(): void {
    this.fieldOnFocus = false;
    this.control?.setValue(this.value);

    this.handleInput('');

    if (this.customBehaviour === 'password') {
      this.checkLength = false;
      this.checkOneCap = false;
      this.checkOneDigit = false;
      this.checkOneMin = false;
    }
  }

  handleKeyUp(value: string): void {
    if (this.customBehaviour === 'password') this.passwordValidation(value);
  }

  /** Validacion de contrasena en customBehaviour tipo: password */
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

  /** Metodos IBAN - INICIO */

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

  /** Metodos IBAN - FIN */
}
