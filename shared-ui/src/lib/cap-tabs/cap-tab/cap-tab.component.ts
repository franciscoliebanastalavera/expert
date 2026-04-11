// Componente Tab individual — adaptado de Nter-lib
import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'cap-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cap-tab.component.html',
  styleUrls: ['./cap-tab.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CapTabComponent),
      multi: true,
    },
  ],
})
export class CapTabComponent {
  /**
   * Etiqueta opcional de la pestana
   */
  @Input() label: string;

  /**
   * Activador opcional de la pestana
   */
  @Input() active = false;

  /**
   * Deshabilitador opcional de la pestana
   */
  @Input() disabled = false;
}
